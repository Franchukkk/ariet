import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const Button = () => {
	const { t } = useTranslation('common')
	const router = useRouter()

	const handleClick = () => {
		router.push('/')
	}

	return (
		<StyledButton onClick={handleClick}>{t('NotFound.button')}</StyledButton>
	)
}

const StyledButton = styled.button`
	margin-top: 2rem;
	font-size: 1rem;
	border-radius: 9999px;
	background-color: #4bc785;
	padding: 1.25rem 2.813rem;
	color: black;
	font-weight: 600;
	box-shadow:
		0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -4px rgba(0, 0, 0, 0.1);
	transition: background-color 0.2s;

	&:hover {
		background-color: #4ade80;
	}

	@media (max-width: 768px) {
		padding: 1rem 2rem;
		font-size: 0.9rem;
	}

	@media (max-width: 480px) {
		width: 100%;
		max-width: 300px;
	}
`
