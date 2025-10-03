'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import photoFallback from '@/assets/img/module.png'

import { ModelCard } from '../../../ModelCard/ModelCard'

const API_BASE = 'https://test.arietpower.com/api'

type ApiImage = { image: string; alt_text?: string }
type ApiVariant = { id: number; images?: ApiImage[]; price?: string }
type ApiCategory = { id: number; name: string; image?: string }
type ApiProduct = {
	id: number
	name: string
	description?: string
	sku?: string
	category?: ApiCategory
	variants?: ApiVariant[]
	main_feature_image?: string
}

type CardItem = {
	id: number | string
	title: string
	category: string
	photo: string
	link: string
	isNew: boolean
}

const toAbs = (url?: string) => {
	if (!url) return ''
	if (/^https?:\/\//i.test(url)) return url
	return `https://test.arietpower.com${url.startsWith('/') ? '' : '/'}${url}`
}

export const List = () => {
	const { t } = useTranslation('common')
	const [items, setItems] = useState<CardItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isMobile, setIsMobile] = useState(false)

	// мобільний брейкпойнт (на мобілі залишаємо рівно 5 карток)
	useEffect(() => {
		const mq = window.matchMedia('(max-width: 768px)')
		const apply = (e: MediaQueryList | MediaQueryListEvent) =>
			setIsMobile(!!e.matches)
		apply(mq)
		const handler = (e: MediaQueryListEvent) => apply(e)
		mq.addEventListener?.('change', handler)
		return () => mq.removeEventListener?.('change', handler)
	}, [])

	const FALLBACK: CardItem[] = useMemo(
		() => [
			{
				id: '1',
				title: t('products.online_ups'),
				category: t('products.single_phase'),
				isNew: false,
				photo: photoFallback.src,
				link: '/products/1'
			},
			{
				id: '2',
				title: t('products.online_ups'),
				category: t('products.single_phase'),
				isNew: true,
				photo: photoFallback.src,
				link: '/products/2'
			},
			{
				id: '3',
				title: t('products.online_ups'),
				category: t('products.single_phase'),
				isNew: false,
				photo: photoFallback.src,
				link: '/products/3'
			},
			{
				id: '4',
				title: t('products.online_ups'),
				category: t('products.single_phase'),
				isNew: false,
				photo: photoFallback.src,
				link: '/products/4'
			},
			{
				id: '5',
				title: t('products.online_ups'),
				category: t('products.single_phase'),
				isNew: false,
				photo: photoFallback.src,
				link: '/products/5'
			}
		],
		[t]
	)

	useEffect(() => {
		let abort = false
		const load = async () => {
			setLoading(true)
			setError(null)
			try {
				const r = await fetch(`${API_BASE}/catalog/products/?page_size=12`, {
					headers: { 'Content-Type': 'application/json' },
					cache: 'no-store'
				})
				if (!r.ok) throw new Error(`HTTP ${r.status}`)
				const json = await r.json()
				const list: ApiProduct[] = Array.isArray(json)
					? json
					: Array.isArray(json?.results)
						? json.results
						: []

				const mapped: CardItem[] = list.map(p => {
					const firstImg =
						p.main_feature_image ||
						p.variants?.[0]?.images?.[0]?.image ||
						p.category?.image ||
						''
					return {
						id: p.id,
						title: p.name || t('products.online_ups'),
						category: p.category?.name || t('products.single_phase'),
						photo: toAbs(firstImg) || photoFallback.src,
						link: `/products/${p.id}`,
						isNew: false
					}
				})

				if (!abort) setItems(mapped)
			} catch (e) {
				if (!abort) {
					setItems([])
					setError('Failed to load')
				}
			} finally {
				if (!abort) setLoading(false)
			}
		}
		load()
		return () => {
			abort = true
		}
	}, [t])

	// що показуємо: 5 на мобілці, інакше — все
	const data = useMemo(() => {
		const base = items.length ? items : FALLBACK
		return isMobile ? base.slice(0, 5) : base
	}, [items, FALLBACK, isMobile])

	return (
		<StyledList>
			{loading && <Info>Завантаження…</Info>}
			{error && <Info className='error'>{error}</Info>}
			{!loading && !error && data.length === 0 && (
				<Info>Нічого не знайдено</Info>
			)}

			{!loading && !error && data.length > 0 && (
				<CardGlobalFix>
					<Swiper
						spaceBetween={0}
						modules={[Pagination, Autoplay]}
						autoplay={{ delay: 2000, disableOnInteraction: true }}
						pagination={{ clickable: true, dynamicBullets: false }}
						breakpoints={{
							1024: { slidesPerView: 3 },
							800: { slidesPerView: 2 },
							0: { slidesPerView: 1 }
						}}
					>
						{data.map(m => (
							<SwiperSlide key={m.id}>
								<CardSizer className='card-sizer'>
									<ModelCard
										photo={m.photo}
										title={m.title}
										category={m.category}
										link={m.link}
										isNew={m.isNew}
									/>
								</CardSizer>
							</SwiperSlide>
						))}
					</Swiper>
				</CardGlobalFix>
			)}
		</StyledList>
	)
}

/* ============ styles ============ */

const Info = styled.p`
	color: #ffffffc9;
	padding: 14px 0 6px;
	text-align: center;
	&.error {
		color: #ff6b6b;
	}
`

const StyledList = styled.div`
	--card-h: 500px; /* базова однакова висота картки */

	border-top: 1px dashed #ffffff50;
	padding: 12px 0 14px;

	.swiper-slide {
		border-right: 1px dashed #ffffff50;
		position: relative;

		&::before {
			content: '';
			display: block;
			width: 100%;
			height: 1px;
			border-bottom: 1px dashed #ffffff50;
			position: absolute;
			bottom: -14px;
			right: 0;
			left: 0;
		}

		&:last-child {
			border-right: none;
		}
	}

	.swiper-wrapper {
		padding-bottom: 76px;
	}

	@media (max-width: 1200px) {
		--card-h: 440px;
	}
	@media (max-width: 1000px) {
		.swiper-slide {
			border: none !important;
		}
		--card-h: 460px;
	}
	@media (max-width: 600px) {
		--card-h: 480px;
	}
`

/* вирівнювач висоти для кожної картки */
const CardSizer = styled.div`
	height: var(--card-h);
	display: flex;

	/* корінь ModelCard займає всю висоту */
	& > * {
		flex: 1;
		min-height: 0;
		height: 100%;
	}
`

/* фікси: великі фото, заголовок 2 рядки, CTA/стрілка — внизу */
const CardGlobalFix = styled.div`
	.swiper-slide .card-sizer {
		display: flex;
		flex-direction: column;
		height: var(--card-h);
	}

	/* робимо корінь ModelCard флекс-колонкою */
	.swiper-slide .card-sizer > * {
		display: flex !important;
		flex-direction: column;
	}

	/* останній дочірній елемент (стрілка/CTA) — прибиваємо донизу */
	.swiper-slide .card-sizer > * > :last-child {
		margin-top: auto !important;
	}

	/* великі фото не «розпирають» картку */
	.swiper-slide .card-sizer img {
		display: block;
		width: 100%;
		max-height: calc(var(--card-h) * 0.55);
		height: auto;
		object-fit: contain;
	}

	/* заголовок максимум 2 рядки */
	.swiper-slide .card-sizer :is(h1, h2, h3, h4, .title, .card-title) {
		margin-top: 10px;
		min-height: 2.8em;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (max-width: 600px) {
		.swiper-slide .card-sizer img {
			max-height: calc(var(--card-h) * 0.5);
		}
	}
`
