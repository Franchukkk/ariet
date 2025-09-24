'use client'

import { Pencil } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useMe } from '@/hooks/useMe'

const CardWrapper = styled.div`position:relative;display:flex;flex-direction:column;align-items:center;border-radius:16px;padding:70px 40px;text-align:center;@media(max-width:768px){padding:40px 20px;gap:14px;}}`
const Corner = styled.div<{ pos: 'tl' | 'tr' | 'bl' | 'br' }>`
	position: absolute;
	width: 50px;
	height: 50px;
	${({ pos }) => pos === 'tl' && `top:-10px;left:-10px;transform:rotate(0deg);`}
	${({ pos }) =>
		pos === 'tr' && `top:-10px;right:-10px;transform:rotate(90deg);`}
  ${({ pos }) =>
		pos === 'br' && `bottom:-10px;right:-10px;transform:rotate(180deg);`}
  ${({ pos }) =>
		pos === 'bl' && `bottom:-10px;left:-10px;transform:rotate(270deg);`}
`
const AvatarContainer = styled.div`position:relative;margin-bottom:16px;@media(max-width:768px){margin-bottom:22px;}}`
const AvatarWrapper = styled.div`width:240px;height:240px;border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden;@media(max-width:768px){width:150px;height:150px;}}`
const AvatarImage = styled(Image)`
	border-radius: 50%;
	object-fit: cover;
`
const EditButton = styled.button`position:absolute;top:10px;right:-1px;width:50px;height:50px;border-radius:50%;background:#3a3a3a;border:2px solid #1a1a1a;display:flex;align-items:center;justify-content:center;cursor:pointer;svg{width:18px;height:18px;color:#fff;} &:hover{background:#4bc785;}}`
const Name = styled.h2`color:#ffffff;font-weight:600;font-size:30px;line-height:58px;letter-spacing:0%;text-align:center;@media(max-width:768px){font-size:22px;line-height:32px;margin:6px 0 4px;}}`
const Role = styled.p`font-weight:600;font-size:20px;color:#ffff;line-height:58px;letter-spacing:0%;text-align:center;text-transform:uppercase;@media(max-width:768px){font-size:16px;line-height:28px;margin:2px 0 8px;}}`
const Label = styled.p`font-size:18px;color:#a3a3a3;font-weight:300;line-height:58px;letter-spacing:0%;text-align:center;@media(max-width:768px){font-size:14px;line_height:24px;margin:6px 0 6px;}}`
const PromoPill = styled.p`padding:10px 20px;border:1px solid #4bc785;border-radius:10px;color:#ffffff;font-weight:700;font-size:18px;line-height:27px;@media(max-width:768px){margin-top:6px;margin-bottom:6px;}}`

export default function ProfileCard() {
	const { t } = useTranslation('common')
	const { me, loading } = useMe()

	if (loading || !me) return <p style={{ color: '#fff' }}>Loading...</p>

	const nameUpper = (me.full_name || '').toUpperCase()
	const promoText =
		(me.promo_code || '').trim() ||
		(t('AdminDashboard.no_promocode') as string) ||
		'Промокод відсутній'

	return (
		<CardWrapper>
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
						alt={me.full_name}
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
