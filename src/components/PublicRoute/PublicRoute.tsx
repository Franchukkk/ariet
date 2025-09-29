'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { getRefreshToken, refreshToken } from '@/helpers/auth'

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter()
	const pathname = usePathname()
	const redirectedRef = useRef(false)
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

	useEffect(() => {
		if (intervalRef.current) return
		intervalRef.current = setInterval(
			() => {
				try {
					refreshToken()
				} catch {}
			},
			2 * 60 * 1000
		)
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [])

	useEffect(() => {
		if (pathname !== '/login' && pathname !== '/registration') return
		let cancelled = false

		const checkAuth = async () => {
			const refresh =
				(typeof getRefreshToken === 'function' ? getRefreshToken() : null) ??
				(typeof window !== 'undefined'
					? localStorage.getItem('refreshToken')
					: null)

			if (!refresh || redirectedRef.current) return

			try {
				const refreshRes = await fetch(
					'https://rpktask.sytes.net/api/token/refresh/',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ refresh })
					}
				)
				if (!refreshRes.ok) return
				const { access } = await refreshRes.json()
				if (!access) return

				localStorage.setItem('accessToken', access)

				const meRes = await fetch('https://rpktask.sytes.net/api/users/me/', {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${access}`
					}
				})
				if (!meRes.ok) return
				const user = await meRes.json()

				if (cancelled || redirectedRef.current) return
				const target =
					user?.role === 'AMBASSADOR'
						? '/ambassador'
						: user?.role === 'ADMIN'
							? '/admin-dashboard'
							: '/my-account'

				redirectedRef.current = true
				router.replace(target)
			} catch {}
		}

		checkAuth()
		return () => {
			cancelled = true
		}
	}, [pathname, router])

	return <>{children}</>
}
