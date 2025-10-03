'use client'

import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import IconSvg from '@/assets/img/swipe-icon.svg'

interface Props {
	active: number
	nextSlide: string
	total: number
}

export const Footer = memo(function Footer({
	active,
	total,
	nextSlide
}: Props) {
	const { t } = useTranslation('common')

	const isLast = total === active + 1

	return (
		<StyledFooter className='flex items-center gap-2'>
			{active + 1}{' '}
			<span>
				/ {total} {isLast ? '' : t('title.next')}{' '}
			</span>
			{isLast ? null : (
				<>
					{nextSlide} <IconSvg aria-label='icon' />
				</>
			)}
		</StyledFooter>
	)
})

const StyledFooter = styled.div`
	position: absolute;
	left: 37px;
	bottom: 17px;
	font-weight: 300;
	font-size: 15px;
	line-height: 100%;
	letter-spacing: 0%;
	color: #fff;
	z-index: 3;

	span {
		color: #ffffff4d;
	}

	@media (max-width: 700px) {
		display: none;
	}
`
