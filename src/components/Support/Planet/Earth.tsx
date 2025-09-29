'use client'

// @ts-nocheck
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as THREE from 'three'

import dayImg from '@/assets/img/world-day.jpg'
import nightImg from '@/assets/img/world-night.jpg'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;

  void main() {
    vUv = uv;
    // World-space normal for lighting
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
precision highp float;

varying vec2 vUv;
varying vec3 vWorldNormal;

uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform vec3 sunDirection;

// softstep for twilight
float softstep(float e0, float e1, float x){
  float t = clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

// approx sRGB <-> linear
vec3 srgbToLinear(vec3 c){ return pow(c, vec3(2.2)); }
vec3 linearToSrgb(vec3 c){ return pow(max(c, 0.0), vec3(1.0/2.2)); }

void main(){
  float ndotl = dot(normalize(vWorldNormal), normalize(sunDirection));

  // flip X to match textures
  vec2 uv = vec2(1.0 - vUv.x, vUv.y);

  vec3 dayCol   = srgbToLinear(texture2D(dayTexture, uv).rgb);
  vec3 nightCol = srgbToLinear(texture2D(nightTexture, uv).rgb);

  float k = softstep(-0.14, 0.12, ndotl);  // wider/softer dusk
vec3 colorLinear = mix(nightCol * 0.80, dayCol, k);  // brighter nightside

  gl_FragColor = vec4(linearToSrgb(colorLinear), 1.0);
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
		camera.position.z = 2.3
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
					t => resolve(t),
					undefined,
					reject
				)
			),
			new Promise<THREE.Texture>((resolve, reject) =>
				loader.load(
					typeof nightImg === 'string' ? nightImg : nightImg.src,
					t => resolve(t),
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
			}

			setSRGB(dayTex)
			setSRGB(nightTex)

			dayTexRef.current = dayTex
			nightTexRef.current = nightTex

			const material = new THREE.ShaderMaterial({
				vertexShader,
				fragmentShader,
				uniforms: {
					dayTexture: { value: dayTex },
					nightTexture: { value: nightTex },
					sunDirection: { value: new THREE.Vector3(1, 0.2, 0).normalize() }
				}
			})
			material.toneMapped = false
			materialRef.current = material

			const mesh = new THREE.Mesh(geometry, material)
			mesh.rotation.z = THREE.MathUtils.degToRad(23.5)
			group.add(mesh)

			let t = 0
			const animate = () => {
				group.rotation.y += 0.0005

				t += 0.0004
				const sun = material.uniforms.sunDirection.value as THREE.Vector3
				sun.set(Math.cos(t), 0.2, Math.sin(t)).normalize()

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
			geoRef.current?.dispose()
			dayTexRef.current?.dispose()
			nightTexRef.current?.dispose()

			sceneRef.current = null
			cameraRef.current = null
			groupRef.current = null
			materialRef.current = null
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
			// bg={earthImg}
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
	z-index: -1;
	border-radius: 50%;
	overflow: hidden;
	isolation: isolate;

	&::before {
		content: none;
	} /* ← remove tint overlay */

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
