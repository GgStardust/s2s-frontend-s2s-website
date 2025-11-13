/**
 * Computation Layer - Field Operators
 * 
 * Field-level operations for finding coherent neighbors and similar field elements.
 * Implements top-N similarity search across multiple vector types.
 * 
 * Architecture Layer: 2 (Computation)
 */

import { 
  computeResonance, 
  scoreVectors, 
  calculateTextSimilarity, 
  ResonanceParams,
  scoreResonanceVectors,
  computeResonanceWithOrbs
} from './coherence-calculator.js';
import { ResonanceVector } from '../../mathematics/resonance-vectors.js';
import { ResonanceVectorMath } from '../../mathematics/resonance-vectors.js';

export interface NeighborItem {
  id: string;
  score: number;
  metadata?: Record<string, any>;
  coherence?: number;
  fieldDynamics?: {
    fieldStrength: number;
    stability: number;
    coherence: number;
  };
}

export interface NeighborSearchParams {
  query: {
    vector?: number[];
    resonanceVector?: ResonanceVector;
    text?: string;
    resonanceParams?: ResonanceParams;
    orbAssociations?: number[];
  };
  candidates: Array<{
    id: string;
    vector?: number[];
    resonanceVector?: ResonanceVector;
    text?: string;
    resonanceParams?: ResonanceParams;
    orbAssociations?: number[];
    metadata?: Record<string, any>;
  }>;
  topN: number;
  useResonance?: boolean;
  useOrbSystem?: boolean;
}

/**
 * Find top-N neighbors based on vector similarity or resonance scores
 * 
 * @param params - Search parameters
 * @returns Array of neighbor items sorted by score (descending)
 */
export function findNeighbors(params: NeighborSearchParams): NeighborItem[] {
  const { query, candidates, topN, useResonance = false, useOrbSystem = false } = params;

  const results: NeighborItem[] = [];

  for (const candidate of candidates) {
    let score = 0;
    let coherence: number | undefined;
    let fieldDynamics: NeighborItem['fieldDynamics'] | undefined;

    if (useOrbSystem && query.resonanceVector && candidate.resonanceVector) {
      const orbAssociations = query.orbAssociations || candidate.orbAssociations || [];
      if (orbAssociations.length > 0) {
        score = computeResonanceWithOrbs(
          query.resonanceVector,
          candidate.resonanceVector,
          orbAssociations
        );
        
        const field = ResonanceVectorMath.calculateFieldDynamics(
          candidate.resonanceVector,
          orbAssociations
        );
        fieldDynamics = {
          fieldStrength: field.fieldStrength,
          stability: field.stability,
          coherence: field.coherence
        };
        coherence = field.coherence;
      } else {
        score = scoreResonanceVectors(query.resonanceVector, candidate.resonanceVector);
      }
    }
    else if (query.resonanceVector && candidate.resonanceVector) {
      score = scoreResonanceVectors(query.resonanceVector, candidate.resonanceVector);
    }
    else if (useResonance && query.resonanceParams && candidate.resonanceParams) {
      score = computeResonance(candidate.resonanceParams);
    }
    else if (query.vector && candidate.vector) {
      score = scoreVectors(query.vector, candidate.vector);
      score = (score + 1) / 2;
    }
    else if (query.text && candidate.text) {
      score = calculateTextSimilarity(query.text, candidate.text);
    }

    score = Math.max(0, Math.min(1, score));
    
    results.push({
      id: candidate.id,
      score,
      metadata: candidate.metadata,
      coherence,
      fieldDynamics
    });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

