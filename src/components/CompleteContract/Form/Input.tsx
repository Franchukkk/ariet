import { useState } from 'react'
import styled from 'styled-components'

interface Props {
	label: string
	name: string
	type?: string
	required?: boolean
	textarea?: boolean
}

export const Input = ({
	label,
	name,
	type = 'text',
	required,
	textarea
}: Props) => {
	const [focused, setFocused] = useState(false)

	const handleInvalid = (
		e: React.InvalidEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const el = e.currentTarget
		let msg = ''

		if (el.validity.valueMissing) {
			msg = `Поле «${label}» є обов'язковим`
		} else if (el instanceof HTMLInputElement) {
			if (el.type === 'email' && el.validity.typeMismatch) {
				msg = 'Введіть коректний email'
			}
			// якщо додасте pattern для телефону — отримаєте це повідомлення
			if (el.type === 'tel' && el.validity.patternMismatch) {
				msg = 'Введіть коректний номер телефону'
			}
		}

		el.setCustomValidity(msg)
	}

	const clearValidity = (
		e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		e.currentTarget.setCustomValidity('')
	}

	return (
		<StyledInput className={`${focused && 'active'}`}>
			<div className='label'>{label}</div>

			{textarea ? (
				<textarea
					name={name}
					required={required}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					onInvalid={handleInvalid}
					onInput={clearValidity}
					aria-label={label}
				/>
			) : (
				<input
					type={type}
					name={name}
					required={required}
					// опц.: вкажіть патерн для телефона (UA приклад):
					// pattern="^\+?[\d\s\-\(\)]{7,}$"
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					onInvalid={handleInvalid}
					onInput={clearValidity}
					aria-label={label}
				/>
			)}
		</StyledInput>
	)
}

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
