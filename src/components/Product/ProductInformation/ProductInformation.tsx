'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import ArrowUp from '@/assets/img/arrow-up.svg'
import ProductBg from '@/assets/img/product-bg.png'
import cardBorder from '@/assets/img/specification-border.png'

import { Background } from '../Autonomy/Banner/Background'

import { Card } from './Card'
import { useBasket } from '@/context/BasketContext'

type Lng = 'en' | 'ru'

/* ===================== cookies, tokens, roles ===================== */

const readCookie = (name: string): string | null => {
	if (typeof document === 'undefined') return null
	const m = document.cookie.match(
		new RegExp(
			'(?:^|; )' + name.replace(/([$?*|{}\\[\\]\\\\^])/g, '\\$1') + '=([^;]*)'
		)
	)
	return m ? decodeURIComponent(m[1]) : null
}

const resolveLng = (sp: URLSearchParams | null): Lng => {
	const fromQuery = (sp?.get('lng') || '').split('-')[0].toLowerCase()
	if (fromQuery === 'en' || fromQuery === 'ru') return fromQuery as Lng
	const fromCookie = (readCookie('lng') || '').split('-')[0].toLowerCase()
	if (fromCookie === 'en' || fromCookie === 'ru') return fromCookie as Lng
	return 'ru'
}

const getAccessToken = (): string | null =>
	typeof localStorage !== 'undefined'
		? localStorage.getItem('accessToken')
		: null
const getRefreshToken = (): string | null =>
	typeof localStorage !== 'undefined'
		? localStorage.getItem('refreshToken')
		: null

const decodeJwtPayload = <T = any,>(token: string): T | null => {
	try {
		const base64Url = token.split('.')[1]
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		)
		return JSON.parse(jsonPayload) as T
	} catch {
		return null
	}
}

const refreshToken = async (): Promise<boolean> => {
	const refreshTokenValue = getRefreshToken()
	if (!refreshTokenValue) return false
	try {
		const response = await fetch(
			'https://rpktask.sytes.net/api/token/refresh/',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh: refreshTokenValue }),
				credentials: 'include'
			}
		)
		if (response.ok) {
			const data = await response.json()
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('accessToken', data.access)
			}
			return true
		} else {
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('accessToken')
				localStorage.removeItem('refreshToken')
			}
			return false
		}
	} catch {
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('accessToken')
			localStorage.removeItem('refreshToken')
		}
		return false
	}
}

const isDealerName = (s: string) =>
	/(^|[^a-z])dealer([^a-z]|$)/i.test(s) || /дилер/i.test(s)

const hasDealer = (arr: any): boolean =>
	Array.isArray(arr) &&
	arr.some((g: any) => {
		const name = String(g?.name ?? g?.title ?? g?.code ?? g?.slug ?? g ?? '')
		return isDealerName(name)
	})

const useDealer = () => {
	const [isDealer, setIsDealer] = useState(false)

	useEffect(() => {
		let cancelled = false
		const check = async () => {
			let token = getAccessToken()
			let claims: any = token ? decodeJwtPayload(token) : null

			const exp = Number(claims?.exp) || 0
			const now = Math.floor(Date.now() / 1000)
			if (!token || (exp && exp <= now)) {
				const ok = await refreshToken()
				if (ok) {
					token = getAccessToken()
					claims = token ? decodeJwtPayload(token) : null
				}
			}

			let dealer =
				isDealerName(String(claims?.role ?? '')) ||
				isDealerName(String(claims?.user_type ?? '')) ||
				claims?.is_dealer === true ||
				claims?.isDealer === true ||
				hasDealer(claims?.groups) ||
				hasDealer(claims?.roles)

			if (!dealer) {
				const role = (
					readCookie('role') ||
					readCookie('user_type') ||
					''
				).toLowerCase()
				const flag = (
					readCookie('is_dealer') ||
					readCookie('dealer') ||
					''
				).toLowerCase()
				dealer = isDealerName(role) || ['1', 'true', 'yes'].includes(flag)
			}

			if (!cancelled) setIsDealer(dealer)
		}
		void check()
		return () => {
			cancelled = true
		}
	}, [])

	return isDealer
}

const authHeaders = (): HeadersInit => {
	const token = getAccessToken()
	return token ? { Authorization: `Bearer ${token}` } : {}
}

/* ===================== utils ===================== */

const getVersionKey = (v: Variant) => (v.name?.trim() || v.sku).trim()

const formatPrice = (n: number) =>
	new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(n)

const splitFirstSentence = (text: string) => {
	if (!text) return { first: '', rest: '' }
	const dot = text.indexOf('.')
	if (dot === -1) return { first: text.trim(), rest: '' }
	return {
		first: text.slice(0, dot + 1).trim(),
		rest: text.slice(dot + 1).trim()
	}
}

// парсер: "1 999", "1,999.50", "1 999,50"
const toNum = (v: unknown): number | null => {
	if (v == null || v === '') return null
	if (typeof v === 'number') return Number.isFinite(v) ? v : null
	if (typeof v === 'string') {
		const s = v.replace(/\s|[\u00A0\u202F]/g, '').replace(',', '.')
		const n = Number(s)
		return Number.isFinite(n) ? n : null
	}
	return null
}

const safeLabel = (
	key: string,
	ruDefault: string,
	enDefault: string,
	t: (k: string) => string,
	lng: Lng
) => {
	const raw = (t(key) || '').trim()
	if (raw) return raw
	return lng === 'ru' ? ruDefault : enDefault
}

/* ===================== types ===================== */

interface ProductInfo {
	id: number
	name: string
	variants: Variant[]
	description: string
	short_description?: string
}

interface Variant {
	id: number
	name?: string
	sku: string
	stock: any[]
	price: number
	dealer_price?: number | null
	project_price?: number | null
	/** ТЕПЕР масив сокетів (backward-сумісно нормалізується з одиночного об’єкта) */
	sockets: { code: string; name: string }[]
	images: { image: string; alt_text: string | null }[]
	features: { name: string; value: string }[]
}

/* ===================== component ===================== */

export const ProductInformation = ({
	setProductName
}: {
	setProductName: (name: string) => void
}) => {
	const [isLoading, setIsLoading] = useState(true)
	const [productInfo, setProductInfo] = useState<ProductInfo | null>(null)

	const [selectedVersionKey, setSelectedVersionKey] = useState<string | null>(
		null
	)
	const [selectedSocketCode, setSelectedSocketCode] = useState<string | null>(
		null
	)

	const [showDescription, setShowDescription] = useState(true)

	const [slidesData, setSlidesData] = useState<any[]>([])
	const [byLang, setByLang] = useState<Partial<Record<Lng, ProductInfo>>>({})

	const { id } = useParams()
	const router = useRouter()
	const searchParams = useSearchParams()
	const { addToBasket } = useBasket()
	const { t, i18n } = useTranslation('common')

	const currentLng: Lng = resolveLng(searchParams)
	const isDealer = useDealer()

	/* i18n sync */
	useEffect(() => {
		const cur = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		if (cur !== currentLng) void i18n.changeLanguage(currentLng)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLng])

	/* reset on product change */
	useEffect(() => {
		setByLang({})
		setSelectedVersionKey(null)
		setSelectedSocketCode(null)
		setSlidesData([])
		setProductInfo(null)
	}, [id])

	const computeSlides = (data: ProductInfo) =>
		data.variants.flatMap(variant =>
			(variant.images || []).map(img => ({
				title: '',
				subtitle: '',
				photo: img.image,
				slide: variant.id
			}))
		)

	// нормалізація сокетів: дозволяє [obj], obj або []
	const normalizeSockets = (raw: any): { code: string; name: string }[] => {
		if (!raw) return []
		const arr = Array.isArray(raw) ? raw : [raw]
		return arr
			.map((s: any) => {
				const code = String(s?.code ?? s ?? '').trim()
				if (!code) return null
				const name = String(s?.name ?? s?.title ?? code)
				return { code, name }
			})
			.filter(Boolean) as { code: string; name: string }[]
	}

	const normalizeProduct = (raw: any): ProductInfo => ({
		id: Number(raw?.id),
		name: String(raw?.name ?? ''),
		description: String(raw?.description ?? ''),
		short_description: raw?.short_description ?? '',
		variants: (raw?.variants ?? []).map((v: any) => ({
			id: Number(v?.id),
			name: v?.name ?? undefined,
			sku: String(v?.sku ?? ''),
			stock: v?.stock ?? [],
			price: toNum(v?.price) ?? 0,
			dealer_price: toNum(v?.dealer_price),
			project_price: toNum(v?.project_price),
			// приймаємо і v.socket (array|object), і v.sockets (array)
			sockets: normalizeSockets(v?.sockets ?? v?.socket),
			images: (v?.images ?? []).map((im: any) => ({
				image: String(im?.image ?? ''),
				alt_text: im?.alt_text ?? null
			})),
			features: (v?.features ?? []).map((f: any) => ({
				name: String(f?.name ?? ''),
				value: String(f?.value ?? '')
			}))
		}))
	})

	const apiBase = 'https://rpktask.sytes.net'

	const loadProduct = async (lng: Lng): Promise<ProductInfo> => {
		const url = `${apiBase}/api/catalog/products/${id}/?lng=${lng}&_=${Date.now()}`
		const doFetch = () =>
			fetch(url, {
				cache: 'no-store',
				credentials: 'include',
				headers: { 'Accept-Language': lng.toUpperCase(), ...authHeaders() }
			})

		let res = await doFetch()
		if (res.status === 401) {
			const ok = await refreshToken()
			if (ok) res = await doFetch()
		}

		if (!res.ok) throw new Error(`Failed to load product: ${res.status}`)
		const raw = await res.json()
		return normalizeProduct(raw)
	}

	/* main load */
	useEffect(() => {
		let cancelled = false
		const ensure = async () => {
			setIsLoading(true)
			try {
				const cached = byLang[currentLng]
				const data = cached ?? (await loadProduct(currentLng))
				if (cancelled) return

				if (!cached) setByLang(prev => ({ ...prev, [currentLng]: data }))
				setProductInfo(data)
				setProductName(data.name)
				setSlidesData(computeSlides(data))

				const first = data.variants[0]
				if (first) {
					const vk = getVersionKey(first)
					setSelectedVersionKey(vk)
					const firstSocket = first.sockets?.[0]?.code ?? null
					setSelectedSocketCode(firstSocket)
				}
			} catch {
				if (!cancelled) setProductInfo(null)
			} finally {
				if (!cancelled) setIsLoading(false)
			}
		}
		void ensure()
		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, currentLng])

	/* preload other lang */
	useEffect(() => {
		const other: Lng = currentLng === 'ru' ? 'en' : 'ru'
		if (byLang[other]) return
		loadProduct(other)
			.then(data => setByLang(prev => ({ ...prev, [other]: data })))
			.catch(() => {})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLng, id])

	/* derived data */
	const variants = productInfo?.variants ?? []
	const separatedName = (productInfo?.name ?? '').split(' ').filter(Boolean)

	const shortStrict = (productInfo?.short_description || '').trim()
	const { first: shortFirst, rest: shortRest } = useMemo(
		() => splitFirstSentence(shortStrict),
		[shortStrict]
	)

	const uniqueVersions = useMemo(() => {
		const map = new Map<string, { display: string }>()
		for (const v of variants) {
			const key = getVersionKey(v)
			if (!map.has(key)) map.set(key, { display: key })
		}
		return Array.from(map, ([key, { display }]) => ({ key, display }))
	}, [variants])

	const activeVersionKey = useMemo(
		() =>
			selectedVersionKey ?? (variants[0] ? getVersionKey(variants[0]) : null),
		[selectedVersionKey, variants]
	)

	// зібрати всі сокети для обраної версії (без дублювань)
	const socketsForActiveVersion = useMemo(() => {
		if (!activeVersionKey) return []
		const map = new Map<string, string>()
		for (const v of variants) {
			if (getVersionKey(v) !== activeVersionKey) continue
			for (const s of v.sockets ?? []) {
				if (s?.code) map.set(s.code, s.name || s.code)
			}
		}
		return Array.from(map, ([code, display]) => ({ code, display }))
	}, [variants, activeVersionKey])

	useEffect(() => {
		if (!socketsForActiveVersion.length) {
			setSelectedSocketCode(null)
			return
		}
		const exists = socketsForActiveVersion.some(
			s => s.code === selectedSocketCode
		)
		if (!exists) setSelectedSocketCode(socketsForActiveVersion[0].code)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeVersionKey, socketsForActiveVersion])

	const displayVariant = useMemo(() => {
		if (!variants.length || !activeVersionKey) return null
		return variants.find(v => getVersionKey(v) === activeVersionKey) ?? null
	}, [variants, activeVersionKey])

	// тепер варіант вважається відповідним, якщо МІСТИТЬ обраний сокет у своєму масиві
	const combinationVariant = useMemo(() => {
		if (!variants.length || !activeVersionKey || !selectedSocketCode)
			return null
		return (
			variants.find(
				v =>
					getVersionKey(v) === activeVersionKey &&
					(v.sockets ?? []).some(s => s.code === selectedSocketCode)
			) ?? null
		)
	}, [variants, activeVersionKey, selectedSocketCode])

	// ===== покупка незалежно від «розетки» (fallback-логіка)
	const variantForBasket = useMemo(() => {
		if (combinationVariant) return combinationVariant
		if (displayVariant) return displayVariant
		return variants[0] ?? null
	}, [combinationVariant, displayVariant, variants])

	const canBuy = !!variantForBasket

	const features = displayVariant?.features ?? []
	const mid = Math.ceil(features.length / 2)
	const colLeft = features.slice(0, mid)
	const colRight = features.slice(mid)

	/* ===================== pricing ===================== */

	// публічна роздрібна для не-дилерів (для відображення праворуч)
	const retailPriceDisplay = displayVariant?.price ?? 0

	// дилерська (для відображення праворуч)
	const dealerPriceDisplay = displayVariant?.dealer_price ?? null

	// "Розница" у дилерській картці: project_price -> fallback на звичайну price
	const retailForDealerCard =
		displayVariant?.project_price ?? retailPriceDisplay

	// розрахунок ціни до оплати (для кошика) — від вибраного або fallback-варіанту
	const retailPriceToPay = variantForBasket?.price ?? retailPriceDisplay
	const dealerPriceToPay = variantForBasket?.dealer_price ?? dealerPriceDisplay
	const effectivePrice = isDealer
		? (dealerPriceToPay ?? retailPriceToPay)
		: retailPriceToPay

	// показувати дилерську картку, якщо є dealer/project ціни або користувач дилер
	const showDealerCard = useMemo(
		() =>
			isDealer ||
			(productInfo?.variants ?? []).some(
				v => toNum(v?.dealer_price) != null || toNum(v?.project_price) != null
			),
		[isDealer, productInfo]
	)

	/* ===================== render ===================== */

	return (
		<>
			{!isLoading && !productInfo && (
				<div className='mb-[100px] mt-[100px]'>
					<h1 className='text-center text-[30px] font-semibold text-[#FFFFFF]'>
						{t('ProductItem.not_found') || 'Товара нет'}
					</h1>
				</div>
			)}

			{!isLoading && productInfo && (
				<>
					<Wrapper
						style={{ borderTopStyle: 'solid', borderBottomStyle: 'dashed' }}
						className='pt-[35px] main-wrapper flex gap-[20px] mb-[96px] border-t border-b !border-[#313131] customScreen:flex-col customScreen:gap-[0px]'
					>
						{/* LEFT */}
						<WrapperContent className='overflow-hidden flex flex-col gap-[20px] w-[60%] relative'>
							<Title className='text-[70px] font-[600]'>
								{separatedName.map((item, i) =>
									i === separatedName.length - 1 ? null : (
										<span key={item}>{item + ' '}</span>
									)
								)}{' '}
								<OutlineText className='text-[70px] font-bold'>
									{separatedName[separatedName.length - 1] || ''}
								</OutlineText>
							</Title>

							{shortStrict && (
								<p className='max-w:[700px] mb-[23px] text-[15px] leading-[24px] uppercase font-[500] text-[#FFFFFF]'>
									<span className='text-[#4BC785]'>{shortFirst}</span>
									{shortRest ? ' ' + shortRest : ''}
								</p>
							)}

							<StyledList
								$cardBorder={cardBorder}
								className='overflow-hidden'
							>
								<Swiper
									spaceBetween={25}
									modules={[Pagination]}
									pagination={{ clickable: true }}
								>
									<CanvasBlockOne>
										<Background />
									</CanvasBlockOne>
									<CanvasBlockTwo>
										<Background />
									</CanvasBlockTwo>
									<img
										src={ProductBg.src}
										alt='product-bg'
										className='w-full h-full absolute top-0 left-0 z-[0]'
									/>

									<SwiperWrapper className='w-full h-full relative'>
										{slidesData.map((slide: any, index: number) => (
											<SwiperSlide key={index}>
												<CardWrapper className='w-[50%] h-full relative left-[25%] z-[3]'>
													<Card
														title=''
														subtitle=''
														slide={slide.slide}
														totalSlides={slidesData.length}
														photo={slide.photo}
													/>
												</CardWrapper>
											</SwiperSlide>
										))}
									</SwiperWrapper>
								</Swiper>
							</StyledList>
						</WrapperContent>

						{/* RIGHT */}
						<SecondInfo className='border-l border-dashed !border-[#313131] w-[40%] pl-[20px]'>
							<div className='flex flex-row justify-between mb-[7px]'>
								<CenterText className='text-[18px] font-light text-[#FFFFFFA8]'>
									{t('ProductItem.article')}: {displayVariant?.sku || '-'}
								</CenterText>
								<p className='text-[14px] font-light text-[#1DCF94]'>
									{displayVariant && displayVariant.stock.length > 0
										? t('ProductItem.availability')
										: t('ProductItem.not_availability')}
								</p>
							</div>

							{/* === PRICES === */}
							{showDealerCard ? (
								<DealerCard
									role='region'
									aria-label='dealer pricing card'
								>
									<DealerRow>
										<Badge>{t('ProductItem.dealer_price')}</Badge>
										<DealerValue aria-live='polite'>
											{displayVariant && dealerPriceDisplay != null
												? `${formatPrice(dealerPriceDisplay)} $`
												: '—'}
										</DealerValue>
									</DealerRow>

									<DividerLine />

									<DealerRow>
										<Badge $dim>{t('ProductItem.retail_price')}</Badge>
										<RetailValue aria-label='retail price (project or public)'>
											{displayVariant
												? `${formatPrice(retailForDealerCard)} $`
												: '—'}
										</RetailValue>
									</DealerRow>
								</DealerCard>
							) : (
								<CenterText className='text-[30px] font-semibold leading-[50px] mb-[20px]'>
									{displayVariant
										? `${formatPrice(retailPriceDisplay)} $`
										: '—'}
								</CenterText>
							)}

							{/* Buy */}
							<BuyButton
								type='button'
								disabled={!canBuy}
								aria-disabled={!canBuy}
								onClick={() => {
									if (!variantForBasket || !productInfo) return
									addToBasket({
										id: productInfo.id,
										variantId: variantForBasket.id,
										name: productInfo.name,
										price: effectivePrice,
										quantity: 1,
										photo:
											variantForBasket.images[0]?.image ||
											'/img/placeholder.png'
									})
									router.push('/basket')
								}}
								className={`cursor-pointer mb-[40px] max-w-[270px] w-[100%] h-[58px] border border-solid rounded-[61px] text-[15px] font-semibold ${
									canBuy
										? 'hover:bg-[#4BC785] border-[#4BC785] bg-transparent text-white'
										: 'opacity-50 cursor-not-allowed border-[#4BC785] bg-[#4BC7851a] text-white'
								}`}
							>
								{t('ProductItem.buy')}
							</BuyButton>

							{/* Versions */}
							<div className='border-b border-dashed !border-[#313131] mb-[22px]' />
							<CenterText className='text-[23px] uppercase font-semibold text-[#FFFFFF] mb-[20px]'>
								{t('ProductItem.version')}
							</CenterText>

							<VersionList>
								{uniqueVersions.map(({ key, display }) => (
									<WrapperVersion
										key={`version-${key}`}
										className='flex items-center gap-[10px] pl-[25px] relative bg-[#0D0C0C] rounded-[8px] p-[10px] cursor-pointer'
										style={{
											color: selectedVersionKey === key ? '#4BC785' : '#FFFFFF'
										}}
										htmlFor={`version-${key}`}
									>
										<input
											type='radio'
											id={`version-${key}`}
											value={key}
											name='version'
											className='version-radio'
											checked={selectedVersionKey === key}
											onChange={e => setSelectedVersionKey(e.target.value)}
										/>
										<span className='truncate'>{display}</span>
									</WrapperVersion>
								))}
							</VersionList>

							{/* Socket */}
							{socketsForActiveVersion.length > 0 && (
								<>
									<CenterText className='text-[23px] uppercase font-semibold text-[#FFFFFF] mb-[20px] mt-[22px]'>
										{t('ProductItem.socket')}
									</CenterText>
									<SocketList>
										{socketsForActiveVersion.map(({ code, display }) => (
											<WrapperVersion
												key={`socket-${code}`}
												className='flex items-center gap-[10px] pl-[25px] relative bg-[#0D0C0C] rounded-[8px] p-[10px] cursor-pointer'
												style={{
													color:
														selectedSocketCode === code ? '#4BC785' : '#FFFFFF'
												}}
												htmlFor={`socket-${code}`}
											>
												<input
													type='radio'
													id={`socket-${code}`}
													value={code}
													name='socket'
													className='version-radio'
													checked={selectedSocketCode === code}
													onChange={e => setSelectedSocketCode(e.target.value)}
												/>
												<span className='truncate'>{display}</span>
											</WrapperVersion>
										))}
									</SocketList>
								</>
							)}

							{/* Description */}
							<div
								className='pb-[42px] relative'
								onClick={() => setShowDescription(!showDescription)}
							>
								<DescriptionText className='flex items-center justify-between gap-[10px] relative text-[23px] leading-[33px] uppercase font-semibold text-[#FFFFFF] mb-[18px] mt-[22px]'>
									{t('ProductItem.description')}
									<ArrowUp
										className={`cursor-pointer w-[24px] h-[24px] transition-all duration-300 ${
											showDescription ? 'rotate-0' : 'rotate-180'
										}`}
										aria-label='arrow-down'
									/>
								</DescriptionText>

								{/* БЕЗ ВНУТРІШНЬОГО СКРОЛУ: просто розкривається вниз */}
								<p
									className={`text-[14px] leading-[18px] text-[#FFFFFFA8] transition-[max-height] duration-300 ease-in-out overflow-hidden ${
										showDescription ? 'max-h-[9999px]' : 'max-h-0'
									}`}
								>
									{productInfo.description}
								</p>
							</div>
						</SecondInfo>
					</Wrapper>

					{/* TECH CHARACTERISTICS */}
					{features.length > 0 && (
						<TechBlock className='main-wrapper'>
							<h3 className='title'>{t('ProductItem.characteristics')}</h3>

							<TechColumns>
								<TechCol>
									{colLeft.map(f => (
										<TechRow key={`l-${f.name}`}>
											<span className='name'>{f.name}</span>
											<span className='value'>{f.value}</span>
										</TechRow>
									))}
								</TechCol>

								<Divider />

								<TechCol>
									{colRight.map(f => (
										<TechRow key={`r-${f.name}`}>
											<span className='name'>{f.name}</span>
											<span className='value'>{f.value}</span>
										</TechRow>
									))}
								</TechCol>
							</TechColumns>
						</TechBlock>
					)}
				</>
			)}
		</>
	)
}

/* ===================== styled-components ===================== */

const CenterText = styled.p`
	@media (max-width: 1000px) {
		text-align: center;
		font-size: 18px;
	}
`

const DescriptionText = styled(CenterText)`
	@media (max-width: 1000px) {
		justify-content: center;
	}
`

const BuyButton = styled.button`
	@media (max-width: 1000px) {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: auto;
		margin-bottom: 20px;
	}
`

const Title = styled.h1`
	font-weight: 600;
	font-style: DemiBold;
	font-size: 70px;
	line-height: 88px;
	text-transform: uppercase;

	@media (max-width: 1000px) {
		span {
			text-align: center;
			font-size: 30px;
			line-height: 35px;
			margin-bottom: 20px;
		}
		text-align: center;
		font-size: 30px;
		line-height: 35px;
		margin-bottom: 20px;
	}
`

const SwiperWrapper = styled.div`
	@media (max-width: 1000px) {
		width: 100%;
	}
`

const CardWrapper = styled.div`
	> div > :last-child {
		display: none;
	}
	@media (max-width: 1000px) {
		width: 100%;
		left: 0;
		background-size: contain;

		> div {
			background-size: contain;
		}
	}
`

const Wrapper = styled.div`
	@media (max-width: 1000px) {
		flex-direction: column;
		gap: 0px;
		label {
			margin: auto;
			margin-bottom: 20px;
			width: 50%;
		}
	}
`

const WrapperContent = styled.div`
	@media (max-width: 1000px) {
		width: 100%;
	}
`

const SecondInfo = styled.div`
	@media (max-width: 1000px) {
		width: 100%;
		border-left: none;
		border-top: 1px dashed #313131;
		padding-top: 20px;
	}
`

const WrapperVersion = styled.label`
	font-weight: 600;
	position: relative;
	min-height: 44px;
	display: flex;
	align-items: center;

	.version-radio {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 999px;
		border: 10px solid #ffffffc4;
		margin-right: 6px;
		flex-shrink: 0;
	}
	.version-radio:checked {
		background: #4bc785;
		border-color: #ffffff;
		border-width: 3px;
	}

	@media (max-width: 1000px) {
		justify-content: flex-start;
	}
`

const OutlineText = styled.span`
	font-weight: bold;
	color: transparent;
	-webkit-text-stroke-width: 1px;
	-webkit-text-stroke-color: #ffffff;
`

const StyledList = styled.div<{ $cardBorder: string }>`
	.swiper-slide {
		margin-bottom: 84px;
		position: relative;
		background: url(${({ $cardBorder }) => $cardBorder}) center/cover no-repeat;
	}
	.swiper-slide {
		background: none !important;
	}
	@media (max-width: 1000px) {
		.swiper-slide {
			margin-bottom: 34px;
		}
	}
`

const CanvasBlockOne = styled.div`
	transform: rotate(-45deg);
	position: absolute;
	right: -200px;
	top: -360px;
	width: 1240px;
	height: 1199px;
	z-index: -2;
	overflow: hidden;
`
const CanvasBlockTwo = styled(CanvasBlockOne)`
	transform: rotate(45deg);
`

const VersionList = styled.div`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gап: 10px 12px;
	padding-bottom: 30px;
	border-bottom: 1px dashed #313131;

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
	}
`
const SocketList = styled(VersionList)`
	border-bottom: 1px dashed #313131;
`

const TechBlock = styled.section`
	margin: 40px auto 60px;
	max-width: min(95vw, 1440px);
	width: 100%;
	padding: 0 24px;
	border-bottom: 1px dashed #313131;

	.title {
		color: #fff;
		font-size: 23px;
		font-weight: 600;
		text-transform: uppercase;
		margin-bottom: 20px;
		text-align: center;
	}
`

const TechColumns = styled.div`
	max-width: min(92vw, 1280px);
	margin: 0 auto;
	width: 100%;

	display: grid;
	grid-template-columns: 1fr 1px 1fr;
	gap: 28px;

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
		gap: 0;
	}
`

const Divider = styled.div``

const TechCol = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding-bottom: 24px;
`

const TechRow = styled.div`
	display: grid;
	grid-template-columns: 240px 1fr;
	align-items: end;
	gap: 24px;
	padding: 8px 0;

	.name {
		color: #ffffffa8;
		font-weight: 300;
		font-style: Light;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 1%;
		padding-bottom: 12px;
		border-bottom: 1px dashed #ffffff42;
	}

	.value {
		position: relative;
		color: #ffffffc9;
		font-weight: 500;
		font-style: Medium;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 1%;
		padding-bottom: 14px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.value::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(to right, #d1d5db, transparent);
	}

	@media (max-width: 1200px) {
		grid-template-columns: 200px 1fr;
	}
	@media (max-width: 900px) {
		grid-template-columns: 1fr;
		gap: 6px;

		.name,
		.value {
			white-space: normal;
		}
	}
`

/* ===== dealer-only styles ===== */

const DealerCard = styled.div`
	display: grid;
	gap: 10px;
	padding: 16px 18px;
	margin-bottom: 20px;
	border-radius: 16px;
	background: linear-gradient(
		180deg,
		rgba(9, 9, 9, 0.9) 0%,
		rgba(15, 15, 15, 0.9) 100%
	);
	border: 1px solid #2a2a2a;
	box-shadow:
		0 0 0 1px rgba(75, 199, 133, 0.08),
		0 8px 24px rgba(0, 0, 0, 0.35);
`

const DealerRow = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 14px;
`

const Badge = styled.span<{ $dim?: boolean }>`
	font-size: 11px;
	line-height: 1;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	padding: 6px 10px;
	border-radius: 999px;
	border: 1px solid ${p => (p.$dim ? '#3b3b3b' : '#4BC785')};
	color: ${p => (p.$dim ? '#ffffffa8' : '#4BC785')};
	background: ${p =>
		p.$dim ? 'rgba(255,255,255,0.06)' : 'rgba(75,199,133,0.08)'};
	white-space: nowrap;
`

const DealerValue = styled.span`
	font-size: 38px;
	line-height: 50px;
	font-weight: 800;
	color: #ffffff;
`

const RetailValue = styled.span`
	font-size: 30px;
	line-height: 42px;
	font-weight: 700;
	color: #ffffffd0;
`

const DividerLine = styled.div`
	height: 1px;
	width: 100%;
	background: linear-gradient(90deg, transparent, #3a3a3a, transparent);
	margin: 2px 0;
`

/* ===== shared prices (used earlier in the app) ===== */
const PricesWrap = styled.div`
	display: flex;
	gap: 60px;
	align-items: flex-end;
	margin-bottom: 20px;

	@media (max-width: 1000px) {
		justify-content: center;
		gap: 28px;
	}
`

const PriceBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	white-space: nowrap;
`

const SmallLabel = styled.p`
	font-size: 12px;
	line-height: 1;
	color: #ffffffa8;
	letter-spacing: 0.06em;
	text-transform: uppercase;
`

const PriceBig = styled.p`
	font-size: 36px;
	line-height: 50px;
	font-weight: 700;
	color: #ffffff;
`

const PriceBigDim = styled(PriceBig)`
	opacity: 0.9;
`
