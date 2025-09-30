'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

// ПІДКОРИГУЙ під свій проєкт:
import { getAccessToken, logout, refreshToken } from '@/helpers/auth'

const API_BASE = 'https://rpktask.sytes.net/api'

/* -------------------- styled -------------------- */
const Card = styled.div<{ $hidden?: boolean }>`
	background: #1a1a1a;
	padding: 16px;
	margin-left: 20px;
	border-radius: 8px;
	color: #fff;
	display: ${({ $hidden }) => ($hidden ? 'none' : 'flex')};
	justify-content: space-between;
	align-items: flex-end;
	flex: 1 1 280px;
	max-width: 282px;
	transition: all 0.2s ease;
	@media (max-width: 768px) {
		margin: 0 auto;
	}
`
const Info = styled.div`
	display: flex;
	flex-direction: column;
`
const Value = styled.div`
	margin-bottom: 6px;
	font-weight: 600;
	font-size: 40px;
	line-height: 100%;
	letter-spacing: 1%;
	@media (max-width: 768px) {
		font-size: 26px;
	}
`
const Label = styled.div`
	margin-bottom: 13px;
	max-width: 70px;
	max-height: 165px;
	font-weight: 600;
	font-size: 15px;
	line-height: 100%;
	letter-spacing: 1%;
	@media (max-width: 768px) {
		font-size: 13px;
	}
`
const Percent = styled.div`
	color: #d6d6d6;
	font-weight: 300;
	font-size: 15px;
	line-height: 100%;
	letter-spacing: 1%;
	@media (max-width: 768px) {
		font-size: 13px;
	}
`
const Chart = styled.div`
	display: flex;
	align-items: flex-end;
	gap: 4px;
`
const Bar = styled.div<{ height: number; shade: number }>`
	width: 6px;
	height: ${({ height }) => height}px;
	border-radius: 2px;
	background: ${({ shade }) => `rgba(75,199,133,${shade})`};
`

/* -------------------- types & utils -------------------- */
type StatsResponse = {
	total_orders: number
	total_sales_amount: string
	total_items_sold: number
	average_order_value: string
	orders_today: number
}

const normalizeStats = (raw: any): StatsResponse => ({
	total_orders: Number(raw?.total_orders ?? 0),
	total_sales_amount: String(raw?.total_sales_amount ?? '0'),
	total_items_sold: Number(raw?.total_items_sold ?? 0),
	average_order_value: String(raw?.average_order_value ?? '0'),
	orders_today: Number(raw?.orders_today ?? 0)
})

const nf = new Intl.NumberFormat('uk-UA')
const formatMoney = (v: string | number) => {
	const n = typeof v === 'string' ? Number(v) : v
	return nf.format(Number.isFinite(n) ? n : 0)
}

/** fetch з токеном, auto-refresh при 401, без нав’язаного Content-Type для GET */
const fetchWithAuth = async (url: string, init?: RequestInit) => {
	let token = getAccessToken()
	if (!token) {
		logout()
		throw new Error('No access token')
	}
	const headers: Record<string, string> = {
		...(init?.headers as Record<string, string> | undefined),
		Authorization: `Bearer ${token}`,
		Accept: 'application/json'
	}
	// Не насилуємо Content-Type для GET/без body
	if (init?.body || (init?.method && init.method !== 'GET')) {
		headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
	}

	const doFetch = (tk: string) =>
		fetch(url, {
			...init,
			headers: { ...headers, Authorization: `Bearer ${tk}` }
		})

	let res = await doFetch(token)
	if (res.status === 401) {
		const ok = await refreshToken()
		if (!ok) {
			logout()
			throw new Error('Unauthorized')
		}
		token = getAccessToken()!
		res = await doFetch(token)
	}
	return res
}

/* ---- фолбек: рахуємо статистику по власних замовленнях /orders/ ---- */
type OrderItem = { quantity: number; price?: string }
type Order = { created_at?: string; items?: OrderItem[] }

const parseNum = (v: any) => {
	const n = Number(v)
	return Number.isFinite(n) ? n : 0
}

const sumOrderAmount = (o: Order) =>
	(o.items ?? []).reduce(
		(acc, it) => acc + parseNum(it.price) * parseNum(it.quantity),
		0
	)

const isToday = (iso?: string) => {
	if (!iso) return false
	const d = new Date(iso)
	const now = new Date()
	return (
		d.getFullYear() === now.getFullYear() &&
		d.getMonth() === now.getMonth() &&
		d.getDate() === now.getDate()
	)
}

async function loadStatsFallback(): Promise<StatsResponse> {
	let nextUrl: string | null = `${API_BASE}/orders/?page=1&page_size=100`
	let totalOrders = 0
	let totalAmount = 0
	let totalItems = 0
	let ordersToday = 0

	while (nextUrl) {
		const res = await fetchWithAuth(nextUrl, { method: 'GET' })
		if (!res.ok) throw new Error(`Orders fetch failed: ${res.status}`)
		const json = await res.json()
		const results: Order[] = Array.isArray(json) ? json : (json?.results ?? [])
		for (const o of results) {
			totalOrders += 1
			totalAmount += sumOrderAmount(o)
			totalItems += (o.items ?? []).reduce(
				(a, it) => a + parseNum(it.quantity),
				0
			)
			if (isToday(o.created_at)) ordersToday += 1
		}
		nextUrl = json?.next ?? null
	}

	const avg = totalOrders ? totalAmount / totalOrders : 0
	return {
		total_orders: totalOrders,
		total_sales_amount: String(totalAmount),
		total_items_sold: totalItems,
		average_order_value: String(avg),
		orders_today: ordersToday
	}
}

/* -------------------- card -------------------- */
type StatsCardProps = {
	value: string
	label: string
	percent?: string
	chartData: number[]
	hidden?: boolean
}
function StatsCard({
	value,
	label,
	percent = '—',
	chartData,
	hidden
}: StatsCardProps) {
	return (
		<Card $hidden={hidden}>
			<Info>
				<Value>{value}</Value>
				<Label>{label}</Label>
				<Percent>{percent}</Percent>
			</Info>
			<Chart>
				{chartData.map((h, i) => (
					<Bar
						key={i}
						height={h}
						shade={0.5 + (i % 2) * 0.4}
					/>
				))}
			</Chart>
		</Card>
	)
}

/* -------------------- main component -------------------- */
export default function DashboardStats() {
	const { t } = useTranslation('common')
	const [stats, setStats] = useState<StatsResponse | null>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		let mounted = true
		const load = async () => {
			try {
				setLoading(true)
				// 1) основний endpoint
				const res = await fetchWithAuth(`${API_BASE}/orders/stats/`, {
					method: 'GET'
				})

				if (res.ok) {
					const json = await res.json()
					if (mounted) setStats(normalizeStats(json))
					return
				}

				// 2) якщо немає доступу — фолбек на /orders/ з підрахунком локально
				if (res.status === 403 || res.status === 404) {
					const fb = await loadStatsFallback()
					if (mounted) setStats(fb)
					return
				}

				// інші коди — кинемо помилку (побачимо її в консолі)
				throw new Error(`Failed: ${res.status}`)
			} catch (e) {
				console.error(e)
				// щоб інтерфейс не “порожнів” — ставимо нулі
				if (mounted)
					setStats({
						total_orders: 0,
						total_sales_amount: '0',
						total_items_sold: 0,
						average_order_value: '0',
						orders_today: 0
					})
			} finally {
				if (mounted) setLoading(false)
			}
		}
		load()
		return () => {
			mounted = false
		}
	}, [])

	const valueBonuses = String(stats?.orders_today ?? 0)
	const valueAmount = `${formatMoney(stats?.total_sales_amount ?? '0')} $`
	const valueOrders = String(stats?.total_orders ?? 0)

	return (
		<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
			<StatsCard
				value={loading && !stats ? '…' : valueBonuses}
				label={t('ambassador.label.bonuses')}
				percent='—'
				chartData={[20, 25, 30, 40]}
			/>
			<StatsCard
				value={loading && !stats ? '…' : valueAmount}
				label={t('ambassador.label.amount')}
				percent='—'
				chartData={[15, 20, 18, 45]}
				hidden
			/>
			<StatsCard
				value={loading && !stats ? '…' : valueOrders}
				label={t('ambassador.label.orders')}
				percent='—'
				chartData={[10, 15, 20, 35]}
				hidden
			/>
		</div>
	)
}
