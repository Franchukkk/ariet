// app/partner/page.tsx
import { ClientComponent } from '@/components/Partner/ClientComponent'

export const dynamic = 'error'
export const revalidate = false

export default function Page() {
	return <ClientComponent />
}
