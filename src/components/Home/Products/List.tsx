'use client'

import { useEffect, useState } from 'react'
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

export const List = ({ activeCategory }: { activeCategory: string }) => {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadProducts = async () => {
			setLoading(true)
			try {
				const res = await fetch(
					'https://rpktask.sytes.net/api/catalog/products/'
				)
				if (!res.ok) throw new Error(`HTTP ${res.status}`)

				const data: Product[] = await res.json()
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
		switch (category) {
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
			{loading && <p>Завантаження...</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{!loading &&
				products.map((product, index) => {
					const image =
						product.variants?.[0]?.images?.[0]?.image || productImg.src
					return (
						<div
							key={product.id}
							className={`card ${index % 3 === 2 ? 'no-border' : ''}`}
						>
							<ModelCard
								photo={image}
								title={product.name}
								category={product.category?.name || ''}
								link={`/products/${product.id}`}
							/>
						</div>
					)
				})}
		</StyledList>
	)
}

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
		&.no-border {
			border-right: none;
		}
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
			&:last-child {
				border-bottom: none;
			}
		}
	}

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
	}
`
