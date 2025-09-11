import styled from 'styled-components'

import { Earth } from './Earth'
import { Logo } from './Logo'
import { Text } from './Text'

export const LightPlanet = () => (
	<StyledLightPlanet className='flex items-center justify-center gap-[70px]'>
		<Logo />
		<Text />
		<Earth />
	</StyledLightPlanet>
)

const StyledLightPlanet = styled.div`
	padding: 103px 0 183px;
	position: relative;
	overflow: hidden;
	@media (max-width: 800px) {
		padding: 60px 0 150px;
		padding-left: 30px;
	}
`
