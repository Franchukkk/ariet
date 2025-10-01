import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Lng = 'ru' | 'en'

function pickLng(raw?: string | null): Lng | undefined {
	if (!raw) return undefined
	// 'en-US,en;q=0.9' -> 'en'
	const s = String(raw).split(',')[0].split('-')[0].trim().toLowerCase()
	return s === 'en' || s === 'ru' ? s : undefined
}

export async function GET(
	req: NextRequest,
	// У твоїй збірці Next params — це Promise. Потрібно await.
	ctx: { params: Promise<{ id: string }> }
) {
	const { id } = await ctx.params

	const url = new URL(req.url)
	const hintFromQuery = pickLng(url.searchParams.get('lng'))
	const hintFromHeader = pickLng(req.headers.get('accept-language'))
	const hintFromCookie = pickLng(req.cookies.get('lng')?.value)

	// ✅ пріоритет: query → header → cookie → 'ru'
	const lng: Lng = hintFromQuery ?? hintFromHeader ?? hintFromCookie ?? 'ru'

	const upstreamUrl = new URL(
		`https://rpktask.sytes.net/api/catalog/products/${id}`
	)
	upstreamUrl.searchParams.set('lng', lng) // форсимо lng в апстрім
	upstreamUrl.searchParams.set('_', String(Date.now())) // bust cache

	try {
		const upstreamRes = await fetch(upstreamUrl.toString(), {
			headers: {
				Accept: 'application/json',
				'Accept-Language': lng,
				LANGUAGE_CODE: lng.toUpperCase()
			},
			cache: 'no-store',
			next: { revalidate: 0 }
		})

		const data = await upstreamRes.json().catch(() => ({}))
		const backendLang =
			pickLng(upstreamRes.headers.get('content-language')) ?? lng

		const res = NextResponse.json(data, { status: upstreamRes.status })
		res.headers.set('Content-Language', backendLang)
		res.headers.set('X-Debug-Lang-Sent', lng.toUpperCase())
		res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
		res.headers.set('Vary', 'Accept-Language, LANGUAGE_CODE, Cookie')

		// оновлюємо куку мови
		res.cookies.set('lng', backendLang, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			sameSite: 'lax'
		})

		return res
	} catch (err) {
		return NextResponse.json(
			{ error: 'Upstream fetch failed', detail: String(err) },
			{
				status: 502,
				headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
			}
		)
	}
}
