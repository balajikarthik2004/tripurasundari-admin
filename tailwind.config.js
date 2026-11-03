/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem',
      },
      colors: {
        temple: {
          burgundy: '#55132D',
          maroon: '#681B37',
          'burgundy-deep': '#400D21',
          'burgundy-active': '#6A1938',
          'burgundy-hover': '#5F1633',
          gold: '#B68A36',
          'gold-light': '#E2BC6B',
          'gold-soft': 'rgba(182, 138, 54, 0.15)',
          'gold-ring': 'rgba(226, 188, 107, 0.4)',
          cream: '#F8F5EF',
          'cream-warm': '#F3EFE6',
          surface: '#FFFFFF',
          'text-primary': '#28212A',
          'text-secondary': '#77717A',
          'text-muted': '#A49EA8',
          border: '#E8E2D8',
          'border-dark': 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Montserrat', 'sans-serif'],
        body: ['var(--font-body)', 'Roboto', 'sans-serif'],
        sans: ['var(--font-body)', 'Roboto', 'sans-serif'],
        serif: ['var(--font-heading)', 'Montserrat', 'sans-serif'],
        number: ['var(--font-number)', 'Inter', 'sans-serif'],
        mono: ['var(--font-number)', 'Inter', 'monospace'],
        montserrat: ['Montserrat', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(40, 33, 42, 0.05), 0 1px 2px rgba(40, 33, 42, 0.03)',
        'card': '0 4px 12px -2px rgba(40, 33, 42, 0.06), 0 2px 6px -1px rgba(40, 33, 42, 0.04)',
        'sidebar-active': 'inset 3px 0 0 0 #E2BC6B',
      }
    },
  },
  plugins: [],
}

