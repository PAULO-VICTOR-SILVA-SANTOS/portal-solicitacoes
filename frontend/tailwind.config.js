/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dae7ff',
          200: '#bcd3ff',
          300: '#8eb6ff',
          400: '#598eff',
          500: '#3466ff',
          600: '#1c44f5',
          700: '#1533e0',
          800: '#182bb5',
          900: '#19298f',
          950: '#131b57',
        },
        ink: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b6b6c0',
          400: '#8d8d9c',
          500: '#6e6e80',
          600: '#57576a',
          700: '#474756',
          800: '#3c3c48',
          900: '#25252e',
          950: '#0a0a0d',
        },
        success: { DEFAULT: '#16a34a', bg: '#dcfce7', dark: '#166534' },
        warning: { DEFAULT: '#d97706', bg: '#fef3c7', dark: '#92400e' },
        danger: { DEFAULT: '#dc2626', bg: '#fee2e2', dark: '#991b1b' },
        info: { DEFAULT: '#2563eb', bg: '#dbeafe', dark: '#1e40af' },
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        24: '96px',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(10,10,13,0.04), 0 2px 8px rgba(10,10,13,0.04), 0 8px 24px rgba(10,10,13,0.03)',
        card: '0 1px 2px rgba(10,10,13,0.05), 0 4px 12px rgba(10,10,13,0.05)',
        hover: '0 2px 4px rgba(10,10,13,0.06), 0 12px 24px rgba(10,10,13,0.08)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite linear',
        fadeIn: 'fadeIn 200ms ease-out',
      },
    },
  },
  plugins: [],
}
