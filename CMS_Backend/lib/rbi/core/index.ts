/**
 * RBI Core Library - Main Export
 * 
 * Resonance-Based Intelligence computation functions
 * Integrated from RBI Kernel Service (Nov 4, 2025)
 */

export {
  computeResonance,
  scoreVectors,
  calculateJaccardSimilarity,
  calculateTextSimilarity,
  normalizeVector,
  type ResonanceParams,
  type VectorPair,
} from './compute';

export {
  findNeighbors,
  type NeighborItem,
  type NeighborSearchParams,
} from './neighbors';

