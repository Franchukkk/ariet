'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import LogoutSvg from '../../../../public/logout.svg'
import UserSvg from '../../../../public/user.svg'

import { getRefreshToken, logout } from '@/helpers/auth'

export const User = () => {
	const router = useRouter()
	const pathname = usePathname()
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		const checkToken = async () => {
			const refreshToken = getRefreshToken()
			if (!refreshToken) return

			try {
				const refreshRes = await fetch(
					'https://rpktask.sytes.net/api/token/refresh/',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ refresh: refreshToken })
					}
				)

				const refreshData = await refreshRes.json()

				if (refreshData.access) {
					localStorage.setItem('accessToken', refreshData.access)

					const userRes = await fetch(
						'https://rpktask.sytes.net/api/users/me/',
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${refreshData.access}`
							}
						}
					)

					const userData = await userRes.json()

					const rolePath =
						userData.role === 'CLIENT'
							? '/my-account'
							: userData.role === 'AMBASSADOR'
								? '/ambassador'
								: userData.role === 'ADMIN'
									? '/admin-dashboard'
									: '/my-account'

					if (pathname === rolePath) {
						setIsAuthenticated(true)
					}
				}
			} catch (err) {
				console.error('Check token error:', err)
			}
		}

		checkToken()
	}, [pathname])

	const handleClick = async () => {
		if (isAuthenticated) {
			logout()
		} else {
			router.push('/login')
		}
	}

	return (
		<StyledUser onClick={handleClick}>
			{isAuthenticated ? (
				<LogoutSvg aria-label='logout' />
			) : (
				<UserSvg aria-label='user' />
			)}
		</StyledUser>
	)
}

const StyledUser = styled.button`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 18px 24px;
	border-radius: 15px;
	background: #4bc785;
	height: 62px;
	width: 73px;
	flex-shrink: 0;

	@media (max-width: 1400px) {
		width: 60px;
		padding: 10px;
	}
`
