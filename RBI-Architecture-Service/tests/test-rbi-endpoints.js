/**
 * RBI Endpoint Test Script
 * 
 * Tests RBI API endpoints to verify runtime functionality
 * Run this after starting the dev server: npm run dev
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testRbiScore() {
  console.log('\n🧪 Testing /api/rbi/score endpoint...\n');
  
  try {
    // Test 1: Simple vector scoring
    const test1 = await fetch(`${BASE_URL}/api/rbi/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vector: [0.5, 0.6, 0.7, 0.8]
      })
    });
    
    const result1 = await test1.json();
    console.log('✅ Test 1 - Simple vector:', JSON.stringify(result1, null, 2));
    
    // Test 2: Vector with candidates
    const test2 = await fetch(`${BASE_URL}/api/rbi/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vector: [0.5, 0.6, 0.7, 0.8],
        candidates: [
          { id: '1', vector: [0.4, 0.5, 0.6, 0.7] },
          { id: '2', vector: [0.6, 0.7, 0.8, 0.9] },
          { id: '3', text: 'This is a test text for resonance analysis' }
        ]
      })
    });
    
    const result2 = await test2.json();
    console.log('\n✅ Test 2 - Vector with candidates:', JSON.stringify(result2, null, 2));
    
    // Verify response structure
    if (result2.scores && Array.isArray(result2.scores)) {
      console.log('\n✅ Response structure valid:');
      console.log(`   - Scores array length: ${result2.scores.length}`);
      console.log(`   - First score: ${result2.scores[0]?.score}`);
      console.log(`   - Timestamp: ${result2.timestamp}`);
    }
    
    return { success: true, results: [result1, result2] };
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testRbiNeighbors() {
  console.log('\n🧪 Testing /api/rbi/neighbors endpoint...\n');
  
  try {
    const test = await fetch(`${BASE_URL}/api/rbi/neighbors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: {
          text: 'Resonance-based intelligence and field coherence analysis'
        },
        candidates: [
          { id: '1', name: 'Orb 1', text: 'Mathematical foundations of consciousness' },
          { id: '2', name: 'Orb 2', text: 'Field dynamics and resonance patterns' },
          { id: '3', name: 'Orb 3', text: 'Coherence verification and proof systems' },
          { id: '4', name: 'Orb 4', text: 'Temporal continuity in information systems' },
          { id: '5', name: 'Orb 5', text: 'Sovereign logic and type theory' }
        ],
        topN: 3
      })
    });
    
    const result = await test.json();
    console.log('✅ Neighbors test result:', JSON.stringify(result, null, 2));
    
    // Verify response structure
    if (result.neighbors && Array.isArray(result.neighbors)) {
      console.log('\n✅ Response structure valid:');
      console.log(`   - Neighbors array length: ${result.neighbors.length}`);
      console.log(`   - Top neighbor: ${result.neighbors[0]?.id} (score: ${result.neighbors[0]?.score})`);
      console.log(`   - Query vector:`, result.queryVector);
      console.log(`   - Total candidates: ${result.totalCandidates}`);
    }
    
    return { success: true, result };
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting RBI Endpoint Runtime Tests');
  console.log(`📍 Base URL: ${BASE_URL}\n`);
  
  const scoreResults = await testRbiScore();
  const neighborsResults = await testRbiNeighbors();
  
  console.log('\n📊 Test Summary:');
  console.log(`   - Score endpoint: ${scoreResults.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   - Neighbors endpoint: ${neighborsResults.success ? '✅ PASS' : '❌ FAIL'}`);
  
  if (scoreResults.success && neighborsResults.success) {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed');
    process.exit(1);
  }
}

runTests();

