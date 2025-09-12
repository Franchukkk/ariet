'use client'

import styled from 'styled-components'

import { Button } from '@/components/Not found/Button'
import Img from '@/components/Not found/Img'
import { Title } from '@/components/Not found/Title'

export default function NotFound() {
	return (
		<Container>
			<ContentWrapper>
				<Img />
				<TextBlock>
					<Title />
					<Button />
				</TextBlock>
			</ContentWrapper>
		</Container>
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
	overflow: hidden;
	padding-bottom: 10rem;
`

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const TextBlock = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
`
