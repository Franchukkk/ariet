'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Banner } from './Banner/Banner'
import { Content } from './Content/Content'

type ProductDetail = {
	id: number
	main_feature_name?: string | null
	main_feature_description?: string | null
	main_feature_image?: string | null
	main_feature_point_1?: string | null
	main_feature_point_2?: string | null
	main_feature_point_3?: string | null
}

export const Autonomy = () => (
	<Suspense fallback={null}>
		<AutonomyInner />
	</Suspense>
)

function AutonomyInner() {
	const params = useParams()
	const sp = useSearchParams()
	const pathId = (params?.id as string | undefined) ?? undefined
	const queryId = sp.get('id') ?? undefined
	const productId = pathId ?? queryId ?? null

	const [loading, setLoading] = useState(true)
	const [product, setProduct] = useState<ProductDetail | null>(null)

	useEffect(() => {
		let alive = true

		if (!productId) {
			setProduct(null)
			setLoading(false)
			return
		}

		setLoading(true)
		fetch(`https://rpktask.sytes.net/api/catalog/products/${productId}/`, {
			method: 'GET',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			cache: 'no-store'
		})
			.then(async r => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`)
				const json = await r.json()
				if (!alive) return
				setProduct({
					id: json?.id,
					main_feature_name: json?.main_feature_name ?? null,
					main_feature_description: json?.main_feature_description ?? null,
					main_feature_image: json?.main_feature_image ?? null,
					main_feature_point_1: json?.main_feature_point_1 ?? null,
					main_feature_point_2: json?.main_feature_point_2 ?? null,
					main_feature_point_3: json?.main_feature_point_3 ?? null
				})
			})
			.catch(() => {
				if (alive) setProduct(null)
			})
			.finally(() => {
				if (alive) setLoading(false)
			})

		return () => {
			alive = false
		}
	}, [productId])

	const points = useMemo(
		() =>
			[
				product?.main_feature_point_1,
				product?.main_feature_point_2,
				product?.main_feature_point_3
			].filter(Boolean) as string[],
		[product]
	)
	const hasAnyData = !!(
		product?.main_feature_name?.trim() ||
		product?.main_feature_description?.trim() ||
		product?.main_feature_image?.trim() ||
		points.length > 0
	)

	if (loading) return null
	if (!productId) return null
	if (!product || !hasAnyData) return null

	return (
		<StyledAutonomy>
			<div className='main-wrapper'>
				<Banner
					featureName={product.main_feature_name ?? ''}
					featureImageUrl={product.main_feature_image ?? ''}
				/>
				<Content
					featureDescription={product.main_feature_description ?? ''}
					points={points}
				/>
			</div>
		</StyledAutonomy>
	)
}

const StyledAutonomy = styled.div`
	margin-bottom: 146px;
	border: 1px solid #313131;
	border-left: none;
	border-right: none;
	.main-wrapper {
		padding: 0 !important;
		display: grid;
		grid-template-columns: 1fr 1fr;
		@media (max-width: 1200px) {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 1000px) {
		margin-bottom: 60px;
	}
`
