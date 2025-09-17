import ProfileCard from '@/components/ambassador/ProfileCard'
import ProfileForm from '@/components/ambassador/ProfileForm'
import StatsGrid from '@/components/ambassador/StatsGrid'
import Title from '@/components/ambassador/Title'
import TrainingsCard from '@/components/ambassador/TrainingsList'
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute'

export default function DashboardPage() {
	return (
		<ProtectedRoute>
			<main className='min-h-screen p-6 md:p-8 max-w-[93rem] mx-auto'>
				<Title />

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='md:col-span-1 space-y-6'>
						<ProfileCard />
						<TrainingsCard
							trainings={[
								'Название тренинга номер 1',
								'Название тренинга номер 2',
								'Название тренинга номер 3',
								'Название тренинга номер 4',
								'Название тренинга номер 5',
								'Название тренинга номер 6',
								'Название тренинга номер 7',
								'Название тренинга номер 8',
								'Название тренинга номер 9',
								'Название тренинга номер 10',
								'Название тренинга номер 11'
							]}
						/>
					</div>

					<div className='md:col-span-2 space-y-6'>
						<StatsGrid />
						<ProfileForm />
					</div>
				</div>
			</main>
		</ProtectedRoute>
	)
}
