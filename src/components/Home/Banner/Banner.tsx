'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import decorBgUrl from '@/assets/img/Banner.svg?url'
import bg from '@/assets/img/home-bg-1.png'

import { Card } from './Card/Card'
import { Footer } from './Footer'
import { Navigations } from './Navigations'
import { Slides } from './Slides'

type Category = {
	id: number
	name?: string
	name_ru?: string
	name_en?: string
	image?: string | { url?: string } | null
	photo?: string | { url?: string } | null
	banner?: string | { url?: string } | null
}

const MAX_SLIDES = 6

type SlideItem = { id: number; title: string; photo: any }

export const Banner = () => {
	const { i18n } = useTranslation('common')

	const swiperRef = useRef<SwiperType | null>(null)
	const [activeSlide, setActiveSlide] = useState(0)
	const [slides, setSlides] = useState<SlideItem[]>([])

	const currentLng = useMemo<'ru' | 'en'>(() => {
		const raw = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		return raw === 'en' ? 'en' : 'ru'
	}, [i18n.language, i18n.resolvedLanguage])

	useEffect(() => {
		let cancelled = false

		;(async () => {
			try {
				const res = await fetch(
					`/front-proxy/categories?lng=${currentLng}&page_size=${MAX_SLIDES}&_=${Date.now()}`,
					{ cache: 'no-store' }
				)
				if (!res.ok) throw new Error(`HTTP ${res.status}`)

				const json = await res.json()
				const arr: Category[] = Array.isArray(json)
					? json
					: (json?.results ?? [])

				const mapped: SlideItem[] = arr.map(c => {
					const title =
						(currentLng === 'en' ? c.name_en : c.name_ru) ?? c.name ?? ''
					const rawImg: any = c.image ?? c.photo ?? c.banner ?? null
					const src = (typeof rawImg === 'string' ? rawImg : rawImg?.url) || bg
					return { id: c.id, title: title || '—', photo: src }
				})

				const next = mapped.slice(0, MAX_SLIDES)

				if (!cancelled && next.length) {
					setSlides(next)
					setActiveSlide(0)
					if (swiperRef.current) swiperRef.current.slideTo(0, 0)
				} else if (!cancelled) {
					setSlides([{ id: 0, title: '—', photo: bg }])
				}
			} catch {
				if (!cancelled) {
					setSlides([{ id: 0, title: '—', photo: bg }])
				}
			}
		})()

		return () => {
			cancelled = true
		}
	}, [currentLng])

	const handleNavigation = (isNext?: boolean) => {
		if (!swiperRef.current) return
		isNext ? swiperRef.current.slideNext() : swiperRef.current.slidePrev()
		setActiveSlide(swiperRef.current.activeIndex)
	}

	const handleNavigateToSlide = (index: number) => {
		if (!swiperRef.current) return
		const bounded = Math.max(0, Math.min(index, Math.max(0, slides.length - 1)))
		swiperRef.current.slideTo(bounded)
		setActiveSlide(swiperRef.current.activeIndex)
	}

	return (
		<StyledBanner className='main-wrapper'>
			<div className='relative'>
				<Slides
					slides={slides.map(s => s.title)}
					active={activeSlide}
					onNavigate={handleNavigateToSlide}
				/>
				<Navigations onNavigate={handleNavigation} />

				<Swiper
					modules={[Navigation]}
					slidesPerView={1}
					loop={false}
					navigation={false}
					onBeforeInit={(swiper: SwiperType) => {
						swiperRef.current = swiper
					}}
					onSlideChange={sw => setActiveSlide(sw.activeIndex)}
				>
					{slides.map(({ id, title, photo }, i) => (
						<SwiperSlide key={id ?? i}>
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
		</StyledBanner>
	)
}

const StyledBanner = styled.div`
	position: relative;
	margin-bottom: 120px;
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

const ImgClamp = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;

	background-color: #000;
	background-image: url(${decorBgUrl});
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;

	min-height: 700px;

	img,
	picture img {
		width: auto;
		height: auto;
		max-height: 420px;
		max-width: 60vw;
		object-fit: contain;
		image-rendering: auto;
	}

	@media (max-width: 1200px) {
		min-height: 520px;
		img,
		picture img {
			max-height: 380px;
		}
	}
	@media (max-width: 1000px) {
		min-height: 460px;
		img,
		picture img {
			max-height: 340px;
		}
	}
	@media (max-width: 700px) {
		min-height: 380px;
		img,
		picture img {
			max-height: 300px;
		}
	}
`
