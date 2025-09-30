import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const UPSTREAM = 'https://rpktask.sytes.net/api/catalog/categories/'

export async function GET(req: Request) {
	try {
		const url = new URL(req.url)
		const lng = (url.searchParams.get('lng') || 'ru').split('-')[0]

		const upstreamUrl = new URL(UPSTREAM)
		for (const [k, v] of url.searchParams.entries())
			upstreamUrl.searchParams.set(k, v)
		upstreamUrl.searchParams.set('lng', lng)

		const res = await fetch(upstreamUrl.toString(), {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Accept-Language': lng,
				'X-Language': lng,
				'Cache-Control': 'no-store',
				Pragma: 'no-cache'
			},
			cache: 'no-store',
			redirect: 'follow'
		})

		const body = await res.text()
		return new NextResponse(body, {
			status: res.status,
			headers: {
				'content-type': res.headers.get('content-type') || 'application/json',
				'cache-control': 'no-store, max-age=0'
			}
		})
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message || 'Proxy failed' },
			{ status: 500 }
		)
	}
}
