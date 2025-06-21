/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'eldercare': {
          'primary': '#8A9C7B',
          'primary-dark': '#6B7A5A',
          'secondary': '#452211',
          'background': '#FFF8F0',
          'sidebar': '#FAF3E0',
          'text': '#333333',
          'text-light': '#666666',
        }
      },
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
        'opensans': ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '36px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '70': '17.5rem',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      }
    },
  },
  plugins: [],
};