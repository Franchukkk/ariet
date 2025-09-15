'use client'

import Image from 'next/image'
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
	const deliveryPrice = 200
	const totalPrice = products.reduce(
		(acc, product) => acc + product.price * (quantities[product.id] || 1),
		0
	)

	return (
		<Container>
			{products.map(product => (
				<div key={product.id}>
					<Product>
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
					</Product>
					<Divider />
				</div>
			))}

			<div className='flex flex-row justify-between mb-[30px]'>
				<p className='w-[45%] pb-[15px] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]'>
					{t('complete_contract.cart.products_price')}
				</p>
				<p className='w-[45%] pb-[15px] text-[#FFFFFFA8] relative inline-block text-[16px] font-bold'>
					{totalPrice.toLocaleString()} грн
					<span className='absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-gray-300 to-transparent'></span>
				</p>
			</div>

			<div className='flex flex-row justify-between mb-[30px]'>
				<p className='w-[45%] pb-[14px] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]'>
					{t('complete_contract.cart.delivery')}
				</p>
				<p className='w-[45%] pb-[14px] text-[#FFFFFFA8] relative inline-block text-[16px] font-bold'>
					{deliveryPrice.toLocaleString()} грн
					<span className='absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-gray-300 to-transparent'></span>
				</p>
			</div>

			<div className='flex flex-row justify-between mb-[30px]'>
				<p className='w-[45%] pb-[14px] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]'>
					{t('complete_contract.cart.total')}
				</p>
				<p className='w-[45%] pb-[15px] text-[#FFFFFFA8] relative inline-block text-[18px] text-[#FFFFFF] font-bold'>
					{(totalPrice + deliveryPrice).toLocaleString()} грн
					<span className='absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-gray-300 to-transparent'></span>
				</p>
			</div>

			<Button>{t('complete_contract.cart.confirm')}</Button>
		</Container>
	)
}

const Container = styled.div`
	background: #1b1919;
	color: white;
	padding: 20px;
	border-radius: 10px;
	width: 100%;
	max-width: 600px;
	display: flex;
	flex-direction: column;
	gap: 20px;

	@media (max-width: 1000px) {
		width: 90%;
	}
`

const Product = styled.div`
	display: flex;
	gap: 15px;
	margin-bottom: 23px;
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
`

const Name = styled.h4`
	font-size: 17px;
	color: #ffffff;
	font-weight: 600;
	margin: 0;
`

const Info = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 200px;

	span {
		font-weight: 600;
		font-style: DemiBold;
		font-size: 17px;
	}
`

const Price = styled.span`
	font-weight: 600;
	font-size: 15px;
`

const Divider = styled.hr`
	border: none;
	border-top: 1px dashed #444;
`

const Button = styled.button`
	width: 100%;
	background: #4bc785;
	color: black;
	padding: 15px;
	font-weight: 600;
	border-radius: 9999px;
	font-size: 16px;
	cursor: pointer;
	transition: background 0.2s ease;

	&:hover {
		background: #4ade80;
	}
`
