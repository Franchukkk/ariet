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

// Обгортка без хуків
export const Content = () => {
	return (
		<Suspense fallback={null}>
			<ContentInner />
		</Suspense>
	)
}

// Сам компонент із useSearchParams усередині під Suspense
function ContentInner() {
	const { t } = useTranslation('common')
	const [productData, setProductData] = useState<IProduct[]>([])
	const [categories, setCategories] = useState<ICategory[]>([])

	const searchParams = useSearchParams()
	const categoryQuery = searchParams.get('category')

	useEffect(() => {
		fetch('https://rpktask.sytes.net/api/catalog/products/')
			.then(res => res.json())
			.then(data => setProductData(data.results))
	}, [])

	useEffect(() => {
		fetch('https://rpktask.sytes.net/api/catalog/categories/')
			.then(res => res.json())
			.then(data => setCategories(data.results))
	}, [])

	const [activeFilters, setActiveFilters] = useState<string[]>([])
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 10
	})
	const [showFilters, setShowFilters] = useState(false)
	const [query, setQuery] = useState('')

	useEffect(() => {
		if (categoryQuery) setActiveFilters([categoryQuery])
	}, [categoryQuery])

	const filteredData = useMemo(() => {
		return productData.filter(p => {
			const matchesQuery =
				p.name.toLowerCase().includes(query.toLowerCase()) ||
				p.category.name.toLowerCase().includes(query.toLowerCase())

			const matchesFilters =
				activeFilters.length === 0 ||
				activeFilters.includes(p.category.id.toString())

			return matchesQuery && matchesFilters
		})
	}, [query, productData, activeFilters])

	const handlePaginationChange = (page: number) =>
		setPagination(prev => ({ ...prev, currentPage: page }))

	const handleFilterChange = (filter: string, isReset?: boolean) =>
		setActiveFilters(prev =>
			isReset
				? []
				: prev.includes(filter)
					? prev.filter(f => f !== filter)
					: [...prev, filter]
		)

	const handleLoadMore = () => setProductData(prev => [...prev, ...productData])
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
						onChange={e => setQuery(e.target.value)}
					/>
					<SearchIcon />
				</SearchWrapper>

				{filteredData.length > 0 ? (
					<>
						<List data={filteredData} />
						<ShowMore onClick={handleLoadMore} />
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
