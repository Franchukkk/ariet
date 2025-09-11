'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import icon1 from '@/assets/img/diamand-7.png'
import icon2 from '@/assets/img/diamand-8.png'
import icon3 from '@/assets/img/diamand-9.png'

import { AdvantageCard } from '../AdvantageCard/AdvantageCard'

const ICONS = [icon1, icon2, icon3]
const KEYS = ['peace_confidence', 'fast_delivery', 'ups_configurator']

export const List = () => {
	const { t } = useTranslation('common')

	return (
		<StyledList>
			{KEYS.map((key, i) => (
				<AdvantageCard
					key={i}
					position={i + 1}
					icon={ICONS[i]}
					title={t(`advantages.About.${key}.title`)}
					description={t(`advantages.About.${key}.description`)}
				/>
			))}
		</StyledList>
	)
}

const StyledList = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 15px;

	@media (max-width: 1000px) {
		grid-template-columns: 1fr;
	}
`
