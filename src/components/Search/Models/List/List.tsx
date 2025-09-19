'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import photo from '@/assets/img/module.png'

import { ModelCard } from '../../../ModelCard/ModelCard'

interface Category {
	id: number
	name: string
}

interface Product {
	id: number
	name: string
	sku: string
	category: Category
	variants: {
		id: number
		sku: string
		images: { image: string; alt_text: string }[]
		price: string
	}[]
}

interface ProductResponse {
	count: number
	next: string | null
	previous: string | null
	results: Product[]
}

export const List = () => {
	const { t } = useTranslation('common')
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await fetch(
					'https://rpktask.sytes.net/api/catalog/products/'
				)
				if (!res.ok) throw new Error(`HTTP ${res.status}`)

				const data: ProductResponse = await res.json()
				setProducts(Array.isArray(data.results) ? data.results : [])
			} catch (err) {
				console.error('Fetch error:', err)
				setError('Fetch error')
			} finally {
				setLoading(false)
			}
		}

		fetchProducts()
	}, [])

	return (
		<StyledList>
			{loading && <p>L=loading...</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}

			{!loading && !error && (
				<Swiper
					spaceBetween={0}
					modules={[Pagination, Autoplay]}
					autoplay={{ delay: 2000, disableOnInteraction: true }}
					loop={true}
					pagination={{ clickable: true }}
					breakpoints={{
						1024: { slidesPerView: 2 },
						0: { slidesPerView: 1 }
					}}
				>
					{products.map((product, i) => {
						const img = product.variants?.[0]?.images?.[0]?.image || photo.src
						const category = product.category?.name || t('models.unknown')
						const isNew = i === 1

						return (
							<SwiperSlide key={product.id}>
								<ModelCard
									photo={img}
									title={product.name}
									category={category}
									link={`/products/${product.id}`}
									isNew={isNew}
								/>
							</SwiperSlide>
						)
					})}
				</Swiper>
			)}
		</StyledList>
	)
}

const StyledList = styled.div`
	border-top: 1px dashed #ffffff50;
	padding: 12px 0 14px;
	max-width: 700px;
	margin: 0 auto;
	@media (max-width: 600px) {
		max-width: 300px;
	}
`
