/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37', // Color dorado que contrasta bien en fondos claros y oscuros
          50: '#FBF8E9',
          100: '#F7F1D3',
          200: '#EFE2A7',
          300: '#E7D47B',
          400: '#DFC64F',
          500: '#D4AF37', // Base
          600: '#B39328',
          700: '#8D731F',
          800: '#685417',
          900: '#42350E',
          950: '#2A220A',
        },
        secondary: 'var(--color-secondary)',
        light: 'var(--color-light)',
        'bg-soft': 'var(--color-bg-soft)',
        'bg-accent': 'var(--color-bg-accent)',
        blue: {
          50: 'var(--color-blue-50)',
          100: 'var(--color-blue-100)',
          200: 'var(--color-blue-200)',
          300: 'var(--color-blue-300)',
          400: 'var(--color-blue-400)',
          500: 'var(--color-blue-500)',
          600: 'var(--color-blue-600)',
          700: 'var(--color-blue-700)',
          800: 'var(--color-blue-800)',
          900: 'var(--color-blue-900)',
        },
        gray: {
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
      },
    },
  },
  plugins: [],
}

