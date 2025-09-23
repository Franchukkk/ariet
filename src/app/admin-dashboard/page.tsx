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

export default function Page() {
	const [accessToken, setAccessToken] = useState<string | null>(
		localStorage.getItem('accessToken')
	)
	const [refreshToken, setRefreshToken] = useState<string | null>(
		localStorage.getItem('refreshToken')
	)

	useEffect(() => {
		console.log('useEffect')

		fetch('https://rpktask.sytes.net/api/token/refresh/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ refresh: refreshToken })
		})

		fetch('https://rpktask.sytes.net/api/orders/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			}
		})
			.then(res => res.json())
			.then(data => console.log(data))
			.catch(err => console.log(err))
	}, [accessToken])

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
