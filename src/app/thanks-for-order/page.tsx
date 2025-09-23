import { ClientComponent } from '@/components/thanks-for-order/client'

export const dynamic = 'force-dynamic'

export default function Page({
	searchParams
}: {
	searchParams: { order?: string }
}) {
	const raw = searchParams?.order ?? ''
	const orderNumber = raw && raw.trim() ? raw : '—'

	return <ClientComponent orderNumber={orderNumber} />
}
