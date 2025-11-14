/**
 * Validation Layer Tests
 * 
 * Tests for Proof-of-Meaning and validation functions
 */

import { describe, it, expect } from 'vitest';
import { verifyConsciousness, validateCoherence, type ConsciousnessContext } from '../src/field/validation/proof-of-meaning.js';

describe('Proof-of-Meaning', () => {
  describe('verifyConsciousness', () => {
    it('should verify consciousness and return verification result', () => {
      const content = 'Test content for consciousness verification';
      const orbAssociations = [1, 2, 3];
      
      const result = verifyConsciousness(content, orbAssociations);
      
      expect(result).toHaveProperty('verified');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('mathematicalProof');
      
      expect(typeof result.verified).toBe('boolean');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(typeof result.mathematicalProof).toBe('string');
    });

    it('should handle empty content', () => {
      const content = '';
      const orbAssociations: number[] = [];
      
      const result = verifyConsciousness(content, orbAssociations);
      
      expect(result).toHaveProperty('verified');
      expect(result).toHaveProperty('confidence');
    });

    it('should handle empty orb associations', () => {
      const content = 'Test content';
      const orbAssociations: number[] = [];
      
      const result = verifyConsciousness(content, orbAssociations);
      
      expect(result).toHaveProperty('verified');
    });
  });

  describe('validateCoherence', () => {
    it('should validate coherence with full context', () => {
      const content = 'Test content for coherence validation';
      const context: ConsciousnessContext = {
        orbAssociations: [1, 2, 3],
        fieldState: [0.5, 0.6, 0.7, 0.8],
        temporalContext: new Date().toISOString(),
        spatialContext: 'test_context'
      };
      
      const proof = validateCoherence(content, context);
      
      expect(proof).toHaveProperty('statement');
      expect(proof).toHaveProperty('proof');
      expect(proof).toHaveProperty('coherence');
      expect(proof).toHaveProperty('sovereignty');
      expect(proof).toHaveProperty('validity');
      
      expect(['proven', 'partial', 'unproven', 'error']).toContain(proof.validity);
      expect(proof.coherence).toBeGreaterThanOrEqual(0);
      expect(proof.coherence).toBeLessThanOrEqual(1);
      expect(proof.sovereignty).toBeGreaterThanOrEqual(0);
      expect(proof.sovereignty).toBeLessThanOrEqual(1);
    });

    it('should handle minimal context', () => {
      const content = 'Test content';
      const context: ConsciousnessContext = {
        orbAssociations: [],
        fieldState: [0, 0, 0, 0],
        temporalContext: new Date().toISOString(),
        spatialContext: ''
      };
      
      const proof = validateCoherence(content, context);
      
      expect(proof).toHaveProperty('validity');
      expect(proof).toHaveProperty('coherence');
    });
  });
});

