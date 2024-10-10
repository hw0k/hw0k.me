/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'selector',
	theme: {
		screens: {
			'sm': '640px',
			'md': '768px',
			'lg': '920px',
		},
		extend: {
			container: {
				padding: '1rem',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
