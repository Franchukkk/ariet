'use client'

import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const AboutUs = () => {
	const { t } = useTranslation('common')
	return (
		<StyledAboutUs>
			<div className='title'>{t('AboutUs.about_company')}</div>
			<p>
				<Trans
					i18nKey='footer.aboutUs'
					components={{ br: <br /> }}
				/>
			</p>
		</StyledAboutUs>
	)
}

const StyledAboutUs = styled.div`
	font-weight: 400;
	font-size: 14px;
	line-height: 21px;
	letter-spacing: 0%;
	color: #7a7b7a;
	max-width: 335px;
	.title {
		font-weight: 500;
		font-size: 20px;
		line-height: 16px;
		letter-spacing: 0%;
		vertical-align: middle;
		text-transform: uppercase;
		color: #f1f1f1;
		margin-bottom: 23px;
	}
`
