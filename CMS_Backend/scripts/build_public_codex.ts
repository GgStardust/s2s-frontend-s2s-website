#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { buildPublicCodex } from '../lib/md_indexer';

async function main() {
  console.log('Building public codex...');
  
  try {
    const codex = buildPublicCodex();
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write the public codex JSON
    const outputPath = path.join(dataDir, 'public_codex.json');
    fs.writeFileSync(outputPath, JSON.stringify(codex, null, 2));
    
    console.log(`✅ Public codex built successfully!`);
    console.log(`📊 Stats:`);
    console.log(`   - Orbs: ${codex.orbs.length}`);
    console.log(`   - Modules: ${codex.modules.length}`);
    console.log(`   - Scrollstream phrases: ${codex.scrollstream.length}`);
    console.log(`📁 Output: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error building public codex:', error);
    process.exit(1);
  }
}

main();
