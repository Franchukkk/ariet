'use client'

import { useState } from 'react'
import styled from 'styled-components'

import { Header } from './Header'
import { List } from './List'

interface Props {
	title: string
	options: { title: string; value: string }[]
	activeFilters: string[]
	onChangeFilter: (filter: string) => void
}

export const Card = ({
	title,
	options,
	activeFilters,
	onChangeFilter
}: Props) => {
	const [open, setOpen] = useState(true)
	const toggleOpen = () => setOpen(!open)

	return (
		<StyledCard>
			<Header
				title={title}
				open={open}
				onToggleOpen={toggleOpen}
			/>
			{open && (
				<List
					options={options}
					activeFilters={activeFilters}
					onChangeFilter={onChangeFilter}
				/>
			)}
		</StyledCard>
	)
}

const StyledCard = styled.div`
	padding: 29px 22px 0px 18px;
	border-radius: 8px;
	transition: all 0.3s;
	&:hover {
		background: #0d0c0c;
	}
`
