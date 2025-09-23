import type { Metadata } from 'next'
import 'swiper/css'
import 'swiper/css/navigation'

import { Footer } from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'

import I18nProvider from '@/providers/I18nProvider'

import './globals.css'
import { BasketProvider } from '@/context/BasketContext'

export const metadata: Metadata = {
	title: 'Ariet',
	description: 'Migrated to Next.js'
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='ru'>
			<body>
				<I18nProvider>
					<BasketProvider>
						<div className='app-wrapper'>
							<Header />
							<main>{children}</main>
							<Footer />
						</div>
					</BasketProvider>
				</I18nProvider>
			</body>
		</html>
	)
}
