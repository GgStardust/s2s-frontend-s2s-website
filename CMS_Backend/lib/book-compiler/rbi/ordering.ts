/**
 * RBI Ordering Module
 * 
 * Finds optimal content ordering based on resonance flow.
 * Builds a resonance chain for smooth narrative flow.
 * 
 * Part of Layer 2 (Computation) of the compiler architecture.
 */

import { EnhancedResonanceEngine } from '../../mathematics/enhanced-resonance-engine.js';
import { ResonanceVectorMath, type ResonanceVector } from '@/lib/mathematics/resonance-vectors.js';
import type { ContentFile } from '../types.js';

// Fallback for computeResonanceWithOrbs - uses ResonanceVectorMath
function computeResonanceWithOrbs(
  vector1: ResonanceVector,
  vector2: ResonanceVector,
  orbs: number[]
): number {
  return ResonanceVectorMath.calculateResonanceSimilarity(vector1, vector2);
}

export interface ResonanceMatrix {
  source1: ContentFile;
  source2: ContentFile;
  resonance: number;
}

export interface OrderingResult {
  ordered: ContentFile[];
  totalResonance: number;
  averageResonance: number;
  chain: Array<{ from: ContentFile; to: ContentFile; resonance: number }>;
}

/**
 * Build resonance matrix between all sources
 */
async function buildResonanceMatrix(
  sources: ContentFile[]
): Promise<ResonanceMatrix[]> {
  if (sources.length < 2) {
    return [];
  }

  const resonanceEngine = EnhancedResonanceEngine.getInstance();
  const matrix: ResonanceMatrix[] = [];

  // Analyze all sources to get resonance vectors
  const sourceAnalyses = await Promise.all(
    sources.map(async (source) => {
      try {
        const analysis = await resonanceEngine.analyzeContentWithMathematics(
          source.content,
          source.title,
          {
            orb_associations: source.orb_tags.length > 0 ? source.orb_tags : undefined
          }
        );
        return {
          source,
          resonanceVector: analysis.mathematical.resonanceVector
        };
      } catch (error) {
        console.warn(`Warning: Failed to analyze ${source.title} for ordering:`, error);
        return null;
      }
    })
  );

  const validAnalyses = sourceAnalyses.filter((a): a is NonNullable<typeof a> => a !== null);

  // Calculate resonance between all pairs
  for (let i = 0; i < validAnalyses.length; i++) {
    for (let j = i + 1; j < validAnalyses.length; j++) {
      const analysis1 = validAnalyses[i];
      const analysis2 = validAnalyses[j];

      // Get combined orb associations
      const allOrbs = [...new Set([...analysis1.source.orb_tags, ...analysis2.source.orb_tags])];

      // Calculate resonance with Orb system
      const resonance = allOrbs.length > 0
        ? computeResonanceWithOrbs(
            analysis1.resonanceVector,
            analysis2.resonanceVector,
            allOrbs
          )
        : ResonanceVectorMath.calculateResonanceSimilarity(
            analysis1.resonanceVector,
            analysis2.resonanceVector
          );

      // Add both directions (for graph traversal)
      matrix.push({
        source1: analysis1.source,
        source2: analysis2.source,
        resonance
      });
      matrix.push({
        source1: analysis2.source,
        source2: analysis1.source,
        resonance
      });
    }
  }

  return matrix;
}

/**
 * Find optimal ordering using greedy algorithm
 * Starts with highest resonance source, then follows highest resonance chain
 */
export async function findOptimalOrdering(
  sources: ContentFile[]
): Promise<OrderingResult> {
  if (sources.length === 0) {
    return {
      ordered: [],
      totalResonance: 0,
      averageResonance: 0,
      chain: []
    };
  }

  if (sources.length === 1) {
    return {
      ordered: sources,
      totalResonance: 1.0,
      averageResonance: 1.0,
      chain: []
    };
  }

  // Build resonance matrix
  const matrix = await buildResonanceMatrix(sources);

  if (matrix.length === 0) {
    // Fallback: return sources in original order
    return {
      ordered: sources,
      totalResonance: 0,
      averageResonance: 0,
      chain: []
    };
  }

  // Find starting point (source with highest average resonance to others)
  const sourceScores = new Map<string, { total: number; count: number }>();

  for (const entry of matrix) {
    const key = entry.source1.file_path;
    const current = sourceScores.get(key) || { total: 0, count: 0 };
    sourceScores.set(key, {
      total: current.total + entry.resonance,
      count: current.count + 1
    });
  }

  const sourceAverages = Array.from(sourceScores.entries()).map(([path, data]) => ({
    path,
    average: data.count > 0 ? data.total / data.count : 0
  }));

  const startSource = sourceAverages.reduce((a, b) => 
    a.average > b.average ? a : b
  );

  const start = sources.find(s => s.file_path === startSource.path) || sources[0];

  // Build chain using greedy algorithm
  const ordered: ContentFile[] = [start];
  const used = new Set([start.file_path]);
  const chain: Array<{ from: ContentFile; to: ContentFile; resonance: number }> = [];

  let current = start;
  let totalResonance = 0;

  while (ordered.length < sources.length) {
    // Find best next source (highest resonance from current)
    let bestNext: ContentFile | null = null;
    let bestResonance = -1;

    for (const entry of matrix) {
      if (entry.source1.file_path === current.file_path && 
          !used.has(entry.source2.file_path)) {
        if (entry.resonance > bestResonance) {
          bestResonance = entry.resonance;
          bestNext = entry.source2;
        }
      }
    }

    if (bestNext) {
      ordered.push(bestNext);
      used.add(bestNext.file_path);
      chain.push({
        from: current,
        to: bestNext,
        resonance: bestResonance
      });
      totalResonance += bestResonance;
      current = bestNext;
    } else {
      // No more connections, add remaining sources in order
      const remaining = sources.filter(s => !used.has(s.file_path));
      ordered.push(...remaining);
      break;
    }
  }

  const averageResonance = chain.length > 0 ? totalResonance / chain.length : 0;

  return {
    ordered,
    totalResonance,
    averageResonance,
    chain
  };
}

/**
 * Validate ordering quality
 */
export function validateOrdering(
  result: OrderingResult,
  minAverageResonance: number = 0.5
): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (result.averageResonance < minAverageResonance) {
    issues.push(
      `Average resonance (${result.averageResonance.toFixed(2)}) below threshold (${minAverageResonance})`
    );
  }

  // Check for gaps in chain
  const lowResonanceLinks = result.chain.filter(link => link.resonance < 0.4);
  if (lowResonanceLinks.length > 0) {
    issues.push(
      `Found ${lowResonanceLinks.length} low-resonance links (< 0.4) in chain`
    );
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

