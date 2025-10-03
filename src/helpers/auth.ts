// Утиліти для роботи з токенами

// Функція для отримання токена з localStorage
export const getAccessToken = (): string | null => {
	if (typeof localStorage !== 'undefined') {
		return localStorage.getItem('accessToken')
	}
	return null
}

export const getRefreshToken = (): string | null => {
	if (typeof localStorage !== 'undefined') {
		return localStorage.getItem('refreshToken')
	}
	return null
}

export const refreshToken = async (): Promise<boolean> => {
	const refreshTokenValue = getRefreshToken()
	if (!refreshTokenValue) return false

	try {
		const response = await fetch(
			'https://test.arietpower.com/api/token/refresh/',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh: refreshTokenValue })
			}
		)

		if (response.ok) {
			const data = await response.json()
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('accessToken', data.access)
			}
			return true
		} else {
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('accessToken')
				localStorage.removeItem('refreshToken')
			}
			return false
		}
	} catch (error) {
		console.error('Token refresh failed:', error)
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('accessToken')
			localStorage.removeItem('refreshToken')
		}
		return false
	}
}

export const logout = () => {
	if (typeof localStorage !== 'undefined') {
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
	}
	window.location.href = '/login'
}
