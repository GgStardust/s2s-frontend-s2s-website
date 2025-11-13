/**
 * RBI Neighbors Functions - Test Suite
 * 
 * Tests for RBI kernel neighbor finding functions
 */

import { findNeighbors, type NeighborSearchParams } from './neighbors';

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
    toHaveLength: (expected: number) => {
      if (actual.length !== expected) {
        throw new Error(`Expected length ${expected}, got ${actual.length}`);
      }
    },
    toContain: (expected: any) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected ${actual} to contain ${expected}`);
      }
    },
    toEqual: (expected: any) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    }
  };
}

console.log('🧪 Running RBI Neighbors Tests...\n');

let passed = 0;
let failed = 0;

// Test findNeighbors with vectors
passed += test('findNeighbors: Vector similarity search', () => {
  const params: NeighborSearchParams = {
    query: { vector: [0.1, 0.2, 0.3, 0.4] },
    candidates: [
      { id: 'item1', vector: [0.2, 0.3, 0.4, 0.5], metadata: { title: 'Item 1' } },
      { id: 'item2', vector: [0.5, 0.6, 0.7, 0.8], metadata: { title: 'Item 2' } },
      { id: 'item3', vector: [0.15, 0.25, 0.35, 0.45], metadata: { title: 'Item 3' } }
    ],
    topN: 2
  };
  
  const result = findNeighbors(params);
  
  expect(result).toHaveLength(2);
  expect(result[0].id).toBe('item3'); // Should be most similar
  expect(result[0].score).toBeGreaterThan(result[1].score);
});

passed += test('findNeighbors: Top N limit', () => {
  const params: NeighborSearchParams = {
    query: { vector: [0.1, 0.2, 0.3, 0.4] },
    candidates: [
      { id: 'item1', vector: [0.2, 0.3, 0.4, 0.5] },
      { id: 'item2', vector: [0.5, 0.6, 0.7, 0.8] },
      { id: 'item3', vector: [0.15, 0.25, 0.35, 0.45] },
      { id: 'item4', vector: [0.12, 0.22, 0.32, 0.42] },
      { id: 'item5', vector: [0.11, 0.21, 0.31, 0.41] }
    ],
    topN: 3
  };
  
  const result = findNeighbors(params);
  expect(result).toHaveLength(3);
});

passed += test('findNeighbors: Text similarity search', () => {
  const params: NeighborSearchParams = {
    query: { text: 'resonance mechanics harmonic architectures' },
    candidates: [
      { id: 'item1', text: 'resonance mechanics and temporal sovereignty' },
      { id: 'item2', text: 'quantum intuition and photonic intelligence' },
      { id: 'item3', text: 'resonance mechanics harmonic architectures temporal' }
    ],
    topN: 2
  };
  
  const result = findNeighbors(params);
  
  expect(result).toHaveLength(2);
  expect(result[0].id).toBe('item3'); // Should have highest text similarity
  expect(result[0].score).toBeGreaterThan(0);
});

passed += test('findNeighbors: Scores are sorted descending', () => {
  const params: NeighborSearchParams = {
    query: { vector: [0.1, 0.2, 0.3, 0.4] },
    candidates: [
      { id: 'item1', vector: [0.9, 0.9, 0.9, 0.9] }, // Very different
      { id: 'item2', vector: [0.15, 0.25, 0.35, 0.45] }, // Similar
      { id: 'item3', vector: [0.12, 0.22, 0.32, 0.42] } // Very similar
    ],
    topN: 3
  };
  
  const result = findNeighbors(params);
  
  // Verify scores are in descending order
  for (let i = 0; i < result.length - 1; i++) {
    if (result[i].score < result[i + 1].score) {
      throw new Error('Scores are not in descending order');
    }
  }
});

passed += test('findNeighbors: Scores are clamped to 0-1', () => {
  const params: NeighborSearchParams = {
    query: { vector: [0.1, 0.2, 0.3, 0.4] },
    candidates: [
      { id: 'item1', vector: [0.2, 0.3, 0.4, 0.5] },
      { id: 'item2', vector: [-1, -1, -1, -1] } // Negative vector
    ],
    topN: 2
  };
  
  const result = findNeighbors(params);
  
  result.forEach(item => {
    if (item.score < 0 || item.score > 1) {
      throw new Error(`Score ${item.score} is not in range [0, 1]`);
    }
  });
});

passed += test('findNeighbors: Metadata preserved', () => {
  const params: NeighborSearchParams = {
    query: { vector: [0.1, 0.2, 0.3, 0.4] },
    candidates: [
      { 
        id: 'item1', 
        vector: [0.2, 0.3, 0.4, 0.5],
        metadata: { title: 'Test Item', category: 'test' }
      }
    ],
    topN: 1
  };
  
  const result = findNeighbors(params);
  
  expect(result).toHaveLength(1);
  expect(result[0].metadata).toEqual({ title: 'Test Item', category: 'test' });
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed');
  process.exit(1);
}

