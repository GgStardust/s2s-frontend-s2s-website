/**
 * Drift detection utilities
 */

export interface DriftWindow {
  timestamp: number;
  coherence: number;
  resonance?: number;
  sovereignty?: number;
}

export interface DriftDetectionConfig {
  windowSize?: number;
  sensitivity?: number;
  slopeThreshold?: number;
}

export interface DriftDetectionResult {
  driftDetected: boolean;
  slope: number;
  volatility: number;
  confidence: number;
  window: DriftWindow[];
}

export function detectDrift(
  data: DriftWindow[],
  config: DriftDetectionConfig = {}
): DriftDetectionResult {
  const windowSize = config.windowSize ?? 12;
  const sensitivity = config.sensitivity ?? 0.5;
  const slopeThreshold = config.slopeThreshold ?? 0.01;

  const window = data.slice(-windowSize);
  if (window.length < 2) {
    return {
      driftDetected: false,
      slope: 0,
      volatility: 0,
      confidence: 0,
      window
    };
  }

  let slope = 0;
  for (let i = 1; i < window.length; i += 1) {
    const prev = window[i - 1];
    const curr = window[i];
    const deltaTime = curr.timestamp - prev.timestamp || 1;
    slope += (curr.coherence - prev.coherence) / deltaTime;
  }
  slope /= window.length - 1;

  const mean = window.reduce((sum, point) => sum + point.coherence, 0) / window.length;
  const volatility = Math.sqrt(
    window.reduce((sum, point) => sum + Math.pow(point.coherence - mean, 2), 0) / window.length
  );

  const driftDetected = Math.abs(slope) > slopeThreshold || volatility > sensitivity * 0.05;
  const confidence = Math.min(
    1,
    (Math.abs(slope) / slopeThreshold + volatility / (sensitivity * 0.05)) / 2
  );

  return {
    driftDetected,
    slope,
    volatility,
    confidence: Number.isFinite(confidence) ? confidence : 0,
    window
  };
}

