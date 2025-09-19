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
	}
`

const PromoButton = styled.button<{ $active?: boolean }>`
	margin-top: 8px;
	width: 100%;
	padding: 5px 50px;
	border: 1px solid ${({ $active }) => ($active ? '#4bc785' : '#ff4444')};
	border-radius: 8px;
	font-weight: 600;
	font-size: 20px;
	line-height: 58px;
	color: ${({ $active }) => ($active ? '#ffffff' : '#ff4444')};
	transition: all 0.3s ease;
	background: transparent;

	&:hover {
		background: ${({ $active }) => ($active ? '#4bc785' : '#ff4444')};
		color: #000;
	}

	@media (max-width: 768px) {
		font-size: 16px;
		line-height: 36px;
		padding: 5px 20px;
	}
`

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
	const [userData, setUserData] = useState<null | {
		full_name: string
		role: string
		promo_code: string
	}>(null)
	const [promoValid, setPromoValid] = useState<boolean | null>(null)
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
						full_name: data.full_name,
						role: data.role,
						promo_code: data.promo_code
					})
				}
			} catch (error) {
				console.error('Error loading profile:', error)
			}
		}

		fetchUserData()
	}, [router])

	useEffect(() => {
		const checkPromo = async () => {
			if (!userData?.promo_code) return
			try {
				const res = await requestWithToken(
					`https://rpktask.sytes.net/api/promocodes/check/?code=${userData.promo_code}`
				)
				setPromoValid(res.ok)
			} catch (e) {
				console.error('Promo check failed:', e)
				setPromoValid(false)
			}
		}

		checkPromo()
	}, [userData])

	if (!userData) return <p style={{ color: '#fff' }}>Loading...</p>

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
						alt={userData.full_name}
						width={240}
						height={240}
					/>
				</AvatarWrapper>
				<EditButton>
					<Pencil />
				</EditButton>
			</AvatarContainer>

			<Name>{userData.full_name.toUpperCase()}</Name>
			<Role>{t('ambassador.role')}</Role>
			<Label>{t('ambassador.promo_code')}</Label>

			{userData.promo_code ? (
				<>
					<Label>{t('ambassador.promo_code')}</Label>
					<PromoButton $active={promoValid ?? undefined}>
						{userData.promo_code}
						{promoValid === true && ''}
						{promoValid === false && ''}
					</PromoButton>
				</>
			) : (
				<p style={{ color: '#ff4444', marginTop: '20px' }}>
					{t('ambassador.no_promo_code')}
				</p>
			)}
		</CardWrapper>
	)
}
