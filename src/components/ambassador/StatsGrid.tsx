'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Card = styled.div`
	background: #1a1a1a;
	padding: 16px;
	border-radius: 8px;
	color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	min-width: 280px;
	flex: 1;
`

const Info = styled.div`
	display: flex;
	flex-direction: column;
`

const Value = styled.div`
	margin-bottom: 6px;
	font-weight: 600;
	font-size: 40px;
	line-height: 100%;
	letter-spacing: 1%;
`

const Label = styled.div`
	margin-bottom: 13px;
	max-width: 70px;
	max-height: 165px;
	font-weight: 600;
	font-size: 15px;
	line-height: 100%;
	letter-spacing: 1%;
`

const Percent = styled.div`
	color: #d6d6d6;
	font-weight: 300;
	font-style: Light;
	font-size: 15px;
	line-height: 100%;
	letter-spacing: 1%;
`

const Chart = styled.div`
	display: flex;
	align-items: flex-end;
	gap: 4px;
`

const Bar = styled.div<{ height: number; shade: number }>`
	width: 6px;
	height: ${({ height }) => height}px;
	border-radius: 2px;
	background: ${({ shade }) => `rgba(75, 199, 133, ${shade})`};
`

type StatsCardProps = {
	value: string
	label: string
	percent: string
	chartData: number[]
}

function StatsCard({ value, label, percent, chartData }: StatsCardProps) {
	return (
		<Card>
			<Info>
				<Value>{value}</Value>
				<Label>{label}</Label>
				<Percent>{percent}</Percent>
			</Info>
			<Chart>
				{chartData.map((h, i) => (
					<Bar
						key={i}
						height={h}
						shade={0.5 + (i % 2) * 0.4}
					/>
				))}
			</Chart>
		</Card>
	)
}

export default function DashboardStats() {
	const { t } = useTranslation('common')
	return (
		<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
			<StatsCard
				value='14'
				label={t('ambassador.label.bonuses')}
				percent='35,87%'
				chartData={[20, 25, 30, 40]}
			/>
			<StatsCard
				value='32 589 грн'
				label={t('ambassador.label.amount')}
				percent='35,87%'
				chartData={[15, 20, 18, 45]}
			/>
			<StatsCard
				value='567'
				label={t('ambassador.label.orders')}
				percent='35,87%'
				chartData={[10, 15, 20, 35]}
			/>
		</div>
	)
}
