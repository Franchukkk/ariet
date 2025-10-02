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
				<div className='content-root'>
					<Content />
				</div>

				<Categories />
			</StyledProducts>
		</PublicRoute>
	)
}

const StyledProducts = styled.div`
	padding-top: 81px;

	@media (max-width: 1000px) {
		.content-root h1,
		.content-root h2,
		.content-root h3,
		.content-root .page-title,
		.content-root .title {
			text-align: center;
			line-height: 1.3;
		}
	}
`
