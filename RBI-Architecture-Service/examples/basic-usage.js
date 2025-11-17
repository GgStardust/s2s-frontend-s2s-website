/**
 * RBI Kernel - Basic Usage Examples
 * 
 * Simple examples showing how to use the RBI Kernel API
 */

const RBI_KERNEL_URL = process.env.RBI_KERNEL_URL || 'http://localhost:3000';

/**
 * Example 1: Calculate similarity between two vectors
 */
async function example1_vectorSimilarity() {
  console.log('\n=== Example 1: Vector Similarity ===');
  
  const response = await fetch(`${RBI_KERNEL_URL}/rbi/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vectors: {
        vector1: [0.1, 0.2, 0.3, 0.4],
        vector2: [0.2, 0.3, 0.4, 0.5]
      }
    })
  });
  
  const result = await response.json();
  console.log('Score:', result.score);
  console.log('Method:', result.method);
  return result;
}

/**
 * Example 2: Calculate similarity between two text strings
 */
async function example2_textSimilarity() {
  console.log('\n=== Example 2: Text Similarity ===');
  
  const response = await fetch(`${RBI_KERNEL_URL}/rbi/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      texts: {
        text1: 'The resonance between these concepts is clear',
        text2: 'The resonance among these ideas is evident'
      }
    })
  });
  
  const result = await response.json();
  console.log('Score:', result.score);
  console.log('Method:', result.method);
  return result;
}

/**
 * Example 3: Calculate resonance with direct parameters
 */
async function example3_resonanceParams() {
  console.log('\n=== Example 3: Resonance Parameters ===');
  
  const response = await fetch(`${RBI_KERNEL_URL}/rbi/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vectorSimilarity: 0.8,
      orbOverlap: 0.7,
      temporalDecay: 0.9
    })
  });
  
  const result = await response.json();
  console.log('Score:', result.score);
  console.log('Method:', result.method);
  return result;
}

/**
 * Example 4: Find similar items (neighbors)
 */
async function example4_findNeighbors() {
  console.log('\n=== Example 4: Find Neighbors ===');
  
  const response = await fetch(`${RBI_KERNEL_URL}/rbi/neighbors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: {
        vector: [0.1, 0.2, 0.3, 0.4]
      },
      candidates: [
        {
          id: 'item1',
          vector: [0.2, 0.3, 0.4, 0.5],
          metadata: { title: 'Similar Item 1' }
        },
        {
          id: 'item2',
          vector: [0.5, 0.6, 0.7, 0.8],
          metadata: { title: 'Different Item' }
        },
        {
          id: 'item3',
          vector: [0.15, 0.25, 0.35, 0.45],
          metadata: { title: 'Very Similar Item' }
        }
      ],
      topN: 2
    })
  });
  
  const result = await response.json();
  console.log('Found', result.count, 'neighbors:');
  result.neighbors.forEach((neighbor, i) => {
    console.log(`  ${i + 1}. ${neighbor.id}: ${neighbor.score.toFixed(3)}`);
    if (neighbor.metadata) {
      console.log(`     Title: ${neighbor.metadata.title}`);
    }
  });
  return result;
}

/**
 * Example 5: Health check
 */
async function example5_healthCheck() {
  console.log('\n=== Example 5: Health Check ===');
  
  const response = await fetch(`${RBI_KERNEL_URL}/health`);
  const result = await response.json();
  console.log('Status:', result.status);
  console.log('Service:', result.service);
  console.log('Version:', result.version);
  return result;
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('RBI Kernel - Basic Usage Examples');
  console.log('==================================');
  console.log(`Kernel URL: ${RBI_KERNEL_URL}`);
  
  try {
    // Health check first
    await example5_healthCheck();
    
    // Run examples
    await example1_vectorSimilarity();
    await example2_textSimilarity();
    await example3_resonanceParams();
    await example4_findNeighbors();
    
    console.log('\nAll examples completed successfully!');
  } catch (error) {
    console.error('\nError running examples:', error.message);
    console.error('Make sure the RBI Kernel is running on', RBI_KERNEL_URL);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}

export {
  example1_vectorSimilarity,
  example2_textSimilarity,
  example3_resonanceParams,
  example4_findNeighbors,
  example5_healthCheck,
  runAllExamples
};

