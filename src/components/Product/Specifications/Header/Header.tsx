import styled from 'styled-components'

import { Title } from './Title'

export const Header = () => (
	<StyledHeader className='flex items-end justify-between mb-[62px]'>
		<Title />
	</StyledHeader>
)

const StyledHeader = styled.div`
	@media (max-width: 1000px) {
		margin-bottom: 30px;
	}
	@media (max-width: 800px) {
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 30px;
	}
`
