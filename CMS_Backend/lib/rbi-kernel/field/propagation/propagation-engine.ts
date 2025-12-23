/**
 * Field Propagation Engine
 */

import {
  RelationshipGraph,
  type GraphNode,
  type GraphEdge,
  type GraphSnapshot
} from './relationship-graph.js';
import {
  diffusionPropagate,
  type DiffusionConfig,
  type DiffusionResult
} from './diffusion-algorithm.js';
import {
  wavePropagate,
  type WaveConfig,
  type WaveResult
} from './wave-algorithm.js';

export type PropagationStrategy = 'diffusion' | 'wave';

export interface PropagationRequest {
  nodes: GraphNode[];
  relationships: GraphEdge[];
  seedValues?: Record<string, number>;
  strategy?: PropagationStrategy;
  config?: DiffusionConfig | WaveConfig;
}

export interface PropagationResponse {
  graph: GraphSnapshot;
  result: DiffusionResult | WaveResult;
}

export class FieldPropagationEngine {
  propagate(request: PropagationRequest): PropagationResponse {
    if (!Array.isArray(request.nodes) || request.nodes.length === 0) {
      throw new Error('Propagation request requires at least one node');
    }

    const graph = new RelationshipGraph(request.nodes, request.relationships);
    const strategy: PropagationStrategy = request.strategy ?? 'diffusion';
    const seedValues = request.seedValues ?? {};

    const result = strategy === 'wave'
      ? wavePropagate(graph, seedValues, request.config as WaveConfig | undefined)
      : diffusionPropagate(graph, seedValues, request.config as DiffusionConfig | undefined);

    return {
      graph: graph.toJSON(),
      result
    };
  }
}

