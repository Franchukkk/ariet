'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
	children: React.ReactNode
	requiredRole?: 'user' | 'admin' | 'ambassador'
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem('authToken')
			const refreshToken = localStorage.getItem('refreshToken')

			if (!token) {
				router.push('/login')
				return
			}

			try {
				// Перевіряємо токен на сервері
				const response = await fetch('https://rpktask.sytes.net/api/auth/verify', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				})

				if (response.ok) {
					const data = await response.json()
					const userRole = data.role?.toLowerCase()

					// Перевіряємо роль
					if (requiredRole && userRole !== requiredRole) {
						// Перенаправляємо в залежності від ролі користувача
						if (userRole === 'admin') {
							router.push('/admin-dashboard')
						} else if (userRole === 'ambassador') {
							router.push('/ambassador')
						} else {
							router.push('/my-account')
						}
						return
					}

					setIsAuthenticated(true)
				} else {
					// Якщо токен невалідний, спробуємо оновити через refresh token
					if (refreshToken) {
						await refreshAccessToken(refreshToken)
					} else {
						throw new Error('No refresh token')
					}
				}
			} catch (error) {
				console.error('Auth error:', error)
				localStorage.removeItem('authToken')
				localStorage.removeItem('refreshToken')
				router.push('/login')
			} finally {
				setIsLoading(false)
			}
		}

		const refreshAccessToken = async (refreshToken: string) => {
			try {
				const response = await fetch('https://rpktask.sytes.net/api/token/refresh/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ refresh: refreshToken })
				})

				if (response.ok) {
					const data = await response.json()
					localStorage.setItem('authToken', data.access)

					// Перевіряємо новий токен
					const verifyResponse = await fetch('https://rpktask.sytes.net/api/auth/verify', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${data.access}`
						}
					})

					if (verifyResponse.ok) {
						const userData = await verifyResponse.json()
						const userRole = userData.role?.toLowerCase()

						// Перевіряємо роль
						if (requiredRole && userRole !== requiredRole) {
							// Перенаправляємо в залежності від ролі користувача
							if (userRole === 'admin') {
								router.push('/admin-dashboard')
							} else if (userRole === 'ambassador') {
								router.push('/ambassador')
							} else {
								router.push('/my-account')
							}
							return
						}

						setIsAuthenticated(true)
					} else {
						throw new Error('Token verification failed after refresh')
					}
				} else {
					throw new Error('Token refresh failed')
				}
			} catch (error) {
				console.error('Refresh token error:', error)
				localStorage.removeItem('authToken')
				localStorage.removeItem('refreshToken')
				router.push('/login')
			}
		}

		checkAuth()
	}, [router, requiredRole])

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-white">Loading...</div>
			</div>
		)
	}

	if (!isAuthenticated) {
		return null
	}

	return <>{children}</>
}
