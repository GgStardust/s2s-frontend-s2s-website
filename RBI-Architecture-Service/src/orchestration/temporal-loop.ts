/**
 * Temporal Continuity Loop
 * 
 * Maintains field coherence cache and monitors resonance drifts
 * Runs continuously to ensure field stability over time
 */

import { FieldComputation, Mathematics } from 'rbi-kernel';
import type { ResonanceVector } from 'rbi-kernel';

interface FieldCache {
  [key: string]: {
    vector: ResonanceVector;
    timestamp: number;
    coherence: number;
  };
}

interface ResonanceDrift {
  key: string;
  previousCoherence: number;
  currentCoherence: number;
  drift: number;
  timestamp: number;
}

const TEMPORAL_LOOP_INTERVAL = 30000; // 30 seconds
const DRIFT_THRESHOLD = 0.1; // 10% change threshold
const resonanceDrifts: ResonanceDrift[] = [];

/**
 * Start temporal continuity loop
 */
export function startTemporalLoop(fieldCache: FieldCache): void {
  console.log('🔄 Starting temporal continuity loop...');
  console.log(`   Interval: ${TEMPORAL_LOOP_INTERVAL / 1000}s`);

  setInterval(() => {
    maintainFieldCoherence(fieldCache);
  }, TEMPORAL_LOOP_INTERVAL);

  // Initial run
  maintainFieldCoherence(fieldCache);
}

/**
 * Maintain field coherence cache
 */
async function maintainFieldCoherence(cache: FieldCache): Promise<void> {
  const now = Date.now();
  const cacheKeys = Object.keys(cache);
  
  if (cacheKeys.length === 0) {
    return; // No fields to maintain
  }

  console.log(`🔄 Maintaining ${cacheKeys.length} field(s)...`);

  for (const key of cacheKeys) {
    const field = cache[key];
    const age = now - field.timestamp;

    // If field is older than 5 minutes, refresh it
    if (age > 300000) {
      try {
        // Re-analyze to check for drift
        const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
        const analysis = await engine.analyzeContentWithMathematics(key);
        const newVector = analysis.mathematical.resonanceVector;
        const newFieldDynamics = Mathematics.ResonanceVectorMath.calculateFieldDynamics(
          newVector,
          []
        );

        const previousCoherence = field.coherence;
        const currentCoherence = newFieldDynamics.coherence;
        const drift = Math.abs(currentCoherence - previousCoherence);

        // Update cache
        cache[key] = {
          vector: newVector,
          timestamp: now,
          coherence: currentCoherence
        };

        // Log significant drifts
        if (drift > DRIFT_THRESHOLD) {
          const driftRecord: ResonanceDrift = {
            key,
            previousCoherence,
            currentCoherence,
            drift,
            timestamp: now
          };
          resonanceDrifts.push(driftRecord);

          // Keep only last 100 drifts
          if (resonanceDrifts.length > 100) {
            resonanceDrifts.shift();
          }

          console.log(`⚠️  Resonance drift detected: ${(drift * 100).toFixed(2)}%`);
          console.log(`   Key: ${key.substring(0, 50)}...`);
          console.log(`   Previous: ${previousCoherence.toFixed(3)}, Current: ${currentCoherence.toFixed(3)}`);
        } else {
          console.log(`✅ Field stable: ${key.substring(0, 50)}... (drift: ${(drift * 100).toFixed(2)}%)`);
        }
      } catch (error) {
        console.error(`❌ Error maintaining field ${key}:`, error);
      }
    }
  }

  // Log field stabilization metrics
  logFieldStabilizationMetrics(cache);
}

/**
 * Log field stabilization metrics
 */
function logFieldStabilizationMetrics(cache: FieldCache): void {
  const fields = Object.values(cache);
  if (fields.length === 0) return;

  const averageCoherence = fields.reduce((sum, f) => sum + f.coherence, 0) / fields.length;
  const minCoherence = Math.min(...fields.map(f => f.coherence));
  const maxCoherence = Math.max(...fields.map(f => f.coherence));
  const variance = fields.reduce((sum, f) => sum + Math.pow(f.coherence - averageCoherence, 2), 0) / fields.length;
  const stability = 1 / (1 + variance); // Inverse of variance

  console.log(`📊 Field Stabilization Metrics:`);
  console.log(`   Fields: ${fields.length}`);
  console.log(`   Avg Coherence: ${averageCoherence.toFixed(3)}`);
  console.log(`   Coherence Range: [${minCoherence.toFixed(3)}, ${maxCoherence.toFixed(3)}]`);
  console.log(`   Stability: ${stability.toFixed(3)}`);
  console.log(`   Recent Drifts: ${resonanceDrifts.length}`);
}

/**
 * Get resonance drift history
 */
export function getResonanceDrifts(): ResonanceDrift[] {
  return [...resonanceDrifts];
}

/**
 * Get field stabilization metrics
 */
export function getFieldStabilizationMetrics(cache: FieldCache): {
  fieldCount: number;
  averageCoherence: number;
  minCoherence: number;
  maxCoherence: number;
  stability: number;
  driftCount: number;
} {
  const fields = Object.values(cache);
  if (fields.length === 0) {
    return {
      fieldCount: 0,
      averageCoherence: 0,
      minCoherence: 0,
      maxCoherence: 0,
      stability: 0,
      driftCount: resonanceDrifts.length
    };
  }

  const averageCoherence = fields.reduce((sum, f) => sum + f.coherence, 0) / fields.length;
  const minCoherence = Math.min(...fields.map(f => f.coherence));
  const maxCoherence = Math.max(...fields.map(f => f.coherence));
  const variance = fields.reduce((sum, f) => sum + Math.pow(f.coherence - averageCoherence, 2), 0) / fields.length;
  const stability = 1 / (1 + variance);

  return {
    fieldCount: fields.length,
    averageCoherence,
    minCoherence,
    maxCoherence,
    stability,
    driftCount: resonanceDrifts.length
  };
}

