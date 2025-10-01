'use client'

import { useRouter } from 'next/navigation'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const Button = memo(function Button() {
	const { t, ready } = useTranslation('common')
	const router = useRouter()

	const handleClick = () => {
		router.push('/products')
	}

	// Поки i18n не готовий — показуємо плейсхолдер тієї ж геометрії
	if (!ready) return <ButtonSkeleton />

	return (
		<StyledButton
			onClick={handleClick}
			aria-label={t('Button.catalog', 'Catalog')}
		>
			<span className='label'>{t('Button.catalog', 'Catalog')}</span>
		</StyledButton>
	)
})

const StyledButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;

	/* Геометрія зарезервована — уникнення стрибка */
	height: 58px;
	width: 100%;
	min-width: 180px; /* за бажанням: фіксує ширину під різні мови */
	padding-inline: 20px; /* стабільні внутрішні відступи */
	line-height: 1;
	white-space: nowrap;

	border-radius: 61px;
	border: 1px solid #4bc785;

	color: #fff;
	font-weight: 600;
	text-decoration: none;

	/* Лише безпечні transition (без layout-властивостей) */
	transition:
		background-color 0.2s ease,
		color 0.2s ease,
		transform 0.15s ease;
	will-change: transform;

	&:hover {
		background: #4bc785;
		color: #000;
		transform: translateY(-1px);
	}

	&:active {
		transform: translateY(0);
	}
`

const ButtonSkeleton = styled.div`
	height: 58px;
	width: 100%;
	min-width: 180px;
	border-radius: 61px;
	border: 1px solid transparent;
	background: rgba(255, 255, 255, 0.06);
`
