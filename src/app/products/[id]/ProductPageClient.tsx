'use client'

import { useState } from 'react'
import styled from 'styled-components'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Autonomy } from '@/components/Product/Autonomy/Autonomy'
import { Models } from '@/components/Product/Models/Models'
import { Possibilities } from '@/components/Product/Possibilities/Possibilities'
import { ProductInformation } from '@/components/Product/ProductInformation/ProductInformation'
import { ProductVariant } from '@/components/Product/ProductVariant/ProductVariant'
import { Specifications } from '@/components/Product/Specifications/Specifications'
import { Steps } from '@/components/Product/Steps/Steps'
import { Support } from '@/components/Support/Support'

export default function ProductPageClient({
	id,
	initialName = ''
}: {
	id: number
	initialName?: string
}) {
	const [productName, setProductName] = useState<string>(initialName)

	return (
		<>
			<ProductVariant />

			<div>
				<Breadcrumbs
					path={['Главная', 'Продукция', productName]}
					alias={['/', 'products', 'current']}
				/>
			</div>

			<Stack as='main'>
				{/* ProductInformation має вміти оновити назву після завантаження */}
				<ProductInformation setProductName={setProductName} />
				<Steps />
				<Specifications />
				<Autonomy />
				<Possibilities />
				<Models />
				<Support />
			</Stack>
		</>
	)
}

const Stack = styled.div`
	& > * + * {
		margin-top: clamp(32px, 5vw, 80px);
	}
`
