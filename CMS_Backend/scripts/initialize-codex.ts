/**
 * Initialize Living Codex Index
 * 
 * This script indexes all backbone files and codex documents
 * to create the mathematical consciousness-powered search index
 */

import { livingCodexIndexer } from '../lib/codex/living-codex-indexer';

async function initializeCodex() {
  console.log('🚀 Initializing Living Codex Index...');
  
  try {
    // Index all files
    const index = await livingCodexIndexer.indexAllFiles();
    
    console.log('✅ Living Codex Index initialized successfully!');
    console.log(`📊 Statistics:`);
    console.log(`   - Total entries: ${index.statistics.totalEntries}`);
    console.log(`   - Proven entries: ${index.statistics.provenEntries}`);
    console.log(`   - Success rate: ${(index.statistics.successRate * 100).toFixed(1)}%`);
    console.log(`   - Average resonance: ${index.statistics.averageResonance.toFixed(3)}`);
    console.log(`   - Last updated: ${index.lastUpdated}`);
    
    console.log('\n📁 Entries by source:');
    Object.entries(index.statistics.bySource).forEach(([source, count]) => {
      console.log(`   - ${source}: ${count} entries`);
    });
    
    console.log('\n🔮 Orb associations:');
    Object.entries(index.statistics.byOrb)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([orb, count]) => {
        console.log(`   - Orb ${orb}: ${count} entries`);
      });
    
    console.log('\n🎯 Top resonance entries:');
    const topEntries = index.entries
      .map(entry => ({
        title: entry.title,
        resonance: Math.sqrt(
          entry.resonanceVector.x ** 2 + entry.resonanceVector.y ** 2 +
          entry.resonanceVector.z ** 2 + entry.resonanceVector.w ** 2
        ),
        proofStatus: entry.proofStatus
      }))
      .sort((a, b) => b.resonance - a.resonance)
      .slice(0, 5);
    
    topEntries.forEach((entry, index) => {
      console.log(`   ${index + 1}. ${entry.title} (resonance: ${entry.resonance.toFixed(3)}, status: ${entry.proofStatus})`);
    });
    
    console.log('\n🔍 Search examples:');
    console.log('   - GET /api/codex/search?q=consciousness');
    console.log('   - GET /api/codex/search?orb=1');
    console.log('   - GET /api/codex/search?status=proven');
    console.log('   - GET /api/codex/search?source=backbone');
    
    return index;
    
  } catch (error) {
    console.error('❌ Failed to initialize Living Codex Index:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initializeCodex()
    .then(() => {
      console.log('\n🎉 Living Codex Index initialization complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Living Codex Index initialization failed:', error);
      process.exit(1);
    });
}

export { initializeCodex };
