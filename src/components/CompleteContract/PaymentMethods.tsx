'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

type PaymentOption = {
	id: number
	logo: string
	key: 'visa' | 'googlepay' | 'mastercard' | 'applepay' | 'payu'
}

const paymentOptions: PaymentOption[] = [
	{ id: 1, logo: '/Payment/visa.svg', key: 'visa' },
	{ id: 2, logo: '/Payment/googlepay.svg', key: 'googlepay' },
	{ id: 3, logo: '/Payment/mastercard.svg', key: 'mastercard' },
	{ id: 4, logo: '/Payment/applepay.svg', key: 'applepay' },
	{ id: 5, logo: '/Payment/payu.svg', key: 'payu' }
]

export const PaymentMethods = () => {
	const [selected, setSelected] = useState(3)
	const { t } = useTranslation('common')

	return (
		<Wrapper>
			<Title>{t('complete_contract.payment.title')}</Title>
			<Options>
				{paymentOptions.map(option => (
					<Option
						key={option.id}
						selected={selected === option.id}
						onClick={() => setSelected(option.id)}
					>
						<Radio>
							<RadioInner $visible={selected === option.id} />
						</Radio>
						<Logo
							src={option.logo}
							alt={t(`complete_contract.payment.options.${option.key}`)}
						/>
					</Option>
				))}
			</Options>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	width: 100%;
	max-width: 800px;
	margin-top: 80px;
	padding: 0 16px;
`

const Title = styled.h3`
	color: #fff;
	margin-bottom: 15px;
	font-weight: 600;
	font-size: 30px;
	line-height: 58px;
`

const Options = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 30px;
	align-items: center;
`

const Option = styled.div<{ selected: boolean }>`
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	padding: 8px 12px;
	border-radius: 8px;
	transition: background 0.2s ease;
	background: ${({ selected }) => (selected ? '#24242470' : 'transparent')};
`

const Radio = styled.div`
	width: 20px;
	height: 20px;
	border: 2px solid #4bc785;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const RadioInner = styled.div<{ $visible: boolean }>`
	width: 10px;
	height: 10px;
	background: #4bc785;
	border-radius: 50%;
	display: ${({ $visible }) => ($visible ? 'block' : 'none')};
`

const Logo = styled.img`
	width: 60px;
	height: auto;
	object-fit: contain;
`
