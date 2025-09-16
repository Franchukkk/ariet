'use client'

import { useTranslation } from 'react-i18next'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import styled from 'styled-components'

const FormWrapper = styled.div`
	padding: 24px;
	color: #fff;

	@media (max-width: 768px) {
		padding: 16px;
	}
`

const Title = styled.h3`
	margin-bottom: 27px;
	font-weight: 600;
	font-size: 30px;
	line-height: 58px;
	letter-spacing: 0%;
	text-transform: uppercase;

	@media (max-width: 768px) {
		font-size: 22px;
		line-height: 32px;
	}
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

	@media (max-width: 768px) {
		padding: 12px 0;
	}
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
	font-size: 16px;
	line-height: 100%;

	&::placeholder {
		color: #777;
	}

	@media (max-width: 768px) {
		font-size: 14px;
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
	text-align: center;

	&:hover {
		background: #3ea46b;
	}

	@media (max-width: 768px) {
		padding: 14px 30px;
		font-size: 14px;
	}
`

export default function ProfileForm() {
	const { t } = useTranslation('common')
	return (
		<FormWrapper>
			<Title>{t('ambassador.profileForm.title')}</Title>
			<Grid>
				<InputWrapper>
					<Input
						type='text'
						placeholder={t('ambassador.forma.name')}
						defaultValue='Ирина'
					/>
				</InputWrapper>
				<InputWrapper>
					<Input
						type='text'
						placeholder={t('ambassador.forma.Surname')}
						defaultValue='Овчаренко'
					/>
				</InputWrapper>
				<InputWrapper>
					<Input
						type='text'
						placeholder={t('ambassador.forma.Telephone')}
						defaultValue='+38 (068) 879-03-13'
					/>
				</InputWrapper>
				<InputWrapper>
					<Input
						type='email'
						placeholder={t('ambassador.forma.email')}
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

			<Button>{t('ambassador.profileForm.button')}</Button>
		</FormWrapper>
	)
}
