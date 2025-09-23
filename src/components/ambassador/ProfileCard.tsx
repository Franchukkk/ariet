'use client'

import { Pencil } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { getAccessToken, logout, refreshToken } from '@/helpers/auth'

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
		gap: 14px; /* ↑ загальний вертикальний інтервал між блоками */
	}
`

const Corner = styled.div<{ pos: 'tl' | 'tr' | 'bl' | 'br' }>`
	position: absolute;
	width: 50px;
	height: 50px;

	${({ pos }) =>
		pos === 'tl' && `top: -10px; left: -10px; transform: rotate(0deg);`}
	${({ pos }) =>
		pos === 'tr' && `top: -10px; right: -10px; transform: rotate(90deg);`}
  ${({ pos }) =>
		pos === 'br' && `bottom: -10px; right: -10px; transform: rotate(180deg);`}
  ${({ pos }) =>
		pos === 'bl' && `bottom: -10px; left: -10px; transform: rotate(270deg);`}
`

const AvatarContainer = styled.div`
	position: relative;
	margin-bottom: 16px;

	@media (max-width: 768px) {
		margin-bottom: 22px; /* ↑ трохи більше під аватаром */
	}
`

const AvatarWrapper = styled.div`
	width: 240px;
	height: 240px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;

	@media (max-width: 768px) {
		width: 150px;
		height: 150px;
	}
`

const AvatarImage = styled(Image)`
	border-radius: 50%;
	object-fit: cover;
`

const EditButton = styled.button`
	position: absolute;
	top: 10px;
	right: -1px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	background: #3a3a3a;
	border: 2px solid #1a1a1a;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	svg {
		width: 18px;
		height: 18px;
		color: #fff;
	}
	&:hover {
		background: #4bc785;
	}
`

const Name = styled.h2`
	color: #ffffff;
	font-weight: 600;
	font-size: 30px;
	line-height: 58px;
	letter-spacing: 0%;
	text-align: center;

	@media (max-width: 768px) {
		font-size: 22px;
		line-height: 32px;
		margin: 6px 0 4px; /* ↑ відступи навколо імені */
	}
`

const Role = styled.p`
	font-weight: 600;
	font-size: 20px;
	color: #ffff;
	line-height: 58px;
	letter-spacing: 0%;
	text-align: center;
	text-transform: uppercase;

	@media (max-width: 768px) {
		font-size: 16px;
		line-height: 28px;
		margin: 2px 0 8px; /* ↑ відступ під роллю */
	}
`

const Label = styled.p`
	font-size: 18px;
	color: #a3a3a3;
	font-weight: 300;
	line-height: 58px;
	letter-spacing: 0%;
	text-align: center;

	@media (max-width: 768px) {
		font-size: 14px;
		line-height: 24px;
		margin: 6px 0 6px; /* ↑ відступи для підписів */
	}
`

/* Пігулка промокоду з такими самими стилями та мобільним відступом */
const PromoPill = styled.p`
	padding: 10px 20px;
	border: 1px solid #4bc785;
	border-radius: 10px;
	color: #ffffff;
	font-weight: 300;
	font-size: 18px;
	line-height: 27px;
	font-weight: 700; /* відповідає font-bold */
	@media (max-width: 768px) {
		margin-top: 6px; /* ↑ відступ над пігулкою */
		margin-bottom: 6px; /* ↑ відступ під пігулкою */
	}
`

type UserMe = {
	full_name: string
	role: string
	promo_code: string
}

export default function ProfileCard() {
	const { t } = useTranslation('common')
	const [userData, setUserData] = useState<UserMe | null>(null)
	const router = useRouter()

	const requestWithToken = async (
		input: RequestInfo,
		init?: RequestInit
	): Promise<Response> => {
		let token = getAccessToken()
		if (!token) {
			const refreshed = await refreshToken()
			if (!refreshed) {
				logout()
				throw new Error('Unauthorized')
			}
			token = getAccessToken()
		}
		let res = await fetch(input, {
			...init,
			headers: {
				...init?.headers,
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		})
		if (res.status === 401 || res.status === 403) {
			const refreshed = await refreshToken()
			if (refreshed) {
				const newToken = getAccessToken()
				res = await fetch(input, {
					...init,
					headers: {
						...init?.headers,
						Authorization: `Bearer ${newToken}`,
						'Content-Type': 'application/json'
					}
				})
			} else {
				logout()
				throw new Error('Session expired')
			}
		}
		return res
	}

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const res = await requestWithToken(
					'https://rpktask.sytes.net/api/users/me/'
				)
				if (res.ok) {
					const data = await res.json()
					setUserData({
						full_name: data?.full_name || '',
						role: data?.role || '',
						promo_code: data?.promo_code || ''
					})
				}
			} catch (error) {
				console.error('Error loading profile:', error)
			}
		}
		fetchUserData()
	}, [router])

	if (!userData) return <p style={{ color: '#fff' }}>Loading...</p>

	const nameUpper = (userData.full_name || '').toUpperCase()
	const promoText =
		(userData.promo_code || '').trim() ||
		t('AdminDashboard.no_promocode') ||
		'Промокод відсутній'

	return (
		<CardWrapper>
			{/* кути */}
			<Corner pos='tl'>
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
			</Corner>
			<Corner pos='tr'>
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
			</Corner>
			<Corner pos='br'>
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
			</Corner>
			<Corner pos='bl'>
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
			</Corner>

			<AvatarContainer>
				<AvatarWrapper>
					<AvatarImage
						src='/avatar.jpg'
						alt={userData.full_name}
						width={240}
						height={240}
					/>
				</AvatarWrapper>
				<EditButton>
					<Pencil />
				</EditButton>
			</AvatarContainer>

			<Name>{nameUpper}</Name>
			<Role>{t('ambassador.role')}</Role>

			<Label>{t('AdminDashboard.my_promocode')}</Label>
			<PromoPill>{promoText}</PromoPill>
		</CardWrapper>
	)
}
