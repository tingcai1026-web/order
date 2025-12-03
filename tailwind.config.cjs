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
    keyframes: {
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      'slide-in-right': {
        '0%': { transform: 'translateX(100%)' },
        '100%': { transform: 'translateX(0)' },
      },
      'scale-in': {
        '0%': { transform: 'scale(0.95)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      },
    },
    animation: {
      'fade-in': 'fade-in 0.2s ease-out',
      'slide-in-right': 'slide-in-right 0.3s ease-out',
      'scale-in': 'scale-in 0.2s ease-out',
    },
  },
  plugins: [],
};
