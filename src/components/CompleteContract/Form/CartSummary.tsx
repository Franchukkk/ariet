'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Button } from './Button'
import { useBasket } from '@/context/BasketContext'
import { useOrder } from '@/context/OrderContext'

export const CartSummary = () => {
	const { t } = useTranslation('common')
	const { basket, discount } = useBasket()
	const { billingZone } = useOrder() as {
		billingZone?: {
			id: number
			name: string
			code: string
			markup_percent?: string | number
		}
	}

	const zoneMarkupPct = useMemo(
		() => Number(billingZone?.markup_percent ?? 0) || 0,
		[billingZone?.markup_percent]
	)

	// Перерахунок кожного айтема з урахуванням націнки (без доставки як окремої позиції)
	const lines = useMemo(() => {
		return basket.map(p => {
			const qty = p.quantity || 1
			const base = p.price || 0
			const priceWithMarkup = base * (1 + zoneMarkupPct / 100)
			const lineTotal = priceWithMarkup * qty
			return {
				id: p.id,
				name: p.name,
				description: p.description,
				photo: typeof p.photo === 'string' ? p.photo : p.photo?.src,
				qty,
				unit: priceWithMarkup,
				total: lineTotal
			}
		})
	}, [basket, zoneMarkupPct])

	const subtotal = useMemo(
		() => lines.reduce((acc, l) => acc + l.total, 0),
		[lines]
	)

	const discountPct = typeof discount === 'number' ? discount : 0
	const discountAmount = discountPct > 0 ? (subtotal * discountPct) / 100 : 0
	const finalTotal = subtotal - discountAmount

	const fmt = (n: number) =>
		n.toLocaleString(undefined, { maximumFractionDigits: 2 })

	return (
		<Container>
			{lines.map(product => (
				<div key={product.id}>
					<ProductItem>
						<ImageWrapper>
							{product.photo ? (
								<Image
									src={product.photo}
									alt={product.name}
									width={70}
									height={70}
								/>
							) : (
								<div style={{ width: 70, height: 70 }} />
							)}
						</ImageWrapper>
						<Details>
							<Category>{product.description}</Category>
							<Name>{product.name}</Name>
							<Info>
								<span>{product.qty}x</span>
								<Price>{fmt(product.total)} $</Price>
							</Info>
						</Details>
					</ProductItem>
					<Divider />
				</div>
			))}

			{discountAmount > 0 && (
				<Row>
					<Label>{t('complete_contract.cart.discount') || 'Discount'}</Label>
					<Value>-{fmt(discountAmount)} $</Value>
				</Row>
			)}

			<Row>
				<Label>{t('complete_contract.cart.total')}</Label>
				<TotalValue>{fmt(finalTotal)} $</TotalValue>
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
	height: 50%;
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
