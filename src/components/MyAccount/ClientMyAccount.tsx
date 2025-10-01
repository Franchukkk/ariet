'use client'

import styled from 'styled-components'

import { Orders } from '@/components/MyAccount/Orders'
import { TitleMyAccount } from '@/components/MyAccount/TitleMyAccount'
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute'

const OrdersWrap = styled.div`
	margin-bottom: 40px;
	@media (max-width: 768px) {
		margin-bottom: 20px;
	}
`

export const ClientMyAccount = () => {
	return (
		<ProtectedRoute>
			<TitleMyAccount />
			<OrdersWrap>
				<Orders />
			</OrdersWrap>
		</ProtectedRoute>
	)
}
