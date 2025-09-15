import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Input } from './Input'

export const Form = () => {
	const { t } = useTranslation('common')

	return (
		<StyledForm>
			<Styled>{t('complete_contract.name_form')}</Styled>

			<div className='fields'>
				<div className='fields-group'>
					<Input label={t('complete_contract.form.Name')} />
					<Input label={t('complete_contract.form.Surname')} />
				</div>
				<div className='fields-group'>
					<Input label={t('complete_contract.form.Phone')} />
					<Input label={t('complete_contract.form.Email')} />
				</div>
				<div className='fields-group'>
					<Input label={t('complete_contract.form.City')} />
					<Input label={t('complete_contract.form.Zip_code')} />
				</div>
				<Input label={t('complete_contract.form.Address')} />
				<Input label={t('complete_contract.form.Transport_company_address')} />
				<div className='fields-group'>
					<Input label={t('complete_contract.form.TC_number')} />
					<Input label={t('complete_contract.form.Field_3')} />
				</div>
			</div>
		</StyledForm>
	)
}

const StyledForm = styled.div`
	width: 100%;
	max-width: 800px;
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
	font-style: DemiBold;
	font-size: 30px;
	line-height: 58px;
	letter-spacing: 0%;
	text-transform: uppercase;
	margin-bottom: 30px;
`
