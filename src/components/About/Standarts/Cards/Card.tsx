import { StaticImageData } from 'next/image'
import type { ComponentType, SVGProps } from 'react'
import styled from 'styled-components'

interface Props {
	title: string
	icon?: StaticImageData | ComponentType<SVGProps<SVGSVGElement>>
	className?: string
}

export const Card = ({ title, icon: IconSvg, className }: Props) => {
	const justify = IconSvg ? 'justify-between' : 'justify-center'

	return (
		<StyledCard className={`flex flex-col ${justify} ${className ?? ''}`}>
			<div>{title}</div>

			{IconSvg ? <IconSvg aria-hidden='true' focusable='false' /> : null}
		</StyledCard>
	)
}

const StyledCard = styled.div`
	padding: 43px 52px 25px 32px;
	border-radius: 8px;
	background: #0d0c0c;
	font-weight: 500;
	font-size: 17px;
	line-height: 120%;
	letter-spacing: 1%;
	text-transform: uppercase;
	color: #ffffff;
	img {
		height: 62px;
		width: max-content;
	}
	&.outline-card {
		border: 1px solid #292929 !important;
		background: transparent;
	}
	@media (max-width: 800px) {
		padding: 30px;
	}
`
