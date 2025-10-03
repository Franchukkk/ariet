'use client'

import styled from 'styled-components'

import { ICategory } from '../../../Content'

import { Tag } from './Tag'

interface Props {
	activeFilters: string[]
	onChangeFilter: (filter: string, isReset?: boolean) => void
	categories: ICategory[]
}

export const Tags = ({ activeFilters, onChangeFilter, categories }: Props) => {
	const getTitle = (id: string) =>
		categories.find(cat => String(cat.id) === id)?.name ?? id

	if (activeFilters.length === 0) return null

	return (
		<StyledTags className='flex items-center flex-wrap gap-2'>
			{activeFilters.map(id => (
				<Tag
					key={id}
					title={getTitle(id)}
					onRemove={() => onChangeFilter(id)} // зняти один фільтр
				/>
			))}
		</StyledTags>
	)
}

const StyledTags = styled.div``
