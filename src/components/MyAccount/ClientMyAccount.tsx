'use client'

import { Orders } from '@/components/MyAccount/Orders'
import { TitleMyAccount } from '@/components/MyAccount/TitleMyAccount'
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute'

export const ClientMyAccount = () => {
	return (
		<ProtectedRoute>
			<TitleMyAccount />
			<Orders />
		</ProtectedRoute>
	)
}
