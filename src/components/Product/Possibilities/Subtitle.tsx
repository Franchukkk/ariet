import styled from 'styled-components'

export const Subtitle = ({ text }: { text?: string }) => {
	if (!text) return null
	return <StyledSubtitle>{text}</StyledSubtitle>
}

const StyledSubtitle = styled.p`
	max-width: 715px;
	margin: 0 auto 70px;
	font-weight: 300;
	font-size: 14px;
	line-height: 18px;
	letter-spacing: 1%;
	text-align: center;
	color: #ffffffa8;
`
