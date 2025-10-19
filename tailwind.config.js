/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      fontFamily: {
        space: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      extend: {
        colors: {
          background: '#040718',
          foreground: '#ededed',
        },
        backgroundImage: {
          'space-gradient': 'linear-gradient(135deg, #040718 0%, #0b1739 100%)',
        }
      },
    },
    plugins: [],
  }
  