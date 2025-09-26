'use client'

// @ts-nocheck
import React, { forwardRef, useState } from 'react'
import styled from 'styled-components'

type Props = {
	label: string
	textarea?: boolean
} & React.InputHTMLAttributes<HTMLInputElement> &
	React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
	({ label, textarea, onFocus, onBlur, ...rest }, ref) => {
		const [focused, setFocused] = useState(false)

		const handleFocus = (e: any) => {
			setFocused(true)
			onFocus?.(e)
		}
		const handleBlur = (e: any) => {
			setFocused(false)
			onBlur?.(e)
		}

		return (
			<StyledInput className={focused ? 'active' : ''}>
				<div className='label'>{label}</div>

				{textarea ? (
					<textarea
						ref={ref as React.Ref<HTMLTextAreaElement>}
						onFocus={handleFocus}
						onBlur={handleBlur}
						{...rest} // <-- тут приходять value / onChange / name / required / etc
					/>
				) : (
					<input
						ref={ref as React.Ref<HTMLInputElement>}
						type={rest.type || 'text'}
						onFocus={handleFocus}
						onBlur={handleBlur}
						{...rest} // <-- і тут теж
					/>
				)}
			</StyledInput>
		)
	}
)

Input.displayName = 'Input'

const StyledInput = styled.div`
	.label {
		color: #7f7f7f;
		font-weight: 400;
		font-size: 16px;
		line-height: 100%;
		letter-spacing: 0%;
	}
	input,
	textarea {
		font-weight: 400;
		font-size: 16px;
		line-height: 100%;
		letter-spacing: 0%;
		border-bottom: 1px solid #ffffff8a;
		width: 100%;
		background: none;
		outline: none;
		padding: 5px 0;
	}
	textarea {
		resize: none;
		height: 60px;
		&::-webkit-scrollbar {
			display: none;
		}
	}
	&.active {
		.label {
			color: #1dcf94;
		}
		input,
		textarea {
			border-bottom: 1px solid #1dcf94;
		}
	}
`
