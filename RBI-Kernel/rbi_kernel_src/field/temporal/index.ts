/**
 * Temporal Continuity Layer - Exports
 * 
 * Architecture Layer: 3 (Temporal Continuity)
 * 
 * Maintains adaptive stability over time through time-series analysis,
 * drift detection, and baseline management.
 */

export { analyzeTimeSeries } from './timeseries-analyzer.js';
export type { TimePoint, TimeSeriesAnalysis } from './timeseries-analyzer.js';

// Stabilization components
export { StabilizationEngine } from './stabilization-engine.js';
export { detectDrift } from './drift-detector.js';
export { adjustThresholds } from './threshold-strategy.js';

export type {
  StabilizationRequest,
  StabilizationResponse
} from './stabilization-engine.js';

export type {
  DriftWindow,
  DriftDetectionConfig,
  DriftDetectionResult
} from './drift-detector.js';

export type {
  ThresholdState,
  ThresholdAdjustment,
  ThresholdStrategyConfig
} from './threshold-strategy.js';

