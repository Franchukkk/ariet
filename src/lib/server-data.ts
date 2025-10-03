import { headers } from 'next/headers'

export type Lng = 'ru' | 'en'
export interface ICategory {
	id: number
	name: string
	image?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeCategories = (json: any, lng: Lng): ICategory[] => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const arr: any[] = Array.isArray(json) ? json : (json?.results ?? [])
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return arr.map((c: any) => {
		const localized = c?.[`name_${lng}`]
		const name =
			(typeof localized === 'string' && localized) ||
			(typeof c?.name === 'string' && c.name) ||
			(typeof c?.title === 'string' && c.title) ||
			(typeof c?.label === 'string' && c.label) ||
			''
		const rawImg = c?.image ?? c?.photo ?? c?.banner ?? null
		const image = typeof rawImg === 'string' ? rawImg : (rawImg?.url ?? null)
		return { id: Number(c?.id), name, image }
	})
}

export async function getBaseUrl() {
	const h = await headers() // ✅ обов’язково await у Next 15
	const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
	const proto = h.get('x-forwarded-proto') ?? 'http'
	return `${proto}://${host}`
}

export async function getCategories(
	lng: Lng = 'ru',
	pageSize = 99
): Promise<ICategory[]> {
	const base = await getBaseUrl()
	const qs = new URLSearchParams({ page_size: String(pageSize), lng })
	const url = `${base}/front-proxy/categories?${qs.toString()}`

	const res = await fetch(url, {
		// Можеш підкрутити TTL через `export const revalidate` на сторінці
		next: { revalidate: 300, tags: ['categories', `categories:${lng}`] }
	})
	if (!res.ok) throw new Error(`Failed to load categories: ${res.status}`)
	const json = await res.json()
	return normalizeCategories(json, lng)
}

export async function getProductName(
	id: number,
	lng: Lng = 'ru'
): Promise<string> {
	const base = await getBaseUrl()
	const url = `${base}/front-proxy/products/${id}?lng=${lng}`

	const res = await fetch(url, {
		next: {
			revalidate: 300,
			tags: ['product', `product:${id}`, `product:${id}:${lng}`]
		}
	})
	if (!res.ok) return ''
	const json = await res.json()
	const localized = json?.[`name_${lng}`]
	return (
		(typeof localized === 'string' && localized) ||
		(typeof json?.name === 'string' && json.name) ||
		(typeof json?.title === 'string' && json.title) ||
		''
	)
}
