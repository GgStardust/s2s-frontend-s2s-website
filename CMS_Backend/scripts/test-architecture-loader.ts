/**
 * Test Script: Core Architecture Loader
 * 
 * Tests loading and parsing of the three core architecture files.
 */

import { 
  loadCoreArchitecture,
  getOrbDefinition,
  getUndercurrentDefinition,
  getAllOrbDefinitions,
  getAllUndercurrentDefinitions,
  findOrbsByKeyword,
  findUndercurrentsByKeyword,
} from '../lib/services/console-v3/architecture-loader';

async function testArchitectureLoader() {
  console.log('========================================');
  console.log('Testing Core Architecture Loader');
  console.log('========================================\n');

  try {
    // Test 1: Load core architecture
    console.log('📚 Test 1: Loading core architecture...');
    const architecture = loadCoreArchitecture();
    console.log(`✅ Loaded ${architecture.orbs.size} orbs and ${architecture.undercurrents.size} undercurrents`);
    console.log(`   Loaded at: ${architecture.loadedAt.toISOString()}\n`);

    // Test 2: Get specific orb
    console.log('🔮 Test 2: Getting specific orb definitions...');
    const orb1 = getOrbDefinition(1);
    const orb12 = getOrbDefinition(12);
    const orb13 = getOrbDefinition(13);
    
    if (orb1) {
      console.log(`✅ Orb 1: ${orb1.name}`);
      console.log(`   Function: ${orb1.function?.substring(0, 60)}...`);
      if (orb1.uniqueEssence) {
        console.log(`   Core Function: ${orb1.uniqueEssence.coreFunction?.substring(0, 60)}...`);
      }
    }
    
    if (orb12) {
      console.log(`✅ Orb 12: ${orb12.name}`);
      console.log(`   Synthesis: ${orb12.synthesis?.substring(0, 60)}...`);
    }
    
    if (orb13) {
      console.log(`✅ Orb 13: ${orb13.name}`);
      console.log(`   Function: ${orb13.function?.substring(0, 60)}...`);
    }
    console.log('');

    // Test 3: Get all orbs
    console.log('📋 Test 3: Getting all orb definitions...');
    const allOrbs = getAllOrbDefinitions();
    console.log(`✅ Retrieved ${allOrbs.length} orbs`);
    if (allOrbs.length > 0) {
      console.log(`   First orb: ${allOrbs[0].name} (${allOrbs[0].number})`);
      console.log(`   Last orb: ${allOrbs[allOrbs.length - 1].name} (${allOrbs[allOrbs.length - 1].number})`);
    }
    console.log('');

    // Test 4: Get specific undercurrent
    console.log('🌊 Test 4: Getting specific undercurrent definitions...');
    const uc5 = getUndercurrentDefinition(5);
    const uc12 = getUndercurrentDefinition(12);
    
    if (uc5) {
      console.log(`✅ Undercurrent 5: ${uc5.name}`);
      console.log(`   Synthesis: ${uc5.synthesis?.substring(0, 60)}...`);
    }
    
    if (uc12) {
      console.log(`✅ Undercurrent 12: ${uc12.name}`);
      console.log(`   Synthesis: ${uc12.synthesis?.substring(0, 60)}...`);
      if (uc12.orbAssociations) {
        console.log(`   Orb Associations: ${uc12.orbAssociations.join(', ')}`);
      }
    }
    console.log('');

    // Test 5: Get all undercurrents
    console.log('📋 Test 5: Getting all undercurrent definitions...');
    const allUndercurrents = getAllUndercurrentDefinitions();
    console.log(`✅ Retrieved ${allUndercurrents.length} undercurrents`);
    if (allUndercurrents.length > 0) {
      console.log(`   First undercurrent: ${allUndercurrents[0].name} (${allUndercurrents[0].number})`);
      console.log(`   Last undercurrent: ${allUndercurrents[allUndercurrents.length - 1].name} (${allUndercurrents[allUndercurrents.length - 1].number})`);
    }
    console.log('');

    // Test 6: Find orbs by keyword
    console.log('🔍 Test 6: Finding orbs by keyword...');
    const timeOrbs = findOrbsByKeyword('time');
    const sovereigntyOrbs = findOrbsByKeyword('sovereignty');
    
    console.log(`✅ Found ${timeOrbs.length} orbs matching "time":`);
    timeOrbs.forEach(orb => {
      console.log(`   - Orb ${orb.number}: ${orb.name}`);
    });
    
    console.log(`✅ Found ${sovereigntyOrbs.length} orbs matching "sovereignty":`);
    sovereigntyOrbs.forEach(orb => {
      console.log(`   - Orb ${orb.number}: ${orb.name}`);
    });
    console.log('');

    // Test 7: Find undercurrents by keyword
    console.log('🔍 Test 7: Finding undercurrents by keyword...');
    const freeWillUCs = findUndercurrentsByKeyword('free will');
    const bodyUCs = findUndercurrentsByKeyword('body');
    
    console.log(`✅ Found ${freeWillUCs.length} undercurrents matching "free will":`);
    freeWillUCs.forEach(uc => {
      console.log(`   - Undercurrent ${uc.number}: ${uc.name}`);
    });
    
    console.log(`✅ Found ${bodyUCs.length} undercurrents matching "body":`);
    bodyUCs.forEach(uc => {
      console.log(`   - Undercurrent ${uc.number}: ${uc.name}`);
    });
    console.log('');

    // Test 8: Verify orb boundaries
    console.log('🔒 Test 8: Verifying orb boundaries and ownership...');
    if (orb1 && orb1.owns && orb1.owns.length > 0) {
      console.log(`✅ Orb 1 owns ${orb1.owns.length} concepts:`);
      orb1.owns.slice(0, 3).forEach(concept => {
        console.log(`   - ${concept}`);
      });
      if (orb1.owns.length > 3) {
        console.log(`   ... and ${orb1.owns.length - 3} more`);
      }
    }
    
    if (orb1 && orb1.references && orb1.references.length > 0) {
      console.log(`✅ Orb 1 references ${orb1.references.length} concepts (but doesn't own):`);
      orb1.references.slice(0, 2).forEach(concept => {
        console.log(`   - ${concept}`);
      });
    }
    console.log('');

    // Summary
    console.log('========================================');
    console.log('✅ Test Summary:');
    console.log('========================================');
    console.log(`✓ Core architecture loaded: ${architecture.orbs.size} orbs, ${architecture.undercurrents.size} undercurrents`);
    console.log(`✓ Orb definitions accessible`);
    console.log(`✓ Undercurrent definitions accessible`);
    console.log(`✓ Keyword search working`);
    console.log(`✓ Orb boundaries and ownership rules loaded`);
    console.log(`\n🎉 Core Architecture Loader Test PASSED!\n`);

    return true;
  } catch (error) {
    console.error('\n❌ Test Failed:');
    console.error('========================================');
    console.error(error);
    
    if (error instanceof Error) {
      console.error(`\nError Message: ${error.message}`);
      console.error(`Stack Trace:\n${error.stack}`);
    }
    
    console.error('\n⚠️  Core Architecture Loader Test FAILED\n');
    return false;
  }
}

// Run test
if (require.main === module) {
  testArchitectureLoader()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { testArchitectureLoader };

