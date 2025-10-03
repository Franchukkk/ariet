import styled from 'styled-components'

import { Background } from './Background'
import { Banner } from './Banner'
import { Description } from './Description'
import { Subtitle } from './Subtitle'
import { Title } from './Title'

export const Hero = () => (
	<StyledHero className='flex items-center justify-between'>
		<div className='flex-shrink-0'>
			<Title />
			<Subtitle />
			<Description />
		</div>
		<Banner />
		<Background />
	</StyledHero>
)

const StyledHero = styled.div`
	padding: 85px 34px 88px;
	border-radius: 24px;
	overflow: hidden;
	position: relative;
	margin-bottom: 73px;
	@media (max-width: 800px) {
		padding: 20px;
		.flex-shrink-0 {
			flex-shrink: 1 !important;
		}
	}
`
