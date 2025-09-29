'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import LogoSvg from '@/assets/img/outline-logo.svg'

export const LogoCard = () => {
	const { t } = useTranslation('common')

	return (
		<StyledLogoCard>
			<LogoSvg aria-label='logo-svg' />
			<Title>
				<div dangerouslySetInnerHTML={{ __html: t('logo_card.text') }} />
			</Title>
		</StyledLogoCard>
	)
}

const StyledLogoCard = styled.div`
	padding: 43px 28px 26px 23px;
	font-weight: 200;
	font-size: 15px;
	line-height: 20px;
	letter-spacing: 0%;
	text-transform: uppercase;
	color: #ffffff;

	img {
		margin-bottom: 34px;
		width: 107px;
		height: 132px;
	}
`

const Title = styled.div`
	margin-top: 34px;

	font-weight: 300;
	font-style: Light;
	font-size: 15px;
	leading-trim: NONE;
	line-height: 20px;
	letter-spacing: 0%;
	text-transform: uppercase;
`
