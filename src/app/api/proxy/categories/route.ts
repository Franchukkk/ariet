// src/app/api/proxy/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const UPSTREAM = 'https://rpktask.sytes.net/api/catalog/categories/'

// вибираємо назву під мову з різних можливих форматів відповіді
function pickName(obj: any, lng: 'ru' | 'en') {
	if (obj?.[`name_${lng}`]) return String(obj[`name_${lng}`]) // name_en / name_ru
	if (obj?.translations?.[lng]?.name) return String(obj.translations[lng].name) // { translations: { en: {name}, ru:{name} } }
	if (obj?.names?.[lng]) return String(obj.names[lng]) // names: { en:..., ru:... }
	return String(obj?.name ?? '') // дефолт
}

export async function GET(req: NextRequest) {
	try {
		const lng = (
			(req.nextUrl.searchParams.get('lng') || 'ru').split('-')[0] === 'en'
				? 'en'
				: 'ru'
		) as 'ru' | 'en'

		// проброс інших query (page_size тощо), але без lng
		const upstream = new URL(UPSTREAM)
		req.nextUrl.searchParams.forEach((v, k) => {
			if (k !== 'lng') upstream.searchParams.set(k, v)
		})

		// максимум підказок бекові про мову
		const res = await fetch(upstream.toString(), {
			method: 'GET',
			headers: {
				accept: 'application/json',
				'accept-language': lng,
				'x-language': lng,
				// інколи допомагає cookie або custom header, якщо на бекові middleware
				cookie: `django_language=${lng};lang=${lng}`,
				'cache-control': 'no-store',
				pragma: 'no-cache'
			},
			cache: 'no-store'
		})

		const rawText = await res.text()
		let raw: any
		try {
			raw = JSON.parse(rawText)
		} catch {
			// якщо бек віддав не-JSON — просто віддай як є
			return new NextResponse(rawText, {
				status: res.status,
				headers: {
					'content-type': res.headers.get('content-type') || 'application/json',
					'cache-control': 'no-store, max-age=0',
					vary: 'Accept-Language'
				}
			})
		}

		const list: any[] = Array.isArray(raw)
			? raw
			: Array.isArray(raw?.results)
				? raw.results
				: []
		const mapped = list.map(c => ({
			id: c.id,
			name: pickName(c, lng), // ← тут нормалізуємо під мову
			image: c.image ?? null
		}))

		const body = Array.isArray(raw) ? mapped : { ...raw, results: mapped }

		return NextResponse.json(body, {
			status: res.status,
			headers: {
				'cache-control': 'no-store, max-age=0',
				vary: 'Accept-Language'
			}
		})
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message || 'Proxy failed' },
			{ status: 500 }
		)
	}
}
