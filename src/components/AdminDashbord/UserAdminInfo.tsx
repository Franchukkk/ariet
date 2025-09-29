'use client'

import { StaticImageData } from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import cornerDown from '@/assets/img/corner2.png'
import corner from '@/assets/img/corner.png'
import bg from '@/assets/img/user-bg.png'
import userAdministrator from '@/assets/img/user_administrator.png'

type ImgLike = string | StaticImageData

const API_BASE = 'https://rpktask.sytes.net/api'

type MeResponse = {
	email: string
	role: 'CLIENT' | 'ADMIN' | 'MANAGER' | string
	full_name: string
	phone: string
	promo_code?: string | null
}

const roleLabel = (r?: string) =>
	r === 'ADMIN'
		? 'Адміністратор'
		: r === 'MANAGER'
			? 'Менеджер'
			: r === 'CLIENT'
				? 'Клієнт'
				: r || 'Користувач'

export const UserAdminInfo = () => {
	const { t } = useTranslation('common')

	const [me, setMe] = useState<MeResponse | null>(null)

	useEffect(() => {
		const load = async () => {
			try {
				const token =
					typeof window !== 'undefined'
						? localStorage.getItem('accessToken')
						: null
				const headers: HeadersInit = {
					'Content-Type': 'application/json',
					...(token ? { Authorization: `Bearer ${token}` } : {})
				}
				const r = await fetch(`${API_BASE}/users/me/`, { headers })
				if (!r.ok) return
				const data: MeResponse = await r.json()
				setMe(data)
			} catch {}
		}
		load()
	}, [])

	const fullName = (me?.full_name || '').trim()
	const parts = fullName.split(/\s+/)
	const firstName = parts[0] || ''
	const lastName = parts.slice(1).join(' ')
	const shownName =
		lastName || firstName ? `${lastName} ${firstName}`.trim() : '—'

	return (
		<UserWrapper
			$bg={bg}
			className='mr-[20px] max-w-[321px]'
		>
			<WrapperDiv className='bg-[#0D0C0C] rounded-[8px] w-[300px] py-[30px] text-center flex flex-col items-center'>
				<ImgDiv className='relativemb-[20px] w-[231px] h-[231px] rounded-full overflow-hidden mb-[11px]'>
					<img
						src={userAdministrator.src}
						alt='user-administrator'
					/>
				</ImgDiv>

				<NamePerson className='text-[#FFFFFF] text-[18px] leading-[27px] font-bold'>
					{shownName}
				</NamePerson>

				<p className='mb-[10px] text-[#FFFFFF]  text-[18px] leading-[27px] font-[300]'>
					{roleLabel(me?.role)}
				</p>
			</WrapperDiv>

			<Corner
				className='absolute top-0 left-0 rotate-180'
				src={cornerDown.src}
				alt='corner'
			/>
			<Corner
				className='absolute top-0 right-0 rotate-180'
				src={corner.src}
				alt='corner'
			/>
			<Corner
				className='absolute bottom-0 left-0'
				src={corner.src}
				alt='corner'
			/>
			<Corner
				className='absolute bottom-0 right-0'
				src={cornerDown.src}
				alt='corner'
			/>
		</UserWrapper>
	)
}

const Corner = styled.img`
	width: 45px;
	height: 65px;
`

const UserWrapper = styled.div<{ $bg: ImgLike }>`
	position: relative;

	@media (max-width: 600px) {
		max-width: 280px;
	}
	@media (max-width: 800px) {
		margin: auto;
		margin-bottom: 20px;
	}
`

const NamePerson = styled.p`
	display: inline-block;
	font-size: 20px;
	line-height: 30px;
	font-weight: 600;
	color: #ffffff;
	text-transform: uppercase;
	margin-bottom: 20px;
`

const ImgDiv = styled.div`
	width: 170px;
	height: 170px;
	@media (max-width: 600px) {
		width: 200px;
		height: 200px;
	}
`

const WrapperDiv = styled.div`
	@media (max-width: 600px) {
		width: 250px;
	}
`
