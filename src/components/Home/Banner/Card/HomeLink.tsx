'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props {
	categoryId?: number | string
	lng?: 'ru' | 'en'
}

export const HomeLink = ({ categoryId, lng }: Props) => {
	const { t } = useTranslation('common')

	const params = new URLSearchParams()
	if (categoryId != null) params.set('category', String(categoryId))
	if (lng) params.set('lng', lng)

	const href = `/products${params.toString() ? `?${params.toString()}` : ''}`

	return <StyledLink href={href}>{t('HomeLink.to_catalog')}</StyledLink>
}

const StyledLink = styled(Link)`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 206px;
	height: 206px;
	border-radius: 100%;
	box-shadow: 39px 65px 89.6px 0px #4bc7854d;
	background: linear-gradient(180deg, #4bc785 0%, #256141 100%);
	font-weight: 600;
	font-size: 14px;
	line-height: 100%;
	letter-spacing: 0%;
	text-align: center;
	text-transform: uppercase;
	color: #000000;
	position: absolute;
	bottom: 120px;
	right: 28%;
	@media (max-width: 700px) {
		display: none;
	}
`
