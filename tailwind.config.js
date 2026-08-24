/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: "#0D0D11",
        canvas: "#F7F5EE",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#FF7A00",
          hover: "#E06C00",
        },
        lavender: "#8C9EFF",
        sunshine: "#FFD54F",
        mint: "#00E676",
        punch: "#FF5252",
        sky: "#0084FF",
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
