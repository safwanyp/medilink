/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'orange': '#FCA968',
        'orange-light': '#FDB87C',
        'off-white': '#FAF8F4',
        'cream': '#EFE0D1',
        'dark-grey': '#131313',
        'light-grey': '#535461',
        'shadow': '#EE976A',
      },
      fontFamily: {
        'satoshi-med': ['Satoshi Medium', 'sans-serif'],
        'satoshi-med-it': ['Satoshi Medium Italic', 'sans-serif'],
        'satoshi-bold': ['Satoshi Bold', 'sans-serif'],
        'satoshi-bold-it': ['Satoshi Bold Italic', 'sans-serif'],
        'cool': ['cool', 'sans-serif'],
        'cool-con': ['cool condensed', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
