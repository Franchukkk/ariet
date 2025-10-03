'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiSearch } from 'react-icons/fi'
import styled from 'styled-components'

import { Pagination } from '@/components/Pagination/Pagination'

import { useCategories } from '@/hooks/useCategories'

import { Models } from '../../Search/Models/Models'

import { Filters } from './Filters/Filters'
import { Header } from './Header/Header'
import { List } from './List'
import { ShowMore } from './ShowMore'

export interface IProduct {
	id: number
	name: string
	description: string
	sku: string
	category: ICategory
	variants: IVariant[]
}
export interface ICategory {
	id: number
	name: string
}
export interface IVariant {
	id: number
	sku: string
	socket: ISocket
	images: IVariantImage[]
	stock: number[]
	price: number
}
export interface ISocket {
	code: string
	name: string
}
export interface IVariantImage {
	image: string
	alt_text: string | null
}
export type ProductArray = IProduct[]

export const Content = () => (
	<Suspense fallback={null}>
		<ContentInner />
	</Suspense>
)

function ContentInner() {
	const { t, i18n } = useTranslation('common')
	const router = useRouter()
	const searchParams = useSearchParams()

	const currentLng = useMemo<'ru' | 'en'>(() => {
		const raw = (i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
		return raw === 'en' ? 'en' : 'ru'
	}, [i18n.language, i18n.resolvedLanguage])

	const searchKey = searchParams.toString()
	const urlQueryParam = (
		searchParams.get('q') ||
		searchParams.get('search') ||
		''
	).trim()
	const urlPageParam = Number(searchParams.get('page') || '1')

	const PAGE_SIZE = 6
	const [productData, setProductData] = useState<IProduct[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const [activeFilters, setActiveFilters] = useState<string[]>([]) // ID як строки
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [showFilters, setShowFilters] = useState(false)
	const [query, setQuery] = useState('')

	const { categories } = useCategories({
		lng: currentLng,
		pageSize: 99
	})

	const splitCsv = (arr: string[]) =>
		arr
			.flatMap(v => v.split(','))
			.map(s => s.trim())
			.filter(Boolean)

	// name -> id (на випадок, якщо в URL опинилося name)
	const ensureId = (v: string): string => {
		if (/^\d+$/.test(v)) return v
		const found = categories.find(c => c.name === v)
		return found ? String(found.id) : ''
	}

	// Синхронізуємо UI з URL (парсимо CSV)
	useEffect(() => {
		setQuery(prev => (prev === urlQueryParam ? prev : urlQueryParam))
		setCurrentPage(
			isFinite(urlPageParam) && urlPageParam > 0 ? urlPageParam : 1
		)

		const raw = searchParams.getAll('category')
		const ids = Array.from(new Set(splitCsv(raw).map(ensureId).filter(Boolean)))
		setActiveFilters(ids)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchKey, categories])

	// Фетч продуктів: `category=1,3,7` (додаємо також category__in як дубль — на випадок різної реалізації бекенду)
	const fetchProducts = async (page: number, mode: 'replace' | 'append') => {
		setLoading(true)
		setError(null)
		try {
			const params = new URLSearchParams(searchParams.toString())

			// пагінація
			params.set('page', String(page))
			params.set('page_size', String(PAGE_SIZE))

			// локальний пошук перекриває URL
			if (query.trim()) params.set('search', query.trim())

			// категорії -> CSV
			const rawCats = params.getAll('category')
			const catIds = Array.from(
				new Set(splitCsv(rawCats).map(ensureId).filter(Boolean))
			)

			params.delete('category')
			params.delete('category__in')

			if (catIds.length > 0) {
				const csv = catIds.join(',')
				params.set('category', csv)
				params.set('category__in', csv) // safe-duplicate
			}

			const r = await fetch(
				`https://test.arietpower.com/api/catalog/products/?${params.toString()}`,
				{
					method: 'GET',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
					cache: 'no-store'
				}
			)
			if (!r.ok) throw new Error(`HTTP ${r.status}`)
			const json = await r.json()
			const results: IProduct[] = json?.results ?? []
			const count: number = json?.count ?? results.length

			setProductData(
				mode === 'replace' ? results : prev => [...prev, ...results]
			)
			setTotalPages(Math.max(1, Math.ceil(count / PAGE_SIZE)))
		} catch (e: any) {
			setError(e?.message ?? 'Failed to load')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchProducts(1, 'replace')
		setCurrentPage(1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchKey, categories])

	const handlePaginationChange = (page: number) => {
		setCurrentPage(page)
		fetchProducts(page, 'replace')
	}

	// Тоглимо ID та зберігаємо їх у URL як CSV в єдиному `category`
	const handleFilterChange = (filter: string, isReset?: boolean) => {
		const params = new URLSearchParams(searchParams.toString())

		const curr = new Set(
			splitCsv(params.getAll('category')).map(ensureId).filter(Boolean)
		)

		if (isReset) {
			params.delete('category')
		} else {
			const val = ensureId(filter)
			if (val) {
				if (curr.has(val)) curr.delete(val)
				else curr.add(val)
			}
			params.delete('category')
			if (curr.size > 0) params.set('category', Array.from(curr).join(','))
		}

		params.delete('page') // на першу сторінку
		router.replace(`/products?${params.toString()}`, { scroll: false })
	}

	const handleLoadMore = async () => {
		const nextPage = currentPage + 1
		if (nextPage > totalPages) return
		await fetchProducts(nextPage, 'append')
		setCurrentPage(nextPage)
	}

	const handleToggleShowFilters = () => setShowFilters(prev => !prev)

	// Локальний пошук по вже завантажених
	const filteredData = useMemo(() => {
		if (!query.trim()) return productData
		const q = query.toLowerCase()
		return productData.filter(
			p =>
				p.name.toLowerCase().includes(q) ||
				p.category.name.toLowerCase().includes(q)
		)
	}, [query, productData])

	return (
		<StyledContent className='main-wrapper'>
			<Filters
				activeFilters={activeFilters}
				onChangeFilter={handleFilterChange}
				showFilters={showFilters}
				onToggleShowFilters={handleToggleShowFilters}
				categories={categories}
			/>

			<div>
				<Header
					activeFilters={activeFilters}
					onChangeFilter={handleFilterChange}
					showFilters={showFilters}
					onToggleShowFilters={handleToggleShowFilters}
					categories={categories}
				/>

				<SearchWrapper>
					<SearchInput
						type='text'
						placeholder={t('search.placeholder')}
						value={query}
						onChange={e => setQuery(e.target.value)}
					/>
					<SearchIcon />
				</SearchWrapper>

				{loading && productData.length === 0 ? null : filteredData.length >
				  0 ? (
					<>
						<List data={filteredData} />

						{currentPage < totalPages && <ShowMore onClick={handleLoadMore} />}

						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePaginationChange}
						/>
					</>
				) : (
					<NoResults>
						<p>{t('search.no_results', { query })}</p>
						<p>{t('search.hint')}</p>
						<ModelsWrapper>
							<Models />
						</ModelsWrapper>
					</NoResults>
				)}
			</div>
		</StyledContent>
	)
}

const SearchIcon = styled(FiSearch)`
	position: absolute;
	right: 14px;
	top: 50%;
	transform: translateY(-50%);
	color: #666;
`
const NoResults = styled.div`
	color: #fff;
	text-align: center;
	margin-top: 40px;
	padding: 0 10px;
	p {
		margin: 8px 0;
		font-size: 16px;
	}
	@media (max-width: 600px) {
		margin-top: 20px;
		p {
			font-size: 14px;
		}
	}
`
const ModelsWrapper = styled.div`
	margin-top: 40px;
	width: 100%;
`
const StyledContent = styled.div`
	display: grid;
	grid-template-columns: minmax(280px, 390px) 1fr;
	gap: 40px;
	grid-auto-rows: max-content;
	margin-bottom: 173px;
	@media (max-width: 1200px) {
		display: block;
	}
	@media (max-width: 1000px) {
		grid-template-columns: 1fr;
		gap: 25px;
	}
	@media (max-width: 600px) {
		margin-bottom: 100px;
	}
`
const SearchWrapper = styled.div`
	position: relative;
	width: 100%;
	margin-bottom: 30px;
`
const SearchInput = styled.input`
	width: 100%;
	padding: 14px 40px 14px 14px;
	font-size: 16px;
	border-radius: 9999px;
	border: 1px solid #333;
	outline: none;
	background: #000000;
	color: #ffffff;
	&::placeholder {
		font-size: 14px;
		color: #666;
	}
	&:focus {
		border-color: #4bc785;
	}
	@media (max-width: 600px) {
		padding: 12px 36px 12px 12px;
		font-size: 14px;
	}
`
