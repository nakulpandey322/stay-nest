/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        harbor: {
          900: '#0F2530',
          800: '#132A3A',
          700: '#1B3A4B',
          600: '#26506A',
        },
        aqua: {
          400: '#8FD8D2',
          300: '#B7E6E2',
        },
        gold: {
          500: '#E8A33D',
          600: '#CE8A28',
        },
        sand: {
          50: '#FBF8F3',
          100: '#F3ECDF',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
