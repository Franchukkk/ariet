import { PublicRoute } from '@/components/PublicRoute/PublicRoute'
import { Banner } from '../components/Home/Banner/Banner'
import { Info } from '../components/Home/Info/Info'
import { Products } from '../components/Home/Products/Products'
import { WhyUs } from '../components/Home/WhyUs/WhyUs'
import { Support } from '../components/Support/Support'

export default function Page() {
	return (
		<PublicRoute>
			<Banner />
			<Products />
			<WhyUs />
			<Info />
			<Support />
		</PublicRoute>
	)
}
