'use client'

import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

export const Background = () => {
	const mountRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		let animationId = 0
		let cleanupFn: (() => void) | null = null

		const runIdle = (cb: () => void) => {
			// @ts-ignore
			const ric = typeof window !== 'undefined' && window.requestIdleCallback
			// трохи почекаємо «простою» або стартнемо відразу
			return ric
				? (window as any).requestIdleCallback(cb, { timeout: 1200 })
				: window.setTimeout(cb, 0)
		}

		const start = () => {
			const mount = mountRef.current!
			// прозорий канвас (фон контролюється стилями), висока продуктивність
			const renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true,
				powerPreference: 'high-performance',
				preserveDrawingBuffer: false
			})
			renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

			const scene = new THREE.Scene()

			const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
			camera.position.set(4, 2, 8)
			camera.lookAt(scene.position)

			mount.appendChild(renderer.domElement)

			// розмір під контейнер (а не під вікно) + ResizeObserver
			const fit = () => {
				const { width, height } = mount.getBoundingClientRect()
				const w = Math.max(1, Math.floor(width))
				const h = Math.max(1, Math.floor(height))
				renderer.setSize(w, h, false)
				camera.aspect = w / h
				camera.updateProjectionMatrix()
			}
			fit()
			const ro = new ResizeObserver(fit)
			ro.observe(mount)

			// геометрія хвиль
			const geometry = new THREE.PlaneGeometry(6, 4, 150, 100)
			const pos = geometry.getAttribute('position') as THREE.BufferAttribute

			// градієнт кольорів (бірюзовий із центровим підсвіченням)
			const colors = new Float32Array(pos.count * 3)
			for (let i = 0; i < pos.count; i++) {
				const x = pos.getX(i)
				const y = pos.getY(i)
				const dx = (x + 3) / 6
				const dy = (y + 2) / 4
				const brightness =
					0.2 + 0.8 * (1 - Math.abs(dx - 0.5) - Math.abs(dy - 0.5))
				colors[i * 3] = 0.0 // R
				colors[i * 3 + 1] = brightness // G
				colors[i * 3 + 2] = 0.77 // B
			}
			geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

			const simplex = new SimplexNoise()

			const material = new THREE.PointsMaterial({
				size: 0.02,
				vertexColors: true,
				sizeAttenuation: true
			})

			const points = new THREE.Points(geometry, material)
			points.rotation.x = -Math.PI / 2
			scene.add(points)

			const animate = (t: number) => {
				const tNorm = t / 8000 // було так у твоїй версії
				for (let i = 0; i < pos.count; i++) {
					const x = pos.getX(i)
					const y = pos.getY(i)
					const z = 0.5 * simplex.noise3d(x / 5, y / 5, tNorm)
					pos.setZ(i, z)
				}
				pos.needsUpdate = true

				renderer.render(scene, camera)
				animationId = requestAnimationFrame(animate)
			}
			animationId = requestAnimationFrame(animate)

			// прибирання
			return () => {
				cancelAnimationFrame(animationId)
				ro.disconnect()
				scene.remove(points)
				material.dispose()
				geometry.dispose()
				renderer.dispose()
				if (renderer.domElement.parentNode === mount) {
					mount.removeChild(renderer.domElement)
				}
			}
		}

		const idleId = runIdle(() => {
			cleanupFn = start()
		})

		return () => {
			if (typeof idleId === 'number') clearTimeout(idleId as number)
			// @ts-ignore
			else if (window.cancelIdleCallback)
				(window as any).cancelIdleCallback(idleId)
			if (cleanupFn) cleanupFn()
		}
	}, [])

	return <StyledBackground ref={mountRef} />
}

const StyledBackground = styled.div`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	opacity: 0.5;
	pointer-events: none; /* не перекриває кліки */

	/* лишаю твоє позиціювання канвасу для збереження композиції */
	canvas {
		width: 321% !important;
		height: 178% !important;
		position: absolute;
		top: -181px;
		right: -499px;
		bottom: -146px;
		@media (max-width: 600px) {
			top: 10px;
			width: 600px !important;
			height: 126% !important;
			right: 0px !important;
		}
	}
`
