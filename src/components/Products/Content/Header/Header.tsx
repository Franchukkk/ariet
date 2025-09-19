import styled from 'styled-components'

import { ICategory } from '../Content'

import { Filters } from './Filters/Filters'
import { Title } from './Title'

interface Props {
	activeFilters: string[]
	onChangeFilter: (filter: string, isReset?: boolean) => void
	showFilters: boolean
	onToggleShowFilters: () => void
	categories: ICategory[]
}

export const Header = ({
	activeFilters,
	onChangeFilter,
	showFilters,
	onToggleShowFilters,
	categories
}: Props) => (
	<StyledHeader>
		<Title />
		<Filters
			activeFilters={activeFilters}
			onChangeFilter={onChangeFilter}
			showFilters={showFilters}
			onToggleShowFilters={onToggleShowFilters}
			categories={categories}
		/>
	</StyledHeader>
)

const StyledHeader = styled.div`
	margin-bottom: 50px;
`
