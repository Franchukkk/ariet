import { useEffect, useRef } from 'react'
import * as solar from 'solar-calculator'
import styled from 'styled-components'
import * as THREE from 'three'

import dayImg from '../../assets/img/world-day.jpg'
import nightImg from '../../assets/img/world-night.jpg'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D dayTexture;
  uniform sampler2D nightTexture;
  uniform vec2 sunPosition;   // (lon, lat) сонця в градусах
  uniform vec2 globeRotation; // (lon, lat) обертання глобуса в градусах
  varying vec2 vUv;
  varying vec3 vNormal;

  #define PI 3.141592653589793

  float toRad(float deg) { return deg * PI / 180.0; }

  vec3 sunDir(vec2 sunPos, vec2 rotation) {
    // компенсуємо обертання глобуса
    float sunLon = toRad(sunPos.x - rotation.x);
    float sunLat = toRad(sunPos.y - rotation.y);
    float x = cos(sunLat) * cos(sunLon);
    float y = sin(sunLat);
    float z = cos(sunLat) * sin(sunLon);
    return normalize(vec3(x, y, z));
  }

  void main() {
    vec3 lightDir = sunDir(sunPosition, globeRotation);
    float intensity = dot(normalize(vNormal), lightDir);
    vec4 dayColor = texture2D(dayTexture, vUv);
    vec4 nightColor = texture2D(nightTexture, vUv);
    float blend = smoothstep(-0.2, 0.2, intensity);
    gl_FragColor = mix(nightColor, dayColor, blend);
  }
`

/** Позиція субсолярної точки (довгота, широта) у градусах для часу t (ms) */
function sunPosAt(tms: number): [number, number] {
	// Полудень UTC для стабільнішого досліду рівняння часу
	const day = new Date(tms)
	day.setUTCHours(0, 0, 0, 0)
	const t = solar.century(tms)
	// приблизно: кутова різниця з полуднем у градусах
	const longitude = ((day.getTime() - tms) / 864e5) * 360 - 180
	const lon = longitude - solar.equationOfTime(t) / 4
	const lat = solar.declination(t)
	return [lon, lat]
}

/** Допоміжне: витягти url зі статичного імпорту/рядка */
const toSrc = (m: any): string => (typeof m === 'string' ? m : m?.src || '')

export const Earth = () => {
	const containerRef = useRef<HTMLDivElement>(null)

	// поточний час (старт — зараз; якщо треба фіксовану дату — заміни на new Date('2025-05-22T00:00:00Z').getTime())
	const dtRef = useRef<number>(Date.now())

	// умовне «обертання глобуса» (у градусах)
	const globeRotation = useRef(new THREE.Vector2(0, 0))

	const shaderMaterial = useRef<THREE.ShaderMaterial | null>(null)
	const sphereRef = useRef<THREE.Mesh | null>(null)
	const dayTexRef = useRef<THREE.Texture | null>(null)
	const nightTexRef = useRef<THREE.Texture | null>(null)
	const frameRef = useRef<number | null>(null)

	useEffect(() => {
		const container = containerRef.current!
		const width = 580
		const height = 580

		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
		camera.position.z = 3

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
		renderer.setSize(width, height)
		renderer.setPixelRatio(window.devicePixelRatio)
		container.appendChild(renderer.domElement)

		const geometry = new THREE.SphereGeometry(1, 158, 158)

		const loader = new THREE.TextureLoader()
		Promise.all([
			loader.loadAsync(toSrc(dayImg)),
			loader.loadAsync(toSrc(nightImg))
		]).then(([dayTex, nightTex]) => {
			dayTexRef.current = dayTex
			nightTexRef.current = nightTex

			shaderMaterial.current = new THREE.ShaderMaterial({
				vertexShader,
				fragmentShader,
				uniforms: {
					dayTexture: { value: dayTex },
					nightTexture: { value: nightTex },
					sunPosition: { value: new THREE.Vector2() }, // (lon, lat)
					globeRotation: { value: globeRotation.current } // (lon, lat)
				}
			})

			const sphere = new THREE.Mesh(geometry, shaderMaterial.current)
			sphereRef.current = sphere
			scene.add(sphere)

			const animate = () => {
				// +1 хвилина до часу на кожен кадр (для плавного руху «термінатора»)
				dtRef.current += 60 * 1000

				// обчислюємо позицію Сонця для поточного часу
				const [sunLon, sunLat] = sunPosAt(dtRef.current)
				shaderMaterial.current!.uniforms.sunPosition.value.set(sunLon, sunLat)

				// повільне власне обертання глобуса (у градусах)
				globeRotation.current.x += 0.1 // 0.1° за кадр
				shaderMaterial.current!.uniforms.globeRotation.value.set(
					globeRotation.current.x,
					globeRotation.current.y
				)

				// фізичне обертання меша (щоб UV не були статичні)
				if (sphereRef.current) sphereRef.current.rotation.y += 0.0005

				renderer.render(scene, camera)
				frameRef.current = requestAnimationFrame(animate)
			}

			animate()
		})

		return () => {
			if (frameRef.current) cancelAnimationFrame(frameRef.current)
			try {
				container.removeChild(renderer.domElement)
			} catch {}
			renderer.dispose()
			geometry.dispose()
			if (shaderMaterial.current) shaderMaterial.current.dispose()
			dayTexRef.current?.dispose()
			nightTexRef.current?.dispose()
			sphereRef.current = null
			shaderMaterial.current = null
		}
	}, [])

	return (
		<StyledEarth
			ref={containerRef}
			style={{ width: '580px', height: '580px' }}
			className='planet-wrapper'
		/>
	)
}

const StyledEarth = styled.div`
	position: absolute;
	top: 70px;
	left: 50%;
	transform: translateX(-50%);

	width: 580px;
	height: 580px;

	z-index: 1;
	border-radius: 50%;
	overflow: hidden;
	isolation: isolate;

	canvas {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		z-index: 0;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		will-change: transform;
		pointer-events: none;
	}

	@media (max-width: 1200px) {
		top: 240px;
	}
	@media (max-width: 800px) {
		top: 250px;
	}
`
