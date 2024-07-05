/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/react';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
import withMT from '@material-tailwind/react/utils/withMT';

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}

export default withMT({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tailwind-datepicker-react/dist/**/*.js',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: '#79ae92',
        secondary: '#202d28',
        tertiary: '#1c5560',
        'black-p': '#0a0c0d',
        'white-p': '#f2f2f2',
        warm: '#fbffcd',
        error: '#FA3729',
        neutral: '#6b7280',
      },
    },
  },
  plugins: [
    nextui({
      defaultTheme: 'dark',
    }),
    addVariablesForColors,
  ],
  darkMode: 'class',
});
