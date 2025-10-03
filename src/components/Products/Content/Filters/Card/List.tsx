'use client'

import styled from 'styled-components'

import { Checkbox } from '@/components/Checkbox'

interface Props {
	options: { title: string; value: string }[]
	activeFilters: string[]
	onChangeFilter: (filter: string) => void
}

export const List = ({ options, activeFilters, onChangeFilter }: Props) => (
	<StyledList className='flex flex-col gap-4'>
		{options?.map(({ value, title }) => (
			<Checkbox
				key={value}
				checked={activeFilters.includes(value)}
				onChange={() => onChangeFilter(value)}
				label={title}
			/>
		))}
	</StyledList>
)

const StyledList = styled.div`
	padding-bottom: 54px;
`
