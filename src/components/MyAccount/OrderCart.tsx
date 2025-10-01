'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ArrowIcon from '@/assets/img/arrow-up.svg'

import { formatDate } from '@/helpers/formatDate'
import { formatPrice } from '@/helpers/formatPrice'

export interface Product {
	id: number
	name: string
	price: number
	quantity: number
	photo: { src: string } | string | null
	description: string
}

export interface OrderProps {
	id: number
	code: string
	status: string
	date: string
	total: number
	price: number
	delivery: number
	declaration_number: string
	tel: string
	deliveyId: string
	address: string
	products: Product[]
}

const OrderCart = ({ order }: { order: OrderProps }) => {
	const { t, i18n } = useTranslation('common')
	const [isOpen, setIsOpen] = useState(false)

	const orderNumber = (order.code ?? '').toString().trim() || String(order.id)

	const statusKey = (() => {
		const v = (order.status || '').toString().trim().toUpperCase()
		if (v === 'PAID') return 'paid'
		if (v === 'CONFIRMED') return 'confirmed'
		if (v === 'SENT' || v === 'SHIPPED') return 'shipped'
		if (v === 'DELIVERED') return 'delivered'
		if (v === 'CANCELLED' || v === 'CANCELED') return 'cancelled'
		return 'draft'
	})()

	const imgSrc = (p: Product) =>
		typeof p.photo === 'string'
			? p.photo
			: p.photo?.src || '/img/placeholder.png'

	return (
		<li
			className={`relative border border-dashed transition-all duration-300 ${
				isOpen
					? 'border-[#4BC785] max-h-[2000px]'
					: 'border-[#FFFFFF80] max-h-[140px]' /* ↑ було 95px */
			} overflow-hidden`}
		>
			{/* горизонтальна лінія перенесена нижче під збільшений хедер */}
			<div className='absolute w-full pr-[67px] pl-[28px] top-[138px]'>
				{/* ↑ було 95px */}
				<div className='h-[1px] w-full bg-[#FFFFFF33]'></div>
			</div>

			<StyledDiv
				$status={statusKey}
				className={`h-[120px] relative pl-[30px] pt-[24px] pb-[20px] pr-[67px] transition-all duration-300}`} /* ↑ було h-[90px] */
			>
				<div className='flex flex-col gap-[8px]'>
					<BigData className='text-[15px]  text-[#7F7F7F]'>
						{t('MyAccount.order')} {orderNumber}
					</BigData>

					<DateLine className='text-[14px] text-[#7F7F7F]'>
						{formatDate(order.date, i18n.language)}
					</DateLine>

					<p className='text-[15px] text-[22px] leading-[22px] !font-[600] font-medium text-[#ffffff]'>
						{order.status}
					</p>
				</div>

				<TotalPrice className='flex flex-col gap-[10px]'>
					<p className='text-[14px]  text-[#7F7F7F] ml-[130px]'>
						{t('MyAccount.summary')} {t('MyAccount.currency')}
					</p>
					<p className='text-[14px] text-[22px] leading-[22px] ml-[130px] !font-[600] font-medium text-[#ffffff]'>
						{formatPrice(order.price)} {t('MyAccount.currency')}
					</p>
				</TotalPrice>

				<ImgBlock className='flex flex-row gap-[12px] w-[300px] select-none m-[auto]'>
					{order.products.slice(0, 4).map((p, i) => (
						<img
							key={i}
							className='h-[56px] w-auto'
							src={imgSrc(p)}
							alt={p.name}
						/>
					))}
				</ImgBlock>

				{order.products.length > 4 ? (
					<StyledFor>+{order.products.length - 4}</StyledFor>
				) : null}

				<StyledArrow
					className={`cursor-pointer absolute top-1/2 right-[23px] translate-y-[-50%] transition-all duration-300 ${
						isOpen ? 'rotate-0' : 'rotate-180'
					}`}
					style={{ fill: isOpen ? '#4BC785' : '#ffffff' }}
					onClick={() => setIsOpen(!isOpen)}
				/>
			</StyledDiv>

			<MoreInfoBlock
				className={`flex justify-between ${
					isOpen ? 'max-h-[2000px]' : 'max-h-[140px]'
				} overflow-hidden transition-all duration-300`}
			>
				<ul className='w-[70%] pl-[28px] pt-[22px] pb-[18px] pr-[67px] '>
					{order.products.map((p, i) => (
						<StyledLiMoreInfo
							key={i}
							className='flex flex-row gap-[12px] justify-between items-center pl-[14px] pt-[22px] pb-[22px] border-b border-solid border-[#FFFFFF33]'
						>
							<StyledImgProduct
								height='56px !important'
								width='56px !important'
								src={imgSrc(p)}
								alt={p.name}
							/>
							<div className='flex flex-auto flex-col gap-[12px] pl-[12px]'>
								<p className='text-[14px] leading-[14px] text-regular text-[#7F7F7F]'>
									{p.name}
								</p>
								<p className='text-[18px] leading-[16px] text-[600] text-[#ffffff]'>
									{p.description}
								</p>
							</div>
							<p className='text-[18px] leading-[18px] font-[400] text-[#ffffff]'>
								{p.quantity}x
							</p>
							<p className='text-[18px] leading-[18px] font-[600] text-[#ffffff]'>
								{p.price * p.quantity} {t('MyAccount.currency')}
							</p>
						</StyledLiMoreInfo>
					))}
				</ul>

				<div className='mr-[67px] pl-[22px] pr-[22px] pt-[30px] pb-[22px] bg-[#1B1919] mt-[25px] max-w-[380px] self-start rounded-[10px]'>
					<div>
						<p className='mb-[12px] text-[16px] leading-[20px] font-[500] text-[#FFFFFFC9]'>
							{t('MyAccount.tel')} <a href={`tel:${order.tel}`}>{order.tel}</a>
						</p>
						<p className='mb-[12px] text-[16px] leading-[20px] font-[500] text-[#FFFFFFC9]'>
							{order.address}
						</p>
						<p className='mb-[12px] text-[16px] leading-[20px] font-[500] text-[#FFFFFFC9]'>
							{t('MyAccount.declaration_number')} {order.deliveyId}
						</p>
					</div>
				</div>
			</MoreInfoBlock>

			<TotalPriceWraper className='pl-[30px] w-[460px]'>
				{/* ↑ було 400px */}
				<div className='flex flex-row justify-between mb-[32px]'>
					<StyledPrice className='w-[45%] pb-[18px] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]'>
						{t('MyAccount.total')}
					</StyledPrice>
					<p className='w-[45%] pb-[18px] text-[#FFFFFFC9] relative inline-block text-[18px] leading[18px] font-bold'>
						{formatPrice(order.total)} {t('MyAccount.currency')}
						<span className='absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-gray-300 to-transparent'></span>
					</p>
				</div>
			</TotalPriceWraper>
		</li>
	)
}

/* styled-components */
const StyledLi = styled.div`
	display: grid;
	grid-template-columns: 380px 320px 1fr; /* ↑ трохи ширші колонки */
	@media (max-width: 1200px) {
		grid-template-columns: 360px 300px;
	}
`

const StyledDiv = styled(StyledLi)<{ $status: string }>`
	position: relative;

	p:last-child::first-letter {
		text-transform: uppercase;
	}

	&:before {
		content: '';
		position: absolute;
		left: 11px;
		top: 18px; /* опущена кольорова смужка */
		display: block;
		width: 3px;
		height: calc(100% - 28px); /* під нову висоту хедера */
		max-height: 104px; /* ↑ було 68/100 */
		background-color: ${({ $status }) =>
			$status === 'delivered'
				? '#4BC785'
				: $status === 'paid'
					? '#1DA1E3'
					: $status === 'shipped' || $status === 'sent'
						? '#D56909'
						: $status === 'confirmed'
							? '#1DA1E3'
							: $status === 'cancelled'
								? '#686868'
								: '#686868'};
	}
`

/* більша іконка-стрілка */
const StyledArrow = styled(ArrowIcon)`
	width: 36px;
	height: 36px;
`

const DateLine = styled.p`
	margin-top: 2px;
`

const StyledImgProduct = styled.img``

const StyledFor = styled.p`
	position: absolute;
	top: 50%;
	right: 80px;
	transform: translateY(-50%);
	font-size: 13px;
	font-weight: 400;
	color: #7f7f7f;

	@media (max-width: 1200px) {
		display: none !important;
	}
`

const ImgBlock = styled.div`
	@media (max-width: 1200px) {
		display: none !important;
	}
`

const TotalPrice = styled.div`
	@media (max-width: 764px) {
		display: none !important;
	}
`

const StyledPrice = styled.p`
	@media (max-width: 764px) {
		border-bottom: none !important;
	}
`

const BigData = styled.p`
	@media (max-width: 764px) {
		display: none !important;
	}
`

const MoreInfoBlock = styled.div`
	@media (max-width: 1000px) {
		display: block;

		ul {
			width: 100%;
		}

		> div {
			margin: auto;
			margin-bottom: 30px;
		}
	}
`

const StyledLiMoreInfo = styled.li`
	@media (max-width: 764px) {
		padding: 22px 0;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		text-align: center;
		border-bottom: none;
		border-top: 1px solid #ffffff33;
		margin-bottom: 22px;
		margin-top: 22px;
	}
`

const TotalPriceWraper = styled.div`
	@media (max-width: 764px) {
		width: 100%;

		> div {
			flex-direction: column;
			align-items: center;
			margin-left: -20px;

			> p:last-child {
				padding: 0;
			}
		}
	}
`

export default OrderCart
