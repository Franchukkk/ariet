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

export function useRecaptchaV3(siteKey: string) {
	const [ready, setReady] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return

		const onLoad = () => window.grecaptcha?.ready(() => setReady(true))

		if (window.grecaptcha) {
			onLoad()
			return
		}

		const s = document.createElement('script')
		s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
		s.async = true
		s.defer = true
		s.onload = onLoad
		s.onerror = () => console.error('[reCAPTCHA] failed to load script')
		document.head.appendChild(s)
	}, [siteKey])

	const execute = useCallback(
		async (action: string) => {
			if (!window.grecaptcha) throw new Error('reCAPTCHA not ready')
			// маленький retry на випадок мережевих збоїв
			for (let i = 0; i < 2; i++) {
				try {
					const token = await window.grecaptcha.execute(siteKey, { action })
					if (!token) throw new Error('empty token')
					return token
				} catch (e) {
					if (i === 1) throw e
					await new Promise(r => setTimeout(r, 300 * (i + 1)))
				}
			}
			throw new Error('captcha failed')
		},
		[siteKey]
	)

	return { ready, execute }
}
