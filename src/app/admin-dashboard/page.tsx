import { Suspense } from 'react'

import { ClientComponent } from '@/components/AdminDashbord/admin-dashboard'

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClientComponent />
		</Suspense>
	)
}
