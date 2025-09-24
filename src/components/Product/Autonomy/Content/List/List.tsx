'use client'

import { Card } from './Card'

export const List = ({ points }: { points: string[] }) => {
	const DATA = points
		.filter(p => p && p.trim().length)
		.map(p => ({ title: p, subtitle: undefined }))

	if (DATA.length === 0) return null

	return (
		<div className='flex flex-col gap-[7px]'>
			{DATA.map(({ title, subtitle }, i) => (
				<Card
					key={i}
					title={title}
					subtitle={subtitle}
				/>
			))}
		</div>
	)
}
