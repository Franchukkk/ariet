'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { List } from './List/List'
import { Title } from './Title'

type Possibility = { name?: string | null; description?: string | null }
type ProductDetail = {
	id: number
	name?: string | null
	main_feature_description?: string | null
	possibilities?: Possibility[]
}

type Lng = 'ru' | 'en'

/* ---------- helpers ---------- */
const readCookie = (name: string): string | null => {
	if (typeof document === 'undefined') return null
	const m = document.cookie.match(
		new RegExp('(?:^|; )' + name.replace(/([$?*|{}\\^])/g, '\\$1') + '=([^;]*)')
	)
	return m ? decodeURIComponent(m[1]) : null
}

const resolveLng = (sp: URLSearchParams | null): Lng => {
	const q = (sp?.get('lng') || '').split('-')[0].toLowerCase()
	if (q === 'en' || q === 'ru') return q as Lng
	const c = (readCookie('lng') || '').split('-')[0].toLowerCase()
	if (c === 'en' || c === 'ru') return c as Lng
	return 'ru'
}

/* ---------- public wrapper: примусовий ремоунт при зміні мови ---------- */
export const Possibilities = () => {
	const sp = useSearchParams()
	const currentLng = resolveLng(sp)
	return (
		<Suspense fallback={null}>
			<PossibilitiesInner
				key={currentLng}
				currentLng={currentLng}
			/>
		</Suspense>
	)
}

function PossibilitiesInner({ currentLng }: { currentLng: Lng }) {
	const params = useParams()
	const sp = useSearchParams()
	const pathId = (params?.id as string | undefined) ?? undefined
	const queryId = sp.get('id') ?? undefined
	const productId = pathId ?? queryId ?? null

	const { i18n, t } = useTranslation('common')

	const [loading, setLoading] = useState(true)
	const [product, setProduct] = useState<ProductDetail | null>(null)

	// sync i18n with URL/cookie language
	useEffect(() => {
		const cur = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		if (cur !== currentLng) void i18n.changeLanguage(currentLng)
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

		fetch(
			`/api/catalog/products/${productId}?lng=${currentLng}&_=${Date.now()}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept-Language': currentLng.toUpperCase()
				},
				cache: 'no-store'
			}
		)
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

	if (loading || !productId || !product || !hasHeaderData || !hasPossibilities)
		return null

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

			<List
				productId={productId}
				lng={currentLng}
			/>
		</StyledPossibilities>
	)
}

const StyledPossibilities = styled.div`
	margin-bottom: 127px;
	@media (max-width: 1000px) {
		margin-bottom: 50px;
	}
`
