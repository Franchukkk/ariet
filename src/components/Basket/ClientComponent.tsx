'use client'

import { Basket } from '@/components/Basket/Basket'
import { PublicRoute } from '@/components/PublicRoute/PublicRoute'

export const ClientComponent = () => {
	return (
		<PublicRoute>
			<Basket />
		</PublicRoute>
	)
}
