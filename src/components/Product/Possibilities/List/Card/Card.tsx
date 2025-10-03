'use client'

import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Progress } from './Progress'

interface Props {
	title: string
	subtitle: string
	progress?: number
}

export const Card = ({ title, subtitle, progress = 0 }: Props) => {
	const [progressState, setProgress] = useState(progress)
	const targetRef = useRef(progress)
	const rafRef = useRef<number | null>(null)

	const animateTo = (target: number) => {
		targetRef.current = Math.max(0, Math.min(100, target))
		if (rafRef.current != null) return
		const tick = () => {
			setProgress(prev => {
				const next = prev + (targetRef.current - prev) * 0.12
				const done = Math.abs(next - targetRef.current) < 0.5
				return done ? targetRef.current : next
			})
			rafRef.current =
				Math.abs(targetRef.current - progressState) >= 0.5
					? requestAnimationFrame(tick)
					: null
		}
		rafRef.current = requestAnimationFrame(tick)
	}

	useEffect(
		() => () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
		},
		[]
	)

	return (
		<StyledCard
			className='flex flex-col justify-center'
			onMouseEnter={() => animateTo(100)}
			onMouseLeave={() => animateTo(0)}
			onFocus={() => animateTo(100)}
			onBlur={() => animateTo(0)}
		>
			<Progress progress={progressState} />
			<div className='title'>{title}</div>
			<div className='subtitle'>{subtitle}</div>
		</StyledCard>
	)
}

const StyledCard = styled.div`
	width: 370px;
	height: 370px;
	border-radius: 100%;
	padding: 51px 50px 0 63px;
	margin-top: 5px;
	position: relative;

	svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	@media (max-width: 1000px) {
		width: 300px;
		height: 300px;
		padding: 20px;
		text-align: center;
		svg {
			width: 300px;
			height: 300px;
		}
	}

	.title {
		font-weight: 400;
		font-size: 17px;
		line-height: 130%;
		letter-spacing: 1%;
		text-transform: uppercase;
		margin-bottom: 17px;
	}
	.subtitle {
		font-weight: 200;
		font-size: 14px;
		line-height: 20px;
		color: #ffffffa8;
	}
`
