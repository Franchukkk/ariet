'use client'

import styled from 'styled-components'

const CardWrapper = styled.div`
	padding: 20px;
	color: #fff;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	max-height: 350px;
`

const Title = styled.h3`
	margin-bottom: 12px;
	padding-bottom: 8px;
	font-weight: 600;
	font-size: 30px;
	line-height: 58px;
	letter-spacing: 0%;
	text-transform: uppercase;
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
	font-style: Regular;
	font-size: 17px;

	line-height: 100%;
	letter-spacing: 1%;

	&::before {
		content: '›';
		color: #3b3b3b;
		margin-right: 8px;
	}

	&:hover {
		color: #4bc785;
	}
`

type TrainingsCardProps = {
	trainings: string[]
}

export default function TrainingsCard({ trainings }: TrainingsCardProps) {
	return (
		<CardWrapper>
			<Title>МОИ ТРЕНИНГИ</Title>
			<List>
				{trainings.map((t, i) => (
					<ListItem key={i}>{t}</ListItem>
				))}
			</List>
		</CardWrapper>
	)
}
