'use client'

import { useCallback, useEffect, useState } from 'react'

declare global {
	interface Window {
		grecaptcha?: {
			ready: (cb: () => void) => void
			execute: (siteKey: string, opts: { action: string }) => Promise<string>
		}
	}
}

export function useRecaptchaV3(siteKey: string) {
	const [ready, setReady] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return

		const onLoad = () => {
			window.grecaptcha?.ready(() => setReady(true))
		}

		if (window.grecaptcha) {
			onLoad()
			return
		}

		const s = document.createElement('script')
		s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
		s.async = true
		s.defer = true
		s.onload = onLoad
		document.head.appendChild(s)

		return () => {}
	}, [siteKey])

	const execute = useCallback(
		async (action: string) => {
			if (!window.grecaptcha) throw new Error('reCAPTCHA не готовий')
			return window.grecaptcha.execute(siteKey, { action })
		},
		[siteKey]
	)

	return { ready, execute }
}
