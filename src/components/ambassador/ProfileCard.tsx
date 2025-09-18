'use client'

import { Pencil } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { getCurrentUserRole, makeAuthenticatedRequest } from '@/helpers/auth'

// styled-components (залишаються без змін)
const CardWrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 16px;
	padding: 70px 40px;
	text-align: center;

	@media (max-width: 768px) {
		padding: 40px 20px;
	}
`

const Corner = styled.div<{ pos: 'tl' | 'tr' | 'bl' | 'br' }>`...`
const AvatarContainer = styled.div`...`
const AvatarWrapper = styled.div`...`
const AvatarImage = styled(Image)`...`
const EditButton = styled.button`...`
const Name = styled.h2`...`
const Role = styled.p`...`
const Label = styled.p`...`
const PromoButton = styled.button<{ $active?: boolean }>`...`

const CornerSVG = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='50'
		height='50'
		fill='none'
		stroke='#4bc785'
		strokeWidth='1'
		strokeDasharray='4 4'
	>
		<path d='M50 0 H15 L0 15 V50' />
	</svg>
)

export default function ProfileCard() {
	const { t } = useTranslation('common')
	const [userData, setUserData] = useState<{
		full_name: string
		role: string
		promo_code: string
	} | null>(null)
	const [promoValid, setPromoValid] = useState<boolean | null>(null)
	const router = useRouter()

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const role = await getCurrentUserRole()
				if (role !== 'ambassador') {
					router.push('/')
					return
				}

				const res = await makeAuthenticatedRequest(
					'https://rpktask.sytes.net/api/users/me/'
				)

				if (res.ok) {
					const data = await res.json()
					setUserData({
						full_name: data.full_name || 'Unknown',
						role: data.role || 'unknown',
						promo_code: data.promo_code || 'no-code'
					})
				} else {
					console.warn('Unexpected status:', res.status)
					setUserData({
						full_name: 'Unknown',
						role: 'unknown',
						promo_code: 'no-code'
					})
				}
			} catch (error) {
				console.error('Error loading profile:', error)
				setUserData({
					full_name: 'Unknown',
					role: 'unknown',
					promo_code: 'no-code'
				})
			}
		}

		fetchUserData()
	}, [router])

	useEffect(() => {
		const checkPromo = async () => {
			if (!userData?.promo_code) return
			try {
				const res = await makeAuthenticatedRequest(
					`https://rpktask.sytes.net/api/promocodes/check/?code=${userData.promo_code}`
				)
				if (res.status === 200) {
					setPromoValid(true)
				} else if (res.status === 404) {
					setPromoValid(false)
				} else {
					console.warn('Unexpected status:', res.status)
					setPromoValid(null)
				}
			} catch (e) {
				console.error('Promo check failed:', e)
				setPromoValid(null)
			}
		}

		checkPromo()
	}, [userData])

	if (!userData) {
		return <p style={{ color: '#fff' }}>Loading...</p>
	}

	return (
		<CardWrapper>
			<Corner pos='tl'>
				<CornerSVG />
			</Corner>
			<Corner pos='tr'>
				<CornerSVG />
			</Corner>
			<Corner pos='br'>
				<CornerSVG />
			</Corner>
			<Corner pos='bl'>
				<CornerSVG />
			</Corner>

			<AvatarContainer>
				<AvatarWrapper>
					<AvatarImage
						src='/avatar.jpg'
						alt={userData.full_name || 'User Avatar'}
						width={240}
						height={240}
					/>
				</AvatarWrapper>
				<EditButton>
					<Pencil />
				</EditButton>
			</AvatarContainer>

			<Name>{userData.full_name?.toUpperCase?.() || 'UNKNOWN'}</Name>
			<Role>{t('ambassador.role') || userData.role}</Role>
			<Label>{t('ambassador.promo_code')}</Label>

			<PromoButton $active={promoValid ?? undefined}>
				{userData.promo_code}
				{' — '}
				{promoValid === true && 'valid'}
				{promoValid === false && 'invalid'}
				{promoValid === null && 'checking...'}
			</PromoButton>
		</CardWrapper>
	)
}
