/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a2332',
          dark: '#0f172a',
          light: '#2a3447',
        },
      },
    },
  },
  plugins: [],
};
