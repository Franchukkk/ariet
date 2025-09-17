'use client'

import styled from 'styled-components'

import { Categories } from './Categories'
import { Title } from './Title'

interface Props {
	active: number
	setActive: (index: number) => void
}

export const Header = ({ active, setActive }: Props) => (
	<StyledHeader className='flex items-center justify-between flex-wrap gap-4'>
		<Title />
		<Categories
			active={active}
			setActive={setActive}
		/>
	</StyledHeader>
)

const StyledHeader = styled.div`
	margin-bottom: 57px;
`
