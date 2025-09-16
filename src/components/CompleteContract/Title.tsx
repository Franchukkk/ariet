import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const Title = () => {
	const { t } = useTranslation('common')

	return <StyledTitle>{t('complete_contract.title')}</StyledTitle>
}

const StyledTitle = styled.h2`
	font-weight: 600;
	font-style: DemiBold;
	font-size: 50px;
	line-height: 58px;
	letter-spacing: 0%;
	text-transform: uppercase;
	margin-bottom: 17px;
	text-align: left;
	color: #ffffff;

	@media (max-width: 1000px) {
		font-size: 36px;
		line-height: 44px;
	}
`
