'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Background } from '@/components/About/Hero/Background'
import { PublicRoute } from '@/components/PublicRoute/PublicRoute'
import { ThanksForOrder } from '@/components/thanks-for-order/thanks-for-order'

const API_BASE = 'https://test.arietpower.com/api'

export const ClientComponent = ({
	initialOrderParam
}: {
	initialOrderParam: string
}) => {
	const [orderNumber, setOrderNumber] = useState<string>('—') // це має бути CODE
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const run = async () => {
			const raw = (initialOrderParam || '').trim()
			if (!raw) {
				setOrderNumber('—')
				setLoading(false)
				return
			}

			// якщо прийшов уже code — просто показуємо його
			if (!/^\d+$/.test(raw)) {
				setOrderNumber(raw)
				setLoading(false)
				return
			}

			// прийшов id → тягнемо code з API (потрібен токен)
			try {
				const token =
					typeof window !== 'undefined'
						? localStorage.getItem('accessToken')
						: null
				const r = await fetch(`${API_BASE}/orders/${raw}/`, {
					cache: 'no-store',
					headers: {
						Accept: 'application/json',
						...(token ? { Authorization: `Bearer ${token}` } : {})
					}
				})
				if (!r.ok) throw new Error(`HTTP ${r.status}`)
				const json = await r.json()
				const code = String(json?.code || '').trim()
				setOrderNumber(code || '—')
			} catch (e) {
				// якщо не залогінений/нема доступу — покаже '—'
				setOrderNumber('—')
			} finally {
				setLoading(false)
			}
		}
		run()
	}, [initialOrderParam])

	return (
		<PublicRoute>
			<WrapperThanksForOrder className='main-wrapper text-center pt-[75px] pb-[400px]'>
				<ThanksForOrder orderNumber={loading ? '…' : orderNumber} />
				<CanvasBlock>
					<Background />
				</CanvasBlock>
			</WrapperThanksForOrder>
		</PublicRoute>
	)
}

const WrapperThanksForOrder = styled.div`
	position: relative;
	overflow: hidden;
	@media (max-width: 1000px) {
		padding: 100px 0;
	}
`
const CanvasBlock = styled.div`
	transform: rotate(-78deg);
	position: absolute;
	top: 180px;
	right: -837px;
	width: 160vw;
	height: 79vh;
	overflow: hidden;
	z-index: -1;
	& > div {
		opacity: 0.3;
	}
	@media (max-width: 1000px) {
		right: -150px;
	}
`
