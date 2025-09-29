'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useRecaptchaBadgeVisible } from '@/hooks/useRecaptchaBadgeVisible'
import { useRecaptchaV3 } from '@/hooks/useRecaptchaV3'

import { Checkbox } from '../Checkbox'

import { Button } from './Button'
import { Input } from './Input'
import { Title } from './Title'

interface Props {
	title?: string
}

const RECAPTCHA_SITE_KEY = '6LcaJdUrAAAAAKEZXglVmQDP92OLBTiSFZxp7USr'

export const Form = ({ title }: Props) => {
	useRecaptchaBadgeVisible()

	const { t } = useTranslation('common')
	const formRef = useRef<HTMLFormElement | null>(null)

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

	// ВАЖЛИВО: лише один виклик хука reCAPTCHA
	// (хук має підтримувати другий аргумент enabled; якщо ні — просто приберіть його)
	const { ready: recaptchaReady, execute } = useRecaptchaV3(
		RECAPTCHA_SITE_KEY,
		captchaEnabled
	)

	const formTitle = (title ?? t('Form.fill_form')).replace('\\n', '\n')

	const getCookie = (name: string) => {
		if (typeof document === 'undefined') return ''
		const m = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'))
		return m ? decodeURIComponent(m[2]) : ''
	}

	async function postJSON(url: string, payload: any) {
		const csrftoken = getCookie('csrftoken')
		return fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
			},
			body: JSON.stringify(payload)
		})
	}

	async function postFormData(url: string, payload: Record<string, any>) {
		const csrftoken = getCookie('csrftoken')
		const fd = new FormData()
		Object.entries(payload).forEach(([k, v]) => {
			if (v !== undefined && v !== null)
				fd.append(k, typeof v === 'string' ? v : String(v))
		})
		return fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
			},
			body: fd
		})
	}

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

		const basePayload = {
			name: _name,
			position: position.trim(),
			phone: phone.trim(),
			email: _email,
			address: address.trim(),
			postal_code: postalCode.trim(),
			city: city.trim(),
			country: country.trim(),
			message: _message,
			i_am_company_representative: checkbox
		}

		try {
			setLoading(true)

			let captcha_token: string | undefined
			if (RECAPTCHA_SITE_KEY && captchaEnabled && recaptchaReady) {
				try {
					captcha_token = await execute('feedback')
				} catch (err) {
					console.warn('[reCAPTCHA] execute failed:', err)
				}
			}

			const url = '/api/feedback/create/'
			let res = await postJSON(url, { ...basePayload, captcha_token })

			if (res.status >= 500) {
				console.warn(
					'[feedback] 5xx with captcha, retrying without captcha_token (JSON)'
				)
				res = await postJSON(url, basePayload)
			}

			if (res.status >= 500) {
				console.warn(
					'[feedback] 5xx with JSON, retrying as FormData (no captcha)'
				)
				res = await postFormData(url, basePayload)
			}

			if (!res.ok) {
				const txt = await res.text().catch(() => '')
				throw new Error(txt || `HTTP ${res.status}`)
			}

			setFormOk(t('Form.success') || 'Ваш запит успішно надіслано!')
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
					'Сталася помилка. Спробуйте ще раз.'
			)
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
				disabled={loading || (captchaEnabled && !recaptchaReady)}
				labelKey='Button.get_request'
			/>

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
