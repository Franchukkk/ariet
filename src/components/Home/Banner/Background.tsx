'use client'

import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

type Props = {
	rotateDeg?: number
	panSpeed?: number
	panAngleDeg?: number
	amplitude?: number
	waveTimeDiv?: number
	scale?: number
	zoom?: number
	pointSize?: number
	color?: number
	waveAngleDeg?: number
	waveFreq?: number
	waveFlow?: number
	crossFreq?: number
	crossFlow?: number
	centerNarrowWidth?: number
	centerNarrowStrength?: number
}

export const Background: React.FC<Props> = props => {
	const {
		rotateDeg = 80,
		panSpeed = 0,
		panAngleDeg = 0,
		amplitude = 0.6,
		waveTimeDiv = 7000,
		scale = 1,
		zoom = 1.8,
		pointSize = 0.02,
		color = 0x00ffc3,
		waveAngleDeg = -45,
		waveFreq = 2.0,
		waveFlow = 1.5,
		crossFreq = 0.6,
		crossFlow = 0.4,
		centerNarrowWidth = 0.9,
		centerNarrowStrength = 0.65
	} = props

	const mountRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		let raf = 0

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		})
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)

		const mount = mountRef.current!
		mount.appendChild(renderer.domElement)

		const fit = () => {
			const { width, height } = mount.getBoundingClientRect()
			const w = Math.max(1, Math.floor(width))
			const h = Math.max(1, Math.floor(height))
			renderer.setSize(w, h, false)
			camera.aspect = w / h
			camera.updateProjectionMatrix()
		}

		const geometry = new THREE.PlaneGeometry(6, 4, 220, 160)
		const pos = geometry.getAttribute('position') as THREE.BufferAttribute
		const simplex = new SimplexNoise()

		const material = new THREE.PointsMaterial({
			size: pointSize,
			color,
			sizeAttenuation: true
		})
		const points = new THREE.Points(geometry, material)
		points.rotation.x = -Math.PI / 2

		const group = new THREE.Group()
		group.add(points)
		group.scale.setScalar(scale)
		scene.add(group)

		const rot = THREE.MathUtils.degToRad(rotateDeg)
		group.rotation.z = -rot

		const panScreenRad = THREE.MathUtils.degToRad(panAngleDeg)
		const sdx = Math.cos(panScreenRad)
		const sdy = Math.sin(panScreenRad)
		const panDX = Math.cos(rot) * sdx + Math.sin(rot) * sdy
		const panDY = -Math.sin(rot) * sdx + Math.cos(rot) * sdy

		const waveScreenRad = THREE.MathUtils.degToRad(waveAngleDeg)
		const wdxS = Math.cos(waveScreenRad)
		const wdyS = Math.sin(waveScreenRad)
		const dirX = Math.cos(rot) * wdxS + Math.sin(rot) * wdyS
		const dirY = -Math.sin(rot) * wdxS + Math.cos(rot) * wdyS
		const len = Math.hypot(dirX, dirY) || 1
		const ux = dirX / len,
			uy = dirY / len // уздовж хвилі
		const vx = -uy,
			vy = ux // поперек хвилі

		const placeCamera = () => {
			fit()
			const planeH = 4 * scale
			const dist =
				planeH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) / zoom
			const normal = new THREE.Vector3(0, 0, 1).applyEuler(
				new THREE.Euler(-Math.PI / 2, 0, 0)
			)
			camera.position.copy(normal.multiplyScalar(dist))
			camera.lookAt(0, 0, 0)
		}

		placeCamera()
		const ro = new ResizeObserver(placeCamera)
		ro.observe(mount)

		const animate = (tMs: number) => {
			const t = tMs / 1000
			const panX = panDX * panSpeed * t
			const panY = panDY * panSpeed * t

			for (let i = 0; i < pos.count; i++) {
				const ox = pos.getX(i),
					oy = pos.getY(i)
				const x = ox + panX,
					y = oy + panY

				const u = x * ux + y * uy // уздовж діагоналі
				const v = x * vx + y * vy // перпендикуляр до діагоналі

				const m = THREE.MathUtils.smoothstep(Math.abs(v), 0, centerNarrowWidth)
				const centerMask = 1 - centerNarrowStrength + centerNarrowStrength * m

				const sMain = Math.sin(u * waveFreq + t * waveFlow)
				const sCross = Math.sin(v * crossFreq + t * crossFlow)
				const n = simplex.noise3d(x * 0.6, y * 0.6, tMs / waveTimeDiv)

				const z =
					centerMask *
					(amplitude * (0.8 * sMain + 0.2 * sCross) + 0.22 * amplitude * n)
				pos.setZ(i, z)
			}
			pos.needsUpdate = true

			renderer.render(scene, camera)
			raf = requestAnimationFrame(animate)
		}
		raf = requestAnimationFrame(animate)

		return () => {
			cancelAnimationFrame(raf)
			ro.disconnect()
			scene.remove(group)
			material.dispose()
			geometry.dispose()
			renderer.dispose()
			if (renderer.domElement.parentNode === mount)
				mount.removeChild(renderer.domElement)
		}
	}, [
		rotateDeg,
		panSpeed,
		panAngleDeg,
		amplitude,
		waveTimeDiv,
		scale,
		zoom,
		pointSize,
		color,
		waveAngleDeg,
		waveFreq,
		waveFlow,
		crossFreq,
		crossFlow,
		centerNarrowWidth,
		centerNarrowStrength
	])

	return <Root ref={mountRef} />
}

const Root = styled.div`
	position: absolute;
	inset: 0;
	z-index: 0; /* 🔥 фон */
	pointer-events: none; /* не перекриває кліки */
	canvas {
		display: block;
		width: 100% !important;
		height: 100% !important;
	}
`
