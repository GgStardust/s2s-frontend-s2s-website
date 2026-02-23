/**
 * Field Propagation Layer - Exports
 * 
 * Architecture Layer: 5 (Field Propagation)
 * 
 * Links verified coherence data to external systems through
 * relationship graphs and propagation algorithms.
 */

export { FieldPropagationEngine } from './propagation-engine.js';
export { RelationshipGraph } from './relationship-graph.js';
export { diffusionPropagate } from './diffusion-algorithm.js';
export { wavePropagate } from './wave-algorithm.js';

export type {
  PropagationStrategy,
  PropagationRequest,
  PropagationResponse
} from './propagation-engine.js';

export type {
  GraphNode,
  GraphEdge,
  GraphSnapshot
} from './relationship-graph.js';

export type {
  DiffusionConfig,
  DiffusionStep,
  DiffusionResult
} from './diffusion-algorithm.js';

export type {
  WaveConfig,
  WaveStep,
  WaveResult
} from './wave-algorithm.js';
