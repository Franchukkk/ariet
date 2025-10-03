'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import BurgerIcon from '@/assets/img/burger.svg'
import ArrowIcon from '@/assets/img/select-arrow.svg'

import { Dropdown } from './Dropdown'

export const Catalog = () => {
	const [isOpen, setIsOpen] = useState(false)
	const catalogRef = useRef<HTMLDivElement>(null)
	const { t } = useTranslation('common')

	const handleToggle = () => setIsOpen(prev => !prev)

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (
				catalogRef.current &&
				!catalogRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleOutsideClick)
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick)
		}
	}, [])

	return (
		<StyledCatalog
			ref={catalogRef}
			className={`flex items-center ${isOpen && 'open'}`}
			onClick={handleToggle}
		>
			<BurgerIcon
				aria-label='icon'
				className='mr-5 b-icon'
			/>
			{t('catalog.title')}
			<ArrowIcon
				className='ml-[25px] arrow-down'
				aria-label='icon'
			/>

			<Dropdown onSelect={() => setIsOpen(false)} />
		</StyledCatalog>
	)
}

const StyledCatalog = styled.div`
	font-weight: 400;
	font-size: 14px;
	line-height: 100%;
	letter-spacing: 0%;
	text-align: center;
	color: #f2f2f2;
	border: 1px dashed #ffffff;
	border-radius: 15px;
	padding: 22px 26px;
	height: 62px;
	flex-shrink: 0;
	position: relative;
	cursor: pointer;

	.arrow-down {
		transition: all 0.3s;
		path {
			transition: all 0.3s;
		}
	}

	&.open {
		color: #4bc785;
		.dropdown {
			opacity: 1;
			visibility: visible;
		}
		.arrow-down {
			transform: rotate(180deg);
			path {
				fill: #4bc785;
			}
		}
	}

	@media (max-width: 1400px) {
		padding: 15px;
		grid-column: 1/3;
		justify-content: space-between;
		.b-icon {
			display: none;
		}
	}
	@media (max-width: 1300px) {
		.b-icon {
			display: block;
		}
	}
`
