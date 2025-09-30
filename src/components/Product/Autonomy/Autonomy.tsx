/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Banner } from './Banner/Banner'
import { Content } from './Content/Content'

/* eslint-disable @typescript-eslint/no-explicit-any */

type ProductDetail = {
	id: number
	main_feature_name?: string | null
	main_feature_description?: string | null
	main_feature_image?: string | null
	main_feature_point_1?: string | null
	main_feature_point_2?: string | null
	main_feature_point_3?: string | null
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

/* ---------- public wrapper: даємо key для перемонту при зміні мови ---------- */
export const Autonomy = () => {
	const sp = useSearchParams()
	const currentLng = resolveLng(sp)
	return (
		<Suspense fallback={null}>
			<AutonomyInner
				key={currentLng}
				currentLng={currentLng}
			/>
		</Suspense>
	)
}

/* ---------- inner component ---------- */
function AutonomyInner({ currentLng }: { currentLng: Lng }) {
	const params = useParams()
	const sp = useSearchParams()
	const pathId = (params?.id as string | undefined) ?? undefined
	const queryId = sp.get('id') ?? undefined
	const productId = pathId ?? queryId ?? null

	const { i18n } = useTranslation('common')

	const [loading, setLoading] = useState(true)
	const [product, setProduct] = useState<ProductDetail | null>(null)

	// sync i18n with currentLng
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
				credentials: 'include', // дозволяє API-роуту оновити куку lng
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
	}, [productId, currentLng])

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

	if (loading || !productId || !product || !hasAnyData) return null

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
