/**
 * Computation Layer - Coherence Calculator
 * 
 * Calculates spatial, temporal, and contextual coherence between field elements.
 * Implements resonance scoring and vector similarity computation.
 * 
 * Architecture Layer: 2 (Computation)
 */

import { ResonanceVectorMath, ResonanceVector } from '../../mathematics/resonance-vectors.js';

export interface ResonanceParams {
  vectorSimilarity: number;
  orbOverlap: number;
  temporalDecay: number;
}

export interface VectorPair {
  vector1: number[];
  vector2: number[];
}

export interface ResonanceVectorPair {
  vector1: ResonanceVector;
  vector2: ResonanceVector;
  orbAssociations?: number[];
}

/**
 * Calculate resonance score R_ij using the core RBI equation
 * 
 * @param params - Resonance parameters
 * @returns Resonance score (0-1 range)
 */
export function computeResonance(params: ResonanceParams): number {
  return params.vectorSimilarity * 0.4 + 
         params.orbOverlap * 0.4 + 
         params.temporalDecay * 0.2;
}

/**
 * Calculate resonance score using 4D resonance vectors
 * 
 * @param vectorPair - Pair of 4D resonance vectors
 * @returns Resonance similarity score (0-1)
 */
export function computeResonanceWithVectors(vectorPair: ResonanceVectorPair): number {
  const similarity = ResonanceVectorMath.calculateResonanceSimilarity(
    vectorPair.vector1,
    vectorPair.vector2
  );
  
  if (vectorPair.orbAssociations && vectorPair.orbAssociations.length > 0) {
    const coherenceMatrix = ResonanceVectorMath.buildCoherenceMatrix(vectorPair.orbAssociations);
    const orbEnhancement = coherenceMatrix.coherenceRank / coherenceMatrix.nxn.length;
    return (similarity * 0.7 + orbEnhancement * 0.3);
  }
  
  return similarity;
}

/**
 * Calculate resonance with category system integration
 * 
 * @param vector1 - First 4D resonance vector
 * @param vector2 - Second 4D resonance vector
 * @param orbAssociations - Category associations for both vectors
 * @returns Enhanced resonance score (0-1)
 */
export function computeResonanceWithOrbs(
  vector1: ResonanceVector,
  vector2: ResonanceVector,
  orbAssociations: number[]
): number {
  const similarity = ResonanceVectorMath.calculateResonanceSimilarity(vector1, vector2);
  
  const fieldDynamics1 = ResonanceVectorMath.calculateFieldDynamics(vector1, orbAssociations);
  const fieldDynamics2 = ResonanceVectorMath.calculateFieldDynamics(vector2, orbAssociations);
  
  const coherenceMatrix = ResonanceVectorMath.buildCoherenceMatrix(orbAssociations);
  
  const fieldScore = (fieldDynamics1.coherence + fieldDynamics2.coherence) / 2;
  const coherenceScore = coherenceMatrix.coherenceRank / coherenceMatrix.nxn.length;
  
  return (similarity * 0.5 + fieldScore * 0.3 + coherenceScore * 0.2);
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
 * Calculate similarity between two 4D resonance vectors
 * 
 * @param vector1 - First 4D resonance vector
 * @param vector2 - Second 4D resonance vector
 * @returns Resonance similarity score (0-1)
 */
export function scoreResonanceVectors(vector1: ResonanceVector, vector2: ResonanceVector): number {
  return ResonanceVectorMath.calculateResonanceSimilarity(vector1, vector2);
}

/**
 * Calculate Jaccard similarity between two text strings
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

