/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './constants.ts',
    './types.ts',
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#FFF3E5',
          100: '#FFE7CC',
          200: '#FFCF99',
          300: '#FFB766',
          400: '#FFA133',
          500: '#FF8000',
          600: '#FF8000',
          700: '#FF8000',
          800: '#FF8000',
          900: '#FF8000',
          950: '#FF8000',
        },
      },
    },
  },
  plugins: [],
};
