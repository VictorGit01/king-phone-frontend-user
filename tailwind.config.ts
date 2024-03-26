/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./**/*.{html, cjs}", "./src/**/*.{js, jsx, ts, tsx}"],
  content: ["./src/**/*.tsx"],
  darkMode: 'class',
  theme: {
    fontFamily: {
      primary: '"Exo 2"',
    },
    container: {
      // center: true,
      padding: {
        // DEFAULT: '15px',
        DEFAULT: '1rem',
        // sm: '3rem'
      }
    },
    screens: {
      xs: '320',
      xssm: '360',
      sm: '640px',
      md: '768px',
      lg: '960px',
      lgxl: '1024px',
      xl: '1360px',
      xxl: '1410px',
    },
    extend: {
      colors: {
        body: '#1D1F23',
        primary: '#151618',
        accent: {
          DEFAULT: '#F6CD46',
          hover: '#E1B72E',
        },

        brandRed: '#F42C37',
        brandYellow: '#FDC62E',
        brandGreen: '#2DCC6F',
        brandBlue: '#1376F4',
        brandWhite: '#EEEEEE'
      },
      backgroundImage: {
        mainSlider: 'url(assets/images/main_slider_bg.jpg)',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        }
      },
      animation: {
        shake: 'shake 1s ease-in-out',
      }
    },
  },
  plugins: [],
}