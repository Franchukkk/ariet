'use client'

import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/navigation'
import { KeyboardEvent, useState } from 'react'
import styled from 'styled-components'

import hoverBg from '@/assets/img/category-hover-bg.png'
import Arrow from '@/assets/img/link-arrow.svg'

import { Background } from './Background'

type ImgLike = string | StaticImageData

interface Props {
	className: string
	topTitle?: string
	bottomTitle?: string
	photo?: ImgLike // робимо опційним, якщо бекенд інколи не дає
	href?: string // якщо треба навігація кліком по всій картці
}

export const Card = ({
	className,
	topTitle,
	bottomTitle,
	photo,
	href
}: Props) => {
	const [hovered, setHovered] = useState(false)
	const router = useRouter()

	const go = () => {
		if (href) router.push(href)
	}
	const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
		if (!href) return
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			go()
		}
	}

	const imgSrc =
		typeof photo === 'string'
			? photo.trim() || null
			: photo && 'src' in photo
				? photo
				: null

	return (
		<StyledCard
			className={`flex flex-col justify-between ${className}`}
			$bg={hoverBg}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onClick={go}
			role={href ? 'link' : undefined}
			tabIndex={href ? 0 : -1}
			onKeyDown={onKey}
		>
			{imgSrc && (
				<div className='product-box'>
					<Image
						src={imgSrc}
						alt='product image'
						className='card-product'
						fill
						sizes='(max-width: 1000px) 300px, 356px'
						priority={false}
					/>
				</div>
			)}

			<div className='title'>{topTitle}</div>
			<div className='flex items-center justify-end card-footer'>
				<div className='title'>{bottomTitle}</div>
				<div className='link-btn'>
					<Arrow aria-label='svg' />
				</div>
			</div>
			{hovered ? <Background /> : null}
		</StyledCard>
	)
}

const StyledCard = styled.div<{ $bg: ImgLike }>`
	background: #121212;
	border-radius: 6px;
	font-weight: 600;
	font-size: 18.2px;
	line-height: 100%;
	letter-spacing: 0%;
	padding: 22px 13px 12px 32px;
	cursor: pointer;
	border: 1px dashed transparent;
	transition: all 0.3s;
	position: relative;
	overflow: hidden;

	/* тепер розмір/позиція задаються контейнером */

	.product-box {
		position: absolute;
		overflow: hidden; /* ← не даємо картинці вилазити */
		inset: auto; /* керуємо розмірами у Grid через :nth-child */
		pointer-events: none; /* кліки проходять по всій картці */
	}

	.card-product {
		position: absolute;
		inset: 0; /* <-- картинка рівно в межах product-box */
		object-fit: contain; /* або cover, якщо треба заповнення */
		object-position: center; /* базове положення, деталь нижче у Grid */
	}

	.title {
		z-index: 2;
	}

	.card-footer {
		gap: 18px;
		.link-btn {
			width: 25.5px;
			height: 25.5px;
			border-radius: 4px;
			border: 0.59px solid #d9d9d940;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 6px;
			transition: all 0.3s;
			path {
				transition: all 0.3s;
			}
		}
	}

	&:hover {
		border: 1px dashed #1dcf94;
		background: none;
		.bg-animation {
			opacity: 1;
		}
		.link-btn {
			border: 0.59px solid #1dcf94;
			path {
				fill: #1dcf94;
			}
		}
	}
`
