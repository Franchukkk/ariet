'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiSearch } from 'react-icons/fi'
import styled from 'styled-components'

import { Pagination } from '@/components/Pagination/Pagination'

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

export const Content = () => {
	return (
		<Suspense fallback={null}>
			<ContentInner />
		</Suspense>
	)
}

function ContentInner() {
	const { t } = useTranslation('common')
	const [productData, setProductData] = useState<IProduct[]>([])
	const [categories, setCategories] = useState<ICategory[]>([])

	const searchParams = useSearchParams()
	const categoryQuery = searchParams.get('category')

	const PAGE_SIZE = 6
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const [activeFilters, setActiveFilters] = useState<string[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [showFilters, setShowFilters] = useState(false)
	const [query, setQuery] = useState('')

	// завантаження категорій
	useEffect(() => {
		let alive = true
		fetch('https://rpktask.sytes.net/api/catalog/categories/', {
			method: 'GET',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			cache: 'no-store'
		})
			.then(res => res.json())
			.then(data => {
				if (alive) setCategories(data.results ?? [])
			})
			.catch(() => {})
		return () => {
			alive = false
		}
	}, [])

	// синхронізація фільтра з ?category=ID у URL
	useEffect(() => {
		if (categoryQuery) setActiveFilters([categoryQuery])
		else setActiveFilters([])
		// при зміні категорії/URL — перезавантажуємо першу сторінку
	}, [categoryQuery])

	// універсальний фетчер (replace | append)
	const fetchProducts = async (page: number, mode: 'replace' | 'append') => {
		setLoading(true)
		setError(null)
		try {
			const params = new URLSearchParams()
			params.set('page', String(page))
			params.set('page_size', String(PAGE_SIZE))
			if (query.trim()) params.set('search', query.trim())

			const selectedCats = activeFilters.filter(Boolean)
			if (selectedCats.length === 1) {
				params.set('category', selectedCats[0]) // ?category=1
			} else if (selectedCats.length > 1) {
				// якщо бекенд підтримує IN-фільтр:
				params.set('category__in', selectedCats.join(',')) // ?category__in=1,2,3
				// або повторюваний параметр:
				// selectedCats.forEach(id => params.append('category', id))
			}

			const r = await fetch(
				`https://rpktask.sytes.net/api/catalog/products/?${params.toString()}`,
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

			if (mode === 'replace') setProductData(results)
			else setProductData(prev => [...prev, ...results])

			setTotalPages(Math.max(1, Math.ceil(count / PAGE_SIZE)))
		} catch (e: any) {
			setError(e?.message ?? 'Failed to load')
		} finally {
			setLoading(false)
		}
	}

	// перше завантаження + реакція на зміну фільтрів/пошуку
	useEffect(() => {
		setCurrentPage(1)
		fetchProducts(1, 'replace')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query, activeFilters.join(',')]) // join щоб ефект стабільно тригерився при зміні набору

	const handlePaginationChange = (page: number) => {
		setCurrentPage(page)
		fetchProducts(page, 'replace') // при переході на сторінку — замінюємо, не додаємо
	}

	const handleFilterChange = (filter: string, isReset?: boolean) => {
		setActiveFilters(prev =>
			isReset
				? []
				: prev.includes(filter)
					? prev.filter(f => f !== filter)
					: [...prev, filter]
		)
		// fetch відбудеться вище (ефект на activeFilters)
	}

	const handleLoadMore = async () => {
		const nextPage = currentPage + 1
		if (nextPage > totalPages) return
		await fetchProducts(nextPage, 'append') // ДОБАВЛЯЄМО до списку
		setCurrentPage(nextPage) // оновлюємо лічильник сторінки без перезаміни даних
	}

	const handleToggleShowFilters = () => setShowFilters(prev => !prev)

	// локальний пошук по вже (можливо) дозавантаженому списку
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
