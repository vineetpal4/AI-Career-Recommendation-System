/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7047EB',
          50: '#F3EFFD',
          100: '#E4D9FA',
          200: '#C9B3F5',
          300: '#AE8DF0',
          400: '#9367EB',
          500: '#7047EB',
          600: '#5A35CC',
          700: '#4D2CB5',
          800: '#3B2189',
          900: '#29175E',
        },
        peach: {
          DEFAULT: '#FFB38A',
          50: '#FFF0E7',
          100: '#FFE1CF',
          200: '#FFC3A0',
          300: '#FFB38A',
          400: '#FF9A66',
          500: '#FF8142',
        },
        lavender: {
          DEFAULT: '#C8B8FF',
          100: '#EDE8FF',
          200: '#DDD4FF',
          300: '#C8B8FF',
          400: '#B39DFF',
        },
        warm: {
          DEFAULT: '#FFFCF8',
          100: '#FFFCF8',
          200: '#FFF5ED',
        },
        text: {
          DEFAULT: '#27223A',
          muted: '#6B6480',
          light: '#9B94B0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7047EB 0%, #4D2CB5 100%)',
        'gradient-peach': 'linear-gradient(135deg, #FFB38A 0%, #FF8142 100%)',
        'gradient-hero': 'linear-gradient(135deg, #FFFCF8 0%, #F3EFFD 50%, #FFF0E7 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(243,239,253,0.9) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(112, 71, 235, 0.3)',
        'glow-peach': '0 0 20px rgba(255, 179, 138, 0.3)',
        'card': '0 4px 24px rgba(112, 71, 235, 0.08)',
        'card-hover': '0 8px 40px rgba(112, 71, 235, 0.15)',
        'premium': '0 20px 60px rgba(112, 71, 235, 0.12)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'gradient': 'gradient 8s ease infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
