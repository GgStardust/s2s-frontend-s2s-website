/**
 * Mathematics - Resonance Vector Calculations
 * 
 * Implements 4D resonance vector mathematics:
 * - 4D resonance space (clarity, coherence, resonance, sovereignty)
 * - Vector distance calculations
 * - Harmonic frequency analysis
 * - Coherence matrix operations
 * - Field strength computations
 */

export interface ResonanceVector {
  x: number; // Clarity dimension
  y: number; // Coherence dimension  
  z: number; // Resonance dimension
  w: number; // Sovereignty dimension
}

export interface HarmonicFrequency {
  fundamental: number;
  harmonics: number[];
  dissonance: number;
  spectralDensity: number;
}

export interface CoherenceMatrix {
  nxn: number[][];
  eigenvalues: number[];
  eigenvectors: number[][];
  coherenceRank: number;
}

export interface FieldDynamics {
  fieldStrength: number;
  gradient: number[];
  stability: number;
  coherence: number;
}

export class ResonanceVectorMath {
  /**
   * Calculate distance between two resonance vectors in 4D space
   */
  public static calculateVectorDistance(v1: ResonanceVector, v2: ResonanceVector): number {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    const dz = v1.z - v2.z;
    const dw = v1.w - v2.w;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
  }

  /**
   * Calculate harmonic frequency analysis for resonance patterns
   */
  public static analyzeHarmonicFrequency(content: string): HarmonicFrequency {
    // Extract frequency patterns from content
    const words = content.toLowerCase().split(/\s+/);
    const wordFrequencies = this.calculateWordFrequencies(words);
    
    // Find fundamental frequency (most common pattern)
    const fundamental = Math.max(...Object.values(wordFrequencies));
    
    // Calculate harmonics (integer multiples of fundamental)
    const harmonics = [2, 3, 4, 5].map(multiplier => fundamental * multiplier);
    
    // Calculate dissonance (deviation from harmonic series)
    const dissonance = this.calculateDissonance(wordFrequencies, harmonics);
    
    // Calculate spectral density (energy distribution)
    const spectralDensity = this.calculateSpectralDensity(wordFrequencies);
    
    return {
      fundamental,
      harmonics,
      dissonance,
      spectralDensity
    };
  }

  /**
   * Build coherence matrix for Orb associations
   */
  public static buildCoherenceMatrix(orbAssociations: number[]): CoherenceMatrix {
    const n = orbAssociations.length;
    const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
    
    // Calculate coherence between each pair of Orbs
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1.0; // Self-coherence
        } else {
          matrix[i][j] = this.calculateOrbCoherence(orbAssociations[i], orbAssociations[j]);
        }
      }
    }
    
    // Calculate eigenvalues and eigenvectors
    const { eigenvalues, eigenvectors } = this.calculateEigenvalues(matrix);
    
    // Calculate coherence rank (number of significant eigenvalues)
    const coherenceRank = eigenvalues.filter(e => Math.abs(e) > 0.1).length;
    
    return {
      nxn: matrix,
      eigenvalues,
      eigenvectors,
      coherenceRank
    };
  }

  /**
   * Calculate field dynamics for resonance patterns
   */
  public static calculateFieldDynamics(
    resonanceVector: ResonanceVector,
    orbAssociations: number[]
  ): FieldDynamics {
    // Calculate field strength (magnitude of resonance vector)
    const fieldStrength = Math.sqrt(
      resonanceVector.x * resonanceVector.x +
      resonanceVector.y * resonanceVector.y +
      resonanceVector.z * resonanceVector.z +
      resonanceVector.w * resonanceVector.w
    );
    
    // Calculate gradient (rate of change in each dimension)
    const gradient = [
      resonanceVector.x,
      resonanceVector.y,
      resonanceVector.z,
      resonanceVector.w
    ];
    
    // Calculate stability (inverse of variance)
    const stability = 1 / (1 + this.calculateVariance(gradient));
    
    // Calculate coherence (alignment with Orb system)
    const coherence = this.calculateOrbAlignment(resonanceVector, orbAssociations);
    
    return {
      fieldStrength,
      gradient,
      stability,
      coherence
    };
  }

  /**
   * Convert energetic signature to resonance vector
   */
  public static signatureToVector(signature: {
    clarity: number;
    coherence: number;
    resonance: number;
    sovereignty: number;
  }): ResonanceVector {
    return {
      x: signature.clarity,
      y: signature.coherence,
      z: signature.resonance,
      w: signature.sovereignty
    };
  }

  /**
   * Calculate resonance similarity between two content pieces
   */
  public static calculateResonanceSimilarity(
    vector1: ResonanceVector,
    vector2: ResonanceVector
  ): number {
    const distance = this.calculateVectorDistance(vector1, vector2);
    const maxDistance = Math.sqrt(4); // Maximum distance in 4D unit cube
    
    return 1 - (distance / maxDistance);
  }

  // Private helper methods

  private static calculateWordFrequencies(words: string[]): Record<string, number> {
    const frequencies: Record<string, number> = {};
    words.forEach(word => {
      frequencies[word] = (frequencies[word] || 0) + 1;
    });
    return frequencies;
  }

  private static calculateDissonance(
    frequencies: Record<string, number>,
    harmonics: number[]
  ): number {
    const values = Object.values(frequencies);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    let dissonance = 0;
    harmonics.forEach(harmonic => {
      const deviation = Math.abs(mean - harmonic);
      dissonance += deviation;
    });
    
    return dissonance / harmonics.length;
  }

  private static calculateSpectralDensity(frequencies: Record<string, number>): number {
    const values = Object.values(frequencies);
    const total = values.reduce((sum, val) => sum + val, 0);
    const variance = this.calculateVariance(values);
    
    return variance / total;
  }

  private static calculateOrbCoherence(orb1: number, orb2: number): number {
    // Orb coherence based on 13-Orb system relationships
    const orbRelationships = {
      1: [2, 3, 13], // Origin Intelligence connects to Resonance Mechanics, Photonic Intelligence, Bridging Intelligence
      2: [1, 4, 5], // Resonance Mechanics connects to Origin Intelligence, Harmonic Architectures, Temporal Sovereignty
      3: [1, 6, 7], // Photonic Intelligence connects to Origin Intelligence, Starline Memory, Alchemical Current
      4: [2, 5, 8], // Harmonic Architectures connects to Resonance Mechanics, Temporal Sovereignty, Quantum Intuition
      5: [2, 4, 9], // Temporal Sovereignty connects to Resonance Mechanics, Harmonic Architectures, Temporal Fluidity
      6: [3, 7, 10], // Starline Memory connects to Photonic Intelligence, Alchemical Current, Ancestral Repatterning
      7: [3, 6, 11], // Alchemical Current connects to Photonic Intelligence, Starline Memory, Radiant Transparency
      8: [4, 9, 12], // Quantum Intuition connects to Harmonic Architectures, Temporal Fluidity, Sovereign Field
      9: [5, 8, 13], // Temporal Fluidity connects to Temporal Sovereignty, Quantum Intuition, Bridging Intelligence
      10: [6, 11, 1], // Ancestral Repatterning connects to Starline Memory, Radiant Transparency, Origin Intelligence
      11: [7, 10, 2], // Radiant Transparency connects to Alchemical Current, Ancestral Repatterning, Resonance Mechanics
      12: [8, 13, 3], // Sovereign Field connects to Quantum Intuition, Bridging Intelligence, Photonic Intelligence
      13: [1, 9, 12] // Bridging Intelligence connects to Origin Intelligence, Temporal Fluidity, Sovereign Field
    };
    
    const connections = orbRelationships[orb1 as keyof typeof orbRelationships] || [];
    return connections.includes(orb2) ? 0.8 : 0.2;
  }

  private static calculateEigenvalues(matrix: number[][]): {
    eigenvalues: number[];
    eigenvectors: number[][];
  } {
    // Simplified eigenvalue calculation for 2x2 matrices
    // For larger matrices, would use more sophisticated algorithms
    if (matrix.length === 2) {
      const a = matrix[0][0];
      const b = matrix[0][1];
      const c = matrix[1][0];
      const d = matrix[1][1];
      
      const trace = a + d;
      const det = a * d - b * c;
      
      const discriminant = trace * trace - 4 * det;
      const sqrtDiscriminant = Math.sqrt(Math.max(0, discriminant));
      
      const lambda1 = (trace + sqrtDiscriminant) / 2;
      const lambda2 = (trace - sqrtDiscriminant) / 2;
      
      return {
        eigenvalues: [lambda1, lambda2],
        eigenvectors: [[1, 0], [0, 1]] // Simplified eigenvectors
      };
    }
    
    // For larger matrices, return identity
    return {
      eigenvalues: matrix.map((_, i) => 1),
      eigenvectors: matrix.map((_, i) => matrix.map((_, j) => i === j ? 1 : 0))
    };
  }

  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }

  private static calculateOrbAlignment(
    vector: ResonanceVector,
    orbAssociations: number[]
  ): number {
    // Calculate how well the resonance vector aligns with the Orb system
    const orbWeights = orbAssociations.map(orb => {
      // Each Orb has different dimensional preferences
      const orbPreferences = {
        1: [1, 1, 1, 1], // Origin Intelligence: balanced
        2: [0.8, 1, 0.9, 0.7], // Resonance Mechanics: coherence-focused
        3: [0.9, 0.8, 1, 0.8], // Photonic Intelligence: resonance-focused
        4: [0.7, 1, 0.8, 0.9], // Harmonic Architectures: coherence and sovereignty
        5: [0.8, 0.9, 0.7, 1], // Temporal Sovereignty: sovereignty-focused
        6: [0.9, 0.7, 0.8, 0.8], // Starline Memory: clarity-focused
        7: [0.8, 0.8, 1, 0.7], // Alchemical Current: resonance-focused
        8: [0.7, 0.8, 0.9, 0.9], // Quantum Intuition: resonance and sovereignty
        9: [0.8, 0.9, 0.8, 0.8], // Temporal Fluidity: balanced
        10: [0.9, 0.8, 0.7, 0.9], // Ancestral Repatterning: clarity and sovereignty
        11: [0.8, 0.9, 0.8, 0.9], // Radiant Transparency: coherence and sovereignty
        12: [0.7, 0.9, 0.8, 1], // Sovereign Field: sovereignty-focused
        13: [0.9, 0.8, 0.9, 0.8] // Bridging Intelligence: clarity and resonance
      };
      
      const preferences = orbPreferences[orb as keyof typeof orbPreferences] || [1, 1, 1, 1];
      return preferences;
    });
    
    // Calculate weighted alignment
    let totalAlignment = 0;
    orbWeights.forEach(weights => {
      const alignment = (
        vector.x * weights[0] +
        vector.y * weights[1] +
        vector.z * weights[2] +
        vector.w * weights[3]
      ) / 4;
      totalAlignment += alignment;
    });
    
    return totalAlignment / orbWeights.length;
  }
}

