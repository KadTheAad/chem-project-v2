/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        science: {
          900: '#0f172a', // Dark background
          800: '#1e293b', // Card background
          700: '#334155', // Borders/Accents
          500: '#3b82f6', // Primary accent
          400: '#60a5fa', // Highlight
        }
      }
    },
  },
  plugins: [],
}
