'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import ArrowUp from '@/assets/img/arrow-up.svg'
import ProductBg from '@/assets/img/product-bg.png'
import cardBorder from '@/assets/img/specification-border.png'

import { Background } from '../Autonomy/Banner/Background'
import { Card } from '../Specifications/List/Card/Card'

import { useBasket } from '@/context/BasketContext'

interface ProductInfo {
	id: number
	name: string
	variants: Variant[]
	description: string
	technical_info: any[]
}

interface Variant {
	id: number
	sku: string
	stock: any[]
	price: number
	socket: { code: string; name: string } | null
	images: { image: string; alt_text: string | null }[]
	features: { name: string; value: string }[]
}

type Lng = 'en' | 'ru'

function formatPrice(num: number) {
	return Number(num).toLocaleString('en-US').replace(',', ' ')
}

export const ProductInformation = ({
	setProductName
}: {
	setProductName: (name: string) => void
}) => {
	const [isLoading, setIsLoading] = useState(true)
	const [productInfo, setProductInfo] = useState<ProductInfo | null>(null)
	const [version, setVersion] = useState<string>('')
	const [showDescription, setShowDescription] = useState(false)
	const [slidesData, setSlidesData] = useState<any[]>([])
	const [price, setPrice] = useState<number>(0)
	const [byLang, setByLang] = useState<Partial<Record<Lng, ProductInfo>>>({})

	const { id } = useParams()
	const router = useRouter()
	const { addToBasket } = useBasket()
	const { t, i18n } = useTranslation('common')

	const currentLng: Lng = useMemo(() => {
		const raw = (i18n.resolvedLanguage || i18n.language || 'ru').split(
			'-'
		)[0] as Lng
		return raw === 'en' ? 'en' : 'ru'
	}, [i18n.language, i18n.resolvedLanguage])

	useEffect(() => {
		setByLang({})
		setVersion('')
		setSlidesData([])
		setProductInfo(null)
		setPrice(0)
	}, [id])

	const computeSlides = (data: ProductInfo) =>
		data.variants.flatMap(variant =>
			variant.images.map(img => ({
				title: '',
				subtitle: '',
				photo: img.image,
				slide: variant.id
			}))
		)

	const loadProduct = async (lng: 'en' | 'ru'): Promise<ProductInfo> => {
		const url = `https://rpktask.sytes.net/api/catalog/products/${id}?lng=${lng}&_=${Date.now()}`
		const res = await fetch(url, {
			cache: 'no-store',
			headers: { 'Accept-Language': lng } // <= цього достатньо
		})
		if (!res.ok) throw new Error('Failed to load product')
		return res.json()
	}

	useEffect(() => {
		let cancelled = false
		const ensure = async () => {
			setIsLoading(true)
			try {
				const cached = byLang[currentLng]
				const data = cached ?? (await loadProduct(currentLng))
				if (!cancelled) {
					if (!cached) setByLang(prev => ({ ...prev, [currentLng]: data }))
					setProductInfo(data)
					setProductName(data.name)
					const vId = data.variants[0]?.id
					setVersion(prev => (prev ? prev : `version-${vId}`))
					setSlidesData(computeSlides(data))
					setPrice(data.variants[0]?.price ?? 0)
				}
			} catch {
				if (!cancelled) setProductInfo(null)
			} finally {
				if (!cancelled) setIsLoading(false)
			}
		}
		ensure()
		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, currentLng])

	useEffect(() => {
		const other: Lng = currentLng === 'ru' ? 'en' : 'ru'
		if (byLang[other]) return
		loadProduct(other)
			.then(data => setByLang(prev => ({ ...prev, [other]: data })))
			.catch(() => {})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLng, id])

	if (isLoading)
		return (
			<div className='mb-[100px] mt-[100px]'>
				<h1 className='text-center text-[30px] font-semibold text-[#FFFFFF]'>
					Loading...
				</h1>
			</div>
		)

	if (productInfo === null)
		return (
			<div className='mb-[100px] mt-[100px]'>
				<h1 className='text-center text-[30px] font-semibold text-[#FFFFFF]'>
					{t('ProductItem.not_found') || 'Товара нет'}
				</h1>
			</div>
		)

	const separatedName = productInfo.name.split(' ')
	const activeVariant =
		productInfo.variants.find(v => v.id === Number(version.split('-')[1])) ||
		productInfo.variants[0]

	// розкладемо характеристики у 2 колонки як на макеті
	const features = activeVariant.features || []
	const mid = Math.ceil(features.length / 2)
	const colLeft = features.slice(0, mid)
	const colRight = features.slice(mid)

	return (
		<>
			<Wrapper
				style={{ borderTopStyle: 'solid', borderBottomStyle: 'dashed' }}
				className='pt-[35px] main-wrapper flex gap-[20px] mb-[96px]! border-t border-b border-[#313131]! customScreen:flex-col customScreen:gap-[0px]'
			>
				{/* LEFT */}
				<WrapperContent className='overflow-hidden flex flex-col gap-[20px] w-[60%] relative'>
					<Title className='text-[70px] font-[600]'>
						{separatedName.map((item: string, index: number) =>
							index === separatedName.length - 1 ? null : (
								<span key={item}>{item + ' '}</span>
							)
						)}{' '}
						<OutlineText className='text-[70px] font-bold'>
							{separatedName[separatedName.length - 1]}
						</OutlineText>
					</Title>

					<p className='max-w-[700px] mb-[23px] text-[15px] leading-[24px] uppercase font-[500] text-[#FFFFFF]'>
						<span className='text-[#4BC785]'>{t('ProductItem.text1')}</span>{' '}
						{t('ProductItem.text2')}
					</p>

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
										<CardWrapper className='w-[50%] h-full relative left-[25%] z-[3] relative'>
											<Card
												title={slide.title}
												subtitle={slide.subtitle}
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
				<SecondInfo className='border-l border-dashed border-[#313131]! w-[40%] pl-[20px]'>
					<div className='flex flex-row justify-between mb-[7px]'>
						<CenterText className='text-[18px] font-light text-[#FFFFFFA8]'>
							{t('ProductItem.article')}: {productInfo.id}
						</CenterText>
						<p className='text-[14px] font-light text-[#1DCF94]'>
							{activeVariant.stock.length > 0
								? t('ProductItem.availability')
								: t('ProductItem.not_availability')}
						</p>
					</div>

					<CenterText className='text-[30px] font-semibold leading-[50px] mb-[20px]'>
						{formatPrice(Number(price))} $
					</CenterText>

					<BuyButton
						onClick={() => {
							addToBasket({
								id: productInfo.id,
								variantId: activeVariant.id,
								name: productInfo.name,
								price: activeVariant.price,
								quantity: 1,
								photo: activeVariant.images[0]?.image || '/img/placeholder.png'
							})
							router.push('/basket')
						}}
						className='cursor-pointer hover:bg-[#4BC785] mb-[40px] max-w-[270px] w-[100%] h-[58px] border border-solid border-[#4BC785] bg-[transparent] text-[#ffffff] text-[15px] font-semibold rounded-[61px]'
					>
						{t('ProductItem.buy')}
					</BuyButton>

					{/* Versions */}
					<div className='border-b border-dashed border-[#313131]! mb-[22px]'></div>
					{/* ^^^^^^^  ✅ FIX: було mb={[22]} — спричиняло білд-помилку */}

					<CenterText className='text-[23px] uppercase font-semibold text-[#FFFFFF] mb-[20px]'>
						{t('ProductItem.version')}
					</CenterText>

					<VersionList>
						{productInfo.variants.map(item => (
							<WrapperVersion
								key={`version-${item.id}`}
								className='flex items-center gap-[10px] pl-[25px] relative bg-[#0D0C0C] rounded-[8px] p-[10px] cursor-pointer'
								style={{
									color:
										version === `version-${item.id}` ? '#4BC785' : '#FFFFFF'
								}}
								htmlFor={`version-${item.id}`}
							>
								<input
									type='radio'
									id={`version-${item.id}`}
									value={`version-${item.id}`}
									name='version'
									className='version-radio'
									checked={version === `version-${item.id}`}
									onChange={e => {
										setVersion(e.target.value)
										setPrice(item.price)
									}}
								/>
								<span className='truncate'>{item.sku}</span>
							</WrapperVersion>
						))}
					</VersionList>

					{/* Socket */}
					{productInfo.variants.some(v => v.socket !== null) && (
						<>
							<CenterText className='text-[23px] uppercase font-semibold text-[#FFFFFF] mb-[20px] mt-[22px]'>
								{t('ProductItem.socket')}
							</CenterText>
							<SocketList>
								{productInfo.variants
									.filter(v => v.socket !== null)
									.map(v => (
										<WrapperVersion
											key={`socket-${v.id}`}
											className='flex items-center gap-[10px] pl-[25px] relative bg-[#0D0C0C] rounded-[8px] p-[10px] cursor-pointer'
											style={{
												color:
													version === `version-${v.id}` ? '#4BC785' : '#FFFFFF'
											}}
											htmlFor={`socket-${v.id}`}
										>
											<input
												type='radio'
												id={`socket-${v.id}`}
												value={`version-${v.id}`}
												name='socket'
												className='version-radio'
												checked={version === `version-${v.id}`}
												onChange={e => {
													setVersion(e.target.value)
													setPrice(v.price)
												}}
											/>
											<span className='truncate'>
												{v.socket?.name || v.socket?.code}
											</span>
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
						<p
							className={`text-[14px] leading-[18px] text-[#FFFFFFA8] transition-[max-height] duration-300 ease-in-out overflow-hidden ${
								showDescription ? 'max-h-[200px] overflow-y-auto' : 'max-h-0'
							}`}
						>
							{productInfo.description}
						</p>
					</div>
				</SecondInfo>
			</Wrapper>

			{/* TECH CHARACTERISTICS — дизайн як на скріні */}
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
	)
}

/* ===================== styled-components ===================== */

const bg = '#0D0C0C'

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
	letter-spacing: 0%;
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

/* Версії/сокети — адаптивні сітки */
const VersionList = styled.div`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 10px 12px;
	padding-bottom: 30px;
	border-bottom: 1px dashed #313131;

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
	}
`
const SocketList = styled(VersionList)`
	border-bottom: 1px dashed #313131;
`

/* ====== ТЕХ. ХАРАКТЕРИСТИКИ — як у кошику і по центру ====== */

/* ширший контейнер + центральне вирівнювання */
const TechBlock = styled.section`
	margin: 40px auto 60px;
	max-width: min(95vw, 1440px); /* було ~1100 — тепер до 1440px, але з полями */
	width: 100%;
	padding: 0 24px; /* трохи ширші бокові відступи */
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

/* ґрід всередині теж ширший і по центру */
const TechColumns = styled.div`
	max-width: min(92vw, 1280px); /* було ~980 — розтягнули */
	margin: 0 auto;
	width: 100%;

	display: grid;
	grid-template-columns: 1fr 1px 1fr;
	gap: 28px; /* трішки більше повітря */

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

/* Рядок з таким самим підкресленням, як у CartSummary:
   - .name: пунктир знизу (#ffffff42)
   - .value: градієнтний underline 2px */
const TechRow = styled.div`
	display: grid;
	grid-template-columns: 240px 1fr;
	align-items: end; /* щоб лінії збігались по базовій лінії */
	gap: 24px;
	padding: 8px 0;

	.name {
		color: #ffffffa8;

		font-weight: 300;
		font-style: Light;
		font-size: 14px;
		leading-trim: NONE;
		line-height: 18px;
		letter-spacing: 1%;

		padding-bottom: 12px;
		border-bottom: 1px dashed #ffffff42; /* як Label у кошику */
	}

	.value {
		position: relative;
		color: #ffffffc9;
		font-weight: 500;
		font-style: Medium;
		font-size: 14px;
		leading-trim: NONE;
		line-height: 18px;
		letter-spacing: 1%;

		padding-bottom: 14px; /* місце під лінію */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.value::after {
		/* як Value у кошику */
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
