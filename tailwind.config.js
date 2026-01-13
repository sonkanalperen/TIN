/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "!./node_modules/**"
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: 'var(--primary)',
        bg: 'var(--bg)',
        text: 'var(--text)',
        accent: 'var(--accent)',
      }
    },
  },
  plugins: [],
}
