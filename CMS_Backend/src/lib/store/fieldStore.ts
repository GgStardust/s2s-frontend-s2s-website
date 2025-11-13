/**
 * Field Console State Management (Zustand)
 * 
 * Central store for field state, RBI data, and UI state
 */

import { create } from 'zustand';
import type { ResonanceMatrix, CoherenceMetrics, FieldState } from '../rbi/kernel';

export interface Orb {
  id: number;
  name: string;
  position: [number, number, number]; // 3D position
  coherence: number;
  glow: number; // 0-1 glow intensity
}

export interface FieldConsoleState {
  // Field State
  fieldState: FieldState | null;
  coherenceMetrics: CoherenceMetrics | null;
  resonanceMatrix: ResonanceMatrix | null;
  
  // Orbs
  orbs: Orb[];
  
  // UI State
  selectedOrbId: number | null;
  currentPhase: 'constellation' | 'chamber' | 'mirror' | 'stream';
  isPortalOpen: boolean;
  
  // Actions
  setFieldState: (state: FieldState) => void;
  setCoherenceMetrics: (metrics: CoherenceMetrics) => void;
  setResonanceMatrix: (matrix: ResonanceMatrix) => void;
  setOrbs: (orbs: Orb[]) => void;
  selectOrb: (orbId: number) => void;
  setCurrentPhase: (phase: 'constellation' | 'chamber' | 'mirror' | 'stream') => void;
  openPortal: () => void;
  closePortal: () => void;
  reset: () => void;
}

const initialState = {
  fieldState: null,
  coherenceMetrics: null,
  resonanceMatrix: null,
  orbs: [],
  selectedOrbId: null,
  currentPhase: 'constellation' as const,
  isPortalOpen: false,
};

export const useFieldStore = create<FieldConsoleState>((set) => ({
  ...initialState,
  
  setFieldState: (state) => set({ fieldState: state }),
  setCoherenceMetrics: (metrics) => set({ coherenceMetrics: metrics }),
  setResonanceMatrix: (matrix) => set({ resonanceMatrix: matrix }),
  setOrbs: (orbs) => set({ orbs }),
  
  selectOrb: (orbId) => {
    set({ selectedOrbId: orbId, currentPhase: 'chamber', isPortalOpen: true });
  },
  
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  
  openPortal: () => set({ isPortalOpen: true, currentPhase: 'chamber' }),
  closePortal: () => set({ isPortalOpen: false, currentPhase: 'constellation', selectedOrbId: null }),
  
  reset: () => set(initialState),
}));

