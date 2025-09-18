'use client'

import styled from 'styled-components'

import { Providing } from '@/components/About/Providing/Providing'

import { Global } from '../../components/About/Global/Global'
import { Goal } from '../../components/About/Goal/Goal'
import { Hero } from '../../components/About/Hero/Hero'
import { Standarts } from '../../components/About/Standarts/Standarts'
import { Title } from '../../components/About/Title/Title'
import { Support } from '../../components/Support/Support'
import { PublicRoute } from '@/components/PublicRoute/PublicRoute'

export default function Page() {
	return (
		<PublicRoute>
			<StyledAbout>
				<Hero />
				<Goal />
				<Providing />
				<Support />
				<Standarts />
				<Global />
				<Title />
			</StyledAbout>
		</PublicRoute>
	)
}

const StyledAbout = styled.div`
	.support-wrapper {
		padding-bottom: 0;
	}
	.support-title {
		text-align: left;
		br {
			display: block;
		}
	}
	.planet-wrapper {
		top: 230px;
	}
`
