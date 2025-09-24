'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Card } from './Card'

type Category = {
	id: number | string
	name: string
	image?: string | null
}

export const Grid = () => {
	const [items, setItems] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let mounted = true
		;(async () => {
			try {
				const res = await fetch(
					'https://rpktask.sytes.net/api/catalog/categories/?page_size=5',
					{
						method: 'GET',
						credentials: 'include',
						headers: { 'Content-Type': 'application/json' },
						cache: 'no-store'
					}
				)
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const json = await res.json()
				const data: Category[] = (json?.results ?? []).map((c: any) => ({
					id: c.id,
					name: c.name,
					image: c.image ?? null
				}))
				if (mounted) setItems(data.slice(0, 5))
			} catch (e: any) {
				setError(e?.message ?? 'Failed to load')
			} finally {
				if (mounted) setLoading(false)
			}
		})()
		return () => {
			mounted = false
		}
	}, [])

	// фіксовані позиції, як у твоєму макеті
	const LAYOUT: { className: string; showTop: boolean }[] = [
		{ className: 'row-span-2', showTop: true },
		{ className: 'row-span-2', showTop: true },
		{ className: 'col-start-3 col-end-5', showTop: false },
		{
			className: 'row-start-2 row-end-3 col-start-3 col-end-5',
			showTop: false
		},
		{ className: 'col-start-5 col-end-8 row-span-2', showTop: false }
	]

	if (loading || error) return null

	return (
		<StyledGrid>
			{items.map((cat, i) => {
				const lay = LAYOUT[i] ?? LAYOUT[LAYOUT.length - 1]
				const topTitle = lay.showTop ? cat.name : undefined
				return (
					<Card
						key={cat.id}
						className={`card ${lay.className}`} // важливо: .card лишається → nth-child працює
						topTitle={topTitle}
						bottomTitle={cat.name}
						photo={cat.image ?? undefined} // Card сам пропустить <Image>, якщо фото немає
						href={`/products?category=${cat.id}`} // клік по всій картці
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
			} /* → тримаємося лівого краю */
		}

		&:nth-child(3) {
			.title {
				max-width: 122px;
			}
		}
		&:nth-child(4) {
			.title {
				margin-right: 74px;
			}
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
			} /* або left bottom, якщо треба нижче */
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
			} /* стабільна прив’язка і на мобайлі */
		}
	}
`
