/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-mode="dark"]'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '0.5rem',
      screens: {
        DEFAULT: '1240px'
      }
    },
    extend: {
      screens: {
        xs: '600px'
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        },
        fadeInSlideIn: {
          '0%': { opacity: 0, transform: 'translate3d(0, -30px, 0)' },
          '100%': { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        },
        fadeAsideSlideIn: {
          '0%': { opacity: 0, transform: 'translate3d(-20px, 0, 0)' },
          '100%': { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-slide-in': 'fadeInSlideIn 0.2s ease-in-out forwards',
        'fade-aside-slide-in': 'fadeAsideSlideIn 0.2s ease-in-out forwards'
      },
      backgroundImage: {
        vignette:
          'linear-gradient(rgba(0, 0, 0, 0.4) 0%,rgba(0, 0, 0, 0.396) 2.83%,rgba(0, 0, 0, 0.384) 5.67%,rgba(0, 0, 0, 0.37) 8.5%,rgba(0, 0, 0, 0.34) 11.33%,rgba(0, 0, 0, 0.306) 14.17%,rgba(0, 0, 0, 0.267) 17%,rgba(0, 0, 0, 0.224) 19.83%,rgba(0, 0, 0, 0.176) 22.67%,rgba(0, 0, 0, 0.133) 25.5%,rgba(0, 0, 0, 0.094) 28.33%,rgba(0, 0, 0, 0.06) 31.17%,rgba(0, 0, 0, 0.03) 34%,rgba(0, 0, 0, 0.016) 36.83%,rgba(0, 0, 0, 0.004) 39.67%,rgba(0, 0, 0, 0) 42.5%,rgba(0, 0, 0, 0) 57.5%,rgba(0, 0, 0, 0.004) 60.33%,rgba(0, 0, 0, 0.016) 63.17%,rgba(0, 0, 0, 0.03) 66%,rgba(0, 0, 0, 0.06) 68.83%,rgba(0, 0, 0, 0.094) 71.67%,rgba(0, 0, 0, 0.133) 74.5%,rgba(0, 0, 0, 0.176) 77.33%,rgba(0, 0, 0, 0.224) 80.17%,rgba(0, 0, 0, 0.267) 83%,rgba(0, 0, 0, 0.306) 85.83%,rgba(0, 0, 0, 0.34) 88.67%,rgba(0, 0, 0, 0.37) 91.5%,rgba(0, 0, 0, 0.384) 94.33%,rgba(0, 0, 0, 0.396) 97.17%,rgba(0, 0, 0, 0.4) 100%)'
      }
    }
  },
  corePlugins: {
    aspectRatio: false
  },
  plugins: [require('tailwindcss-touch')()]
};
