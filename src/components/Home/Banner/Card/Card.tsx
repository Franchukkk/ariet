'use client'

import type { StaticImageData } from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { HomeLink } from './HomeLink'
import { Title } from './Title'

type ImgLike = string | StaticImageData | null | undefined

interface Props {
	title: string
	photo: ImgLike
	categoryId?: number
	lng?: 'ru' | 'en'
}

export const Card = ({ title, photo, categoryId, lng }: Props) => {
	const [loaded, setLoaded] = useState(false)

	// Безпечне отримання src
	const src = useMemo(() => {
		if (typeof photo === 'string') return photo
		if (
			photo &&
			typeof photo === 'object' &&
			'src' in photo &&
			typeof photo.src === 'string'
		) {
			return photo.src
		}
		return undefined
	}, [photo])

	useEffect(() => {
		// якщо немає картинки — вважаємо "завантажено", щоб не показувати спінер
		if (!src) {
			setLoaded(true)
			return
		}
		setLoaded(false)
		const img = new Image()
		img.onload = () => setLoaded(true)
		img.onerror = () => setLoaded(true) // ховаємо спінер навіть при помилці
		img.src = src
		return () => {
			img.onload = null
			img.onerror = null
		}
	}, [src])

	return (
		<StyledCard
			className='flex flex-col justify-end'
			$bg={loaded && src ? src : ''}
		>
			{!loaded && (
				<SpinnerOverlay aria-label='loading image'>
					<Spinner />
				</SpinnerOverlay>
			)}

			<Title title={title} />
			<HomeLink
				categoryId={categoryId}
				lng={lng}
			/>
		</StyledCard>
	)
}

const StyledCard = styled.div<{ $bg?: string }>`
	border-radius: 24px;
	height: 400px;
	width: 350px;
	background: ${({ $bg }) =>
		$bg ? `url(${$bg}) center/cover no-repeat` : 'transparent'};

	@media (max-width: 700px) {
		height: 500px;
	}
`

const SpinnerOverlay = styled.div`
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	z-index: 1;
`

const spin = keyframes`to { transform: rotate(360deg); }`

const Spinner = styled.div`
	width: 36px;
	height: 36px;
	border-radius: 50%;
	border: 3px solid #ffffff80;
	border-top-color: #4bc785;
	animation: ${spin} 0.7s linear infinite;
`
