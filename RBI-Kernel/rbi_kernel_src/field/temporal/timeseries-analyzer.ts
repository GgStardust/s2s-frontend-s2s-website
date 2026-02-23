/**
 * Temporal Continuity Layer - Time-Series Analyzer
 * 
 * Architecture Layer: 3 (Temporal Continuity)
 * 
 * Analyzes time-series data through RBI's field-based computation.
 * Processes multiple time points globally (non-linear) to detect trends,
 * drift, and stability patterns.
 */

import * as FieldComputation from '../computation/index.js';
import * as Mathematics from '../../mathematics/index.js';
import type { ResonanceVector, FieldDynamics } from '../../mathematics/resonance-vectors.js';
import { detectAndParseJSON } from '../../metadata/content-detector.js';

export interface TimePoint {
  timestamp: string;
  data: any;
  metadata?: Record<string, any>;
}

export interface TimeSeriesAnalysis {
  trend: {
    direction: 'upward' | 'downward' | 'stable' | 'volatile';
    strength: number; // 0-1, how strong the trend is
    clarity: number; // 0-1, how clear the trend is
  };
  drift: {
    detected: boolean;
    magnitude: number; // 0-1, how much drift
    fromBaseline?: number; // If baseline provided
  };
  stability: {
    overall: number; // 0-1, stability over time
    variance: number; // Variance in field dynamics
    consistency: number; // 0-1, how consistent patterns are
  };
  fieldDynamics: {
    average: FieldDynamics;
    range: {
      min: FieldDynamics;
      max: FieldDynamics;
    };
    evolution: FieldDynamics[]; // Field dynamics at each time point
  };
  resonanceVectors: ResonanceVector[];
  coherence: {
    overall: number; // 0-1, coherence across all time points
    temporal: number; // 0-1, coherence over time
  };
}

/**
 * Analyze time-series data through RBI's field computation
 * 
 * Processes all time points globally (non-linear) to detect patterns,
 * trends, and stability over time.
 */
export async function analyzeTimeSeries(
  timePoints: TimePoint[],
  baseline?: ResonanceVector
): Promise<TimeSeriesAnalysis> {
  if (timePoints.length === 0) {
    throw new Error('Time points array cannot be empty');
  }

  const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
  
  // Layer 1 (Representation): Process all time points
  // Process globally (all at once) - non-linear field computation
  const analyses = await Promise.all(
    timePoints.map(async (point) => {
      // Detect and parse JSON if present
      const parsed = detectAndParseJSON(point.data);
      
      // Combine point metadata with parsed metadata
      const combinedMetadata = {
        ...parsed.metadata,
        ...point.metadata
      };
      
      // Analyze each time point
      const analysis = await engine.analyzeContentWithMathematics(
        parsed.contentString,
        undefined,
        combinedMetadata
      );
      
      return {
        timestamp: point.timestamp,
        resonanceVector: analysis.mathematical.resonanceVector,
        fieldDynamics: analysis.mathematical.fieldDynamics,
        signature: analysis.signature
      };
    })
  );

  // Extract resonance vectors and field dynamics
  const resonanceVectors = analyses.map(a => a.resonanceVector);
  const fieldDynamics = analyses.map(a => a.fieldDynamics);

  // Calculate trend (using gradients from field dynamics)
  const trend = calculateTrend(fieldDynamics);

  // Calculate drift (compare to baseline if provided)
  const drift = calculateDrift(resonanceVectors, baseline);

  // Calculate stability (variance and consistency)
  const stability = calculateStability(fieldDynamics);

  // Calculate coherence across time points
  const coherence = calculateTemporalCoherence(resonanceVectors);

  // Calculate field dynamics statistics
  const fieldDynamicsStats = calculateFieldDynamicsStats(fieldDynamics);

  return {
    trend,
    drift,
    stability,
    fieldDynamics: fieldDynamicsStats,
    resonanceVectors,
    coherence
  };
}

/**
 * Calculate trend direction and strength from field dynamics
 */
function calculateTrend(fieldDynamics: FieldDynamics[]): TimeSeriesAnalysis['trend'] {
  if (fieldDynamics.length < 2) {
    return {
      direction: 'stable',
      strength: 0,
      clarity: 0
    };
  }

  // Calculate gradients (rate of change) for each dimension
  const gradients: number[][] = [];
  for (let i = 0; i < fieldDynamics.length - 1; i++) {
    const current = fieldDynamics[i].gradient;
    const next = fieldDynamics[i + 1].gradient;
    const gradient = current.map((val, idx) => next[idx] - val);
    gradients.push(gradient);
  }

  // Calculate average gradient direction
  const avgGradient = gradients.reduce((acc: number[], grad: number[]) => {
    return acc.map((val: number, idx: number) => val + grad[idx]);
  }, [0, 0, 0, 0]).map((val: number) => val / gradients.length);

  // Determine trend direction
  const totalChange = avgGradient.reduce((sum, val) => sum + Math.abs(val), 0);
  const netChange = avgGradient.reduce((sum, val) => sum + val, 0);

  let direction: 'upward' | 'downward' | 'stable' | 'volatile';
  if (Math.abs(netChange) < 0.1) {
    direction = 'stable';
  } else if (totalChange > 0.5) {
    direction = 'volatile';
  } else if (netChange > 0) {
    direction = 'upward';
  } else {
    direction = 'downward';
  }

  // Calculate strength (magnitude of change)
  const strength = Math.min(1, totalChange / 2);

  // Calculate clarity (consistency of direction)
  const gradientVariances = avgGradient.map((avg, idx) => {
    const values = gradients.map(g => g[idx]);
    const variance = calculateVariance(values);
    return variance;
  });
  const avgVariance = gradientVariances.reduce((sum, v) => sum + v, 0) / gradientVariances.length;
  const clarity = 1 / (1 + avgVariance);

  return {
    direction,
    strength,
    clarity
  };
}

/**
 * Calculate drift from baseline
 */
function calculateDrift(
  resonanceVectors: ResonanceVector[],
  baseline?: ResonanceVector
): TimeSeriesAnalysis['drift'] {
  if (!baseline || resonanceVectors.length === 0) {
    return {
      detected: false,
      magnitude: 0
    };
  }

  // Calculate distances from baseline for each vector
  const distances = resonanceVectors.map(vector => 
    Mathematics.ResonanceVectorMath.calculateVectorDistance(vector, baseline)
  );

  // Average distance = drift magnitude
  const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  const maxDistance = Math.sqrt(4); // Maximum distance in 4D unit cube
  const magnitude = Math.min(1, avgDistance / maxDistance);

  // Detect drift if magnitude exceeds threshold
  const detected = magnitude > 0.2;

  return {
    detected,
    magnitude,
    fromBaseline: avgDistance
  };
}

/**
 * Calculate stability over time
 */
function calculateStability(fieldDynamics: FieldDynamics[]): TimeSeriesAnalysis['stability'] {
  if (fieldDynamics.length === 0) {
    return {
      overall: 0,
      variance: 0,
      consistency: 0
    };
  }

  // Calculate variance in stability values
  const stabilityValues = fieldDynamics.map(fd => fd.stability);
  const variance = calculateVariance(stabilityValues);

  // Overall stability = average stability
  const overall = stabilityValues.reduce((sum, s) => sum + s, 0) / stabilityValues.length;

  // Consistency = inverse of variance
  const consistency = 1 / (1 + variance);

  return {
    overall,
    variance,
    consistency
  };
}

/**
 * Calculate temporal coherence (coherence across time points)
 */
function calculateTemporalCoherence(
  resonanceVectors: ResonanceVector[]
): TimeSeriesAnalysis['coherence'] {
  if (resonanceVectors.length < 2) {
    return {
      overall: 1,
      temporal: 1
    };
  }

  // Calculate pairwise similarities
  const similarities: number[] = [];
  for (let i = 0; i < resonanceVectors.length - 1; i++) {
    const similarity = Mathematics.ResonanceVectorMath.calculateResonanceSimilarity(
      resonanceVectors[i],
      resonanceVectors[i + 1]
    );
    similarities.push(similarity);
  }

  // Overall coherence = average similarity
  const overall = similarities.reduce((sum, s) => sum + s, 0) / similarities.length;

  // Temporal coherence = consistency of similarities
  const temporalVariance = calculateVariance(similarities);
  const temporal = 1 / (1 + temporalVariance);

  return {
    overall,
    temporal
  };
}

/**
 * Calculate field dynamics statistics
 */
function calculateFieldDynamicsStats(
  fieldDynamics: FieldDynamics[]
): TimeSeriesAnalysis['fieldDynamics'] {
  if (fieldDynamics.length === 0) {
    throw new Error('Field dynamics array cannot be empty');
  }

  // Calculate averages
  const avgFieldStrength = fieldDynamics.reduce((sum, fd) => sum + fd.fieldStrength, 0) / fieldDynamics.length;
  const avgStability = fieldDynamics.reduce((sum, fd) => sum + fd.stability, 0) / fieldDynamics.length;
  const avgCoherence = fieldDynamics.reduce((sum, fd) => sum + fd.coherence, 0) / fieldDynamics.length;
  const avgGradient = fieldDynamics[0].gradient.map((_, idx) =>
    fieldDynamics.reduce((sum, fd) => sum + fd.gradient[idx], 0) / fieldDynamics.length
  );

  const average: FieldDynamics = {
    fieldStrength: avgFieldStrength,
    gradient: avgGradient,
    stability: avgStability,
    coherence: avgCoherence
  };

  // Calculate min/max
  const fieldStrengths = fieldDynamics.map(fd => fd.fieldStrength);
  const stabilities = fieldDynamics.map(fd => fd.stability);
  const coherences = fieldDynamics.map(fd => fd.coherence);

  const min: FieldDynamics = {
    fieldStrength: Math.min(...fieldStrengths),
    gradient: fieldDynamics[0].gradient.map((_: number, idx: number) =>
      Math.min(...fieldDynamics.map(fd => fd.gradient[idx]))
    ),
    stability: Math.min(...stabilities),
    coherence: Math.min(...coherences)
  };

  const max: FieldDynamics = {
    fieldStrength: Math.max(...fieldStrengths),
    gradient: fieldDynamics[0].gradient.map((_: number, idx: number) =>
      Math.max(...fieldDynamics.map(fd => fd.gradient[idx]))
    ),
    stability: Math.max(...stabilities),
    coherence: Math.max(...coherences)
  };

  return {
    average,
    range: { min, max },
    evolution: fieldDynamics
  };
}

/**
 * Helper: Calculate variance
 */
function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  
  return variance;
}

