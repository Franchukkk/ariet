module.exports = {
	content: [
		'./app/**/*.{ts,tsx}',
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}'
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"TT Firs Neue"', 'ui-sans-serif', 'system-ui', 'sans-serif']
			}
		}
	},
	plugins: []
}
