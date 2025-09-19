'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Category {
	id: number
	name: string
}

export const Dropdown = () => {
	const { t } = useTranslation('common')
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadCategories = async () => {
			try {
				const res = await fetch(
					'https://rpktask.sytes.net/api/catalog/categories/',
					{
						method: 'GET',
						credentials: 'include',
						headers: { 'Content-Type': 'application/json' }
					}
				)

				if (!res.ok) throw new Error(`HTTP ${res.status}`)

				const responseData = await res.json()
				const data = responseData.results || []
				setCategories(data)
			} catch (err) {
				console.error('Fetch error:', err)
				setError('Failed to load')
			} finally {
				setLoading(false)
			}
		}

		loadCategories()
	}, [])

	return (
		<StyledDropdown className='dropdown'>
			<div>
				<div className='group-title'>{t('catalog.commercial')}</div>
				<div className='flex flex-col gap-3'>
					{loading && <p>Loading...</p>}
					{error && <p style={{ color: 'red' }}>{error}</p>}
					{!loading &&
						categories.map(cat => (
							<Link
								key={cat.id}
								href={{ pathname: '/products', query: { category: cat.id } }}
							>
								{cat.name}
							</Link>
						))}
				</div>
			</div>
		</StyledDropdown>
	)
}

const StyledDropdown = styled.div`
	position: absolute;
	top: calc(100% + 2px);
	width: 400px;
	background: #000000;
	left: 0;
	padding: 20px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24px;
	font-weight: 400;
	font-size: 14px;
	line-height: 100%;
	color: #f2f2f2;
	text-align: left;
	opacity: 0;
	visibility: hidden;
	transition: all 0.3s;
	z-index: 100;

	.group-title {
		margin-bottom: 10px;
		font-size: 12px;
		color: #ffffff70;
	}

	a:hover {
		color: #4bc785;
	}
`
