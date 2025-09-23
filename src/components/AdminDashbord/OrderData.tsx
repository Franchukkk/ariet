'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ArrowDown from '@/assets/img/arrow-up.svg'
import edit from '@/assets/img/edit.png'
import Glass from '@/assets/img/glass.svg'

import { ModalCart } from './ModalCart'
import { OrderCard } from './OrderCard'

export type ApiStatus =
	| 'DRAFT'
	| 'CONFIRMED'
	| 'PAID'
	| 'SHIPPED'
	| 'DELIVERED'
	| 'CANCELLED'

type ServerStatus = ApiStatus
const toServer = (s: ApiStatus): ServerStatus => s

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

type StatusCounts = {
	delivered: number
	paid: number
	draft: number
	sent: number
}

const countStatuses = (rows: any[]): StatusCounts => {
	const c: StatusCounts = { delivered: 0, paid: 0, draft: 0, sent: 0 }
	rows.forEach(it => {
		const s = asApiStatus(it.status)
		if (s === 'DELIVERED') c.delivered++
		else if (s === 'PAID') c.paid++
		else if (s === 'SHIPPED') c.sent++
		else c.draft++
	})
	return c
}
const splitByStatuses = (rows: any[]) => {
	const b: Record<'delivered' | 'paid' | 'draft' | 'sent', any[]> = {
		delivered: [],
		paid: [],
		draft: [],
		sent: []
	}
	rows.forEach(it => {
		const s = asApiStatus(it.status)
		if (s === 'DELIVERED') b.delivered.push(it)
		else if (s === 'PAID') b.paid.push(it)
		else if (s === 'SHIPPED') b.sent.push(it)
		else b.draft.push(it)
	})
	return b
}

const API_BASE = 'https://rpktask.sytes.net/api'
const FLOW: ApiStatus[] = ['DRAFT', 'CONFIRMED', 'PAID', 'SHIPPED', 'DELIVERED']

export const OrderData = () => {
	const [orders, setOrders] = useState<any[]>([])
	const [counts, setCounts] = useState<StatusCounts>({
		delivered: 0,
		paid: 0,
		draft: 0,
		sent: 0
	})
	const [grouped, setGrouped] = useState<Record<string, any[]>>({
		delivered: [],
		paid: [],
		draft: [],
		sent: []
	})
	const [selectOrder, setSelectOrder] = useState<any | false>(false)
	const [searchValue, setSearchValue] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [refreshOrders, setRefreshOrders] = useState(false)
	const [nextStatus, setNextStatus] = useState<ApiStatus>('DRAFT')

	const [sortOpen, setSortOpen] = useState(false)
	const [sort, setSort] = useState<
		'none' | 'date_new' | 'date_old' | 'id_up' | 'id_down'
	>('none')
	const sortRef = useRef<HTMLDivElement>(null)

	const { t } = useTranslation('common')

	const token =
		typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
	const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

	const reload = () => setRefreshOrders(true)

	useEffect(() => {
		const load = async () => {
			setIsLoading(true)
			setRefreshOrders(false)
			try {
				const r = await fetch(`${API_BASE}/orders/`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json', ...authHeaders }
				})
				const data = await r.json().catch(() => [] as any)
				const list = Array.isArray(data) ? data : data?.results || []
				const normalized = (list || []).map((o: any) => ({
					...o,
					date: o.created_at ?? o.date
				}))
				setOrders(normalized)
			} catch {
				setOrders([])
			} finally {
				setIsLoading(false)
			}
		}
		load()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refreshOrders])

	useEffect(() => {
		const onDocClick = (e: MouseEvent) => {
			if (!sortRef.current) return
			if (!sortRef.current.contains(e.target as Node)) setSortOpen(false)
		}
		document.addEventListener('mousedown', onDocClick)
		return () => document.removeEventListener('mousedown', onDocClick)
	}, [])

	useEffect(() => {
		setCounts(countStatuses(orders))
		setGrouped(splitByStatuses(orders))
	}, [orders])

	useEffect(() => {
		if (!selectOrder) return
		const current = asApiStatus(selectOrder.status)
		const i = FLOW.indexOf(current)
		setNextStatus(i >= 0 && i < FLOW.length - 1 ? FLOW[i + 1] : current)
	}, [selectOrder])

	const readErrorMsg = async (r: Response, fallback: string) => {
		try {
			const json = await r.clone().json()
			const raw =
				json?.error ?? json?.detail ?? json?.message ?? json?.errors ?? json
			if (Array.isArray(raw)) return raw.join('\n')
			if (typeof raw === 'object') return JSON.stringify(raw)
			return (
				String(raw || fallback).replace(/^(\[|')+|(\]|')+$/g, '') || fallback
			)
		} catch {
			try {
				return (await r.text()) || fallback
			} catch {
				return fallback
			}
		}
	}

	const handleDeleteOrder = async () => {
		if (!selectOrder?.id) return
		if (!confirm(t('AdminDashboard.confirm_delete'))) return

		try {
			setIsLoading(true)
			const r = await fetch(`${API_BASE}/orders/${selectOrder.id}/cancel/`, {
				method: 'POST',
				headers: { ...authHeaders }
			})
			if (!r.ok) {
				const msg = await readErrorMsg(r, t('AdminDashboard.error_delete'))
				alert(msg)
				return
			}
			setSelectOrder(false)
			reload()
		} catch (e: any) {
			alert(e?.message || t('AdminDashboard.error_delete'))
		} finally {
			setIsLoading(false)
		}
	}

	const stepsFromTo = (from: ApiStatus, to: ApiStatus): ApiStatus[] => {
		if (to === from) return []
		if (to === 'CANCELLED') return []
		const iFrom = FLOW.indexOf(from)
		const iTo = FLOW.indexOf(to)
		if (iFrom === -1 || iTo === -1) return []

		if (iTo > iFrom) return FLOW.slice(iFrom + 1, iTo + 1)
		if (iTo < iFrom) return FLOW.slice(iTo, iFrom).reverse()
		return []
	}

	const handleChangeStatus = async () => {
		if (!selectOrder?.id) return
		const current = asApiStatus(selectOrder.status)
		const target = nextStatus

		// CANCELLED — окремо
		if (target === 'CANCELLED') {
			if (!confirm(t('AdminDashboard.confirm_delete'))) return
			try {
				setIsLoading(true)
				const r = await fetch(`${API_BASE}/orders/${selectOrder.id}/cancel/`, {
					method: 'POST',
					headers: { ...authHeaders }
				})
				if (!r.ok) {
					const msg = await readErrorMsg(r, t('AdminDashboard.error_delete'))
					alert(msg)
					return
				}
				reload()
			} catch (e: any) {
				alert(e?.message || t('AdminDashboard.error_delete'))
			} finally {
				setIsLoading(false)
			}
			return
		}

		const steps = stepsFromTo(current, target)
		if (!steps.length && target !== current) {
			alert(t('AdminDashboard.error_status'))
			return
		}

		try {
			setIsLoading(true)
			let last = current

			for (const step of steps) {
				const r = await fetch(`${API_BASE}/orders/${selectOrder.id}/update/`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json', ...authHeaders },
					body: JSON.stringify({ status: toServer(step) })
				})

				if (!r.ok) {
					if (step === 'SHIPPED' && (r.status === 403 || r.status === 405)) {
						const r2 = await fetch(
							`${API_BASE}/orders/${selectOrder.id}/ship/`,
							{
								method: 'POST',
								headers: { ...authHeaders }
							}
						)
						if (!r2.ok) {
							const msg = await readErrorMsg(
								r2,
								t('AdminDashboard.error_status')
							)
							alert(msg)
							break
						}
					} else {
						const msg = await readErrorMsg(r, t('AdminDashboard.error_status'))
						alert(msg)
						break
					}
				}

				last = step
				setOrders(prev =>
					prev.map(o => (o.id === selectOrder.id ? { ...o, status: step } : o))
				)
			}
			if (last === target) reload()
		} catch (e: any) {
			alert(e?.message || t('AdminDashboard.error_status'))
		} finally {
			setIsLoading(false)
		}
	}

	const applySort = (list: any[], key: typeof sort) => {
		const byTime = (o: any) => new Date(o.date || o.created_at || 0).getTime()
		const byId = (o: any) => Number(o.id) || 0
		const arr = [...list]
		switch (key) {
			case 'date_new':
				return arr.sort((a, b) => byTime(b) - byTime(a))
			case 'date_old':
				return arr.sort((a, b) => byTime(a) - byTime(b))
			case 'id_up':
				return arr.sort((a, b) => byId(a) - byId(b))
			case 'id_down':
				return arr.sort((a, b) => byId(b) - byId(a))
			default:
				return arr
		}
	}

	useEffect(() => {
		const base = searchValue
			? orders.filter(o => String(o.id).includes(searchValue))
			: orders
		const sorted = applySort(base, sort)
		setCounts(countStatuses(sorted))
		setGrouped(splitByStatuses(sorted))
	}, [orders, searchValue, sort])

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value
		setSearchValue(val)
	}

	const handlerCardClick = async (item: any, e: React.MouseEvent) => {
		setSelectOrder(item)

		const clickedIcon = e.target instanceof SVGElement
		if (clickedIcon) {
			try {
				const r = await fetch(`${API_BASE}/orders/${item.id}/`, {
					headers: { ...authHeaders }
				})
				const full = await r.json()
				setSelectOrder(prev =>
					prev && prev.id === item.id ? { ...prev, ...full } : full
				)
			} catch {}
			setIsOpen(true)
		}
	}

	const canCancelSelected = !!selectOrder?.id

	const sortLabel = (() => {
		if (sort === 'date_new') return t('AdminDashboard.sort_newest')
		if (sort === 'date_old') return t('AdminDashboard.sort_oldest')
		if (sort === 'id_up') return t('AdminDashboard.sort_id_up')
		if (sort === 'id_down') return t('AdminDashboard.sort_id_down')
		return t('AdminDashboard.sort_default')
	})()
	const chooseSort = (v: typeof sort) => {
		setSort(v)
		setSortOpen(false)
	}

	return (
		<div className='flex flex-col justify-between'>
			<Filters className='flex flex-row justify-between w-full gap-[10px] items-center mb-[30px]'>
				{/* ---- Сортування (дропдаун під кнопкою) ---- */}
				<div
					ref={sortRef}
					className='relative'
				>
					<button
						className='cursor-pointer flex items-center gap-[10px]'
						onClick={() => setSortOpen(v => !v)}
						aria-haspopup='listbox'
						aria-expanded={sortOpen}
					>
						<p>{t('AdminDashboard.sort')}</p>
						<ArrowDown className={sortOpen ? '' : 'rotate-180'} />
					</button>
					{sortOpen && (
						<ul
							role='listbox'
							className='absolute mt-[8px] z-[5] min-w-[180px] bg-[#0D0C0C] border border-[#333333] rounded-[8px] p-[6px]'
						>
							<li
								role='option'
								className='px-[10px] py-[8px] rounded-[6px] hover:bg-[#1f1f1f] cursor-pointer'
								onClick={() => chooseSort('none')}
							>
								{t('AdminDashboard.sort_default')}
							</li>
							<li
								role='option'
								className='px-[10px] py-[8px] rounded-[6px] hover:bg-[#1f1f1f] cursor-pointer'
								onClick={() => chooseSort('date_new')}
							>
								{t('AdminDashboard.sort_newest')}
							</li>
							<li
								role='option'
								className='px-[10px] py-[8px] rounded-[6px] hover:bg-[#1f1f1f] cursor-pointer'
								onClick={() => chooseSort('date_old')}
							>
								{t('AdminDashboard.sort_oldest')}
							</li>
							<li
								role='option'
								className='px-[10px] py-[8px] rounded-[6px] hover:bg-[#1f1f1f] cursor-pointer'
								onClick={() => chooseSort('id_up')}
							>
								{t('AdminDashboard.sort_id_up') || 'ID ↑'}
							</li>
							<li
								role='option'
								className='px-[10px] py-[8px] rounded-[6px] hover:bg-[#1f1f1f] cursor-pointer'
								onClick={() => chooseSort('id_down')}
							>
								{t('AdminDashboard.sort_id_down')}
							</li>
						</ul>
					)}
				</div>

				<Find className='flex-1 flex flex-row justify-center relative'>
					<label className='relative max-w-[540px] w-full flex-1'>
						<Glass className='absolute right-[20px] top-[50%] transform -translate-y-1/2' />
						<input
							className='border border-[#333333] rounded-[61px] pr-[22px] pl-[40px] max-w-[540px] w-full h-[50px] bg-[transparent] outline-none'
							type='text'
							placeholder={t('AdminDashboard.search')}
							value={searchValue}
							onChange={handleSearch}
						/>
					</label>
				</Find>

				<ResultFilter className='text-right text-center text-[#4BC785] font-[500] text-[15px]'>
					{sortLabel}
				</ResultFilter>
			</Filters>

			<div className='overflow-x-auto pt-[7px]'>
				<Lists className='w-[988px] inline-grid grid-cols-4 gap-[20px] mb-[30px]'>
					<div className='flex flex-col gap-[20px] w-[235px]'>
						<StatusWrapper
							className='flex flex-row justify-between items-center'
							$status='delivered'
						>
							<img
								className='absolute top-[-10px] left-[-5px]'
								src={edit.src}
								width={30}
								height={30}
								alt='edit'
							/>
							<p>{t('AdminDashboard.statuses.delivered')}</p>
							<CountStatus>{counts.delivered}</CountStatus>
						</StatusWrapper>
						<ul className='flex flex-col gap-[10px] overflow-y-auto max-h-[480px]'>
							{grouped.delivered?.map(item => (
								<OrderCard
									key={item.id}
									item={item}
									onClick={e => handlerCardClick(item, e)}
									select={selectOrder?.id}
								/>
							))}
						</ul>
					</div>

					<div className='flex flex-col gap-[20px] w-[235px]'>
						<StatusWrapper
							className='flex flex-row justify-between items-center'
							$status='paid'
						>
							<img
								className='absolute top-[-10px] left-[-5px]'
								src={edit.src}
								width={30}
								height={30}
								alt='edit'
							/>
							<p>{t('AdminDashboard.statuses.paid')}</p>
							<CountStatus>{counts.paid}</CountStatus>
						</StatusWrapper>
						<ul className='flex flex-col gap-[10px] overflow-y-auto max-h-[480px]'>
							{grouped.paid?.map(item => (
								<OrderCard
									key={item.id}
									item={item}
									onClick={e => handlerCardClick(item, e)}
									select={selectOrder?.id}
								/>
							))}
						</ul>
					</div>

					<div className='flex flex-col gap-[20px] w-[235px]'>
						<StatusWrapper
							className='flex flex-row justify-between items-center'
							$status='draft'
						>
							<img
								className='absolute top-[-10px] left-[-5px]'
								src={edit.src}
								width={30}
								height={30}
								alt='edit'
							/>
							<p>{t('AdminDashboard.statuses.draft')}</p>
							<CountStatus>{counts.draft}</CountStatus>
						</StatusWrapper>
						<ul className='flex flex-col gap-[10px] overflow-y-auto max-h-[480px]'>
							{grouped.draft?.map(item => (
								<OrderCard
									key={item.id}
									item={item}
									onClick={e => handlerCardClick(item, e)}
									select={selectOrder?.id}
								/>
							))}
						</ul>
					</div>

					<div className='flex flex-col gap-[20px] w-[235px]'>
						<StatusWrapper
							className='flex flex-row justify-between items-center'
							$status='sent'
						>
							<img
								className='absolute top-[-10px] left-[-5px]'
								src={edit.src}
								width={30}
								height={30}
								alt='edit'
							/>
							<p>{t('AdminDashboard.statuses.sent')}</p>
							<CountStatus>{counts.sent}</CountStatus>
						</StatusWrapper>
						<ul className='flex flex-col gap-[10px] overflow-y-auto max-h-[480px]'>
							{grouped.sent?.map(item => (
								<OrderCard
									key={item.id}
									item={item}
									onClick={e => handlerCardClick(item, e)}
									select={selectOrder?.id}
								/>
							))}
						</ul>
					</div>
				</Lists>
			</div>

			<BottomSet className='flex flex-row justify-end gap-[10px]'>
				<select
					value={nextStatus}
					onChange={e => setNextStatus(e.target.value as ApiStatus)}
					className='rounded-[10px] border border-[#333333] bg-transparent text-white px-3'
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

				<button
					onClick={handleChangeStatus}
					className='rounded-full w-[206px] h-[50px] bg-[#transparent] text-[#ffffff] font-[500] text-[15px] rounded-[10px] border border-[#1DCF94] cursor-pointer text-center'
					disabled={!selectOrder?.id || isLoading}
				>
					{t('AdminDashboard.change_status')}
				</button>

				<button
					onClick={handleDeleteOrder}
					className='rounded-full w-[206px] h-[50px] bg-[#transparent] text-[#ffffff] font-[500] text-[15px] rounded-[10px] border border-[#1DCF94] cursor-pointer text-center'
					disabled={!selectOrder?.id || isLoading || !canCancelSelected}
					title={!canCancelSelected ? undefined : undefined}
				>
					{t('AdminDashboard.delete')}
				</button>
			</BottomSet>

			{isOpen && !!selectOrder && (
				<ModalCart
					setIsOpen={setIsOpen}
					item={selectOrder as any}
					onUpdated={reload}
				/>
			)}
		</div>
	)
}

// styles
const Filters = styled.div`
	@media (max-width: 800px) {
		flex-direction: column;
	}
`
const Lists = styled.div``
const BottomSet = styled.div``
const Find = styled.div``
const ResultFilter = styled.p``

const StatusWrapper = styled.div<{ $status: string }>`
	font-size: 20px;
	font-weight: 600;
	position: relative;
	padding-left: 40px;
	border-radius: 10px;
	padding-top: 12px;
	padding-bottom: 12px;
	padding-right: 10px;
	background-color: ${({ $status }) =>
		$status === 'delivered'
			? '#4BC785'
			: $status === 'paid'
				? '#1DA1E3'
				: $status === 'draft'
					? '#686868'
					: '#D56909'};
`
const CountStatus = styled.p`
	font-size: 13px;
	line-height: 100%;
	font-weight: 400;
	color: #ffffff;
	width: 29px;
	height: 29px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 100%;
	background-color: #00000040;
	box-shadow: 0 4px 4px 0 #00000040 inset;
`
