import { ClientComponent } from '@/components/thanks-for-order/client'

export const dynamic = 'force-dynamic'

export default async function Page({
	searchParams
}: {
	// у нових версіях Next це Promise
	searchParams: Promise<{ order?: string }>
}) {
	const sp = await searchParams
	const rawParam = decodeURIComponent((sp?.order ?? '').trim())
	// НІЧОГО тут не фетчимо, просто передаємо далі
	return <ClientComponent initialOrderParam={rawParam} />
}
