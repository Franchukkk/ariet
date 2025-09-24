'use client'

import L, { DivIcon, LatLngExpression, Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { StaticImageData } from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import styled from 'styled-components'

import bg from '@/assets/img/contact-location.png'
import IconSvg from '@/assets/img/pin-map.svg'

const center: LatLngExpression = [41.74950892876384, 1.8623954656185593]
const zoom = 15

// SVG → кастомний DivIcon
const pinIcon: DivIcon = L.divIcon({
	html: renderToStaticMarkup(<IconSvg aria-label='icon' />),
	className: 'custom-pin',
	iconSize: [40, 40],
	iconAnchor: [20, 40]
})

type ImgLike = string | StaticImageData

export const Location = () => {
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])

	const wrapperRef = useRef<HTMLDivElement | null>(null)
	const mapRef = useRef<LeafletMap | null>(null)

	useEffect(() => {
		if (!mounted || !wrapperRef.current) return

		// Гарантовано прибираємо попередні сліди Leaflet з контейнера
		const container = wrapperRef.current
		// шукаємо існуючий .leaflet-container всередині (на випадок HMR)
		const existing = container.querySelector('.leaflet-container') as any
		if (existing) {
			try {
				existing._leaflet_id = undefined
			} catch {}
			try {
				existing.innerHTML = ''
			} catch {}
		}

		// створюємо div для карти
		const mapEl = document.createElement('div')
		mapEl.style.height = '100%'
		mapEl.style.width = '100%'
		container.appendChild(mapEl)

		// 1) Створення карти (жодних дубль-інстансів)
		const map = L.map(mapEl, {
			center,
			zoom,
			zoomControl: false,
			scrollWheelZoom: false,
			doubleClickZoom: false,
			dragging: true
		})
		mapRef.current = map

		// 2) Тайли OSM
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map)

		// 3) Кнопки масштабу (праворуч зверху)
		L.control.zoom({ position: 'topright' }).addTo(map)

		// 4) Маркер
		L.marker(center, { icon: pinIcon }).addTo(map)

		// cleanup — повне видалення інстанса та DOM-вузла
		return () => {
			try {
				map.remove()
			} catch {}
			mapRef.current = null
			try {
				container.removeChild(mapEl)
			} catch {}
		}
	}, [mounted])

	return (
		<StyledLocation
			$bg={bg}
			ref={wrapperRef}
		/>
	)
}

const StyledLocation = styled.div<{ $bg: ImgLike }>`
	border-radius: 6px;
	height: 627px;
	width: 100%;
	background: ${({ $bg }) =>
		`url(${typeof $bg === 'string' ? $bg : $bg.src}) center/cover no-repeat`};
	margin-bottom: 135px;
	overflow: hidden;

	/* контейнер карти, який ми додаємо всередину, займе 100% */
	.leaflet-container {
		background: transparent;
	}

	.custom-pin {
		background: transparent;
		border: none;
	}

	@media (max-width: 1000px) {
		height: 400px;
		margin-bottom: 40px;
	}
	@media (max-width: 800px) {
		height: 300px;
	}

	img {
		width: 200px;
	}
`
