'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const Title = () => {
	const { t } = useTranslation('common')
	return <StyledTitle>{t('title.title_name')}</StyledTitle>
}

const StyledTitle = styled.h3`
	font-weight: 600;
	font-size: 50px;
	line-height: 58px;
	letter-spacing: 0%;
	text-transform: uppercase;
	color: #ffffff;
	margin-bottom: 14px;
	@media (max-width: 800px) {
		font-size: 30px;
		line-height: 1.2;
		text-align: center;
	}
`
