module.exports = {
  content: ['./src/**/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        montserrrat: ['Montserrat', 'sans-serif'],
        jbmono: ["'JetBrains Mono'", 'ui-monospace'],
      },
      colors: {
        console: '#0dcb21',
        disabled: '#087814',
      },
    },
  },
  plugins: [],
};
