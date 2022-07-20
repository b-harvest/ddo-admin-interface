/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        adieu: 'AdieuBlack',
        'adieu-bold': 'AdieuBold',
      },
      colors: {
        // primary
        yellowCRE: '#FF940A',
        'yellowCRE-active': '#FFC77F',
        lightCRE: '#FFFAF4',
        'lightCRE-o': 'rgba(255,250,244, 0.4)',
        darkCRE: '#1E0E0A',
        'darkCRE-o': 'rgba(30,14,10, 0.4)',
        glowCRE: 'rgb(255, 199, 127)',
        glowDarkCRE: 'rgb(127, 71, 0)',
        // gray palette
        'grayCRE-50': '#f2f4f6',
        'grayCRE-100': '#EEEEEE',
        'grayCRE-200': '#DDDDDD',
        'grayCRE-300': '#999999',
        'grayCRE-400': '#666666',
        'grayCRE-500': '#333333',
        'grayCRE-600': '#222222',
        'grayCRE-50-o': 'rgba(242, 244, 246, 0.5)',
        'grayCRE-100-o': 'rgba(238, 238, 238, 0.5)',
        'grayCRE-200-o': 'rgba(221, 221, 221, 0.3)',
        'grayCRE-300-o': 'rgba(153, 153, 153, 0.3)',
        'grayCRE-400-o': 'rgba(102, 102, 102, 0.3)',
        'grayCRE-500-o': 'rgba(51, 51, 51, 0.3)',
        'grayCRE-600-o': 'rgba(34, 34, 34, 0.3)',
        // semantic colors
        success: '#30B50A',
        'success-light': 'rgba(234, 250, 230, 1)',
        'success-o': 'rgba(48, 181, 10, 0.1)',
        warning: '#FAC400',
        'warning-light': 'rgba(250, 243, 220, 1)',
        'warning-o': 'rgba(250, 196, 0, 0.1)',
        error: '#FF5D67',
        'error-light': 'rgba(252, 235, 236, 1)',
        'error-o': 'rgba(255, 93, 103, 0.1)',
        info: '#608CFF',
        'info-light': 'rgba(230, 236, 252, 1)',
        'info-o': 'rgba(96, 140, 255, 0.1)',
      },
      boxShadow: {
        'normal-l': '0px 0px 5px 2px rgba(0, 0, 0, 0.1)',
        'normal-d': '0px 0px 5px 2px rgba(0, 0, 0, 0.1)',
        'modal-l': '0px 0px 80px 20px rgba(0, 0, 0, 0.05)',
        'modal-d': '0px 0px 100px 20px rgba(0, 0, 0, 0.5)',
        'glow-thin-l': '0px 0px 8px #FFD298',
        'glow-thin-d': '0px 0px 7px #985600',
        'glow-medium-l': '0px 0px 20px 6px rgba(255, 199, 127, 0.2)',
        'glow-medium-d': '0px 0px 20px 6px rgba(127, 71, 0, 0.2)',
        'glow-wide-l': '0px 0px 60px rgba(255, 199, 127, 0.3)',
        'glow-wide-d': '0px 0px 60px rgba(127, 71, 0, 0.3)',
        1: '0px 0px 5px 2px rgba(0, 0, 0, 0.03)',
      },
      transitionProperty: {
        'max-height': 'max-height',
      },
      keyframes: {
        rotate360: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0', display: 'none' },
        },
      },
      animation: {
        spinning: 'rotate360 1s cubic-bezier(0.83, 0, 0.17, 1) infinite',
        'fade-out': 'fade-out 1.5s 0.4s both',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
