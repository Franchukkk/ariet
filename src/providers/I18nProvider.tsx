'use client'

import { Suspense, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

import i18n, { defaultNS, ensureNSLoaded, fallbackLng } from '../i18n/client'

const pickCookie = (name: string) => {
	if (typeof document === 'undefined') return undefined
	return document.cookie
		.split('; ')
		.find(c => c.startsWith(`${name}=`))
		?.split('=')[1]
}

export default function I18nProvider({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<Suspense fallback={null}>
			<I18nProviderInner>{children}</I18nProviderInner>
		</Suspense>
	)
}

function I18nProviderInner({ children }: { children: React.ReactNode }) {
	const [ready, setReady] = useState(false)

	useEffect(() => {
		;(async () => {
			const cookieLng = pickCookie('lng')
			const saved =
				(typeof window !== 'undefined' && localStorage.getItem('lng')) ||
				undefined

			// порядок пріоритету: cookie -> localStorage -> fallback
			const want = (cookieLng || saved || fallbackLng).split('-')[0]
			const current = (i18n.language || fallbackLng).split('-')[0]

			// обов’язково завантажуємо потрібний namespace (якщо у вас кілька — додайте їх масивом)
			await ensureNSLoaded(want, defaultNS) // defaultNS має включати 'common'
			if (current !== want) {
				await i18n.changeLanguage(want)
			}
			if (typeof window !== 'undefined') localStorage.setItem('lng', want)
			document.documentElement.lang = want
			setReady(true)
		})()
		// 👆 запускаємо лише на mount. Ніякої прив’язки до searchParams.
	}, [])

	if (!ready) return null
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
