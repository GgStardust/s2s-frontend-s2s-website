/**
 * Wave Algorithm
 *
 * Simulates wave-based propagation with decaying amplitude per hop.
 */

import { RelationshipGraph } from './relationship-graph.js';

export interface WaveConfig {
  decay?: number;
  maxDepth?: number;
  minAmplitude?: number;
}

export interface WaveStep {
  depth: number;
  frontier: string[];
  values: Record<string, number>;
}

export interface WaveResult {
  strategy: 'wave';
  maxDepthReached: number;
  nodeValues: Record<string, number>;
  steps: WaveStep[];
}

interface WaveNode {
  id: string;
  amplitude: number;
  depth: number;
}

export function wavePropagate(
  graph: RelationshipGraph,
  seedValues: Record<string, number> = {},
  config: WaveConfig = {}
): WaveResult {
  const decay = typeof config.decay === 'number' ? config.decay : 0.65;
  const maxDepth = config.maxDepth ?? 5;
  const minAmplitude = config.minAmplitude ?? 0.001;

  const nodeValues: Record<string, number> = {};
  graph.getAllNodes().forEach(node => {
    nodeValues[node.id] = 0;
  });

  const seeds = Object.keys(seedValues).length > 0
    ? seedValues
    : Object.fromEntries(graph.getAllNodes().map(node => [node.id, 1]));

  const queue: WaveNode[] = Object.entries(seeds).map(([id, amplitude]) => ({
    id,
    amplitude,
    depth: 0
  }));

  const steps: WaveStep[] = [];
  let maxDepthReached = 0;

  while (queue.length > 0) {
    const current = queue.shift() as WaveNode;
    if (Math.abs(current.amplitude) < minAmplitude) {
      continue;
    }

    nodeValues[current.id] += current.amplitude;
    maxDepthReached = Math.max(maxDepthReached, current.depth);

    if (!steps[current.depth]) {
      steps[current.depth] = {
        depth: current.depth,
        frontier: [],
        values: {}
      };
    }
    steps[current.depth].frontier.push(current.id);
    steps[current.depth].values = { ...nodeValues };

    if (current.depth >= maxDepth) {
      continue;
    }

    const neighbors = graph.getNeighbors(current.id);
    neighbors.forEach(neighbor => {
      const nextAmplitude = current.amplitude * decay * neighbor.weight;
      if (Math.abs(nextAmplitude) < minAmplitude) {
        return;
      }
      queue.push({
        id: neighbor.target,
        amplitude: nextAmplitude,
        depth: current.depth + 1
      });
    });
  }

  return {
    strategy: 'wave',
    maxDepthReached,
    nodeValues,
    steps: steps.filter(Boolean)
  };
}

