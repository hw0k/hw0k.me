/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
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
}
