'use client'

// ← додали
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useOrder } from '@/context/OrderContext'

type Zone = { id: number; name: string; code: string; markup_percent: string }

export function BillingZoneSelect({
	name,
	label
}: {
	name: string
	label: string
}) {
	const { t } = useTranslation('common')
	const { billingZone, setBillingZone } = useOrder() // ← контекст
	const [zones, setZones] = useState<Zone[]>([])
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [value, setValue] = useState('')

	// якщо зона вже вибрана — показати її в інпуті
	useEffect(() => {
		if (billingZone) setValue(billingZone.name)
	}, [billingZone])

	useEffect(() => {
		let alive = true
		const token =
			typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		}
		if (token) headers.Authorization = `Bearer ${token}`

		const load = async () => {
			setLoading(true)
			setError(null)
			const acc: Zone[] = []
			let page = 1
			const pageSize = 100
			try {
				while (true) {
					const r = await fetch(
						`https://rpktask.sytes.net/api/orders/billing-zones/?page=${page}&page_size=${pageSize}`,
						{ headers, cache: 'no-store' }
					)
					if (!r.ok) throw new Error(`HTTP ${r.status}`)
					const json = await r.json()
					const results: any[] = Array.isArray(json?.results)
						? json.results
						: []
					acc.push(
						...results.map(z => ({
							id: z?.id,
							name: String(z?.name ?? ''),
							code: String(z?.code ?? ''),
							markup_percent: String(z?.markup_percent ?? '')
						}))
					)
					if (!json?.next) break
					page++
				}
				if (alive) setZones(acc)
			} catch (e: any) {
				if (alive) setError(e?.message || 'Failed to load')
			} finally {
				if (alive) setLoading(false)
			}
		}
		load()
		return () => {
			alive = false
		}
	}, [])

	const filtered = useMemo(() => {
		if (!value.trim()) return zones
		const q = value.toLowerCase()
		return zones.filter(
			z => z.name.toLowerCase().includes(q) || z.code.toLowerCase().includes(q)
		)
	}, [zones, value])

	const picked = useMemo(
		() => zones.find(z => z.name === value || z.code === value),
		[zones, value]
	)

	const onPick = (z: Zone) => {
		setValue(z.name)
		setBillingZone(z) // ← запис у контекст
		setOpen(false)
	}

	return (
		<Field>
			<SrOnly
				as='label'
				htmlFor={name}
			>
				{label}
			</SrOnly>

			<InputShell data-open={open ? '1' : '0'}>
				<InputCore
					id={name}
					name={name}
					value={value}
					onChange={e => {
						setValue(e.target.value)
						setOpen(true)
					}}
					onFocus={() => setOpen(true)}
					onBlur={() => setTimeout(() => setOpen(false), 120)}
					placeholder={label}
					autoComplete='off'
					aria-autocomplete='list'
					aria-expanded={open}
					aria-controls={`${name}-menu`}
				/>

				{/* якщо вам треба відправити саме id у форму разом з ім'ям */}
				<input
					type='hidden'
					name={`${name}_id`}
					value={picked?.id ?? ''}
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
					<Menu
						id={`${name}-menu`}
						role='listbox'
					>
						{loading && <MenuEmpty>Loading…</MenuEmpty>}
						{!loading && filtered.length === 0 && (
							<MenuEmpty>{t('BillingZoneSelect.Nothing_found')}</MenuEmpty>
						)}
						{!loading &&
							filtered.map(z => (
								<MenuItem
									key={z.id}
									role='option'
									aria-selected={picked?.id === z.id}
									onMouseDown={e => e.preventDefault()}
									onClick={() => onPick(z)}
								>
									<div className='title'>{z.name}</div>
									<div className='meta'>
										<span className='pill'>markup: {z.markup_percent}%</span>
									</div>
								</MenuItem>
							))}
					</Menu>
				)}
			</InputShell>

			{error && <ErrorText>{error}</ErrorText>}
		</Field>
	)
}

/* стилі як у вас — без змін */

const Field = styled.div`
	display: flex;
	flex-direction: column;
`

const SrOnly = styled.span`
	position: absolute !important;
	height: 1px;
	width: 1px;
	overflow: hidden;
	clip: rect(1px, 1px, 1px, 1px);
	white-space: nowrap;
	border: 0;
	padding: 0;
	margin: -1px;
`

const InputShell = styled.div`
	position: relative;
	width: 100%;
`

const InputCore = styled.input`
	width: 100%;
	height: 50px;
	padding: 0 42px 0 16px;
	color: #ffffff;
	background: transparent;
	border: 1px solid #333333;
	border-radius: 8px;
	outline: none;
	transition:
		border-color 0.15s,
		box-shadow 0.15s;

	&:focus {
		border-color: #4bc785;
		box-shadow: 0 0 0 3px rgba(75, 199, 133, 0.25);
	}
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

const Menu = styled.ul`
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	right: 0;
	z-index: 20;
	background: #0e0e0e;
	border: 1px solid #333333;
	border-radius: 10px;
	box-shadow:
		0 12px 32px rgba(0, 0, 0, 0.45),
		0 0 0 1px #1f1f1f inset;
	padding: 6px;
	max-height: 260px;
	overflow-y: auto;
`

const MenuItem = styled.li`
	padding: 10px 12px;
	border-radius: 8px;
	cursor: pointer;
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 8px;
	align-items: center;

	&:hover {
		background: #171717;
	}

	.title {
		color: #fff;
		font-size: 14px;
		font-weight: 600;
	}
	.meta {
		display: flex;
		gap: 6px;
		.pill {
			font-size: 12px;
			color: #d1d5db;
			background: #0b0b0b;
			border: 1px solid #333;
			border-radius: 999px;
			padding: 2px 8px;
			white-space: nowrap;
		}
	}
`

const MenuEmpty = styled.div`
	padding: 10px 12px;
	color: #9ca3af;
	font-size: 14px;
`

const ErrorText = styled.div`
	margin-top: 6px;
	color: #ef4444;
	font-size: 12px;
`
