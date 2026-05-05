/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        'navy-light': '#1e293b',
        'navy-lighter': '#334155',
        primary: '#1E5BA8',
        'primary-light': '#3A7BC8',
        'primary-dark': '#144080',
        secondary: '#00A9B5',
        'secondary-light': '#2CB5BF',
        'secondary-dark': '#008A94',
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(15, 23, 42, 0.15)',
        'premium-lg': '0 25px 60px rgba(15, 23, 42, 0.2)',
        'hover': '0 15px 40px rgba(15, 23, 42, 0.12)',
        'inner-glow': 'inset 0 1px 3px rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'md': '12px',
        'lg': '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(30, 91, 168, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(30, 91, 168, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
