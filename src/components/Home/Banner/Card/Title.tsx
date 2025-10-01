'use client'

import styled from 'styled-components'

interface Props {
	title: string
}

export const Title = ({ title }: Props) => <StyledTitle>{title}</StyledTitle>

const StyledTitle = styled.h1`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 36px;
	z-index: 2;
	margin: 0;
	padding: 0 16px 12px;
	color: #fff;
	text-align: center;
	font-size: clamp(28px, 8vw, 90px);
	font-weight: 600;
	font-style: DemiBold;
	leading-trim: NONE;
	line-height: 100%;
	letter-spacing: 0%;
	text-transform: uppercase;
	pointer-events: none;

	@media (max-width: 700px) {
		padding: 0 12px 10px;
	}
`
