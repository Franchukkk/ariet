'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import icon1 from '@/assets/img/diamand-1.png'
import icon2 from '@/assets/img/diamand-2.png'
import icon3 from '@/assets/img/diamand-3.png'
import icon4 from '@/assets/img/diamand-4.png'
import icon5 from '@/assets/img/diamand-5.png'
import icon6 from '@/assets/img/diamand-6.png'

import { Banner } from './Banner'
import { Card } from './Card/Card'
import { LogoCard } from './LogoCard'

const DATA_KEYS = [
	{
		titleKey: 'advantages.reliability',
		icon: icon1,
		className: 'bg-[#0D0C0C]'
	},
	{ titleKey: 'advantages.assortment', icon: icon2 },
	{
		titleKey: 'advantages.fast_delivery',
		icon: icon3,
		className: 'bg-[#0D0C0C]'
	},
	{
		titleKey: 'advantages.personal_approach',
		icon: icon4,
		className: 'bg-[#0D0C0C]'
	},
	{ titleKey: 'advantages.global_presence', icon: icon5 },
	{
		titleKey: 'advantages.partner_support',
		icon: icon6,
		className: 'bg-[#0D0C0C]'
	}
]

export const Grid = () => {
	const { t, ready } = useTranslation('common')

	return (
		<StyledGrid>
			<LogoCard loading={!ready} />
			{ready
				? DATA_KEYS.map(({ titleKey, icon, className }, i) => (
						<Card
							key={i}
							position={1 + i}
							title={t(titleKey)}
							icon={icon}
							className={className}
						/>
					))
				: Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
			<Banner />
		</StyledGrid>
	)
}

const StyledGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-auto-rows: 317px;

	@media (max-width: 1200px) {
		grid-template-columns: repeat(2, 1fr);
	}
	@media (max-width: 700px) {
		grid-template-columns: 1fr;
		grid-auto-rows: 200px;
	}
`

/* Скелет карточки, щоб зайняти місце поки немає перекладу/даних */
const CardSkeleton = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 16px;
	background: rgba(255, 255, 255, 0.06);
`
