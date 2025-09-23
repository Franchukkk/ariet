'use client'

import styled from 'styled-components'

import { Form } from '../../components/Form/Form'
import { DownloadButton } from '../../components/OnlineSupport/DownloadButton'
import { Hero } from '../../components/OnlineSupport/Hero/Hero'

export const ClientComponent = () => {
	return (
		<StyledOnlineSupport className='main-wrapper'>
			<Hero />
			<DownloadButton />
			<Form title={`Заполните форму\nрегистрации`} />
		</StyledOnlineSupport>
	)
}

const StyledOnlineSupport = styled.div``
