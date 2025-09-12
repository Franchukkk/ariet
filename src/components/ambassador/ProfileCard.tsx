'use client'

import { Pencil } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const CardWrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 16px;
	padding: 70px 40px;
	text-align: center;
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
`

const Role = styled.p`
	font-weight: 600;
	font-size: 20px;
	color: #ffff;
	line-height: 58px;
	letter-spacing: 0%;
	text-align: center;
	text-transform: uppercase;
`

const Label = styled.p`
	font-size: 13px;
	color: #a3a3a3;

	font-weight: 300;
	font-style: Light;
	font-size: 18px;

	line-height: 58px;
	letter-spacing: 0%;
	text-align: center;
	vertical-align: middle;
`

const PromoButton = styled.button`
	margin-top: 8px;
	width: 100%;
	padding: 5px 60px;
	border: 1px solid #4bc785;
	border-radius: 8px;
	font-weight: 600;
	font-size: 20px;
	line-height: 58px;
	letter-spacing: 0%;
	color: #ffffff;
	transition: all 0.3s ease;
	background: transparent;

	&:hover {
		background: #4bc785;
		color: #000;
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
						alt='Овчаренко Ірина'
						width={240}
						height={240}
					/>
				</AvatarWrapper>
				<EditButton>
					<Pencil />
				</EditButton>
			</AvatarContainer>

			<Name>ОВЧАРЕНКО ИРИНА</Name>
			<Role>{t('ambassador.role')}</Role>
			<Label>{t('ambassador.promo_code')}</Label>
			<PromoButton>OVCHARENKO200</PromoButton>
		</CardWrapper>
	)
}
