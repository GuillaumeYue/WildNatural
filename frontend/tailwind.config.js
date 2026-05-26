/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wildDark: '#020617',
        wildGreen: '#10b981',
      }
    },
  },
  plugins: [],
}