'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

type DeliveryOption = {
	id: number
	logo: string
	key: 'nova_poshta' | 'ukrposhta' | 'pickup'
}

const deliveryOptions: DeliveryOption[] = [
	{ id: 1, logo: '/nova-poshta.svg', key: 'nova_poshta' },
	{ id: 2, logo: '/ukrposhta.svg', key: 'ukrposhta' },
	{ id: 3, logo: '/pickup.svg', key: 'pickup' }
]

export const DeliveryMethods = () => {
	const [selected, setSelected] = useState(3)
	const { t } = useTranslation('common')

	return (
		<Wrapper>
			<Title>{t('complete_contract.delivery.title')}</Title>
			{deliveryOptions.map(option => (
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
						alt={t(`complete_contract.delivery.options.${option.key}.label`)}
					/>
					<Label>
						{t(`complete_contract.delivery.options.${option.key}.label`)}
					</Label>
					<Duration>
						{t(`complete_contract.delivery.options.${option.key}.duration`)}
					</Duration>
					<Price>
						{t(`complete_contract.delivery.options.${option.key}.price`)}
					</Price>
				</Option>
			))}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	width: 100%;
	max-width: 800px;
`

const Title = styled.h3`
	color: #fff;
	margin-bottom: 15px;
	font-weight: 600;
	font-size: 30px;
	line-height: 58px;
	letter-spacing: 0%;
	text-transform: uppercase;
`

const Option = styled.div<{ selected: boolean }>`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 10px;
	padding: 12px;
	margin-bottom: 10px;
	border-radius: 6px;
	cursor: pointer;
	transition: background 0.2s;
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
	object-fit: contain;
	width: 49px;
	height: 31px;
`

const Label = styled.span`
	color: #fff;
	font-weight: 400;
	font-size: 17px;
	line-height: 25px;
	letter-spacing: 0%;
`

const Duration = styled.span`
	color: #aaa;
	margin-left: auto;
	text-align: left;
	font-weight: 400;
	font-size: 17px;
	line-height: 25px;
	letter-spacing: 0%;
`

const Price = styled.span`
	color: #fff;
	margin-left: 20px;
	text-align: left;
	font-weight: 700;
	font-size: 17px;
	line-height: 25px;
	letter-spacing: 0%;
`
