'use client'

import { useEffect, useRef, useState } from 'react'
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

// БЕРЕМО ЛИШЕ З ПУБЛІЧНОГО ENV (щоб не хардкодити):
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string

export const Form = ({ title }: Props) => {
	const { t } = useTranslation('common')
	const formRef = useRef<HTMLFormElement | null>(null)

	// поля
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

	// soft-захист
	const [hp, setHp] = useState('') // honeypot
	const startedAt = useRef<number>(Date.now()) // мін. час
	const keyLS = 'form_rate_cnt'
	const maxPerMinute = 5

	const [loading, setLoading] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)
	const [formOk, setFormOk] = useState<string | null>(null)

	// капчу вмикаємо тільки коли форма у в'юпорті
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

	const overLocalRate = () => {
		try {
			const now = Date.now()
			const val = localStorage.getItem(keyLS)
			const obj = val
				? (JSON.parse(val) as { t: number; c: number })
				: { t: now, c: 0 }
			// обнуляємо лічильник щохвилини
			if (now - obj.t > 60_000) {
				obj.t = now
				obj.c = 0
			}
			obj.c += 1
			localStorage.setItem(keyLS, JSON.stringify(obj))
			return obj.c > maxPerMinute
		} catch {
			return false
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (loading) return

		setFormError(null)
		setFormOk(null)

		// soft-вихідні перевірки
		if (hp) {
			setFormError('Bot detected')
			return
		} // honeypot
		if (Date.now() - startedAt.current < 1500) {
			// мінімальний час
			setFormError(t('Form.too_fast') || 'Занадто швидко. Спробуйте ще раз.')
			return
		}
		if (overLocalRate()) {
			setFormError(t('Form.rate_limit') || 'Забагато спроб. Спробуйте пізніше.')
			return
		}

		const _name = name.trim()
		const _email = email.trim()
		const _message = message.trim()
		if (!_name || !_email || !_message) {
			setFormError(
				t('Form.required_fields') || 'Заповніть Імʼя, Email та Повідомлення.'
			)
			return
		}

		try {
			setLoading(true)

			// токен беремо лише якщо реально можна виконати капчу
			let captcha_token: string | undefined
			if (recaptchaReady && RECAPTCHA_SITE_KEY) {
				try {
					captcha_token = await execute('feedback')
				} catch (err) {
					// якщо скрипт не завантажився / ключ не валідний — просто йдемо без токена
					console.warn('[reCAPTCHA] execute failed:', err)
				}
			}

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
				captcha_token, // буде undefined, якщо капча недоступна
				soft_proof: {
					// передамо на бекенд (якщо він щось логить)
					dwell_ms: Date.now() - startedAt.current,
					had_honeypot: !!hp
				}
			}

			// ⚠️ ваш endpoint — не змінюю
			const res = await fetch('/api/feedback/create/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			})

			if (!res.ok) {
				const txt = await res.text().catch(() => '')
				throw new Error(txt || `HTTP ${res.status}`)
			}

			setFormOk(t('Form.success') || 'Ваш запит успішно надіслано!')
			// очистка
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
			startedAt.current = Date.now()
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

			{/* honeypot — приховане поле */}
			<div
				style={{
					position: 'absolute',
					left: '-9999px',
					width: 0,
					height: 0,
					overflow: 'hidden'
				}}
				aria-hidden
			>
				<label>
					Website
					<input
						name='website'
						autoComplete='off'
						tabIndex={-1}
						value={hp}
						onChange={e => setHp(e.target.value)}
					/>
				</label>
			</div>

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
				disabled={loading || (RECAPTCHA_SITE_KEY ? !recaptchaReady : false)}
				labelKey='Button.get_request'
			/>

			{/* Disclosure для v3 (показуємо лише якщо є site key) */}
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
