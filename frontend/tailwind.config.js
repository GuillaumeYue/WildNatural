/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fdf5f5',
          100: '#fbeaea',
          200: '#f5d4d4',
          300: '#ebb0b0',
          400: '#a02020',
          500: '#7a1414',
          600: '#5c0c0c',
          700: '#420808',
        },
        blush: {
          50: '#fdf6f6',
          100: '#fbeded',
          200: '#f5dada',
        },
        ink: {
          DEFAULT: '#1a1614',
          soft: '#2a2522',
          muted: '#52484a',
        },
        cream: '#faf7f4',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display':    ['5.5rem', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'display-lg': ['7rem',   { lineHeight: '1.0',  letterSpacing: '-0.03em' }],
        'display-xl': ['8rem',   { lineHeight: '0.98', letterSpacing: '-0.035em' }],
      },
    },
  },
  plugins: [],
}
