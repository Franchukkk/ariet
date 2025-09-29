// src/hooks/useRecaptchaBadgeVisible.ts
'use client'

import { useEffect } from 'react'

// src/hooks/useRecaptchaBadgeVisible.ts

declare global {
	interface Window {
		__recaptchaBadgeUsers?: number
	}
}

export function useRecaptchaBadgeVisible(target: 'html' | 'body' = 'html') {
	useEffect(() => {
		// 1) Глобальний CSS (інжектимо один раз)
		const STYLE_ID = 'rc-badge-visibility-css'
		if (!document.getElementById(STYLE_ID)) {
			const style = document.createElement('style')
			style.id = STYLE_ID
			style.textContent = `
.grecaptcha-badge{visibility:hidden;opacity:0;pointer-events:none;transition:opacity .2s ease}
.recaptcha-visible .grecaptcha-badge{visibility:visible;opacity:1;pointer-events:auto}
`
			document.head.appendChild(style)
		}

		// 2) Ввімкнути видимість для цієї сторінки з формою
		const root = target === 'body' ? document.body : document.documentElement
		window.__recaptchaBadgeUsers = (window.__recaptchaBadgeUsers ?? 0) + 1
		root.classList.add('recaptcha-visible')

		return () => {
			// 3) Зняти клас, якщо це остання форма
			window.__recaptchaBadgeUsers = Math.max(
				(window.__recaptchaBadgeUsers ?? 1) - 1,
				0
			)
			if (window.__recaptchaBadgeUsers === 0) {
				root.classList.remove('recaptcha-visible')
			}
		}
	}, [target])
}
