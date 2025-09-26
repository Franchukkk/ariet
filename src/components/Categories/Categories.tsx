'use client'

import styled from 'styled-components'

import { Grid } from './Grid/Grid'
import { Title } from './Title'

export const Categories = () => (
	<StyledCategories className='main-wrapper'>
		<Title />
		<Grid />
	</StyledCategories>
)

const StyledCategories = styled.div`
	margin-bottom: 158px;
	@media (max-width: 1000px) {
		margin-bottom: 40px;
	}
`
