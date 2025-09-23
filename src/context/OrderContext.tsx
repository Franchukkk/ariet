// context/OrderContext.tsx
'use client'

import { createContext, useContext, useState } from 'react'

import { useBasket } from './BasketContext'
import { getAccessToken, refreshToken } from '@/helpers/auth'

// context/OrderContext.tsx

type SubmitResult = {
	success: boolean
	orderNumber?: string
	orderId?: number
	orderCode?: string
	error?: string | null
}

type OrderContextType = {
	submitOrder: (formData: FormData) => Promise<SubmitResult>
	loading: boolean
	error: string | null
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)
const API_BASE = 'https://rpktask.sytes.net/api'

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { basket, discount, promoCode } = useBasket()

	const withAuth = async () => {
		let token = getAccessToken()
		if (!token) {
			const refreshed = await refreshToken()
			if (!refreshed) return null
			token = getAccessToken()
		}
		return token
	}

	const fetchOwnLatestOrder = async (token: string) => {
		try {
			const r = await fetch(`${API_BASE}/orders/?page_size=1`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				cache: 'no-store'
			})
			if (!r.ok)
				return {
					id: undefined as number | undefined,
					code: undefined as string | undefined
				}
			const j = await r.json()
			const row = Array.isArray(j?.results) ? j.results[0] : null
			return {
				id: typeof row?.id === 'number' ? row.id : undefined,
				code: typeof row?.code === 'string' ? row.code : undefined
			}
		} catch {
			return { id: undefined, code: undefined }
		}
	}

	const findOrderIdByCode = async (token: string, code: string) => {
		try {
			const r = await fetch(
				`${API_BASE}/orders/?search=${encodeURIComponent(code)}&page_size=1`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					cache: 'no-store'
				}
			)
			if (!r.ok) return null
			const j = await r.json()
			const row = Array.isArray(j?.results) ? j.results[0] : null
			return typeof row?.id === 'number' ? row.id : null
		} catch {
			return null
		}
	}

	const submitOrder = async (formData: FormData): Promise<SubmitResult> => {
		setLoading(true)
		setError(null)

		try {
			const token = await withAuth()
			if (!token) {
				const msg = 'Користувач не авторизований'
				setError(msg)
				return { success: false, error: msg }
			}

			const safe = (v: FormDataEntryValue | null) => (v ? String(v).trim() : '')

			const name = safe(formData.get('Name'))
			const surname = safe(formData.get('Surname'))
			const email = safe(formData.get('Email'))
			const phone = safe(formData.get('Phone'))
			const billingAddress = safe(formData.get('Address'))
			const shippingAddress = safe(formData.get('Transport_company_address'))

			if (
				!name ||
				!surname ||
				!email ||
				!phone ||
				!billingAddress ||
				!shippingAddress
			) {
				const msg = 'Будь ласка, заповніть усі обов’язкові поля'
				setError(msg)
				return { success: false, error: msg }
			}

			const items = basket.map(item => ({
				variant: (item as any).variantId ?? item.id,
				quantity: item.quantity || 1
			}))

			const body = {
				client_type: 'INDIVIDUAL',
				full_name: `${name} ${surname}`,
				email,
				phone,
				billing_address: billingAddress,
				shipping_address: shippingAddress,
				company_name: safe(formData.get('TC_number')),
				vat_number: safe(formData.get('Field_3')),
				comment: safe(formData.get('Comment')),
				items,
				promo_code: discount > 0 && promoCode ? promoCode : undefined
			}

			const res = await fetch(`${API_BASE}/orders/create/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(body)
			})

			let data: any = null
			try {
				data = await res.json()
			} catch {
				const msg = 'Невалідна відповідь від сервера'
				setError(msg)
				return { success: false, error: msg }
			}

			if (!res.ok || data?.error || data?.detail) {
				const msg = (data?.detail ||
					data?.error ||
					'Помилка при створенні замовлення') as string
				setError(msg)
				return { success: false, error: msg }
			}

			// 1) пробуємо взяти з відповіді
			let orderId: number | undefined =
				typeof data?.id === 'number'
					? data.id
					: typeof data?.order?.id === 'number'
						? data.order.id
						: undefined

			let orderCode: string | undefined =
				typeof data?.code === 'string'
					? data.code
					: typeof data?.order?.code === 'string'
						? data.order.code
						: undefined

			// 2) якщо є code, але немає id — шукаємо id по code
			if (!orderId && orderCode) {
				const found = await findOrderIdByCode(token, orderCode)
				if (found) orderId = found
			}

			// 3) якщо взагалі нічого — беремо твій останній заказ
			if (!orderId && !orderCode) {
				const latest = await fetchOwnLatestOrder(token)
				orderId = latest.id
				orderCode = latest.code
			}

			const orderNumber = String(orderId ?? orderCode ?? 'unknown')
			return { success: true, orderNumber, orderId, orderCode }
		} catch (err: any) {
			const msg = err?.message || 'Невідома помилка'
			setError(msg)
			return { success: false, error: msg }
		} finally {
			setLoading(false)
		}
	}

	return (
		<OrderContext.Provider value={{ submitOrder, loading, error }}>
			{children}
		</OrderContext.Provider>
	)
}

export const useOrder = () => {
	const ctx = useContext(OrderContext)
	if (!ctx) throw new Error('useOrder must be used inside OrderProvider')
	return ctx
}
