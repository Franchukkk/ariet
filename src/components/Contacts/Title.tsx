'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const Title = () => {
	const { t } = useTranslation('common')
	return <StyledTitle>{t('title.contacts')}</StyledTitle>
}

const StyledTitle = styled.h1`
	font-weight: 600;
	font-style: DemiBold;
	font-size: 50px;
	leading-trim: NONE;
	line-height: 48.91px;
	letter-spacing: 0%;
	text-align: center;
	text-transform: uppercase;

	margin: 50px 0 56px;
	@media (max-width: 800px) {
		text-align: center;
		margin: 30px 0;
		font-size: 40px;
		line-height: 1.2;
	}
`
