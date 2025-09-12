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
	font-size: 2.813rem;
	line-height: 3rem;
	font-weight: 700;
	align-items: center;
`

const StyledText = styled.p`
	margin-top: 0.5rem;
	font-size: 1.563rem;
	line-height: 3rem;
	color: #fffff;
	align-items: center;
`
