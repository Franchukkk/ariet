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
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1
	})
	const [showFilters, setShowFilters] = useState(false)
	const [query, setQuery] = useState('')

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

	useEffect(() => {
		if (categoryQuery) setActiveFilters([categoryQuery])
		else setActiveFilters([])

		setPagination(p => ({ ...p, currentPage: 1 }))
	}, [categoryQuery])

	useEffect(() => {
		let alive = true
		const controller = new AbortController()
		setLoading(true)
		setError(null)

		const params = new URLSearchParams()
		params.set('page', String(pagination.currentPage))
		params.set('page_size', String(PAGE_SIZE))
		if (query.trim()) params.set('search', query.trim())

		fetch(
			`https://rpktask.sytes.net/api/catalog/products/?${params.toString()}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				cache: 'no-store',
				signal: controller.signal
			}
		)
			.then(async r => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`)
				const json = await r.json()
				if (!alive) return
				const results: IProduct[] = json?.results ?? []
				const count: number = json?.count ?? results.length
				setProductData(results)
				setPagination(p => ({
					...p,
					totalPages: Math.max(1, Math.ceil(count / PAGE_SIZE))
				}))
			})
			.catch(e => {
				if (alive) setError(e?.message ?? 'Failed to load')
			})
			.finally(() => {
				if (alive) setLoading(false)
			})

		return () => {
			alive = false
			controller.abort()
		}
	}, [pagination.currentPage, query])

	const filteredData = useMemo(() => {
		const byCategory =
			activeFilters.length === 0
				? productData
				: productData.filter(p =>
						activeFilters.includes(p.category.id.toString())
					)

		if (!query.trim()) return byCategory
		const q = query.toLowerCase()
		return byCategory.filter(
			p =>
				p.name.toLowerCase().includes(q) ||
				p.category.name.toLowerCase().includes(q)
		)
	}, [query, productData, activeFilters])

	const handlePaginationChange = (page: number) =>
		setPagination(prev => ({ ...prev, currentPage: page }))

	const handleFilterChange = (filter: string, isReset?: boolean) => {
		setActiveFilters(prev =>
			isReset
				? []
				: prev.includes(filter)
					? prev.filter(f => f !== filter)
					: [...prev, filter]
		)
		setPagination(p => ({ ...p, currentPage: 1 }))
	}

	const handleLoadMore = async () => {
		const nextPage = pagination.currentPage + 1
		if (nextPage > pagination.totalPages) return

		const params = new URLSearchParams()
		params.set('page', String(nextPage))
		params.set('page_size', String(PAGE_SIZE))
		if (query.trim()) params.set('search', query.trim())

		try {
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
			const more: IProduct[] = json?.results ?? []
			setProductData(prev => [...prev, ...more])
			setPagination(p => ({ ...p, currentPage: nextPage }))
		} catch {}
	}

	const handleToggleFilters = () => setShowFilters(!showFilters)

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
					onToggleShowFilters={handleToggleFilters}
					categories={categories}
				/>

				<SearchWrapper>
					<SearchInput
						type='text'
						placeholder={t('search.placeholder')}
						value={query}
						onChange={e => {
							setQuery(e.target.value)
							setPagination(p => ({ ...p, currentPage: 1 }))
						}}
					/>
					<SearchIcon />
				</SearchWrapper>

				{loading && productData.length === 0 ? null : filteredData.length >
				  0 ? (
					<>
						<List data={filteredData} />

						{pagination.currentPage < pagination.totalPages && (
							<ShowMore onClick={handleLoadMore} />
						)}

						<Pagination
							currentPage={pagination.currentPage}
							totalPages={pagination.totalPages}
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
