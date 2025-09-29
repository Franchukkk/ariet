// src/api/feedback.ts

export type FeedbackPayload = {
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

export type FeedbackResponse = {
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
}

const FEEDBACK_URL = '/api/feedback/create/'

function getCookie(name: string) {
	if (typeof document === 'undefined') return ''
	const m = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'))
	return m ? decodeURIComponent(m[2]) : ''
}

async function postJSON(url: string, payload: any) {
	const csrftoken = getCookie('csrftoken')
	return fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...(csrftoken ? { 'X-CSRFToken': csrftoken } : {}),
			'X-Requested-With': 'XMLHttpRequest'
		},
		body: JSON.stringify(payload)
	})
}

async function postFormData(url: string, payload: Record<string, any>) {
	const csrftoken = getCookie('csrftoken')
	const fd = new FormData()
	Object.entries(payload).forEach(([k, v]) => {
		if (v !== undefined && v !== null)
			fd.append(k, typeof v === 'string' ? v : String(v))
	})
	return fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			...(csrftoken ? { 'X-CSRFToken': csrftoken } : {}),
			'X-Requested-With': 'XMLHttpRequest'
		},
		body: fd
	})
}

/** Форматує 400 з DRF/Swagger: {field: ["err1","err2"], ..., detail:"..."} */
async function formatServerError(res: Response): Promise<string> {
	// спробуємо як JSON
	try {
		const data = await res.clone().json()
		// { detail: "..." }
		if (typeof data?.detail === 'string') return data.detail

		// { field: ["msg"], field2: ["msg2", ...] }
		if (data && typeof data === 'object') {
			const parts: string[] = []
			for (const [key, val] of Object.entries<any>(data)) {
				if (Array.isArray(val)) {
					parts.push(`${key}: ${val.join(', ')}`)
				} else if (typeof val === 'string') {
					parts.push(`${key}: ${val}`)
				} else if (val && typeof val === 'object') {
					// вкладені помилки
					parts.push(`${key}: ${JSON.stringify(val)}`)
				}
			}
			if (parts.length) return parts.join(' • ')
		}
	} catch {}
	// якщо не JSON — повернемо текст/HTML заглушку
	try {
		const text = await res.text()
		if (text) return text
	} catch {}
	return `HTTP ${res.status}`
}

/**
 * Відправляє фідбек рівно у форматі Swagger.
 * Стратегія:
 *  1) JSON (з captcha_token, якщо переданий у payload)
 *  2) якщо 5xx → JSON БЕЗ captcha_token
 *  3) якщо знову 5xx → FormData БЕЗ captcha_token
 * Для 400 повертаємо зрозумілу помилку з полями.
 */
export async function submitFeedback(
	payload: FeedbackPayload,
	url: string = FEEDBACK_URL
): Promise<FeedbackResponse> {
	// 1) перша спроба
	let res = await postJSON(url, payload)

	// 2) fallbackи тільки для 5xx
	if (res.status >= 500) {
		const { captcha_token, ...withoutCaptcha } = payload
		res = await postJSON(url, withoutCaptcha)
	}
	if (res.status >= 500) {
		const { captcha_token, ...withoutCaptcha } = payload
		res = await postFormData(url, withoutCaptcha)
	}

	// 4xx/3xx/інше
	if (!res.ok) {
		const msg =
			res.status === 400 ? await formatServerError(res) : `HTTP ${res.status}`
		throw new Error(msg)
	}

	// успіх
	const data = (await res.json().catch(async () => {
		const text = await res.text().catch(() => '')
		throw new Error(text || 'Invalid JSON response')
	})) as FeedbackResponse

	return data
}
