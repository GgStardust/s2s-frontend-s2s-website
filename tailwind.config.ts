import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
