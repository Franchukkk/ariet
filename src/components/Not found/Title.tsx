'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const Title = () => {
	const { t } = useTranslation('common')
	return (
		<div>
			<StyledTitle>{t('NotFound.title')}</StyledTitle>
			<StyledText>{t('NotFound.description')}</StyledText>
		</div>
	)
}

const StyledTitle = styled.h2`
	font-size: 2.5rem;
	line-height: 1.2;
	font-weight: 700;
	color: #fff;

	@media (max-width: 768px) {
		font-size: 2rem;
	}

	@media (max-width: 480px) {
		font-size: 1.75rem;
	}
`

const StyledText = styled.p`
	margin-top: 0.75rem;
	font-size: 1.25rem;
	line-height: 1.6;
	color: #d1d5db;

	@media (max-width: 768px) {
		font-size: 1rem;
	}
`
