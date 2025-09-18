'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	FaFacebookF,
	FaInstagram,
	FaTelegramPlane,
	FaTiktok
} from 'react-icons/fa'
import styled from 'styled-components'

import { getAccessToken, logout, refreshToken } from '@/helpers/auth'

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
	text-transform: uppercase;

	@media (max-width: 768px) {
		font-size: 22px;
		line-height: 32px;
	}
`

const FullWidth = styled.div`
	width: 100%;
`
const TwoColumnGrid = styled.div`
	display: flex;
	gap: 16px;
	@media (max-width: 768px) {
		flex-direction: column;
	}
`
const Half = styled.div`
	flex: 1;
`
const InputWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 22px;
	border-bottom: 1px solid #ffffff8a;
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
	const [loading, setLoading] = useState(true)
	const [formData, setFormData] = useState({
		full_name: '',
		phone: '',
		instagram: '',
		tiktok: '',
		telegram: '',
		youtube: '',
		email: ''
	})

	const router = useRouter()

	const requestWithToken = async (
		input: RequestInfo,
		init?: RequestInit
	): Promise<Response> => {
		let token = getAccessToken()

		if (!token) {
			const refreshed = await refreshToken()
			if (!refreshed) {
				logout()
				throw new Error('Unauthorized')
			}
			token = getAccessToken()
		}

		let res = await fetch(input, {
			...init,
			headers: {
				...init?.headers,
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		})

		if (res.status === 401 || res.status === 403) {
			const refreshed = await refreshToken()
			if (refreshed) {
				const newToken = getAccessToken()
				res = await fetch(input, {
					...init,
					headers: {
						...init?.headers,
						Authorization: `Bearer ${newToken}`,
						'Content-Type': 'application/json'
					}
				})
			} else {
				logout()
				throw new Error('Session expired')
			}
		}

		return res
	}

	useEffect(() => {
		const init = async () => {
			try {
				const res = await requestWithToken(
					'https://rpktask.sytes.net/api/users/me/'
				)
				if (res.ok) {
					const data = await res.json()
					setFormData(data)
				}
			} catch (e) {
				console.error('Load profile failed:', e)
			}

			setLoading(false)
		}

		init()
	}, [router])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const handleSubmit = async () => {
		try {
			const res = await requestWithToken(
				'https://rpktask.sytes.net/api/users/me/',
				{
					method: 'PUT',
					body: JSON.stringify({
						full_name: formData.full_name,
						phone: formData.phone,
						instagram: formData.instagram,
						tiktok: formData.tiktok,
						telegram: formData.telegram,
						youtube: formData.youtube
					})
				}
			)
			if (res.ok) {
				alert('Update')
			} else {
				alert('Failed')
			}
		} catch (e) {
			console.error('Update failed:', e)
			alert('Failed server')
		}
	}

	if (loading) return <p style={{ color: '#fff' }}>Loading...</p>

	return (
		<FormWrapper>
			<Title>{t('ambassador.profileForm.title')}</Title>

			<FullWidth>
				<InputWrapper>
					<Input
						name='full_name'
						type='text'
						placeholder={t('ambassador.forma.fullname') || 'Full Name'}
						value={formData.full_name}
						onChange={handleChange}
					/>
				</InputWrapper>
			</FullWidth>

			<TwoColumnGrid>
				<Half>
					<InputWrapper>
						<Input
							name='phone'
							type='text'
							placeholder={t('ambassador.forma.Telephone')}
							value={formData.phone}
							onChange={handleChange}
						/>
					</InputWrapper>
				</Half>

				<Half>
					<InputWrapper>
						<Input
							name='email'
							type='email'
							placeholder={t('ambassador.forma.email')}
							value={formData.email}
							disabled
						/>
					</InputWrapper>
				</Half>
			</TwoColumnGrid>

			<InputWrapper>
				<IconCircle>
					<FaInstagram />
				</IconCircle>
				<Input
					name='instagram'
					type='text'
					placeholder='Instagram'
					value={formData.instagram}
					onChange={handleChange}
				/>
			</InputWrapper>

			<InputWrapper>
				<IconCircle>
					<FaFacebookF />
				</IconCircle>
				<Input
					name='youtube'
					type='text'
					placeholder='YouTube'
					value={formData.youtube}
					onChange={handleChange}
				/>
			</InputWrapper>

			<InputWrapper>
				<IconCircle>
					<FaTelegramPlane />
				</IconCircle>
				<Input
					name='telegram'
					type='text'
					placeholder='Telegram'
					value={formData.telegram}
					onChange={handleChange}
				/>
			</InputWrapper>

			<InputWrapper>
				<IconCircle>
					<FaTiktok />
				</IconCircle>
				<Input
					name='tiktok'
					type='text'
					placeholder='TikTok'
					value={formData.tiktok}
					onChange={handleChange}
				/>
			</InputWrapper>

			<Button onClick={handleSubmit}>
				{t('ambassador.profileForm.button')}
			</Button>
		</FormWrapper>
	)
}
