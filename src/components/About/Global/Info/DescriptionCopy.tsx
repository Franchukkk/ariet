import styled from 'styled-components'

interface Props {
	text: string
	className?: string
}

export const DescriptionCopy = ({ text, className }: Props) => (
	<StyledDescription className={className}>{text}</StyledDescription>
)

const StyledDescription = styled.p`
	font-weight: 300;
	font-style: Light;
	font-size: 14px;
	leading-trim: NONE;
	line-height: 18px;
	letter-spacing: 1%;
	color: #ffffff;
`
