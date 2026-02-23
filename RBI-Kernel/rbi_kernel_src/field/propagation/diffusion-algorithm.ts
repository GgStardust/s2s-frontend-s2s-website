/**
 * Diffusion Algorithm
 *
 * Iteratively distributes resonance/intensity across the relationship graph.
 */

import { RelationshipGraph } from './relationship-graph.js';

export interface DiffusionConfig {
  damping?: number;
  maxIterations?: number;
  minDelta?: number;
}

export interface DiffusionStep {
  iteration: number;
  delta: number;
  values: Record<string, number>;
}

export interface DiffusionResult {
  strategy: 'diffusion';
  iterations: number;
  nodeValues: Record<string, number>;
  steps: DiffusionStep[];
}

export function diffusionPropagate(
  graph: RelationshipGraph,
  seedValues: Record<string, number> = {},
  config: DiffusionConfig = {}
): DiffusionResult {
  const damping = typeof config.damping === 'number' ? config.damping : 0.8;
  const maxIterations = config.maxIterations ?? 12;
  const minDelta = config.minDelta ?? 0.0005;

  const allNodes = graph.getAllNodes();
  let currentValues: Record<string, number> = {};

  allNodes.forEach(node => {
    currentValues[node.id] = seedValues[node.id] ?? 0;
  });

  const steps: DiffusionStep[] = [];
  let iteration = 0;

  while (iteration < maxIterations) {
    const nextValues: Record<string, number> = { ...currentValues };
    let maxDelta = 0;

    for (const node of allNodes) {
      const neighbors = graph.getNeighbors(node.id);
      if (neighbors.length === 0) {
        continue;
      }

      const totalWeight = neighbors.reduce((sum, neighbor) => sum + neighbor.weight, 0) || 1;
      const neighborInfluence = neighbors.reduce((sum, neighbor) => {
        return sum + (currentValues[neighbor.target] ?? 0) * (neighbor.weight / totalWeight);
      }, 0);

      const updatedValue = (1 - damping) * currentValues[node.id] + damping * neighborInfluence;
      nextValues[node.id] = updatedValue;
      maxDelta = Math.max(maxDelta, Math.abs(updatedValue - currentValues[node.id]));
    }

    iteration += 1;
    currentValues = nextValues;
    steps.push({
      iteration,
      delta: maxDelta,
      values: { ...currentValues }
    });

    if (maxDelta < minDelta) {
      break;
    }
  }

  return {
    strategy: 'diffusion',
    iterations: iteration,
    nodeValues: currentValues,
    steps
  };
}

