'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Cross from '@/assets/img/close.svg'
import Pencil from '@/assets/img/pencil.svg'

import type { ApiStatus } from './OrderData'
import { formatDate } from '@/helpers/formatDate'

type Zone = {
	id: number
	name: string
	code?: string
	markup_percent?: string | number
}

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
const STATUSES: ApiStatus[] = [
	'DRAFT',
	'CONFIRMED',
	'PAID',
	'SHIPPED',
	'CANCELLED'
]

type ClientType = 'INDIVIDUAL' | 'COMPANY'
const CLIENT_TYPES: ClientType[] = ['INDIVIDUAL', 'COMPANY']

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

	const API_BASE = 'https://rpktask.sytes.net/api'
	const token =
		typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
	const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

	const [zones, setZones] = useState<Zone[]>([])
	const [loadingZones, setLoadingZones] = useState(false)

	const [editing, setEditing] = useState(false)
	const [saving, setSaving] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const [errorLoadOrder, setErrorLoadOrder] = useState<string | null>(null)

	const [statusSaving, setStatusSaving] = useState<
		'idle' | 'saving' | 'saved' | 'error'
	>('idle')

	const initialForm = useMemo(
		() => ({
			full_name: item?.full_name || item?.name || '',
			phone: item?.phone || item?.tel || '',
			email: item?.email || '',

			shipping_address: item?.shipping_address || item?.address || '',
			billing_address: item?.billing_address || '',

			client_type: (item?.client_type as ClientType) || 'INDIVIDUAL',
			transport_company_address: item?.transport_company_address || '',
			company_name: item?.company_name || '',
			vat_number: item?.vat_number || '',
			promo_code: item?.promo_code || '',
			post_index: item?.post_index || '',
			comment: item?.comment || '',
			// статус
			status: asApiStatus(item?.status || 'DRAFT') as ApiStatus,
			// білінг-зона
			billing_zone_id:
				(typeof item?.billing_zone === 'number'
					? item.billing_zone
					: item?.billing_zone?.id) ?? null,
			billing_zone_name:
				typeof item?.billing_zone === 'object' && item?.billing_zone?.name
					? String(item.billing_zone.name)
					: ''
		}),
		[item]
	)
	const [form, setForm] = useState(initialForm)

	/* ---------- helpers ---------- */
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

	const handleBackdropClose = (e: React.MouseEvent<HTMLDivElement>) => {
		if (
			e.target instanceof HTMLElement &&
			e.target.classList.contains('wraper')
		) {
			setIsOpen(false)
		}
	}

	/* ---------- 1) підтягнути свіжі дані замовлення ---------- */
	useEffect(() => {
		if (!item?.id) return
		;(async () => {
			try {
				setErrorLoadOrder(null)
				const r = await fetch(`${API_BASE}/orders/${item.id}/`, {
					headers: { 'Content-Type': 'application/json', ...authHeaders },
					cache: 'no-store'
				})
				if (!r.ok) {
					const msg = await readErrorMsg(r, 'Failed to load order')
					setErrorLoadOrder(msg)
					return
				}
				const data = await r.json()
				const zoneId =
					typeof data?.billing_zone === 'number' ? data.billing_zone : null
				setForm(prev => ({
					...prev,
					full_name: data?.full_name ?? prev.full_name,
					phone: data?.phone ?? prev.phone,
					email: data?.email ?? prev.email,
					shipping_address: data?.shipping_address ?? prev.shipping_address,
					billing_address: data?.billing_address ?? prev.billing_address,
					comment: data?.comment ?? prev.comment,
					status: asApiStatus(data?.status ?? prev.status),
					billing_zone_id: zoneId,

					client_type: (data?.client_type as ClientType) ?? prev.client_type,
					transport_company_address:
						data?.transport_company_address ?? prev.transport_company_address,
					company_name: data?.company_name ?? prev.company_name,
					vat_number: data?.vat_number ?? prev.vat_number,
					promo_code: data?.promo_code ?? prev.promo_code,
					post_index: data?.post_index ?? prev.post_index
				}))
			} catch (e: any) {
				setErrorLoadOrder(e?.message || 'Failed to load order')
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [item?.id])

	/* ---------- 2) довідник зон ---------- */
	useEffect(() => {
		let alive = true
		const loadZones = async () => {
			try {
				setLoadingZones(true)
				const acc: Zone[] = []
				let page = 1
				const pageSize = 100
				while (true) {
					const r = await fetch(
						`${API_BASE}/orders/billing-zones/?page=${page}&page_size=${pageSize}`,
						{
							headers: { 'Content-Type': 'application/json', ...authHeaders },
							cache: 'no-store'
						}
					)
					if (!r.ok) break
					const json = await r.json()
					const results: any[] = Array.isArray(json?.results)
						? json.results
						: []
					acc.push(
						...results.map(z => ({
							id: z?.id,
							name: String(z?.name ?? ''),
							code: String(z?.code ?? ''),
							markup_percent: z?.markup_percent
						}))
					)
					if (!json?.next) break
					page++
				}
				if (!alive) return
				setZones(acc)
			} finally {
				if (alive) setLoadingZones(false)
			}
		}
		loadZones()
		return () => {
			alive = false
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [item?.id])

	// синхронізація назви зони
	useEffect(() => {
		if (form.billing_zone_id == null || zones.length === 0) return
		const found = zones.find(z => z.id === form.billing_zone_id)
		if (found && found.name !== form.billing_zone_name) {
			setForm(prev => ({ ...prev, billing_zone_name: found.name }))
		}
	}, [zones, form.billing_zone_id]) // eslint-disable-line react-hooks/exhaustive-deps

	/* ---------- дії ---------- */
	const patchOrder = async (
		body: any,
		fallbackMsgKey = 'AdminDashboard.error_status'
	) => {
		const r = await fetch(`${API_BASE}/orders/${item.id}/update/`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json', ...authHeaders },
			body: JSON.stringify(body)
		})
		if (!r.ok) {
			const msg = await readErrorMsg(r, t(fallbackMsgKey) || 'Failed to update')
			throw new Error(msg)
		}
		return r
	}

	// автозбереження ТІЛЬКИ статусу
	const changeStatus = async (newStatus: ApiStatus) => {
		if (newStatus === form.status) return
		setForm(prev => ({ ...prev, status: newStatus }))
		try {
			setStatusSaving('saving')
			await patchOrder({ status: toServer(newStatus) })
			setStatusSaving('saved')
			onUpdated?.()
			setTimeout(() => setStatusSaving('idle'), 900)
		} catch {
			setTimeout(() => setStatusSaving('idle'), 1200)
		}
	}

	const onSaveClick = async () => {
		try {
			setSaving(true)
			await patchOrder({
				full_name: form.full_name,
				phone: form.phone,
				email: form.email,
				shipping_address: form.shipping_address,
				billing_address: form.billing_address,
				comment: form.comment,
				billing_zone: form.billing_zone_id ?? 0, // якщо 0 не валідний — приберіть поле

				// нові поля
				client_type: form.client_type,
				transport_company_address: form.transport_company_address,
				company_name: form.company_name,
				vat_number: form.vat_number,
				promo_code: form.promo_code,
				post_index: form.post_index
			})
			setEditing(false)
			onUpdated?.()
		} catch {
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = async () => {
		if (!item?.id) return
		if (!confirm(t('AdminDashboard.confirm_delete'))) return
		try {
			setDeleting(true)
			const r = await fetch(`${API_BASE}/orders/${item.id}/cancel/`, {
				method: 'POST',
				headers: { ...authHeaders }
			})
			if (!r.ok) {
				const msg = await readErrorMsg(r, t('AdminDashboard.error_delete'))
				alert(msg)
				return
			}
			onUpdated?.()
			setIsOpen(false)
		} catch (e: any) {
			alert(e?.message || t('AdminDashboard.error_delete'))
		} finally {
			setDeleting(false)
		}
	}

	const onChangeField =
		(k: keyof typeof form) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
			setForm(prev => ({ ...prev, [k]: e.target.value }))

	const onPickZoneLocal = (z: Zone | null) => {
		if (!z) return
		setForm(prev => ({
			...prev,
			billing_zone_id: z.id,
			billing_zone_name: z.name
		}))
	}

	/* ---------- вивід ---------- */
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

	return (
		<div
			onClick={handleBackdropClose}
			className='w-full h-full pt-[5%] px-[20px] fixed top-0 left-0 bg-[#00000080] z-[100] wraper'
		>
			<Wrapper className='relative pb-[47px] pt-[20px] pl-[20px] pr-[20px] w-full max-w-[800px] bg-[#292929] m-auto rounded-[10px]'>
				{/* ХРЕСТИК ТЕПЕР ВСЕРЕДИНІ ШАПКИ */}
				<WrapperOrder className='relative mb-[30px] flex flex-row justify-between items-start'>
					<Cross
						className='cursor-pointer absolute w-[24px] h-[24px] top-[0px] right-[0px]'
						onClick={() => setIsOpen(false)}
					/>

					<LeftHeader>
						{editing && (
							<BackBtn
								type='button'
								aria-label='Cancel edit'
								onClick={() => {
									setEditing(false)
									setForm(initialForm) // скинути незбережені інші поля
								}}
								title={t('AdminDashboard.cancel_edit') || 'Cancel'}
							>
								<svg
									width='18'
									height='18'
									viewBox='0 0 24 24'
									fill='none'
									aria-hidden='true'
								>
									<path
										d='M15 18l-6-6 6-6'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</BackBtn>
						)}

						<div className='relative'>
							{/* Номер замовлення з CODE (fall back на id) */}
							<p className='mb-[6px] font-[600] leading-[18px] text-[18px] text-[#ffffff]'>
								{t('AdminDashboard.order_id')}{' '}
								{item?.code ? String(item.code) : String(item?.id ?? '')}
							</p>
							<p className='mb-[10px] font-[400] leading-[16px] text-[14px] text-[#7F7F7F]'>
								{formatDate(item.date || item.created_at, i18n.language)}
							</p>

							{/* СТАТУС — автосейв */}
							<StatusSelect
								value={form.status}
								onChange={changeStatus}
								busy={statusSaving === 'saving'}
								saved={statusSaving === 'saved'}
							/>
							{errorLoadOrder && (
								<ErrorText style={{ marginTop: 6 }}>{errorLoadOrder}</ErrorText>
							)}
						</div>
					</LeftHeader>

					<IconWrapper className='flex flex-row gap-[12px] items-center'>
						{!editing ? (
							<HeaderBtn
								type='button'
								onClick={() => setEditing(true)}
								title={t('AdminDashboard.edit')}
							>
								<Pencil className='w-[20px] h-[20px]' />
								<span>{t('AdminDashboard.edit')}</span>
							</HeaderBtn>
						) : (
							<PrimaryBtn
								type='button'
								onClick={onSaveClick}
								disabled={saving}
								title={
									saving
										? (t('AdminDashboard.loading') as string)
										: t('AdminDashboard.save')
								}
							>
								{saving
									? t('AdminDashboard.loading')
									: t('AdminDashboard.save')}
							</PrimaryBtn>
						)}

						<DeleteBtn
							type='button'
							disabled={deleting}
							onClick={handleDelete}
							title={t('AdminDashboard.delete')}
						>
							{deleting
								? t('AdminDashboard.loading')
								: t('AdminDashboard.delete')}
						</DeleteBtn>
					</IconWrapper>
				</WrapperOrder>

				{/* товари */}
				<div className='mb-[40px] flex flex-row flex-wrap gap-[10px] pl-[20px] pr-[20px]'>
					{lines.map((p: any, idx: number) => (
						<div
							key={idx}
							className='flex flex-row gap-[10px] w-[45%] min-w-[300px]'
						>
							<Thumb>
								<img
									width={74}
									src={p.photo}
									alt={p.name}
								/>
							</Thumb>
							<div className='flex flex-col gap-[10px]'>
								<p className='mb-[6px] font-[600] leading-[17px] text-[16px] text-[#ffffff]'>
									{p.name}
								</p>
								<div className='flex flex-row gap-[10px] justify-between'>
									<p className='font-[400] leading-[17px] text-[15px] text-[#ffffff]'>
										{p.quantity}x
									</p>
									<p className='font-[600] leading-[17px] text-[15px] text-[#ffffff]'>
										{p.price * p.quantity} {t('AdminDashboard.currency')}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* дані + білінг-зона */}
				<div className='pl-[20px] pr-[20px]'>
					{!editing ? (
						// ===== READ-ONLY
						<ReadonlyGrid>
							<FieldRow
								label='Client type'
								value={form.client_type}
							/>
							<FieldRow
								label={t('AdminDashboard.full_name') as string}
								value={form.full_name}
							/>
							<FieldRow
								label={t('AdminDashboard.tel') as string}
								value={form.phone}
							/>
							<FieldRow
								label={t('AdminDashboard.email') as string}
								value={form.email}
							/>
							<FieldRow
								label={t('AdminDashboard.shipping_address') as string}
								value={form.shipping_address}
							/>
							<FieldRow
								label={t('AdminDashboard.billing_address') as string}
								value={form.billing_address}
							/>
							<FieldRow
								label={t('AdminDashboard.modelcard.company_address') as string}
								value={form.transport_company_address}
							/>
							<FieldRow
								label={t('AdminDashboard.modelcard.Company_name') as string}
								value={form.company_name}
							/>
							<FieldRow
								label={t('AdminDashboard.modelcard.VAT_number') as string}
								value={form.vat_number}
							/>
							<FieldRow
								label={t('AdminDashboard.modelcard.Promo_code') as string}
								value={form.promo_code}
							/>
							<FieldRow
								label={t('AdminDashboard.modelcard.Post_index') as string}
								value={form.post_index}
							/>
							{!!form.billing_zone_id && (
								<FieldRow
									label={t('AdminDashboard.modelcard.billing_zone') as string}
									value={form.billing_zone_name || `#${form.billing_zone_id}`}
								/>
							)}
							{form.comment && (
								<FieldRow
									label={t('AdminDashboard.comment') as string}
									value={form.comment}
								/>
							)}
						</ReadonlyGrid>
					) : (
						// ===== EDIT
						<div className='flex flex-col gap-[10px] max-w-[520px]'>
							<SegmentGroup
								role='tablist'
								aria-label='Client type'
							>
								{CLIENT_TYPES.map(ct => (
									<SegmentBtn
										key={ct}
										type='button'
										role='tab'
										aria-selected={form.client_type === ct}
										data-active={form.client_type === ct ? '1' : '0'}
										onClick={() =>
											setForm(prev => ({ ...prev, client_type: ct }))
										}
									>
										{ct === 'INDIVIDUAL' ? 'INDIVIDUAL' : 'COMPANY'}
									</SegmentBtn>
								))}
							</SegmentGroup>

							<Input
								placeholder={t('AdminDashboard.full_name')}
								value={form.full_name}
								onChange={onChangeField('full_name')}
							/>
							<Input
								placeholder={t('AdminDashboard.tel') || 'Phone'}
								value={form.phone}
								onChange={onChangeField('phone')}
							/>
							<Input
								placeholder={t('AdminDashboard.email')}
								value={form.email}
								onChange={onChangeField('email')}
							/>
							<Input
								placeholder={t('AdminDashboard.shipping_address')}
								value={form.shipping_address}
								onChange={onChangeField('shipping_address')}
							/>
							<Input
								placeholder={t('AdminDashboard.billing_address')}
								value={form.billing_address}
								onChange={onChangeField('billing_address')}
							/>
							<Input
								placeholder='Transport company address'
								value={form.transport_company_address}
								onChange={onChangeField('transport_company_address' as any)}
							/>
							<Input
								placeholder='Company name'
								value={form.company_name}
								onChange={onChangeField('company_name' as any)}
							/>
							<Input
								placeholder='VAT number'
								value={form.vat_number}
								onChange={onChangeField('vat_number' as any)}
							/>
							<Input
								placeholder='Promo code'
								value={form.promo_code}
								onChange={onChangeField('promo_code' as any)}
							/>
							<Input
								placeholder='Post index'
								value={form.post_index}
								onChange={onChangeField('post_index' as any)}
							/>

							<div>
								<BillingZoneInputLike
									zones={zones}
									loading={loadingZones}
									currentId={form.billing_zone_id}
									currentName={form.billing_zone_name}
									onSelect={onPickZoneLocal}
								/>
							</div>

							<Textarea
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

/* ---------- допоміжний рядок для read-only ---------- */
function FieldRow({
	label,
	value
}: {
	label: string
	value?: string | number | null
}) {
	if (value == null || String(value).trim() === '') return null
	return (
		<Row>
			<span className='name'>{label}</span>
			<span className='val'>{String(value)}</span>
		</Row>
	)
}

/* ---------- селектор статусу (АВТОСЕЙВ) ---------- */
function StatusSelect({
	value,
	onChange,
	busy,
	saved
}: {
	value: ApiStatus
	onChange: (s: ApiStatus) => void
	busy?: boolean
	saved?: boolean
}) {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const onDoc = (e: MouseEvent) => {
			if (!ref.current) return
			if (!ref.current.contains(e.target as Node)) setOpen(false)
		}
		const onEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false)
		}
		document.addEventListener('mousedown', onDoc)
		document.addEventListener('keydown', onEsc)
		return () => {
			document.removeEventListener('mousedown', onDoc)
			document.removeEventListener('keydown', onEsc)
		}
	}, [])

	const pick = (s: ApiStatus) => {
		setOpen(false)
		onChange(s)
	}

	return (
		<SelectWrap
			ref={ref}
			data-open={open ? '1' : '0'}
		>
			<Trigger
				type='button'
				onClick={() => setOpen(v => !v)}
				aria-haspopup='listbox'
				aria-expanded={open}
				title={busy ? 'Saving…' : saved ? 'Saved' : 'Change status'}
			>
				<span className='label'>{value}</span>
				{busy && <SmallBadge aria-live='polite'>…</SmallBadge>}
				{saved && !busy && <SmallBadge aria-live='polite'>✓</SmallBadge>}
				<svg
					width='16'
					height='16'
					viewBox='0 0 24 24'
					fill='none'
					className='chev'
					aria-hidden
				>
					<path
						d='M6 9l6 6 6-6'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</Trigger>

			{open && (
				<Menu role='listbox'>
					{STATUSES.map(s => (
						<MenuItem
							key={s}
							role='option'
							aria-selected={s === value}
							data-active={s === value ? '1' : '0'}
							onClick={() => pick(s)}
						>
							<span className='text'>{s}</span>
						</MenuItem>
					))}
				</Menu>
			)}
		</SelectWrap>
	)
}

/* ---------- інпут-лайк селектор білінг-зони ---------- */
function BillingZoneInputLike({
	zones,
	loading,
	currentId,
	currentName,
	onSelect
}: {
	zones: Zone[]
	loading: boolean
	currentId: number | null
	currentName?: string
	onSelect: (z: Zone | null) => void
}) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState(currentName || '')
	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (currentId != null && (!currentName || currentName.trim() === '')) {
			const found = zones.find(z => z.id === currentId)
			if (found && found.name !== value) setValue(found.name)
			return
		}
		setValue(currentName || '')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentId, currentName, zones])

	useEffect(() => {
		const onDoc = (e: MouseEvent) => {
			if (!ref.current) return
			if (!ref.current.contains(e.target as Node)) setOpen(false)
		}
		const onEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false)
		}
		document.addEventListener('mousedown', onDoc)
		document.addEventListener('keydown', onEsc)
		return () => {
			document.removeEventListener('mousedown', onDoc)
			document.removeEventListener('keydown', onEsc)
		}
	}, [])

	const filtered = !value.trim()
		? zones
		: zones.filter(z => z.name.toLowerCase().includes(value.toLowerCase()))

	useEffect(() => {
		if (!value.trim()) return
		const exact = zones.find(z => z.name.toLowerCase() === value.toLowerCase())
		if (exact && exact.id !== currentId) {
			onSelect(exact)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, zones])

	const pick = (z: Zone) => {
		setValue(z.name)
		setOpen(false)
		onSelect(z)
	}
	const { t } = useTranslation('common')
	return (
		<InputShell
			ref={ref as any}
			data-open={open ? '1' : '0'}
		>
			<InputCore
				value={value}
				onChange={e => {
					setValue(e.target.value)
					setOpen(true)
				}}
				onFocus={() => setOpen(true)}
				onBlur={() => setTimeout(() => setOpen(false), 120)}
				placeholder={t('complete_contract.form.billing_zone')}
				autoComplete='off'
				aria-autocomplete='list'
				aria-expanded={open}
			/>
			<Chevron
				viewBox='0 0 24 24'
				aria-hidden
			>
				<path
					d='M6 9l6 6 6-6'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</Chevron>

			{open && (
				<Menu role='listbox'>
					{!loading &&
						filtered.map(z => (
							<MenuItem
								key={z.id}
								role='option'
								onMouseDown={e => e.preventDefault()}
								onClick={() => pick(z)}
							>
								<div className='title'>{z.name}</div>
								<div className='meta'>
									{!!z.markup_percent && (
										<span className='pill'>markup: {z.markup_percent}%</span>
									)}
								</div>
							</MenuItem>
						))}
				</Menu>
			)}
		</InputShell>
	)
}

/* ===================== styled ===================== */
const WrapperOrder = styled.div`
	position: relative;

	/* далі — внутрішні відступи: зліва — під текст, справа — під хрестик */
	padding: 0 28px 12px 8px;

	/* розділювальна полоска — частина шапки */
	border-bottom: 1px solid #ffffff26;

	/* щоб контент не вилітав за межі шапки */
	overflow: visible;

	@media (max-width: 764px) {
		padding-right: 36px;
	}
`

const Wrapper = styled.div`
	/* було тільки на мобілці — тепер завжди: */
	max-height: 85vh;
	overflow-y: auto;

	/* м'який скролбар */
	scrollbar-width: thin;
	scrollbar-color: #3a3a3a transparent;

	@media (max-width: 764px) {
		padding-top: 60px;
	}
`
const LeftHeader = styled.div`
	margin-left: 10px;
	display: flex;
	gap: 12px;
	align-items: flex-start;
`
const BackBtn = styled.button`
	height: 32px;
	width: 32px;
	border-radius: 8px;
	border: 1px solid #434343;
	color: #e5e7eb;
	background: #0d0d0d;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: all 0.15s;
	&:hover {
		background: #1a1a1a;
		border-color: #555;
	}
	&:active {
		transform: translateY(1px);
	}
`
const Thumb = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	background: #0d0c0c;
	width: 94px;
	height: 92px;
	img {
		display: block;
	}
`
const FieldTitle = styled.div`
	color: #ffffffde;
	font-size: 13px;
	font-weight: 700;
	letter-spacing: 0.2px;
	margin-bottom: 6px;
`
/* сегментований слайдер */
const SegmentGroup = styled.div`
	display: inline-flex;
	background: #0f0f0f;
	border: 1px solid #2f2f2f;
	border-radius: 10px;
	padding: 4px;
	gap: 4px;
	margin-bottom: 8px;
`
const SegmentBtn = styled.button`
	min-width: 120px;
	height: 32px;
	padding: 0 12px;
	border-radius: 8px;
	border: 1px solid transparent;
	background: transparent;
	color: #d1d5db;
	font-size: 13px;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.15s;

	&[aria-selected='true'],
	&[data-active='1'] {
		background: #1b1b1b;
		color: #fff;
		border-color: #3a3a3a;
		box-shadow: 0 0 0 1px #2b2b2b inset;
	}

	&:hover {
		background: #151515;
	}
`

const Input = styled.input`
	text-align: left;
	font-size: 16px;
	line-height: 18px;
	color: #fff;
	background: transparent;
	border: 1px solid #333;
	border-radius: 6px;
	padding: 0 10px;
	height: 36px;
	outline: none;
`
const Select = styled.select`
	text-align: left;
	font-size: 14px;
	color: #fff;
	background: #0d0d0d;
	border: 1px solid #333;
	border-radius: 6px;
	padding: 6px 10px;
	height: 36px;
	outline: none;
`
const Textarea = styled.textarea`
	font-size: 16px;
	line-height: 18px;
	color: #fff;
	background: transparent;
	border: 1px solid #333;
	border-radius: 6px;
	padding: 8px 10px;
	min-height: 70px;
	outline: none;
`
const IconWrapper = styled.div`
	@media (max-width: 764px) {
		gap: 10px;
	}
	display: flex;
	align-items: center;
`
const HeaderBtn = styled.button`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	height: 32px;
	padding: 0 12px;
	border-radius: 6px;
	border: 1px solid #333;
	color: #fff;
	background: #0f0f0f;
	cursor: pointer;
	font-size: 13px;
	font-weight: 600;
	transition: all 0.15s;
	&:hover {
		background: #1a1a1a;
		border-color: #444;
	}
	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	svg {
		display: block;
	}
`
const PrimaryBtn = styled.button`
	height: 32px;
	padding: 0 14px;
	border-radius: 6px;
	border: 1px solid #4bc785;
	color: #0b0b0b;
	background: #4bc785;
	cursor: pointer;
	font-size: 13px;
	font-weight: 700;
	transition: filter 0.15s;
	&:hover {
		filter: brightness(1.05);
	}
	&:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
`
const DeleteBtn = styled.button`
	height: 32px;
	padding: 0 12px;
	border-radius: 6px;
	border: 1px solid #ef4444;
	color: #fff;
	background: transparent;
	cursor: pointer;
	font-size: 13px;
	font-weight: 600;
	&:hover {
		background: #ef444433;
	}
	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`

/* select (статус) */
const SelectWrap = styled.div`
	position: relative;
	display: inline-block;
	margin-top: 6px;
`
const Trigger = styled.button`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	height: 36px;
	padding: 0 10px 0 8px;
	min-width: 210px;
	background: #101010;
	color: #fff;
	font-weight: 700;
	font-size: 14px;
	border: 1px solid #333;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.15s;
	.chev {
		margin-left: auto;
		color: #d1d5db;
	}
	.label {
		letter-spacing: 0.3px;
	}
`
const SmallBadge = styled.span`
	margin-left: 8px;
	font-size: 12px;
	opacity: 0.8;
`
const Menu = styled.ul`
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	z-index: 10;
	min-width: 220px;
	background: #0e0e0e;
	border: 1px solid #333;
	border-radius: 10px;
	box-shadow:
		0 12px 32px rgba(0, 0, 0, 0.45),
		0 0 0 1px #1f1f1f inset;
	padding: 6px;
	backdrop-filter: blur(6px);
`
const MenuItem = styled.li`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px 10px;
	border-radius: 8px;
	cursor: pointer;
	user-select: none;
	&:hover {
		background: #171717;
	}
	.text {
		color: #e5e7eb;
		font-weight: 600;
		font-size: 14px;
	}
`

/* інпут-лайк для зони */
const FieldLabel = styled.div`
	color: #fff;
	font-size: 14px;
	font-weight: 600;
	margin-bottom: 6px;
`
const InputShell = styled.div`
	position: relative;
	width: 100%;
`
const InputCore = styled.input`
	width: 100%;
	height: 36px;
	padding: 0 42px 0 10px;
	color: #fff;
	background: transparent;
	border: 1px solid #333;
	border-radius: 6px;
	outline: none;
	transition:
		border-color 0.15s,
		box-shadow 0.15s;

	&::placeholder {
		color: #777;
	}
`
const Chevron = styled.svg`
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	width: 18px;
	height: 18px;
	color: #d1d5db;
	pointer-events: none;
`
const MenuEmpty = styled.div`
	padding: 10px 12px;
	color: #9ca3af;
	font-size: 14px;
`
const ErrorText = styled.div`
	color: #ef4444;
	font-size: 12px;
`

/* read-only сітка та рядок */
const ReadonlyGrid = styled.div`
	display: grid;
	grid-template-columns: 220px 1fr;
	gap: 8px 18px;
	align-items: baseline;
	margin-top: 8px;

	@media (max-width: 620px) {
		grid-template-columns: 1fr;
	}
`
const Row = styled.div`
	grid-column: 1 / -1;
	display: grid;
	grid-template-columns: 220px 1fr;
	gap: 12px;

	.name {
		color: #ffffffa8;
		font-weight: 600;
		font-size: 13px;
	}
	.val {
		color: #ffffffde;
		font-weight: 400;
		font-size: 14px;
	}

	@media (max-width: 620px) {
		grid-template-columns: 1fr;
		.name {
			opacity: 0.9;
		}
	}
`
