'use client'

import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useState } from 'react'

import { List } from './List'

type Category = { id: number; name: string }

export const Links = () => {
	const { t, i18n } = useTranslation('common')

	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const currentLng = useMemo<'ru' | 'en'>(() => {
		const raw = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		return raw === 'en' ? 'en' : 'ru'
	}, [i18n.language, i18n.resolvedLanguage])

	useEffect(() => {
		let cancelled = false
		;(async () => {
			try {
				setLoading(true)
				setError(null)
				const res = await fetch(
					`/front-proxy/categories?lng=${currentLng}&page_size=99&_=${Date.now()}`,
					{ cache: 'no-store' }
				)
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const json = await res.json()
				const arr = Array.isArray(json) ? json : (json?.results ?? [])
				const list: Category[] = arr.map((c: any) => ({
					id: c.id,
					name: c[`name_${currentLng}`] ?? c.name ?? ''
				}))
				if (!cancelled) setCategories(list)
			} catch (e: any) {
				if (!cancelled) setError(e?.message ?? 'Load error')
			} finally {
				if (!cancelled) setLoading(false)
			}
		})()
		return () => {
			cancelled = true
		}
	}, [currentLng])

	const catalogLinks =
		!loading && !error && categories.length
			? categories.slice(0, 4).map(cat => ({
					title: cat.name,
					link: `/products?category=${cat.id}&lng=${currentLng}`
				}))
			: [
					{ title: t('title.section'), link: '#' },
					{ title: t('title.section'), link: '#' },
					{ title: t('title.section'), link: '#' },
					{ title: t('title.section'), link: '#' }
				]

	return (
		<div
			className='
        flex flex-nowrap gap-10 overflow-x-auto whitespace-nowrap
        [&_a]:whitespace-nowrap  [&_a]:max-w-[220px]
        
      '
		>
			{/* shrink-0 не дає колонкам стискатися і ламати рядок */}
			<div className='shrink-0'>
				<List
					title={t('title.company')}
					links={[
						{ title: t('title.about_company'), link: '/about' },
						{ title: t('Navigation.support'), link: '/online-support' },
						{ title: t('Navigation.partners'), link: '/partner' },
						{ title: t('title.contacts'), link: '/contacts' }
					]}
				/>
			</div>

			<div className='shrink-0'>
				<List
					title={t('title.catalog')}
					links={catalogLinks}
				/>
			</div>

			<div className='shrink-0'>
				<List
					title={t('title.social_networks')}
					links={[
						{
							title: 'Instagram',
							link: 'https://www.instagram.com/volt.kz_official/'
						},
						{
							title: 'Facebook',
							link: 'https://www.facebook.com/volt.kzofficial/'
						}
					]}
				/>
			</div>
		</div>
	)
}
