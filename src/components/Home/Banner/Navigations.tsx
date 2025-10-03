'use client'

import { memo } from 'react'
import styled from 'styled-components'

import Arrow from '@/assets/img/arrow-next.svg'

interface Props {
	onNavigate: (isNext?: boolean) => void
}

export const Navigations = memo(function Navigations({ onNavigate }: Props) {
	return (
		<StyledNavigations className='flex items-center justify-between'>
			<button
				type='button'
				aria-label='Previous slide'
				onClick={() => onNavigate()}
			>
				<Arrow />
			</button>
			<button
				type='button'
				className='next'
				aria-label='Next slide'
				onClick={() => onNavigate(true)}
			>
				<Arrow />
			</button>
		</StyledNavigations>
	)
})

const StyledNavigations = styled.div`
	position: absolute;
	top: 50%;
	right: 28px;
	left: 0;
	transform: translateY(-50%);
	z-index: 3;

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 43px;
		height: 43px;
		border: 1px dashed #ffffff80;
		border-radius: 4px;

		path {
			transition: all 0.3s;
		}
		&.next {
			svg {
				transform: rotate(180deg);
			}
		}
		&:hover {
			background: #4bc785;
			border: 1px solid #4bc785;
			path {
				fill: #000;
			}
		}
	}
`
