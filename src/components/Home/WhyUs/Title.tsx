'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const Title = () => {
	const { t, ready } = useTranslation('common')

	if (!ready) return <TitleSkeleton aria-hidden />

	return <StyledTitle>{t('title.choose_ariet', 'CHOoSE ARIET')}</StyledTitle>
}

const StyledTitle = styled.h3`
	margin-bottom: 74px;
	font-weight: 600;
	font-size: 50px;
	line-height: 49px; /* стабільна висота рядка */
	letter-spacing: 0;
	text-transform: uppercase;
	color: #fff;

	@media (max-width: 700px) {
		font-size: 40px;
		margin-bottom: 0;
		text-align: center;
		line-height: 40px;
	}
`

/* Плейсхолдер тієї ж геометрії, щоб не було стрибка */
const TitleSkeleton = styled.div`
	margin-bottom: 74px;
	height: 49px;
	width: 60%;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.08);

	@media (max-width: 700px) {
		height: 40px;
		margin-bottom: 0;
		width: 80%;
		margin-inline: auto;
	}
`
