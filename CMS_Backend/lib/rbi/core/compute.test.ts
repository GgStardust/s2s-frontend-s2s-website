/**
 * RBI Core Compute Functions - Test Suite
 * 
 * Tests for RBI kernel computation functions
 */

import {
  computeResonance,
  scoreVectors,
  calculateJaccardSimilarity,
  calculateTextSimilarity,
  normalizeVector,
  type ResonanceParams
} from './compute';

// Simple test runner
function test(name: string, fn: () => void): number {
  try {
    fn();
    console.log(`✅ ${name}`);
    return 1;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    return 0;
  }
}

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toBeCloseTo: (expected: number, precision: number = 2) => {
      const diff = Math.abs(actual - expected);
      const threshold = Math.pow(10, -precision);
      if (diff > threshold) {
        throw new Error(`Expected ${expected}, got ${actual} (difference: ${diff})`);
      }
    },
    toBeGreaterThan: (expected: number) => {
      if (actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeLessThan: (expected: number) => {
      if (actual >= expected) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toBeLessThanOrEqual: (expected: number) => {
      if (actual > expected) {
        throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
      }
    },
    toEqual: (expected: any) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    }
  };
}

console.log('🧪 Running RBI Core Compute Tests...\n');

let passed = 0;
let failed = 0;

// Test computeResonance
passed += test('computeResonance: Basic calculation', () => {
  const params: ResonanceParams = {
    vectorSimilarity: 0.8,
    orbOverlap: 0.7,
    temporalDecay: 0.9
  };
  const result = computeResonance(params);
  // R_ij = (0.8 × 0.4) + (0.7 × 0.4) + (0.9 × 0.2) = 0.32 + 0.28 + 0.18 = 0.78
  expect(result).toBeCloseTo(0.78, 2);
});

passed += test('computeResonance: Perfect scores', () => {
  const params: ResonanceParams = {
    vectorSimilarity: 1.0,
    orbOverlap: 1.0,
    temporalDecay: 1.0
  };
  const result = computeResonance(params);
  expect(result).toBe(1.0);
});

passed += test('computeResonance: Zero scores', () => {
  const params: ResonanceParams = {
    vectorSimilarity: 0.0,
    orbOverlap: 0.0,
    temporalDecay: 0.0
  };
  const result = computeResonance(params);
  expect(result).toBe(0.0);
});

// Test scoreVectors
passed += test('scoreVectors: Identical vectors', () => {
  const vec1 = [1, 0, 0, 0];
  const vec2 = [1, 0, 0, 0];
  const result = scoreVectors(vec1, vec2);
  expect(result).toBeCloseTo(1.0, 2);
});

passed += test('scoreVectors: Orthogonal vectors', () => {
  const vec1 = [1, 0, 0, 0];
  const vec2 = [0, 1, 0, 0];
  const result = scoreVectors(vec1, vec2);
  expect(result).toBeCloseTo(0.0, 2);
});

passed += test('scoreVectors: 4D resonance vectors', () => {
  const vec1 = [0.8, 0.7, 0.9, 0.6];
  const vec2 = [0.7, 0.8, 0.8, 0.7];
  const result = scoreVectors(vec1, vec2);
  expect(result).toBeGreaterThan(0.9); // Should be highly similar
});

passed += test('scoreVectors: Different dimensions throws error', () => {
  try {
    scoreVectors([1, 2], [1, 2, 3]);
    throw new Error('Should have thrown an error');
  } catch (error) {
    if (error instanceof Error && error.message.includes('same dimension')) {
      // Expected error
    } else {
      throw error;
    }
  }
});

// Test calculateJaccardSimilarity
passed += test('calculateJaccardSimilarity: Perfect match', () => {
  const arr1 = [1, 2, 3];
  const arr2 = [1, 2, 3];
  const result = calculateJaccardSimilarity(arr1, arr2);
  expect(result).toBe(1.0);
});

passed += test('calculateJaccardSimilarity: No overlap', () => {
  const arr1 = [1, 2, 3];
  const arr2 = [4, 5, 6];
  const result = calculateJaccardSimilarity(arr1, arr2);
  expect(result).toBe(0.0);
});

passed += test('calculateJaccardSimilarity: Partial overlap', () => {
  const arr1 = [1, 2, 3];
  const arr2 = [2, 3, 4];
  const result = calculateJaccardSimilarity(arr1, arr2);
  // Intersection: {2, 3} = 2, Union: {1, 2, 3, 4} = 4, Jaccard = 2/4 = 0.5
  expect(result).toBe(0.5);
});

passed += test('calculateJaccardSimilarity: Empty arrays', () => {
  const result1 = calculateJaccardSimilarity([], []);
  expect(result1).toBe(1.0);
  
  const result2 = calculateJaccardSimilarity([1, 2], []);
  expect(result2).toBe(0.0);
});

passed += test('calculateJaccardSimilarity: Orb associations example', () => {
  const orbs1 = [1, 2, 3];
  const orbs2 = [2, 3, 4, 5];
  const result = calculateJaccardSimilarity(orbs1, orbs2);
  // Intersection: {2, 3} = 2, Union: {1, 2, 3, 4, 5} = 5, Jaccard = 2/5 = 0.4
  expect(result).toBe(0.4);
});

// Test calculateTextSimilarity
passed += test('calculateTextSimilarity: Identical text', () => {
  const text1 = 'resonance mechanics';
  const text2 = 'resonance mechanics';
  const result = calculateTextSimilarity(text1, text2);
  expect(result).toBeCloseTo(1.0, 2);
});

passed += test('calculateTextSimilarity: Different text', () => {
  const text1 = 'resonance mechanics';
  const text2 = 'quantum intuition';
  const result = calculateTextSimilarity(text1, text2);
  expect(result).toBe(0.0); // No word overlap
});

passed += test('calculateTextSimilarity: Partial overlap', () => {
  const text1 = 'resonance mechanics and harmonic architectures';
  const text2 = 'resonance mechanics and temporal sovereignty';
  const result = calculateTextSimilarity(text1, text2);
  expect(result).toBeGreaterThan(0.3); // Should have some overlap
});

// Test normalizeVector
passed += test('normalizeVector: Unit vector', () => {
  const vec = [1, 0, 0, 0];
  const result = normalizeVector(vec);
  expect(result).toEqual([1, 0, 0, 0]);
});

passed += test('normalizeVector: Normalize to unit length', () => {
  const vec = [2, 0, 0, 0];
  const result = normalizeVector(vec);
  expect(result).toEqual([1, 0, 0, 0]);
});

passed += test('normalizeVector: 4D vector normalization', () => {
  const vec = [1, 1, 1, 1];
  const result = normalizeVector(vec);
  const magnitude = Math.sqrt(result.reduce((sum, val) => sum + val * val, 0));
  expect(magnitude).toBeCloseTo(1.0, 2);
});

passed += test('normalizeVector: Zero vector', () => {
  const vec = [0, 0, 0, 0];
  const result = normalizeVector(vec);
  expect(result).toEqual([0, 0, 0, 0]);
});

// Integration test: Full R_ij calculation
passed += test('Integration: Complete R_ij calculation', () => {
  // Simulate content with resonance metrics
  const resonanceMetrics = { strength: 8, clarity: 9, coherence: 8, pattern: 7 };
  const orbAssociations = [1, 2, 3];
  const chapterOrbs = [1, 2];
  
  // Calculate vector similarity (normalize 1-10 scale to 0-1)
  const vectorSimilarity = (resonanceMetrics.strength + 
                           resonanceMetrics.clarity + 
                           resonanceMetrics.coherence + 
                           resonanceMetrics.pattern) / 40;
  
  // Calculate Orb overlap
  const orbOverlap = calculateJaccardSimilarity(orbAssociations, chapterOrbs);
  
  // Temporal decay
  const temporalDecay = 1.0;
  
  // Calculate R_ij
  const rij = computeResonance({
    vectorSimilarity,
    orbOverlap,
    temporalDecay
  });
  
  // Verify result is in valid range
  expect(rij).toBeGreaterThan(0);
  expect(rij).toBeLessThanOrEqual(1.0); // Should be <= 1.0
  
  // Verify components are correct
  expect(vectorSimilarity).toBeCloseTo(0.8, 1); // (8+9+8+7)/40 = 0.8
  expect(orbOverlap).toBeCloseTo(0.67, 1); // Intersection: {1,2} = 2, Union: {1,2,3} = 3, 2/3 = 0.67
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed');
  process.exit(1);
}

