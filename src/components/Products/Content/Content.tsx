'use client'

import type { StaticImageData } from 'next/image'
import { useEffect, useMemo, useState } from 'react'
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

export interface IProduct {
	id: number;
	name: string;
	description: string;
	sku: string;
	category: ICategory;
	variants: IVariant[];
}

export interface ICategory {
	id: number;
	name: string;
}

export interface IVariant {
	id: number;
	sku: string;
	socket: ISocket;
	images: IVariantImage[];
	stock: number[]; // якщо може бути більше чисел
	price: number;
}

export interface ISocket {
	code: string;
	name: string;
}

export interface IVariantImage {
	image: string;
	alt_text: string | null;
}

export type ProductArray = IProduct[];

const realData = [
	{
		"id": 1,
		"name": "Online UPS Ariet 1",
		"description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. \r\n    In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. \r\n    Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. \r\n    In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. \r\n    Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
		"sku": "13FK41",
		"category": {
			"id": 1,
			"name": "Online UPS"
		},
		"variants": [
			{
				"id": 1,
				"sku": "SK1441",
				"socket": {
					"code": "C13",
					"name": "C13"
				},
				"images": [
					{
						"image": "https://31.131.21.16/api/media/variant_images/home-bg-1.png",
						"alt_text": null
					},
					{
						"image": "https://31.131.21.16/api/media/variant_images/3d-model.png",
						"alt_text": null
					},
					{
						"image": "https://31.131.21.16/api/media/variant_images/hero-bg.png",
						"alt_text": null
					}
				],
				"stock": [
					1
				],
				"price": 1300
			},
			{
				"id": 2,
				"sku": "SK1321",
				"socket": {
					"code": "C13",
					"name": "C13"
				},
				"images": [
					{
						"image": "https://31.131.21.16/api/media/variant_images/category-4.png",
						"alt_text": null
					},
					{
						"image": "https://31.131.21.16/api/media/variant_images/category-2.png",
						"alt_text": null
					},
					{
						"image": "https://31.131.21.16/api/media/variant_images/category-3.png",
						"alt_text": null
					}
				],
				"stock": [
					2
				],
				"price": 1550
			}
		]
	}
]


export const Content = () => {
	const { t } = useTranslation('common')
	const [productData, setProductData] = useState<IProduct[]>([])

	useEffect(() => {
		fetch('https://31.131.21.16/api/catalog/products/',
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(res => res.json())
			.then(data => setProductData(data))
			.catch(err => setProductData(realData))
	}, [])

	const [activeFilters, setActiveFilters] = useState<string[]>([])
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 10
	})

	const [showFilters, setShowFilters] = useState(false)
	const [query, setQuery] = useState('')

	const filteredData = useMemo(() => {
		return productData.filter(
			p =>
				p.name.toLowerCase().includes(query.toLowerCase()) ||
				p.category.name.toLowerCase().includes(query.toLowerCase())
		)
	}, [query, productData])

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

	const handleLoadMore = () => setProductData(prev => [...prev, ...productData])
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
