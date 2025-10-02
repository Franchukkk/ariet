import React from 'react'
import styled from 'styled-components'

import { ModelCard } from '../../../components/ModelCard/ModelCard'

import { IProduct } from './Content'

interface Props {
	data: IProduct[]
}

export const List = ({ data }: Props) => {
	const renderModelCards = (data: IProduct[]) => {
		return data.reduce((acc: any, _, index) => {
			if (index % 2 !== 0) return acc

			const first = data[index]
			const second = data[index + 1]

			acc.push(
				<React.Fragment key={index}>
					<>
						<div className='card card-border'>
							<ModelCard
								photo={first.variants[0]?.images[0]?.image}
								title={first.name}
								category={first.category.name}
								link={`/products/${first.id}`}
							/>
						</div>
						{second && (
							<div className='card'>
								<ModelCard
									photo={second.variants[0]?.images[0]?.image}
									title={second.name}
									category={second.category.name}
									link={`/products/${second.id}`}
								/>
							</div>
						)}
					</>
					<div className='divider' />
				</React.Fragment>
			)

			return acc
		}, [])
	}

	return <StyledList>{renderModelCards(data)}</StyledList>
}

const StyledList = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-auto-rows: max-content;

	--card-height-desktop: 420px;
	--card-height-mobile: 360px;

	--card-image-height-desktop: 420px;
	--card-image-height-mobile: 160px;

	.card {
		min-height: var(--card-height-desktop);
		display: flex;
		align-items: stretch;
	}

	.card > * {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.card img {
		width: 80%;
		height: var(--card-image-height-desktop);
		object-fit: cover;
		display: block;
		margin: 0 auto;
	}

	.divider {
		grid-column: 1/3;
		height: 1px;
		border-top: 1px dashed #ffffff80;
		margin: 14px 0;
	}

	.card {
		&.card-border {
			border-right: 1px dashed #ffffff80;
		}
	}

	@media (max-width: 800px) {
		grid-template-columns: 1fr;

		.card {
			min-height: var(--card-height-mobile);
			border-bottom: 1px dashed #ffffff80;
			border-right: none !important;
		}

		.card img {
			height: var(--card-image-height-mobile);
			width: 80%;
		}

		.divider {
			grid-column: 1/2;
			display: none;
		}
	}
`
