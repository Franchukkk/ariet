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

export const List = ({
	productId,
	lng // опціонально: якщо батьківський компонент знає мову — можна передавати сюди
}: {
	productId: number | string | null | ''
	lng?: Lng
}) => {
	const sp = useSearchParams()
	// мова з пропа або з URL (?lng=ru|en)
	const urlLng = (sp?.get('lng') || 'ru').split('-')[0] as Lng
	const currentLng: Lng = (lng ?? urlLng) === 'en' ? 'en' : 'ru'

	const { i18n } = useTranslation('common')

	const [possibilities, setPossibilities] = useState<Possibility[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	// синхронізуємо i18n із мовою (для локалізованих підписів усередині List, якщо з’являться)
	useEffect(() => {
		;(async () => {
			const cur = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
			if (cur !== currentLng) await i18n.changeLanguage(currentLng)
		})()
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

		// ✅ через локальний проксі, щоб легко додати мову й куки
		fetch(
			`/api/catalog/products/${productId}?lng=${currentLng}&_=${Date.now()}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				cache: 'no-store'
			}
		)
			// ❗ альтернатива без проксі:
			// fetch(`https://rpktask.sytes.net/api/catalog/products/${productId}/`, {
			//   method: 'GET',
			//   credentials: 'include',
			//   headers: { 'Content-Type': 'application/json', 'Accept-Language': currentLng },
			//   cache: 'no-store',
			// })
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

	const slides = useMemo(() => {
		const n = possibilities.length
		if (!n) return []
		return possibilities.map((p, i) => ({
			title: p.name || '',
			subtitle: undefined,
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
