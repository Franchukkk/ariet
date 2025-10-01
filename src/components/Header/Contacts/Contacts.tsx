'use client'

import { useRef } from 'react'
import styled from 'styled-components'

import { Language, type LanguageHandle } from '../Catalog//Language/Language'

import { Divider } from './Divider'
import { Phone } from './Phone'

export const Contacts = () => {
	const langRef = useRef<LanguageHandle>(null)

	return (
		<StyledContacts
			className='flex items-center'
			onClick={e => {
				if (e.target === e.currentTarget) {
					e.stopPropagation()
					langRef.current?.toggle()
				}
			}}
		>
			<Phone />
			<Divider />
			<Language ref={langRef} />
		</StyledContacts>
	)
}

const StyledContacts = styled.div`
	/* товщина невидимого розширення кліка */
	--hit: 14px;

	position: relative;
	padding: 13px 18px 13px 20px;
	border: 1px dashed #ffffff;
	border-radius: 15px;
	height: 62px;
	flex-shrink: 0;
	overflow: visible;

	/* курсор: pointer коли наводишся на бордер/хіт-слоп,
     тобто саме на контейнер (не на дітей) */
	cursor: default;

	&::before {
		content: '';
		position: absolute;
		inset: calc(-1 * var(--hit));
		border-radius: inherit;
		/* робимо хіт-слоп клікабельним і з pointer-курсор ом */
		cursor: pointer;
	}

	/* діти поверх псевдоелемента */
	> * {
		position: relative;
		z-index: 1;
	}
`
