/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        'tdb-gray': '#F4F4F4',
        'tdb-cyan': '#59D6EA',
        'tdb-red': '#F56565',
        'tdb-yellow': '#FFBD02',
      },
    },
  },
  plugins: [],
}

