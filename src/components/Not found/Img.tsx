import Image from 'next/image'
import styled from 'styled-components'

export default function NotFound() {
	return (
		<Container>
			<BackgroundWrapper>
				<Background
					src='/result.svg'
					alt='background'
					width={700}
					height={700}
					priority
				/>

				<Foreground
					src='/404.svg'
					alt='404 - Not Found'
					width={700}
					height={700}
					priority
				/>
			</BackgroundWrapper>
		</Container>
	)
}

const Container = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const BackgroundWrapper = styled.div`
	position: relative;
	width: 700px;
	height: 700px;
`

const Background = styled(Image)`
	position: absolute;

	left: 0;
	width: 700px;
	height: 700px;
	object-fit: contain;
	z-index: 0;
	pointer-events: none;
`

const Foreground = styled(Image)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 1;
`
