import styled from 'styled-components'

import BurgerIcon from '@/assets/img/burger.svg'
import CloseIcon from '@/assets/img/close.svg'

interface Props {
	open: boolean
	onToggle: () => void
}

export const Burger = ({ open, onToggle }: Props) => (
	<StyledBurger
		type='button'
		onClick={onToggle}
		aria-label={open ? 'Close menu' : 'Open menu'}
		aria-expanded={open}
	>
		{open ? (
			<CloseIcon
				aria-hidden='true'
				className='icon'
			/>
		) : (
			<BurgerIcon
				aria-hidden='true'
				className='icon'
			/>
		)}
	</StyledBurger>
)

const StyledBurger = styled.button`
	display: none;
	box-sizing: border-box;
	border: 1px dashed #4bc785;
	border-radius: 15px;
	padding: 10px;
	height: 56px;
	width: 56px;
	background: transparent;
	line-height: 0; /* прибирає baseline-зсуви */

	/* у нас SVG-компоненти, а не <img> */
	.icon,
	svg {
		display: block;
		width: 24px;
		height: 24px;
		flex: 0 0 24px;
	}

	@media (max-width: 1300px) {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: auto;

		/* щоб «хрестик» не ховався під оверлеєм меню */
		position: relative;
		z-index: 200; /* має бути більше, ніж у .header-content.open */
	}
`
