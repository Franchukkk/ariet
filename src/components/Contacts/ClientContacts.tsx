'use client'

import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PublicRoute } from '@/components/PublicRoute/PublicRoute'

import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Title } from '../../components/Contacts/Title'
import { Form } from '../../components/Form/Form'

// ❗ Динамічне підвантаження тільки клієнтом
const Location = dynamic(
	() => import('../../components/Contacts/Location').then(m => m.Location),
	{ ssr: false, loading: () => <div style={{ height: 300 }} /> }
)

export const ClientContacts = () => {
	const { t } = useTranslation('common')

	return (
		<PublicRoute>
			<StyledContacts className='main-wrapper'>
				<Breadcrumbs
					path={[
						t('breadcrumbs.home'),
						t('breadcrumbs.products'),
						t('breadcrumbs.online_ups')
					]}
				/>
				<Title />
				<Location /> {/* тепер карта рендериться лише на клієнті */}
				<Form />
			</StyledContacts>
		</PublicRoute>
	)
}

const StyledContacts = styled.div``
