import styled from 'styled-components'

interface Props {
	title: string
}

export const Title = ({ title }: Props) => <StyledTitle>{title}</StyledTitle>

const StyledTitle = styled.h2`
	font-weight: 600;
	font-size: 50px;
	line-height: 48.91px;
	letter-spacing: 0%;
	text-align: center;
	text-transform: uppercase;
	margin-bottom: 78px;
	white-space: pre-wrap;
	@media (max-width: 800px) {
		text-align: center;
		margin-bottom: 40px;
		font-size: 40px;
		line-height: 1.2;
	}
`
