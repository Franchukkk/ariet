'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Input } from '../Form/Input'

type PaymentOption = {
	id: number
	logo: string
	key: 'visa' | 'googlepay' | 'mastercard' | 'applepay' | 'payu'
}

const paymentOptions: PaymentOption[] = [
	{ id: 1, logo: '/visa.svg', key: 'visa' },
	{ id: 2, logo: '/Google Pay.svg', key: 'googlepay' },
	{ id: 3, logo: '/mastercard.svg', key: 'mastercard' },
	{ id: 4, logo: '/applepay.svg', key: 'applepay' },
	{ id: 5, logo: '/payu.svg', key: 'payu' }
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
			<StyledForm>
				<div className='fields'>
					<div className='fields-group'>
						<Input label={t('complete_contract.payment.comment')} />
					</div>
				</div>
			</StyledForm>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	width: 100%;
	max-width: 800px;
	margin-top: 80px;
`

const Title = styled.h3`
	color: #fff;
	margin-bottom: 15px;
	font-weight: 600;
	font-size: 30px;
	line-height: 58px;
	letter-spacing: 0%;
`

const Options = styled.div`
	display: flex;
	gap: 30px;
	align-items: center;
	flex-wrap: wrap;
`

const Option = styled.div<{ selected: boolean }>`
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
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

const StyledForm = styled.div`
	padding-top: 95px;
	.fields {
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: max-content;
		gap: 44px;
		margin-bottom: 44px;
	}
	.fields-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 38px;
	}
	@media (max-width: 1000px) {
		width: 90%;
	}
	@media (max-width: 800px) {
		.fields-group {
			grid-template-columns: 1fr;
			gap: 20px;
		}
	}
`
