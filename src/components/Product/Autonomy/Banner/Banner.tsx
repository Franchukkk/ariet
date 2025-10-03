'use client'

import Image, { StaticImageData } from 'next/image'
import styled from 'styled-components'

import batteryFallback from '@/assets/big-logo.svg'

import { Background } from './Background'

export const Banner = ({
	featureName,
	featureImageUrl
}: {
	featureName: string
	featureImageUrl?: string | null
}) => {
	const imgSrc: string | StaticImageData =
		featureImageUrl && featureImageUrl.trim().length
			? featureImageUrl
			: batteryFallback

	return (
		<StyledBanner>
			<h3>{featureName}</h3>
			<Image
				src={imgSrc}
				alt='battery img'
				className='block mx-auto'
				width={460}
				height={360}
			/>
			<Background />
		</StyledBanner>
	)
}

const StyledBanner = styled.div`
	padding: 80px 49px 32px;
	border-right: 1px dashed #313131;
	position: relative;
	overflow: hidden;

	h3 {
		font-weight: 600;
		font-size: 50px;
		line-height: 48.91px;
		letter-spacing: 0%;
		text-transform: uppercase;
		margin-bottom: 42px;
	}

	@media (max-width: 1000px) {
		padding: 20px;

		img {
			width: 250px;
			height: auto;
		}

		h3 {
			font-size: 30px;
			line-height: 1;
			text-align: center;
		}
	}
`
