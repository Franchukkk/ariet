import { NextRequest, NextResponse } from 'next/server'

type Lng = 'ru' | 'en'

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params

	const url = new URL(req.url)
	const raw = (url.searchParams.get('lng') || '').split('-')[0].toLowerCase()
	const hint = (raw === 'en' ? 'en' : raw === 'ru' ? 'ru' : undefined) as
		| Lng
		| undefined

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
		res.headers.set('Vary', 'Accept-Language, LANGUAGE_CODE')
		res.headers.append(
			'Set-Cookie',
			`lng=${backendLang}; Path=/; Max-Age=31536000; SameSite=Lax`
		)

		return res
	} catch (err) {
		return NextResponse.json(
			{ error: 'Upstream fetch failed', detail: String(err) },
			{ status: 502 }
		)
	}
}
