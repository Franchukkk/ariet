'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	FaFacebookF,
	FaInstagram,
	FaTelegramPlane,
	FaTiktok
} from 'react-icons/fa'
import styled from 'styled-components'

import { requestWithToken, useMe } from '@/hooks/useMe'

const FormWrapper = styled.div`padding:24px;color:#fff;@media(max-width:768px){padding:16px;}}`
const Title = styled.h3`margin-bottom:27px;font-weight:600;font-size:30px;line-height:58px;text-transform:uppercase;@media(max-width:768px){font-size:22px;line-height:32px;}}`
const FullWidth = styled.div`
	width: 100%;
`
const TwoColumnGrid = styled.div`display:flex;gap:16px;@media(max-width:768px){flex-direction:column;}}`
const Half = styled.div`
	flex: 1;
`
const InputWrapper = styled.div`display:flex;align-items:center;gap:22px;border-bottom:1px solid #ffffff8a;padding:12px 0;@media(max-width:768px){padding:12px 0;}}`
const IconCircle = styled.div`width:40px;height:40px;border-radius:50%;background:#535353;display:flex;align-items:center;justify-content:center;flex-shrink:0;svg{color:#fff;font-size:20px;}}`
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
	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	@media (max-width: 768px) {
		display: block;
		margin: 24px auto 0;
		padding: 14px 30px;
		font-size: 14px;
	}
`
const Status = styled.p<{ tone: 'ok' | 'warn' | 'muted' }>`
	margin-top: 12px;
	font-size: 14px;
	color: ${p =>
		p.tone === 'ok' ? '#4bc785' : p.tone === 'warn' ? '#f87171' : '#a3a3a3'};
`

type Me = {
	full_name: string
	phone: string
	instagram: string
	tiktok: string
	telegram: string
	youtube: string
	email: string
	promo_code: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function ProfileForm() {
	const { t } = useTranslation('common')
	const { me, loading, mutate } = useMe()

	const [formData, setFormData] = useState<Me>({
		full_name: '',
		phone: '',
		instagram: '',
		tiktok: '',
		telegram: '',
		youtube: '',
		email: '',
		promo_code: ''
	})
	const [saveState, setSaveState] = useState<SaveState>('idle')
	const [emailError, setEmailError] = useState('')
	const [dirty, setDirty] = useState(false)
	const blurOnceRef = useRef(false)

	useEffect(() => {
		if (me) {
			setFormData({
				full_name: me.full_name || '',
				phone: me.phone || '',
				instagram: me.instagram || '',
				tiktok: me.tiktok || '',
				telegram: me.telegram || '',
				youtube: me.youtube || '',
				email: me.email || '',
				promo_code: me.promo_code || ''
			})
			setDirty(false)
			setSaveState('idle')
			setEmailError('')
		}
	}, [me])

	const isValidEmail = (val: string) =>
		!val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => {
			const next = { ...prev, [name]: value }
			setDirty(true)
			if (name === 'email') {
				setEmailError(
					isValidEmail(value)
						? ''
						: (t('common:invalid_email') ?? 'Некоректний email')
				)
			}
			return next
		})
	}

	const buildPayload = (data: Me) => ({
		full_name: data.full_name || '',
		phone: data.phone || '',
		instagram: data.instagram || '',
		tiktok: data.tiktok || '',
		telegram: data.telegram || '',
		youtube: data.youtube || '',
		email: data.email || ''
	})

	const handleSubmit = async () => {
		if (emailError || !dirty) return

		// прибрати системні меню/клавіатуру та запобігти рефокусу
		if (!blurOnceRef.current) {
			if (document.activeElement instanceof HTMLElement)
				document.activeElement.blur()
			blurOnceRef.current = true
			setTimeout(() => (blurOnceRef.current = false), 200)
		}

		setSaveState('saving')
		const payload = buildPayload(formData)

		try {
			await mutate(
				async () => {
					const res = await requestWithToken(
						'https://test.arietpower.com/api/users/me/',
						{ method: 'PUT', body: JSON.stringify(payload) }
					)
					if (!res.ok) {
						let msg = 'Failed to update'
						try {
							const j = await res.json()
							if (j?.email)
								msg = Array.isArray(j.email) ? j.email[0] : String(j.email)
						} catch {}
						throw new Error(msg)
					}
					return res.json()
				},
				{
					optimisticData: { ...(me ?? {}), ...payload },
					rollbackOnError: true,
					revalidate: true
				}
			)

			setSaveState('saved')
			setDirty(false)
			setTimeout(() => setSaveState('idle'), 1800)
		} catch (e: any) {
			console.error(e)
			if (
				String(e?.message || '')
					.toLowerCase()
					.includes('email')
			) {
				setEmailError(e.message)
			}
			setSaveState('error')
		}
	}

	if (loading) return <p style={{ color: '#fff' }}>Loading...</p>

	const disabled = !!emailError || !dirty || saveState === 'saving'

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
						autoComplete='off'
						autoCorrect='off'
						autoCapitalize='off'
						spellCheck={false}
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
							autoComplete='off'
							autoCorrect='off'
							autoCapitalize='off'
							spellCheck={false}
							inputMode='tel'
							pattern='\d*'
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
							onChange={handleChange}
							autoComplete='off'
							autoCorrect='off'
							autoCapitalize='off'
							spellCheck={false}
							inputMode='email'
						/>
					</InputWrapper>
					{emailError && <Status tone='warn'>{emailError}</Status>}
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
					autoComplete='off'
					autoCorrect='off'
					autoCapitalize='off'
					spellCheck={false}
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
					autoComplete='off'
					autoCorrect='off'
					autoCapitalize='off'
					spellCheck={false}
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
					autoComplete='off'
					autoCorrect='off'
					autoCapitalize='off'
					spellCheck={false}
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
					autoComplete='off'
					autoCorrect='off'
					autoCapitalize='off'
					spellCheck={false}
				/>
			</InputWrapper>

			<Button
				type='button'
				onPointerDown={e => e.preventDefault()} // блокуємо рефокус інпута
				onMouseDown={e => e.preventDefault()}
				onClick={handleSubmit}
				disabled={disabled}
				aria-busy={saveState === 'saving'}
			>
				{saveState === 'saving'
					? (t('common:saving') ?? 'Збереження…')
					: (t('ambassador.profileForm.button') ?? 'Зберегти')}
			</Button>

			{saveState === 'saved' && (
				<Status tone='ok'>{t('common:saved') ?? 'Збережено'}</Status>
			)}
			{saveState === 'error' && !emailError && (
				<Status tone='warn'>{t('common:error') ?? 'Помилка збереження'}</Status>
			)}
		</FormWrapper>
	)
}
