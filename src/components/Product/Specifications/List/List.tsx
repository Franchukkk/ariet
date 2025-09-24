'use client'

import type { StaticImageData } from 'next/image'
import styled from 'styled-components'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import cardBorder from '@/assets/img/specification-border.png'

import { Card } from './Card/Card'

type ImgLike = string | StaticImageData
type Item = { name?: string; description?: string; image?: string }

export const List = ({ items }: { items: Item[] }) => {
	if (!items || items.length === 0) return null

	const total = items.length

	return (
		<StyledList $cardBorder={cardBorder}>
			<Swiper
				spaceBetween={25}
				modules={[Pagination, Autoplay]}
				autoplay={{ delay: 2000, disableOnInteraction: true }}
				pagination={{ clickable: true }}
				breakpoints={{ 1024: { slidesPerView: 2 }, 0: { slidesPerView: 1 } }}
			>
				{items.map((it, index) => (
					<SwiperSlide key={index}>
						<Card
							title={it.name || ''}
							subtitle={it.description || ''}
							slide={index + 1}
							totalSlides={total}
							photo={(it.image || '') as any}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</StyledList>
	)
}

const StyledList = styled.div<{ $cardBorder: ImgLike }>`
	.swiper-slide {
		margin-bottom: 84px;
		position: relative;
		background: ${({ $cardBorder }) =>
			`url(${typeof $cardBorder === 'string' ? $cardBorder : $cardBorder.src}) center/cover no-repeat`};
	}
	@media (max-width: 1000px) {
		.swiper-slide {
			margin-bottom: 34px;
		}
	}
`
