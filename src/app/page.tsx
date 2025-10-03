import { Categories } from '@/components/Categories/Categories'
import { Banner } from '@/components/Home/Banner/Banner'
import { Info } from '@/components/Home/Info/Info'
import { Products } from '@/components/Home/Products/Products'
import { WhyUs } from '@/components/Home/WhyUs/WhyUs'
import { PublicRoute } from '@/components/PublicRoute/PublicRoute'
import { Support } from '@/components/Support/Support'

import { getCategories } from '@/lib/server-data'

export const revalidate = 300

export default async function Page() {
	const lng: 'ru' | 'en' = 'ru'
	const cats = await getCategories(lng)

	return (
		<PublicRoute>
			<Banner />
			<Products />
			<WhyUs />
			<Info />
			<Categories />
			<Support />
		</PublicRoute>
	)
}
