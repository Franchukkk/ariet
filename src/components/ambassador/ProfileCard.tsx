'use client'

import { Pencil } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useMe } from '@/hooks/useMe'

const API_BASE = 'https://test.arietpower.com/api'

export default function ProfileCard() {
	const { t } = useTranslation('common')
	const { me, loading /*, refetch */ } = useMe()

	const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const fileRef = useRef<HTMLInputElement | null>(null)

	const currentAvatar =
		avatarUrl ??
		(me?.avatar && String(me.avatar).trim() ? String(me.avatar) : '/avatar.jpg')

	const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		setError(null)

		if (!file.type.startsWith('image/')) {
			setError('Оберіть, будь ласка, зображення')
			e.target.value = ''
			return
		}
		if (file.size > 5 * 1024 * 1024) {
			setError('Файл завеликий (макс 5 МБ)')
			e.target.value = ''
			return
		}

		try {
			setUploading(true)
			const token =
				typeof window !== 'undefined'
					? localStorage.getItem('accessToken')
					: null

			const fd = new FormData()
			fd.append('avatar', file) // бек очікує ключ "avatar"

			// Не задаємо Content-Type — браузер сам додасть boundary
			let r = await fetch(`${API_BASE}/users/me/`, {
				method: 'PATCH',
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				body: fd
			})

			// fallback, якщо PATCH не доступний
			if (!r.ok && r.status === 405) {
				r = await fetch(`${API_BASE}/users/me/`, {
					method: 'PUT',
					headers: token ? { Authorization: `Bearer ${token}` } : undefined,
					body: fd
				})
			}

			// локальний прев’ю
			const localUrl = URL.createObjectURL(file)
			setAvatarUrl(localUrl)
			// refetch?.() // при потребі підтягнути оновлені дані користувача
		} catch (e: any) {
			setError(e?.message || 'Не вдалося завантажити аватар')
		} finally {
			setUploading(false)
			if (fileRef.current) fileRef.current.value = ''
		}
	}

	if (loading || !me) return <p style={{ color: '#fff' }}>Loading...</p>

	const nameUpper = (me.full_name || '').toUpperCase()
	const promoText =
		(me.promo_code || '').trim() ||
		(t('AdminDashboard.no_promocode') as string) ||
		'Промокод відсутній'

	// знижка біля промокоду (якщо є)
	const discountRaw = me.promocode_discount_percent ?? ''
	const discountNum = Number(discountRaw)
	const hasDiscount =
		(typeof discountRaw === 'string' && discountRaw.trim() !== '') ||
		Number.isFinite(discountNum)

	// показуємо як рядок + символ %; якщо бек дає число 50 — буде "50%"
	const discountLabel =
		String(discountRaw ?? '')
			.toString()
			.trim() !== ''
			? `${String(discountRaw).toString().trim()}%`
			: Number.isFinite(discountNum)
				? `${discountNum}%`
				: ''

	return (
		<CardWrapper>
			<Corner pos='tl'>
				<CornerSvg />
			</Corner>
			<Corner pos='tr'>
				<CornerSvg />
			</Corner>
			<Corner pos='br'>
				<CornerSvg />
			</Corner>
			<Corner pos='bl'>
				<CornerSvg />
			</Corner>

			<AvatarContainer>
				<AvatarWrapper>
					<AvatarImage
						src={currentAvatar}
						alt={me.full_name || 'avatar'}
						fill
						sizes='(max-width:768px) 150px, 231px'
					/>
				</AvatarWrapper>

				<EditButton
					type='button'
					disabled={uploading}
					onClick={() => fileRef.current?.click()}
					aria-label={t('AdminDashboard.edit') || 'Edit avatar'}
					title={t('AdminDashboard.edit') || 'Edit avatar'}
				>
					<Pencil />
				</EditButton>

				<input
					ref={fileRef}
					type='file'
					accept='image/*'
					hidden
					onChange={onPickFile}
				/>
			</AvatarContainer>

			{uploading && <Uploading>Завантаження…</Uploading>}
			{error && <ErrorText>{error}</ErrorText>}

			<Name>{nameUpper}</Name>
			<Role>{t('ambassador.role')}</Role>

			<Label>{t('AdminDashboard.my_promocode')}</Label>

			<PromoRow>
				<PromoPill>{promoText}</PromoPill>
				{hasDiscount && discountLabel && (
					<DiscountBadge aria-label='Promo discount'>
						−{discountLabel}
					</DiscountBadge>
				)}
			</PromoRow>
		</CardWrapper>
	)
}

/* ---------------- styled ---------------- */

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
		gap: 14px;
	}
`

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

const CornerSvg = () => (
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

const AvatarContainer = styled.div`
	position: relative;
	margin-bottom: 16px;
	@media (max-width: 768px) {
		margin-bottom: 22px;
	}
`

const AvatarWrapper = styled.div`
	width: 231px;
	aspect-ratio: 1 / 1; /* завжди квадрат */
	border-radius: 50%;
	overflow: hidden;
	display: grid; /* зручно центрувати */
	place-items: center;

	@media (max-width: 768px) {
		width: 150px;
	}
`

const AvatarImage = styled(Image)`
	width: 100%;
	height: 100%;
	object-fit: cover; /* не спотворює пропорції */
	border-radius: 50%;
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
	&:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
`

const Uploading = styled.div`
	margin-top: -8px;
	margin-bottom: 6px;
	font-size: 13px;
	color: #9ca3af;
`

const ErrorText = styled.div`
	margin-top: -2px;
	margin-bottom: 8px;
	font-size: 13px;
	color: #ef4444;
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
		margin: 6px 0 4px;
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
		margin: 2px 0 8px;
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
		margin: 6px 0 6px;
	}
`

const PromoRow = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 10px;
`

const PromoPill = styled.p`
	padding: 10px 20px;
	border: 1px solid #4bc785;
	border-radius: 10px;
	color: #ffffff;
	font-weight: 700;
	font-size: 18px;
	line-height: 27px;
	@media (max-width: 768px) {
		margin-top: 6px;
		margin-bottom: 6px;
	}
`

const DiscountBadge = styled.span`
	padding: 6px 10px;
	border-radius: 999px;
	background: #1a1a1a;
	border: 1px dashed #4bc785;
	color: #4bc785;
	font-weight: 700;
	font-size: 14px;
	line-height: 1;
`
