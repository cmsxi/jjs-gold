/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#aa8b5d',
        secondary: '#262627',
        tertiary: '#EBD24A',
      },
      fontFamily: {
        'pretendard': ['Pretendard', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

