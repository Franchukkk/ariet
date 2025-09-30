/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { List } from '../Specifications/List/List'

import { Header } from './Header/Header'

/* eslint-disable @typescript-eslint/no-explicit-any */

type KeyFeature = { name?: string; description?: string; image?: string }
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

/* ---------- public wrapper: даємо key для ремонту при зміні мови ---------- */
export const Specifications = () => {
	const sp = useSearchParams()
	const currentLng = resolveLng(sp)

	return (
		<Suspense fallback={null}>
			<SpecificationsInner
				key={currentLng}
				currentLng={currentLng}
			/>
		</Suspense>
	)
}

/* ---------- inner component ---------- */
function SpecificationsInner({ currentLng }: { currentLng: Lng }) {
	const params = useParams()
	const sp = useSearchParams()

	const pathId = (params?.id as string | undefined) ?? undefined
	const queryId = sp.get('id') ?? undefined
	const productId = pathId ?? queryId ?? null

	const { i18n } = useTranslation('common')

	const [items, setItems] = useState<KeyFeature[]>([])
	const [loading, setLoading] = useState(true)

	/* sync i18n with currentLng */
	useEffect(() => {
		const cur = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		if (cur !== currentLng) void i18n.changeLanguage(currentLng)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLng])

	/* load data (depends on id + lng) */
	useEffect(() => {
		let alive = true
		if (!productId) {
			setItems([])
			setLoading(false)
			return
		}

		setLoading(true)
		fetch(
			`/api/catalog/products/${productId}?lng=${currentLng}&_=${Date.now()}`,
			{
				method: 'GET',
				credentials: 'include', // отримуємо Set-Cookie lng=...
				headers: {
					'Content-Type': 'application/json',
					'Accept-Language': currentLng.toUpperCase() // дублюємо сигнал мови
				},
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
