/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005BAC',
          light: '#0072CE'
        },
        navy: '#0B2948',
        emerald: '#0f9d58',
        cyan: '#00AEEF',
        gold: '#EAB308',
        neutral: {
          50: '#F3F4F6',
          100: '#EEF4FF',
          200: '#e6edf8',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#6B7280',
          700: '#334155'
        }
      },
      boxShadow: {
        soft: '0 6px 18px rgba(11,30,50,0.08)',
        card: '0 10px 30px rgba(11,30,50,0.06)'
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial']
      }
    }
  },
  plugins: []
};
