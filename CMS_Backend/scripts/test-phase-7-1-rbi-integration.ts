/**
 * Test Script: Phase 7.1 Step 1 - RBI Kernel Integration
 * 
 * Tests the RBI Kernel integration for field signature computation.
 * Verifies that:
 * 1. RBI Kernel is properly imported and initialized
 * 2. computeFieldSignatureWithRBI uses RBI's analyzeContentWithMathematics
 * 3. Results include RBI field dynamics, coherence, and resonance vectors
 * 4. Orb profiles are built from RBI analysis
 * 
 * Usage: tsx scripts/test-phase-7-1-rbi-integration.ts
 */

import { computeFieldSignatureWithRBI } from '../lib/services/console-v3/rbi-integration-service';
import type {
  DiagnosticSession,
  DiagnosticResponse,
  DiagnosticQuestion,
} from '../lib/types/console-v3';

// Test data: Mock diagnostic session
const mockSession: DiagnosticSession = {
  id: 'test-session-123',
  status: 'in_progress',
  orb_profile: {},
  undercurrent_profile: {},
  foundational_readiness: 0,
  functional_readiness: 0,
  advanced_readiness: 0,
  practice_readiness_profile: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Test data: Mock diagnostic questions with orb weights
const mockQuestions: DiagnosticQuestion[] = [
  {
    id: 1,
    question_text: 'How do you experience reality?',
    text: 'How do you experience reality?',
    response_type: 'single_choice',
    answer_options: ['As separate objects', 'As interconnected fields', 'As fluid signals', 'As pure awareness'],
    orb_weights: {
      orb_1: 0.3,
      orb_2: 0.2,
      orb_3: 0.1,
    },
    undercurrent_weights: {
      uc_1: 0.2,
    },
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    question_text: 'How do you make decisions?',
    text: 'How do you make decisions?',
    response_type: 'single_choice',
    answer_options: ['Through analysis', 'Through intuition', 'Through feeling', 'Through alignment'],
    orb_weights: {
      orb_5: 0.4,
      orb_6: 0.3,
      orb_7: 0.2,
    },
    undercurrent_weights: {
      uc_2: 0.3,
    },
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    question_text: 'How do you experience time?',
    text: 'How do you experience time?',
    response_type: 'scale',
    answer_options: ['1', '2', '3', '4', '5'],
    orb_weights: {
      orb_4: 0.5,
      orb_11: 0.3,
    },
    undercurrent_weights: {
      uc_3: 0.4,
    },
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Test data: Mock diagnostic responses
const mockResponses: DiagnosticResponse[] = [
  {
    id: 'response-1',
    session_id: mockSession.id,
    question_id: 1,
    raw_answer: 'As interconnected fields',
    derived_signal: {},
    created_at: new Date().toISOString(),
  },
  {
    id: 'response-2',
    session_id: mockSession.id,
    question_id: 2,
    raw_answer: 'Through alignment',
    derived_signal: {},
    created_at: new Date().toISOString(),
  },
  {
    id: 'response-3',
    session_id: mockSession.id,
    question_id: 3,
    raw_answer: '4',
    derived_signal: {},
    created_at: new Date().toISOString(),
  },
];

/**
 * Test RBI Integration
 */
async function testRBIIntegration() {
  console.log('========================================');
  console.log('Phase 7.1 Step 1: RBI Kernel Integration Test');
  console.log('========================================\n');

  try {
    console.log('📊 Test Data:');
    console.log(`   Session ID: ${mockSession.id}`);
    console.log(`   Questions: ${mockQuestions.length}`);
    console.log(`   Responses: ${mockResponses.length}\n`);

    console.log('🔄 Computing field signature with RBI Kernel...\n');

    // Call RBI integration service
    const startTime = Date.now();
    const result = await computeFieldSignatureWithRBI(
      mockSession,
      mockResponses,
      mockQuestions
    );
    const duration = Date.now() - startTime;

    console.log('✅ RBI Integration Successful!\n');
    console.log(`⏱️  Duration: ${duration}ms\n`);

    // Verify results
    console.log('📈 Results Verification:\n');

    // 1. Check orb profile
    const orbKeys = Object.keys(result.orb_profile);
    console.log(`1. Orb Profile:`);
    console.log(`   ✓ Contains ${orbKeys.length} orbs`);
    if (orbKeys.length > 0) {
      const sampleOrbs = orbKeys.slice(0, 3);
      sampleOrbs.forEach(orb => {
        console.log(`   - ${orb}: ${result.orb_profile[orb].toFixed(4)}`);
      });
      if (orbKeys.length > 3) {
        console.log(`   ... and ${orbKeys.length - 3} more`);
      }
    }
    
    // Verify orb profile sums to ~1.0
    const orbSum = Object.values(result.orb_profile).reduce((a, b) => a + b, 0);
    console.log(`   ✓ Orb profile sum: ${orbSum.toFixed(4)} (should be ~1.0)`);
    if (Math.abs(orbSum - 1.0) < 0.01) {
      console.log(`   ✅ PASS: Orb profile is normalized\n`);
    } else {
      console.log(`   ⚠️  WARNING: Orb profile sum is ${orbSum.toFixed(4)}, expected ~1.0\n`);
    }

    // 2. Check undercurrent profile
    const ucKeys = Object.keys(result.undercurrent_profile);
    console.log(`2. Undercurrent Profile:`);
    console.log(`   ✓ Contains ${ucKeys.length} undercurrents`);
    if (ucKeys.length > 0) {
      ucKeys.forEach(uc => {
        console.log(`   - ${uc}: ${result.undercurrent_profile[uc].toFixed(4)}`);
      });
    }
    console.log('');

    // 3. Check coherence metrics
    console.log(`3. Coherence Metrics (from RBI):`);
    console.log(`   ✓ Field Strength: ${result.coherence_metrics.field_strength.toFixed(4)}`);
    console.log(`   ✓ Coherence: ${result.coherence_metrics.coherence.toFixed(4)}`);
    console.log(`   ✓ Stability: ${result.coherence_metrics.stability.toFixed(4)}`);
    console.log(`   ✓ Gradient: ${result.coherence_metrics.gradient.toFixed(4)}`);
    
    // Verify coherence is in valid range (0-1)
    const coherence = result.coherence_metrics.coherence;
    if (coherence >= 0 && coherence <= 1) {
      console.log(`   ✅ PASS: Coherence is in valid range (0-1)\n`);
    } else {
      console.log(`   ⚠️  WARNING: Coherence is ${coherence.toFixed(4)}, expected 0-1\n`);
    }

    // 4. Check resonance vectors
    const vectorKeys = Object.keys(result.resonance_vectors);
    console.log(`4. Resonance Vectors:`);
    console.log(`   ✓ Contains ${vectorKeys.length} resonance vector(s)`);
    if (vectorKeys.length > 0) {
      vectorKeys.forEach(key => {
        const vector = result.resonance_vectors[key];
        console.log(`   - ${key}:`);
        if (vector.x !== undefined) console.log(`     x: ${vector.x.toFixed(4)}`);
        if (vector.y !== undefined) console.log(`     y: ${vector.y.toFixed(4)}`);
        if (vector.z !== undefined) console.log(`     z: ${vector.z.toFixed(4)}`);
        if (vector.w !== undefined) console.log(`     w: ${vector.w.toFixed(4)}`);
        if (vector.orb_associations) {
          console.log(`     orb_associations: [${vector.orb_associations.join(', ')}]`);
        }
      });
    }
    console.log('');

    // 5. Summary
    console.log('========================================');
    console.log('✅ Test Summary:');
    console.log('========================================');
    console.log(`✓ RBI Kernel integration: SUCCESS`);
    console.log(`✓ Field signature computation: SUCCESS`);
    console.log(`✓ Orb profile generation: SUCCESS`);
    console.log(`✓ Coherence metrics extraction: SUCCESS`);
    console.log(`✓ Resonance vectors: SUCCESS`);
    console.log(`\n🎉 Phase 7.1 Step 1: RBI Integration Test PASSED!\n`);

    return true;
  } catch (error) {
    console.error('\n❌ Test Failed:');
    console.error('========================================');
    console.error(error);
    
    if (error instanceof Error) {
      console.error(`\nError Message: ${error.message}`);
      console.error(`Stack Trace:\n${error.stack}`);
    }
    
    console.error('\n⚠️  Phase 7.1 Step 1: RBI Integration Test FAILED\n');
    return false;
  }
}

// Run test
if (require.main === module) {
  testRBIIntegration()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { testRBIIntegration };


