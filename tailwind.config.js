/** @type {import('tailwindcss').Config} */
// Palette ispirata ai dischi olimpici (IWF): ogni colore ha un peso, qui diventa un ruolo.
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        chalk: '#E7E8E3', // fondo pagina: magnesite, fredda
        surface: '#FAFAF7', // card
        rubber: '#15171A', // gomma del pavimento: testo e barre scure
        rubber2: '#23262B', // gomma, un gradino più chiara
        steel: '#5C6169', // testo secondario
        line: '#CFD1CA', // filetti
        signal: '#D42B1E', // disco rosso da 25 kg: azione principale
        signaldark: '#AE2016',
        tape: '#F2CB2E', // nastro giallo: istruzioni del PT
        plate: {
          red: '#D42B1E',
          blue: '#1F5FBF',
          yellow: '#E3B21A',
          green: '#2E8B4A',
          orange: '#E5731F',
          violet: '#7A4FB5',
          steel: '#5C6169',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
        card: '16px',
      },
      minHeight: {
        tap: '48px',
      },
    },
  },
  plugins: [],
};
