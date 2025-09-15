'use client'

import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const Button = () => {
	const { t } = useTranslation('common')
	const router = useRouter()

	const handleClick = () => {
		router.push('/products')
	}

	return (
		<StyledButton onClick={handleClick}>{t('Button.catalog')}</StyledButton>
	)
}

const StyledButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 58px;
	border-radius: 61px;
	border: 1px solid #4bc785;
	width: 100%;
	transition: all 0.3s;
	color: #fff;
	font-weight: 600;

	&:hover {
		background: #4bc785;
		color: #000;
	}
`
