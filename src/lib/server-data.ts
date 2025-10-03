// src/lib/server-data.ts
import { headers } from 'next/headers'

export type Lng = 'ru' | 'en'
export interface ICategory {
	id: number
	name: string
	image?: string | null
}

const normalizeCategories = (json: any, lng: Lng): ICategory[] => {
	const arr: any[] = Array.isArray(json) ? json : (json?.results ?? [])
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
