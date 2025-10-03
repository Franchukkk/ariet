'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useCategories } from '@/hooks/useCategories'

export const Dropdown = ({ onSelect }: { onSelect?: () => void }) => {
	const { i18n } = useTranslation('common')
	const lng = useMemo<'ru' | 'en'>(() => {
		const raw = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		return raw === 'en' ? 'en' : 'ru'
	}, [i18n.language, i18n.resolvedLanguage])

	const { categories, loading, error } = useCategories({
		lng,
		pageSize: 99,
		debug: false
	})

	return (
		<StyledDropdown
			className='dropdown'
			onClick={e => e.stopPropagation()}
		>
			<div className='flex flex-col gap-3'>
				{loading && <span style={{ opacity: 0.7 }}>Завантаження…</span>}
				{error && <span style={{ color: '#f66' }}>Помилка: {error}</span>}
				{!loading && !error && categories.length === 0 && (
					<span style={{ opacity: 0.7 }}>Категорій немає</span>
				)}
				{!loading &&
					!error &&
					categories.map(cat => (
						<Link
							key={cat.id}
							href={{ pathname: '/products', query: { category: cat.id, lng } }}
							prefetch={false}
							onClick={onSelect}
						>
							{cat.name}
						</Link>
					))}
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

	a:hover {
		color: #4bc785;
	}
`
