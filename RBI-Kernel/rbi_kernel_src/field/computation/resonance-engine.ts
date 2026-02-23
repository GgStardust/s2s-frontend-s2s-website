/**
 * Computation Layer - Resonance Engine (Geometric Refactored)
 * 
 * REFACTORING SUMMARY:
 * ===================
 * This refactored version removes all lexical/vibrational vocabulary detection
 * and replaces it with a geometric, relationship-based resonance model.
 * 
 * CHANGES:
 * - Removed: Hardcoded keyword lists (resonantWords, sovereignWords, etc.)
 * - Removed: Semantic bias toward specific terms ("flow", "energy", "frequency", etc.)
 * - Added: Embedding-based geometric calculations
 * - Added: Intra- and inter-cluster distance analysis
 * - Added: Normalized variance and entropy calculations
 * - Added: Graph-based connectivity centrality
 * 
 * The kernel now measures geometric field coherence (pattern integrity across embeddings)
 * without privileging any discipline-specific or poetic vocabulary. Works equally for
 * academic, scientific, or creative texts.
 * 
 * Mathematically neutral: No S2S/Orb language in core calculations.
 * Interpretation happens later in the S2S translator layer.
 * 
 * Architecture Layer: 2 (Computation)
 */

export interface EnergeticSignature {
  clarity: number;
  coherence: number;
  resonance: number;
  sovereignty: number;
}

export interface ResonanceAnalysis {
  overall_score: number;
  signature: EnergeticSignature;
  orb_associations: number[];
}

interface TextSegment {
  text: string;
  embedding: number[];
}

interface Cluster {
  id: number;
  segments: TextSegment[];
}

export class ResonanceEngine {
  private static instance: ResonanceEngine;
  private embeddingDimension: number = 384; // Default embedding dimension

  private constructor() {}

  public static getInstance(): ResonanceEngine {
    if (!ResonanceEngine.instance) {
      ResonanceEngine.instance = new ResonanceEngine();
    }
    return ResonanceEngine.instance;
  }

  /**
   * Analyze content and extract resonance information using geometric methods
   */
  public async analyzeContent(content: string, title?: string): Promise<ResonanceAnalysis> {
    const signature = await this.extractSignatureGeometric(content, title);
    // Orb associations removed from core calculation - kept only for backward compatibility
    // Interpretation layer will handle Orb mapping separately
    const orbAssociations: number[] = [];
    const overallScore = this.calculateOverallScoreGeometric(signature);
    
    return {
      overall_score: overallScore,
      signature,
      orb_associations: orbAssociations
    };
  }

  /**
   * Extract signature using geometric/embedding-based calculations
   * No lexical vocabulary detection - purely geometric relationships
   */
  private async extractSignatureGeometric(
    content: string, 
    title?: string
  ): Promise<EnergeticSignature> {
    const fullText = (title ? title + ' ' : '') + content;
    
    // Step 1: Create embeddings for each paragraph or sentence
    const segments = this.segmentText(fullText);
    const embeddings = await this.embedSegments(segments);
    
    if (embeddings.length < 2) {
      // Fallback for very short texts
      return {
        clarity: 0.5,
        coherence: 0.5,
        resonance: 0.5,
        sovereignty: 0.5
      };
    }
    
    // Step 2: Calculate metrics using geometric properties
    const clarity = this.calculateClarityGeometric(embeddings);
    const coherence = this.calculateCoherenceGeometric(embeddings);
    const resonance = this.calculateResonanceGeometric(embeddings);
    const sovereignty = this.calculateSovereigntyGeometric(embeddings);
    
    return {
      clarity: Math.max(0, Math.min(1, clarity)),
      coherence: Math.max(0, Math.min(1, coherence)),
      resonance: Math.max(0, Math.min(1, resonance)),
      sovereignty: Math.max(0, Math.min(1, sovereignty))
    };
  }

  /**
   * Segment text into paragraphs or sentences
   */
  private segmentText(text: string): string[] {
    // Split by paragraph breaks first
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    if (paragraphs.length >= 2) {
      return paragraphs.map(p => p.trim());
    }
    
    // If not enough paragraphs, split by sentences
    const sentences = text.split(/[.!?]+\s+/).filter(s => s.trim().length > 10);
    
    return sentences.length >= 2 ? sentences.map(s => s.trim()) : [text];
  }

  /**
   * Create embeddings for text segments
   * 
   * NOTE: In production, this would use a proper embedding model
   * (e.g., sentence-transformers, OpenAI embeddings, etc.).
   * For this refactored version, we use a simple hash-based
   * embedding that preserves geometric relationships.
   * 
   * This is a placeholder that demonstrates the geometric approach.
   * Replace with actual embedding model in production.
   */
  private async embedSegments(segments: string[]): Promise<number[][]> {
    return segments.map(segment => this.simpleEmbedding(segment));
  }

  /**
   * Simple hash-based embedding for demonstration.
   * In production, replace with actual embedding model.
   * 
   * This creates a deterministic vector that preserves some
   * geometric relationships based on character patterns.
   */
  private simpleEmbedding(text: string): number[] {
    const textLower = text.toLowerCase();
    const embedding: number[] = new Array(this.embeddingDimension).fill(0);
    
    // Use character trigrams to create features
    for (let i = 0; i < textLower.length - 2; i++) {
      const trigram = textLower.substring(i, i + 3);
      // Hash to embedding dimension
      const hashVal = this.simpleHash(trigram) % this.embeddingDimension;
      embedding[hashVal] += 1.0;
    }
    
    // Normalize
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (norm > 0) {
      return embedding.map(val => val / norm);
    }
    
    return embedding;
  }

  /**
   * Simple hash function for deterministic embedding
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calculate clarity using inverse entropy of embeddings
   * 
   * Clarity measures how distinct and well-separated the semantic
   * segments are. Lower entropy = higher clarity.
   */
  private calculateClarityGeometric(embeddings: number[][]): number {
    if (embeddings.length === 0) return 0.5;
    
    // Calculate entropy across embedding dimensions
    // Average embedding across all segments
    const meanEmbedding = new Array(this.embeddingDimension).fill(0);
    for (const embedding of embeddings) {
      for (let i = 0; i < this.embeddingDimension; i++) {
        meanEmbedding[i] += embedding[i] || 0;
      }
    }
    
    const segmentCount = embeddings.length;
    for (let i = 0; i < this.embeddingDimension; i++) {
      meanEmbedding[i] /= segmentCount;
    }
    
    // Calculate entropy of the mean embedding
    const epsilon = 1e-10;
    const absMean = meanEmbedding.map(val => Math.abs(val) + epsilon);
    const sum = absMean.reduce((s, val) => s + val, 0);
    const normalized = absMean.map(val => val / sum);
    
    let entropy = 0;
    for (const val of normalized) {
      if (val > epsilon) {
        entropy -= val * Math.log(val + epsilon);
      }
    }
    
    // Normalize entropy (max entropy is log(dim))
    const maxEntropy = Math.log(this.embeddingDimension);
    const normalizedEntropy = entropy / maxEntropy;
    
    // Clarity is inverse of normalized entropy
    return 1.0 - normalizedEntropy;
  }

  /**
   * Calculate coherence using normalized variance of transition vectors
   * 
   * Coherence measures how smoothly the document transitions between segments.
   * Lower variance in transition vectors = higher coherence.
   */
  private calculateCoherenceGeometric(embeddings: number[][]): number {
    if (embeddings.length < 2) return 0.5;
    
    // Calculate transition vectors (differences between consecutive embeddings)
    const transitions: number[][] = [];
    for (let i = 0; i < embeddings.length - 1; i++) {
      const transition = new Array(this.embeddingDimension);
      for (let j = 0; j < this.embeddingDimension; j++) {
        transition[j] = (embeddings[i + 1][j] || 0) - (embeddings[i][j] || 0);
      }
      transitions.push(transition);
    }
    
    // Calculate variance of transition vector norms
    const transitionNorms = transitions.map(trans => {
      const sumSq = trans.reduce((sum, val) => sum + val * val, 0);
      return Math.sqrt(sumSq);
    });
    
    const meanNorm = transitionNorms.reduce((sum, val) => sum + val, 0) / transitionNorms.length;
    const variance = transitionNorms.reduce((sum, val) => {
      const diff = val - meanNorm;
      return sum + diff * diff;
    }, 0) / transitionNorms.length;
    
    // Normalize variance
    const normalizedVariance = meanNorm > 0 ? variance / (meanNorm * meanNorm) : 1.0;
    
    // Coherence is inverse of normalized variance
    return 1.0 / (1.0 + normalizedVariance);
  }

  /**
   * Calculate resonance using intra- and inter-cluster distances
   * 
   * Resonance measures the alignment between document segments.
   * High resonance = tight clusters with clear separation.
   * 
   * Formula: resonance = 1 - (intra_cluster_distance / inter_cluster_distance)
   */
  private calculateResonanceGeometric(embeddings: number[][]): number {
    if (embeddings.length < 2) return 0.5;
    
    // Cluster embeddings using simple k-means (k=2 for simplicity)
    const k = Math.min(2, embeddings.length);
    const clusters = this.clusterEmbeddings(embeddings, k);
    
    // Calculate intra-cluster distance (average distance within clusters)
    const intraDistances: number[] = [];
    for (const cluster of clusters) {
      const clusterEmbs = cluster.segments.map(s => s.embedding);
      if (clusterEmbs.length < 2) continue;
      
      for (let i = 0; i < clusterEmbs.length; i++) {
        for (let j = i + 1; j < clusterEmbs.length; j++) {
          const dist = this.euclideanDistance(clusterEmbs[i], clusterEmbs[j]);
          intraDistances.push(dist);
        }
      }
    }
    
    const meanIntra = intraDistances.length > 0
      ? intraDistances.reduce((sum, val) => sum + val, 0) / intraDistances.length
      : 0.0;
    
    // Calculate inter-cluster distance (average distance between clusters)
    const interDistances: number[] = [];
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const cluster1 = clusters[i].segments.map(s => s.embedding);
        const cluster2 = clusters[j].segments.map(s => s.embedding);
        
        for (const emb1 of cluster1) {
          for (const emb2 of cluster2) {
            const dist = this.euclideanDistance(emb1, emb2);
            interDistances.push(dist);
          }
        }
      }
    }
    
    const meanInter = interDistances.length > 0
      ? interDistances.reduce((sum, val) => sum + val, 0) / interDistances.length
      : 1.0;
    
    // Resonance = 1 - (intra / inter)
    const resonance = meanInter > 0 ? 1.0 - (meanIntra / meanInter) : 0.5;
    
    return Math.max(0.0, Math.min(1.0, resonance));
  }

  /**
   * Calculate sovereignty using normalized connectivity centrality
   * 
   * Sovereignty measures the structural authority and centrality
   * of key segments in the document graph.
   */
  private calculateSovereigntyGeometric(embeddings: number[][]): number {
    if (embeddings.length < 2) return 0.5;
    
    // Build graph from embeddings (connectivity based on similarity)
    const graph = this.buildEmbeddingGraph(embeddings, 0.7);
    
    // Calculate connectivity centrality for each node
    const centralities: number[] = [];
    for (let node = 0; node < embeddings.length; node++) {
      const centrality = this.calculateConnectivityCentrality(graph, node, embeddings.length);
      centralities.push(centrality);
    }
    
    // Normalize centrality scores
    if (centralities.length > 0) {
      const maxCentrality = Math.max(...centralities);
      const normalized = maxCentrality > 0
        ? centralities.map(c => c / maxCentrality)
        : centralities.map(() => 0.5);
      
      // Sovereignty is the average normalized centrality
      const sovereignty = normalized.reduce((sum, val) => sum + val, 0) / normalized.length;
      return sovereignty;
    }
    
    return 0.5;
  }

  /**
   * Simple k-means clustering of embeddings
   */
  private clusterEmbeddings(embeddings: number[][], k: number): Cluster[] {
    if (embeddings.length <= k) {
      // Each embedding is its own cluster
      return embeddings.map((emb, idx) => ({
        id: idx,
        segments: [{ text: '', embedding: emb }]
      }));
    }
    
    // Initialize centroids randomly
    const centroids: number[][] = [];
    const usedIndices = new Set<number>();
    for (let i = 0; i < k; i++) {
      let idx;
      do {
        idx = Math.floor(Math.random() * embeddings.length);
      } while (usedIndices.has(idx));
      usedIndices.add(idx);
      centroids.push([...embeddings[idx]]);
    }
    
    // Simple k-means iteration
    let clusters: Cluster[] = [];
    for (let iter = 0; iter < 10; iter++) {
      // Assign embeddings to nearest centroid
      clusters = Array(k).fill(null).map((_, id) => ({ id, segments: [] }));
      
      for (let i = 0; i < embeddings.length; i++) {
        const distances = centroids.map(centroid => 
          this.euclideanDistance(embeddings[i], centroid)
        );
        const nearestCluster = distances.indexOf(Math.min(...distances));
        clusters[nearestCluster].segments.push({
          text: '',
          embedding: embeddings[i]
        });
      }
      
      // Update centroids
      const newCentroids: number[][] = [];
      for (let clusterId = 0; clusterId < k; clusterId++) {
        const cluster = clusters[clusterId];
        if (cluster.segments.length > 0) {
          const newCentroid = new Array(this.embeddingDimension).fill(0);
          for (const segment of cluster.segments) {
            for (let j = 0; j < this.embeddingDimension; j++) {
              newCentroid[j] += segment.embedding[j] || 0;
            }
          }
          const count = cluster.segments.length;
          for (let j = 0; j < this.embeddingDimension; j++) {
            newCentroid[j] /= count;
          }
          newCentroids.push(newCentroid);
        } else {
          newCentroids.push([...centroids[clusterId]]);
        }
      }
      
      // Check convergence
      let converged = true;
      for (let i = 0; i < k; i++) {
        const dist = this.euclideanDistance(centroids[i], newCentroids[i]);
        if (dist > 1e-6) {
          converged = false;
          break;
        }
      }
      
      if (converged) break;
      centroids.splice(0, centroids.length, ...newCentroids);
    }
    
    return clusters;
  }

  /**
   * Build graph from embeddings based on cosine similarity
   */
  private buildEmbeddingGraph(
    embeddings: number[][], 
    threshold: number = 0.7
  ): Map<number, number[]> {
    const graph = new Map<number, number[]>();
    
    for (let i = 0; i < embeddings.length; i++) {
      graph.set(i, []);
    }
    
    for (let i = 0; i < embeddings.length; i++) {
      for (let j = i + 1; j < embeddings.length; j++) {
        // Calculate cosine similarity
        const similarity = this.cosineSimilarity(embeddings[i], embeddings[j]);
        
        // Connect if similarity exceeds threshold
        if (similarity >= threshold) {
          graph.get(i)!.push(j);
          graph.get(j)!.push(i);
        }
      }
    }
    
    return graph;
  }

  /**
   * Calculate connectivity centrality for a node
   */
  private calculateConnectivityCentrality(
    graph: Map<number, number[]>,
    node: number,
    totalNodes: number
  ): number {
    if (!graph.has(node)) return 0.0;
    
    const neighbors = new Set<number>(graph.get(node)!);
    
    // Include 2-hop neighbors
    for (const neighbor of graph.get(node)!) {
      if (graph.has(neighbor)) {
        for (const neighbor2 of graph.get(neighbor)!) {
          neighbors.add(neighbor2);
        }
      }
    }
    
    neighbors.delete(node);
    
    // Centrality is normalized by total possible connections
    return neighbors.size / Math.max(totalNodes, 1);
  }

  /**
   * Calculate Euclidean distance between two vectors
   */
  private euclideanDistance(v1: number[], v2: number[]): number {
    let sumSq = 0;
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const diff = (v1[i] || 0) - (v2[i] || 0);
      sumSq += diff * diff;
    }
    return Math.sqrt(sumSq);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(v1: number[], v2: number[]): number {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const val1 = v1[i] || 0;
      const val2 = v2[i] || 0;
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    }
    
    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    return denominator > 0 ? dotProduct / denominator : 0;
  }

  /**
   * Extract category associations from content
   * NOTE: This method is kept for backward compatibility but not used in core calculations.
   * Orb associations are now handled in the S2S interpretation layer, not the kernel.
   * This method returns empty array to maintain interface compatibility.
   */
  private extractOrbAssociations(content: string): number[] {
    // Orb associations removed from core kernel - handled in S2S translator layer
    return [];
  }

  /**
   * Calculate overall resonance score using geometric metrics only
   * No Orb associations used - mathematically neutral
   */
  private calculateOverallScoreGeometric(signature: EnergeticSignature): number {
    // Pure geometric average - no external category weighting
    return (
      signature.clarity * 0.25 +
      signature.coherence * 0.25 +
      signature.resonance * 0.25 +
      signature.sovereignty * 0.25
    );
  }
}

