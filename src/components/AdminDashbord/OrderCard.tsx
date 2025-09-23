'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ArrowUp from '@/assets/img/arrow-up.svg'

import { formatDate } from '@/helpers/formatDate'

interface OrderCardProps {
	item: any
	onClick?: (e: React.MouseEvent) => void
	select?: boolean | number
}

const normalize = (s: string): string => {
	const m: Record<string, string> = {
		Доставлено: 'DELIVERED',
		Delivered: 'DELIVERED',
		Оплачено: 'PAID',
		Paid: 'PAID',
		Черновик: 'DRAFT',
		Draft: 'DRAFT',
		Отправлен: 'SHIPPED',
		Відправлено: 'SHIPPED',
		Sent: 'SHIPPED',
		Shipped: 'SHIPPED',
		Confirmed: 'CONFIRMED',
		Подтвержден: 'CONFIRMED',
		Підтверджено: 'CONFIRMED',
		Cancelled: 'CANCELLED',
		Отменен: 'CANCELLED',
		Скасовано: 'CANCELLED'
	}
	return (m[s] || s || '').toUpperCase()
}

const colorBy = (code: string) =>
	code === 'DELIVERED'
		? '#4BC785'
		: code === 'PAID'
			? '#1DA1E3'
			: code === 'SHIPPED'
				? '#D56909'
				: code === 'CONFIRMED'
					? '#1DA1E3'
					: code === 'CANCELLED'
						? '#686868'
						: '#686868' // DRAFT/unknown

export const OrderCard = ({ item, onClick, select }: OrderCardProps) => {
	const { t, i18n } = useTranslation('common')
	const code = normalize(item.status)

	return (
		<WrapperCard
			$code={code}
			$selectProp={select === item.id}
			className='transition-all duration-300 cursor-pointer w-full border border-dashed border-[#FFFFFF80] pl-[21px] pt-[13px] px-[11px] relative'
			onClick={onClick}
		>
			<p className='text-[13px] text-[#7F7F7F] font-[400] mb-[10px] leading-[13px]'>
				{t('AdminDashboard.order_id')} {item.id}
			</p>
			<p className='text-[13px] text-[#7F7F7F] font-[400] mb-[10px] leading-[13px]'>
				{formatDate(item.date || item.created_at, i18n.language)}
			</p>
			<p className='text-[16px] text-[#ffffff] font-[600] mb-[10px] leading-[16px]'>
				{item.status}
			</p>
			<ArrowUp className='absolute top-[11px] right-[10px] fill-[#7F7F7F] rotate-180 z-[2]' />
		</WrapperCard>
	)
}

const WrapperCard = styled.li<{ $code: string; $selectProp?: boolean }>`
	background-color: ${({ $selectProp, $code }) =>
		$selectProp ? `${colorBy($code)}29` : 'transparent'};

	&:before {
		content: '';
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translateY(-50%);
		display: block;
		width: 3px;
		height: 80%;
		background-color: ${({ $code }) => colorBy($code)};
	}
`
