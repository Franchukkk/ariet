'use client'

import type { StaticImageData } from 'next/image'
import styled from 'styled-components'

import { HomeLink } from './HomeLink'
import { Title } from './Title'

type ImgLike = string | StaticImageData

interface Props {
	title: string
	photo: ImgLike
	categoryId?: number
	lng?: 'ru' | 'en'
}

export const Card = ({ title, photo, categoryId, lng }: Props) => (
	<StyledCard
		className='flex flex-col justify-end'
		$photo={photo}
	>
		<Title title={title} />

		<HomeLink
			categoryId={categoryId}
			lng={lng}
		/>
	</StyledCard>
)

const StyledCard = styled.div<{ $photo: ImgLike }>`
	border-radius: 24px;
	height: 400px;
	width: 350px;
	background: ${({ $photo }) =>
		`url(${typeof $photo === 'string' ? $photo : $photo.src}) center/cover no-repeat`};

	@media (max-width: 700px) {
		height: 500px;
	}
`
