/**
 * RBI Architecture Service - Basic Usage Examples
 * 
 * Simple examples showing how to use the RBI Architecture Service API
 * 
 * Make sure the service is running first:
 *   npm run dev
 */

const SERVICE_URL = process.env.RBI_SERVICE_URL || 'http://localhost:3001';

/**
 * Example 1: Score content with a resonance vector
 */
async function example1_scoreWithVector() {
  console.log('\n=== Example 1: Score with Vector ===');
  
  const response = await fetch(`${SERVICE_URL}/field/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vector: { x: 0.8, y: 0.7, z: 0.9, w: 0.85 }
    })
  });
  
  const result = await response.json();
  console.log('Clarity:', result.clarity);
  console.log('Coherence:', result.coherence);
  console.log('Resonance:', result.resonance);
  console.log('Sovereignty:', result.sovereignty);
  return result;
}

/**
 * Example 2: Score text content
 */
async function example2_scoreText() {
  console.log('\n=== Example 2: Score Text Content ===');
  
  const response = await fetch(`${SERVICE_URL}/field/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: 'The resonance between these concepts is clear and evident'
    })
  });
  
  const result = await response.json();
  console.log('Clarity:', result.clarity.toFixed(3));
  console.log('Coherence:', result.coherence.toFixed(3));
  console.log('Resonance:', result.resonance.toFixed(3));
  console.log('Sovereignty:', result.sovereignty.toFixed(3));
  return result;
}

/**
 * Example 3: Validate content coherence
 */
async function example3_validateContent() {
  console.log('\n=== Example 3: Validate Content ===');
  
  const response = await fetch(`${SERVICE_URL}/field/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: 'This content demonstrates coherence and clarity in its structure and meaning'
    })
  });
  
  const result = await response.json();
  console.log('Verified:', result.verified);
  console.log('Confidence:', result.confidence.toFixed(3));
  return result;
}

/**
 * Example 4: Find similar items (neighbors)
 */
async function example4_findNeighbors() {
  console.log('\n=== Example 4: Find Neighbors ===');
  
  const response = await fetch(`${SERVICE_URL}/field/neighbors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: { text: 'The resonance between concepts' },
      candidates: [
        { id: 'item1', text: 'The resonance among ideas is clear' },
        { id: 'item2', text: 'Completely different topic about weather' },
        { id: 'item3', text: 'Resonance and coherence between concepts' }
      ],
      topN: 2
    })
  });
  
  const result = await response.json();
  console.log('Found', result.count, 'neighbors:');
  result.neighbors.forEach((neighbor, i) => {
    console.log(`  ${i + 1}. ${neighbor.id}: score ${neighbor.score.toFixed(3)}`);
  });
  return result;
}

/**
 * Example 5: Health check
 */
async function example5_healthCheck() {
  console.log('\n=== Example 5: Health Check ===');
  
  const response = await fetch(`${SERVICE_URL}/health`);
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
  console.log('RBI Architecture Service - Basic Usage Examples');
  console.log('================================================');
  console.log(`Service URL: ${SERVICE_URL}`);
  
  try {
    // Health check first
    await example5_healthCheck();
    
    // Run examples
    await example1_scoreWithVector();
    await example2_scoreText();
    await example3_validateContent();
    await example4_findNeighbors();
    
    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('\n❌ Error running examples:', error.message);
    console.error('Make sure the RBI Architecture Service is running:');
    console.error('  npm run dev');
    console.error(`  Service should be at: ${SERVICE_URL}`);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}

export {
  example1_scoreWithVector,
  example2_scoreText,
  example3_validateContent,
  example4_findNeighbors,
  example5_healthCheck,
  runAllExamples
};

