/**
 * Relationship Graph
 *
 * Lightweight, in-memory graph structure used by propagation algorithms.
 */

export interface GraphNode {
  id: string;
  label?: string;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  bidirectional?: boolean;
  metadata?: Record<string, unknown>;
}

interface NeighborRef {
  target: string;
  weight: number;
}

export interface GraphSnapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * RelationshipGraph maintains both node/edge collections and
 * adjacency lists for fast lookups during propagation.
 */
export class RelationshipGraph {
  private nodes = new Map<string, GraphNode>();
  private edges: GraphEdge[] = [];
  private adjacency = new Map<string, NeighborRef[]>();

  constructor(nodes: GraphNode[] = [], edges: GraphEdge[] = []) {
    nodes.forEach(node => this.addNode(node));
    edges.forEach(edge => this.addEdge(edge));
  }

  addNode(node: GraphNode): this {
    const normalized: GraphNode = {
      ...node,
      weight: typeof node.weight === 'number' ? node.weight : 1
    };
    this.nodes.set(normalized.id, normalized);
    if (!this.adjacency.has(normalized.id)) {
      this.adjacency.set(normalized.id, []);
    }
    return this;
  }

  addEdge(edge: GraphEdge): this {
    if (!this.nodes.has(edge.from)) {
      this.addNode({ id: edge.from });
    }
    if (!this.nodes.has(edge.to)) {
      this.addNode({ id: edge.to });
    }

    const normalized: GraphEdge = {
      ...edge,
      weight: typeof edge.weight === 'number' ? edge.weight : 1
    };

    const weight = normalized.weight ?? 1;
    this.edges.push({ ...normalized, weight });
    this.addNeighbor(normalized.from, normalized.to, weight);

    if (normalized.bidirectional) {
      this.addNeighbor(normalized.to, normalized.from, weight);
    }

    return this;
  }

  private addNeighbor(from: string, to: string, weight: number): void {
    const neighbors = this.adjacency.get(from);
    if (!neighbors) {
      this.adjacency.set(from, [{ target: to, weight }]);
      return;
    }

    neighbors.push({ target: to, weight });
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  getNeighbors(id: string): NeighborRef[] {
    return this.adjacency.get(id) ?? [];
  }

  toJSON(): GraphSnapshot {
    return {
      nodes: this.getAllNodes(),
      edges: [...this.edges]
    };
  }
}

