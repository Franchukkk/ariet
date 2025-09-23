'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ProductCart } from './ProductCart'
import { useBasket } from '@/context/BasketContext'

function formatPrice(num: number) {
	return Number(num).toLocaleString('en-US').replace(',', ' ')
}

export const BasketList = () => {
	const { t } = useTranslation('common')

	const { basket, updateQuantity, discount, setDiscount, setPromoCode } =
		useBasket()

	const [promocode, setPromocode] = useState('')
	const [error, setError] = useState<string | null>(null)

	if (basket.length === 0) {
		return (
			<div>
				<h1 className='text-center text-[24px] font-bold'>
					{t('basket.basket_title')}
				</h1>
			</div>
		)
	}

	const handleQuantityChange = (id: number, value: number) => {
		updateQuantity(id, value)
	}

	const subtotal = basket.reduce(
		(sum, product) => sum + product.price * (product.quantity || 1),
		0
	)
	const total = discount > 0 ? subtotal - (subtotal * discount) / 100 : subtotal

	const applyPromocode = async () => {
		try {
			setError(null)

			if (!promocode.trim()) {
				setError(t('basket.promo_code'))
				return
			}

			const res = await fetch(
				`https://rpktask.sytes.net/api/promocodes/check/?code=${encodeURIComponent(promocode)}`,
				{ method: 'GET' }
			)

			if (!res.ok) throw new Error('Invalid promocode')

			const data = await res.json()
			if (data.active) {
				setDiscount(data.discount_percent)
				setPromoCode(promocode)
			} else {
				setDiscount(0)
				setPromoCode(null)
			}
		} catch {
			setDiscount(0)
			setPromoCode(null)
		}
	}

	return (
		<GlobalFix>
			<Wrapper className='flex flex-row gap-[20px]'>
				<ul className='flex flex-col w-[100%]'>
					{basket.map((product, index) => (
						<ProductCart
							key={product.id}
							product={product}
							index={index}
							quantity={product.quantity}
							onQuantityChange={handleQuantityChange}
						/>
					))}
				</ul>

				<div className='w-[100%] max-w-[435px] px-[20px] py-[28px] bg-[#1B1919] rounded-[8px]'>
					<div className='flex flex-row justify-between mb-[30px]'>
						<p className='w-[45%] pb-[15px] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]'>
							{t('Basket.total')}:
						</p>
						<p className='w-[45%] pb-[15px] relative inline-block text-[18px] text-[#FFFFFF] font-bold'>
							{formatPrice(total)} {t('Basket.currency')}
							<span className='absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-gray-300 to-transparent'></span>
						</p>
					</div>

					{discount > 0 && (
						<p className='text-[#4BC785] mb-[10px]'>
							{t('basket.promo_active', { discount })}
						</p>
					)}

					{error && <p className='text-red-500 mb-[10px]'>{error}</p>}

					<div className='cursor-pointer flex flex-row justify-between mb-[30px] rounded-[61px] bg-[#4BC785] h-[58px] items-center'>
						<Link
							href='/complete-contract'
							className='w-[100%] font-bold text-[15px] text-center text-[#000000] cursor-pointer'
						>
							{t('Basket.make_order')}
						</Link>
					</div>

					<div className='flex flex-row justify-between'>
						<div className='flex flex-col relative w-[60%]'>
							<StyledInput
								value={promocode}
								placeholder=' '
								required
								name='promocode'
								type='text'
								onChange={e => setPromocode(e.target.value)}
							/>
							<StyledLabel>{t('Basket.promo_code')}</StyledLabel>
						</div>

						<button
							onClick={applyPromocode}
							className='w-[145px] h-[58px] text-bold rounded-[61px] text-[#ffffff] border-[1px] border-[#4BC785] text-[15px] text-center cursor-pointer hover:bg-[#4BC785] hover:text-[#000]'
						>
							{t('Basket.add_promo_code')}
						</button>
					</div>
				</div>
			</Wrapper>
		</GlobalFix>
	)
}

/* ===== styles ===== */

const GlobalFix = styled.div`
	/* 1) ЧОРНИЙ ФОН ДЛЯ ВИПАДАЮЧИХ СПИСКІВ + ОДНА СТРІЛОЧКА */
	select {
		background: #0d0c0c;
		color: #fff;
		border: 1px solid #2a2a2a;
		border-radius: 8px;
		padding: 10px 50px 10px 12px;
		appearance: none; /* ховаємо системні стрілки */
		-webkit-appearance: none;
		-moz-appearance: none;
		position: relative;

		/* одна кастомна стрілочка (SVG) праворуч */
		background-image: url("data:image/svg+xml;utf8,<svg fill='white' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>");
		background-repeat: no-repeat;
		background-position: right 12px center;
		background-size: 16px;
	}

	/* IE */
	select::-ms-expand {
		display: none;
	}

	/* елементи списку — темні */
	option {
		background: #0d0c0c;
		color: #fff;
	}

	/* 2) ПРИБРАТИ ПОДВІЙНІ СТРІЛКИ У NUMBER-ПОЛЯХ (якщо є в ProductCart) */
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
