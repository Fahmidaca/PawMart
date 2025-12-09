/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'warm': {
          50: '#fef7ee',
          100: '#fdead6',
          200: '#fbd6a5',
          300: '#f8bc6a',
          400: '#f49537',
          500: '#f1761a',
          600: '#e25a0e',
          700: '#bb430d',
          800: '#953412',
          900: '#792c12',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: [
      {
        warmpaws: {
          "primary": "#f1761a",
          "primary-focus": "#e25a0e",
          "primary-content": "#ffffff",
          "secondary": "#f49537",
          "accent": "#fbbf24",
          "neutral": "#374151",
          "neutral-focus": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "winter",
      "light"
    ],
  },
}
