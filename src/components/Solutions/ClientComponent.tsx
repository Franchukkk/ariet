'use client'

import styled from 'styled-components'

import { PublicRoute } from '@/components/PublicRoute/PublicRoute'

import { Form } from '../../components/Form/Form'
import { LightPlanet } from '../../components/LightPlanet/LightPlanet'
import { Advantages } from '../../components/Solutions/Advantages/Advantages'
import { Autonomy } from '../../components/Solutions/Autonomy/Autonomy'
import { Hero } from '../../components/Solutions/Hero/Hero'
import { MaterialTitle } from '../../components/Solutions/MaterialTitle'
import { Parameters } from '../../components/Solutions/Parameters/Parameters'

export const ClientComponent = () => {
	return (
		<PublicRoute>
			<StyledSolutions className='main-wrapper'>
				<Hero />
				<Parameters />
				<Advantages />
				<MaterialTitle />
				<Autonomy />
				<LightPlanet />
				<Form title={`Расскажите нам о своей задаче`} />
			</StyledSolutions>
		</PublicRoute>
	)
}

const StyledSolutions = styled.div``
