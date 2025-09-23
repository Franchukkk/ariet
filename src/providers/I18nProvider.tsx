'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

import i18n, { defaultNS, ensureNSLoaded, fallbackLng } from '../i18n/client'

export default function I18nProvider({
	children
}: {
	children: React.ReactNode
}) {
	const [ready, setReady] = useState(false)
	const searchParams = useSearchParams()

	useEffect(() => {
		;(async () => {
			// 1) Пріоритет: ?lng=... у URL → 2) localStorage → 3) fallback
			const urlLng = searchParams?.get('lng')
			const saved = localStorage.getItem('lng') || fallbackLng
			const want = (urlLng || saved).split('-')[0]
			const current = (i18n.language || fallbackLng).split('-')[0]

			if (current !== want) {
				await ensureNSLoaded(want, defaultNS)
				await i18n.changeLanguage(want)
				localStorage.setItem('lng', want)
			}
			document.documentElement.lang = (urlLng || current).split('-')[0]
			setReady(true)
		})()
	}, [searchParams])

	if (!ready) return null
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
