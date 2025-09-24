'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import PhoneIcon from '@/assets/img/phone.svg'

export const Phone = () => {
	const { t } = useTranslation('common')

	return (
		<StyledPhone>
			<a
				href='tel:+380679937234'
				className='flex items-center gap-1'
			>
				<PhoneIcon aria-label='phone' />
				+380 67 993 72 34
			</a>

			<Link
				href='/contacts'
				className='call-me'
			>
				{t('Phone.call_me_back')}
			</Link>
		</StyledPhone>
	)
}

const StyledPhone = styled.div`
	font-weight: 400;
	font-size: 14px;
	line-height: 100%;
	letter-spacing: 0%;
	color: #f2f2f2;

	.call-me {
		display: inline-block;
		margin-top: 3px;
		font-size: 12px;
		text-decoration: underline;
		color: #ffffff70;
		cursor: pointer;
	}

	.call-me:hover {
		color: #ffffffb0;
	}
`
