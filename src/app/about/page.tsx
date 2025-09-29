import { Suspense } from 'react'

import { ClientComponent } from '@/components/About/ClientComponent'

export const dynamic = 'force-dynamic'
export default function Page() {
	return (
		<Suspense>
			<ClientComponent />
		</Suspense>
	)
}
