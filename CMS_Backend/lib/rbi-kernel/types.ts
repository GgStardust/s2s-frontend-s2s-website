/**
 * RBI Core Types
 * 
 * Central export point for all RBI types and interfaces
 */

// Resonance Vector Mathematics Types
export type {
  ResonanceVector,
  HarmonicFrequency,
  CoherenceMatrix,
  FieldDynamics
} from './mathematics/resonance-vectors.js';

export { ResonanceVectorMath } from './mathematics/resonance-vectors.js';

// Sovereign Logic Types
export type {
  ConsciousnessType,
  ProofTerm,
  CoherenceProof,
  ConsciousnessContext
} from './mathematics/sovereign-logic.js';

export { SovereignLogic } from './mathematics/sovereign-logic.js';

// Enhanced Resonance Engine Types
export type { EnhancedResonanceAnalysis } from './field/computation/enhanced-engine.js';

export { EnhancedResonanceEngine } from './field/computation/enhanced-engine.js';

// Base Resonance Engine Types
export type {
  EnergeticSignature,
  ResonanceAnalysis
} from './field/computation/resonance-engine.js';

export { ResonanceEngine } from './field/computation/resonance-engine.js';

// Core Computation Types
export type {
  ResonanceParams,
  VectorPair,
  ResonanceVectorPair
} from './field/computation/coherence-calculator.js';

// Neighbor Finding Types
export type {
  NeighborItem,
  NeighborSearchParams
} from './field/computation/field-operators.js';

// Validation Types
export type {
  ConsciousnessContext as ConsciousnessContextType,
  CoherenceProof as CoherenceProofType
} from './field/validation/proof-of-meaning.js';

