import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ICategory } from '../Content'

import { Card } from './Card/Card'

interface Props {
	activeFilters: string[]
	onChangeFilter: (filter: string) => void
	showFilters: boolean
	categories: ICategory[]
}

export const Filters = ({
	activeFilters,
	onChangeFilter,
	showFilters,
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
		},
		{
			title: t('filters.filter_1'),
			options: [
				{ title: t('filters.filter_1_option_1'), value: '21' },
				{ title: t('filters.filter_1_option_2'), value: '22' },
				{ title: t('filters.filter_1_option_3'), value: '23' },
				{ title: t('filters.filter_1_option_4'), value: '24' },
				{ title: t('filters.filter_1_option_5'), value: '25' }
			]
		},
		{
			title: t('filters.filter_2'),
			options: [
				{ title: t('filters.filter_2_option_1'), value: '31' },
				{ title: t('filters.filter_2_option_2'), value: '32' },
				{ title: t('filters.filter_2_option_3'), value: '33' },
				{ title: t('filters.filter_2_option_4'), value: '34' },
				{ title: t('filters.filter_2_option_5'), value: '35' }
			]
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
