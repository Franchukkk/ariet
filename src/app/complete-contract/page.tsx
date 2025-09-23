import { Suspense } from 'react'

import { ClientCompleteContract } from '@/components/CompleteContract/ClientCompleteContract'

export const dynamic = 'force-dynamic'

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClientCompleteContract />
		</Suspense>
	)
}
