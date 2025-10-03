'use client'

import styled from 'styled-components'

import IconSvg from '@/assets/img/delete-x.svg'

interface Props {
	title: string
	onRemove: () => void
}

export const Tag = ({ title, onRemove }: Props) => (
	<StyledTag
		className='flex items-center gap-2.5'
		role='button'
		tabIndex={0}
		aria-label={`Remove ${title}`}
		onClick={onRemove}
		onKeyDown={e => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				onRemove()
			}
		}}
	>
		{title}
		<button
			className='x-btn'
			type='button'
			aria-label={`Remove ${title}`}
			onClick={e => {
				e.stopPropagation()
				onRemove()
			}}
		>
			<IconSvg aria-hidden />
		</button>
	</StyledTag>
)

const StyledTag = styled.div`
	cursor: pointer;
	border-radius: 6px;
	background: #242424;
	padding: 9px 14px 9px 15px;
	font-weight: 300;
	font-size: 14px;
	line-height: 24px;
	letter-spacing: 0%;
	vertical-align: middle;
	color: #ffffffcf;

	.x-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 0;
		border: 0;
		background: transparent;
		padding: 0;
		cursor: pointer;
	}

	&:focus-visible {
		outline: 2px solid #4bc785;
		outline-offset: 2px;
	}
`
