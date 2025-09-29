import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ArrowSvg from '@/assets/img/arrow.svg'

export const Button = () => {
	const { t } = useTranslation('common')
	const router = useRouter()
	const handleClick = () => {
		router.push('/about')
	}
	return (
		<StyledButton onClick={handleClick}>
			<ArrowSvg aria-label='icon' />
			{t('Button.more_about_us')}
		</StyledButton>
	)
}

const StyledButton = styled.button`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 58px;
	padding: 0 31px;
	border: 1px solid #4bc785;
	border-radius: 61px;
	font-weight: 500;
	font-size: 15px;
	line-height: 100%;
	letter-spacing: 1%;
	text-align: center;
	color: #ffffff;
	max-width: 358px;
	width: 100%;
	position: relative;
	transition: all 0.3s;
	img {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 31px;
	}
	&:hover {
		background: #4bc785;
	}
`
