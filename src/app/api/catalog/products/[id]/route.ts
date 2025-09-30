import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Lng = 'ru' | 'en'

function pickLng(raw?: string | null): Lng | undefined {
	const s = (raw || '').split('-')[0].toLowerCase()
	if (s === 'en' || s === 'ru') return s
	return undefined
}

export async function GET(
	req: NextRequest,
	// ⬇️ ВАЖЛИВО: params як Promise, а нижче — await
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params // ⬅️ виправлення помилки

	const url = new URL(req.url)
	const hintFromQuery = pickLng(url.searchParams.get('lng'))
	const hintFromCookie = pickLng(req.cookies.get('lng')?.value)
	const hint: Lng | undefined = hintFromQuery ?? hintFromCookie

	const upstream = `https://rpktask.sytes.net/api/catalog/products/${id}?lng=${hint ?? ''}&_=${Date.now()}`

	try {
		const upstreamRes = await fetch(upstream, {
			headers: {
				...(hint ? { 'Accept-Language': hint } : {}),
				...(hint ? { LANGUAGE_CODE: hint.toUpperCase() } : {})
			},
			cache: 'no-store',
			next: { revalidate: 0 }
		})

		const data = await upstreamRes.json()

		const backendLang =
			upstreamRes.headers
				.get('content-language')
				?.split('-')[0]
				.toLowerCase() ||
			hint ||
			'ru'

		const res = NextResponse.json(data, { status: upstreamRes.status })
		res.headers.set('Content-Language', backendLang)
		res.headers.set('X-Debug-Lang-Sent', (hint ?? '').toUpperCase())
		res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
		res.headers.set('Vary', 'Accept-Language, LANGUAGE_CODE, Cookie')

		// зберігаємо вибір мови у куку (для наступних запитів)
		res.cookies.set('lng', backendLang, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			sameSite: 'lax'
		})

		return res
	} catch (err) {
		return NextResponse.json(
			{ error: 'Upstream fetch failed', detail: String(err) },
			{ status: 502, headers: { 'Cache-Control': 'no-store' } }
		)
	}
}
