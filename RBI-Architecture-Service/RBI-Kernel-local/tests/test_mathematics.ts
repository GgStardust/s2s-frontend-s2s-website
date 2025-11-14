/**
 * Mathematics Layer Tests
 * 
 * Tests for ResonanceVectorMath and SovereignLogic
 */

import { describe, it, expect } from 'vitest';
import { ResonanceVectorMath, SovereignLogic, type ResonanceVector, type ConsciousnessContext } from '../src/mathematics/index.js';

describe('ResonanceVectorMath', () => {
  describe('calculateVectorDistance', () => {
    it('should calculate distance between two identical vectors as 0', () => {
      const v1: ResonanceVector = { x: 0.5, y: 0.6, z: 0.7, w: 0.8 };
      const v2: ResonanceVector = { x: 0.5, y: 0.6, z: 0.7, w: 0.8 };
      
      const distance = ResonanceVectorMath.calculateVectorDistance(v1, v2);
      expect(distance).toBe(0);
    });

    it('should calculate correct distance between different vectors', () => {
      const v1: ResonanceVector = { x: 0, y: 0, z: 0, w: 0 };
      const v2: ResonanceVector = { x: 1, y: 0, z: 0, w: 0 };
      
      const distance = ResonanceVectorMath.calculateVectorDistance(v1, v2);
      expect(distance).toBe(1);
    });

    it('should handle 4D distance calculation', () => {
      const v1: ResonanceVector = { x: 0, y: 0, z: 0, w: 0 };
      const v2: ResonanceVector = { x: 1, y: 1, z: 1, w: 1 };
      
      const distance = ResonanceVectorMath.calculateVectorDistance(v1, v2);
      expect(distance).toBeCloseTo(2, 5); // sqrt(1+1+1+1) = 2
    });
  });

  describe('signatureToVector', () => {
    it('should convert energetic signature to resonance vector', () => {
      const signature = {
        clarity: 0.75,
        coherence: 0.82,
        resonance: 0.68,
        sovereignty: 0.71
      };
      
      const vector = ResonanceVectorMath.signatureToVector(signature);
      
      expect(vector.x).toBe(0.75);
      expect(vector.y).toBe(0.82);
      expect(vector.z).toBe(0.68);
      expect(vector.w).toBe(0.71);
    });

    it('should handle edge cases (0 values)', () => {
      const signature = {
        clarity: 0,
        coherence: 0,
        resonance: 0,
        sovereignty: 0
      };
      
      const vector = ResonanceVectorMath.signatureToVector(signature);
      
      expect(vector.x).toBe(0);
      expect(vector.y).toBe(0);
      expect(vector.z).toBe(0);
      expect(vector.w).toBe(0);
    });
  });

  describe('analyzeHarmonicFrequency', () => {
    it('should analyze harmonic frequency from content', () => {
      const content = 'This is a test content for harmonic frequency analysis';
      const result = ResonanceVectorMath.analyzeHarmonicFrequency(content);
      
      expect(result).toHaveProperty('fundamental');
      expect(result).toHaveProperty('harmonics');
      expect(result).toHaveProperty('dissonance');
      expect(result).toHaveProperty('spectralDensity');
      
      expect(Array.isArray(result.harmonics)).toBe(true);
      expect(result.harmonics.length).toBeGreaterThan(0);
    });

    it('should handle empty content', () => {
      const content = '';
      const result = ResonanceVectorMath.analyzeHarmonicFrequency(content);
      
      expect(result).toHaveProperty('fundamental');
      expect(result).toHaveProperty('harmonics');
    });
  });

  describe('buildCoherenceMatrix', () => {
    it('should build coherence matrix from orb associations', () => {
      const orbAssociations = [1, 2, 3];
      const matrix = ResonanceVectorMath.buildCoherenceMatrix(orbAssociations);
      
      expect(matrix).toHaveProperty('nxn');
      expect(matrix).toHaveProperty('eigenvalues');
      expect(matrix).toHaveProperty('eigenvectors');
      expect(matrix).toHaveProperty('coherenceRank');
      
      expect(matrix.nxn.length).toBe(3);
      expect(matrix.nxn[0].length).toBe(3);
    });

    it('should handle empty orb associations', () => {
      const orbAssociations: number[] = [];
      const matrix = ResonanceVectorMath.buildCoherenceMatrix(orbAssociations);
      
      expect(matrix.nxn.length).toBe(0);
    });
  });

  describe('calculateFieldDynamics', () => {
    it('should calculate field dynamics from resonance vector', () => {
      const vector: ResonanceVector = { x: 0.5, y: 0.6, z: 0.7, w: 0.8 };
      const orbAssociations = [1, 2];
      
      const dynamics = ResonanceVectorMath.calculateFieldDynamics(vector, orbAssociations);
      
      expect(dynamics).toHaveProperty('fieldStrength');
      expect(dynamics).toHaveProperty('gradient');
      expect(dynamics).toHaveProperty('stability');
      expect(dynamics).toHaveProperty('coherence');
      
      expect(Array.isArray(dynamics.gradient)).toBe(true);
      expect(dynamics.gradient.length).toBe(4);
    });
  });
});

describe('SovereignLogic', () => {
  describe('validateConsciousnessCoherence', () => {
    it('should validate consciousness coherence', () => {
      const content = 'This is test content for consciousness validation';
      const context: ConsciousnessContext = {
        orbAssociations: [1, 2],
        fieldState: [0.5, 0.6, 0.7, 0.8],
        temporalContext: new Date().toISOString(),
        spatialContext: 'test'
      };
      
      const proof = SovereignLogic.validateConsciousnessCoherence(content, context);
      
      expect(proof).toHaveProperty('statement');
      expect(proof).toHaveProperty('proof');
      expect(proof).toHaveProperty('coherence');
      expect(proof).toHaveProperty('sovereignty');
      expect(proof).toHaveProperty('validity');
      
      expect(['proven', 'partial', 'unproven', 'error']).toContain(proof.validity);
      expect(proof.coherence).toBeGreaterThanOrEqual(0);
      expect(proof.coherence).toBeLessThanOrEqual(1);
    });

    it('should handle empty content', () => {
      const content = '';
      const context: ConsciousnessContext = {
        orbAssociations: [],
        fieldState: [0, 0, 0, 0],
        temporalContext: new Date().toISOString(),
        spatialContext: 'test'
      };
      
      const proof = SovereignLogic.validateConsciousnessCoherence(content, context);
      
      expect(proof).toHaveProperty('validity');
    });
  });

  describe('verifyConsciousness', () => {
    it('should verify consciousness with orb associations', () => {
      const content = 'Test content for consciousness verification';
      const orbAssociations = [1, 2, 3];
      
      const result = SovereignLogic.verifyConsciousness(content, orbAssociations);
      
      expect(result).toHaveProperty('verified');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('mathematicalProof');
      
      expect(typeof result.verified).toBe('boolean');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });
});

