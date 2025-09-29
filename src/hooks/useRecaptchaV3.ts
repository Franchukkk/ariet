// src/hooks/useRecaptchaV3.ts
'use client'

import { useCallback, useEffect, useState } from 'react'

// src/hooks/useRecaptchaV3.ts

declare global {
	interface Window {
		grecaptcha?: {
			ready(cb: () => void): void
			execute(siteKey: string, opts: { action: string }): Promise<string>
		}
	}
}

/**
 * Ледаче підвантаження reCAPTCHA v3: вантажимо лише якщо enabled=true (тобто є siteKey),
 * та лише на сторінці з формою.
 */
export function useRecaptchaV3(siteKey?: string, enabled: boolean = true) {
	const [ready, setReady] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return
		if (!enabled || !siteKey) return

		// вже є
		if (window.grecaptcha) {
			window.grecaptcha.ready(() => setReady(true))
			return
		}

		// скрипт ще не вставляли
		const existing = document.querySelector(
			`script[src="https://www.google.com/recaptcha/api.js?render=${siteKey}"]`
		)
		if (existing) {
			existing.addEventListener('load', () =>
				window.grecaptcha?.ready(() => setReady(true))
			)
			return
		}

		const s = document.createElement('script')
		s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
		s.async = true
		s.defer = true
		s.onload = () => window.grecaptcha?.ready(() => setReady(true))
		s.onerror = () => console.error('[reCAPTCHA] failed to load api.js')
		document.head.appendChild(s)
	}, [siteKey, enabled])

	const execute = useCallback(
		async (action: string) => {
			if (!enabled || !siteKey) throw new Error('reCAPTCHA disabled')
			if (!window.grecaptcha)
				throw new Error('reCAPTCHA not ready / api.js not loaded')
			return window.grecaptcha.execute(siteKey, { action })
		},
		[siteKey, enabled]
	)

	return { ready: enabled && !!siteKey && ready, execute }
}
