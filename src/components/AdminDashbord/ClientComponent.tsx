'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { OrderInfo } from '@/components/AdminDashbord/OrderInfo'
import { TitleAdminDashboard } from '@/components/AdminDashbord/TitleAdminDashboard'
import { UserAdminInfo } from '@/components/AdminDashbord/UserAdminInfo'
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute'

import { OrderData } from './OrderData'

export const ClientComponent = () => {
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [refreshToken, setRefreshToken] = useState<string | null>(null)

	useEffect(() => {
		const access = localStorage.getItem('accessToken')
		const refresh = localStorage.getItem('refreshToken')
		setAccessToken(access)
		setRefreshToken(refresh)

		if (!refresh || !access) return

		fetch('https://test.arietpower.com/api/token/refresh/', {
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

		fetch('https://test.arietpower.com/api/orders/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access}`
			}
		}).catch(() => {})
	}, [])

	return (
		<ProtectedRoute>
			<MainWrapper className='main-wrapper !mb-[130px]'>
				<TitleAdminDashboard />
				<Wrapper>
					<UserAdminInfo />
					<RightCol>
						<OrderInfo />
					</RightCol>
				</Wrapper>

				<OrderDataWrapper>
					<OrderData />
				</OrderDataWrapper>
			</MainWrapper>
		</ProtectedRoute>
	)
}
const Wrapper = styled.div`
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 20px;
	align-items: center;

	@media (max-width: 800px) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 30px;
	}

	@media (max-width: 600px) {
		align-items: center;
	}
`

const RightCol = styled.div`
	flex: 1;
	min-width: 0;
	max-width: 100%;
	overflow: hidden;
`

const MainWrapper = styled.div`
	@media (max-width: 1000px) {
		margin-bottom: 60px;
	}
`

const OrderDataWrapper = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	margin-top: 60px;

	& > * {
		margin-inline: auto;
	}

	@media (max-width: 1000px) {
		margin-top: 30px;
		padding-bottom: 10px;
	}
`
