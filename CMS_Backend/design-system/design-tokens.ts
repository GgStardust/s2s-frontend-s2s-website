// S2S Design System - Design Tokens
// A comprehensive design system for Stardust to Sovereignty

export const designTokens = {
  // Color Palette
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#FDF8F3',
      100: '#F9F0E6',
      200: '#F2E0CC',
      300: '#E8C9A8',
      400: '#D4A574',
      500: '#C49A6C', // deep-gold
      600: '#B0885A',
      700: '#9C7548',
      800: '#7D5E3A',
      900: '#5E472C',
    },
    
    // Secondary Colors
    secondary: {
      50: '#F8F9FA',
      100: '#F1F3F4',
      200: '#E8EAED',
      300: '#DADCE0',
      400: '#BDC1C6',
      500: '#3E5C76', // cosmic-blue
      600: '#365066',
      700: '#2E4456',
      800: '#263846',
      900: '#1E2C36',
    },
    
    // Neutral Colors
    neutral: {
      50: '#F4F1E8', // creamy-white
      100: '#E8E4D8',
      200: '#D6D0C0',
      300: '#C4BCA8',
      400: '#B2A890',
      500: '#A09478',
      600: '#8E8060',
      700: '#7C6C48',
      800: '#6A5830',
      900: '#1C1F3B', // deep-navy
    },
    
    // Accent Colors
    accent: {
      cosmic: '#3E5C76',
      starlight: '#E8D5B7',
      resonance: '#A8C8EC',
      sovereignty: '#D4A574',
      field: '#B8E6B8',
    },
    
    // Status Colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    
    // Semantic Colors
    semantic: {
      background: {
        primary: '#F4F1E8',
        secondary: '#1C1F3B',
        tertiary: '#2A2D4A',
        overlay: 'rgba(28, 31, 59, 0.8)',
      },
      text: {
        primary: '#1C1F3B',
        secondary: '#3E5C76',
        tertiary: '#6B7280',
        inverse: '#F4F1E8',
        muted: 'rgba(244, 241, 232, 0.6)',
      },
      border: {
        primary: '#C49A6C',
        secondary: '#3E5C76',
        subtle: 'rgba(196, 154, 108, 0.2)',
        focus: '#C49A6C',
      }
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['Montserrat', 'system-ui', 'sans-serif'],
      serif: ['Lora', 'Georgia', 'serif'],
      mono: ['JetBrains Mono', 'Monaco', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  
  // Spacing
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 20px rgba(196, 154, 108, 0.3)',
    cosmic: '0 0 30px rgba(62, 92, 118, 0.2)',
  },
  
  // Animations
  animation: {
    'fade-in': 'fadeIn 0.5s ease-in-out',
    'slide-up': 'slideUp 0.3s ease-out',
    'slide-down': 'slideDown 0.3s ease-out',
    'scale-in': 'scaleIn 0.2s ease-out',
    'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
    'float': 'float 3s ease-in-out infinite',
    'resonance': 'resonance 4s ease-in-out infinite',
  },
  
  // Transitions
  transition: {
    'colors': 'color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
    'transform': 'transform 0.2s ease-in-out',
    'opacity': 'opacity 0.2s ease-in-out',
    'all': 'all 0.2s ease-in-out',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-Index
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// Component-specific design tokens
export const componentTokens = {
  // Card Components
  card: {
    base: {
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(196, 154, 108, 0.2)',
    },
    elevated: {
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '2px solid rgba(196, 154, 108, 0.3)',
    },
    cosmic: {
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 0 30px rgba(62, 92, 118, 0.2)',
      border: '1px solid rgba(62, 92, 118, 0.3)',
      background: 'linear-gradient(135deg, rgba(62, 92, 118, 0.1) 0%, rgba(28, 31, 59, 0.1) 100%)',
    },
  },
  
  // Button Components
  button: {
    primary: {
      background: 'linear-gradient(135deg, #C49A6C 0%, #D4A574 100%)',
      color: '#1C1F3B',
      borderRadius: '0.75rem',
      padding: '0.75rem 1.5rem',
      fontWeight: '600',
      boxShadow: '0 4px 6px -1px rgba(196, 154, 108, 0.3)',
      hover: {
        background: 'linear-gradient(135deg, #B0885A 0%, #C49A6C 100%)',
        transform: 'translateY(-1px)',
        boxShadow: '0 10px 15px -3px rgba(196, 154, 108, 0.4)',
      },
    },
    secondary: {
      background: 'rgba(62, 92, 118, 0.1)',
      color: '#3E5C76',
      border: '1px solid rgba(62, 92, 118, 0.3)',
      borderRadius: '0.75rem',
      padding: '0.75rem 1.5rem',
      fontWeight: '500',
      hover: {
        background: 'rgba(62, 92, 118, 0.2)',
        borderColor: 'rgba(62, 92, 118, 0.5)',
      },
    },
    ghost: {
      background: 'transparent',
      color: '#F4F1E8',
      border: '1px solid rgba(244, 241, 232, 0.3)',
      borderRadius: '0.75rem',
      padding: '0.75rem 1.5rem',
      fontWeight: '500',
      hover: {
        background: 'rgba(244, 241, 232, 0.1)',
        borderColor: 'rgba(244, 241, 232, 0.5)',
      },
    },
  },
  
  // Input Components
  input: {
    base: {
      background: 'rgba(28, 31, 59, 0.1)',
      border: '1px solid rgba(196, 154, 108, 0.3)',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      color: '#1C1F3B',
      placeholder: 'rgba(28, 31, 59, 0.6)',
      focus: {
        borderColor: '#C49A6C',
        boxShadow: '0 0 0 3px rgba(196, 154, 108, 0.1)',
        outline: 'none',
      },
    },
  },
  
  // Navigation Components
  navigation: {
    background: 'rgba(28, 31, 59, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(196, 154, 108, 0.2)',
    padding: '1rem 1.5rem',
  },
  
  // Orb Components
  orb: {
    size: {
      sm: '2rem',
      md: '3rem',
      lg: '4rem',
      xl: '6rem',
    },
    glow: {
      primary: '0 0 20px rgba(196, 154, 108, 0.4)',
      cosmic: '0 0 20px rgba(62, 92, 118, 0.4)',
      resonance: '0 0 20px rgba(168, 200, 236, 0.4)',
    },
  },
} as const;

// Backend CMS Design Tokens (Clean, Functional)
export const backendTokens = {
  colors: {
    // Primary palette for backend
    primary: '#1C1F3B',      // deep-navy - backgrounds, text
    secondary: '#3E5C76',    // cosmic-blue - accents, hover
    accent: '#C49A6C',       // deep-gold - highlights, important
    background: '#F4F1E8',   // creamy-white - main background

    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // UI element colors
    border: {
      default: 'rgba(28, 31, 59, 0.1)',
      hover: 'rgba(28, 31, 59, 0.2)',
      focus: '#C49A6C',
    },
    text: {
      primary: '#1C1F3B',
      secondary: '#3E5C76',
      muted: '#6B7280',
      inverse: '#F4F1E8',
    },
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Monaco', 'monospace'],
    },
  },

  components: {
    // Clean button styles
    button: {
      primary: {
        background: '#1C1F3B',
        color: '#F4F1E8',
        hover: { background: '#2A2D4A' },
      },
      secondary: {
        background: 'transparent',
        color: '#1C1F3B',
        border: '1px solid #1C1F3B',
        hover: { background: 'rgba(28, 31, 59, 0.05)' },
      },
      ghost: {
        background: 'transparent',
        color: '#3E5C76',
        hover: { background: 'rgba(62, 92, 118, 0.1)' },
      },
    },

    // Clean card styles
    card: {
      background: '#FFFFFF',
      border: '1px solid rgba(28, 31, 59, 0.1)',
      borderRadius: '0.5rem',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      hover: { shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    },

    // Clean input styles
    input: {
      background: '#FFFFFF',
      border: '1px solid rgba(28, 31, 59, 0.2)',
      borderRadius: '0.375rem',
      padding: '0.5rem 0.75rem',
      focus: {
        borderColor: '#C49A6C',
        ring: '0 0 0 3px rgba(196, 154, 108, 0.1)',
      },
    },

    // Clean table styles
    table: {
      header: {
        background: 'rgba(28, 31, 59, 0.05)',
        color: '#1C1F3B',
        fontWeight: '600',
      },
      row: {
        border: '1px solid rgba(28, 31, 59, 0.1)',
        hover: { background: 'rgba(28, 31, 59, 0.02)' },
      },
    },
  },
} as const;

// Frontend Website Design Tokens (Celestial, Mystical)
export const frontendTokens = {
  colors: {
    // Primary palette for frontend
    primary: '#C49A6C',      // deep-gold - sovereignty
    secondary: '#1C1F3B',    // deep-navy - depth
    accent: '#3E5C76',       // cosmic-blue - mystery
    background: '#F4F1E8',   // creamy-white - clarity

    // 13 Orb-specific colors
    orbs: {
      1: '#8B0000',   // Origin Intelligence
      2: '#1E90FF',   // Resonance Mechanics
      3: '#FFFFFF',   // Photonic Intelligence
      4: '#FFD700',   // Harmonic Architectures
      5: '#9370DB',   // Temporal Sovereignty
      6: '#4169E1',   // Starline Memory
      7: '#FF4500',   // Alchemical Current
      8: '#00CED1',   // Quantum Intuition
      9: '#48D1CC',   // Temporal Fluidity
      10: '#8B4513',  // Ancestral Repatterning
      11: '#F0E68C',  // Radiant Transparency
      12: '#DAA520',  // Sovereign Field
      13: '#9932CC',  // Bridging Intelligence
    },
  },

  typography: {
    fontFamily: {
      heading: ['Montserrat', 'sans-serif'],
      body: ['Lora', 'serif'],
      accent: ['Montserrat', 'sans-serif'],
    },
  },

  components: {
    // Celestial button styles
    button: {
      primary: {
        background: 'linear-gradient(135deg, #C49A6C 0%, #D4A574 100%)',
        color: '#1C1F3B',
        shadow: '0 0 20px rgba(196, 154, 108, 0.3)',
        hover: { shadow: '0 0 30px rgba(196, 154, 108, 0.5)' },
      },
    },

    // Mystical card styles
    card: {
      background: 'linear-gradient(135deg, rgba(28, 31, 59, 0.05) 0%, rgba(62, 92, 118, 0.05) 100%)',
      border: '1px solid rgba(196, 154, 108, 0.2)',
      borderRadius: '1rem',
      shadow: '0 0 30px rgba(62, 92, 118, 0.2)',
    },

    // Orb glow effects
    orb: {
      shadow: '0 0 40px rgba(196, 154, 108, 0.6)',
      hover: { shadow: '0 0 60px rgba(196, 154, 108, 0.8)' },
    },
  },
} as const;
