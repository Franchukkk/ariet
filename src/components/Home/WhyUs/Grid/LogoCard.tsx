'use client'

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import LogoSvg from '@/assets/img/outline-logo.svg'

export const LogoCard = ({ loading = false }: { loading?: boolean }) => {
	const { t, ready } = useTranslation('common')
	const isLoading = loading || !ready

	if (isLoading) return <LogoCardSkeleton aria-hidden />

	return (
		<StyledLogoCard>
			<LogoWrap>
				{/* Зафіксована геометрія SVG -> без стрибка при завантаженні */}
				<LogoSvg
					aria-label='logo-svg'
					width={107}
					height={132}
				/>
			</LogoWrap>
			<Title
				/* html з локалі — рендеримо коли готово, але висота зарезервована стилями */
				dangerouslySetInnerHTML={{ __html: t('logo_card.text') }}
			/>
		</StyledLogoCard>
	)
}

const StyledLogoCard = styled.div`
	padding: 43px 28px 26px 23px;
	color: #fff;
	text-transform: uppercase;
	border-radius: 16px;
	background: rgba(255, 255, 255, 0.03);
`

const LogoWrap = styled.div`
	margin-bottom: 34px;

	/* фіксуємо місце для логотипа */
	width: 107px;
	height: 135px;

	/* на випадок, якщо svg програється як <img> */
	img,
	svg {
		display: block;
		width: 100%;
		height: 100%;
	}
`

const Title = styled.div`
	margin-top: 34px;
	font-weight: 300;
	font-size: 15px;
	line-height: 20px;
	letter-spacing: 0;
`

/* Скелет логокарти — займає ту саму геометрію */
const LogoCardSkeleton = styled.div`
	padding: 43px 28px 26px 23px;
	border-radius: 16px;
	background: rgba(255, 255, 255, 0.06);

	&:before,
	&:after {
		content: '';
		display: block;
		background: rgba(0, 0, 0, 0.18);
		border-radius: 8px;
	}

	/* місце під логотип */
	&:before {
		width: 107px;
		height: 132px;
		margin-bottom: 34px;
	}

	/* кілька рядків тексту */
	&:after {
		height: 40px;
		width: 80%;
	}
`
