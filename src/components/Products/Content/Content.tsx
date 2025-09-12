'use client'

import type { StaticImageData } from 'next/image'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiSearch } from 'react-icons/fi'
import styled from 'styled-components'

import { Pagination } from '@/components/Pagination/Pagination'

import productImg from '@/assets/img/module.png'

import { Models } from '../../Search/Models/Models'

import { Filters } from './Filters/Filters'
import { Header } from './Header/Header'
import { List } from './List'
import { ShowMore } from './ShowMore'

type ImgLike = string | StaticImageData

export interface IProduct {
	title: string
	category: string
	photo: ImgLike
	link: string
}

export const Content = () => {
	const { t } = useTranslation('common')

	const productData = useMemo<IProduct[]>(
		() => [
			{
				title: t('products.online_ups'),
				category: t('products.single_phase'),
				photo: productImg,
				link: '/'
			},
			{
				title: t('products.offline_ups'),
				category: t('products.three_phase'),
				photo: productImg,
				link: '/'
			},
			{
				title: t('products.line_interactive'),
				category: t('products.single_phase'),
				photo: productImg,
				link: '/'
			}
		],
		[t]
	)

	const [activeFilters, setActiveFilters] = useState<string[]>([])
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 10
	})
	const [data, setData] = useState<IProduct[]>(productData)
	const [showFilters, setShowFilters] = useState(false)
	const [query, setQuery] = useState('')

	const filteredData = useMemo(() => {
		return data.filter(
			p =>
				p.title.toLowerCase().includes(query.toLowerCase()) ||
				p.category.toLowerCase().includes(query.toLowerCase())
		)
	}, [query, data])

	const handlePaginationChange = (page: number) =>
		setPagination(prev => ({
			...prev,
			currentPage: page
		}))

	const handleFilterChange = (filter: string, isReset?: boolean) =>
		setActiveFilters(prev =>
			isReset
				? []
				: prev.includes(filter)
					? prev.filter(f => f !== filter)
					: [...prev, filter]
		)

	const handleLoadMore = () => setData(prev => [...prev, ...productData])
	const handleToggleFilters = () => setShowFilters(!showFilters)

	return (
		<StyledContent className='main-wrapper'>
			<Filters
				activeFilters={activeFilters}
				onChangeFilter={handleFilterChange}
				showFilters={showFilters}
			/>

			<div>
				<Header
					activeFilters={activeFilters}
					onChangeFilter={handleFilterChange}
					showFilters={showFilters}
					onToggleShowFilters={handleToggleFilters}
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
		grid-template-columns: minmax(220px, 300px) 1fr;
		gap: 30px;
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
