'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
	MouseEvent,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Arrow from '@/assets/img/select-arrow.svg'

import { Dropdown } from './Dropdown'

export type LanguageHandle = {
	toggle: () => void
	open: () => void
	close: () => void
}

export const Language = forwardRef<LanguageHandle, {}>((_, ref) => {
	const { i18n } = useTranslation()
	const base = (i18n.resolvedLanguage || i18n.language || 'ru').split(
		'-'
	)[0] as 'en' | 'ru'

	const [isOpen, setIsOpen] = useState(false)
	const [current, setCurrent] = useState<'en' | 'ru'>(base)

	// ref тепер на "обгортці" з розширеним hitbox-ом
	const wrapRef = useRef<HTMLDivElement>(null)

	const router = useRouter()
	const pathname = usePathname()

	useImperativeHandle(
		ref,
		() => ({
			toggle: () => setIsOpen(s => !s),
			open: () => setIsOpen(true),
			close: () => setIsOpen(false)
		}),
		[]
	)

	const ensureCommon = async (lng: 'en' | 'ru') => {
		const ns = 'common'
		const short = lng.split('-')[0]
		if (!i18n.hasResourceBundle(short, ns)) {
			const res = await fetch(`/locales/${short}/${ns}.json`, {
				cache: 'no-store'
			})
			if (!res.ok) throw new Error(`Missing /locales/${short}/${ns}.json`)
			const data = await res.json()
			i18n.addResourceBundle(short, ns, data, true, true)
		}
	}

	useEffect(() => {
		const onChange = (lng: string) =>
			setCurrent(lng.split('-')[0] as 'en' | 'ru')
		i18n.on('languageChanged', onChange)
		return () => i18n.off('languageChanged', onChange)
	}, [i18n])

	useEffect(() => {
		const onOutside = (e: MouseEvent | globalThis.MouseEvent) => {
			if (!wrapRef.current?.contains(e.target as Node)) setIsOpen(false)
		}
		document.addEventListener('click', onOutside as any)
		return () => document.removeEventListener('click', onOutside as any)
	}, [])

	const handleSelect = async (lng: 'en' | 'ru') => {
		if (lng === current) {
			setIsOpen(false)
			return
		}
		await ensureCommon(lng)
		localStorage.setItem('lng', lng)
		await i18n.changeLanguage(lng)
		document.documentElement.lang = lng

		const params = new URLSearchParams(
			typeof window !== 'undefined' ? window.location.search : ''
		)
		params.set('lng', lng)
		const qs = params.toString()
		const href = qs ? `${pathname}?${qs}` : pathname
		router.replace(href, { scroll: false })

		setIsOpen(false)
	}

	// клік по обгортці: працює на бордері, всередині, та НАД/ПІД селектором (hitbox)
	const onWrapClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = e.target as HTMLElement
		if (el.closest('.dropdown') || el.closest('button')) return // не дублюємо
		setIsOpen(s => !s)
	}

	return (
		<StyledLangWrap
			ref={wrapRef}
			className={isOpen ? 'open' : ''}
			onClick={onWrapClick}
			role='button'
			aria-haspopup='listbox'
			aria-expanded={isOpen}
			tabIndex={0}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					setIsOpen(s => !s)
				}
			}}
		>
			{/* невидимий вертикальний hitbox — клікається вище/нижче селектора */}
			<span
				className='hitbox'
				aria-hidden
			/>

			<StyledLanguage
				onClick={e => {
					// щоб клік по самому селектору не бублився на обгортку
					e.stopPropagation()
					const el = e.target as HTMLElement
					if (el.closest('.dropdown') || el.closest('button')) return
					setIsOpen(s => !s)
				}}
			>
				<button
					type='button'
					className='flex items-center gap-[5px]'
					onClick={e => {
						e.stopPropagation()
						setIsOpen(s => !s)
					}}
					aria-hidden
				>
					<span>{current === 'ru' ? 'РУС' : 'ENG'}</span>
					<Arrow />
				</button>

				<div
					className='dropdown'
					onClick={e => e.stopPropagation()}
				>
					<Dropdown
						current={current}
						onSelect={handleSelect}
					/>
				</div>
			</StyledLanguage>
		</StyledLangWrap>
	)
})
Language.displayName = 'Language'

/* ===== styles ===== */

const StyledLangWrap = styled.div`
	/* регулюй висоту розширення вертикального кліку: */
	--hitY: 14px; /* px вище і нижче */

	position: relative;
	display: inline-flex;
	align-items: center;

	/* курсор-поінтер на всьому селекторі та hitbox-і */
	cursor: pointer;

	/* невидима зона кліку над і під селектором */
	.hitbox {
		position: absolute;
		left: 0;
		right: 0;
		top: calc(-1 * var(--hitY));
		bottom: calc(-1 * var(--hitY));
		/* нічого не малюємо — тільки приймаємо кліки */
		pointer-events: auto;
	}

	&.open .dropdown {
		opacity: 1;
		visibility: visible;
	}
`

const StyledLanguage = styled.div`
	position: relative;
	z-index: 1; /* поверх hitbox-а */
	font-weight: 400;
	font-size: 14px;
	line-height: 100%;
	letter-spacing: 0%;
	color: #f2f2f2;

	/* поінтер і на внутрішній кнопці */
	button {
		cursor: pointer;
	}

	svg {
		transition: all 0.3s;
		path {
			transition: all 0.3s;
		}
	}

	/* стани відкриття — як було */
	.dropdown {
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

		/* елементи меню — клікабельні */
		div {
			cursor: pointer;
		}
	}

	.open & {
		color: #4bc785;
		svg {
			transform: rotate(180deg);
		}
		svg path {
			fill: #4bc785;
		}
	}
`
