'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import centerIcon from '@/assets/img/data-center.svg'
import hospitalIcon from '@/assets/img/hospital.svg'
import microscopeIcon from '@/assets/img/microscope.svg'
import telecomunicationIcon from '@/assets/img/telecomunication.svg'

import { Card } from './Card'

export const Steps = () => {
	const { t, ready } = useTranslation('common')

	const STEPS = [
		{ id: 1, title: t('steps.medical', 'Medical'), icon: hospitalIcon },
		{ id: 2, title: t('steps.laboratory', 'Laboratory'), icon: microscopeIcon },
		{ id: 3, title: t('steps.data_center', 'Data center'), icon: centerIcon },
		{ id: 4, title: t('steps.telecom', 'Telecom'), icon: telecomunicationIcon }
	]

	return (
		<StyledSteps>
			{/* псевдоелемент дає full-bleed рамку без calc() і від’ємних margin */}
			<div className='main-wrapper'>
				{ready
					? STEPS.map(({ id, title, icon }, i) => (
							<Card
								key={id}
								step={i + 1}
								icon={icon}
								title={title}
							/>
						))
					: Array.from({ length: 4 }).map((_, i) => (
							<Card
								key={`sk-${i}`}
								step={i + 1}
								icon={null as any}
								title=''
								data-skeleton
							/>
						))}
			</div>
		</StyledSteps>
	)
}

const StyledSteps = styled.div`
	position: relative;
	padding: 20px 0 22px;

	/* Дві лінії-фони: зверху і знизу, на всю ширину вікна */
	background:
		linear-gradient(#ffffff45, #ffffff45) center top / 100svw 1px no-repeat,
		linear-gradient(#ffffff45, #ffffff45) center bottom / 100svw 1px no-repeat;

	.main-wrapper {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-auto-rows: 272px;
	}

	@media (max-width: 1000px) {
		background: none;
		.main-wrapper {
			grid-template-columns: 1fr;
			grid-auto-rows: 150px;
		}
	}
`
