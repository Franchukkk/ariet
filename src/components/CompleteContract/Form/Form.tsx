'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Input } from './Input'
import { useOrder } from '@/context/OrderContext'

export const Form = () => {
	const { t } = useTranslation('common')
	const { error } = useOrder()

	return (
		<StyledForm id='order-form'>
			<Styled>{t('complete_contract.name_form')}</Styled>

			<div className='fields'>
				<div className='fields-group'>
					<Input
						name='Name'
						label={t('complete_contract.form.Name')}
						required
					/>
					<Input
						name='Surname'
						label={t('complete_contract.form.Surname')}
						required
					/>
				</div>
				<div className='fields-group'>
					<Input
						name='Phone'
						label={t('complete_contract.form.Phone')}
						type='tel'
						required
					/>
					<Input
						name='Email'
						label={t('complete_contract.form.Email')}
						type='email'
						required
					/>
				</div>
				<div className='fields-group'>
					<Input
						name='City'
						label={t('complete_contract.form.City')}
					/>
					<Input
						name='Zip_code'
						label={t('complete_contract.form.Zip_code')}
					/>
				</div>
				<Input
					name='Address'
					label={t('complete_contract.form.Address')}
					required
				/>
				<Input
					name='Transport_company_address'
					label={t('complete_contract.form.Transport_company_address')}
					required
				/>
				<div className='fields-group'>
					<Input
						name='TC_number'
						label={t('complete_contract.form.TC_number')}
					/>
					<Input
						name='Field_3'
						label={t('complete_contract.form.Field_3')}
					/>
				</div>
			</div>

			{error && <p className='text-red-500 mt-4'>{error}</p>}
		</StyledForm>
	)
}

const StyledForm = styled.form`
	width: 100%;
	max-width: 800px;
	.fields {
		display: grid;
		grid-template-columns: 1fr;
		gap: 44px;
		margin-bottom: 44px;
	}
	.fields-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 38px;
	}
	@media (max-width: 1000px) {
		width: 90%;
	}
	@media (max-width: 800px) {
		.fields-group {
			grid-template-columns: 1fr;
			gap: 20px;
		}
	}
`
const Styled = styled.h3`
	font-weight: 600;
	font-size: 30px;
	line-height: 58px;
	text-transform: uppercase;
`
