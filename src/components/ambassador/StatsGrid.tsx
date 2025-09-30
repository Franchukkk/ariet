/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

// ваші хелпери авторизації
import { getAccessToken, logout, refreshToken } from '@/helpers/auth'

/* eslint-disable @typescript-eslint/no-explicit-any */

const API_BASE = 'https://rpktask.sytes.net/api'

/* -------------------- styled -------------------- */
const Card = styled.div`
	background: #1a1a1a;
	padding: 16px;
	margin-left: 20px;
	border-radius: 8px;
	color: #fff;
	display: flex;
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
type UserMe = {
	email?: string
	role?: string
	full_name?: string
	phone?: string
	promo_code?: string
	promocode_discount_percent?: string
	promocode_uses?: string
	promocode_max_uses?: string
	promocode_total_orders?: string
	instagram?: string
	youtube?: string
	tiktok?: string
	telegram?: string
	avatar?: string
}

/** fetch з токеном, auto-refresh при 401 */
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

/* -------------------- карточка -------------------- */
function StatsCard({
	value,
	label,
	percent = '—',
	chartData
}: {
	value: string
	label: string
	percent?: string
	chartData: number[]
}) {
	return (
		<Card>
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

/* -------------------- головний компонент -------------------- */
export default function DashboardBonusesOnly() {
	const { t } = useTranslation('common')

	const [user, setUser] = useState<UserMe | null>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		let mounted = true
		;(async () => {
			try {
				setLoading(true)
				const r = await fetchWithAuth(`${API_BASE}/users/me/`, {
					method: 'GET'
				})
				if (!r.ok) throw new Error(`HTTP ${r.status}`)
				const data: UserMe = await r.json()
				if (mounted) setUser(data)
			} catch (e) {
				console.error(e)
				if (mounted) setUser(null)
			} finally {
				if (mounted) setLoading(false)
			}
		})()
		return () => {
			mounted = false
		}
	}, [])

	// показуємо РЯДОК як є (fallback '0')
	const valueBonuses =
		(user?.promocode_total_orders ?? '').toString().trim() || '0'
	// опційно — прогрес використань (якщо бек дає)
	const uses = user?.promocode_uses ? Number(user.promocode_uses) : null
	const maxUses = user?.promocode_max_uses
		? Number(user.promocode_max_uses)
		: null
	const percentBonuses =
		uses != null && maxUses != null && maxUses > 0 ? `${uses}/${maxUses}` : '—'

	return (
		<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
			<StatsCard
				value={loading && user == null ? '…' : valueBonuses}
				label={t('ambassador.label.bonuses')}
				percent={percentBonuses}
				chartData={[20, 25, 30, 40]}
			/>
		</div>
	)
}
