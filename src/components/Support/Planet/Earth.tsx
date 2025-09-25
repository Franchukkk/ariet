'use client'

// @ts-nocheck
import { getGPUTier } from 'detect-gpu'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as THREE from 'three'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'

import dayImg from '@/assets/img/world-day.jpg'
import nightImg from '@/assets/img/world-night.jpg'

// ==== Shaders ====
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
varying vec3 vWorldPos;
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform vec3 sunDirection;
vec3 srgbToLinear(vec3 c){ return pow(c, vec3(2.2)); }
vec3 linearToSrgb(vec3 c){ return pow(max(c, 0.0), vec3(1.0/2.2)); }
void main() {
  vec2 uv = vec2(1.0 - vUv.x, vUv.y);
  vec3 dayCol   = srgbToLinear(texture2D(dayTexture, uv).rgb) * 1.9; 
  vec3 nightCol = srgbToLinear(texture2D(nightTexture, uv).rgb) * 1.2;
  vec3 N = normalize(vWorldNormal);
  vec3 L = normalize(sunDirection);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 H = normalize(L + V);
  float ndl = max(dot(N, L), 0.0);
  vec3 litDay = dayCol * (0.8 + 1.5 * ndl);
  float spec = pow(max(dot(N, H), 0.0), 120.0);
  vec3 specular = vec3(1.0, 0.95, 0.8) * spec * 0.06;
  float rim = 1.0 - max(dot(N, V), 0.0);
  vec3 atmoDay = vec3(0.25, 0.5, 1.0) * pow(rim, 2.0) * ndl * 0.8;
  vec3 faintMoonlight = srgbToLinear(vec3(0.02, 0.025, 0.04)); 
  float dayFactor = smoothstep(0.0, 0.5, ndl);
  vec3 colorLinear = (nightCol + faintMoonlight) * (1.0 - dayFactor) + (litDay + specular + atmoDay) * dayFactor;
  gl_FragColor = vec4(linearToSrgb(colorLinear), 1.0);
}
`
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
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
	const sceneRef = useRef<THREE.Scene | null>(null)
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
	const groupRef = useRef<THREE.Group | null>(null)
	const matRef = useRef<THREE.ShaderMaterial | null>(null)
	const atmoMatRef = useRef<THREE.ShaderMaterial | null>(null)
	const geoRef = useRef<THREE.SphereGeometry | null>(null)
	const atmoGeoRef = useRef<THREE.SphereGeometry | null>(null)
	const dayTexRef = useRef<THREE.Texture | null>(null)
	const nightTexRef = useRef<THREE.Texture | null>(null)
	const roRef = useRef<ResizeObserver | null>(null)

	useEffect(() => {
		let dispose: (() => void) | null = null

		const init = async () => {
			const container = containerRef.current!
			while (container.firstChild) container.removeChild(container.firstChild)

			const prefersReduced =
				window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ??
				false

			// GPU tier
			const t = await getGPUTier({
				mobileBenchmarkPercentages: [0, 25, 50, 75]
			})
			const tierNumber =
				typeof t.tier === 'number'
					? t.tier
					: String(t.tier).match(/\d+/)?.[0]
						? Number(String(t.tier).match(/\d+/)![0])
						: 0
			const tier = Math.max(0, Math.min(3, tierNumber)) // clamp 0..3

			const getSize = () => {
				const rect = container.getBoundingClientRect()
				const s = Math.min(rect.width || 580, rect.height || 580)
				return { width: s, height: s }
			}
			const { width, height } = getSize()

			// WebGL support
			const testCanvas = document.createElement('canvas')
			const canWebGL = !!(
				testCanvas.getContext('webgl') ||
				testCanvas.getContext('experimental-webgl')
			)
			if (!canWebGL) {
				const src = typeof dayImg === 'string' ? dayImg : dayImg?.src
				if (src)
					container.style.background = `radial-gradient(transparent 55%, rgba(0,0,0,0.25)), url("${src}") center/cover no-repeat`
				return
			}

			// Scene
			const scene = new THREE.Scene()
			sceneRef.current = scene

			const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
			camera.position.set(0, 0, 2.3)
			cameraRef.current = camera

			// Quality by tier
			const quality = {
				dpr: [0.75, 0.95, 1.2, 2.0][tier],
				seg: [32, 48, 96, 128][tier],
				anis: [1, 2, 4, 8][tier],
				withAtmo: tier >= 1,
				fps: prefersReduced ? 0 : [24, 30, 60, 60][tier]
			}

			// Renderer (typed as WebGLRenderer to avoid TS issues)
			let renderer: THREE.WebGLRenderer
			try {
				renderer = new THREE.WebGLRenderer({
					antialias: true,
					alpha: true,
					powerPreference: tier <= 1 ? 'low-power' : 'high-performance',
					premultipliedAlpha: true,
					preserveDrawingBuffer: false,
					failIfMajorPerformanceCaveat: false
				})
			} catch {
				renderer = new (THREE as any).WebGL1Renderer({
					antialias: true,
					alpha: true
				}) as THREE.WebGLRenderer
			}

			;(renderer as any).outputColorSpace = THREE.SRGBColorSpace
			renderer.toneMapping = THREE.NoToneMapping
			renderer.toneMappingExposure = 1.0
			renderer.setClearAlpha(0)
			renderer.setPixelRatio(
				Math.min(window.devicePixelRatio || 1, quality.dpr)
			)
			renderer.setSize(width, height, false)
			container.appendChild(renderer.domElement)
			rendererRef.current = renderer

			const group = new THREE.Group()
			scene.add(group)
			groupRef.current = group

			const geometry = new THREE.SphereGeometry(1, quality.seg, quality.seg)
			geoRef.current = geometry

			// Textures (KTX2 via CDN -> JPG fallback)
			const srcDayJpg = typeof dayImg === 'string' ? dayImg : dayImg?.src
			const srcNightJpg =
				typeof nightImg === 'string' ? nightImg : nightImg?.src
			const srcDayKtx2 = srcDayJpg?.replace(/\.(jpg|jpeg|png)$/i, '.ktx2')
			const srcNightKtx2 = srcNightJpg?.replace(/\.(jpg|jpeg|png)$/i, '.ktx2')

			const loader = new THREE.TextureLoader()
			const loadJpgs = async () => {
				const [tDay, tNight] = await Promise.all([
					new Promise<THREE.Texture>((res, rej) =>
						loader.load(srcDayJpg!, res, undefined, rej)
					),
					new Promise<THREE.Texture>((res, rej) =>
						loader.load(srcNightJpg!, res, undefined, rej)
					)
				])
				return [tDay, tNight] as [THREE.Texture, THREE.Texture]
			}

			const cdnBasisPath = `https://unpkg.com/three@0.${(THREE as any).REVISION}.x/examples/jsm/libs/basis/`
			const loadKtx2s = async () => {
				const ktx2 = new KTX2Loader()
					.setTranscoderPath(cdnBasisPath)
					.detectSupport(renderer)
				const [tDay, tNight] = await Promise.all([
					ktx2.loadAsync(srcDayKtx2!),
					ktx2.loadAsync(srcNightKtx2!)
				])
				ktx2.dispose()
				return [tDay, tNight] as [THREE.Texture, THREE.Texture]
			}

			let dayTex: THREE.Texture, nightTex: THREE.Texture
			try {
				if (srcDayKtx2 && srcNightKtx2) {
					;[dayTex, nightTex] = await loadKtx2s()
				} else {
					;[dayTex, nightTex] = await loadJpgs()
				}
			} catch {
				;[dayTex, nightTex] = await loadJpgs()
			}

			const prep = (tex: THREE.Texture) => {
				;(tex as any).colorSpace = THREE.SRGBColorSpace
				tex.generateMipmaps = true
				tex.minFilter = THREE.LinearMipmapLinearFilter
				tex.magFilter = THREE.LinearFilter
				tex.anisotropy = quality.anis
				tex.wrapS = tex.wrapT = THREE.RepeatWrapping
			}
			prep(dayTex)
			prep(nightTex)
			dayTexRef.current = dayTex
			nightTexRef.current = nightTex

			// precision fallback
			const gl = renderer.getContext()
			let frag = fragmentShader
			let atmoFrag = atmoFragment
			try {
				const fmt = gl.getShaderPrecisionFormat(
					gl.FRAGMENT_SHADER,
					gl.HIGH_FLOAT
				)
				if (!(fmt && fmt.precision > 0)) {
					frag = frag.replace(
						'precision highp float;',
						'precision mediump float;'
					)
					atmoFrag = atmoFrag.replace(
						'precision highp float;',
						'precision mediump float;'
					)
				}
			} catch {
				frag = frag.replace(
					'precision highp float;',
					'precision mediump float;'
				)
				atmoFrag = atmoFrag.replace(
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
			matRef.current = material

			const earth = new THREE.Mesh(geometry, material)
			earth.rotation.z = THREE.MathUtils.degToRad(23.5)
			group.add(earth)

			if (quality.withAtmo) {
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
				const atmoGeo = new THREE.SphereGeometry(1.03, quality.seg, quality.seg)
				atmoGeoRef.current = atmoGeo
				const atmo = new THREE.Mesh(atmoGeo, atmoMat)
				atmo.rotation.copy(earth.rotation)
				group.add(atmo)
			}

			// Animation with FPS cap
			const fps = quality.fps
			const interval = fps ? 1000 / fps : 0
			let prev = performance.now(),
				acc = 0

			const renderOnce = () => renderer.render(scene, camera)

			const animate = (t: number) => {
				if (!fps) {
					renderOnce()
					return
				} // one frame for reduced motion
				const dt = t - prev
				prev = t
				acc += dt
				if (acc >= interval) {
					const steps = Math.max(1, Math.floor(acc / interval))
					acc -= steps * interval
					group.rotation.y += 0.0006 * steps * (interval / 16.67)
					renderer.render(scene, camera)
				}
				rafRef.current = requestAnimationFrame(animate)
			}
			rafRef.current = requestAnimationFrame(animate)

			// Resize
			const onResize = () => {
				const { width: w, height: h } = getSize()
				renderer.setPixelRatio(
					Math.min(window.devicePixelRatio || 1, quality.dpr)
				)
				renderer.setSize(w, h, false)
				camera.aspect = w / h
				camera.updateProjectionMatrix()
			}
			let ro: ResizeObserver | null = null
			if ('ResizeObserver' in window) {
				ro = new ResizeObserver(onResize)
				ro.observe(container)
				roRef.current = ro
			} else {
				window.addEventListener('resize', onResize)
			}

			// Cleanup fn
			dispose = () => {
				if (rafRef.current) cancelAnimationFrame(rafRef.current)
				roRef.current?.disconnect()
				matRef.current?.dispose()
				atmoMatRef.current?.dispose()
				geoRef.current?.dispose()
				atmoGeoRef.current?.dispose()
				dayTexRef.current?.dispose()
				nightTexRef.current?.dispose()
				rendererRef.current?.dispose()
				const canvas = rendererRef.current?.domElement as
					| HTMLCanvasElement
					| undefined
				canvas?.parentElement?.removeChild(canvas)
				sceneRef.current = null
				cameraRef.current = null
				groupRef.current = null
				rendererRef.current = null
			}
		}

		init()
		return () => {
			dispose?.()
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
	z-index: -1;
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
