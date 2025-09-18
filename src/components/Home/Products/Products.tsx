'use client'

import { useState } from 'react'
import styled from 'styled-components'

import { Button } from './Button'
import { Header } from './Header/Header'
import { List } from './List'

const CATEGORY_VALUES = ['новинки', 'проектні рішення', 'лідери продажів']

export const Products = () => {
	const [activeIndex, setActiveIndex] = useState(0)

	return (
		<StyledProducts className='main-wrapper'>
			<Header
				active={activeIndex}
				setActive={setActiveIndex}
			/>
			<List activeCategory={CATEGORY_VALUES[activeIndex]} />
			<Button />
		</StyledProducts>
	)
}

const StyledProducts = styled.div`
	margin-bottom: 142px;
	@media (max-width: 1000px) {
		margin-bottom: 40px;
	}
`
