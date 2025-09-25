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
  vec3 colorLinear = mix(nightCol, dayCol, dayFactor);
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
	const materialRef = useRef<THREE.ShaderMaterial | null>(null)
	const atmoMatRef = useRef<THREE.ShaderMaterial | null>(null)
	const geoRef = useRef<THREE.SphereGeometry | null>(null)
	const atmoGeoRef = useRef<THREE.SphereGeometry | null>(null)
	const dayTexRef = useRef<THREE.Texture | null>(null)
	const nightTexRef = useRef<THREE.Texture | null>(null)
	const roRef = useRef<ResizeObserver | null>(null)
	const ioRef = useRef<IntersectionObserver | null>(null)
	const inViewRef = useRef<boolean>(true)

	useEffect(() => {
		const container = containerRef.current!
		while (container.firstChild) container.removeChild(container.firstChild)

		// --- Mobile heuristics ---
		const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(
			navigator.userAgent
		)
		const isSmallScreen = Math.min(window.innerWidth, window.innerHeight) <= 820
		const mobile = isMobileUA || isSmallScreen
		const prefersReduced =
			window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

		const showStaticFallback = () => {
			const src = typeof dayImg === 'string' ? dayImg : dayImg?.src
			if (src) {
				container.style.background = `radial-gradient(transparent 55%, rgba(0,0,0,0.25)), url("${src}") center/cover no-repeat`
			}
		}
		const clearFallback = () => (container.style.background = 'none')

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
			showStaticFallback()
			return
		}

		// Scene
		const scene = new THREE.Scene()
		sceneRef.current = scene

		const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
		camera.position.set(0, 0, 2.3)
		cameraRef.current = camera

		// Renderer
		let renderer: THREE.WebGLRenderer
		try {
			renderer = new THREE.WebGLRenderer({
				antialias: !mobile, // вимикаємо AA на мобі для стабільності
				alpha: true,
				powerPreference: mobile ? 'low-power' : 'high-performance',
				premultipliedAlpha: true,
				preserveDrawingBuffer: false,
				failIfMajorPerformanceCaveat: false
			})
		} catch {
			renderer = new (THREE as any).WebGL1Renderer({
				antialias: false,
				alpha: true
			}) as THREE.WebGLRenderer
		}
		;(renderer as any).outputColorSpace = THREE.SRGBColorSpace
		renderer.toneMapping = THREE.NoToneMapping
		renderer.toneMappingExposure = 1.0
		renderer.setClearAlpha(0)
		renderer.setPixelRatio(
			Math.min(window.devicePixelRatio || 1, mobile ? 1.0 : 2)
		)
		renderer.setSize(width, height, false)
		container.appendChild(renderer.domElement)
		rendererRef.current = renderer

		const group = new THREE.Group()
		scene.add(group)
		groupRef.current = group

		const seg = mobile ? 48 : 128
		const geometry = new THREE.SphereGeometry(1, seg, seg)
		geoRef.current = geometry

		// --- Texture loading (downscale on mobile) ---
		const loader = new THREE.TextureLoader()
		const loadTextureSmart = (src: string) =>
			new Promise<THREE.Texture>((resolve, reject) => {
				if (!mobile) {
					loader.load(src, t => resolve(t), undefined, reject)
					return
				}
				const img = new Image()
				img.onload = () => {
					let w = img.naturalWidth,
						h = img.naturalHeight
					const gl = renderer.getContext()
					const cap = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096
					const limit = Math.min(2048, cap)
					while (Math.max(w, h) > limit) {
						w = Math.floor(w / 2)
						h = Math.floor(h / 2)
					}
					const c = document.createElement('canvas')
					c.width = w
					c.height = h
					const ctx = c.getContext('2d', { alpha: false })!
					ctx.drawImage(img, 0, 0, w, h)
					const tex = new THREE.CanvasTexture(c)
					resolve(tex)
				}
				img.onerror = reject
				img.decoding = 'async'
				img.loading = 'eager'
				img.src = src
			})

		const srcDay = typeof dayImg === 'string' ? dayImg : dayImg?.src
		const srcNight = typeof nightImg === 'string' ? nightImg : nightImg?.src
		if (!srcDay || !srcNight) {
			showStaticFallback()
			return
		}

		const prepTex = (tex: THREE.Texture) => {
			;(tex as any).colorSpace = THREE.SRGBColorSpace
			tex.generateMipmaps = true
			tex.minFilter = THREE.LinearMipmapLinearFilter
			tex.magFilter = THREE.LinearFilter
			tex.anisotropy = mobile
				? 2
				: Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1)
			tex.wrapS = tex.wrapT = THREE.RepeatWrapping
		}

		Promise.all([loadTextureSmart(srcDay), loadTextureSmart(srcNight)])
			.then(([dayTex, nightTex]) => {
				prepTex(dayTex)
				prepTex(nightTex)
				dayTexRef.current = dayTex
				nightTexRef.current = nightTex

				// precision fallback (iOS інколи без highp)
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
				materialRef.current = material

				const earth = new THREE.Mesh(geometry, material)
				earth.rotation.z = THREE.MathUtils.degToRad(23.5)
				group.add(earth)

				// Atmosphere (skip on very weak)
				if (!mobile || seg >= 48) {
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
					const atmoGeo = new THREE.SphereGeometry(1.03, seg, seg)
					atmoGeoRef.current = atmoGeo
					const atmo = new THREE.Mesh(atmoGeo, atmoMat)
					atmo.rotation.copy(earth.rotation)
					group.add(atmo)
				}

				// --- Animation with FPS cap & offscreen pause ---
				const targetFPS = mobile ? 30 : 60
				const interval = prefersReduced ? 0 : 1000 / targetFPS
				let prev = performance.now(),
					acc = 0

				const renderOnce = () => renderer.render(scene, camera)

				const animate = (t: number) => {
					if (document.hidden || !inViewRef.current) {
						rafRef.current = requestAnimationFrame(animate)
						return
					}
					if (interval === 0) {
						renderOnce()
						return
					}
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
				clearFallback()
				rafRef.current = requestAnimationFrame(animate)
			})
			.catch(() => {
				showStaticFallback()
			})

		// Resize
		const onResize = () => {
			const { width: w, height: h } = getSize()
			renderer.setPixelRatio(
				Math.min(window.devicePixelRatio || 1, mobile ? 1.0 : 2)
			)
			renderer.setSize(w, h, false)
			camera.aspect = w / h
			camera.updateProjectionMatrix()
		}
		if ('ResizeObserver' in window) {
			const ro = new ResizeObserver(onResize)
			ro.observe(container)
			roRef.current = ro
		} else {
			window.addEventListener('resize', onResize)
		}

		// Pause when offscreen
		if ('IntersectionObserver' in window) {
			const io = new IntersectionObserver(
				entries => {
					inViewRef.current = entries.some(e => e.isIntersecting)
				},
				{ root: null, threshold: 0.01 }
			)
			io.observe(container)
			ioRef.current = io
		}

		// Context loss (Safari/iOS)
		const onLost = (e: Event) => {
			e.preventDefault()
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
			rafRef.current = null
			showStaticFallback()
		}
		const canvasEl: HTMLCanvasElement = (
			rendererRef.current as THREE.WebGLRenderer
		).domElement
		canvasEl.addEventListener('webglcontextlost', onLost, { passive: false })

		// Cleanup
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
			ioRef.current?.disconnect?.()
			roRef.current?.disconnect?.()
			canvasEl.removeEventListener('webglcontextlost', onLost)

			materialRef.current?.dispose()
			atmoMatRef.current?.dispose()
			geoRef.current?.dispose()
			atmoGeoRef.current?.dispose()
			dayTexRef.current?.dispose()
			nightTexRef.current?.dispose()

			if (rendererRef.current) {
				rendererRef.current.dispose()
				const c = rendererRef.current.domElement
				c?.parentElement?.removeChild(c)
			}

			sceneRef.current = null
			cameraRef.current = null
			groupRef.current = null
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
	z-index: 1; /* залишив як у тебе */
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
		pointer-events: none; /* не блокує скрол/тапи на мобі */
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
