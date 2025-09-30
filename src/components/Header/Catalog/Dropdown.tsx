'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

type Category = { id: number; name: string }

export const Dropdown = () => {
	const { i18n } = useTranslation('common')
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const currentLng = useMemo<'ru' | 'en'>(() => {
		const raw = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		return raw === 'en' ? 'en' : 'ru'
	}, [i18n.language, i18n.resolvedLanguage])

	useEffect(() => {
		let cancelled = false
		const load = async () => {
			setLoading(true)
			setError(null)

			const parse = (json: any, lng: 'ru' | 'en'): Category[] => {
				const arr = Array.isArray(json) ? json : (json?.results ?? [])
				return arr.map((c: any) => ({
					id: c.id,
					name: c[`name_${lng}`] ?? c.name ?? ''
				}))
			}

			try {
				// 1) через локальний проксі (потрібен для Accept-Language)
				let res = await fetch(
					`/api/proxy/categories?lng=${currentLng}&page_size=99&_=${Date.now()}`,
					{ cache: 'no-store' }
				)

				// 2) fallback напряму на бек, якщо проксі недоступний/404
				if (res.status === 404) {
					res = await fetch(
						`https://rpktask.sytes.net/api/catalog/categories/?lng=${currentLng}&page_size=99&_=${Date.now()}`,
						{ cache: 'no-store' }
					)
				}

				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const json = await res.json()
				if (!cancelled) setCategories(parse(json, currentLng))
			} catch (e: any) {
				if (!cancelled) setError(e?.message || 'Failed to load categories')
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		load()
		return () => {
			cancelled = true
		}
	}, [currentLng])

	return (
		<StyledDropdown className='dropdown'>
			<div>
				<div className='flex flex-col gap-3'>
					{loading && <span>Loading…</span>}
					{error && <span style={{ color: '#ef4444' }}>{error}</span>}
					{!loading &&
						!error &&
						categories.map(cat => (
							<Link
								key={cat.id}
								href={{
									pathname: '/products',
									query: { category: cat.id, lng: currentLng }
								}}
							>
								{cat.name}
							</Link>
						))}
				</div>
			</div>
		</StyledDropdown>
	)
}

const StyledDropdown = styled.div`
	position: absolute;
	top: calc(100% + 2px);
	width: 400px;
	background: #000000;
	left: 0;
	padding: 20px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24px;
	font-weight: 400;
	font-size: 14px;
	line-height: 100%;
	color: #f2f2f2;
	text-align: left;
	opacity: 0;
	visibility: hidden;
	transition: all 0.3s;
	z-index: 100;
	a:hover {
		color: #4bc785;
	}
`
