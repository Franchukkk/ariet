'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const CardWrapper = styled.div`
	padding: 20px;
	color: #fff;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	max-height: 350px;

	@media (max-width: 768px) {
		padding: 16px; /* компактніше на мобільних */
	}
`

const Title = styled.h3`
	margin-bottom: 12px;
	padding-bottom: 8px;
	font-weight: 600;
	font-size: 30px;
	line-height: 58px;
	text-transform: uppercase;

	@media (max-width: 768px) {
		font-size: 20px;
		line-height: 28px;
	}
`

const List = styled.ul`
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 12px;

	&::-webkit-scrollbar {
		width: 6px;
	}
	&::-webkit-scrollbar-thumb {
		background: #4bc785;
		border-radius: 3px;
	}
	&::-webkit-scrollbar-track {
		background: #2c2c2c;
	}
`

const ListItem = styled.li`
	display: flex;
	align-items: center;
	color: #eaeaea;
	padding-bottom: 40px;
	font-weight: 400;
	font-size: 17px;

	&::before {
		content: '›';
		color: #7f7f7f;
		margin-right: 12px;
		font-size: 20px;
		font-weight: bold;
	}

	&:hover {
		color: #4bc785;
	}

	@media (max-width: 768px) {
		font-size: 15px;
		padding-bottom: 24px;
	}
`

type TrainingsCardProps = {
	trainings: string[]
}

export default function TrainingsCard({ trainings }: TrainingsCardProps) {
	const { t } = useTranslation('common')
	return (
		<CardWrapper>
			<Title>{t('ambassador.TrainingsCard.trainings')}</Title>
			<List>
				{trainings.map((t, i) => (
					<ListItem key={i}>{t}</ListItem>
				))}
			</List>
		</CardWrapper>
	)
}
