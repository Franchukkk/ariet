'use client'

import Image from 'next/image'
import styled from 'styled-components'

export default function Img() {
	return (
		<Wrapper>
			<Background
				src='/result.svg'
				alt='background'
				width={700}
				height={700}
				priority
			/>
			<Foreground
				src='/404.svg'
				alt='404 - Not Found'
				width={700}
				height={700}
				priority
			/>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	aspect-ratio: 1/1;
`

const Background = styled(Image)`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: contain;
	z-index: 0;
	pointer-events: none;
`

const Foreground = styled(Image)`
	position: absolute;
	top: 50%;
	left: 50%;
	width: 70%;
	height: auto;
	transform: translate(-50%, -50%);
	z-index: 1;

	@media (max-width: 768px) {
		width: 90%;
	}
`
