import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        /** Fluid book-title scale for hero and major headings */
        display: [
          'clamp(1.875rem, 1.35rem + 2vw, 2.75rem)',
          { lineHeight: '1.12', letterSpacing: '-0.025em' },
        ],
        'section-title': [
          'clamp(1.25rem, 1.1rem + 0.45vw, 1.5rem)',
          { lineHeight: '1.25', letterSpacing: '-0.02em' },
        ],
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
      },
      colors: {
        // Primary palette - cosmic dark backgrounds
        cosmic: {
          blue: '#0A0E27',
          'blue-light': '#1A2342',
        },
        // Fluorescent accent colors
        fluorescent: {
          blue: '#00D4FF',
          cyan: '#4DFFFF',
          purple: '#9D4EDD',
        },
        // Text colors
        cream: '#F4F1E8',
        'city-light': '#F8F9FA',
        // Terminator border colors (used in gradient)
        terminator: {
          gold: '#FFB347',
          orange: '#FFA500',
          blue: '#4A9EFF',
        },
      },
    },
  },
  plugins: [],
}
export default config
