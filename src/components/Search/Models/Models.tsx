import styled from 'styled-components'

import { List } from './List/List'
import { Title } from './Title'

export const Models = () => (
	<StyledModels className='main-wrapper'>
		<Title />
		<List />
	</StyledModels>
)

const StyledModels = styled.div`
	margin-bottom: 127px;
	@media (max-width: 800px) {
		margin-bottom: 60px;
	}
`
