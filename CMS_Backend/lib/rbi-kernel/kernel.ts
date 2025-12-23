/**
 * RBI Kernel - Field-Level Coherence Architecture
 * 
 * Main entry point for the RBI field-level coherence architecture.
 * Exports the complete 5-layer architecture as a unified system.
 * 
 * This is not a service plugin, but a complete architectural framework
 * for field-level coherence verification.
 */

// Field Architecture Layers
export * as FieldComputation from './field/computation/index.js';
export * as FieldValidation from './field/validation/index.js';
export * as FieldRepresentation from './field/representation/index.js';
export * as TemporalContinuity from './field/temporal/index.js';
export * as FieldPropagation from './field/propagation/index.js';

// Mathematical Foundations
export * as Mathematics from './mathematics/index.js';

// Type Exports
export * from './types.js';

// Temporal Continuity Types
export type { TimePoint, TimeSeriesAnalysis } from './field/temporal/timeseries-analyzer.js';

// Stabilization Types
export type {
  StabilizationRequest,
  StabilizationResponse
} from './field/temporal/stabilization-engine.js';

export type {
  DriftWindow,
  DriftDetectionConfig,
  DriftDetectionResult
} from './field/temporal/drift-detector.js';

export type {
  ThresholdState,
  ThresholdAdjustment,
  ThresholdStrategyConfig
} from './field/temporal/threshold-strategy.js';

// Field Propagation Types
export type {
  PropagationStrategy,
  PropagationRequest,
  PropagationResponse
} from './field/propagation/propagation-engine.js';

export type {
  GraphNode,
  GraphEdge,
  GraphSnapshot
} from './field/propagation/relationship-graph.js';

export type {
  DiffusionConfig,
  DiffusionStep,
  DiffusionResult
} from './field/propagation/diffusion-algorithm.js';

export type {
  WaveConfig,
  WaveStep,
  WaveResult
} from './field/propagation/wave-algorithm.js';

// Global Field Computation Types
export type { MultiInputItem, GlobalFieldAnalysis } from './field/computation/global-field.js';

// Boundary Validation Types
export type {
  ComparisonOperator,
  BoundaryViolation,
  BoundaryValidationResult,
  BoundaryRule,
  BoundaryValidator
} from './field/validation/boundary-validator.js';

// Metadata Parsers (for Sandbox and other data formats)
export * from './metadata/index.js';

/**
 * RBI Kernel Architecture Manifest
 * 
 * Defines the complete architecture structure and layer relationships.
 */
export const KernelManifest = {
  architecture: {
    name: 'RBI Kernel - Field-Level Coherence Architecture',
    version: '1.0.0',
    layers: {
      representation: {
        layer: 1,
        purpose: 'Transforms inputs into multidimensional resonance fields',
        path: './field/representation',
        status: 'placeholder',
        note: 'Currently integrated into computation layer via content detection'
      },
      computation: {
        layer: 2,
        purpose: 'Calculates spatial, temporal, and contextual coherence',
        path: './field/computation',
        status: 'complete',
        components: [
          'resonance-engine',
          'enhanced-engine',
          'coherence-calculator',
          'field-operators',
          'global-field'
        ]
      },
      temporal: {
        layer: 3,
        purpose: 'Maintains adaptive stability over time',
        path: './field/temporal',
        status: 'complete',
        components: [
          'timeseries-analyzer',
          'stabilization-engine',
          'drift-detector',
          'threshold-strategy'
        ]
      },
      validation: {
        layer: 4,
        purpose: 'Performs Proof-of-Meaning operations',
        path: './field/validation',
        status: 'complete',
        components: [
          'proof-of-meaning',
          'boundary-validator'
        ]
      },
      propagation: {
        layer: 5,
        purpose: 'Links verified coherence data to external systems',
        path: './field/propagation',
        status: 'complete',
        components: [
          'propagation-engine',
          'relationship-graph',
          'diffusion-algorithm',
          'wave-algorithm'
        ]
      }
    },
    mathematics: {
      purpose: 'Mathematical foundations for field-level coherence',
      path: './mathematics',
      status: 'complete',
      components: [
        'resonance-vectors',
        'sovereign-logic'
      ]
    },
    metadata: {
      purpose: 'Content detection and parsing utilities',
      path: './metadata',
      status: 'complete',
      components: [
        'content-detector',
        'json-metadata',
        'csv-tsv-parser',
        'xml-parser',
        'codebase-metadata'
      ]
    }
  }
} as const;

