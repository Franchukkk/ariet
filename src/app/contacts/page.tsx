import { Suspense } from 'react'

import { ClientContacts } from '@/components/Contacts/ClientContacts'

export const dynamic = 'force-dynamic'

export default function Page() {
	return (
		<Suspense>
			<ClientContacts />
		</Suspense>
	)
}
