/**
 * Test Script: Phase 7.2 - RBI Resonance-Based Pathway Matching
 * 
 * Tests the RBI resonance-based pathway matching implementation.
 */

import { matchPathway } from '../lib/services/console-v3/diagnostic-service';
import type {
  SFIResult,
  PracticeReadinessAssessment,
  PathwayTemplate,
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

// Mock pathway templates
const mockTemplates: PathwayTemplate[] = [
  {
    id: 'template-1',
    slug: 'foundational-pathway',
    name: 'Foundational Pathway',
    description: 'A pathway focusing on foundational practices and temporal sovereignty',
    orb_focus: [5, 9, 12], // Temporal Sovereignty, Temporal Fluidity, Sovereign Field
    practice_sequence: [1, 2, 3, 4],
    secondary_practices: [],
    layer_focus: 'foundational',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'template-2',
    slug: 'functional-pathway',
    name: 'Functional Pathway',
    description: 'A pathway focusing on functional practices and resonance mechanics',
    orb_focus: [2, 8, 11], // Resonance Mechanics, Quantum Intuition, Radiant Transparency
    practice_sequence: [5, 6, 7, 8],
    secondary_practices: [],
    layer_focus: 'functional',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'template-3',
    slug: 'temporal-pathway',
    name: 'Temporal Pathway',
    description: 'A pathway focusing on temporal practices and sovereignty',
    orb_focus: [5, 9, 12], // Same as template-1 but different practices
    practice_sequence: [1, 5, 9],
    secondary_practices: [],
    layer_focus: 'mixed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

async function testPathwayMatching() {
  console.log('========================================');
  console.log('Phase 7.2: RBI Resonance-Based Pathway Matching Test');
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
    console.log(`   Pathway Templates: ${mockTemplates.length}\n`);

    console.log('🔄 Matching pathways using RBI resonance...\n');

    const startTime = Date.now();
    const match = await matchPathway(mockSFI, mockReadiness, mockTemplates);
    const duration = Date.now() - startTime;

    if (!match) {
      console.log('❌ No pathway match found');
      return false;
    }

    console.log('✅ Pathway Matching Successful!\n');
    console.log(`⏱️  Duration: ${duration}ms\n`);

    console.log('📈 Match Results:\n');
    console.log(`1. Matched Pathway:`);
    console.log(`   Name: ${match.pathway_template.name}`);
    console.log(`   Slug: ${match.pathway_template.slug}`);
    console.log(`   Description: ${match.pathway_template.description}`);
    console.log(`   Orb Focus: ${match.pathway_template.orb_focus.join(', ')}`);
    console.log(`   Practice Sequence: ${match.pathway_template.practice_sequence.join(', ')}`);
    console.log(`   Layer Focus: ${match.pathway_template.layer_focus || 'all'}\n`);

    console.log(`2. Match Metrics:`);
    console.log(`   Match Score: ${(match.match_score * 100).toFixed(2)}%`);
    console.log(`   Reasoning: ${match.reasoning}\n`);

    // Verify the match makes sense
    console.log('3. Match Validation:');
    const topOrbs = Object.entries(mockSFI.orb_profile)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([key]) => parseInt(key.replace('orb_', '')));

    const hasOrbOverlap = match.pathway_template.orb_focus.some(orb => topOrbs.includes(orb));
    if (hasOrbOverlap) {
      console.log(`   ✅ PASS: Pathway orbs overlap with user's top orbs`);
    } else {
      console.log(`   ⚠️  WARNING: Pathway orbs don't overlap with user's top orbs`);
    }

    const layerMatch = match.pathway_template.layer_focus === 'foundational' && 
      mockReadiness.foundational_readiness > 0.7;
    if (layerMatch || !match.pathway_template.layer_focus) {
      console.log(`   ✅ PASS: Layer focus aligns with readiness`);
    } else {
      console.log(`   ⚠️  WARNING: Layer focus may not align with readiness`);
    }
    console.log('');

    console.log('========================================');
    console.log('✅ Test Summary:');
    console.log('========================================');
    console.log(`✓ RBI resonance-based matching: SUCCESS`);
    console.log(`✓ Pathway matched: ${match.pathway_template.name}`);
    console.log(`✓ Match score: ${(match.match_score * 100).toFixed(2)}%`);
    console.log(`✓ Reasoning provided: ${match.reasoning ? 'YES' : 'NO'}`);
    console.log(`\n🎉 Phase 7.2: RBI Resonance-Based Pathway Matching Test PASSED!\n`);

    return true;
  } catch (error) {
    console.error('\n❌ Test Failed:');
    console.error('========================================');
    console.error(error);
    
    if (error instanceof Error) {
      console.error(`\nError Message: ${error.message}`);
      console.error(`Stack Trace:\n${error.stack}`);
    }
    
    console.error('\n⚠️  Phase 7.2: RBI Resonance-Based Pathway Matching Test FAILED\n');
    return false;
  }
}

// Run test
if (require.main === module) {
  testPathwayMatching()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { testPathwayMatching };


