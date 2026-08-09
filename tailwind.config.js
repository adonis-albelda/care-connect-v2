/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'connect-blue': '#183891',
        'care-orange': '#E68A25',
        'blue-deep': '#0F2461',
        'blue-light': '#D6E0F5',
        'orange-light': '#FCE3C5',
        'orange-deep': '#B5680F',
        ink: '#1A1D29',
        slate: '#5B6070',
        mist: '#9AA0B0',
        cloud: '#F4F6FA',
        border: '#E3E6ED',
        success: '#2E9E5B',
        warning: '#E6A825',
        error: '#D64545',
      },
      fontFamily: {
        headline: ['var(--font-poppins)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(2.25rem, 6vw + 1rem, 3.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
        h1: ['36px', { lineHeight: '1.25', fontWeight: '700' }],
        h2: ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        card: '0px 4px 20px rgba(24,56,145,0.08)',
        'card-hover': '0px 8px 28px rgba(24,56,145,0.14)',
      },
      maxWidth: {
        content: '1280px',
      },
      transitionDuration: {
        DEFAULT: '250ms',
      },
    },
  },
  plugins: [],
}
