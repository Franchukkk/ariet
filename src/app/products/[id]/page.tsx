'use client'

import { useState } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Autonomy } from '@/components/Product/Autonomy/Autonomy'
import { Models } from '@/components/Product/Models/Models'
import { Possibilities } from '@/components/Product/Possibilities/Possibilities'
import { ProductInformation } from '@/components/Product/ProductInformation/ProductInformation'
import { ProductVariant } from '@/components/Product/ProductVariant/ProductVariant'
import { Specifications } from '@/components/Product/Specifications/Specifications'
import { Steps } from '@/components/Product/Steps/Steps'
import { PublicRoute } from '@/components/PublicRoute/PublicRoute'
import { Support } from '@/components/Support/Support'

export default function ProductPage() {
	const [productName, setProductName] = useState<string>('')

	return (
		<PublicRoute>
			<ProductVariant />
			<div className='mb-[45px]!'>
				<Breadcrumbs
					path={['Главная', 'Продукция', productName]}
					alias={['/', 'products', 'current']}
				/>
			</div>
			<ProductInformation setProductName={setProductName} />
			<Steps />
			<Specifications />
			<Autonomy />
			<Possibilities />
			<Models />
			<Support />
		</PublicRoute>
	)
}
