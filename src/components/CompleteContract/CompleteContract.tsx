import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { products as allProducts } from '@/components/Basket/BasketList'
import { CartSummary } from '@/components/CompleteContract/CartSummary'
import { Form } from '@/components/CompleteContract/Form/Form'
import { Title } from '@/components/CompleteContract/Title'

import { DeliveryMethods } from './DeliveryMethods'
import { PaymentMethods } from './PaymentMethods'

export default function CompleteContract() {
	const [quantities, setQuantities] = useState<Record<number, number>>({})

	useEffect(() => {
		const saved = localStorage.getItem('quantities')
		if (saved) {
			setQuantities(JSON.parse(saved))
		} else {
			setQuantities(Object.fromEntries(allProducts.map(p => [p.id, 1])))
		}
	}, [])

	return (
		<>
			<TitleD>
				<Title />
			</TitleD>

			<Wrapper>
				<Form />
				<CartSummary
					products={allProducts}
					quantities={quantities}
				/>
			</Wrapper>
			<DeliveryWrapper>
				<DeliveryMethods />
				<PaymentMethods />
			</DeliveryWrapper>
		</>
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

	@media (max-width: 1000px) {
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
`
const TitleD = styled.div`
	width: 100%;
	max-width: 1500px;
	margin: 100px auto 0 auto;
	padding: 0 20px;
`
const DeliveryWrapper = styled.div`
	width: 100%;
	max-width: 1500px;
	margin: 0 auto;
	padding: 0 20px;
`
