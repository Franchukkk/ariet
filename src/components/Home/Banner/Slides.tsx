'use client'

import { memo } from 'react'
import styled from 'styled-components'

import ArrowSvg from '@/assets/img/slide-arrow.svg'

interface Props {
	slides: string[]
	active: number
	onNavigate: (index: number) => void
}

const MAX_SLIDES = 10

export const Slides = memo(function Slides({
	slides,
	active,
	onNavigate
}: Props) {
	const items = (slides ?? []).slice(0, MAX_SLIDES)

	return (
		<StyledSlides className='flex flex-col gap-[14px]'>
			{items.map((s, i) => (
				<div
					key={`${i}-${s}`}
					role='button'
					tabIndex={0}
					className={`flex items-center gap-2.5 ${active === i && 'active'}`}
					onClick={() => onNavigate(i)}
					onKeyDown={e => {
						if (e.key === 'Enter' || e.key === ' ') onNavigate(i)
					}}
				>
					{s}
					<ArrowSvg aria-label='icon' />
				</div>
			))}
		</StyledSlides>
	)
})

const StyledSlides = styled.div`
	position: absolute;
	top: 36px;
	left: 26px;
	font-weight: 400;
	font-size: 15px;
	line-height: 100%;
	letter-spacing: 0%;
	text-transform: uppercase;
	color: #ffffff5e;
	z-index: 3;

	div {
		cursor: pointer;
		img {
			opacity: 0;
			transition: all 0.3s;
		}
		&:hover,
		&.active {
			color: #ffffff;
			img {
				opacity: 1;
			}
		}
	}

	@media (max-width: 700px) {
		display: none;
	}
`
