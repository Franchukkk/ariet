'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const Title = () => {
	const { t } = useTranslation('common')

	return (
		<StyledTitle dangerouslySetInnerHTML={{ __html: t('advantages.title') }} />
	)
}

const StyledTitle = styled.h2`
	font-weight: 600;
	font-size: 50px;
	line-height: 50px;
	letter-spacing: 0%;
	text-transform: uppercase;
	margin-bottom: 40px;
	color: #ffffff;

	@media (max-width: 800px) {
		text-align: center;
	}
`
