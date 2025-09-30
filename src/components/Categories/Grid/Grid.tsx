'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Card } from './Card'

type Category = { id: number; name: string; image?: string | null }

export const Grid = () => {
	const { i18n } = useTranslation('common')
	const [items, setItems] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const currentLng = useMemo<'ru' | 'en'>(() => {
		const raw = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		return raw === 'en' ? 'en' : 'ru'
	}, [i18n.language, i18n.resolvedLanguage])

	useEffect(() => {
		let mounted = true
		const controller = new AbortController()

		;(async () => {
			try {
				setLoading(true)
				setError(null)
				const res = await fetch(
					`/api/proxy/categories?lng=${currentLng}&page_size=5&_=${Date.now()}`,
					{ cache: 'no-store', signal: controller.signal }
				)
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const json = await res.json()
				const arr = Array.isArray(json) ? json : (json?.results ?? [])

				const data = arr.slice(0, 5).map((c: any) => ({
					id: c.id,
					name: c[`name_${currentLng}`] ?? c.name ?? '',
					image: c.image ?? null
				}))

				if (mounted) setItems(data)
			} catch (e: any) {
				if (e?.name !== 'AbortError') setError(e?.message || 'Failed to load')
			} finally {
				if (mounted) setLoading(false)
			}
		})()

		return () => {
			mounted = false
			controller.abort()
		}
	}, [currentLng])

	if (loading || error) return null

	const LAYOUT = [
		{ className: 'row-span-2', showTop: true },
		{ className: 'row-span-2', showTop: true },
		{ className: 'col-start-3 col-end-5', showTop: false },
		{
			className: 'row-start-2 row-end-3 col-start-3 col-end-5',
			showTop: false
		},
		{ className: 'col-start-5 col-end-8 row-span-2', showTop: false }
	]

	return (
		<StyledGrid>
			{items.map((cat, i) => {
				const lay = LAYOUT[i] ?? LAYOUT[LAYOUT.length - 1]
				const topTitle = lay.showTop ? cat.name : undefined
				return (
					<Card
						key={cat.id}
						className={`card ${lay.className}`}
						topTitle={topTitle}
						bottomTitle={cat.name}
						photo={cat.image ?? undefined}
						href={`/products?category=${cat.id}&lng=${currentLng}`}
					/>
				)
			})}
		</StyledGrid>
	)
}

const StyledGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-auto-rows: 165px;
	gap: 12px;

	.card {
		&:nth-child(1),
		&:nth-child(2) {
			.product-box {
				width: 250px;
				height: 356px;
				top: 62px;
				right: 54px;
			}
			.card-product {
				object-position: right top;
			}
			.card-footer .title {
				display: none;
			}
		}

		&:nth-child(3),
		&:nth-child(4) {
			.product-box {
				width: 250px;
				height: 356px;
				top: -10px;
				left: 0px;
			}
			.card-product {
				object-position: left top;
			}
		}

		&:nth-child(3) .title {
			max-width: 122px;
		}
		&:nth-child(4) .title {
			margin-right: 74px;
		}

		&:nth-child(5) {
			.product-box {
				width: 346px;
				height: 495px;
				top: 9px;
				left: -60px;
			}
			.card-product {
				object-position: left top;
			}
		}
	}

	@media (max-width: 1000px) {
		grid-template-columns: 1fr;
		.card {
			grid-column: unset !important;
			grid-row: unset !important;

			.title {
				display: none;
			}
			.card-footer .title {
				display: block !important;
				margin: 0 !important;
				max-width: max-content !important;
			}

			.product-box {
				left: -90px !important;
				top: -10px !important;
				width: 300px !important;
				height: 300px !important;
			}
			.card-product {
				object-position: left top;
			}
		}
	}
`
