'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Cross from '@/assets/img/close.svg'
import Eye from '@/assets/img/eye.svg'
import Notebook from '@/assets/img/notebook.svg'
import Pencil from '@/assets/img/pencil.svg'

import type { ApiStatus } from './OrderData'
import { formatDate } from '@/helpers/formatDate'

const UI_TO_API_STATUS: Record<string, ApiStatus> = {
	Черновик: 'DRAFT',
	Draft: 'DRAFT',
	Confirmed: 'CONFIRMED',
	Подтвержден: 'CONFIRMED',
	Підтверджено: 'CONFIRMED',
	Оплачено: 'PAID',
	Paid: 'PAID',
	Отправлен: 'SHIPPED',
	Відправлено: 'SHIPPED',
	Sent: 'SHIPPED',
	Shipped: 'SHIPPED',
	Доставлено: 'DELIVERED',
	Delivered: 'DELIVERED',
	Cancelled: 'CANCELLED',
	Отменен: 'CANCELLED',
	Скасовано: 'CANCELLED'
}
const asApiStatus = (s: any): ApiStatus =>
	(UI_TO_API_STATUS[s] || String(s || 'DRAFT').toUpperCase()) as ApiStatus

const toServer = (s: ApiStatus): ApiStatus => s

export const ModalCart = ({
	item,
	setIsOpen,
	onUpdated
}: {
	item: any
	setIsOpen: (isOpen: boolean) => void
	onUpdated?: () => void
}) => {
	const { t, i18n } = useTranslation('common')

	const [editing, setEditing] = useState(false)
	const [saving, setSaving] = useState(false)
	const [form, setForm] = useState({
		full_name: item?.full_name || item?.name || '',
		phone: item?.phone || item?.tel || '',
		email: item?.email || '',
		shipping_address: item?.shipping_address || item?.address || '',
		billing_address: item?.billing_address || '',
		comment: item?.comment || '',
		status: asApiStatus(item?.status || 'DRAFT') as ApiStatus
	})

	const token =
		typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
	const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}
	const API_BASE = 'https://rpktask.sytes.net/api'

	const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
		if (
			e.target instanceof HTMLElement &&
			e.target.classList.contains('wraper')
		) {
			setIsOpen(false)
		}
	}

	if (!item) return null

	const lines = (Array.isArray(item.items) ? item.items : []).map((li: any) => {
		const variant = Array.isArray(li.variant) ? li.variant[0] : li.variant
		const img = variant?.images?.[0]?.image
		return {
			name: variant?.sku || variant?.name || t('AdminDashboard.product'),
			quantity: li?.quantity ?? 1,
			price: Number(li?.price) || Number(variant?.price) || 0,
			photo: img || '/img/placeholder.png',
			description:
				Array.isArray(variant?.features) && variant.features.length
					? `${variant.features[0].name}: ${variant.features[0].value}`
					: ''
		}
	})

	const readErrorMsg = async (r: Response, fallback: string) => {
		try {
			const json = await r.clone().json()
			const raw =
				json?.error ?? json?.detail ?? json?.message ?? json?.errors ?? json
			if (Array.isArray(raw)) return raw.join('\n')
			if (typeof raw === 'object') return JSON.stringify(raw)
			return String(raw || fallback)
		} catch {
			try {
				return (await r.text()) || fallback
			} catch {
				return fallback
			}
		}
	}

	const onPencilClick = async () => {
		if (!editing) {
			if (form.status !== 'DRAFT') {
				alert(t('AdminDashboard.edit_only_draft'))
				return
			}
			setEditing(true)
			return
		}

		try {
			setSaving(true)
			const body: any = {
				full_name: form.full_name,
				phone: form.phone,
				email: form.email,
				shipping_address: form.shipping_address,
				billing_address: form.billing_address,
				comment: form.comment,
				status: toServer(form.status)
			}
			const r = await fetch(`${API_BASE}/orders/${item.id}/update/`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json', ...authHeaders },
				body: JSON.stringify(body)
			})
			if (!r.ok) {
				const msg = await readErrorMsg(
					r,
					t('AdminDashboard.error_status') || 'Failed to update'
				)
				alert(msg)
				return
			}
			setEditing(false)
			onUpdated?.()
		} catch (e: any) {
			alert(
				e?.message || t('AdminDashboard.error_status') || 'Failed to update'
			)
		} finally {
			setSaving(false)
		}
	}

	const onChangeField =
		(k: keyof typeof form) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>
		) =>
			setForm(prev => ({ ...prev, [k]: e.target.value }))

	return (
		<div
			onClick={handleClose}
			className='w-full h-full pt-[5%] px-[20px] fixed top-0 left-0 bg-[#00000080] z-[100] wraper'
		>
			<Wrapper className='relative pb-[47px] pt-[20px] pl-[0px] pr-[129px] w-full max-w-[888px] bg-[#292929] m-auto rounded-[10px]'>
				<Cross
					className='cursor-pointer absolute w-[24px] h-[24px] top-[20px] right-[20px]'
					onClick={() => setIsOpen(false)}
				/>
				<WrapperOrder className='relative mb-[30px] flex flex-row justify-between'>
					<div className='relative pl-[59px]'>
						<p className='mb-[11px] font-[400] leading-[18px] text-[18px] text-[#ffffff]'>
							{t('AdminDashboard.order_id')} {item.id}
						</p>
						<p className='mb-[10px] font-[400] leading-[16px] text-[16px] text-[#7F7F7F]'>
							{formatDate(item.date || item.created_at, i18n.language)}
						</p>
						{!editing ? (
							<p className='mb-[10px] font-[600] leading-[17px] text-[17px] text-[#ffffff]'>
								{form.status}
							</p>
						) : (
							<select
								className='mb-[10px] font-[600] leading-[17px] text-[17px] text-[#ffffff] bg-transparent border border-[#434343] rounded-[6px] px-[8px]'
								value={form.status}
								onChange={onChangeField('status')}
								disabled={form.status !== 'DRAFT'}
								title={
									form.status !== 'DRAFT'
										? t('AdminDashboard.edit_only_draft')
										: undefined
								}
							>
								{(
									[
										'DRAFT',
										'CONFIRMED',
										'PAID',
										'SHIPPED',
										'DELIVERED',
										'CANCELLED'
									] as ApiStatus[]
								).map(s => (
									<option
										key={s}
										value={s}
										className='text-black'
									>
										{s}
									</option>
								))}
							</select>
						)}
					</div>
					<IconWrapper className='flex flex-row gap-[50px] items-start'>
						<div className='flex flex-row flex-row gap-[10px] items-center'>
							<Eye className='w-[24px] h-[24px]' />
							<p className='font-[400] leading-[16px] text-[16px] text-[#7F7F7F]'>
								15
							</p>
						</div>
						<Pencil
							className='w-[24px] h-[24px] cursor-pointer'
							onClick={onPencilClick}
							title={
								!editing
									? form.status !== 'DRAFT'
										? t('AdminDashboard.edit_only_draft')
										: 'Edit'
									: saving
										? 'Saving...'
										: 'Save'
							}
						/>
						<Notebook className='w-[24px] h-[24px]' />
					</IconWrapper>
				</WrapperOrder>

				{form.status !== 'DRAFT' && (
					<div className='mb-[12px] text-[14px] px-3 py-2 rounded-[8px] bg-[#D5690933] border border-[#D56909] text-white ml-[20px] mr-[20px]'>
						{t('AdminDashboard.edit_only_draft')}
					</div>
				)}

				<div className='mb-[40px] flex flex-row flex-wrap gap-[10px] pl-[20px] pr-[20px]'>
					{lines.map((p: any, idx: number) => (
						<div
							key={idx}
							className='flex flex-row gap-[10px] w-[45%] min-w-[300px]'
						>
							<div className='flex items-center justify-center rounded-[8px] bg-[#0D0C0C] w-[94px] h-[92px]'>
								<img
									width={74}
									src={p.photo}
									alt={p.name}
								/>
							</div>
							<div className='flex flex-col gap-[10px]'>
								<p className='mb-[11px] font-[600] leading-[17px] text-[17px] text-[#ffffff]'>
									{p.name}
								</p>
								<div className='flex flex-row gap-[10px] justify-between'>
									<p className='font-[400] leading-[17px] text-[17px] text-[#ffffff]'>
										{p.quantity}x
									</p>
									<p className='font-[600] leading-[17px] text-[17px] text-[#ffffff]'>
										{p.price * p.quantity} {t('AdminDashboard.currency')}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className='pl-[20px] pr-[20px]'>
					{!editing ? (
						<>
							<p className='text-[16px] mb-[10px] leading-[18px] text-[#FFFFFFC9]'>
								{form.full_name}
							</p>
							<p className='text-[16px] mb-[10px] leading-[18px] text-[#FFFFFFC9]'>
								{t('AdminDashboard.tel')} {form.phone}
							</p>
							<p className='text-[16px] mb-[10px] leading-[18px] text-[#FFFFFFC9]'>
								{t('AdminDashboard.email')} {form.email}
							</p>
							<p className='text-[16px] mb-[10px] leading-[18px] text-[#FFFFFFC9]'>
								{form.shipping_address || form.billing_address}
							</p>
							{form.comment && (
								<p className='text-[16px] mb-[10px] leading-[18px] text-[#FFFFFFC9]'>
									{form.comment}
								</p>
							)}
						</>
					) : (
						<div className='flex flex-col gap-[10px] max-w-[520px]'>
							<input
								className='text-[16px] leading-[18px] text-[#FFFFFF] bg-transparent border border-[#333333] rounded-[6px] px-[10px] h-[36px]'
								placeholder={t('AdminDashboard.full_name')}
								value={form.full_name}
								onChange={onChangeField('full_name')}
							/>
							<input
								className='text-[16px] leading-[18px] text-[#FFFFFF] bg-transparent border border-[#333333] rounded-[6px] px-[10px] h-[36px]'
								placeholder={t('AdminDashboard.tel') || 'Phone'}
								value={form.phone}
								onChange={onChangeField('phone')}
							/>
							<input
								className='text-[16px] leading-[18px] text-[#FFFFFF] bg-transparent border border-[#333333] rounded-[6px] px-[10px] h-[36px]'
								placeholder={t('AdminDashboard.email')}
								value={form.email}
								onChange={onChangeField('email')}
							/>
							<input
								className='text-[16px] leading-[18px] text-[#FFFFFF] bg-transparent border border-[#333333] rounded-[6px] px-[10px] h-[36px]'
								placeholder={t('AdminDashboard.shipping_address')}
								value={form.shipping_address}
								onChange={onChangeField('shipping_address')}
							/>
							<input
								className='text-[16px] leading-[18px] text-[#FFFFFF] bg-transparent border border-[#333333] rounded-[6px] px-[10px] h-[36px]'
								placeholder={t('AdminDashboard.billing_address')}
								value={form.billing_address}
								onChange={onChangeField('billing_address')}
							/>
							<textarea
								className='text-[16px] leading-[18px] text-[#FFFFFF] bg-transparent border border-[#333333] rounded-[6px] px-[10px] py-[8px] min-h-[70px]'
								placeholder={t('AdminDashboard.comment')}
								value={form.comment}
								onChange={onChangeField('comment')}
							/>
						</div>
					)}
				</div>
			</Wrapper>
		</div>
	)
}

const WrapperOrder = styled.div`
	position: relative;
	&::before {
		content: '';
		position: absolute;
		left: 20px;
		top: 0px;
		width: 20px;
		height: 20px;
		background-color: #979797;
		border: 1px solid #434343;
		border-radius: 4px;
	}
	&::after {
		content: '';
		position: absolute;
		left: 20px;
		bottom: -10px;
		width: calc(100% + 90px);
		height: 1px;
		background-color: #ffffff42;
	}
`
const Wrapper = styled.div`
	@media (max-width: 764px) {
		padding-top: 60px;
		max-height: 90%;
		overflow-y: auto;
	}
`
const IconWrapper = styled.div`
	@media (max-width: 764px) {
		gap: 10px;
	}
`
