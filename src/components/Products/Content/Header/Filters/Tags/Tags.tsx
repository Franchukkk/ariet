import styled from 'styled-components'

import { ICategory } from '../../../Content'

import { Tag } from './Tag'

interface Props {
	activeFilters: string[]
	onChangeFilter: (filter: string, isReset?: boolean) => void
	categories: ICategory[]
}

export const Tags = ({ activeFilters, onChangeFilter, categories }: Props) => (
	<StyledTags className='flex items-center flex-wrap gap-2'>
		{activeFilters.map(filter => {
			const category = categories.find(cat => cat.id.toString() === filter)
			const title = category ? category.name : filter

			return (
				<Tag
					key={filter}
					title={title}
					onClick={() => onChangeFilter(filter)}
				/>
			)
		})}
	</StyledTags>
)

const StyledTags = styled.div``
