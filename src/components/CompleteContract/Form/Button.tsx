'use client'

import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'

export const Button = () => {
	const { t } = useTranslation()
	const router = useRouter()

	return (
		<StyledButton onClick={() => router.push('/thanks-for-order')}>
			{t('Button.get_request')}
		</StyledButton>
	)
}

const StyledButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 58px;
	border: 1px solid #1dcf94;
	border-radius: 61px;
	font-weight: 600;
	font-size: 15px;
	line-height: 100%;
	letter-spacing: 1%;
	text-align: center;
	width: 100%;
	margin-top: 58px;
	transition: all 0.3s;
	cursor: pointer;

	&:hover {
		background: #1dcf94;
	}
`
