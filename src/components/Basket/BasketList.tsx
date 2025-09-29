'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ProductCart } from './ProductCart'
import { useBasket } from '@/context/BasketContext'
import { getRefreshToken } from '@/helpers/auth'

function formatPrice(num: number) {
	return Number(num).toLocaleString('en-US').replaceAll(',', ' ')
}

export const BasketList = () => {
	const { t } = useTranslation('common')
	const router = useRouter()
	const { basket, updateQuantity, discount, setDiscount, setPromoCode } =
		useBasket()
	const [promocode, setPromocode] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const isEmpty = basket.length === 0

	const handleQuantityChange = (id: number, value: number) => {
		updateQuantity(id, value)
	}

	const subtotal = basket.reduce(
		(sum, product) => sum + product.price * (product.quantity || 1),
		0
	)
	const total = discount > 0 ? subtotal - (subtotal * discount) / 100 : subtotal

	const PROMO_ENDPOINTS = [
		'https://rpktask.sytes.net/api/promocodes/check',
		'https://rpktask.sytes.net/api/promocodes/check/'
	]

	async function requestPromo(code: string) {
		for (const base of PROMO_ENDPOINTS) {
			try {
				const url = `${base}?code=${encodeURIComponent(code)}`
				const res = await fetch(url, { method: 'GET' })
				let body: any = null
				try {
					body = await res.json()
				} catch {}
				return { url, status: res.status, ok: res.ok, body }
			} catch {
				continue
			}
		}
		return { url: '', status: 0, ok: false, body: null as any }
	}

	const applyPromocode = async () => {
		if (isEmpty) return
		setError(null)
		setLoading(true)

		try {
			const code = promocode.trim()
			if (!code) {
				setError(t('basket.enter_promo') || t('basket.promo_code'))
				return
			}
			const { status, ok, body } = await requestPromo(code)
			if (!ok) {
				if (status === 404) {
					setDiscount(0)
					setPromoCode(null)
					setError(t('basket.promo_invalid') || 'Invalid promo code')
					return
				}
				setDiscount(0)
				setPromoCode(null)
				setError(
					body?.detail ||
						body?.message ||
						t('basket.promo_check_failed') ||
						'Failed to validate promo code'
				)
				return
			}
			if (body?.active && typeof body?.discount_percent === 'number') {
				setDiscount(body.discount_percent)
				setPromoCode(code)
				setError(null)
			} else {
				setDiscount(0)
				setPromoCode(null)
				setError(
					t('basket.promo_inactive') || 'Promo code is inactive or expired'
				)
			}
		} catch {
			setDiscount(0)
			setPromoCode(null)
			setError(
				t('basket.promo_check_failed') || 'Failed to validate promo code'
			)
		} finally {
			setLoading(false)
		}
	}

	// "Оформить заказ" з редіректом на /login, якщо немає refresh токена
	const handleMakeOrder = () => {
		if (isEmpty) return
		const next = '/complete-contract'
		const refresh =
			(typeof getRefreshToken === 'function' ? getRefreshToken() : null) ??
			localStorage.getItem('refreshToken')
		if (!refresh) {
			router.push(`/login?next=${encodeURIComponent(next)}`)
			return
		}
		router.push(next)
	}

	return (
		<GlobalFix>
			<Wrapper className='flex flex-row gap-[20px]'>
				<ul className='flex flex-col w-[100%]'>
					{isEmpty ? (
						<EmptyCard>
							<EmptyTitle>{t('basket.basket_title')}</EmptyTitle>
							<EmptyText>{t('basket.empty_text')}</EmptyText>
							<EmptyActions>
								<Link
									href='/products'
									className='rounded-[61px] px-6 h-[48px] flex items-center justify-center bg-[#4BC785] text-black font-bold text-[15px]'
								>
									{t('basket.go_to_catalog')}
								</Link>
							</EmptyActions>
						</EmptyCard>
					) : (
						basket.map((product, index) => {
							// УНІКАЛЬНИЙ КЛЮЧ: id + variantId + socketCode (із запасним index)
							const key = [
								product.id,
								product.variantId ?? 'novar',
								(product as any).socketCode ?? 'nosocket',
								index // страховка, якщо бек дозволяє дублікати однієї комбінації
							].join('::')

							return (
								<ProductCart
									key={key}
									product={product}
									index={index}
									quantity={product.quantity}
									onQuantityChange={handleQuantityChange}
								/>
							)
						})
					)}
				</ul>

				<div className='w-[100%] max-w-[435px] px-[20px] py-[28px] bg-[#1B1919] rounded-[8px]'>
					<div className='flex flex-row justify-between mb-[30px]'>
						<p className='w-[45%] pb-[15px] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]'>
							{t('Basket.total')}:
						</p>
						<p className='w-[45%] pb-[15px] relative inline-block text-[18px] text-[#FFFFFF] font-bold'>
							{formatPrice(isEmpty ? 0 : total)} {t('Basket.currency')}
							<span className='absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-gray-300 to-transparent'></span>
						</p>
					</div>

					{discount > 0 && !isEmpty && (
						<p className='text-[#4BC785] mb-[10px]'>
							{t('basket.promo_active', { discount })}
						</p>
					)}

					{error && (
						<p
							className='text-red-500 mb-[10px]'
							aria-live='polite'
						>
							{error}
						</p>
					)}

					{/* КНОПКА ОФОРМЛЕННЯ З ЗАХИСТОМ */}
					<button
						type='button'
						onClick={handleMakeOrder}
						disabled={isEmpty}
						className={`w-full mb-[30px] rounded-[61px] h-[58px] font-bold text-[15px] text-center ${
							isEmpty
								? 'opacity-60 pointer-events-none bg-[#2a2a2a] text-[#888]'
								: 'bg-[#4BC785] text-black hover:opacity-90'
						}`}
					>
						{t('Basket.make_order')}
					</button>

					<div className='flex flex-row justify-between'>
						<div className='flex flex-col relative w-[60%]'>
							<StyledInput
								value={promocode}
								placeholder=' '
								required
								name='promocode'
								type='text'
								onChange={e => setPromocode(e.target.value)}
								onKeyDown={e => e.key === 'Enter' && applyPromocode()}
								disabled={isEmpty}
							/>
							<StyledLabel>{t('Basket.promo_code')}</StyledLabel>
						</div>

						<button
							onClick={applyPromocode}
							disabled={isEmpty || loading}
							aria-busy={loading}
							className={`w-[145px] h-[58px] text-bold rounded-[61px] text-[15px] text-center cursor-pointer border-[1px] ${
								isEmpty || loading
									? 'text-[#888] border-[#333] pointer-events-none'
									: 'text-[#ffffff] border-[#4BC785] hover:bg-[#4BC785] hover:text-[#000]'
							}`}
						>
							{loading
								? t('basket.applying') || 'Applying...'
								: t('Basket.add_promo_code')}
						</button>
					</div>
				</div>
			</Wrapper>
		</GlobalFix>
	)
}

const GlobalFix = styled.div`
	select {
		background: #0d0c0c;
		color: #fff;
		border: 1px solid #2a2a2a;
		border-radius: 8px;
		padding: 10px 50px 10px 12px;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		position: relative;

		background-image: url("data:image/svg+xml;utf8,<svg fill='white' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>");
		background-repeat: no-repeat;
		background-position: right 12px center;
		background-size: 16px;
	}

	select::-ms-expand {
		display: none;
	}

	option {
		background: #0d0c0c;
		color: #fff;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		-moz-appearance: textfield;
	}
`

const Wrapper = styled.div`
	@media (max-width: 1280px) {
		flex-direction: column;
		align-items: center;
	}
`

const StyledInput = styled.input`
	width: 100%;
	height: 50px;
	border-bottom: 1px solid #ffffff8a;
	outline: none;
	background: none;
	color: #fff;
	padding: 5px 0;
	z-index: 5;

	&:not(:placeholder-shown) + label {
		top: -5px;
		font-size: 12px;
	}

	&:focus + label {
		top: -5px;
		font-size: 12px;
		color: #4bc785;
	}

	&:-webkit-autofill,
	&:-webkit-autofill:hover,
	&:-webkit-autofill:focus,
	&:-webkit-autofill:active {
		-webkit-text-fill-color: #ffffff;
		transition: background-color 5000s ease-in-out 0s;
	}
`

const StyledLabel = styled.label`
	font-size: 16px;
	line-height: 100%;
	color: #7f7f7f;
	position: absolute;
	top: 10px;
	left: 0;
	transition: all 0.3s;
	z-index: 0;

	.relative:focus-within & {
		top: -5px;
		font-size: 12px;
	}
`
const EmptyCard = styled.li`
	min-height: 240px;
	padding: 28px 20px;
	background: #1b1919;
	border-radius: 8px;
	display: grid;
	align-items: center;
	justify-items: center;
	gap: 10px;
	text-align: center;
	border: 1px dashed #2f2f2f;
`

const EmptyTitle = styled.h2`
	font-weight: 700;
	font-size: 20px;
	color: #fff;
`
const EmptyText = styled.p`
	color: #ffffffa8;
	font-size: 14px;
	max-width: 420px;
`
const EmptyActions = styled.div`
	margin-top: 6px;
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
`
