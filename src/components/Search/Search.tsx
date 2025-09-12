'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiSearch } from 'react-icons/fi'
import styled from 'styled-components'

import { Models } from './Models/Models'

export const SearchPage = () => {
	const [query, setQuery] = useState('')
	const { t } = useTranslation('common')

	const filteredModels: any[] = []

	return (
		<Container>
			<SearchWrapper>
				<SearchInput
					type='text'
					placeholder={t('search.placeholder')}
					value={query}
					onChange={e => setQuery(e.target.value)}
				/>
				<SearchIcon />
			</SearchWrapper>

			{query && (
				<>
					{filteredModels.length === 0 && (
						<NoResults>
							<p>{t('search.no_results', { query })}</p>
							<p>{t('search.hint')}</p>
						</NoResults>
					)}
					<ModelsWrapper>
						<Models />
					</ModelsWrapper>
				</>
			)}
		</Container>
	)
}

const Container = styled.div`
	margin: 0 auto;
	max-width: 1500px;
	padding: 40px 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
`
const SearchWrapper = styled.div`
	position: relative;
	width: 100%;
	max-width: 1300px;
`
const SearchInput = styled.input`
	width: 100%;
	padding: 20px 14px;
	padding-right: 40px;
	font-size: 16px;
	border-radius: 9999px;
	border: 1px solid #333;
	outline: none;

	&:focus {
		border-color: #4bc785;
	}
`
const SearchIcon = styled(FiSearch)`
	position: absolute;
	right: 20px;
	top: 50%;
	transform: translateY(-50%);
	color: #999;
	pointer-events: none;
`
const NoResults = styled.div`
	color: #fff;
	text-align: center;
	margin-top: 40px;

	p {
		margin: 8px 0;
	}
`
const ModelsWrapper = styled.div`
	margin-top: 40px;
	width: 100%;
`
