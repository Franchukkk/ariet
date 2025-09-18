import { useRouter } from 'next/navigation'
import styled from 'styled-components'

import CartSvg from '../../../../public/Vector.svg'

export const Basket = () => {
	const router = useRouter()

	const handleClick = () => {
		router.push('/basket')
	}

	return (
		<StyledCart onClick={handleClick}>
			<StyledSvg>
				<CartSvg aria-label='cart' />
			</StyledSvg>
			<Badge>3</Badge>
		</StyledCart>
	)
}

const StyledSvg = styled.div`
	width: 34px;
	height: 30px;

	svg {
		width: 100%;
		height: 100%;
	}
`

const StyledCart = styled.button`
	cursor: pointer;
	position: relative;
	border: 1px dashed #ffffff;
	border-radius: 15px;
	display: flex;
	align-items: center;
	justify-content: center;

	border-radius: 15px;
	background:;
	height: 62px;
	width: 64px;
	flex-shrink: 0;

	@media (max-width: 1400px) {
		width: 60px;
		padding: 10px;
	}
`

const Badge = styled.span`
	position: absolute;
	top: 1px;
	right: 1px;
	background: #4bc785;
	color: #000000;
	font-size: 13px;
	font-weight: 600;
	border-radius: 50%;
	padding: 4px 6px;
	min-width: 20px;
	text-align: center;
	line-height: 1;
`
