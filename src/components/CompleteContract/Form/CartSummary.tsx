'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Button } from './Button'
import { useBasket } from '@/context/BasketContext'

export const CartSummary = () => {
	const { t } = useTranslation('common')
	const router = useRouter()
	const { basket, discount } = useBasket()

	const deliveryPrice = 200

	const subtotal = basket.reduce(
		(acc, product) => acc + product.price * (product.quantity || 1),
		0
	)

	const discountedTotal =
		discount > 0 ? subtotal - (subtotal * discount) / 100 : subtotal

	const finalTotal = discountedTotal + deliveryPrice

	return (
		<Container>
			{basket.map(product => (
				<div key={product.id}>
					<ProductItem>
						<ImageWrapper>
							<Image
								src={
									typeof product.photo === 'string'
										? product.photo
										: product.photo?.src
								}
								alt={product.name}
								width={70}
								height={70}
							/>
						</ImageWrapper>
						<Details>
							<Category>{product.description}</Category>
							<Name>{product.name}</Name>
							<Info>
								<span>{product.quantity}x</span>
								<Price>
									{(product.price * product.quantity).toLocaleString()} грн
								</Price>
							</Info>
						</Details>
					</ProductItem>
					<Divider />
				</div>
			))}

			<Row>
				<Label>{t('complete_contract.cart.products_price')}</Label>
				<Value>{subtotal.toLocaleString()} грн</Value>
			</Row>

			{discount > 0 && (
				<Row>
					<Label>Знижка ({discount}%)</Label>
					<Value>-{((subtotal * discount) / 100).toLocaleString()} грн</Value>
				</Row>
			)}

			<Row>
				<Label>{t('complete_contract.cart.delivery')}</Label>
				<Value>{deliveryPrice.toLocaleString()} грн</Value>
			</Row>

			<Row>
				<Label>{t('complete_contract.cart.total')}</Label>
				<TotalValue>{finalTotal.toLocaleString()} грн</TotalValue>
			</Row>

			<Button />
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
	font-size: 13px;
	color: #7f7f7f;
`

const Name = styled.h4`
	font-weight: 600;
	font-size: 17px;
	color: #fff;
	margin: 0;
`

const Info = styled.div`
	display: flex;
	align-items: center;
	gap: 90px;
	width: 200px;

	span {
		font-size: 17px;
		color: #ffffff;
	}
`

const Price = styled.span`
	color: #fff;
	font-weight: 600;
	font-size: 17px;
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
	font-size: 14px;
	color: #ffffffa8;
	border-bottom: 1px dashed #ffffff42;
`

const Value = styled.p`
	width: 45%;
	padding-bottom: 14px;
	position: relative;
	font-size: 15px;
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
	font-weight: 700;
	font-size: 18px;
`
