'use client'

import type { FunctionComponent, SVGProps } from 'react'
import styled from 'styled-components'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	step: number
	icon: FunctionComponent<SVGProps<SVGSVGElement>> | null
	title: string
	'data-skeleton'?: boolean
}

export const Card = ({ step, icon: Icon, title, ...props }: Props) => {
	const isSkeleton = 'data-skeleton' in props

	return (
		<StyledCard
			{...props}
			className='flex flex-col justify-center gap-[48px]'
		>
			<div className='step'>0{step}</div>

			<IconBox aria-hidden={isSkeleton}>
				{isSkeleton ? (
					<div className='icon-skeleton' />
				) : (
					Icon && (
						<Icon
							aria-label='icon'
							width={40}
							height={40}
							focusable='false'
						/>
					)
				)}
			</IconBox>

			<TitleBox>
				{isSkeleton ? (
					<div className='title-skeleton' />
				) : (
					<div
						className='title'
						title={title}
					>
						{title}
					</div>
				)}
			</TitleBox>
		</StyledCard>
	)
}

const StyledCard = styled.div`
	box-sizing: border-box;
	/* ↑ трохи більший внутрішній відступ картки */
	padding: 36px;
	font-weight: 500;
	font-size: 16px;
	line-height: 1;
	letter-spacing: 0.01em;
	text-transform: uppercase;
	color: #ffffffc4;
	position: relative;

	border-left: 1px dashed #ffffff45;

	&:last-child {
		border-right: 1px dashed #ffffff45;
	}

	transition:
		background-color 0.2s ease,
		border-color 0.2s ease,
		transform 0.15s ease;

	.step {
		display: flex;
		align-items: center;
		padding: 4.5px 19.5px;
		background: #000;
		border: 1px solid #ffffff57;
		border-radius: 11111px;
		font-weight: 200;
		font-size: 15px;
		width: max-content;
		position: absolute;
		top: -34px;
		/* ↑ зсув лейбла узгоджено з новим padding */
		left: 36px;
	}

	@media (max-width: 1000px) {
		border-left: none;
		border-top: 1px dashed #ffffff45;
		/* ↑ трохи більше на мобайлі */
		padding: 28px;

		&:last-child {
			border-right: none;
		}

		.step {
			left: 50%;
			transform: translateX(-50%);
			top: -14px;
		}
	}
`

const IconBox = styled.div`
	width: 40px;
	height: 40px;

	& > svg,
	& > img {
		display: block;
		width: 40px;
		height: 40px;
	}

	.icon-skeleton {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.12);
	}

	@media (max-width: 1000px) {
		width: 32px;
		height: 32px;
		& > svg,
		& > img,
		.icon-skeleton {
			width: 32px;
			height: 32px;
		}
	}
`

const TitleBox = styled.div`
	min-height: 22px;
	display: flex;
	align-items: center;

	.title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 22px;
		color: #ffffffc4;
	}

	.title-skeleton {
		width: 70%;
		height: 16px;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.12);
	}

	@media (max-width: 1000px) {
		min-height: 20px;
		.title {
			line-height: 20px;
		}
	}
`
