'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useRecaptchaV3 } from '@/hooks/useRecaptchaV3'

import { Checkbox } from '../Checkbox'

import { Button } from './Button'
import { Input } from './Input'
import { Title } from './Title'

interface Props {
	title?: string
}

// v3 site key
const RECAPTCHA_SITE_KEY = '6LcaJdUrAAAAAKEZXglVmQDP92OLBTiSFZxp7USr'

export const Form = ({ title }: Props) => {
	const { t } = useTranslation('common')

	const [name, setName] = useState('')
	const [position, setPosition] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')
	const [address, setAddress] = useState('')
	const [postalCode, setPostalCode] = useState('')
	const [city, setCity] = useState('')
	const [country, setCountry] = useState('')
	const [message, setMessage] = useState('')
	const [checkbox, setCheckbox] = useState(false)

	const [loading, setLoading] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)
	const [formOk, setFormOk] = useState<string | null>(null)

	const { ready: recaptchaReady, execute } = useRecaptchaV3(RECAPTCHA_SITE_KEY)

	const formTitle = (title ?? t('Form.fill_form')).replace('\\n', '\n')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (loading) return

		setFormError(null)
		setFormOk(null)

		const _name = name.trim()
		const _email = email.trim()
		const _message = message.trim()
		if (!_name || !_email || !_message) {
			setFormError(
				t('Form.required_fields') ||
					'Пожалуйста, заполните поля Имя, Электронная почта и Сообщение.'
			)
			return
		}

		try {
			setLoading(true)

			// reCAPTCHA v3 токен
			const captcha_token = await execute('feedback')

			const payload = {
				name: _name,
				position: position.trim(),
				phone: phone.trim(),
				email: _email,
				address: address.trim(),
				postal_code: postalCode.trim(),
				city: city.trim(),
				country: country.trim(),
				message: _message,
				i_am_company_representative: checkbox,
				captcha_token
			}

			const res = await fetch('/api/feedback/create/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			})

			if (!res.ok) {
				const txt = await res.text().catch(() => '')
				throw new Error(txt || `HTTP ${res.status}`)
			}

			setFormOk(t('Form.success') || 'Ваш запрос успешно отправлен!')

			// очистити форму
			setName('')
			setPosition('')
			setPhone('')
			setEmail('')
			setAddress('')
			setPostalCode('')
			setCity('')
			setCountry('')
			setMessage('')
			setCheckbox(false)
		} catch (err: any) {
			setFormError(
				err?.message ||
					t('Form.error_generic') ||
					'Произошла ошибка. Попробуйте ещё раз.'
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<StyledForm
			as='form'
			onSubmit={handleSubmit}
			noValidate
		>
			<Title title={formTitle} />

			<div className='fields'>
				<div className='fields-group'>
					<Input
						label={t('Form.name')}
						name='name'
						value={name}
						onChange={e => setName(e.target.value)}
					/>
					<Input
						label={t('Form.position')}
						name='position'
						value={position}
						onChange={e => setPosition(e.target.value)}
					/>
				</div>
				<div className='fields-group'>
					<Input
						label={t('Form.phone')}
						name='phone'
						value={phone}
						onChange={e => setPhone(e.target.value)}
					/>
					<Input
						label={t('Form.email')}
						type='email'
						name='email'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
				<Input
					label={t('Form.address')}
					name='address'
					value={address}
					onChange={e => setAddress(e.target.value)}
				/>
				<div className='fields-group'>
					<Input
						label={t('Form.zip')}
						name='postal_code'
						value={postalCode}
						onChange={e => setPostalCode(e.target.value)}
					/>
					<Input
						label={t('Form.city')}
						name='city'
						value={city}
						onChange={e => setCity(e.target.value)}
					/>
				</div>
				<Input
					label={t('Form.country')}
					name='country'
					value={country}
					onChange={e => setCountry(e.target.value)}
				/>
				<Input
					label={t('Form.message')}
					textarea
					name='message'
					value={message}
					onChange={e => setMessage((e.target as HTMLTextAreaElement).value)}
				/>
			</div>

			<Checkbox
				label={t('Form.is_company')}
				checked={checkbox}
				onChange={() => setCheckbox(!checkbox)}
			/>

			{!recaptchaReady && (
				<small style={{ display: 'block', marginTop: 8, opacity: 0.7 }}>
					{t('Form.loading_captcha') || 'Завантаження захисту…'}
				</small>
			)}

			{formError && <ErrorMsg>{formError}</ErrorMsg>}
			{formOk && <OkMsg>{formOk}</OkMsg>}

			<Button
				type='submit'
				loading={loading}
				disabled={!recaptchaReady || loading}
				labelKey='Button.get_request'
			/>
		</StyledForm>
	)
}

const StyledForm = styled.div`
	max-width: 768px;
	margin: 0 auto 111px;
	.fields {
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: max-content;
		gap: 44px;
		margin-bottom: 44px;
	}
	.fields-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 38px;
	}
	@media (max-width: 800px) {
		.fields-group {
			grid-template-columns: 1fr;
			gap: 20px;
		}
	}
`

const ErrorMsg = styled.div`
	color: #d12f2f;
	margin-top: 12px;
	font-size: 14px;
`

const OkMsg = styled.div`
	color: #1dcf94;
	margin-top: 12px;
	font-size: 14px;
`
