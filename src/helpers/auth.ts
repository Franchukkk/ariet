// Утиліта для роботи з токенами
export const getAuthHeaders = (): Record<string, string> => {
	const token = localStorage.getItem('authToken')
	return token ? { Authorization: `Bearer ${token}` } : {}
}

export const refreshToken = async (): Promise<boolean> => {
	const refreshTokenValue = localStorage.getItem('refreshToken')

	if (!refreshTokenValue) {
		return false
	}

	try {
		const response = await fetch(
			'https://rpktask.sytes.net/api/token/refresh/',
			{
				method: 'POST',

				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ refresh: refreshTokenValue })
			}
		)

		if (response.ok) {
			const data = await response.json()
			localStorage.setItem('authToken', data.access)
			return true
		} else {
			// Refresh token невалідний, очищаємо все
			localStorage.removeItem('authToken')
			localStorage.removeItem('refreshToken')
			return false
		}
	} catch (error) {
		console.error('Token refresh failed:', error)
		localStorage.removeItem('authToken')
		localStorage.removeItem('refreshToken')
		return false
	}
}

export const makeAuthenticatedRequest = async (
	url: string,
	options: RequestInit = {}
): Promise<Response> => {
	const authHeaders = getAuthHeaders()

	const response = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...authHeaders,
			...options.headers
		}
	})

	// Якщо токен прострочений, спробуємо оновити
	if (response.status === 401) {
		const refreshed = await refreshToken()

		if (refreshed) {
			// Повторюємо запит з новим токеном
			const newAuthHeaders = getAuthHeaders()
			return fetch(url, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...newAuthHeaders,
					...options.headers
				}
			})
		} else {
			// Перенаправляємо на логін
			window.location.href = '/login'
		}
	}

	return response
}

export const logout = () => {
	localStorage.removeItem('authToken')
	localStorage.removeItem('refreshToken')
	window.location.href = '/login'
}

// Функція для отримання поточної ролі користувача
export const getCurrentUserRole = async (): Promise<string | null> => {
	const token = localStorage.getItem('authToken')

	if (!token) {
		return null
	}

	try {
		const response = await fetch('https://rpktask.sytes.net/api/auth/verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		})

		if (response.ok) {
			const data = await response.json()
			return data.role?.toLowerCase() || null
		} else {
			// Спробуємо оновити токен
			const refreshed = await refreshToken()
			if (refreshed) {
				return getCurrentUserRole() // Рекурсивний виклик з новим токеном
			}
			return null
		}
	} catch (error) {
		console.error('Get user role failed:', error)
		return null
	}
}
