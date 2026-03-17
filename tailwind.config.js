/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#DA6E30',
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
