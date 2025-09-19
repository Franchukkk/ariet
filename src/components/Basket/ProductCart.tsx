import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ArrowUp from '@/assets/img/arrow-up.svg'
import binIcon from '@/assets/img/bin.png'

import { useBasket } from '@/context/BasketContext'
import { formatPrice } from '@/helpers/formatPrice'

interface Product {
	id: number
	variantId: number // ✅ додав
	name: string
	price: number
	photo: any
	description: string
}

interface ProductCartProps {
	product: Product
	index: number
	quantity: number
	onQuantityChange: (variantId: number, value: number) => void // ✅ зміна
}

export const ProductCart = ({
	product,
	index,
	quantity,
	onQuantityChange
}: ProductCartProps) => {
	const { t } = useTranslation('common')
	const [isOpen, setIsOpen] = useState(false)
	const { removeFromBasket } = useBasket()

	const handleRemove = () => {
		removeFromBasket(product.variantId) // ✅ тепер по variantId
	}

	return (
		<WrapperLi
			index={index}
			className={`flex flex-row justify-between py-[20px] px-[35px] border border-dashed p-4 border-[#ffffff42] items-center ${index === 0 ? 'border-t-1' : 'border-t-0'}`}
		>
			<div className='flex items-center justify-center px-[17px] py-[37px] rounded-[8px] bg-[#0D0C0C] '>
				<WrapperImg
					width={124}
					height={80}
					alt={product.name}
					src={
						typeof product.photo === 'string'
							? product.photo
							: product.photo?.src
					}
				/>
			</div>
			<WrapperDescription className='pr-[20px] relative'>
				<p className='text-[14px] pl-[10px] font-medium text-[#7F7F7F] absolute top-[-20px] left-0'>
					{product.description}
				</p>
				<p className='text-[22px] pl-[10px] font-semibold w-[250px]'>
					{product.name}
				</p>
			</WrapperDescription>
			<p className='text-[20px] font-semibold w-[100px] text-center'>
				{formatPrice(product.price)} {t('Basket.currency')}
			</p>

			<label className='relative'>
				<ArrowUp
					aria-label='arrow'
					className={`!absolute top-1/2 right-[5px] -translate-y-1/2 rotate-180 transition-all duration-300 ${isOpen ? 'rotate-0' : ''}`}
				/>
				<CustomSelect
					value={quantity}
					onChange={e =>
						onQuantityChange(product.variantId, Number(e.target.value))
					} // ✅ тепер variantId
				>
					{Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
						<option
							key={num}
							value={num}
						>
							{num}
						</option>
					))}
				</CustomSelect>
			</label>

			<p className='text-[20px] font-semibold text-center'>
				{formatPrice(product.price * quantity)} {t('Basket.currency')}
			</p>

			<StyledDeleteButton onClick={handleRemove}>
				<img
					className='h-[24px] w-[24px]'
					src={binIcon.src}
					alt='Delete'
				/>
			</StyledDeleteButton>
		</WrapperLi>
	)
}

/* --- styles --- */
const StyledDeleteButton = styled.button`
	background: transparent;
	border: none;
	cursor: pointer;

	&:hover img {
		filter: brightness(0) saturate(100%) invert(24%) sepia(83%) saturate(6183%)
			hue-rotate(349deg) brightness(93%) contrast(109%);
	}
`

const CustomSelect = styled.select`
	text-align-last: left;
	padding-left: 20px;

	@media (max-width: 1000px) {
		text-align-last: center;
		padding-left: 0;
	}
`

const WrapperLi = styled.li<{ index: number }>`
	display: grid;
	grid-template-columns: 124px 1fr 100px 90px 100px 40px;
	align-items: center;
	gap: 20px;
	padding: 30px 35px;
	border: 1px dashed #ffffff42;
	border-top-width: ${({ index }) => (index === 0 ? '1px' : '0')};

	& p {
		margin: 0;
	}

	& img {
		display: block;
	}

	@media (max-width: 1000px) {
		grid-template-columns: 1fr;
		grid-template-rows: auto auto auto auto auto auto;
		gap: 10px;
		justify-items: center;

		p {
			text-align: center;
		}

		select {
			margin: 10px 0;
			height: 30px;
		}
	}
`

const WrapperDescription = styled.div`
	@media (max-width: 1000px) {
		padding: 0px;
		> p:first-child {
			position: relative;
			top: 0;
			left: 0;
		}
		> p:last-child {
			margin: auto;
			margin-top: 20px;
			padding: 0 20px;
			width: 100%;
		}
	}
`

const WrapperImg = styled.img`
	@media (max-width: 1000px) {
		margin: auto;
	}
`
