'use client'

import type { StaticImageData } from 'next/image'
import styled from 'styled-components'

import { Slide } from '@/components/Product/Specifications/List/Card/Slide'
import { Subtitle } from '@/components/Product/Specifications/List/Card/Subtitle'
import { Title } from '@/components/Product/Specifications/List/Card/Title'

type ImgLike = string | StaticImageData

interface Props {
	title: string
	subtitle: string
	slide: number
	totalSlides: number
	photo: string
}

export const Card = ({ title, subtitle, slide, totalSlides, photo }: Props) => (
	<StyledCard
		$photo={photo}
		className='flex flex-col justify-end'
	>
		<Title title={title} />
		<Subtitle subtitle={subtitle} />
		<Slide
			slide={slide}
			totalSlides={totalSlides}
		/>
	</StyledCard>
)

const StyledCard = styled.div<{ $photo: string }>`
	position: relative;
	padding: 37px 27px;
	height: 446px;
	margin: 36px 44px;
	background: url(${({ $photo }) => $photo}) center/cover no-repeat;
	border-radius: 8px;
	overflow: hidden;

	> * {
		position: relative;
		z-index: 1;
	}

	@media (max-width: 1000px) {
		padding: 20px;
		margin: 0;
		width: 100%;

		&::after {
			background: linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0) 80%);
		}
	}
`
