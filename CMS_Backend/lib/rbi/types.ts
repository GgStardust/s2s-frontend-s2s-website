/**
 * RBI Types - Shared type definitions
 * 
 * Centralized type definitions for RBI-related functionality.
 * These types are used across the CMS_Backend for RBI integration.
 */

/**
 * Resonance validation result
 * Compatible with RBI-Kernel analysis output
 */
export interface ResonanceResult {
  proofStatus: 'proven' | 'partial' | 'unproven' | 'error';
  coherenceScore: number; // 0-1 scale
  validatedOrbs: number[]; // Array of orb numbers (1-13)
  metrics: {
    strength: number; // 1-10 scale
    clarity: number; // 1-10 scale
    coherence: number; // 1-10 scale
    pattern: number; // 1-10 scale
  };
  explanation: string;
}

/**
 * Resonance context for validation
 */
export interface ResonanceContext {
  content: string;
  title?: string;
  existingOrbs?: number[];
  existingTags?: string[];
}

