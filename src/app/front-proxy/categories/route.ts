import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

const UPSTREAM = 'https://rpktask.sytes.net/api/catalog/categories/'

type Lng = 'ru' | 'en'
const pickLng = (raw?: string | null): Lng | undefined => {
	if (!raw) return undefined
	const s = String(raw).split(',')[0].split('-')[0].trim().toLowerCase()
	return s === 'ru' || s === 'en' ? s : undefined
}

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url)

		const hintFromQuery = pickLng(url.searchParams.get('lng'))
		const hintFromHeader = pickLng(req.headers.get('accept-language'))
		const hintFromCookie = pickLng(req.cookies.get('lng')?.value)

		// ✅ пріоритет: query → header → cookie → 'ru'
		const lng: Lng = hintFromQuery ?? hintFromHeader ?? hintFromCookie ?? 'ru'

		// прокидуємо всі query + обов'язково ставимо lng
		const upstreamUrl = new URL(UPSTREAM)
		for (const [k, v] of url.searchParams.entries()) {
			upstreamUrl.searchParams.set(k, v)
		}
		upstreamUrl.searchParams.set('lng', lng)

		const upstreamRes = await fetch(upstreamUrl.toString(), {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Accept-Language': lng,
				LANGUAGE_CODE: lng.toUpperCase(),
				'Cache-Control': 'no-store',
				Pragma: 'no-cache'
			},
			cache: 'no-store',
			redirect: 'follow'
		})

		const body = await upstreamRes.text()
		const backendLang =
			pickLng(upstreamRes.headers.get('content-language')) ?? lng

		const res = new NextResponse(body, {
			status: upstreamRes.status,
			headers: {
				'content-type':
					upstreamRes.headers.get('content-type') ||
					'application/json; charset=utf-8',
				'cache-control': 'no-store, no-cache, must-revalidate',
				'Content-Language': backendLang,
				Vary: 'Accept-Language, LANGUAGE_CODE, Cookie',
				'X-Debug-Lang-Sent': lng.toUpperCase()
			}
		})

		// оновлюємо/виставляємо куку з мовою
		res.cookies.set('lng', backendLang, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			sameSite: 'lax'
		})

		return res
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message || 'Proxy failed' },
			{
				status: 500,
				headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
			}
		)
	}
}
