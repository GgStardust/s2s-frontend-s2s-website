/**
 * Validation Layer - Proof of Meaning
 * 
 * Performs Proof-of-Meaning operations using type-theoretic validation.
 * Implements coherence verification and structural integrity checks.
 * 
 * Architecture Layer: 4 (Validation)
 */

import { SovereignLogic, ConsciousnessContext, CoherenceProof } from '../../mathematics/sovereign-logic.js';

export { ConsciousnessContext, CoherenceProof } from '../../mathematics/sovereign-logic.js';

/**
 * Verify coherence using Proof-of-Meaning
 */
export function verifyConsciousness(
  content: string,
  orbAssociations: number[]
): {
  verified: boolean;
  confidence: number;
  mathematicalProof: string;
} {
  return SovereignLogic.verifyConsciousness(content, orbAssociations);
}

/**
 * Validate coherence with full context
 */
export function validateCoherence(
  content: string,
  context: ConsciousnessContext
): CoherenceProof {
  return SovereignLogic.validateConsciousnessCoherence(content, context);
}

