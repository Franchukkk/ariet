'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

type Lng = 'ru' | 'en'

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

	// ----- мова з URL
	const urlLng = (sp?.get('lng') || 'ru').split('-')[0] as Lng
	const currentLng: Lng = urlLng === 'en' ? 'en' : 'ru'

	const { i18n, t } = useTranslation('common')

	const [loading, setLoading] = useState(true)
	const [product, setProduct] = useState<ProductDetail | null>(null)

	// синхронізуємо i18n під URL
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
			setProduct(null)
			setLoading(false)
			return
		}

		setLoading(true)

		// варіант через локальний проксі + параметр мови
		fetch(
			`/api/catalog/products/${productId}?lng=${currentLng}&_=${Date.now()}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				cache: 'no-store'
			}
		)
			// якщо без проксі — можна так:
			// fetch(`https://rpktask.sytes.net/api/catalog/products/${productId}/`, {
			//   method: 'GET',
			//   credentials: 'include',
			//   headers: { 'Content-Type': 'application/json', 'Accept-Language': currentLng },
			//   cache: 'no-store'
			// })
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
	}, [productId, currentLng])

	const hasHeaderData = !!(
		product?.name?.trim() || product?.main_feature_description?.trim()
	)
	const hasPossibilities = (product?.possibilities?.length ?? 0) > 0

	if (loading) return null
	if (!productId) return null
	if (!product) return null
	if (!hasHeaderData || !hasPossibilities) return null

	const i18nTitle = t('possibilities.title', {
		name: product.name ?? '',
		defaultValue:
			currentLng === 'en'
				? `Your possibilities with ${product.name ?? ''}`
				: `Ваши возможности с ${product.name ?? ''}`
	}).trim()

	const subtitleText = product.main_feature_description ?? ''

	return (
		<StyledPossibilities className='main-wrapper'>
			<Title text={i18nTitle} />
			<Subtitle text={subtitleText} />

			<List productId={productId} /* lng={currentLng} */ />
		</StyledPossibilities>
	)
}

const StyledPossibilities = styled.div`
	margin-bottom: 127px;
	@media (max-width: 1000px) {
		margin-bottom: 50px;
	}
`
