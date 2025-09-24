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
		<StyledNavigation className='flex items-center'>
			{LINKS.map(({ title, link }, i) => (
				<NavLink
					key={i}
					href={link}
				>
					{t(title)}
				</NavLink>
			))}
		</StyledNavigation>
	)
}

const StyledNavigation = styled.nav`
	padding: 0 29px;
	border: 1px dashed #ffffff;
	border-radius: 15px;
	font-weight: 400;
	font-size: 14px;
	line-height: 100%;
	letter-spacing: 0%;
	color: #f2f2f2;
	width: 100%;

	@media (max-width: 1400px) {
		padding: 0 15px;
	}
	@media (max-width: 1300px) {
		font-size: 12px;
		grid-column: 1/3;
		flex-direction: column;
	}
`

const NavLink = styled(Link)`
	display: flex;
	align-items: center;

	padding: 23px 13px 20px;
	white-space: nowrap;
	text-decoration: none;
	color: inherit;
	transition: color 0.15s ease;

	&:hover {
		color: #4bc785;
	}

	@media (max-width: 1300px) {
		width: 100%;
		padding: 12px 0;
	}
`
