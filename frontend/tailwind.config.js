/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
      screens: {
        'xs': '440px',
        ...require('tailwindcss/defaultTheme').screens,
      },
    },
    plugins: [],
  }  