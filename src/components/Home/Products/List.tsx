'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ModelCard } from '@/components/ModelCard/ModelCard'

import productImg from '@/assets/img/module.png'

interface Category {
	id: number
	name: string
}
interface Product {
	id: number
	name: string
	description: string
	sku: string
	category: Category | null
	variants: {
		id: number
		sku: string
		images: { image: string; alt_text: string | null }[]
		price: string
	}[]
}

const API_BASE = 'https://rpktask.sytes.net/api'
const toAbs = (url?: string) => {
	if (!url) return ''
	if (/^https?:\/\//i.test(url)) return url
	return `https://rpktask.sytes.net${url.startsWith('/') ? '' : '/'}${url}`
}

export const List = ({ activeCategory }: { activeCategory: string }) => {
	const { t } = useTranslation('common')
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadProducts = async () => {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(`${API_BASE}/catalog/products/`, {
					cache: 'no-store'
				})
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const json = await res.json()
				const data: Product[] = json.results || []
				setProducts(filterProductsByCategory(data, activeCategory))
			} catch (err: any) {
				console.error('Fetch error:', err)
				setError(err?.message || 'Failed to load')
			} finally {
				setLoading(false)
			}
		}
		loadProducts()
	}, [activeCategory])

	const filterProductsByCategory = (
		data: Product[],
		category: string
	): Product[] => {
		switch ((category || '').toLowerCase()) {
			case 'новинки':
				return [...data].sort((a, b) => b.id - a.id).slice(0, 6)
			case 'лідери продажів':
				return [...data]
					.sort(
						(a, b) =>
							parseFloat(b.variants?.[0]?.price || '0') -
							parseFloat(a.variants?.[0]?.price || '0')
					)
					.slice(0, 6)
			case 'проектні рішення':
				return data.filter(p =>
					(p.category?.name || '').toLowerCase().includes('проект')
				)
			default:
				return data
		}
	}

	// групуємо по 3 картки в ряд і ставимо роздільник-лінію під рядом
	const renderTriples = (items: Product[]) => {
		const rows: JSX.Element[] = []
		for (let i = 0; i < items.length; i += 3) {
			const a = items[i]
			const b = items[i + 1]
			const c = items[i + 2]

			const aImg = toAbs(a?.variants?.[0]?.images?.[0]?.image) || productImg.src
			const bImg = b
				? toAbs(b?.variants?.[0]?.images?.[0]?.image) || productImg.src
				: ''
			const cImg = c
				? toAbs(c?.variants?.[0]?.images?.[0]?.image) || productImg.src
				: ''

			rows.push(
				<React.Fragment key={`row-${i}`}>
					<div className='card card-border'>
						<div className='card-sizer'>
							<ModelCard
								photo={aImg}
								title={a?.name || ''}
								category={a?.category?.name || ''}
								link={`/products/${a?.id}`}
							/>
						</div>
					</div>

					{b ? (
						<div className='card card-border'>
							<div className='card-sizer'>
								<ModelCard
									photo={bImg}
									title={b?.name || ''}
									category={b?.category?.name || ''}
									link={`/products/${b?.id}`}
								/>
							</div>
						</div>
					) : (
						<div className='card placeholder' />
					)}

					{c ? (
						<div className='card'>
							<div className='card-sizer'>
								<ModelCard
									photo={cImg}
									title={c?.name || ''}
									category={c?.category?.name || ''}
									link={`/products/${c?.id}`}
								/>
							</div>
						</div>
					) : (
						<div className='card placeholder' />
					)}

					<div className='divider' />
				</React.Fragment>
			)
		}
		return rows
	}

	if (!loading && !error && products.length === 0) {
		return (
			<StyledList>
				<EmptyInfo>{t('list.Nothing_found')}</EmptyInfo>
			</StyledList>
		)
	}

	return (
		<StyledList>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{!error && renderTriples(products)}
		</StyledList>
	)
}

const EmptyInfo = styled.p`
	grid-column: 1 / -1;
	color: #ffffffc9;
	padding: 14px 0;
	text-align: center;
`

const StyledList = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-auto-rows: max-content;

	/* керовані висоти для узгодженого вигляду */
	--card-height-desktop: 420px;
	--card-height-mobile: 360px;

	--card-image-height-desktop: 420px;
	--card-image-height-mobile: 160px;

	.card {
		min-height: var(--card-height-desktop);
		display: flex;
		align-items: stretch;
	}

	.card > .card-sizer {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	/* стилі зображення всередині ModelCard */
	.card img {
		width: 80%;
		height: var(--card-image-height-desktop);
		object-fit: cover;
		display: block;
		margin: 0 auto;
	}

	/* пунктир між стовпцями: тільки у перших двох */
	.card.card-border {
		border-right: 1px dashed #ffffff80;
	}

	/* роздільник-лінія під кожним рядом (desktop) */
	.divider {
		grid-column: 1 / 4;
		height: 1px;
		border-top: 1px dashed #ffffff80;
		margin: 14px 0;
	}

	/* планшет: 2 у ряд, низ — пунктир, приховати роздільник */
	@media (max-width: 1200px) {
		grid-template-columns: repeat(2, 1fr);

		.card {
			min-height: var(--card-height-mobile);
			border-bottom: 1px dashed #ffffff80;
			border-right: none !important;
		}

		.card img {
			height: var(--card-image-height-mobile);
			width: 80%;
		}

		.divider {
			display: none;
		}
	}

	/* мобілка: 1 у ряд */
	@media (max-width: 800px) {
		grid-template-columns: 1fr;
	}
`
