'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import IconSvg from '@/assets/img/pin.svg'

const KEYS = [
	'list.barcelona_spain',
	'list.izmir_turkey',
	'list.shenzhen_china'
] as const

const ListItem = ({ text }: { text: string }) => (
	<li className='flex items-center gap-2.5'>
		<IconSvg aria-label='icon' />
		{text}
	</li>
)

export const List = () => {
	const { t } = useTranslation('common')

	return (
		<StyledList>
			{KEYS.map(key => (
				<ListItem
					key={key}
					text={t(key)}
				/>
			))}
		</StyledList>
	)
}

const StyledList = styled.ul`
	margin: 25px 0 22px;

	font-weight: 400;
	font-style: Regular;
	font-size: 16px;
	leading-trim: NONE;
	line-height: 33px;
	letter-spacing: 0%;
	text-transform: uppercase;

	color: #ffffff;
`
