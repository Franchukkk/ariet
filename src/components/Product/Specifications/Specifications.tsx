'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import styled from 'styled-components'

import { List } from '../Specifications/List/List'

import { Header } from './Header/Header'

type KeyFeature = { name?: string; description?: string; image?: string }

export const Specifications = () => (
	<Suspense fallback={null}>
		<SpecificationsInner />
	</Suspense>
)

function SpecificationsInner() {
	const params = useParams()
	const sp = useSearchParams()
	const pathId = (params?.id as string | undefined) ?? undefined
	const queryId = sp.get('id') ?? undefined
	const productId = pathId ?? queryId ?? null

	const [items, setItems] = useState<KeyFeature[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let alive = true
		if (!productId) {
			setItems([])
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
				const list: KeyFeature[] = Array.isArray(json?.key_features)
					? json.key_features.map((k: any) => ({
							name: k?.name ?? '',
							description: k?.description ?? '',
							image: k?.image ?? ''
						}))
					: []
				setItems(list.filter(i => i.name || i.description || i.image))
			})
			.catch(() => alive && setItems([]))
			.finally(() => alive && setLoading(false))

		return () => {
			alive = false
		}
	}, [productId])

	if (loading) return null
	if (!productId) return null
	if (items.length === 0) return null
	return (
		<StyledSpecifications className='main-wrapper'>
			<Header />
			<List items={items} />
		</StyledSpecifications>
	)
}

const StyledSpecifications = styled.div`
	padding: 104px 0 116px;
	@media (max-width: 1000px) {
		padding: 30px 0;
	}
`
