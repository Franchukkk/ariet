'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { getRefreshToken, refreshToken } from '@/helpers/auth'

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter()
	const pathname = usePathname()
	const [isLoading, setIsLoading] = useState(true)

	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	// Інтервал для періодичного оновлення токена
	useEffect(() => {
		if (!intervalRef.current) {
			intervalRef.current = setInterval(
				() => {
					refreshToken()
				},
				2 * 60 * 1000
			) // раз на 2 хвилини
		}

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [])

	useEffect(() => {
		if (pathname !== '/login' && pathname !== '/registration') {
			setIsLoading(false)
			return
		}

		const checkAuth = async () => {
			const refreshTokenValue = getRefreshToken()

			if (!refreshTokenValue) {
				setIsLoading(false) // немає токена — показуємо публічний контент
				return
			}

			try {
				// Оновлюємо токен
				const refreshRes = await fetch(
					'https://rpktask.sytes.net/api/token/refresh/',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ refresh: refreshTokenValue })
					}
				)

				const refreshData = await refreshRes.json()

				if (!refreshData.access) {
					setIsLoading(false) // токен не отримано
					return
				}

				localStorage.setItem('accessToken', refreshData.access)

				// Отримуємо дані користувача
				const userRes = await fetch('https://rpktask.sytes.net/api/users/me/', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${refreshData.access}`
					}
				})

				const userData = await userRes.json()

				// Якщо користувач на сторінках логіну/реєстрації — редіректимо
				if (pathname === '/login' || pathname === '/registration') {
					const target =
						userData.role === 'CLIENT'
							? '/my-account'
							: userData.role === 'AMBASSADOR'
								? '/ambassador'
								: userData.role === 'ADMIN'
									? '/admin-dashboard'
									: '/my-account' // За замовчуванням

					router.replace(target)
					return // не ставимо isLoading = false, бо редірект
				}

				// Якщо користувач не на сторінках логіну — просто показуємо контент
			} catch (err) {}
		}

		checkAuth()
	}, [pathname, router])

	return <>{children}</>
}
