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
		fontFamily: {
			'sans': 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
		},
		extend: {
			container: {
				padding: '1.5rem',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
