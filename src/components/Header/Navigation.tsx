'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const LINKS = [
	{ title: 'title.about_company', link: '/about' },
	{ title: 'Navigation.support', link: '/online-support' },
	{ title: 'Navigation.partners', link: '/partner' },
	{ title: 'title.contacts', link: '/contacts' }
]

export const Navigation = () => {
	const { t } = useTranslation('common')

	return (
		<StyledNavigation className='flex items-center gap-[26px]'>
			{LINKS.map(({ title, link }, i) => (
				<Link
					key={i}
					href={link}
				>
					{t(title)}
				</Link>
			))}
		</StyledNavigation>
	)
}

const StyledNavigation = styled.nav`
	padding: 23px 29px 20px;
	border: 1px dashed #ffffff;
	border-radius: 15px;
	font-weight: 400;
	font-size: 14px;
	line-height: 100%;
	letter-spacing: 0%;
	color: #f2f2f2;
	height: 62px;
	width: 100%;
	a {
		white-space: nowrap;
	}
	@media (max-width: 1400px) {
		padding: 15px;
	}
	@media (max-width: 1300px) {
		font-size: 12px;
		gap: 10px;
		grid-column: 1/3;
		flex-direction: column;
		height: max-content;
	}
`
