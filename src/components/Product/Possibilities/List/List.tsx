'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css/pagination'
import { Autoplay, Pagination as SwiperPagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Card } from './Card/Card'

type Possibility = { name: string; description?: string | null }
type Lng = 'ru' | 'en'

/* helpers */
const readCookie = (name: string): string | null => {
	if (typeof document === 'undefined') return null
	const m = document.cookie.match(
		new RegExp('(?:^|; )' + name.replace(/([$?*|{}\\^])/g, '\\$1') + '=([^;]*)')
	)
	return m ? decodeURIComponent(m[1]) : null
}
const resolveLng = (sp: URLSearchParams | null, prop?: Lng): Lng => {
	if (prop === 'en' || prop === 'ru') return prop
	const q = (sp?.get('lng') || '').split('-')[0].toLowerCase()
	if (q === 'en' || q === 'ru') return q as Lng
	const c = (readCookie('lng') || '').split('-')[0].toLowerCase()
	if (c === 'en' || c === 'ru') return c as Lng
	return 'ru'
}

export const List = ({
	productId,
	lng,
	initial
}: {
	productId: number | string | null | ''
	lng?: Lng
	/** якщо дані вже є зверху – підставляємо і не робимо зайвий fetch */
	initial?: { name: string; description?: string | null }[]
}) => {
	const sp = useSearchParams()
	const currentLng: Lng = resolveLng(sp, lng)

	const { i18n } = useTranslation('common')

	const [possibilities, setPossibilities] = useState<Possibility[]>(
		initial ?? []
	)
	const [loading, setLoading] = useState<boolean>(!initial)

	// sync i18n (локальні тексти/іконки)
	useEffect(() => {
		const cur = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		if (cur !== currentLng) void i18n.changeLanguage(currentLng)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLng])

	// підвантаження лише якщо немає initial
	useEffect(() => {
		if (!productId) {
			setPossibilities([])
			setLoading(false)
			return
		}
		if (initial && initial.length) {
			setPossibilities(initial)
			setLoading(false)
			return
		}
		const ac = new AbortController()
		setLoading(true)
		fetch(
			`/api/catalog/products/${productId}?lng=${currentLng}&_=${Date.now()}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept-Language': currentLng.toUpperCase()
				},
				cache: 'no-store',
				signal: ac.signal
			}
		)
			.then(async r => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`)
				const json = await r.json()
				const list: Possibility[] = Array.isArray(json?.possibilities)
					? json.possibilities.map((p: any) => ({
							name: p?.name ?? '',
							description: p?.description ?? null
						}))
					: []
				setPossibilities(list)
			})
			.catch(e => {
				if ((e as any)?.name !== 'AbortError') setPossibilities([])
			})
			.finally(() => setLoading(false))
		return () => ac.abort()
	}, [productId, currentLng, initial])

	// слайди (subtitle з description)
	const slides = useMemo(() => {
		const n = possibilities.length
		if (!n) return []
		return possibilities.map((p, i) => ({
			title: p.name || '',
			subtitle: p.description ?? '',
			progress: Math.round(((i + 1) / n) * 100)
		}))
	}, [possibilities])

	// автоплей тільки коли секція видима
	const rootRef = useRef<HTMLDivElement>(null)
	const swiperRef = useRef<SwiperType | null>(null)
	useEffect(() => {
		if (!rootRef.current) return
		const m = window.matchMedia('(prefers-reduced-motion: reduce)')
		const io = new IntersectionObserver(
			([entry]) => {
				const sw = swiperRef.current
				if (!sw?.autoplay) return
				if (m.matches) {
					sw.autoplay.stop()
					return
				}
				entry.isIntersecting ? sw.autoplay.start() : sw.autoplay.stop()
			},
			{ threshold: 0.2 }
		)
		io.observe(rootRef.current)
		return () => io.disconnect()
	}, [])

	if (loading || slides.length === 0) return <StyledList ref={rootRef} />

	return (
		<StyledList ref={rootRef}>
			<Swiper
				spaceBetween={20}
				modules={[SwiperPagination, Autoplay]}
				autoplay={{ delay: 2000, disableOnInteraction: false }}
				pagination={{ clickable: true }}
				breakpoints={{
					500: { slidesPerView: 'auto', centeredSlides: true },
					0: { slidesPerView: 1, centeredSlides: true }
				}}
				onSwiper={sw => {
					swiperRef.current = sw
				}}
				observer
				observeParents
				watchSlidesProgress
			>
				{slides.map((s, i) => (
					<SwiperSlide key={i}>
						<Card
							title={s.title}
							subtitle={s.subtitle}
							progress={s.progress}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</StyledList>
	)
}

const StyledList = styled.div`
	.swiper-wrapper {
		padding-bottom: 80px;
	}
	.swiper-pagination {
		bottom: 0;
	}

	.swiper-slide {
		margin-bottom: 80px;
		width: max-content !important;
		height: auto !important;
	}
	@media (max-width: 1000px) {
		.swiper-slide {
			margin-bottom: 60px;
			width: 100% !important;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
`
