/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Azul profundo corporativo (confianza y seguridad)
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb6ff',
          400: '#598dff',
          500: '#3366ff',
          600: '#1b47e5',
          700: '#1736b8',
          800: '#152d8f',
          900: '#0f205f', // azul profundo principal
          950: '#0a1640',
        },
        // Acento: verde esmeralda / cian (tecnología y analítica)
        accent: {
          50: '#ecfdf7',
          100: '#d1fae9',
          200: '#a6f3d6',
          300: '#6ee7bd',
          400: '#34d39e',
          500: '#10b981', // esmeralda principal
          600: '#059668',
          700: '#047853',
          800: '#066043',
          900: '#064e38',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 10px 40px -15px rgba(15, 32, 95, 0.18)',
        card: '0 4px 24px -8px rgba(15, 32, 95, 0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
