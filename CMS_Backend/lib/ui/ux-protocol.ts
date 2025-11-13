/**
 * S2S UX Protocol - Visual and Experiential Foundation
 * 
 * Implements the core design philosophy for Stardust to Sovereignty interface:
 * - Coherence as Design Principle
 * - Transparency of Intelligence
 * - Sovereignty Through Interaction
 * - Calm Technology
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// UX Pace Constants
export const UX_PACE = {
  calm: 1500,
  medium: 800,
  fast: 300,
  instant: 0
} as const;

// Orb Colors - Spectral hues with luminosity
export const ORB_COLORS = {
  1: '#A1C4FD', // Origin Intelligence - Soft blue
  2: '#C2E9FB', // Resonance Mechanics - Light cyan
  3: '#FFEAA7', // Photonic Intelligence - Warm yellow
  4: '#DDA0DD', // Harmonic Architectures - Soft purple
  5: '#98D8C8', // Temporal Sovereignty - Mint green
  6: '#F7DC6F', // Starline Memory - Golden yellow
  7: '#BB8FCE', // Alchemical Current - Lavender
  8: '#85C1E9', // Quantum Intuition - Sky blue
  9: '#F8C471', // Temporal Fluidity - Orange
  10: '#82E0AA', // Ancestral Repatterning - Light green
  11: '#F1948A', // Radiant Transparency - Coral
  12: '#D7BDE2', // Sovereign Field - Light purple
  13: '#AED6F1'  // Bridging Intelligence - Powder blue
} as const;

// Resonance Gradient Colors
export const RESONANCE_GRADIENTS = {
  clarity: 'from-blue-400 to-cyan-400',
  coherence: 'from-green-400 to-emerald-400',
  resonance: 'from-purple-400 to-pink-400',
  sovereignty: 'from-yellow-400 to-orange-400',
  neutral: 'from-gray-400 to-gray-600'
} as const;

// Interface States
export type InterfaceState = 'idle' | 'analyzing' | 'validated' | 'learning';

// Animation Easing
export const EASING = {
  calm: 'cubic-bezier(0.4, 0, 0.2, 1)',
  medium: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  fast: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
} as const;

// Typography Scale
export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'Satoshi', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace']
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem'
  }
} as const;

// UX State Context
interface UXState {
  currentState: InterfaceState;
  resonanceData: {
    clarity: number;
    coherence: number;
    resonance: number;
    sovereignty: number;
  };
  orbAssociations: number[];
  animationPace: keyof typeof UX_PACE;
  isAnimating: boolean;
  setState: (state: InterfaceState) => void;
  updateResonance: (data: Partial<UXState['resonanceData']>) => void;
  setAnimationPace: (pace: keyof typeof UX_PACE) => void;
  triggerAnimation: (duration?: number) => void;
}

const UXStateContext = createContext<UXState | null>(null);

// UX State Provider
export function UXStateProvider({ children }: { children: React.ReactNode }) {
    const [currentState, setCurrentState] = useState<InterfaceState>('idle');
    const [resonanceData, setResonanceData] = useState({
      clarity: 0.5,
      coherence: 0.5,
      resonance: 0.5,
      sovereignty: 0.5
    });
    const [orbAssociations, setOrbAssociations] = useState<number[]>([]);
    const [animationPace, setAnimationPace] = useState<keyof typeof UX_PACE>('calm');
    const [isAnimating, setIsAnimating] = useState(false);

    const setState = useCallback((state: InterfaceState) => {
      setCurrentState(state);
    }, []);

    const updateResonance = useCallback((data: Partial<UXState['resonanceData']>) => {
      setResonanceData(prev => ({ ...prev, ...data }));
    }, []);

  const setAnimationPaceCallback = useCallback((pace: keyof typeof UX_PACE) => {
    setAnimationPace(pace);
  }, []);

    const triggerAnimation = useCallback((duration: number = UX_PACE.medium) => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), duration);
    }, []);

    const value: UXState = {
      currentState,
      resonanceData,
      orbAssociations,
      animationPace,
      isAnimating,
      setState,
      updateResonance,
      setAnimationPace: setAnimationPaceCallback,
      triggerAnimation
    };

    return React.createElement(UXStateContext.Provider, { value }, children);
}

// UX State Hook
export function useUXState() {
  const context = useContext(UXStateContext);
  if (!context) {
    throw new Error('useUXState must be used within a UXStateProvider');
  }
  return context;
}

// Orb Color Utilities
export function getOrbColor(orbNumber: number): string {
  return ORB_COLORS[orbNumber as keyof typeof ORB_COLORS] || ORB_COLORS[1];
}

export function getResonanceGradient(dimension: keyof typeof RESONANCE_GRADIENTS): string {
  return RESONANCE_GRADIENTS[dimension];
}

export function getCoherenceStrength(clarity: number, coherence: number, resonance: number, sovereignty: number): number {
  return (clarity + coherence + resonance + sovereignty) / 4;
}

// Animation Utilities
export function getAnimationDuration(pace: keyof typeof UX_PACE): number {
  return UX_PACE[pace];
}

export function getEasingCurve(pace: keyof typeof UX_PACE): string {
  switch (pace) {
    case 'calm': return EASING.calm;
    case 'medium': return EASING.medium;
    case 'fast': return EASING.fast;
    default: return EASING.medium;
  }
}

// State-based Styling
export function getStateStyles(state: InterfaceState) {
  switch (state) {
    case 'idle':
      return {
        opacity: '0.6',
        filter: 'blur(0.5px)',
        transition: `all ${UX_PACE.calm}ms ${EASING.calm}`
      };
    case 'analyzing':
      return {
        opacity: '0.8',
        filter: 'blur(0px)',
        animation: 'pulse 2s infinite',
        transition: `all ${UX_PACE.medium}ms ${EASING.medium}`
      };
    case 'validated':
      return {
        opacity: '1',
        filter: 'blur(0px)',
        animation: 'none',
        transition: `all ${UX_PACE.fast}ms ${EASING.fast}`
      };
    case 'learning':
      return {
        opacity: '0.9',
        filter: 'blur(0px)',
        animation: 'gentle-oscillation 3s infinite',
        transition: `all ${UX_PACE.calm}ms ${EASING.calm}`
      };
    default:
      return {};
  }
}

// Resonance Color Blending
export function getResonanceColor(
  clarity: number,
  coherence: number,
  resonance: number,
  sovereignty: number
): string {
  const weights = { clarity, coherence, resonance, sovereignty };
  const maxDimension = Object.entries(weights).reduce((a, b) => 
    (weights as any)[a[0]] > (weights as any)[b[0]] ? a : b
  )[0];
  return getResonanceGradient(maxDimension as keyof typeof RESONANCE_GRADIENTS);
}

// Orb Association Colors
export function getOrbAssociationColors(associations: number[]): string[] {
  return associations.map(orb => getOrbColor(orb));
}

// Micro-animation Utilities
export function createMicroAnimation(
  element: HTMLElement,
  animation: string,
  duration: number = UX_PACE.fast
) {
  element.style.animation = `${animation} ${duration}ms ${EASING.fast}`;
  setTimeout(() => {
    element.style.animation = '';
  }, duration);
}

// Accessibility Utilities
export function getAccessibilityLabels(state: InterfaceState, resonanceData: UXState['resonanceData']) {
  const labels = {
    idle: 'System idle, awaiting input',
    analyzing: 'Analyzing resonance patterns',
    validated: `Coherence stabilized at ${resonanceData.coherence.toFixed(2)} - harmonic alignment achieved`,
    learning: 'System learning from new patterns'
  };
  
  return {
    ariaLabel: labels[state],
    role: 'status',
    'aria-live': state === 'analyzing' ? 'polite' : 'off'
  };
}

// Keyboard Navigation
export function getKeyboardNavigation() {
  return {
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Handle activation
      }
    }
  };
}

// Screen Reader Labels
export function getScreenReaderLabels(resonanceData: UXState['resonanceData']) {
  return {
    clarity: `Clarity: ${(resonanceData.clarity * 100).toFixed(1)}%`,
    coherence: `Coherence: ${(resonanceData.coherence * 100).toFixed(1)}%`,
    resonance: `Resonance: ${(resonanceData.resonance * 100).toFixed(1)}%`,
    sovereignty: `Sovereignty: ${(resonanceData.sovereignty * 100).toFixed(1)}%`
  };
}

// Export all utilities
export type { UXState };

