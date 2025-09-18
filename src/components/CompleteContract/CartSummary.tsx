'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

type Product = {
	id: number
	name: string
	price: number
	photo: string
	description: string
}

type CartSummaryProps = {
	products: Product[]
	quantities: Record<number, number>
}

export const CartSummary = ({ products, quantities }: CartSummaryProps) => {
	const { t } = useTranslation('common')
	const router = useRouter()
	const deliveryPrice = 200
	const totalPrice = products.reduce(
		(acc, product) => acc + product.price * (quantities[product.id] || 1),
		0
	)

	return (
		<Container>
			{products.map(product => (
				<div key={product.id}>
					<ProductItem>
						<ImageWrapper>
							<Image
								src={product.photo}
								alt={product.name}
								width={70}
								height={70}
							/>
						</ImageWrapper>
						<Details>
							<Category>{product.description}</Category>
							<Name>{product.name}</Name>
							<Info>
								<span>{quantities[product.id] || 1}x</span>
								<Price>
									{(
										product.price * (quantities[product.id] || 1)
									).toLocaleString()}{' '}
									грн
								</Price>
							</Info>
						</Details>
					</ProductItem>
					<Divider />
				</div>
			))}

			<Row>
				<Label>{t('complete_contract.cart.products_price')}</Label>
				<Value>{totalPrice.toLocaleString()} грн</Value>
			</Row>

			<Row>
				<Label>{t('complete_contract.cart.delivery')}</Label>
				<Value>{deliveryPrice.toLocaleString()} грн</Value>
			</Row>

			<Row>
				<Label>{t('complete_contract.cart.total')}</Label>
				<TotalValue>
					{(totalPrice + deliveryPrice).toLocaleString()} грн
				</TotalValue>
			</Row>

			<ConfirmButton onClick={() => router.push('/thanks-for-order')}>
				{t('complete_contract.cart.confirm')}
			</ConfirmButton>
		</Container>
	)
}

const Container = styled.div`
	background: #1b1919;
	color: white;
	padding: 20px;
	border-radius: 10px;
	width: 100%;
	max-width: 440px;
	display: flex;
	flex-direction: column;
	gap: 20px;

	@media (max-width: 1000px) {
		width: 90%;
	}
`

const ProductItem = styled.div`
	display: flex;
	gap: 20px;
`

const ImageWrapper = styled.div`
	width: 70px;
	height: 70px;
	border-radius: 8px;
	overflow: hidden;
`

const Details = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`

const Category = styled.span`
	font-weight: 400;
	font-style: Regular;
	font-size: 13px;
	leading-trim: NONE;
	line-height: 100%;
	letter-spacing: 0%;

	color: #7f7f7f;
`

const Name = styled.h4`
	font-weight: 600;
	font-style: DemiBold;
	font-size: 17px;
	leading-trim: NONE;
	line-height: 100%;
	letter-spacing: 1%;

	color: #fff;
	margin: 0;
`

const Info = styled.div`
	display: flex;
	align-items: center;
	gap: 90px;
	width: 200px;

	span {
		font-weight: 400;
		font-style: Regular;
		font-size: 17px;
		leading-trim: NONE;
		line-height: 100%;
		letter-spacing: 1%;

		color: #ffffff;
	}
`

const Price = styled.span`
	color: #fff;

	font-weight: 600;
	font-style: DemiBold;
	font-size: 17px;
	leading-trim: NONE;
	line-height: 100%;
	letter-spacing: 1%;
`

const Divider = styled.hr`
	border: none;
	border-top: 1px dashed #444;
	margin-top: 20px;
`

const Row = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 30px;
`

const Label = styled.p`
	width: 45%;
	font-weight: 300;
	font-style: Light;
	font-size: 14px;
	leading-trim: NONE;
	line-height: 18px;
	letter-spacing: 1%;
	color: #ffffffa8;

	border-bottom: 1px dashed #ffffff42;
`

const Value = styled.p`
	width: 45%;
	padding-bottom: 14px;
	position: relative;

	font-weight: 500;
	font-style: Medium;
	font-size: 15px;
	leading-trim: NONE;
	line-height: 18px;
	letter-spacing: 1%;
	color: #ffffffc9;

	&::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(to right, #d1d5db, transparent);
	}
`

const TotalValue = styled(Value)`
	color: #ffffffc9;
	font-weight: 700;
	font-style: Bold;
	font-size: 18px;
	leading-trim: NONE;
	line-height: 18px;
	letter-spacing: 1%;

	padding-bottom: 15px;
`

const ConfirmButton = styled.button`
	width: 100%;
	background: #4bc785;
	color: black;
	padding: 20px;

	border-radius: 9999px;

	cursor: pointer;
	transition: background 0.2s ease;

	font-weight: 600;
	font-style: DemiBold;
	font-size: 15px;
	leading-trim: NONE;
	line-height: 100%;
	letter-spacing: 1%;
	text-align: center;

	&:hover {
		background: #4ade80;
	}
`
