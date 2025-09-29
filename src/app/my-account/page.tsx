import { Suspense } from 'react'

import { ClientMyAccount } from '@/components/MyAccount/ClientMyAccount'

export const dynamic = 'force-dynamic'

export default function Page() {
	return (
		<Suspense>
			<ClientMyAccount />
		</Suspense>
	)
}
