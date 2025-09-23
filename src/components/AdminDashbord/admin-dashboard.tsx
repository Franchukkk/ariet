'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { OrderData } from '@/components/AdminDashbord/OrderData'
import { OrderInfo } from '@/components/AdminDashbord/OrderInfo'
import { TitleAdminDashboard } from '@/components/AdminDashbord/TitleAdminDashboard'
import { UserAdminInfo } from '@/components/AdminDashbord/UserAdminInfo'
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute'

const ordersInfo = {
	totalOrders: 1000,
	newOrders: 10,
	totalSum: 10000,
	averageOrderPrice: 1000,
	date: '2025-01-01'
}

export const ClientComponent = () => {
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [refreshToken, setRefreshToken] = useState<string | null>(null)

	useEffect(() => {
		const access = localStorage.getItem('accessToken')
		const refresh = localStorage.getItem('refreshToken')
		setAccessToken(access)
		setRefreshToken(refresh)

		if (!refresh || !access) return

		fetch('https://rpktask.sytes.net/api/token/refresh/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ refresh })
		})
			.then(res => res.json())
			.then(data => {
				if (data.access) {
					setAccessToken(data.access)
					localStorage.setItem('accessToken', data.access)
				}
			})

		fetch('https://rpktask.sytes.net/api/orders/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access}`
			}
		})
			.then(res => res.json())
			.then(data => console.log(data))
			.catch(err => console.log(err))
	}, [])

	return (
		<ProtectedRoute>
			<MainWrapper className='main-wrapper !mb-[130px]'>
				<TitleAdminDashboard />
				<Wrapper className='flex flex-row justify-between items-start'>
					<UserAdminInfo />
					<div className='flex-1 min-w-0 max-w-full overflow-hidden'>
						<OrderInfo orderInfo={ordersInfo} />
						<OrderData />
					</div>
				</Wrapper>
			</MainWrapper>
		</ProtectedRoute>
	)
}

const MainWrapper = styled.div`
	@media (max-width: 1000px) {
		margin-bottom: 60px;
	}
`

const Wrapper = styled.div`
	@media (max-width: 600px) {
		align-items: center;
		flex-direction: column;
		gap: 30px;
	}

	@media (max-width: 800px) {
		flex-direction: column;
	}
`
