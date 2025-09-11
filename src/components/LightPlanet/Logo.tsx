import styled from 'styled-components'

import Outline from '@/assets/big-logo-outline.svg'
import IconSvg from '@/assets/big-logo.svg'

export const Logo = () => (
	<StyledLogo>
		<IconSvg aria-label='logo' />
		<Outline
			className='outline-logo'
			aria-label='outline-logo'
		/>
	</StyledLogo>
)

const StyledLogo = styled.div`
	position: relative;
	img {
		height: 404px;
	}
	.outline-logo {
		position: absolute;
		top: 0;
		left: -39px;
		height: 405px;
		z-index: 2;
		width: 126%;
	}
	@media (max-width: 800px) {
		display: none;
	}
`
