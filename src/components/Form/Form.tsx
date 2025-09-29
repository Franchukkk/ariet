'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useRecaptchaV3 } from '@/hooks/useRecaptchaV3'

import { submitFeedback } from '@/api/feedback'

import { Checkbox } from '../Checkbox'

import { Button } from './Button'
import { Input } from './Input'
import { Title } from './Title'

interface Props {
	title?: string
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as
	| string
	| undefined

export const Form = ({ title }: Props) => {
	const { t } = useTranslation('common')
	const formRef = useRef<HTMLFormElement | null>(null)

	const [name, setName] = useState('')
	const [position, setPosition] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')
	const [address, setAddress] = useState('')
	const [postal_code, setPostalCode] = useState('')
	const [city, setCity] = useState('')
	const [country, setCountry] = useState('')
	const [message, setMessage] = useState('')
	const [i_am_company_representative, setIsCompany] = useState(false)

	const [loading, setLoading] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)
	const [formOk, setFormOk] = useState<string | null>(null)

	// вмикаємо капчу лише коли форма у в’юпорті (щоб badge не був по всьому сайту)
	const [captchaEnabled, setCaptchaEnabled] = useState(false)
	useEffect(() => {
		const el = formRef.current
		if (!el) return
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setCaptchaEnabled(true)
					io.disconnect()
				}
			},
			{ rootMargin: '200px' }
		)
		io.observe(el)
		return () => io.disconnect()
	}, [])

	const { ready: recaptchaReady, execute } = useRecaptchaV3(
		RECAPTCHA_SITE_KEY,
		captchaEnabled
	)

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
					'Заповніть, будь ласка, Імʼя, Email і Повідомлення.'
			)
			return
		}

		try {
			setLoading(true)

			// опціональний токен reCAPTCHA v3
			let captcha_token: string | undefined
			if (RECAPTCHA_SITE_KEY && recaptchaReady) {
				try {
					captcha_token = await execute('feedback')
				} catch (err) {
					console.warn('[reCAPTCHA] execute failed:', err)
				}
			}

			// ті самі поля, що в Swagger
			const payload = {
				name: _name,
				position: position.trim(),
				phone: phone.trim(),
				email: _email,
				address: address.trim(),
				postal_code: postal_code.trim(),
				city: city.trim(),
				country: country.trim(),
				message: _message,
				i_am_company_representative,
				...(captcha_token ? { captcha_token } : {}) // додаємо лише якщо є
			}

			await submitFeedback(payload)

			setFormOk(t('Form.success') || 'Ваш запит успішно надіслано!')
			setName('')
			setPosition('')
			setPhone('')
			setEmail('')
			setAddress('')
			setPostalCode('')
			setCity('')
			setCountry('')
			setMessage('')
			setIsCompany(false)
		} catch (err: any) {
			const msg = err?.message?.startsWith('HTTP 5')
				? t('Form.server_error') ||
					'Сервер тимчасово недоступний. Спробуйте пізніше.'
				: err?.message ||
					t('Form.error_generic') ||
					'Сталася помилка. Спробуйте ще раз.'
			setFormError(msg)
		} finally {
			setLoading(false)
		}
	}

	return (
		<StyledForm
			as='form'
			ref={formRef}
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
						value={postal_code}
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
				checked={i_am_company_representative}
				onChange={() => setIsCompany(!i_am_company_representative)}
			/>

			{!captchaEnabled && (
				<small style={{ display: 'block', marginTop: 8, opacity: 0.7 }}>
					{t('Form.loading_captcha') || 'Завантаження захисту…'}
				</small>
			)}
			{formError && <ErrorMsg>{formError}</ErrorMsg>}
			{formOk && <OkMsg>{formOk}</OkMsg>}

			<Button
				type='submit'
				loading={loading}
				// якщо є site key — чекаємо готовності капчі; якщо нема — не блокуємо
				disabled={loading || (!!RECAPTCHA_SITE_KEY && !recaptchaReady)}
				labelKey='Button.get_request'
			/>

			{/* Disclosure для v3 лише там, де реально вантажимо капчу */}
			{RECAPTCHA_SITE_KEY && (
				<small style={{ display: 'block', marginTop: 8, opacity: 0.7 }}>
					This site is protected by reCAPTCHA and the Google{' '}
					<a
						href='https://policies.google.com/privacy'
						target='_blank'
						rel='noreferrer'
					>
						Privacy Policy
					</a>{' '}
					and{' '}
					<a
						href='https://policies.google.com/terms'
						target='_blank'
						rel='noreferrer'
					>
						Terms of Service
					</a>{' '}
					apply.
				</small>
			)}
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
