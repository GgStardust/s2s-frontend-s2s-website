/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // S2S Core Colors
        'deep-navy': '#0a0e1a',
        'deep-gold': '#d4af37',
        'creamy-white': '#f5f5dc',
        'dark-blue': '#1a2332',
        'cosmic-blue': '#1e3a8a',
        
        // Orb Colors
        'orb-1': '#A1C4FD',
        'orb-2': '#C2E9FB',
        'orb-3': '#FFEAA7',
        'orb-4': '#DDA0DD',
        'orb-5': '#98D8C8',
        'orb-6': '#F7DC6F',
        'orb-7': '#BB8FCE',
        'orb-8': '#85C1E9',
        'orb-9': '#F8C471',
        'orb-10': '#82E0AA',
        'orb-11': '#F1948A',
        'orb-12': '#D7BDE2',
        'orb-13': '#AED6F1',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gentle-oscillation': 'gentle-oscillation 3s ease-in-out infinite',
        'resonance-pulse': 'resonance-pulse 2s ease-in-out infinite',
        'coherence-ring': 'coherence-ring 20s linear infinite',
        'field-gradient': 'field-gradient 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'gentle-oscillation': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'resonance-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'coherence-ring': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'field-gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
