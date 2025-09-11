'use client'

// @ts-nocheck
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as THREE from 'three'

import dayImg from '@/assets/img/world-day.jpg'
import nightImg from '@/assets/img/world-night.jpg'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const fragmentShader = `
precision highp float;

varying vec2 vUv;
varying vec3 vWorldNormal;

uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform vec3 sunDirection; // можна прибрати пізніше, якщо хочеш без сонця взагалі

// sRGB <-> linear
vec3 srgbToLinear(vec3 c){ return pow(c, vec3(2.2)); }
vec3 linearToSrgb(vec3 c){ return pow(max(c, 0.0), vec3(1.0/2.2)); }

void main() {
  // Переорієнтація текстур
  vec2 uv = vec2(1.0 - vUv.x, vUv.y);

  vec3 dayCol   = srgbToLinear(texture2D(dayTexture,   uv).rgb) ; // яскравіший день
  vec3 nightCol = srgbToLinear(texture2D(nightTexture, uv).rgb) * 1.15; // більше світла вночі

  // Ламбертівське освітлення
  vec3 N = normalize(vWorldNormal);
  vec3 L = normalize(sunDirection);

  float ndl = max(dot(N, L), 0.0);
  float dayFactor = smoothstep(0.05, 0.35, ndl); // м’який перехід
  float nightFactor = 1.0 - dayFactor;

  // Колір без specular
  vec3 colorLinear = mix(nightCol, dayCol, dayFactor);

  gl_FragColor = vec4(linearToSrgb(colorLinear), 1.0);
}

`

// Атмосфера (окремий шейдер/меш з additive blending)
const atmoVertex = `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const atmoFragment = `
precision highp float;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;

// простий рімлайт відносно глядача
void main() {
  vec3 V = normalize(cameraPosition - vWorldPos);
  float rim = 1.0 - max(dot(normalize(vWorldNormal), V), 0.0);
  rim = pow(rim, 1.5);
  vec3 glow = vec3(0.35, 0.55, 1.0) * rim;
  gl_FragColor = vec4(glow, rim * 0.5);
}
`

export const Earth = () => {
	const containerRef = useRef<HTMLDivElement | null>(null)

	const rafRef = useRef<number | null>(null)
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
	const sceneRef = useRef<THREE.Scene | null>(null)
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
	const groupRef = useRef<THREE.Group | null>(null)
	const materialRef = useRef<THREE.ShaderMaterial | null>(null)
	const atmoMatRef = useRef<THREE.ShaderMaterial | null>(null)
	const geoRef = useRef<THREE.SphereGeometry | null>(null)
	const dayTexRef = useRef<THREE.Texture | null>(null)
	const nightTexRef = useRef<THREE.Texture | null>(null)

	useEffect(() => {
		const container = containerRef.current!
		while (container.firstChild) container.removeChild(container.firstChild)

		const getSize = () => {
			const rect = container.getBoundingClientRect()
			const s = Math.min(rect.width || 580, rect.height || 580)
			return { width: s, height: s }
		}
		const { width, height } = getSize()

		const scene = new THREE.Scene()
		sceneRef.current = scene

		const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
		camera.position.set(0, 0, 2.3)
		cameraRef.current = camera

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
		;(renderer as any).outputColorSpace = THREE.SRGBColorSpace
		renderer.toneMapping = THREE.NoToneMapping
		renderer.toneMappingExposure = 1.0
		renderer.setClearAlpha(0)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.setSize(width, height, false)
		container.appendChild(renderer.domElement)
		rendererRef.current = renderer

		const group = new THREE.Group()
		scene.add(group)
		groupRef.current = group

		const geometry = new THREE.SphereGeometry(1, 128, 128)
		geoRef.current = geometry

		const loader = new THREE.TextureLoader()
		const texturePromises = [
			new Promise<THREE.Texture>((resolve, reject) =>
				loader.load(
					typeof dayImg === 'string' ? dayImg : dayImg.src,
					resolve,
					undefined,
					reject
				)
			),
			new Promise<THREE.Texture>((resolve, reject) =>
				loader.load(
					typeof nightImg === 'string' ? nightImg : nightImg.src,
					resolve,
					undefined,
					reject
				)
			)
		]

		Promise.all(texturePromises).then(([dayTex, nightTex]) => {
			const anis = Math.min(8, renderer.capabilities.getMaxAnisotropy())
			const setSRGB = (tex: THREE.Texture) => {
				;(tex as any).colorSpace = THREE.SRGBColorSpace
				tex.anisotropy = anis
				tex.wrapS = tex.wrapT = THREE.RepeatWrapping
			}
			setSRGB(dayTex)
			setSRGB(nightTex)
			dayTexRef.current = dayTex
			nightTexRef.current = nightTex

			// напрямок Сонця у світових координатах (можеш крутити як хочеш)
			const sunDir = new THREE.Vector3(1, 0.2, 0).normalize()

			const material = new THREE.ShaderMaterial({
				vertexShader,
				fragmentShader,
				uniforms: {
					dayTexture: { value: dayTex },
					nightTexture: { value: nightTex },
					sunDirection: { value: sunDir }
				},
				transparent: false
			})
			material.toneMapped = false
			materialRef.current = material

			const earth = new THREE.Mesh(geometry, material)
			earth.rotation.z = THREE.MathUtils.degToRad(23.5) // нахил осі
			group.add(earth)

			// Атмосфера — трохи більша сфера, BackSide + additive
			const atmoMat = new THREE.ShaderMaterial({
				vertexShader: atmoVertex,
				fragmentShader: atmoFragment,
				transparent: true,
				blending: THREE.AdditiveBlending,
				depthWrite: false,
				side: THREE.BackSide
			})
			atmoMat.toneMapped = false
			atmoMatRef.current = atmoMat

			const atmo = new THREE.Mesh(
				new THREE.SphereGeometry(1.03, 128, 128),
				atmoMat
			)
			atmo.rotation.copy(earth.rotation)
			group.add(atmo)

			const animate = () => {
				// Обертання Землі (термінатор лишається фіксованим відносно sunDir)
				group.rotation.y += 0.0006
				renderer.render(scene, camera)
				rafRef.current = requestAnimationFrame(animate)
			}
			animate()
		})

		const onResize = () => {
			const { width: w, height: h } = getSize()
			renderer.setSize(w, h, false)
			camera.aspect = w / h
			camera.updateProjectionMatrix()
		}
		const ro = new ResizeObserver(onResize)
		ro.observe(container)

		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
			if (rendererRef.current) {
				rendererRef.current.dispose()
				const canvas = rendererRef.current.domElement
				canvas?.parentElement?.removeChild(canvas)
			}
			materialRef.current?.dispose()
			atmoMatRef.current?.dispose()
			geoRef.current?.dispose()
			dayTexRef.current?.dispose()
			nightTexRef.current?.dispose()

			sceneRef.current = null
			cameraRef.current = null
			groupRef.current = null
			materialRef.current = null
			atmoMatRef.current = null
			geoRef.current = null
			dayTexRef.current = null
			nightTexRef.current = null
			rendererRef.current = null
			rafRef.current = null
		}
	}, [])

	return (
		<StyledEarth
			ref={containerRef}
			aria-label='Rotating Earth'
			className='planet-wrapper'
		/>
	)
}

const StyledEarth = styled.div`
	position: absolute;
	width: 580px;
	height: 580px;
	top: 70px;
	left: 48%;
	transform: translateX(-50%);
	z-index: 1;
	border-radius: 50%;
	overflow: hidden;
	isolation: isolate;

	&::before {
		content: none;
	}

	canvas {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		z-index: 0;
	}

	@media (max-width: 1200px) {
		top: 240px;
		right: 10%;
		left: auto;
		transform: none;
	}
	@media (max-width: 800px) {
		top: 250px;
		left: 50%;
		right: auto;
		transform: translateX(-50%);
	}
`
