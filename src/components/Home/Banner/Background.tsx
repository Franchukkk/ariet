'use client'

import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

export const Background = () => {
	const mountRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		let animationId = 0

		const renderer = new THREE.WebGLRenderer({ antialias: true })
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.setSize(window.innerWidth, window.innerHeight)

		const scene = new THREE.Scene()

		const camera = new THREE.PerspectiveCamera(
			30,
			window.innerWidth / window.innerHeight,
			0.1,
			100
		)
		camera.position.set(4, 2, 8)
		camera.lookAt(scene.position)

		const mountNode = mountRef.current
		mountNode?.appendChild(renderer.domElement)

		const SEG_X = 300
		const SEG_Y = 200
		const geometry = new THREE.PlaneGeometry(6, 4, SEG_X, SEG_Y)
		const pos = geometry.getAttribute('position')
		pos.setUsage(THREE.DynamicDrawUsage)

		const simplex = new SimplexNoise()

		const pointsMaterial = new THREE.PointsMaterial({
			size: 0.012,
			color: 0x00ffc3,
			sizeAttenuation: true
		})

		const waves = new THREE.Points(geometry, pointsMaterial)
		waves.rotation.x = -Math.PI / 2

		waves.scale.set(2.7, 1, 2.7)

		scene.add(waves)

		const onResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight
			camera.updateProjectionMatrix()
			renderer.setSize(window.innerWidth, window.innerHeight)
		}

		window.addEventListener('resize', onResize)

		const SPEED = 0.5

		const animate = (t: number) => {
			for (let i = 0; i < pos.count; i++) {
				const x = pos.getX(i)
				const y = pos.getY(i)
				const z = 0.5 * simplex.noise3d(x / 2, y / 2, (t * SPEED) / 6000)
				pos.setZ(i, z)
			}
			pos.needsUpdate = true

			renderer.render(scene, camera)
			animationId = requestAnimationFrame(animate)
		}

		animationId = requestAnimationFrame(animate)

		return () => {
			cancelAnimationFrame(animationId)
			window.removeEventListener('resize', onResize)
			renderer.dispose()
			if (renderer.domElement && renderer.domElement.parentNode) {
				renderer.domElement.parentNode.removeChild(renderer.domElement)
			}
		}
	}, [])

	return <Root ref={mountRef} />
}

const Root = styled.div`
	position: absolute;
	inset: 0;
	z-index: 0;
	pointer-events: none;
	overflow: hidden;

	canvas {
		display: block;
		width: 100% !important;
		height: 100% !important;
	}
`
