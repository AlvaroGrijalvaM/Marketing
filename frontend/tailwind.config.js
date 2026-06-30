/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#838661',
          dark: '#838661',
          border: '#46472A',
          heading: '#644D37',
          bg: '#FFF8EF',
        },
      },
      fontFamily: {
        heading: ['Versailles', 'Georgia', 'Times New Roman', 'serif'],
        serif: ['Perandory', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Open Sans', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}