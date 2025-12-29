// tailwind.config.js
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // primario
          50: '#f4f7ff',
          100: '#e2e8ff',
          200: '#c3d1ff',
          300: '#9faeff',
          400: '#6c7dff',
          500: '#3b5bff',   // principal
          600: '#2843d4',
          700: '#1f35a8',
          800: '#18287d',
          900: '#111c55',
        },
        accent: {
          500: '#f97316',   // botones secundarios / highlights
        },
        success: {
          500: '#22c55e',
        },
        danger: {
          500: '#ef4444',
        },
        neutral: colors.slate, // escala neutra para fondos / texto
      },
    },
  },
  plugins: [],
}
