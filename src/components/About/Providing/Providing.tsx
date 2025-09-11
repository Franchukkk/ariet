import styled from 'styled-components'

import { List } from './List/List'
import { Title } from './Title'

export const Providing = () => (
	<StyledProviding>
		<Title />
		<List />
	</StyledProviding>
)

const StyledProviding = styled.div`
	margin-bottom: 142px;
	margin-right: 50px;
	margin-left: 50px;
	@media (max-width: 900px) {
		margin-bottom: 30px;
	}
`
