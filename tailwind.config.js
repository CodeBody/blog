/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        "background-secondary": "var(--bg-secondary)",
        foreground: "var(--text-primary)",
        border: "var(--border-color)",
        "border-hover": "var(--border-hover)",
        glass: "var(--bg-glass)",
        "glass-hover": "var(--bg-glass-hover)",
        muted: {
          DEFAULT: "var(--text-muted)",
          foreground: "var(--text-secondary)",
        },
        card: "var(--bg-secondary)",
        "card-foreground": "var(--text-primary)",
        primary: {
          DEFAULT: "var(--text-primary)",
          foreground: "var(--bg-primary)",
        },
        brand: {
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
        }
      },
      backgroundImage: {
        'gradient-brand': 'var(--gradient-brand)',
        'gradient-glow': 'var(--gradient-glow)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        glow: 'var(--shadow-glow)',
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        normal: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'float': 'float 20s infinite ease-in-out alternate',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-30px, 50px) scale(1.1)' },
          '100%': { transform: 'translate(50px, -30px) scale(0.9)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}
