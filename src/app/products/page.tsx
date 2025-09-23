'use client'

import styled from 'styled-components'

import { PublicRoute } from '@/components/PublicRoute/PublicRoute'

import { Categories } from '../../components/Categories/Categories'
import { Content } from '../../components/Products/Content/Content'

export const dynamic = 'force-dynamic'
export default function Page() {
	return (
		<PublicRoute>
			<StyledProducts>
				<Content />
				<Categories />
			</StyledProducts>
		</PublicRoute>
	)
}

const StyledProducts = styled.div`
	padding-top: 81px;
`
