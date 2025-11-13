/**
 * Neighbor Finding Functions
 * 
 * Functions for finding top-N most similar items based on resonance scores
 * 
 * Integrated from RBI Kernel Service (Nov 4, 2025)
 */

import { computeResonance, scoreVectors, calculateTextSimilarity, ResonanceParams } from './compute';

export interface NeighborItem {
  id: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface NeighborSearchParams {
  query: {
    vector?: number[];
    text?: string;
    resonanceParams?: ResonanceParams;
  };
  candidates: Array<{
    id: string;
    vector?: number[];
    text?: string;
    resonanceParams?: ResonanceParams;
    metadata?: Record<string, any>;
  }>;
  topN: number;
  useResonance?: boolean;
}

/**
 * Find top-N neighbors based on vector similarity or resonance scores
 * 
 * @param params - Search parameters
 * @returns Array of neighbor items sorted by score (descending)
 */
export function findNeighbors(params: NeighborSearchParams): NeighborItem[] {
  const { query, candidates, topN, useResonance = false } = params;

  const results: NeighborItem[] = [];

  for (const candidate of candidates) {
    let score = 0;

    if (useResonance && query.resonanceParams && candidate.resonanceParams) {
      // Use full resonance computation
      score = computeResonance(candidate.resonanceParams);
    } else if (query.vector && candidate.vector) {
      // Use vector similarity
      score = scoreVectors(query.vector, candidate.vector);
    } else if (query.text && candidate.text) {
      // Use text similarity
      score = calculateTextSimilarity(query.text, candidate.text);
    }

    // Normalize cosine similarity (-1 to 1) to 0-1 range, or keep text similarity as-is (already 0-1)
    let normalizedScore = score;
    if (query.vector && candidate.vector) {
      // Cosine similarity is -1 to 1, normalize to 0-1
      normalizedScore = (score + 1) / 2;
    }
    
    results.push({
      id: candidate.id,
      score: Math.max(0, Math.min(1, normalizedScore)), // Clamp to 0-1
      metadata: candidate.metadata,
    });
  }

  // Sort by score descending and return top N
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

