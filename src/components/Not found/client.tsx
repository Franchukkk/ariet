'use client'

import styled from 'styled-components'

import { Button } from '@/components/Not found/Button'
import Img from '@/components/Not found/Img'
import { Title } from '@/components/Not found/Title'
import { PublicRoute } from '@/components/PublicRoute/PublicRoute'

export const NotFoundClient = () => {
	return (
		<PublicRoute>
			<Container>
				<ImgWrapper>
					<Img />
				</ImgWrapper>
				<TextBlock>
					<Title />
					<Button />
				</TextBlock>
			</Container>
		</PublicRoute>
	)
}

const Container = styled.div`
	position: relative;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	background: #000;
	text-align: center;

	@media (max-width: 768px) {
		padding: 2rem 1rem;
	}
`

const ImgWrapper = styled.div`
	max-width: 500px;
	width: 100%;

	@media (max-width: 768px) {
		max-width: 90%;
	}
`

const TextBlock = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.25rem;
	max-width: 600px;

	@media (max-width: 768px) {
		max-width: 90%;
	}
`
