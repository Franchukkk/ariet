import styled from 'styled-components'

interface Props {
	title: string
}

export const Title = ({ title }: Props) => (
	<StyledTitle className='flex items-center'>
		<div />
		<span>{title}</span>
	</StyledTitle>
)

const StyledTitle = styled.div`
	gap: 17px;
	white-space: pre-wrap;
	font-weight: 300;
	font-style: Light;
	font-size: 15px;
	leading-trim: NONE;
	line-height: 20px;
	letter-spacing: 0%;
	text-transform: uppercase;

	div {
		width: 18px;
		height: 18px;
		border-radius: 100%;
		background: #1dcf94;
		border: 3px solid #e1e1e1;
	}
`
