module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          foreground: '#ffffff',
          900: '#3B0F66',
          700: '#5B21B6',
          500: '#7C3AED',
          300: '#C4B5FD'
        },
        background: '#FFFFFF',
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280'
        },
        text: '#0F172A'
      },
      boxShadow: {
        'card': '0 4px 20px rgba(2,6,23,0.06)'
      }
    },
  },
  plugins: [],
}
