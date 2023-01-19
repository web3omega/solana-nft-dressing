/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        eczar: ['"Eczar"', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}