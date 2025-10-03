'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getRefreshToken, refreshToken } from '@/helpers/auth'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)
	const pathname = usePathname()

	useEffect(() => {
		const idInterval = setInterval(refreshToken, 2 * 60 * 1000)

		return () => clearInterval(idInterval)
	}, [])

	useEffect(() => {
		const refreshTokenValue = getRefreshToken()

		if (!refreshTokenValue) {
			router.push('/login')
			return
		}

		const refreshAccessToken = async () => {
			try {
				const res = await fetch(
					'https://test.arietpower.com/api/token/refresh/',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ refresh: refreshTokenValue })
					}
				)

				const data = await res.json()

				if (data?.code === 'token_not_valid') {
					router.push('/login')
					return
				}

				if (data?.access) {
					localStorage.setItem('accessToken', data.access)

					const userRes = await fetch(
						'https://test.arietpower.com/api/users/me/',
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${data.access}`
							}
						}
					)

					const userData = await userRes.json()
					const userRole = userData.role

					let targetPath = '/login'
					if (userRole === 'CLIENT') {
						targetPath = '/my-account'
					} else if (userRole === 'AMBASSADOR') {
						targetPath = '/ambassador'
					} else if (userRole === 'ADMIN') {
						targetPath = '/admin-dashboard'
					} else if (userRole === 'DEALER') {
						targetPath = '/my-account'
					}

					if (pathname !== targetPath) {
						router.push(targetPath)
						return
					}

					setIsLoading(false)
				}
			} catch {
				router.push('/login')
			}
		}

		refreshAccessToken()

		return () => {
			clearInterval(refreshToken as unknown as NodeJS.Timeout)
		}
	}, [pathname, router])

	if (isLoading) return null

	return <>{children}</>
}
