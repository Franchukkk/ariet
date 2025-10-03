'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import bg from '@/assets/img/home-bg-1.png'

import { useCategories } from '@/hooks/useCategories'

import { Background } from './Background'
import { Card } from './Card/Card'
import { Footer } from './Footer'
import { Navigations } from './Navigations'
import { Slides } from './Slides'
import type { ICategory, Lng } from '@/lib/server-data'

const MAX_SLIDES = 10
type SlideItem = { id: number; title: string; photo: any }

export const Banner = ({
	initialCategories,
	initialLng
}: {
	initialCategories?: ICategory[]
	initialLng?: Lng
}) => {
	const { i18n } = useTranslation('common')
	const swiperRef = useRef<SwiperType | null>(null)
	const [activeSlide, setActiveSlide] = useState(0)

	const currentLng: Lng = useMemo(() => {
		if (initialLng) return initialLng
		const raw = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		return raw === 'en' ? 'en' : 'ru'
	}, [i18n.language, i18n.resolvedLanguage, initialLng])

	const { categories, loading } = useCategories({
		lng: currentLng,
		pageSize: 99,
		enabled: !initialCategories
	})

	const categoriesSource: ICategory[] = initialCategories ?? categories

	const slides: SlideItem[] = useMemo(() => {
		const mapped = (categoriesSource ?? []).map(c => ({
			id: c.id,
			title: c.name || '—',
			photo: c.image || bg
		}))
		const next = mapped.slice(0, MAX_SLIDES)
		return next.length ? next : [{ id: -1, title: '—', photo: bg }]
	}, [categoriesSource])

	useEffect(() => {
		setActiveSlide(0)
		if (swiperRef.current) swiperRef.current.slideTo(0, 0)
	}, [slides])

	const handleNavigation = useCallback((isNext?: boolean) => {
		const sw = swiperRef.current
		if (!sw) return
		isNext ? sw.slideNext() : sw.slidePrev()
	}, [])

	const handleNavigateToSlide = useCallback(
		(index: number) => {
			const sw = swiperRef.current
			if (!sw) return
			const max = Math.max(0, slides.length - 1)
			const bounded = Math.min(Math.max(index, 0), max)
			if (bounded === sw.activeIndex) return
			sw.slideTo(bounded)
		},
		[slides.length]
	)

	const slideTitles = useMemo(() => slides.map(s => s.title), [slides])

	return (
		<StyledBanner className='main-wrapper'>
			<Stage>
				<BGLayer>
					<Background
						rotateDeg={80}
						waveAngleDeg={-45}
						centerNarrowWidth={0.9}
						centerNarrowStrength={0.7}
						amplitude={0.3}
						waveFreq={2.1}
						waveFlow={0.9}
						crossFlow={0.25}
						waveTimeDiv={14000}
						crossFreq={0.6}
						panSpeed={0}
						scale={1}
						zoom={1.0}
						pointSize={0.02}
						color={0x00ffc3}
					/>
				</BGLayer>

				<div className='relative overlay'>
					<Slides
						slides={slideTitles}
						active={activeSlide}
						onNavigate={handleNavigateToSlide}
					/>
					<Navigations onNavigate={handleNavigation} />

					<Swiper
						modules={[Navigation]}
						slidesPerView={1}
						loop={false}
						navigation={false}
						observer
						observeParents
						observeSlideChildren
						speed={500}
						onBeforeInit={(swiper: SwiperType) => {
							swiperRef.current = swiper
						}}
						onSlideChange={sw => setActiveSlide(sw.activeIndex)}
					>
						{slides.map(({ id, title, photo }) => (
							<SwiperSlide key={id}>
								<ImgClamp>
									<Card
										title={title}
										photo={photo}
										categoryId={id}
										lng={currentLng}
									/>
								</ImgClamp>
							</SwiperSlide>
						))}
					</Swiper>

					<Footer
						active={activeSlide}
						total={slides.length}
						nextSlide={
							slides[activeSlide === slides.length - 1 ? 0 : activeSlide + 1]
								?.title
						}
					/>
				</div>
			</Stage>
		</StyledBanner>
	)
}

const StyledBanner = styled.div`
	position: relative;
	margin-bottom: 120px;

	.overlay {
		min-height: 700px;
	}
	@media (max-width: 1200px) {
		.overlay {
			min-height: 520px;
		}
	}
	@media (max-width: 1000px) {
		.overlay {
			min-height: 460px;
		}
	}
	@media (max-width: 700px) {
		.overlay {
			min-height: 380px;
		}
	}

	.overlay .swiper,
	.overlay .swiper-wrapper,
	.overlay .swiper-slide {
		min-height: inherit;
	}

	.navigation-btns {
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
	}

	@media (max-width: 1000px) {
		margin-bottom: 40px;
	}
`

const Stage = styled.div`
	position: relative;
	background: #000;
	isolation: isolate;
`

const BGLayer = styled.div`
	position: absolute;
	inset: 0;
	z-index: 0;
	pointer-events: none;
`

const ImgClamp = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: transparent;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	min-height: 700px;

	img,
	picture img {
		width: auto;
		height: auto;
		max-height: 460px; /* було 420px — трохи вище під ширшу пропорцію */
		max-width: 72vw; /* було 60vw — трохи ширше */
		object-fit: contain;
		image-rendering: auto;
	}

	@media (max-width: 1200px) {
		min-height: 520px;
		img,
		picture img {
			max-height: 400px; /* було 380px */
		}
	}
	@media (max-width: 1000px) {
		min-height: 460px;
		img,
		picture img {
			max-height: 360px; /* було 340px */
		}
	}
	@media (max-width: 700px) {
		min-height: 380px;
		img,
		picture img {
			max-height: 320px; /* було 300px */
		}
	}
`
