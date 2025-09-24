'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import styled from 'styled-components'

import { List } from './List/List'
import { Subtitle } from './Subtitle'
import { Title } from './Title'

type Possibility = { name?: string | null; description?: string | null }
type ProductDetail = {
	id: number
	name?: string | null
	main_feature_description?: string | null
	possibilities?: Possibility[]
}

export const Possibilities = () => (
	<Suspense fallback={null}>
		<PossibilitiesInner />
	</Suspense>
)

function PossibilitiesInner() {
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
					name: json?.name ?? null,
					main_feature_description: json?.main_feature_description ?? null,
					possibilities: Array.isArray(json?.possibilities)
						? json.possibilities
						: []
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

	const hasHeaderData = !!(
		product?.name?.trim() || product?.main_feature_description?.trim()
	)
	const hasPossibilities = (product?.possibilities?.length ?? 0) > 0

	if (loading) return null
	if (!productId) return null
	if (!product) return null
	if (!hasHeaderData || !hasPossibilities) return null

	const titleText = `Ваши возможности с ${product.name ?? ''}`.trim()
	const subtitleText = product.main_feature_description ?? ''

	return (
		<StyledPossibilities className='main-wrapper'>
			<Title text={titleText} />
			<Subtitle text={subtitleText} />
			<List productId={productId} />
		</StyledPossibilities>
	)
}

const StyledPossibilities = styled.div`
	margin-bottom: 127px;
	@media (max-width: 1000px) {
		margin-bottom: 50px;
	}
`
