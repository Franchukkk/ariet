import { Suspense } from 'react'

import { ClientComponent } from '@/components/ambassador/ClientComponent'

export const dynamic = 'force-dynamic'
export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClientComponent />
		</Suspense>
	)
}
