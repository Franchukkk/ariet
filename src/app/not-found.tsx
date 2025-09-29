import { Suspense } from 'react'

import { NotFoundClient } from '@/components/Not found/client'

export const dynamic = 'force-dynamic'

export default function NotFound() {
	return (
		<Suspense>
			<NotFoundClient />
		</Suspense>
	)
}
