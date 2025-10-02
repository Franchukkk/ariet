'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
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
	lng
}: {
	productId: number | string | null | ''
	lng?: Lng
}) => {
	const sp = useSearchParams()
	const currentLng: Lng = resolveLng(sp, lng)

	const { i18n } = useTranslation('common')

	const [possibilities, setPossibilities] = useState<Possibility[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	// sync i18n for any internal strings/icons
	useEffect(() => {
		const cur = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		if (cur !== currentLng) void i18n.changeLanguage(currentLng)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLng])

	useEffect(() => {
		let alive = true

		if (!productId) {
			setPossibilities([])
			setLoading(false)
			return
		}

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
				cache: 'no-store'
			}
		)
			.then(async r => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`)
				const json = await r.json()
				if (!alive) return
				const list: Possibility[] = Array.isArray(json?.possibilities)
					? json.possibilities.map((p: any) => ({
							name: p?.name ?? '',
							description: p?.description ?? null
						}))
					: []
				setPossibilities(list)
			})
			.catch(() => alive && setPossibilities([]))
			.finally(() => alive && setLoading(false))

		return () => {
			alive = false
		}
	}, [productId, currentLng])

	// ТУТ головна зміна: підставляємо subtitle з description
	const slides = useMemo(() => {
		const n = possibilities.length
		if (!n) return []
		return possibilities.map((p, i) => ({
			title: p.name || '',
			subtitle: p.description ?? '', // ← було undefined
			progress: Math.round(((i + 1) / n) * 100)
		}))
	}, [possibilities])

	if (loading || slides.length === 0) return <StyledList />

	return (
		<StyledList>
			<Swiper
				spaceBetween={20}
				modules={[SwiperPagination, Autoplay]}
				autoplay={{ delay: 2000, disableOnInteraction: false }}
				pagination={{ clickable: true }}
				breakpoints={{
					500: { slidesPerView: 'auto', centeredSlides: true },
					0: { slidesPerView: 1, centeredSlides: true }
				}}
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
	.swiper-wrapper {
		padding-bottom: 80px;
	}
	.swiper-pagination {
		bottom: 0;
	}
`
