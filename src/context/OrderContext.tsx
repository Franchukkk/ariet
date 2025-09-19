'use client'

import { createContext, useContext, useState } from 'react'

import { useBasket } from './BasketContext'

type OrderContextType = {
	submitOrder: (formData: FormData) => Promise<boolean>
	loading: boolean
	error: string | null
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { basket, discount, promoCode } = useBasket()

	const submitOrder = async (formData: FormData): Promise<boolean> => {
		setLoading(true)
		setError(null)

		try {
			const safe = (value: FormDataEntryValue | null) =>
				value ? String(value).trim() : ''

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
				setError('Будь ласка, заповніть усі обов’язкові поля')
				return false
			}

			const orderData = {
				client_type: 'INDIVIDUAL',
				full_name: `${name} ${surname}`,
				email,
				phone,
				billing_address: billingAddress,
				shipping_address: shippingAddress,
				company_name: safe(formData.get('TC_number')),
				vat_number: safe(formData.get('Field_3')),
				comment: safe(formData.get('Comment')),
				items: basket.map(item => ({
					variant: item.id,
					quantity: item.quantity || 1
				})),
				promo_code: discount > 0 ? promoCode : ''
			}

			const res = await fetch('https://rpktask.sytes.net/api/orders/create/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(orderData)
			})

			let data: any
			try {
				data = await res.json()
			} catch {
				setError('Невалідна відповідь від сервера')
				return false
			}
			if (
				!res.ok ||
				data?.error ||
				data?.detail ||
				typeof data?.promo_code === 'string'
			) {
				setError(
					data?.promo_code ||
						data?.detail ||
						data?.error ||
						'Помилка при створенні замовлення'
				)
				return false
			}

			console.log('✅ Order created:', data)
			return true
		} catch (err: any) {
			setError(err.message || 'Невідома помилка')
			return false
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
