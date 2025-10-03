'use client'

import { useEffect, useState } from 'react'

interface Props {
	progress: number
}

export const Progress = ({ progress = 0 }: Props) => {
	const [size, setSize] = useState<number>(() =>
		typeof window === 'undefined' ? 370 : window.innerWidth > 1000 ? 370 : 300
	)

	useEffect(() => {
		let ticking = false
		const update = () => {
			ticking = false
			setSize(window.innerWidth > 1000 ? 370 : 300)
		}
		const onResize = () => {
			if (!ticking) {
				ticking = true
				requestAnimationFrame(update)
			}
		}
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [])

	const strokeWidth = 1
	const radius = (size - strokeWidth) / 2
	const circumference = 2 * Math.PI * radius
	const clamped = Math.max(0, Math.min(100, progress))
	const offset = circumference - (circumference * clamped) / 100

	return (
		<svg
			width={size}
			height={size}
			style={{
				transform: 'rotate(-90deg)',
				transformOrigin: 'center',
				display: 'block'
			}}
			aria-hidden
			focusable='false'
		>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				stroke='#292929'
				strokeWidth={strokeWidth}
				fill='none'
			/>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				stroke='#1dcf94'
				strokeWidth={strokeWidth}
				fill='none'
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap='round'
				style={{
					transition: 'stroke-dashoffset 0.45s ease',
					filter: 'drop-shadow(0px 0px 6px #1dcf94)',
					willChange: 'stroke-dashoffset'
				}}
			/>
		</svg>
	)
}
