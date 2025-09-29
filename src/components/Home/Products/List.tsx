'use client'

import { useEffect, useState } from 'react'
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
	category: Category
	variants: {
		id: number
		sku: string
		images: { image: string; alt_text: string }[]
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
				const res = await fetch(`${API_BASE}/catalog/products/`)
				if (!res.ok) throw new Error(`HTTP ${res.status}`)

				const json = await res.json()
				const data: Product[] = json.results || []

				const filtered = filterProductsByCategory(data, activeCategory)
				setProducts(filtered)
			} catch (err) {
				console.error('Fetch error:', err)
				setError('Failed to load')
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
					p.category?.name?.toLowerCase().includes('проект')
				)
			default:
				return data
		}
	}

	return (
		<StyledList>
			{!loading && !error && products.length === 0 && (
				<Info>{t('list.Nothing_found')}</Info>
			)}
			{error && <p style={{ color: 'red' }}>{error}</p>}

			{!loading &&
				!error &&
				products.map((product, index) => {
					const raw =
						product.variants?.[0]?.images?.[0]?.image || productImg.src
					const image = raw === productImg.src ? raw : toAbs(raw)

					return (
						<div
							key={product.id}
							className={`card ${index % 3 === 2 ? 'no-border' : ''}`}
						>
							<div className='card-sizer'>
								<ModelCard
									photo={image}
									title={product.name}
									category={product.category?.name || ''}
									link={`/products/${product.id}`}
								/>
							</div>
						</div>
					)
				})}
		</StyledList>
	)
}

const Info = styled.p`
	grid-column: 1 / -1;
	color: #ffffffc9;
	padding: 14px 0;
	text-align: center;
`

const StyledList = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	border-bottom: 1px dashed #ffffff50;
	border-top: 1px dashed #ffffff50;
	margin-bottom: 34px;
	padding: 12px 0;

	.divider {
		grid-column: 1/4;
		grid-row: 2/3;
		border-bottom: 1px dashed #ffffff50;
		margin: 14px 0;
	}

	.card {
		border-right: 1px dashed #ffffff50;
		border-radius: 0;
		padding: 13px 11px;
	}
	.card.no-border {
		border-right: none;
	}

	/* мінімальні стилі для вирівнювання всередині картки */
	.card-sizer {
		height: 100%;
	}
	.card-sizer > * {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}
	/* фото не «розпирає» картку */
	.card-sizer img {
		width: 100%;
		height: auto;
		object-fit: contain;
		display: block;
		max-height: 55vh;
	}
	/* заголовок — максимум 2 рядки */
	.card-sizer :is(h1, h2, h3, h4, .title, .card-title) {
		margin-top: 10px;
		min-height: 2.8em;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	/* останній елемент (стрілка/CTA) — донизу */
	.card-sizer > * > :last-child {
		margin-top: auto;
	}

	@media (max-width: 1200px) {
		grid-template-columns: 1fr 1fr;
		border-bottom: none;

		.divider {
			display: none;
		}

		.card {
			border-bottom: 1px dashed #ffffff50;
			border-right: none;
		}
		.card:last-child {
			border-bottom: none;
		}
	}

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
	}
`
