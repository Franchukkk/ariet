import styled from 'styled-components'

import { ICategory } from '../../Content'

import { CleanButton } from './CleanButton'
import { Tags } from './Tags/Tags'
import { ToggleButton } from './ToggleButton'

interface Props {
	activeFilters: string[]
	onChangeFilter: (filter: string, isReset?: boolean) => void
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
}: Props) => (
	<StyledFilters className='flex items-center justify-between gap-3 flex-wrap'>
		<Tags
			activeFilters={activeFilters}
			onChangeFilter={onChangeFilter}
			categories={categories}
		/>
		<div className='flex flex-wrap items-center gap-2'>
			<ToggleButton
				active={showFilters}
				onClick={onToggleShowFilters}
			/>
			<CleanButton onClick={() => onChangeFilter('', true)} />
		</div>
	</StyledFilters>
)

const StyledFilters = styled.div`
	margin-top: 23px;
`
