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
        path: './field/representation'
      },
      computation: {
        layer: 2,
        purpose: 'Calculates spatial, temporal, and contextual coherence',
        path: './field/computation'
      },
      temporal: {
        layer: 3,
        purpose: 'Maintains adaptive stability over time',
        path: './field/temporal'
      },
      validation: {
        layer: 4,
        purpose: 'Performs Proof-of-Meaning operations',
        path: './field/validation'
      },
      interfaces: {
        layer: 5,
        purpose: 'Links verified coherence data to external systems',
        path: './interfaces'
      }
    },
    mathematics: {
      purpose: 'Mathematical foundations for field-level coherence',
      path: './mathematics'
    }
  }
} as const;

