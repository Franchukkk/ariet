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

// site key з ТЗ
const RECAPTCHA_SITE_KEY = '6LcaJdUrAAAAAKEZXglVmQDP92OLBTiSFZxp7USr'

// універсальний витягач значення з onChange
function getVal(v: any): string {
	if (typeof v === 'string') return v
	if (v && typeof v === 'object') {
		// React SyntheticEvent або native event
		const t = (v.target ?? v.currentTarget) as
			| HTMLInputElement
			| HTMLTextAreaElement
			| undefined
		if (t && typeof t.value === 'string') return t.value
		// деякі кастомні інпути кидають { value: '...' }
		if ('value' in v && typeof v.value === 'string') return (v as any).value
	}
	return ''
}

export const Form = ({ title }: Props) => {
	const { t } = useTranslation('common')
	const formTitle = (title ?? t('partnerForm.fill_form')).replace('\\n', '\n')

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (loading) return

		setFormError(null)
		setFormOk(null)

		// тримінг + базова перевірка
		const _name = name.trim()
		const _email = email.trim()
		const _message = message.trim()

		if (!_name || !_email || !_message) {
			setFormError(t('partnerForm.required_fields'))
			return
		}

		// дуже проста перевірка email
		const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email)
		if (!emailOk) {
			setFormError(t('partnerForm.error_email') || 'Email is invalid')
			return
		}

		try {
			setLoading(true)
			// Токен reCAPTCHA v3
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

			setFormOk(t('partnerForm.success'))

			// очистка форми
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
		} catch (err: unknown) {
			const msg =
				err instanceof Error ? err.message : t('partnerForm.error_generic')
			setFormError(msg)
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
						label={t('partnerForm.name')}
						value={name}
						onChange={(v: any) => setName(getVal(v))}
						name='name'
						autoComplete='name'
						required
					/>
					<Input
						label={t('partnerForm.position')}
						value={position}
						onChange={(v: any) => setPosition(getVal(v))}
						name='position'
						autoComplete='organization-title'
					/>
				</div>

				<div className='fields-group'>
					<Input
						label={t('partnerForm.phone')}
						value={phone}
						onChange={(v: any) => setPhone(getVal(v))}
						name='phone'
						autoComplete='tel'
					/>
					<Input
						label={t('partnerForm.email')}
						type='email'
						value={email}
						onChange={(v: any) => setEmail(getVal(v))}
						name='email'
						autoComplete='email'
						required
					/>
				</div>

				<Input
					label={t('partnerForm.address')}
					value={address}
					onChange={(v: any) => setAddress(getVal(v))}
					name='address'
					autoComplete='street-address'
				/>

				<div className='fields-group'>
					<Input
						label={t('partnerForm.zip')}
						value={postalCode}
						onChange={(v: any) => setPostalCode(getVal(v))}
						name='postal_code'
						autoComplete='postal-code'
					/>
					<Input
						label={t('partnerForm.city')}
						value={city}
						onChange={(v: any) => setCity(getVal(v))}
						name='city'
						autoComplete='address-level2'
					/>
				</div>

				<Input
					label={t('partnerForm.country')}
					value={country}
					onChange={(v: any) => setCountry(getVal(v))}
					name='country'
					autoComplete='country-name'
				/>
				<Input
					label={t('partnerForm.message')}
					textarea
					value={message}
					onChange={(v: any) => setMessage(getVal(v))}
					name='message'
					required
				/>
			</div>

			<Checkbox
				label={t('partnerForm.is_company')}
				checked={checkbox}
				onChange={() => setCheckbox(!checkbox)}
			/>

			{!recaptchaReady && (
				<small style={{ display: 'block', marginTop: 8, opacity: 0.7 }}>
					{t('partnerForm.loading_captcha')}
				</small>
			)}

			{formError && <ErrorMsg>{formError}</ErrorMsg>}
			{formOk && <OkMsg>{formOk}</OkMsg>}

			<Button
				type='submit'
				loading={loading}
				disabled={!recaptchaReady || loading}
				labelKey='partnerButton.get_request'
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
