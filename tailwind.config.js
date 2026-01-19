/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F3D2B',
          light: '#2A5239',
          dark: '#162C1F',
          50: '#f0f5f1',
          100: '#dce8df',
          200: '#bcd3c2',
          300: '#92b79e',
          400: '#679679',
          500: '#1F3D2B',
          600: '#1a3425',
          700: '#162C1F',
          800: '#122318',
          900: '#0d1912',
        },
        gold: {
          DEFAULT: '#C9A65A',
          light: '#E6D3A3',
          dark: '#B8954A',
        },
        cream: {
          DEFAULT: '#F7F5EF',
          dark: '#EDE9DF',
          light: '#FDFCF9',
        },
        dark: {
          DEFAULT: '#1E1E1E',
        },
        muted: {
          DEFAULT: '#6B7280',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.08)',
        'soft-md': '0 4px 12px -4px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 8px 24px -8px rgba(0, 0, 0, 0.12)',
        'card': '0 4px 20px -4px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px -8px rgba(0, 0, 0, 0.12)',
        'premium': '0 20px 50px -15px rgba(31, 61, 43, 0.2)',
        'premium-sm': '0 4px 15px -3px rgba(31, 61, 43, 0.15)',
      },
      borderRadius: {
        'card': '1.25rem',
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
};
