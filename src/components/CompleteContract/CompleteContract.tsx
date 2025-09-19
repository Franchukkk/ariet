'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { CartSummary } from '@/components/CompleteContract/Form/CartSummary'
import { Form } from '@/components/CompleteContract/Form/Form'
import { Title } from '@/components/CompleteContract/Title'

import { DeliveryMethods } from './DeliveryMethods'
import { PaymentMethods } from './PaymentMethods'
import { useBasket } from '@/context/BasketContext'
import { OrderProvider } from '@/context/OrderContext'

export default function CompleteContract() {
	const { basket } = useBasket()
	const [quantities, setQuantities] = useState<Record<number, number>>({})

	useEffect(() => {
		const saved = localStorage.getItem('quantities')
		if (saved) {
			setQuantities(JSON.parse(saved))
		} else {
			setQuantities(
				Object.fromEntries(basket.map(p => [p.id, p.quantity || 1]))
			)
		}
	}, [basket])

	return (
		<OrderProvider>
			<TitleD>
				<Title />
			</TitleD>

			<Wrapper>
				<Form />
				<CartSummary />
			</Wrapper>

			<DeliveryWrapper>
				<DeliveryMethods />
				<PaymentMethods />
			</DeliveryWrapper>
		</OrderProvider>
	)
}

const Wrapper = styled.div`
	display: flex;
	gap: 40px;
	flex-wrap: wrap;
	max-width: 1500px;
	margin: 0 auto;
	justify-content: center;
	padding: 20px;

	@media (max-width: 1200px) {
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
`
const TitleD = styled.div`
	width: 100%;
	max-width: 1350px;
	margin: 100px auto 0 auto;
	padding: 0 20px;

	@media (max-width: 1000px) {
		display: flex;
		justify-content: center;
		text-align: center;
	}
`

const DeliveryWrapper = styled.div`
	width: 100%;
	max-width: 1500px;
	margin: 0 auto;
	padding: 0 20px;
`
