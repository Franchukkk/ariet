'use client'

import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import styled from 'styled-components'

const FormWrapper = styled.div`
	background: #0d0d0d;
	padding: 24px;
	border-radius: 8px;
	color: #fff;
`

const Title = styled.h3`
	margin-bottom: 27px;
	font-weight: 600;
	font-size: 30px;
	line-height: 58px;
	letter-spacing: 0%;
	text-transform: uppercase;
`

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`

const InputWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 22px;
	border-bottom: 1px solid #2c2c2c;
	padding: 22px 0;
`

const IconCircle = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: #535353;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	svg {
		color: #fff;
		font-size: 20px;
	}
`

const Input = styled.input`
	flex: 1;
	background: transparent;
	color: #7f7f7f;
	border: none;
	outline: none;

	font-weight: 400;
	font-style: Regular;
	font-size: 16px;

	line-height: 100%;
	letter-spacing: 0%;

	&::placeholder {
		color: #777;
	}
`

const Button = styled.button`
	margin-top: 24px;
	padding: 20px 45px;
	background: #4bc785;
	color: #000;	
	border-radius: 65px;
	border: none;
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: 600;
	font-size: 15px;
	line-height: 100%;
	letter-spacing: 1%;
	text-align: center

	&:hover {
		background: #3ea46b;
	}
`

export default function ProfileForm() {
	return (
		<FormWrapper>
			<Title>РЕДАКТИРОВАТЬ ПРОФИЛЬ</Title>
			<Grid>
				<InputWrapper>
					<Input
						type='text'
						placeholder='Имя'
						defaultValue='Ирина'
					/>
				</InputWrapper>
				<InputWrapper>
					<Input
						type='text'
						placeholder='Фамилия'
						defaultValue='Овчаренко'
					/>
				</InputWrapper>
				<InputWrapper>
					<Input
						type='text'
						placeholder='Телефон'
						defaultValue='+38 (068) 879-03-13'
					/>
				</InputWrapper>
				<InputWrapper>
					<Input
						type='email'
						placeholder='Email'
						defaultValue='info@gmail.com'
					/>
				</InputWrapper>
			</Grid>

			<InputWrapper>
				<IconCircle>
					<FaInstagram />
				</IconCircle>
				<Input
					type='text'
					placeholder='Instagram'
					defaultValue='https://www.instagram.com/ovcharenko_ira/'
				/>
			</InputWrapper>

			<InputWrapper>
				<IconCircle>
					<FaFacebookF />
				</IconCircle>
				<Input
					type='text'
					placeholder='Facebook'
					defaultValue='https://www.instagram.com/ovcharenko_ira/'
				/>
			</InputWrapper>

			<Button>Сохранить изменение</Button>
		</FormWrapper>
	)
}
