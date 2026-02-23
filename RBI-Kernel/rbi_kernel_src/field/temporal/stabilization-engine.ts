/**
 * Stabilization Engine
 */

import { detectDrift, type DriftWindow, type DriftDetectionResult } from './drift-detector.js';
import {
  adjustThresholds,
  type ThresholdState,
  type ThresholdAdjustment
} from './threshold-strategy.js';

export interface StabilizationRequest {
  history: DriftWindow[];
  thresholds: ThresholdState[];
  sensitivity?: number;
}

export interface StabilizationResponse {
  drift: DriftDetectionResult;
  thresholds: ThresholdState[];
  adjustments: ThresholdAdjustment[];
  recommendations: {
    message: string;
    severity: 'info' | 'warning' | 'critical';
  }[];
}

export class StabilizationEngine {
  stabilize(request: StabilizationRequest): StabilizationResponse {
    const drift = detectDrift(request.history, {
      sensitivity: request.sensitivity,
      windowSize: Math.max(6, Math.min(60, request.history.length))
    });

    const adjustments: ThresholdAdjustment[] = [];

    if (drift.driftDetected) {
      const driftDirection = Math.sign(drift.slope);
      if (driftDirection !== 0) {
        adjustments.push({
          metric: 'coherence',
          delta: driftDirection * 0.05,
          basis: 'drift',
          recommendation: 0
        });
      }
    }

    if (drift.volatility > 0.05) {
      adjustments.push({
        metric: 'stability',
        delta: -0.03,
        basis: 'volatility',
        recommendation: 0
      });
    }

    const adjustedThresholds = adjustThresholds(request.thresholds, adjustments);

    const recommendations = this.buildRecommendations(drift, adjustments);

    return {
      drift,
      thresholds: adjustedThresholds,
      adjustments,
      recommendations
    };
  }

  private buildRecommendations(
    drift: DriftDetectionResult,
    adjustments: ThresholdAdjustment[]
  ): StabilizationResponse['recommendations'] {
    const messages: StabilizationResponse['recommendations'] = [];

    if (!drift.driftDetected) {
      messages.push({
        message: 'No significant drift detected. Continue monitoring.',
        severity: 'info'
      });
      return messages;
    }

    if (Math.abs(drift.slope) > 0.02) {
      messages.push({
        message: `Detected ${drift.slope > 0 ? 'positive' : 'negative'} drift; applying corrective adjustment.`,
        severity: 'warning'
      });
    }

    if (drift.volatility > 0.08) {
      messages.push({
        message: 'High volatility detected; consider tightening baselines or increasing sampling frequency.',
        severity: 'critical'
      });
    }

    if (adjustments.length === 0) {
      messages.push({
        message: 'Drift detected but no automatic adjustments applied (manual review recommended).',
        severity: 'warning'
      });
    }

    return messages;
  }
}

