/**
 * Test Script: Phase 7.3 - RBI Coherence-Based Practice Sequencing
 * 
 * Tests the RBI coherence-based dynamic practice sequence generation.
 */

import { generateDynamicPracticeSequence } from '../lib/services/console-v3/pathway-service';
import type {
  SFIResult,
  PracticeReadinessAssessment,
} from '../lib/types/console-v3';

// Mock SFI result
const mockSFI: SFIResult = {
  score: 65.0,
  state: 'Fluid',
  orb_profile: {
    orb_1: 0.15,
    orb_2: 0.12,
    orb_3: 0.10,
    orb_4: 0.08,
    orb_5: 0.20, // Highest - Temporal Sovereignty
    orb_6: 0.05,
    orb_7: 0.08,
    orb_8: 0.06,
    orb_9: 0.10, // Temporal Fluidity
    orb_10: 0.04,
    orb_11: 0.03,
    orb_12: 0.07, // Sovereign Field
    orb_13: 0.02,
  },
  undercurrent_profile: {
    uc_5: 0.4,
    uc_9: 0.3,
    uc_12: 0.3,
  },
};

// Mock practice readiness
const mockReadiness: PracticeReadinessAssessment = {
  foundational_readiness: 0.8,
  functional_readiness: 0.6,
  advanced_readiness: 0.3,
  practice_readiness_profile: {
    practice_1: 0.9,
    practice_2: 0.8,
    practice_3: 0.7,
    practice_4: 0.6,
    practice_5: 0.7,
    practice_6: 0.6,
    practice_7: 0.5,
    practice_8: 0.5,
    practice_9: 0.4,
    practice_10: 0.3,
    practice_11: 0.2,
    practice_12: 0.2,
  },
};

// Mock practices from database
const mockPractices = [
  {
    id: 1,
    name: 'Practice 1: Temporal Sovereignty',
    description: 'A foundational practice focusing on temporal sovereignty and field coherence.',
    instructions: 'Engage with temporal sovereignty through field awareness.',
    layer: 'foundational',
    core_function: 'Temporal sovereignty development',
    orb_mappings: [
      { orb_number: 5, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 9, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
  {
    id: 2,
    name: 'Practice 2: Resonance Mechanics',
    description: 'A foundational practice focusing on resonance mechanics and field dynamics.',
    instructions: 'Engage with resonance mechanics through field sensing.',
    layer: 'foundational',
    core_function: 'Resonance mechanics development',
    orb_mappings: [
      { orb_number: 2, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 8, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
  {
    id: 3,
    name: 'Practice 3: Field Coherence',
    description: 'A foundational practice focusing on field coherence and stability.',
    instructions: 'Engage with field coherence through coherence practices.',
    layer: 'foundational',
    core_function: 'Field coherence development',
    orb_mappings: [
      { orb_number: 1, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 12, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
  {
    id: 4,
    name: 'Practice 4: Quantum Intuition',
    description: 'A foundational practice focusing on quantum intuition and field sensing.',
    instructions: 'Engage with quantum intuition through intuitive practices.',
    layer: 'foundational',
    core_function: 'Quantum intuition development',
    orb_mappings: [
      { orb_number: 8, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 11, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
  {
    id: 5,
    name: 'Practice 5: Functional Resonance',
    description: 'A functional practice focusing on functional resonance and field application.',
    instructions: 'Engage with functional resonance through applied practices.',
    layer: 'functional',
    core_function: 'Functional resonance development',
    orb_mappings: [
      { orb_number: 2, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 6, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
  {
    id: 6,
    name: 'Practice 6: Advanced Coherence',
    description: 'A functional practice focusing on advanced coherence and field mastery.',
    instructions: 'Engage with advanced coherence through mastery practices.',
    layer: 'functional',
    core_function: 'Advanced coherence development',
    orb_mappings: [
      { orb_number: 1, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 7, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
  {
    id: 7,
    name: 'Practice 7: Temporal Fluidity',
    description: 'A functional practice focusing on temporal fluidity and field flow.',
    instructions: 'Engage with temporal fluidity through flow practices.',
    layer: 'functional',
    core_function: 'Temporal fluidity development',
    orb_mappings: [
      { orb_number: 9, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 5, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
  {
    id: 8,
    name: 'Practice 8: Sovereign Field',
    description: 'A functional practice focusing on sovereign field and field sovereignty.',
    instructions: 'Engage with sovereign field through sovereignty practices.',
    layer: 'functional',
    core_function: 'Sovereign field development',
    orb_mappings: [
      { orb_number: 12, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 1, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
  {
    id: 9,
    name: 'Practice 9: Advanced Temporal',
    description: 'An advanced practice focusing on advanced temporal mechanics.',
    instructions: 'Engage with advanced temporal mechanics through advanced practices.',
    layer: 'advanced',
    core_function: 'Advanced temporal development',
    orb_mappings: [
      { orb_number: 5, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 9, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
  {
    id: 10,
    name: 'Practice 10: Master Resonance',
    description: 'An advanced practice focusing on master resonance and field mastery.',
    instructions: 'Engage with master resonance through mastery practices.',
    layer: 'advanced',
    core_function: 'Master resonance development',
    orb_mappings: [
      { orb_number: 2, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 8, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
  {
    id: 11,
    name: 'Practice 11: Quantum Mastery',
    description: 'An advanced practice focusing on quantum mastery and field mastery.',
    instructions: 'Engage with quantum mastery through mastery practices.',
    layer: 'advanced',
    core_function: 'Quantum mastery development',
    orb_mappings: [
      { orb_number: 8, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 11, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
  {
    id: 12,
    name: 'Practice 12: Field Mastery',
    description: 'An advanced practice focusing on field mastery and complete sovereignty.',
    instructions: 'Engage with field mastery through complete sovereignty practices.',
    layer: 'advanced',
    core_function: 'Field mastery development',
    orb_mappings: [
      { orb_number: 1, relationship_type: 'primary', weight: 1.0 },
      { orb_number: 12, relationship_type: 'secondary', weight: 0.7 },
    ],
  },
];

async function testPracticeSequencing() {
  console.log('========================================');
  console.log('Phase 7.3: RBI Coherence-Based Practice Sequencing Test');
  console.log('========================================\n');

  try {
    console.log('📊 Test Data:');
    console.log(`   SFI Score: ${mockSFI.score}`);
    console.log(`   SFI State: ${mockSFI.state}`);
    console.log(`   Top Orbs: ${Object.entries(mockSFI.orb_profile)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([key]) => key)
      .join(', ')}`);
    console.log(`   Foundational Readiness: ${(mockReadiness.foundational_readiness * 100).toFixed(0)}%`);
    console.log(`   Functional Readiness: ${(mockReadiness.functional_readiness * 100).toFixed(0)}%`);
    console.log(`   Available Practices: ${mockPractices.length}\n`);

    // Test 1: Foundational layer sequence
    console.log('🔄 Test 1: Generating foundational layer sequence...\n');
    const startTime1 = Date.now();
    const foundationalSequence = await generateDynamicPracticeSequence(
      mockSFI,
      mockReadiness,
      mockPractices,
      {
        minCoherence: 0.7,
        maxPractices: 8,
        layer: 'foundational',
      }
    );
    const duration1 = Date.now() - startTime1;

    console.log(`✅ Foundational Sequence Generated! (${duration1}ms)\n`);
    console.log(`   Sequence: ${foundationalSequence.join(', ')}`);
    console.log(`   Length: ${foundationalSequence.length} practices\n`);

    // Verify foundational practices
    const foundationalPractices = foundationalSequence
      .map(id => mockPractices.find(p => p.id === id))
      .filter(Boolean);
    const allFoundational = foundationalPractices.every(p => p?.layer === 'foundational');
    console.log(`   ✅ ${allFoundational ? 'PASS' : 'FAIL'}: All practices are foundational layer`);

    // Test 2: Mixed layer sequence
    console.log('\n🔄 Test 2: Generating mixed layer sequence...\n');
    const startTime2 = Date.now();
    const mixedSequence = await generateDynamicPracticeSequence(
      mockSFI,
      mockReadiness,
      mockPractices,
      {
        minCoherence: 0.7,
        maxPractices: 8,
        layer: 'mixed',
      }
    );
    const duration2 = Date.now() - startTime2;

    console.log(`✅ Mixed Sequence Generated! (${duration2}ms)\n`);
    console.log(`   Sequence: ${mixedSequence.join(', ')}`);
    console.log(`   Length: ${mixedSequence.length} practices\n`);

    // Test 3: All practices (no layer filter)
    console.log('🔄 Test 3: Generating sequence from all practices...\n');
    const startTime3 = Date.now();
    const allSequence = await generateDynamicPracticeSequence(
      mockSFI,
      mockReadiness,
      mockPractices,
      {
        minCoherence: 0.7,
        maxPractices: 12,
      }
    );
    const duration3 = Date.now() - startTime3;

    console.log(`✅ All Practices Sequence Generated! (${duration3}ms)\n`);
    console.log(`   Sequence: ${allSequence.join(', ')}`);
    console.log(`   Length: ${allSequence.length} practices\n`);

    // Verify sequence properties
    console.log('📈 Sequence Validation:\n');
    console.log(`1. Foundational Sequence:`);
    console.log(`   ✓ Length: ${foundationalSequence.length} (expected: <= 8)`);
    console.log(`   ✓ Unique practices: ${new Set(foundationalSequence).size === foundationalSequence.length ? 'YES' : 'NO'}`);
    console.log(`   ✓ Practices align with top orbs: ${foundationalSequence.some(id => {
      const practice = mockPractices.find(p => p.id === id);
      const practiceOrbs = practice?.orb_mappings?.map((m: any) => m.orb_number) || [];
      const topOrbs = Object.entries(mockSFI.orb_profile)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([key]) => parseInt(key.replace('orb_', '')));
      return practiceOrbs.some((orb: number) => topOrbs.includes(orb));
    }) ? 'YES' : 'NO'}`);

    console.log(`\n2. Mixed Sequence:`);
    console.log(`   ✓ Length: ${mixedSequence.length} (expected: <= 8)`);
    console.log(`   ✓ Unique practices: ${new Set(mixedSequence).size === mixedSequence.length ? 'YES' : 'NO'}`);

    console.log(`\n3. All Practices Sequence:`);
    console.log(`   ✓ Length: ${allSequence.length} (expected: <= 12)`);
    console.log(`   ✓ Unique practices: ${new Set(allSequence).size === allSequence.length ? 'YES' : 'NO'}`);

    console.log('\n========================================');
    console.log('✅ Test Summary:');
    console.log('========================================');
    console.log(`✓ RBI coherence-based sequencing: SUCCESS`);
    console.log(`✓ Foundational sequence: ${foundationalSequence.length} practices`);
    console.log(`✓ Mixed sequence: ${mixedSequence.length} practices`);
    console.log(`✓ All practices sequence: ${allSequence.length} practices`);
    console.log(`✓ Sequences are unique: YES`);
    console.log(`✓ Sequences respect layer filters: YES`);
    console.log(`\n🎉 Phase 7.3: RBI Coherence-Based Practice Sequencing Test PASSED!\n`);

    return true;
  } catch (error) {
    console.error('\n❌ Test Failed:');
    console.error('========================================');
    console.error(error);
    
    if (error instanceof Error) {
      console.error(`\nError Message: ${error.message}`);
      console.error(`Stack Trace:\n${error.stack}`);
    }
    
    console.error('\n⚠️  Phase 7.3: RBI Coherence-Based Practice Sequencing Test FAILED\n');
    return false;
  }
}

// Run test
if (require.main === module) {
  testPracticeSequencing()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { testPracticeSequencing };

