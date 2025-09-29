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

export function useRecaptchaV3(siteKey?: string, enabled: boolean = true) {
	const [ready, setReady] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined' || !enabled || !siteKey) return

		const markReady = () => window.grecaptcha?.ready(() => setReady(true))

		if (window.grecaptcha) {
			markReady()
			return
		}

		const src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
		const existing = document.querySelector<HTMLScriptElement>(
			`script[src="${src}"]`
		)
		if (existing) {
			existing.addEventListener('load', markReady)
			return
		}

		const s = document.createElement('script')
		s.src = src
		s.async = true
		s.defer = true
		s.onload = markReady
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
