'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ICategory } from '../Content'

import { Card } from './Card/Card'

interface Props {
	activeFilters: string[]
	onChangeFilter: (filter: string) => void
	showFilters: boolean
	onToggleShowFilters: () => void
	categories: ICategory[]
}

export const Filters = ({
	activeFilters,
	onChangeFilter,
	showFilters,
	onToggleShowFilters,
	categories
}: Props) => {
	const { t } = useTranslation('common')

	const FILTERS = [
		{
			title: t('filters.category'),
			options: categories.map(category => ({
				title: category.name,
				value: category.id.toString()
			}))
		}
	]

	return (
		<StyledFilters
			className={`flex flex-col gap-[20px] ${showFilters && 'showFilters'}`}
		>
			{FILTERS.map((filter, idx) => (
				<Card
					key={idx}
					title={filter.title}
					options={filter.options}
					activeFilters={activeFilters}
					onChangeFilter={onChangeFilter}
				/>
			))}
		</StyledFilters>
	)
}

const StyledFilters = styled.div`
	@media (max-width: 1200px) {
		display: none;
		&.showFilters {
			display: flex;
		}
	}
`
