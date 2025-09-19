import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props {
	onClick: () => void
}

export const CleanButton = ({ onClick }: Props) => {
	const { t } = useTranslation('common')

	return (
		<StyledCleanButton onClick={onClick}>
			{t('filters.clear')}
		</StyledCleanButton>
	)
}

const StyledCleanButton = styled.button`
	cursor: pointer;
	font-weight: 400;
	font-size: 14px;
	line-height: 24px;
	letter-spacing: 0%;
	text-decoration: underline;
	color: #ffffffcf;
	white-space: nowrap;
`
