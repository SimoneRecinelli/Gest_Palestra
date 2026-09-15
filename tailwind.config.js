/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#EDE6D6',
        card: '#FAF7F0',
        ink: '#211D17',
        inkmuted: '#6B6355',
        border: '#D8CFBB',
        accent: '#2F4B7C',
        accentdark: '#233A63',
        success: '#4C7A50',
      },
      fontFamily: {
        display: ['var(--font-oswald)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
      },
    },
  },
  plugins: [],
};
