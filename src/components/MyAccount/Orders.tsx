'use client'

import { useEffect, useState } from 'react'

import OrderCart, { OrderProps, Product } from './OrderCart'

// Адаптер: перетворюємо API-замовлення у структуру OrderProps
function adaptOrder(apiOrder: any): OrderProps {
	const items = Array.isArray(apiOrder.items) ? apiOrder.items : []

	// ... усередині adaptOrder(apiOrder: any)
	const products: Product[] = items.map((it: any) => {
		const v = Array.isArray(it.variant) ? it.variant[0] : it.variant
		const img = v?.images?.[0]?.image || null
		const priceNum =
			(it?.price != null ? Number(it.price) : NaN) ||
			(v?.price != null ? Number(v.price) : 0)

		return {
			id: v?.id ?? 0,
			// малий сірий рядок (підпис): SKU або короткий код
			name: v?.sku ?? 'Product',
			price: priceNum,
			quantity: Number(it?.quantity) || 1,
			photo: img,
			// ВЕЛИКИЙ білий рядок: саме назва варіанта ✅
			description: v?.name ?? ''
		}
	})

	const price = products.reduce((s, p) => s + p.price * p.quantity, 0)
	const delivery = 0
	const total = price + delivery

	return {
		id: apiOrder.id,
		code: String(apiOrder.code ?? ''), // номер замовлення
		status: apiOrder.status ?? 'DRAFT',
		date: apiOrder.created_at || new Date().toISOString(),
		total,
		price,
		delivery,
		declaration_number: apiOrder.declaration_number || '',
		tel: apiOrder.phone || '',
		deliveyId: apiOrder.declaration_number || '',
		address: apiOrder.shipping_address || apiOrder.billing_address || '',
		products
	}
}

export const Orders = () => {
	const [orders, setOrders] = useState<OrderProps[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const run = async () => {
			try {
				const res = await fetch('https://rpktask.sytes.net/api/orders/', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
					}
				})
				const data = await res.json()
				const mapped: OrderProps[] = Array.isArray(data?.results)
					? data.results.map(adaptOrder)
					: []
				setOrders(mapped)
			} catch (e) {
				console.error(e)
				setOrders([])
			} finally {
				setLoading(false)
			}
		}
		run()
	}, [])

	if (loading) {
		return (
			<p className='text-[22px] leading-[22px] !font-[600] font-medium text-[#ffffff] text-center my-[200px]'>
				Loading ...
			</p>
		)
	}

	if (!orders.length) {
		return (
			<p className='text-[22px] leading-[22px] !font-[600] font-medium text-[#ffffff] text-center my-[200px]'>
				Заказы не найдены
			</p>
		)
	}

	return (
		<ul className='main-wrapper flex flex-col gap-[20px] mb-[200px]'>
			{orders.map(order => (
				<OrderCart
					key={order.code || String(order.id)}
					order={order}
				/>
			))}
		</ul>
	)
}

export default Orders
