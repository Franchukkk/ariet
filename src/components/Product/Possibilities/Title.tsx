'use client'

import styled from 'styled-components'

export const Title = ({ text }: { text: string }) => (
	<StyledTitle>{text}</StyledTitle>
)

const StyledTitle = styled.h3`
	font-weight: 600;
	font-size: 50px;
	line-height: 58px;
	letter-spacing: 0%;
	text-align: center;
	text-transform: uppercase;
	margin-bottom: 32px;
	@media (max-width: 1000px) {
		font-size: 30px;
		line-height: 1;
		margin-bottom: 20px;
	}
`
