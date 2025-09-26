'use client'

import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'

import { useBasket } from '@/context/BasketContext'
import { useOrder } from '@/context/OrderContext'

export const Button = () => {
	const { t } = useTranslation()
	const router = useRouter()
	const { submitOrder, loading } = useOrder()
	const { clearBasket } = useBasket()

	const handleClick = async () => {
		const formEl = document.getElementById(
			'order-form'
		) as HTMLFormElement | null
		if (!formEl) return

		const formData = new FormData(formEl)
		const get = (name: string) => String(formData.get(name) || '').trim()

		const requiredFields = [
			'Name',
			'Surname',
			'Phone',
			'Email',
			'Address',
			'Transport_company_address'
		]
		const missing = requiredFields.filter(n => !get(n))
		if (missing.length > 0) {
			formEl.reportValidity?.()
			return
		}

		const res = await submitOrder(formData)

		if (res.success) {
			clearBasket()
			const safeNumber =
				res.orderNumber && String(res.orderNumber).trim()
					? res.orderNumber
					: 'unknown'
			const orderParam = encodeURIComponent(safeNumber)
			router.push(`/thanks-for-order?order=${orderParam}`)
		} else if (res.error) {
			alert(res.error)
		}
	}

	return (
		<StyledButton
			type='button'
			onClick={handleClick}
			disabled={loading}
			aria-busy={loading}
			aria-disabled={loading}
		>
			{loading
				? t('complete_contract.cart.sending', 'Відправка...')
				: t('complete_contract.cart.confirm', 'Підтвердити')}
		</StyledButton>
	)
}

const StyledButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 58px;
	border: 1px solid #1dcf94;
	border-radius: 61px;
	font-weight: 600;
	font-size: 15px;
	line-height: 100%;
	text-align: center;
	width: 100%;
	margin-top: 58px;
	transition: all 0.3s;
	cursor: pointer;
	padding: 20px;
	background: transparent;
	color: #fff;

	&:hover {
		background: #1dcf94;
		color: #000;
	}
	&:disabled,
	&[aria-busy='true'] {
		opacity: 0.6;
		cursor: not-allowed;
	}
`
