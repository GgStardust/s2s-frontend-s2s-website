/**
 * Sovereign Logic - Wrapper for RBI-Kernel
 * 
 * This file is a wrapper that delegates to the consolidated RBI-Kernel.
 * It preserves the existing interface while using RBI-Kernel as the implementation.
 * 
 * MIGRATION NOTE: This wrapper maintains backward compatibility.
 * Future code should import directly from 'rbi-kernel'.
 */

// Re-export everything from RBI-Kernel
// Using the mathematics export path
export {
  SovereignLogic,
  type ConsciousnessType,
  type ProofTerm,
  type CoherenceProof,
  type ConsciousnessContext
} from 'rbi-kernel/dist/mathematics/index.js';
