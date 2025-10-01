'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Basket } from './Basket/basket'
import { Burger } from './Burger'
import { Catalog } from './Catalog/Catalog'
import { Contacts } from './Contacts/Contacts'
// ⬅️ додано
import { Logo } from './Logo'
import { Navigation } from './Navigation'
import { User } from './User/User'

export const Header = () => {
	const [open, setOpen] = useState(false)
	const pathname = usePathname()
	const contentRef = useRef<HTMLDivElement>(null)

	const setBodyScroll = (enabled: boolean) => {
		const body = document.querySelector('body')
		if (body) body.style.overflow = enabled ? 'auto' : 'hidden'
	}

	const closeMenu = () => {
		setOpen(false)
		setBodyScroll(true)
	}

	const handleToggleSidebar = () => {
		if (open) setBodyScroll(true)
		else setBodyScroll(false)
		setOpen(!open)
	}

	// Автозакриття при зміні маршруту (клік по <Link>)
	useEffect(() => {
		if (open) closeMenu()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname])

	// Закриття по Esc
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && open) closeMenu()
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open])

	// Закривати по кліку лише на посилання або елементи, які ТИ явно позначиш
	useEffect(() => {
		if (!open) return
		const el = contentRef.current
		if (!el) return

		const CLOSE_SELECTOR = 'a[href], [data-close-on-click]'

		const onClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null
			if (!target) return

			// Не закривати, якщо клік всередині блоку, який не має закривати меню
			if (target.closest('[data-no-close]')) return

			const interactive = target.closest(CLOSE_SELECTOR)
			if (interactive && el.contains(interactive)) {
				// даємо роутинигу відпрацювати, потім схлопуємо
				setTimeout(() => closeMenu(), 0)
			}
		}

		el.addEventListener('click', onClick)
		return () => el.removeEventListener('click', onClick)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open])

	// При розмонтуванні — повернути скрол
	useEffect(() => () => setBodyScroll(true), [])

	return (
		<StyledHeader className='main-wrapper flex items-center gap-1.5 !mb-5'>
			<Logo />
			<div
				ref={contentRef}
				className={`header-content flex items-center gap-1.5 ${open ? 'open' : ''}`}
			>
				<Catalog />
				<Navigation />
				<Contacts />
				<Basket />

				<User />
			</div>
			<Burger
				open={open}
				onToggle={handleToggleSidebar}
			/>
		</StyledHeader>
	)
}

const StyledHeader = styled.header`
	@media (max-width: 1300px) {
		.header-content {
			display: none;
			&.open {
				display: flex;
				position: fixed;
				top: 90px;
				left: 0;
				bottom: 0;
				right: 0;
				background: #000000;
				display: grid;
				grid-template-columns: 1fr max-content;
				grid-auto-rows: max-content;
				gap: 20px;
				z-index: 100; /* оверлей */
				padding: 20px;
			}
		}
	}
`
