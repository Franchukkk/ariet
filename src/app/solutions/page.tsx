import { Suspense } from 'react'

import { ClientComponent } from '@/components/Solutions/ClientComponent'

export const dynamic = 'force-dynamic'
export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClientComponent />
		</Suspense>
	)
}
