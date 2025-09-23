export function formatDate(input: string, locale: string = 'ru') {
	const date = new Date(input)

	if (isNaN(date.getTime())) {
		return '' // якщо дата некоректна → повертаємо пусто
	}

	const parts = new Intl.DateTimeFormat(locale, {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	}).formatToParts(date)

	const formattedDate = parts
		.filter(p => p.type !== 'literal' || p.value.trim() !== 'г.')
		.map(p => p.value)
		.join('')

	const hour = date.getHours().toString().padStart(2, '0')
	const minute = date.getMinutes().toString().padStart(2, '0')

	return `${formattedDate} / ${hour}:${minute}`
}
