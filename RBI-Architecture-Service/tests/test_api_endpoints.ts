/**
 * API Endpoints Tests
 * 
 * Tests for RBI API endpoint functionality
 * Note: These tests verify the endpoint logic, not the full HTTP server
 */

import { describe, it, expect } from 'vitest';
import { EnhancedResonanceEngine } from '../src/field/computation/index.js';
import { ResonanceVectorMath } from '../src/mathematics/index.js';
import type { ResonanceVector } from '../src/types.js';

describe('API Endpoint Logic', () => {
  describe('Score Endpoint Logic', () => {
    it('should calculate scores for vector candidates', async () => {
      const queryVector: ResonanceVector = { x: 0.5, y: 0.6, z: 0.7, w: 0.8 };
      const candidates = [
        { id: '1', vector: { x: 0.4, y: 0.5, z: 0.6, w: 0.7 } },
        { id: '2', vector: { x: 0.6, y: 0.7, z: 0.8, w: 0.9 } }
      ];
      
      const scores = await Promise.all(
        candidates.map(async (candidate) => {
          const distance = ResonanceVectorMath.calculateVectorDistance(
            queryVector,
            candidate.vector
          );
          const maxDistance = Math.sqrt(4);
          const similarity = 1 - (distance / maxDistance);
          
          return {
            id: candidate.id,
            score: Math.max(0, Math.min(1, similarity))
          };
        })
      );
      
      expect(scores.length).toBe(2);
      expect(scores[0]).toHaveProperty('id');
      expect(scores[0]).toHaveProperty('score');
      expect(scores[0].score).toBeGreaterThanOrEqual(0);
      expect(scores[0].score).toBeLessThanOrEqual(1);
    });

    it('should handle text candidates by generating vectors', async () => {
      const engine = EnhancedResonanceEngine.getInstance();
      const queryVector: ResonanceVector = { x: 0.5, y: 0.6, z: 0.7, w: 0.8 };
      const candidateText = 'Test text for vector generation';
      
      const analysis = await engine.analyzeContentWithMathematics(candidateText);
      const candidateVector = analysis.mathematical.resonanceVector;
      
      const distance = ResonanceVectorMath.calculateVectorDistance(queryVector, candidateVector);
      const maxDistance = Math.sqrt(4);
      const similarity = 1 - (distance / maxDistance);
      const score = Math.max(0, Math.min(1, similarity));
      
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  describe('Neighbors Endpoint Logic', () => {
    it('should find top N neighbors from candidates', async () => {
      const queryVector: ResonanceVector = { x: 0.5, y: 0.6, z: 0.7, w: 0.8 };
      const candidates = [
        { id: '1', vector: { x: 0.4, y: 0.5, z: 0.6, w: 0.7 } },
        { id: '2', vector: { x: 0.6, y: 0.7, z: 0.8, w: 0.9 } },
        { id: '3', vector: { x: 0.3, y: 0.4, z: 0.5, w: 0.6 } },
        { id: '4', vector: { x: 0.7, y: 0.8, z: 0.9, w: 1.0 } },
        { id: '5', vector: { x: 0.2, y: 0.3, z: 0.4, w: 0.5 } }
      ];
      const topN = 3;
      
      const results = candidates.map((candidate) => {
        const distance = ResonanceVectorMath.calculateVectorDistance(
          queryVector,
          candidate.vector
        );
        const maxDistance = Math.sqrt(4);
        const similarity = 1 - (distance / maxDistance);
        
        return {
          id: candidate.id,
          score: Math.max(0, Math.min(1, similarity))
        };
      });
      
      const topResults = results
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);
      
      expect(topResults.length).toBe(3);
      expect(topResults[0].score).toBeGreaterThanOrEqual(topResults[1].score);
      expect(topResults[1].score).toBeGreaterThanOrEqual(topResults[2].score);
    });

    it('should handle text queries by generating vectors', async () => {
      const engine = EnhancedResonanceEngine.getInstance();
      const queryText = 'Test query text';
      
      const analysis = await engine.analyzeContentWithMathematics(queryText);
      const queryVector = analysis.mathematical.resonanceVector;
      
      expect(queryVector).toHaveProperty('x');
      expect(queryVector).toHaveProperty('y');
      expect(queryVector).toHaveProperty('z');
      expect(queryVector).toHaveProperty('w');
    });
  });

  describe('Vector Endpoint Logic', () => {
    it('should convert signature to vector', () => {
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
  });
});

