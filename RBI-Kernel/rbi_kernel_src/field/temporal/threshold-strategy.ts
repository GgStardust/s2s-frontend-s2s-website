/**
 * Threshold strategy helpers used by the stabilization engine.
 */

export interface ThresholdState {
  metric: string;
  current: number;
  min: number;
  max: number;
  recommended: number;
  confidence: number;
}

export interface ThresholdAdjustment {
  metric: string;
  delta: number;
  basis: 'drift' | 'volatility' | 'manual';
  recommendation: number;
}

export interface ThresholdStrategyConfig {
  minConfidence?: number;
  maxShift?: number;
}

export function adjustThresholds(
  states: ThresholdState[],
  adjustments: ThresholdAdjustment[],
  config: ThresholdStrategyConfig = {}
): ThresholdState[] {
  const minConfidence = config.minConfidence ?? 0.4;
  const maxShift = config.maxShift ?? 0.2;

  const map = new Map(states.map(state => [state.metric, { ...state }]));

  for (const adjustment of adjustments) {
    const state = map.get(adjustment.metric);
    if (!state) continue;

    const normalizedDelta = Math.max(-maxShift, Math.min(maxShift, adjustment.delta));
    state.recommended = Math.max(state.min, Math.min(state.max, state.current + normalizedDelta));
    state.confidence = Math.max(minConfidence, Math.min(1, state.confidence + normalizedDelta / 2));
  }

  return Array.from(map.values());
}

