/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'selector',
  theme: {
    screens: {
      'lg': '768px',
    },
    fontFamily: {
      'sans': 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
    },
    extend: {
      container: {
        padding: '1.5rem',
      },
      typography: {
        DEFAULT: {
          css: {
            'blockquote': {
              fontStyle: 'normal',
              fontWeight: '400',
            },
            'blockquote p:first-of-type::before': false,
            'blockquote p:first-of-type::after': false,
            'code::before': false,
            'code::after': false,
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
