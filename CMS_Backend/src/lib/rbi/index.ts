/**
 * RBI Kernel - Central Intelligence
 * 
 * Thin wrappers for readability and React integration.
 * Keeps field logic centralized and easy for Cursor to reference.
 */

import { computeResonance as computeResonanceCore, type ResonanceParams } from '@/lib/rbi/core';
import { useMemo } from 'react';

/**
 * React hook for computing resonance between participant input and content
 * 
 * @param participant - Participant input vector or text
 * @param content - Content vector or text to compare against
 * @returns Resonance score (0-1 range)
 */
export function useResonance(
  participant: ResonanceParams | string,
  content?: ResonanceParams | string
): number {
  return useMemo(() => {
    // If both are strings, compute text similarity
    if (typeof participant === 'string' && typeof content === 'string') {
      // TODO: Integrate calculateTextSimilarity for string inputs
      // For now, return mock value
      return 0.5;
    }
    
    // If participant is ResonanceParams, use directly
    if (typeof participant === 'object') {
      return computeResonanceCore(participant);
    }
    
    // Default fallback
    return 0;
  }, [participant, content]);
}

// Re-export core RBI functions for direct use
export {
  computeResonance as computeResonanceCore,
  scoreVectors,
  calculateJaccardSimilarity,
  calculateTextSimilarity,
  normalizeVector,
  findNeighbors,
  type ResonanceParams,
  type VectorPair,
  type NeighborItem,
  type NeighborSearchParams,
} from '@/lib/rbi/core';

// Export kernel functions (mock for MVP)
export {
  computeResonance,
  calculateCoherence,
  verifyProofOfMeaning,
  updateCoherenceField,
  propagateResonance,
  type ResonanceMatrix,
  type CoherenceMetrics,
  type ProofState,
  type FieldState,
} from './kernel';

