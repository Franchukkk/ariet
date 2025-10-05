// app/products/[id]/page.tsx
import { Suspense } from 'react'

import { PublicRoute } from '@/components/PublicRoute/PublicRoute'

import ProductPageClient from './ProductPageClient'
import { getProductName } from '@/lib/server-data'

export const revalidate = 300
export const dynamicParams = true

type PageProps = { params: Promise<{ id: string }> }

export default async function ProductPage({ params }: PageProps) {
	const { id } = await params
	const productId = Number(id)

	const initialName = await getProductName(productId).catch(() => '')

	return (
		<PublicRoute>
			<Suspense fallback={null}>
				<ProductPageClient
					id={productId}
					initialName={initialName}
				/>
			</Suspense>
		</PublicRoute>
	)
}
