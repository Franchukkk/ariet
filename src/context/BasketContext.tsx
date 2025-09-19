'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type BasketItem = {
	id: number
	variantId: number
	name: string
	price: number
	quantity: number
	photo: { src: string; alt: string }
}

type BasketContextType = {
	basket: BasketItem[]
	addToBasket: (item: BasketItem) => void
	removeFromBasket: (id: number) => void
	updateQuantity: (id: number, quantity: number) => void
	clearBasket: () => void
	discount: number
	setDiscount: (percent: number) => void
	promoCode: string
	setPromoCode: (code: string) => void
}

const BasketContext = createContext<BasketContextType | undefined>(undefined)

export const BasketProvider = ({ children }: { children: React.ReactNode }) => {
	const [basket, setBasket] = useState<BasketItem[]>([])
	const [discount, setDiscount] = useState<number>(0)
	const [promoCode, setPromoCode] = useState<string>('')
	const [hydrated, setHydrated] = useState(false)

	useEffect(() => {
		const stored = localStorage.getItem('basket')
		if (stored) setBasket(JSON.parse(stored))

		const storedDiscount = localStorage.getItem('discount')
		if (storedDiscount) setDiscount(Number(storedDiscount))

		const storedPromo = localStorage.getItem('promoCode')
		if (storedPromo) setPromoCode(storedPromo)

		setHydrated(true)
	}, [])

	useEffect(() => {
		if (hydrated) localStorage.setItem('basket', JSON.stringify(basket))
	}, [basket, hydrated])

	useEffect(() => {
		if (hydrated) localStorage.setItem('discount', String(discount))
	}, [discount, hydrated])

	useEffect(() => {
		if (hydrated) localStorage.setItem('promoCode', promoCode)
	}, [promoCode, hydrated])

	const addToBasket = (item: BasketItem) => {
		setBasket(prev => {
			const existing = prev.find(p => p.variantId === item.variantId)
			if (existing) {
				return prev.map(p =>
					p.variantId === item.variantId
						? { ...p, quantity: p.quantity + item.quantity }
						: p
				)
			}
			return [...prev, item]
		})
	}

	const removeFromBasket = (id: number) => {
		setBasket(prev => prev.filter(p => p.id !== id))
	}

	const updateQuantity = (id: number, quantity: number) => {
		setBasket(prev => prev.map(p => (p.id === id ? { ...p, quantity } : p)))
	}

	const clearBasket = () => {
		setBasket([])
		setDiscount(0)
		setPromoCode('')
	}

	if (!hydrated) return null

	return (
		<BasketContext.Provider
			value={{
				basket,
				discount,
				setDiscount,
				promoCode,
				setPromoCode,
				addToBasket,
				removeFromBasket,
				updateQuantity,
				clearBasket
			}}
		>
			{children}
		</BasketContext.Provider>
	)
}

export const useBasket = () => {
	const context = useContext(BasketContext)
	if (!context) throw new Error('useBasket must be used within BasketProvider')
	return context
}
