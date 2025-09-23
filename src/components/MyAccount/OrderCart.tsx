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

	// нормалізуємо бекенд-статуси під ключі для стилів
	const statusKey = (() => {
		const v = (order.status || '').toString().trim().toUpperCase()
		if (v === 'PAID') return 'paid'
		if (v === 'CONFIRMED') return 'confirmed'
		if (v === 'SENT' || v === 'SHIPPED') return 'shipped'
		if (v === 'DELIVERED') return 'delivered'
		if (v === 'CANCELLED' || v === 'CANCELED') return 'cancelled'
		return 'draft'
	})()

	// безпечне джерело зображення
	const imgSrc = (p: Product) =>
		typeof p.photo === 'string'
			? p.photo
			: p.photo?.src || '/img/placeholder.png'

	return (
		<li
			key={order.id}
			className={`relative border border-dashed transition-all duration-300 ${
				isOpen
					? 'border-[#4BC785] max-h-[2000px]'
					: 'border-[#FFFFFF80] max-h-[95px]'
			}  overflow-hidden`}
		>
			<div className='absolute w-full pr-[67px] pl-[28px] top-[95px]'>
				<div className='h-[1px] w-full bg-[#FFFFFF33]'></div>
			</div>

			<StyledDiv
				$status={statusKey}
				className={`h-[90px] relative pl-[30px] pt-[18px] pb-[15px] pr-[67px] transition-all duration-300}`}
			>
				<div className='flex flex-col gap-[10px]'>
					<BigData className='text-[14px]  text-[#7F7F7F]'>
						{t('MyAccount.order')} {order.id},{' '}
						{formatDate(order.date, i18n.language)}
					</BigData>
					<ShortData className='text-[14px]  text-[#7F7F7F]'>
						{formatDate(order.date, i18n.language)}
					</ShortData>
					<p className='text-[14px] text-[22px] leading-[22px] !font-[600] font-medium text-[#ffffff]'>
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

				<ImgBlock className='flex flex-row gap-[10px] w-[262px] select-none m-[auto]'>
					{order.products.slice(0, 4).map((p, i) => (
						<img
							key={i}
							className='h-[38px] w-auto'
							src={imgSrc(p)}
							alt={p.name}
						/>
					))}
				</ImgBlock>

				{order.products.length > 4 ? (
					<StyledFor>+{order.products.length - 4}</StyledFor>
				) : null}

				<ArrowIcon
					className={`cursor-pointer absolute top-1/2 right-[23px] translate-y-[-50%] transition-all duration-300 ${
						isOpen ? 'rotate-0' : 'rotate-180'
					}`}
					style={{ fill: isOpen ? '#4BC785' : '#ffffff' }}
					onClick={() => setIsOpen(!isOpen)}
				/>
			</StyledDiv>

			<MoreInfoBlock
				className={`flex justify-between ${isOpen ? 'max-h-[2000px]' : 'max-h-[95px]'} overflow-hidden transition-all duration-300`}
			>
				<ul className='w-[70%] pl-[28px] pt-[20px] pb-[15px] pr-[67px] '>
					{order.products.map((p, i) => (
						<StyledLiMoreInfo
							key={i}
							className='flex flex-row gap-[10px] justify-between items-center pl-[14px] pt-[20px] pb-[20px] border-b border-solid border-[#FFFFFF33]'
						>
							<StyledImgProduct
								height='48px !important'
								width='48px !important'
								src={imgSrc(p)}
								alt={p.name}
							/>
							<div className='flex flex-auto flex-col gap-[11px] pl-[10px]'>
								<p className='text-[13px] leading-[13px] text-regular text-[#7F7F7F]'>
									{p.name}
								</p>
								<p className='text-[17px] leading-[13px] text-[600] text-[#ffffff]'>
									{p.description}
								</p>
							</div>
							<p className='text-[17px] leading-[17px] font-[400] text-[#ffffff]'>
								{p.quantity}x
							</p>
							<p className='text-[17px] leading-[17px] font-[600] text-[#ffffff]'>
								{p.price * p.quantity} {t('MyAccount.currency')}
							</p>
						</StyledLiMoreInfo>
					))}
				</ul>

				<div className='mr-[67px] pl-[20px] pr-[20px] pt-[28px] pb-[20px] bg-[#1B1919] mt-[25px] max-w-[350px] self-start rounded-[8px]'>
					<div>
						<p className='mb-[10px] text-[16px] leading-[20px] font-[500] text-[#FFFFFFC9]'>
							{t('MyAccount.tel')} <a href={`tel:${order.tel}`}>{order.tel}</a>
						</p>
						<p className='mb-[10px] text-[16px] leading-[20px] font-[500] text-[#FFFFFFC9]'>
							{order.address}
						</p>
						<p className='mb-[10px] text-[16px] leading-[20px] font-[500] text-[#FFFFFFC9]'>
							{t('MyAccount.declaration_number')} {order.deliveyId}
						</p>
					</div>
				</div>
			</MoreInfoBlock>

			<TotalPriceWraper className='pl-[30px] w-[400px]'>
				<div className='flex flex-row justify-between mb-[30px]'>
					<StyledPrice className='w-[45%] pb-[15px] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]'>
						{t('MyAccount.price')}
					</StyledPrice>
					<p className='w-[45%] pb-[15px] text-[#FFFFFFC9] relative inline-block text-[14px] leading[18px] font-bold'>
						{formatPrice(order.price)} {t('MyAccount.currency')}
						<span className='absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-gray-300 to-transparent'></span>
					</p>
				</div>
				<div className='flex flex-row justify-between mb-[30px]'>
					<StyledPrice className='w-[45%] pb-[15px] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]'>
						{t('MyAccount.delivery')}
					</StyledPrice>
					<p className='w-[45%] pb-[15px] text-[#FFFFFFC9] relative inline-block text-[14px] leading[18px] font-bold'>
						{formatPrice(order.delivery)} {t('MyAccount.currency')}
						<span className='absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-gray-300 to-transparent'></span>
					</p>
				</div>
				<div className='flex flex-row justify-between mb-[30px]'>
					<StyledPrice className='w-[45%] pb-[15px] text-[#FFFFFFA8] border-b border-dashed border-[#ffffff42]'>
						{t('MyAccount.total')}
					</StyledPrice>
					<p className='w-[45%] pb-[15px] text-[#FFFFFFC9] relative inline-block text-[18px] leading[18px] font-bold'>
						{formatPrice(order.total)} {t('MyAccount.currency')}
						<span className='absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-gray-300 to-transparent'></span>
					</p>
				</div>
			</TotalPriceWraper>
		</li>
	)
}

/* styled-components — дизайн лишив як у тебе */
const StyledLi = styled.div`
	display: grid;
	grid-template-columns: 350px 300px 1fr;
	@media (max-width: 1200px) {
		grid-template-columns: 350px 300px;
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
		top: 11px;
		display: block;
		width: 3px;
		height: 80%;
		max-height: 68px;
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

const ShortData = styled.p`
	display: none !important;
	@media (max-width: 764px) {
		display: block !important;
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
		padding: 20px 0;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		text-align: center;
		border-bottom: none;
		border-top: 1px solid #ffffff33;
		margin-bottom: 20px;
		margin-top: 20px;
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
