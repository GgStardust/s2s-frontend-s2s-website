/**
 * Core RBI Computation Functions
 * 
 * This module contains the core resonance scoring and vector similarity
 * computation functions. These can be swapped out for proprietary equations
 * while maintaining the same interface.
 * 
 * Integrated from RBI Kernel Service (Nov 4, 2025)
 */

export interface ResonanceParams {
  vectorSimilarity: number;
  orbOverlap: number;
  temporalDecay: number;
}

export interface VectorPair {
  vector1: number[];
  vector2: number[];
}

/**
 * Calculate resonance score R_ij using the core RBI equation
 * 
 * Formula: R_ij = (vectorSimilarity × 0.4) + (orbOverlap × 0.4) + (temporalDecay × 0.2)
 * 
 * @param params - Resonance parameters
 * @returns Resonance score (0-1 range, typically)
 */
export function computeResonance(params: ResonanceParams): number {
  return params.vectorSimilarity * 0.4 + 
         params.orbOverlap * 0.4 + 
         params.temporalDecay * 0.2;
}

/**
 * Calculate cosine similarity between two vectors
 * 
 * @param vector1 - First vector
 * @param vector2 - Second vector
 * @returns Cosine similarity score (-1 to 1)
 */
export function scoreVectors(vector1: number[], vector2: number[]): number {
  if (vector1.length !== vector2.length) {
    throw new Error('Vectors must have the same dimension');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    norm1 += vector1[i] * vector1[i];
    norm2 += vector2[i] * vector2[i];
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}

/**
 * Calculate Jaccard similarity between two arrays (for Orb overlap)
 * 
 * TEMPORARY ADAPTER: This function is a temporary adapter for calculateJaccardSimilarity.
 * TODO: Evaluate adding this to RBI-Kernel or keeping as CMS_Backend-specific utility.
 * 
 * Used by:
 * - Book compiler (resonance-source-selection, merge-chapter)
 * - API routes (resonance/discover)
 * - Core compute tests
 * 
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Jaccard similarity score (0-1)
 */
export function calculateJaccardSimilarity<T>(arr1: T[], arr2: T[]): number {
  if (arr1.length === 0 && arr2.length === 0) return 1;
  if (arr1.length === 0 || arr2.length === 0) return 0;
  
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Calculate Jaccard similarity between two text strings
 * (word-based similarity)
 * 
 * @param text1 - First text string
 * @param text2 - Second text string
 * @returns Jaccard similarity score (0-1)
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(
    text1.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2)
  );
  const words2 = new Set(
    text2.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2)
  );

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Normalize a vector to unit length
 * 
 * @param vector - Input vector
 * @returns Normalized vector
 */
export function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return vector;
  return vector.map(val => val / magnitude);
}

