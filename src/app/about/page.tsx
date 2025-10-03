// app/about/page.tsx
import { ClientComponent } from '@/components/About/ClientComponent'

export const dynamic = 'error' // ✅ гарантуємо повністю статичний рендер
export const revalidate = false // сторінка не залежить від даних

export default function Page() {
	return <ClientComponent />
}
