'use client'

import styled from 'styled-components'

const LANGS = [
	{ code: 'en', label: 'ENG' },
	{ code: 'ru', label: 'РУС' }
] as const

type Lang = (typeof LANGS)[number]['code']

type Props = {
	current: Lang
	onSelect: (lng: Lang) => void
}

export const Dropdown = ({ current, onSelect }: Props) => {
	const options = LANGS.filter(l => l.code !== current)
	if (options.length === 0) return null

	return (
		<StyledDropdown
			className='dropdown'
			role='listbox'
			aria-label='Language options'
		>
			{options.map(({ code, label }) => (
				<div
					key={code}
					role='option'
					aria-selected={false}
					onClick={e => {
						e.stopPropagation()
						onSelect(code)
					}}
				>
					{label}
				</div>
			))}
		</StyledDropdown>
	)
}

const StyledDropdown = styled.div`
	position: absolute;
	top: calc(100% + 10px);
	left: 50%;
	transform: translateX(-50%);
	width: 52px;
	background: #000000;
	font-weight: 400;
	font-size: 14px;
	line-height: 100%;
	color: #f2f2f2;
	text-align: left;
	transition: all 0.3s;
	opacity: 0;
	visibility: hidden;

	div {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px 16px;
		height: 34px;
		cursor: pointer;
		&:hover {
			background: #181818;
		}
	}
`
