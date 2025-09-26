// src/components/Form.tsx
'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useRecaptchaV3 } from '@/hooks/useRecaptchaV3'

import { Checkbox } from '../Checkbox'

import { Button } from './Button'
import { Input } from './Input'
import { Title } from './Title'

// src/components/Form.tsx

interface Props {
	title?: string
}

// site key з ТЗ
const RECAPTCHA_SITE_KEY = '6LcaJdUrAAAAAKEZXglVmQDP92OLBTiSFZxp7USr'

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

		if (!email || !name || !message) {
			setFormError(t('partnerForm.required_fields'))
			return
		}

		try {
			setLoading(true)

			// 1) токен reCAPTCHA v3 у браузері
			const captcha_token = await execute('feedback')

			// 2) відправляємо на бекенд
			const res = await fetch('/api/feedback/create/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					position,
					phone,
					email,
					address,
					postal_code: postalCode,
					city,
					country,
					message,
					i_am_company_representative: checkbox,
					captcha_token
				})
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
						onChange={e => setName((e.target as HTMLInputElement).value)}
					/>
					<Input
						label={t('partnerForm.position')}
						value={position}
						onChange={e => setPosition((e.target as HTMLInputElement).value)}
					/>
				</div>

				<div className='fields-group'>
					<Input
						label={t('partnerForm.phone')}
						value={phone}
						onChange={e => setPhone((e.target as HTMLInputElement).value)}
					/>
					<Input
						label={t('partnerForm.email')}
						type='email'
						value={email}
						onChange={e => setEmail((e.target as HTMLInputElement).value)}
					/>
				</div>

				<Input
					label={t('partnerForm.address')}
					value={address}
					onChange={e => setAddress((e.target as HTMLInputElement).value)}
				/>

				<div className='fields-group'>
					<Input
						label={t('partnerForm.zip')}
						value={postalCode}
						onChange={e => setPostalCode((e.target as HTMLInputElement).value)}
					/>
					<Input
						label={t('partnerForm.city')}
						value={city}
						onChange={e => setCity((e.target as HTMLInputElement).value)}
					/>
				</div>

				<Input
					label={t('partnerForm.country')}
					value={country}
					onChange={e => setCountry((e.target as HTMLInputElement).value)}
				/>
				<Input
					label={t('partnerForm.message')}
					textarea
					value={message}
					onChange={e => setMessage((e.target as HTMLTextAreaElement).value)}
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
