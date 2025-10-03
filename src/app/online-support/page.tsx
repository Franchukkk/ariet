// app/online-support/page.tsx
import { ClientComponent } from '@/components/OnlineSupport/ClientComponent'

export const dynamic = 'error'
export const revalidate = false

export default function Page() {
	return <ClientComponent />
}
