'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean
	labelKey?: string
}

export const Button = ({
	loading,
	disabled,
	labelKey = 'Button.get_request',
	...rest
}: ButtonProps) => {
	const { t } = useTranslation()
	return (
		<StyledButton
			disabled={disabled || loading}
			{...rest}
		>
			{loading ? t('Button.sending') : t(labelKey)}
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
	&:hover {
		background: #1dcf94;
	}
	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`
