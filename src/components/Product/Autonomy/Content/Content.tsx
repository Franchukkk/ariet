'use client'

import styled from 'styled-components'

import { List } from './List/List'
import { Title } from './Title'

export const Content = ({
	featureDescription,
	points
}: {
	featureDescription: string
	points: string[]
}) => (
	<StyledContent>
		<Title description={featureDescription} />
		<List points={points} />
	</StyledContent>
)

const StyledContent = styled.div`
	padding: 72px 0px 72px 61px;
	@media (max-width: 1000px) {
		padding: 20px;
	}
`
