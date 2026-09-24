/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      colors: {
        ios: {
          bg: '#F2F2F7',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B',
          red: '#DC2626',
          redLight: '#FEF2F2',
          redBorder: '#FECACA',
          green: '#059669',
          greenLight: '#ECFDF5',
          greenBorder: '#A7F3D0',
          blue: '#2563EB',
          blueLight: '#EFF6FF',
          amber: '#D97706',
          amberLight: '#FFFBEB'
        }
      },
      boxShadow: {
        'ios-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'ios': '0 4px 14px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        'ios-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'ios-sheet': '0 -8px 30px rgba(0, 0, 0, 0.12)'
      }
    }
  }
};