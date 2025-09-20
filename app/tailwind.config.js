/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,css,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          foreground: '#ffffff',
        },
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
