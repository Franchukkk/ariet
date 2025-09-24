'use client'

import styled from 'styled-components'

export const Title = ({
	name,
	description
}: {
	name?: string
	description?: string
}) => {
	return (
		<>
			<StyledTitle className='!mb-[30px]'>
				{name || ''}
				<span className='text-[#4BC785]'>
					{/* збережено спан для дизайну */}
				</span>
			</StyledTitle>
			{description ? <StyledTitle>{description}</StyledTitle> : null}
		</>
	)
}

const StyledTitle = styled.p`
	font-weight: 400;
	font-size: 23px;
	line-height: 33px;
	letter-spacing: 0%;
	text-transform: uppercase;
	margin-bottom: 95px;

	b {
		color: #4bc785;
		font-weight: 500;
	}

	@media (max-width: 800px) {
		font-size: 18px;
		line-height: 140%;
		margin-bottom: 40px;
	}
`
