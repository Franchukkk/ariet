import { NextResponse } from 'next/server'

type FeedbackBody = {
	name: string
	position?: string
	phone?: string
	email: string
	address?: string
	postal_code?: string
	city?: string
	country?: string
	message: string
	i_am_company_representative?: boolean
	captcha_token?: string
}

type VerifyRes = {
	success: boolean
	score?: number
	action?: string
	hostname?: string
	'error-codes'?: string[]
}

const MIN_SCORE = 0.5
const EXPECTED_ACTION = 'feedback'

// ❗️ВСТАВ СЮДИ СПРАВЖНІЙ SECRET ІЗ reCAPTCHA v3 ADMIN:
const RECAPTCHA_SECRET_KEY = '6LcaJdUrAAAAAKEZXglVmQDP92OLBTiSFZxp7USr'

export async function POST(req: Request) {
	let body: FeedbackBody
	try {
		body = (await req.json()) as FeedbackBody
	} catch {
		return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
	}

	const {
		name,
		position,
		phone,
		email,
		address,
		postal_code,
		city,
		country,
		message,
		i_am_company_representative,
		captcha_token
	} = body || {}

	if (!name || !email || !message) {
		return NextResponse.json(
			{ error: 'required fields missing' },
			{ status: 400 }
		)
	}
	if (!captcha_token) {
		return NextResponse.json(
			{ error: 'missing captcha_token' },
			{ status: 400 }
		)
	}
	if (!RECAPTCHA_SECRET_KEY) {
		return NextResponse.json(
			{ error: 'server misconfigured: missing RECAPTCHA_SECRET_KEY' },
			{ status: 500 }
		)
	}

	const verify = await fetch(
		'https://www.google.com/recaptcha/api/siteverify',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				secret: RECAPTCHA_SECRET_KEY,
				response: String(captcha_token)
			}),
			cache: 'no-store'
		}
	)
	const v = (await verify.json()) as VerifyRes

	if (!v.success) {
		return NextResponse.json(
			{ error: 'captcha failed', details: v },
			{ status: 400 }
		)
	}
	if (v.action && v.action !== EXPECTED_ACTION) {
		return NextResponse.json(
			{ error: 'captcha action mismatch', details: v },
			{ status: 400 }
		)
	}
	const score = v.score ?? 0
	if (score < MIN_SCORE) {
		return NextResponse.json(
			{ error: 'low score', score, details: v },
			{ status: 400 }
		)
	}

	// TODO: тут твоя бізнес-логіка

	return NextResponse.json({
		name,
		position,
		phone,
		email,
		address,
		postal_code,
		city,
		country,
		message,
		i_am_company_representative
	})
}
