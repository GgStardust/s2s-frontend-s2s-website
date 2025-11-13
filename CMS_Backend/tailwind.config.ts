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
        // Primary Brand Colors
        'deep-gold': '#C49A6C',
        'deep-navy': '#1C1F3B',
        'creamy-white': '#F4F1E8',
        'cosmic-blue': '#3E5C76',
        'electric-green': '#7FB069',
        
        // Extended Color Palette
        primary: {
          50: '#FDF8F3',
          100: '#F9F0E6',
          200: '#F2E0CC',
          300: '#E8C9A8',
          400: '#D4A574',
          500: '#C49A6C',
          600: '#B0885A',
          700: '#9C7548',
          800: '#7D5E3A',
          900: '#5E472C',
        },
        secondary: {
          50: '#F8F9FA',
          100: '#F1F3F4',
          200: '#E8EAED',
          300: '#DADCE0',
          400: '#BDC1C6',
          500: '#3E5C76',
          600: '#365066',
          700: '#2E4456',
          800: '#263846',
          900: '#1E2C36',
        },
        neutral: {
          50: '#F4F1E8',
          100: '#E8E4D8',
          200: '#D6D0C0',
          300: '#C4BCA8',
          400: '#B2A890',
          500: '#A09478',
          600: '#8E8060',
          700: '#7C6C48',
          800: '#6A5830',
          900: '#1C1F3B',
        },
        accent: {
          cosmic: '#3E5C76',
          starlight: '#E8D5B7',
          resonance: '#A8C8EC',
          sovereignty: '#D4A574',
          field: '#B8E6B8',
        },
        // 13 Orb-Specific Colors (from Enhanced Plan)
        orb: {
          1: '#8B0000',   // Origin Intelligence - Mitochondrial red
          2: '#1E90FF',   // Resonance Mechanics - Cymatics blue
          3: '#FFFFFF',   // Photonic Intelligence - Prism white
          4: '#FFD700',   // Harmonic Architectures - Geometric gold
          5: '#9370DB',   // Temporal Sovereignty - Spiral violet
          6: '#4169E1',   // Starline Memory - Galactic blue
          7: '#FF4500',   // Alchemical Current - Volcanic orange
          8: '#00CED1',   // Quantum Intuition - Probability cyan
          9: '#48D1CC',   // Temporal Fluidity - Flow turquoise
          10: '#8B4513',  // Ancestral Repatterning - Earth brown
          11: '#F0E68C',  // Radiant Transparency - Luminous yellow
          12: '#DAA520',  // Sovereign Field - Field gold
          13: '#9932CC',  // Bridging Intelligence - Interface purple
        },
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'lora': ['Lora', 'serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],
        'sm': ['1rem', { lineHeight: '1.5rem' }],
        'base': ['1.125rem', { lineHeight: '1.75rem' }],
        'lg': ['1.25rem', { lineHeight: '1.875rem' }],
        'xl': ['1.5rem', { lineHeight: '2rem' }],
        '2xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.75rem', { lineHeight: '3rem' }],
        '5xl': ['3.5rem', { lineHeight: '1' }],
        '6xl': ['4.5rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(196, 154, 108, 0.3)',
        'cosmic': '0 0 30px rgba(62, 92, 118, 0.2)',
        'resonance': '0 0 20px rgba(168, 200, 236, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(196, 154, 108, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'resonance': 'resonance 4s ease-in-out infinite',
        'scrollstream-flow': 'scrollstream-flow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(196, 154, 108, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(196, 154, 108, 0.5), 0 0 40px rgba(196, 154, 108, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        resonance: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'scrollstream-flow': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-cosmic': 'linear-gradient(135deg, #3E5C76 0%, #1C1F3B 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C49A6C 0%, #D4A574 100%)',
        'gradient-resonance': 'linear-gradient(135deg, #A8C8EC 0%, #3E5C76 100%)',
      },
      // Backend-specific utilities
      backgroundColor: {
        'backend-primary': '#FFFFFF',
        'backend-secondary': '#F4F1E8',
        'backend-accent': 'rgba(28, 31, 59, 0.05)',
      },
      borderColor: {
        'backend-default': 'rgba(28, 31, 59, 0.1)',
        'backend-hover': 'rgba(28, 31, 59, 0.2)',
        'backend-focus': '#C49A6C',
      },
      textColor: {
        'backend-primary': '#1C1F3B',
        'backend-secondary': '#3E5C76',
        'backend-muted': '#6B7280',
      },
    },
  },
  plugins: [],
}
export default config
