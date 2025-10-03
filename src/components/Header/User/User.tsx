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
	const [showLogout, setShowLogout] = useState(false)

	useEffect(() => {
		const checkToken = async () => {
			const refreshTokenValue = getRefreshToken()
			if (!refreshTokenValue) return

			try {
				const res = await fetch(
					'https://test.arietpower.com/api/token/refresh/',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ refresh: refreshTokenValue })
					}
				)

				const data = await res.json()
				if (!data.access) return

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

				const rolePath =
					userData.role === 'CLIENT'
						? '/my-account'
						: userData.role === 'AMBASSADOR'
							? '/ambassador'
							: userData.role === 'ADMIN'
								? '/admin-dashboard'
								: '/my-account'

				// Показуємо Logout тільки якщо зараз на особистій сторінці
				setShowLogout(pathname === rolePath)
			} catch (err) {
				console.error('Auth check error:', err)
			}
		}

		checkToken()
	}, [pathname])

	const handleClick = () => {
		if (showLogout) {
			logout()
		} else {
			router.push('/login')
		}
	}

	return (
		<StyledUser onClick={handleClick}>
			{showLogout ? (
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
