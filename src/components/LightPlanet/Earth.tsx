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

// твій спрощений фрагментний шейдер (без specular), лишив як є
const fragmentShader = `
precision highp float;

varying vec2 vUv;
varying vec3 vWorldNormal;

uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform vec3 sunDirection;

// sRGB <-> linear
vec3 srgbToLinear(vec3 c){ return pow(c, vec3(2.2)); }
vec3 linearToSrgb(vec3 c){ return pow(max(c, 0.0), vec3(1.0/2.2)); }

void main() {
  vec2 uv = vec2(1.0 - vUv.x, vUv.y);

  vec3 dayCol   = srgbToLinear(texture2D(dayTexture,   uv).rgb);
  vec3 nightCol = srgbToLinear(texture2D(nightTexture, uv).rgb) * 1.15;

  vec3 N = normalize(vWorldNormal);
  vec3 L = normalize(sunDirection);

  float ndl = max(dot(N, L), 0.0);
  float dayFactor = smoothstep(0.05, 0.35, ndl);
  float nightFactor = 1.0 - dayFactor;

  vec3 colorLinear = mix(nightCol, dayCol, dayFactor);

  gl_FragColor = vec4(linearToSrgb(colorLinear), 1.0);
}
`

// Атмосфера
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
	const rendererRef = useRef<THREE.WebGLRenderer | THREE.WebGL1Renderer | null>(
		null
	)
	const sceneRef = useRef<THREE.Scene | null>(null)
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
	const groupRef = useRef<THREE.Group | null>(null)
	const materialRef = useRef<THREE.ShaderMaterial | null>(null)
	const atmoMatRef = useRef<THREE.ShaderMaterial | null>(null)
	const geoRef = useRef<THREE.SphereGeometry | null>(null)
	const dayTexRef = useRef<THREE.Texture | null>(null)
	const nightTexRef = useRef<THREE.Texture | null>(null)
	const roRef = useRef<ResizeObserver | null>(null)

	useEffect(() => {
		const container = containerRef.current!
		while (container.firstChild) container.removeChild(container.firstChild)

		const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(
			navigator.userAgent
		)

		const showStaticFallback = () => {
			const src = typeof dayImg === 'string' ? dayImg : dayImg?.src
			if (src) {
				container.style.background = `radial-gradient(transparent 55%, rgba(0,0,0,0.25)), url("${src}") center/cover no-repeat`
			} else {
				container.style.background =
					'radial-gradient(transparent 55%, rgba(0,0,0,0.25))'
			}
		}
		const clearFallback = () => (container.style.background = 'none')

		const getSize = () => {
			const rect = container.getBoundingClientRect()
			const s = Math.min(rect.width || 580, rect.height || 580)
			return { width: s, height: s }
		}
		const { width, height } = getSize()

		// Перевірка WebGL
		const canWebGL = (() => {
			const c = document.createElement('canvas')
			const gl = c.getContext('webgl') || c.getContext('experimental-webgl')
			return !!gl
		})()
		if (!canWebGL) {
			showStaticFallback()
			return
		}

		// Scene
		const scene = new THREE.Scene()
		sceneRef.current = scene

		const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
		camera.position.set(0, 0, 2.3)
		cameraRef.current = camera

		// Renderer (WebGL2 -> WebGL1)
		let renderer: any
		const commonAttrs = {
			antialias: true,
			alpha: true,
			powerPreference: isMobile ? 'low-power' : 'high-performance',
			premultipliedAlpha: true,
			preserveDrawingBuffer: false,
			failIfMajorPerformanceCaveat: false
		} as const

		try {
			renderer = new THREE.WebGLRenderer(commonAttrs as any)
		} catch {
			// @ts-ignore
			renderer = new THREE.WebGL1Renderer(commonAttrs as any)
		}
		;(renderer as any).outputColorSpace = THREE.SRGBColorSpace
		renderer.toneMapping = THREE.NoToneMapping
		renderer.toneMappingExposure = 1.0
		renderer.setClearAlpha(0)
		renderer.setPixelRatio(
			Math.min(window.devicePixelRatio || 1, isMobile ? 1.3 : 2)
		)
		renderer.setSize(width, height, false)
		container.appendChild(renderer.domElement)
		rendererRef.current = renderer

		const group = new THREE.Group()
		scene.add(group)
		groupRef.current = group

		const seg = isMobile ? 64 : 128
		const geometry = new THREE.SphereGeometry(1, seg, seg)
		geoRef.current = geometry

		const loader = new THREE.TextureLoader()
		const loadTex = (src: string) =>
			new Promise<THREE.Texture>((resolve, reject) =>
				loader.load(src, resolve, undefined, reject)
			)

		const srcDay = typeof dayImg === 'string' ? dayImg : dayImg?.src
		const srcNight = typeof nightImg === 'string' ? nightImg : nightImg?.src

		if (!srcDay || !srcNight) {
			showStaticFallback()
			return
		}

		const onTexturesReady = ([dayTex, nightTex]: [
			THREE.Texture,
			THREE.Texture
		]) => {
			const maxAnis = Math.max(
				1,
				Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1)
			)
			const prep = (tex: THREE.Texture) => {
				;(tex as any).colorSpace = THREE.SRGBColorSpace
				tex.anisotropy = maxAnis
				tex.wrapS = tex.wrapT = THREE.RepeatWrapping
			}
			prep(dayTex)
			prep(nightTex)
			dayTexRef.current = dayTex
			nightTexRef.current = nightTex

			// Фолбек precision (highp -> mediump) для деяких мобільних
			const gl = renderer.getContext()
			let frag = fragmentShader
			let atmoFrag = atmoFragment
			try {
				const fmt = gl.getShaderPrecisionFormat(
					gl.FRAGMENT_SHADER,
					gl.HIGH_FLOAT
				)
				if (!(fmt && fmt.precision > 0)) {
					frag = fragmentShader.replace(
						'precision highp float;',
						'precision mediump float;'
					)
					atmoFrag = atmoFragment.replace(
						'precision highp float;',
						'precision mediump float;'
					)
				}
			} catch {
				frag = fragmentShader.replace(
					'precision highp float;',
					'precision mediump float;'
				)
				atmoFrag = atmoFragment.replace(
					'precision highp float;',
					'precision mediump float;'
				)
			}

			const sunDir = new THREE.Vector3(1, 0.2, 0).normalize()

			const material = new THREE.ShaderMaterial({
				vertexShader,
				fragmentShader: frag,
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
			earth.rotation.z = THREE.MathUtils.degToRad(23.5)
			group.add(earth)

			const atmoMat = new THREE.ShaderMaterial({
				vertexShader: atmoVertex,
				fragmentShader: atmoFrag,
				transparent: true,
				blending: THREE.AdditiveBlending,
				depthWrite: false,
				side: THREE.BackSide
			})
			atmoMat.toneMapped = false
			atmoMatRef.current = atmoMat

			const atmo = new THREE.Mesh(
				new THREE.SphereGeometry(1.03, seg, seg),
				atmoMat
			)
			atmo.rotation.copy(earth.rotation)
			group.add(atmo)

			const animate = () => {
				if (document.hidden) return
				group.rotation.y += 0.0006
				renderer.render(scene, camera)
				rafRef.current = requestAnimationFrame(animate)
			}
			animate()
		}

		Promise.all([loadTex(srcDay), loadTex(srcNight)])
			.then(res => {
				clearFallback()
				onTexturesReady(res as any)
			})
			.catch(() => {
				showStaticFallback()
			})

		// Resize
		const onResize = () => {
			const { width: w, height: h } = getSize()
			try {
				renderer.setSize(w, h, false)
				camera.aspect = w / h
				camera.updateProjectionMatrix()
			} catch {}
		}
		if ('ResizeObserver' in window) {
			const ro = new ResizeObserver(onResize)
			ro.observe(container)
			roRef.current = ro
		} else {
			window.addEventListener('resize', onResize)
		}

		// Visibility + context loss
		const onVis = () => {
			if (
				!document.hidden &&
				rendererRef.current &&
				sceneRef.current &&
				cameraRef.current
			) {
				rendererRef.current.render(sceneRef.current, cameraRef.current)
				if (!rafRef.current) {
					rafRef.current = requestAnimationFrame(function loop() {
						if (document.hidden) {
							rafRef.current = null
							return
						}
						groupRef.current!.rotation.y += 0.0006
						rendererRef.current!.render(sceneRef.current!, cameraRef.current!)
						rafRef.current = requestAnimationFrame(loop)
					})
				}
			}
		}
		document.addEventListener('visibilitychange', onVis)

		const onLost = (e: Event) => {
			e.preventDefault()
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
			rafRef.current = null
			showStaticFallback()
		}
		const canvasEl = renderer.domElement
		canvasEl.addEventListener('webglcontextlost', onLost, { passive: false })

		// Cleanup
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
			document.removeEventListener('visibilitychange', onVis)
			canvasEl.removeEventListener('webglcontextlost', onLost)
			roRef.current?.disconnect()
			window.removeEventListener?.('resize', onResize)

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
	z-index: -1; /* повернув назад, щоб не перекривав контент */
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
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		will-change: transform;
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
