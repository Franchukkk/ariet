'use client'

import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable
} from '@hello-pangea/dnd'
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
	Скасовано: 'CANCELLED',
	Видалено: 'CANCELLED',
	Deleted: 'CANCELLED'
}
const asApiStatus = (s: any): ApiStatus =>
	(UI_TO_API_STATUS[s] || String(s || 'DRAFT').toUpperCase()) as ApiStatus

// колонки → статус (додали deleted)
const COL_TO_STATUS = {
	draft: 'DRAFT',
	confirmed: 'CONFIRMED',
	paid: 'PAID',
	sent: 'SHIPPED',
	deleted: 'CANCELLED'
} as const
type ColumnId = keyof typeof COL_TO_STATUS

type StatusCounts = {
	draft: number
	confirmed: number
	paid: number
	sent: number
	deleted: number
}

const countStatuses = (rows: any[]): StatusCounts => {
	const c: StatusCounts = {
		draft: 0,
		confirmed: 0,
		paid: 0,
		sent: 0,
		deleted: 0
	}
	rows.forEach(it => {
		const s = asApiStatus(it.status)
		if (s === 'CONFIRMED') c.confirmed++
		else if (s === 'PAID') c.paid++
		else if (s === 'SHIPPED') c.sent++
		else if (s === 'CANCELLED') c.deleted++
		else c.draft++
	})
	return c
}

const splitByStatuses = (rows: any[]) => {
	const b: Record<ColumnId, any[]> = {
		draft: [],
		confirmed: [],
		paid: [],
		sent: [],
		deleted: []
	}
	rows.forEach(it => {
		const s = asApiStatus(it.status)
		if (s === 'CONFIRMED') b.confirmed.push(it)
		else if (s === 'PAID') b.paid.push(it)
		else if (s === 'SHIPPED') b.sent.push(it)
		else if (s === 'CANCELLED') b.deleted.push(it)
		else b.draft.push(it)
	})
	return b
}

const API_BASE = 'https://rpktask.sytes.net/api'

export const OrderData = () => {
	const [orders, setOrders] = useState<any[]>([])
	const [counts, setCounts] = useState<StatusCounts>({
		draft: 0,
		confirmed: 0,
		paid: 0,
		sent: 0,
		deleted: 0
	})
	const [grouped, setGrouped] = useState<Record<ColumnId, any[]>>({
		draft: [],
		confirmed: [],
		paid: [],
		sent: [],
		deleted: []
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
	const { t, i18n } = useTranslation('common')

	const token =
		typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
	const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

	const reload = () => setRefreshOrders(true)

	// load orders
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
				setGrouped(splitByStatuses(normalized))
				setCounts(countStatuses(normalized))
			} catch {
				setOrders([])
				setGrouped({
					draft: [],
					confirmed: [],
					paid: [],
					sent: [],
					deleted: []
				})
				setCounts({ draft: 0, confirmed: 0, paid: 0, sent: 0, deleted: 0 })
			} finally {
				setIsLoading(false)
			}
		}
		load()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refreshOrders])

	// закриття сорту по кліку поза
	useEffect(() => {
		const onDocClick = (e: MouseEvent) => {
			if (!sortRef.current) return
			if (!sortRef.current.contains(e.target as Node)) setSortOpen(false)
		}
		document.addEventListener('mousedown', onDocClick)
		return () => document.removeEventListener('mousedown', onDocClick)
	}, [])

	// nextStatus
	useEffect(() => {
		if (!selectOrder) return
		const current = asApiStatus(selectOrder.status)
		const flow: ApiStatus[] = [
			'DRAFT',
			'CONFIRMED',
			'PAID',
			'SHIPPED',
			'DELIVERED',
			'CANCELLED'
		]
		const i = flow.indexOf(current)
		setNextStatus(i >= 0 && i < flow.length - 1 ? flow[i + 1] : current)
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
		setGrouped(splitByStatuses(sorted))
		setCounts(countStatuses(sorted))
	}, [orders, searchValue, sort])

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
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

	// --------- DnD persistence ----------
	const persistStatus = async (orderId: number, newStatus: ApiStatus) => {
		// спец. endpoint лише для SHIPPED; інші — PATCH update/
		if (newStatus === 'SHIPPED') {
			const r2 = await fetch(`${API_BASE}/orders/${orderId}/ship/`, {
				method: 'POST',
				headers: { ...authHeaders }
			})
			if (r2.ok) return
			// fallback до PATCH нижче
		}
		const r = await fetch(`${API_BASE}/orders/${orderId}/update/`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json', ...authHeaders },
			body: JSON.stringify({ status: toServer(newStatus) })
		})
		if (!r.ok) throw new Error(await readErrorMsg(r, 'Failed to update'))
	}

	const onDragEnd = async (result: DropResult) => {
		const { destination, source, draggableId } = result
		if (!destination) return

		const fromCol = source.droppableId as ColumnId
		const toCol = destination.droppableId as ColumnId
		if (fromCol === toCol && source.index === destination.index) return

		const id = Number(draggableId)

		// 1) поточні колонки
		const current = splitByStatuses(orders)
		const srcList = [...current[fromCol]]
		const dstList = fromCol === toCol ? srcList : [...current[toCol]]

		const [moved] = srcList.splice(source.index, 1)
		if (!moved) return

		if (fromCol !== toCol) moved.status = COL_TO_STATUS[toCol]
		dstList.splice(destination.index, 0, moved)

		const updatedGrouped = { ...current, [fromCol]: srcList, [toCol]: dstList }

		// 2) оновити загальний список (інші замовлення теж зберігаємо)
		const keptIds = new Set<number>([
			...updatedGrouped.draft.map(i => i.id),
			...updatedGrouped.confirmed.map(i => i.id),
			...updatedGrouped.paid.map(i => i.id),
			...updatedGrouped.sent.map(i => i.id),
			...updatedGrouped.deleted.map(i => i.id)
		])
		const others = orders.filter(o => !keptIds.has(o.id))
		const updatedOrders = [
			...updatedGrouped.draft,
			...updatedGrouped.confirmed,
			...updatedGrouped.paid,
			...updatedGrouped.sent,
			...updatedGrouped.deleted,
			...others
		]

		// 3) оптимістичний UI
		const prevOrders = orders
		const prevGrouped = grouped
		setGrouped(updatedGrouped)
		setCounts(countStatuses(updatedOrders))
		setOrders(updatedOrders)

		// 4) збереження статусу на беку (лише якщо змінилась колонка)
		if (fromCol !== toCol) {
			try {
				await persistStatus(id, COL_TO_STATUS[toCol] as ApiStatus)
			} catch (e: any) {
				// відкотити
				setOrders(prevOrders)
				setGrouped(prevGrouped)
				setCounts(countStatuses(prevOrders))
				alert(e?.message || 'Failed to move order')
			}
		}
	}

	return (
		<div className='flex flex-col justify-between'>
			<Filters className='flex flex-row justify-between w-full gap-[10px] items-center mb-[30px]'>
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
							className='absolute mt-[8px] z-[5] min-w-[180px] w-max bg-[#0D0C0C] border border-[#333333] rounded-[8px] p-[8px]'
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
			</Filters>

			<DragDropContext onDragEnd={onDragEnd}>
				<div className='pt-[7px] overflow-x-hidden'>
					<Lists className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[20px] w-full mb-[30px]'>
						{/* DELETED (CANCELLED) */}
						<Column
							title={t('AdminDashboard.statuses.deleted') ?? 'Deleted'}
							count={counts.deleted}
							color='deleted'
						>
							<Droppable
								droppableId='deleted'
								direction='vertical'
							>
								{(provided, snapshot) => (
									<DropArea
										ref={provided.innerRef}
										{...provided.droppableProps}
										$isOver={snapshot.isDraggingOver}
										$isEmpty={!grouped.deleted?.length}
									>
										{grouped.deleted?.length === 0 && (
											<EmptyHint>
												{t('AdminDashboard.drop_here') || 'Drop here'}
											</EmptyHint>
										)}
										{grouped.deleted?.map((item, index) => (
											<Draggable
												key={String(item.id)}
												draggableId={String(item.id)}
												index={index}
											>
												{dragProvided => (
													<div
														ref={dragProvided.innerRef}
														{...dragProvided.draggableProps}
														{...dragProvided.dragHandleProps}
														onClick={e => handlerCardClick(item, e)}
													>
														<OrderCard
															item={item}
															select={selectOrder?.id}
														/>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</DropArea>
								)}
							</Droppable>
						</Column>
						{/* DRAFT */}
						<Column
							title={t('AdminDashboard.statuses.draft')}
							count={counts.draft}
							color='draft'
						>
							<Droppable
								droppableId='draft'
								direction='vertical'
							>
								{(provided, snapshot) => (
									<DropArea
										ref={provided.innerRef}
										{...provided.droppableProps}
										$isOver={snapshot.isDraggingOver}
										$isEmpty={!grouped.draft?.length}
									>
										{grouped.draft?.length === 0 && (
											<EmptyHint>
												{t('AdminDashboard.drop_here') || 'Drop here'}
											</EmptyHint>
										)}
										{grouped.draft?.map((item, index) => (
											<Draggable
												key={String(item.id)}
												draggableId={String(item.id)}
												index={index}
											>
												{dragProvided => (
													<div
														ref={dragProvided.innerRef}
														{...dragProvided.draggableProps}
														{...dragProvided.dragHandleProps}
														onClick={e => handlerCardClick(item, e)}
													>
														<OrderCard
															item={item}
															select={selectOrder?.id}
														/>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</DropArea>
								)}
							</Droppable>
						</Column>

						{/* CONFIRMED */}
						<Column
							title={t('AdminDashboard.statuses.confirmed') ?? 'Confirmed'}
							count={counts.confirmed}
							color='confirmed'
						>
							<Droppable
								droppableId='confirmed'
								direction='vertical'
							>
								{(provided, snapshot) => (
									<DropArea
										ref={provided.innerRef}
										{...provided.droppableProps}
										$isOver={snapshot.isDraggingOver}
										$isEmpty={!grouped.confirmed?.length}
									>
										{grouped.confirmed?.length === 0 && (
											<EmptyHint>
												{t('AdminDashboard.drop_here') || 'Drop here'}
											</EmptyHint>
										)}
										{grouped.confirmed?.map((item, index) => (
											<Draggable
												key={String(item.id)}
												draggableId={String(item.id)}
												index={index}
											>
												{dragProvided => (
													<div
														ref={dragProvided.innerRef}
														{...dragProvided.draggableProps}
														{...dragProvided.dragHandleProps}
														onClick={e => handlerCardClick(item, e)}
													>
														<OrderCard
															item={item}
															select={selectOrder?.id}
														/>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</DropArea>
								)}
							</Droppable>
						</Column>

						{/* PAID */}
						<Column
							title={t('AdminDashboard.statuses.paid')}
							count={counts.paid}
							color='paid'
						>
							<Droppable
								droppableId='paid'
								direction='vertical'
							>
								{(provided, snapshot) => (
									<DropArea
										ref={provided.innerRef}
										{...provided.droppableProps}
										$isOver={snapshot.isDraggingOver}
										$isEmpty={!grouped.paid?.length}
									>
										{grouped.paid?.length === 0 && (
											<EmptyHint>
												{t('AdminDashboard.drop_here') || 'Drop here'}
											</EmptyHint>
										)}
										{grouped.paid?.map((item, index) => (
											<Draggable
												key={String(item.id)}
												draggableId={String(item.id)}
												index={index}
											>
												{dragProvided => (
													<div
														ref={dragProvided.innerRef}
														{...dragProvided.draggableProps}
														{...dragProvided.dragHandleProps}
														onClick={e => handlerCardClick(item, e)}
													>
														<OrderCard
															item={item}
															select={selectOrder?.id}
														/>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</DropArea>
								)}
							</Droppable>
						</Column>

						{/* SENT (SHIPPED) */}
						<Column
							title={t('AdminDashboard.statuses.sent')}
							count={counts.sent}
							color='sent'
						>
							<Droppable
								droppableId='sent'
								direction='vertical'
							>
								{(provided, snapshot) => (
									<DropArea
										ref={provided.innerRef}
										{...provided.droppableProps}
										$isOver={snapshot.isDraggingOver}
										$isEmpty={!grouped.sent?.length}
									>
										{grouped.sent?.length === 0 && (
											<EmptyHint>
												{t('AdminDashboard.drop_here') || 'Drop here'}
											</EmptyHint>
										)}
										{grouped.sent?.map((item, index) => (
											<Draggable
												key={String(item.id)}
												draggableId={String(item.id)}
												index={index}
											>
												{dragProvided => (
													<div
														ref={dragProvided.innerRef}
														{...dragProvided.draggableProps}
														{...dragProvided.dragHandleProps}
														onClick={e => handlerCardClick(item, e)}
													>
														<OrderCard
															item={item}
															select={selectOrder?.id}
														/>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</DropArea>
								)}
							</Droppable>
						</Column>
					</Lists>
				</div>
			</DragDropContext>

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

/* допоміжні */

const Column = ({
	title,
	count,
	color,
	children
}: {
	title: React.ReactNode
	count: number
	color: 'draft' | 'confirmed' | 'paid' | 'sent' | 'deleted'
	children: React.ReactNode
}) => (
	<div className='flex flex-col gap-[20px] w-[235px]'>
		<StatusWrapper
			className='flex flex-row justify-between items-center'
			$status={color}
		>
			<img
				className='absolute top-[-10px] left-[-5px]'
				src={edit.src}
				width={30}
				height={30}
				alt='edit'
			/>
			<p>{title}</p>
			<CountStatus>{count}</CountStatus>
		</StatusWrapper>
		{children}
	</div>
)

const Filters = styled.div`
	@media (max-width: 800px) {
		flex-direction: column;
	}
`
const Lists = styled.div``
const BottomSet = styled.div``
const Find = styled.div``
const ResultFilter = styled.p``

const StatusWrapper = styled.div<{
	$status: 'draft' | 'confirmed' | 'paid' | 'sent' | 'deleted'
}>`
	font-size: 20px;
	font-weight: 600;
	position: relative;
	padding-left: 40px;
	border-radius: 10px;
	padding-top: 12px;
	padding-bottom: 12px;
	padding-right: 10px;
	background-color: ${
		({ $status }) =>
			$status === 'draft'
				? '#686868'
				: $status === 'confirmed'
					? '#1DA1E3'
					: $status === 'paid'
						? '#1DA1E3'
						: $status === 'sent'
							? '#D56909'
							: '#B63A3A' /* deleted */
	};
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

// зона скидання має мінімальну висоту, щоб приймати дроп навіть коли порожня
const DropArea = styled.ul<{ $isOver?: boolean; $isEmpty?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 10px;
	overflow-y: auto;
	max-height: 480px;

	/* ключове: */
	min-height: 120px;
	padding: 8px;
	border: 1px dashed ${({ $isOver }) => ($isOver ? '#4BC785' : '#333')};
	border-radius: 8px;
	background: ${({ $isOver }) => ($isOver ? '#1b1b1b' : 'transparent')};
`

const EmptyHint = styled.div`
	pointer-events: none;
	color: #7f7f7f;
	font-size: 13px;
	text-align: center;
	padding: 8px 0;
`
