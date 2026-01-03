/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)', // blue-900
          foreground: 'var(--color-primary-foreground)' // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // teal-700
          foreground: 'var(--color-secondary-foreground)' // white
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // amber-500
          foreground: 'var(--color-accent-foreground)' // gray-800
        },
        background: 'var(--color-background)', // gray-50
        foreground: 'var(--color-foreground)', // gray-900
        card: {
          DEFAULT: 'var(--color-card)', // slate-50
          foreground: 'var(--color-card-foreground)' // gray-800
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)' // gray-900
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // gray-100
          foreground: 'var(--color-muted-foreground)' // gray-500
        },
        border: 'var(--color-border)', // gray-200
        input: 'var(--color-input)', // gray-200
        ring: 'var(--color-ring)', // amber-500
        success: {
          DEFAULT: 'var(--color-success)', // emerald-600
          foreground: 'var(--color-success-foreground)' // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-600
          foreground: 'var(--color-warning-foreground)' // white
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-600
          foreground: 'var(--color-error-foreground)' // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-600
          foreground: 'var(--color-destructive-foreground)' // white
        }
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Nunito Sans', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace']
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '96': '24rem',
        '144': '36rem'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(30, 58, 138, 0.08)',
        'DEFAULT': '0 3px 6px rgba(30, 58, 138, 0.10)',
        'md': '0 6px 12px rgba(30, 58, 138, 0.12)',
        'lg': '0 12px 24px rgba(30, 58, 138, 0.14)',
        'xl': '0 24px 48px rgba(30, 58, 138, 0.16)',
        '2xl': '0 32px 64px -16px rgba(30, 58, 138, 0.16)'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      },
      animation: {
        'fade-in': 'fade-in 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slide-up 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slide-down 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
      },
      zIndex: {
        '1': '1',
        '50': '50',
        '100': '100',
        '200': '200',
        '300': '300',
        '999': '999'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ]
}