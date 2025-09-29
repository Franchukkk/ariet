import { Suspense } from 'react'

import { ClientComponent } from '@/components/RegistrationForm/RegistrationClient'

export const dynamic = 'force-dynamic'
export default function Page() {
	return (
		<Suspense>
			<ClientComponent />
		</Suspense>
	)
}
