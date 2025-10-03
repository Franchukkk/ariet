'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const formatPrice = (n: number | string) => {
	const v = typeof n === 'number' ? n : Number(n || 0)
	return Number.isFinite(v) ? v.toLocaleString('en-US').replace(/,/g, ' ') : '0'
}

const getAccessToken = (): string | null =>
	typeof localStorage !== 'undefined'
		? localStorage.getItem('accessToken')
		: null

const getRefreshToken = (): string | null =>
	typeof localStorage !== 'undefined'
		? localStorage.getItem('refreshToken')
		: null

const saveAccessToken = (token: string) => {
	if (typeof localStorage !== 'undefined')
		localStorage.setItem('accessToken', token)
}

const clearTokens = () => {
	if (typeof localStorage !== 'undefined') {
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
	}
}

const logout = () => {
	clearTokens()
	if (typeof window !== 'undefined') window.location.href = '/login'
}

const API_BASE = (
	process.env.NEXT_PUBLIC_API_BASE || 'https://test.arietpower.com'
).replace(/\/+$/, '')

const refreshToken = async (): Promise<boolean> => {
	const refresh = getRefreshToken()
	if (!refresh) return false
	try {
		const res = await fetch(`${API_BASE}/api/token/refresh/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({ refresh })
		})
		if (!res.ok) {
			clearTokens()
			return false
		}
		const data = await res.json()
		if (data?.access) {
			saveAccessToken(data.access)
			return true
		}
		clearTokens()
		return false
	} catch {
		clearTokens()
		return false
	}
}

/** fetch з Bearer; при 401 — рефреш і повтор */
const fetchWithAuth = async (input: RequestInfo | URL, init?: RequestInit) => {
	const token = getAccessToken()
	const withAuth = (t?: string): RequestInit => ({
		...init,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(init?.headers as Record<string, string>),
			...(t ? { Authorization: `Bearer ${t}` } : {})
		}
	})
	let res = await fetch(input, withAuth(token || undefined))
	if (res.status !== 401) return res
	const ok = await refreshToken()
	if (!ok) return res
	const fresh = getAccessToken()
	res = await fetch(input, withAuth(fresh || undefined))
	return res
}

/* ================= types ================= */
type StatsResponse = {
	total_orders: number
	total_sales_amount: string | number
	total_items_sold: number
	average_order_value: string | number
	orders_today: number
}

/* ================= component ================= */
const REFRESH_MS = 30_000 // інтервал автооновлення (30с)

export const OrderInfo = () => {
	const { t, i18n } = useTranslation('common')
	const [stats, setStats] = useState<StatsResponse | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const ctrlRef = useRef<AbortController | null>(null)

	const fetchStats = async () => {
		// скасовуємо попередній запит, якщо ще в дорозі
		ctrlRef.current?.abort()
		const ctrl = new AbortController()
		ctrlRef.current = ctrl

		try {
			if (!stats) setLoading(true)
			setError(null)

			if (!getAccessToken() && getRefreshToken()) {
				await refreshToken()
			}

			const res = await fetchWithAuth(`${API_BASE}/api/orders/stats/`, {
				cache: 'no-store',
				signal: ctrl.signal
			})

			if (res.status === 401) {
				logout()
				return
			}
			if (!res.ok) throw new Error(`HTTP ${res.status}`)

			const data = (await res.json()) as StatsResponse
			setStats(data)
		} catch (e: any) {
			if (e?.name !== 'AbortError')
				setError(e?.message ?? 'Failed to load stats')
		} finally {
			setLoading(false)
		}
	}

	// перший запит + автооновлення
	useEffect(() => {
		fetchStats()

		const start = () => {
			if (timerRef.current) return
			timerRef.current = setInterval(() => {
				// оновлюємо лише коли вкладка активна
				if (
					typeof document === 'undefined' ||
					document.visibilityState === 'visible'
				) {
					fetchStats()
				}
			}, REFRESH_MS)
		}

		const stop = () => {
			if (timerRef.current) {
				clearInterval(timerRef.current)
				timerRef.current = null
			}
		}

		start()
		const onVisibility = () => {
			if (document.visibilityState === 'visible') {
				fetchStats() // моментальне оновлення при поверненні
				start()
			} else {
				stop()
			}
		}
		document.addEventListener('visibilitychange', onVisibility)

		return () => {
			stop()
			document.removeEventListener('visibilitychange', onVisibility)
			ctrlRef.current?.abort()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const todayLabel = useMemo(() => {
		try {
			return new Date().toLocaleDateString(i18n.language || undefined, {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			})
		} catch {
			return new Date().toLocaleDateString()
		}
	}, [i18n.language])

	const toNumber = (v: string | number | undefined) =>
		typeof v === 'number' ? v : v ? Number(v) : 0

	return (
		<Wrapper className='flex flex-row justify-between gap-[20px] mb-[30px] items-center'>
			<div className='grid grid-cols-4 gap-[14px]'>
				<InfoCard>
					<ResultInfo>
						{loading ? '—' : formatPrice(stats?.total_orders ?? 0)}
					</ResultInfo>
					<p>
						{t('AdminDashboard.orders_count')}
						{todayLabel ? ` ${todayLabel}` : ''}
					</p>
				</InfoCard>

				<InfoCard>
					<ResultInfo>
						{loading
							? '—'
							: `${formatPrice(toNumber(stats?.total_sales_amount))} ${t('AdminDashboard.currency')}`}
					</ResultInfo>
					<p>{t('AdminDashboard.sold_sum')}</p>
				</InfoCard>

				<InfoCard>
					<ResultInfo>
						{loading
							? '—'
							: `${formatPrice(toNumber(stats?.average_order_value))} ${t('AdminDashboard.currency')}`}
					</ResultInfo>
					<p>{t('AdminDashboard.avr_order_price')}</p>
				</InfoCard>

				<InfoCard>
					<ResultInfo>
						{loading ? '—' : formatPrice(stats?.orders_today ?? 0)}
					</ResultInfo>
					<p>{t('AdminDashboard.orders_today')}</p>
				</InfoCard>
			</div>
		</Wrapper>
	)
}

/* ================= styles ================= */
const Wrapper = styled.div`
	@media (max-width: 1240px) {
		align-items: center;
		flex-direction: column;
		gap: 20px;
	}

	> div {
		@media (max-width: 1100px) {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 20px;
		}
		@media (max-width: 768px) {
			grid-template-columns: 1fr;
		}
	}
`

const ResultInfo = styled.p`
	font-size: 25px;
	line-height: 25px;
	letter-spacing: 1%;
	font-weight: 600;
	margin-bottom: 10px;
`

const InfoCard = styled.div`
	background-color: #191717;
	border-radius: 8px;
	padding: 14px 10px;

	> p:last-child {
		font-size: 12px;
		line-height: 16px;
		font-weight: 300;
	}
`
