'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

import i18n, { defaultNS, ensureNSLoaded, fallbackLng } from '../i18n/client'

declare global {
	interface Window {
		__originalFetch__?: typeof window.fetch
		__fetchPatchedWithLang__?: boolean
	}
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
	const searchParams = useSearchParams()

	useEffect(() => {
		;(async () => {
			const urlLng = searchParams?.get('lng') || undefined
			const saved =
				(typeof window !== 'undefined' && localStorage.getItem('lng')) ||
				fallbackLng
			const want = (urlLng || saved || fallbackLng).split('-')[0]
			const current = (i18n.language || fallbackLng).split('-')[0]

			if (current !== want) {
				await ensureNSLoaded(want, defaultNS)
				await i18n.changeLanguage(want)
				if (typeof window !== 'undefined') localStorage.setItem('lng', want)
			}
			document.documentElement.lang = (
				urlLng ||
				i18n.language ||
				fallbackLng
			).split('-')[0]
			setReady(true)
		})()
	}, [searchParams])

	// Глобальний патч fetch: CORS-safe
	useEffect(() => {
		if (typeof window === 'undefined' || window.__fetchPatchedWithLang__) return

		window.__originalFetch__ = window.fetch
		window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
			const lng = (i18n.resolvedLanguage || i18n.language || fallbackLng).split(
				'-'
			)[0]

			const headers = new Headers(init?.headers)
			headers.set('Accept-Language', lng) // завжди безпечно

			// LANGUAGE_CODE додаємо тільки для same-origin
			try {
				const u =
					typeof input === 'string'
						? new URL(input, window.location.href)
						: input instanceof URL
							? input
							: // якщо Request — не чіпаємо origin (і не додаємо кастомний заголовок)
								null

				if (u && u.origin === window.location.origin) {
					headers.set('LANGUAGE_CODE', lng)
				}
			} catch {
				// якщо не змогли розпарсити URL — тихо ігноруємо
			}

			return window.__originalFetch__!(input, { ...init, headers })
		}
		window.__fetchPatchedWithLang__ = true
	}, [])

	if (!ready) return null
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
