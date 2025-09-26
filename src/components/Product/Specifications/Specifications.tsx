'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { List } from '../Specifications/List/List'

import { Header } from './Header/Header'

type KeyFeature = { name?: string; description?: string; image?: string }
type Lng = 'ru' | 'en'

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

	const urlLng = (sp?.get('lng') || 'ru').split('-')[0] as Lng
	const currentLng: Lng = urlLng === 'en' ? 'en' : 'ru'

	const { i18n } = useTranslation('common')

	const [items, setItems] = useState<KeyFeature[]>([])
	const [loading, setLoading] = useState(true)

	// синхронізуємо i18n під URL (як у ProductInformation)
	useEffect(() => {
		;(async () => {
			const cur = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
			if (cur !== currentLng) await i18n.changeLanguage(currentLng)
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLng])

	useEffect(() => {
		let alive = true
		if (!productId) {
			setItems([])
			setLoading(false)
			return
		}
		setLoading(true)

		// ⚠️ тягнемо через локальний proxу + мова з URL
		fetch(
			`/api/catalog/products/${productId}?lng=${currentLng}&_=${Date.now()}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				cache: 'no-store'
			}
		)
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
	}, [productId, currentLng])

	if (loading || !productId || items.length === 0) return null

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
