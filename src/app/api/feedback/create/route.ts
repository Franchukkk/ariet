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
		credentials: 'include', // пересилаємо csrftoken/session
		headers: {
			'Content-Type': 'application/json',
			...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
		},
		body: JSON.stringify(payload)
	})
}

async function postFormData(url: string, payload: Record<string, any>) {
	const csrftoken = getCookie('csrftoken')
	const fd = new FormData()
	Object.entries(payload).forEach(([k, v]) => {
		if (v !== undefined && v !== null) {
			fd.append(k, typeof v === 'string' ? v : String(v))
		}
	})
	return fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
			// НЕ задаємо Content-Type — браузер виставить boundary сам
		},
		body: fd
	})
}

/**
 * Надсилає фідбек у форматі, як у Swagger.
 * Повертає JSON-відповідь бекенду або кидає помилку з текстом.
 *
 * Стратегія:
 *  1) JSON з captcha_token (якщо є у payload)
 *  2) якщо 5xx → JSON без captcha_token
 *  3) якщо знову 5xx → FormData без captcha_token
 */
export async function submitFeedback(
	payload: FeedbackPayload,
	url: string = FEEDBACK_URL
): Promise<FeedbackResponse> {
	// 1) JSON із captcha_token (якщо присутній)
	let res = await postJSON(url, payload)

	// 2) fallback без captcha_token, якщо сервер впав
	if (res.status >= 500) {
		const { captcha_token, ...withoutCaptcha } = payload
		// лише якщо ми дійсно щось видаляємо або все одно 5xx
		res = await postJSON(url, withoutCaptcha)
	}

	// 3) ще один fallback: FormData (деякі бекенди чекають не JSON)
	if (res.status >= 500) {
		const { captcha_token, ...withoutCaptcha } = payload
		res = await postFormData(url, withoutCaptcha)
	}

	if (!res.ok) {
		// Спробуємо зчитати текст помилки (HTML/JSON) для діагностики
		const text = await res.text().catch(() => '')
		throw new Error(text || `HTTP ${res.status}`)
	}

	// Очікуємо JSON за Swagger’ом
	const data = (await res.json().catch(async () => {
		const text = await res.text().catch(() => '')
		throw new Error(text || 'Invalid JSON response')
	})) as FeedbackResponse

	return data
}
