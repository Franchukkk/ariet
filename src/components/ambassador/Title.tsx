'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const TitleWrapper = styled.div`
	position: relative;
	margin-bottom: 34px;
	margin-top: 70px;
	display: inline-block;
`

const TitleText = styled.h1`
	color: #ffffff;
	font-weight: 600;
	font-size: 50px;
	line-height: 58px;
	letter-spacing: 0%;
	text-transform: uppercase;

	@media (max-width: 768px) {
		font-size: 28px;
		line-height: 36px;
	}
`

export default function Title() {
	const { t } = useTranslation('common')
	return (
		<TitleWrapper>
			<TitleText>{t('ambassador.title')}</TitleText>
		</TitleWrapper>
	)
}
