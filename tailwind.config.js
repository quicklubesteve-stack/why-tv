/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cable: {
          950: '#06080d',
          900: '#0c1017',
          850: '#111722',
          800: '#17202f',
          700: '#222f44',
          600: '#324461',
          border: '#253348',
          accent: '#eab308', // Warm cable amber
          glow: '#38bdf8',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"Consolas"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'cable-focus': '0 0 0 3px #fbbf24, 0 0 25px rgba(251, 191, 36, 0.45)',
        'cable-glow': '0 0 15px rgba(56, 189, 248, 0.25)',
        'cable-card': '0 4px 20px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
