'use client'

import { Suspense } from 'react'

import { ClientComponent } from '@/components/AdminDashbord/ClientComponent'

export const dynamic = 'force-dynamic'
export default function Page() {
	return (
		<Suspense>
			<ClientComponent />
		</Suspense>
	)
}
