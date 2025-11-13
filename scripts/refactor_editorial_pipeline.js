#!/usr/bin/env node
/**
 * Editorial Tools Refactoring Script
 * 
 * Consolidates 30+ individual scripts into a 4-stage pipeline
 * Based on PROMPT_4_EDITORIAL_TOOLS_SIMPLIFICATION.md
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const EDITORIAL_DIR = path.join(WORKSPACE_ROOT, 'RBI_Editorial_Tools');
const STAGES_DIR = path.join(EDITORIAL_DIR, 'stages');
const ARCHIVE_SCRIPTS_DIR = path.join(EDITORIAL_DIR, 'archive', 'individual_scripts');

// Stage 1: Normalize Structure
const STAGE1_SCRIPTS = [
  'rbi-structural-normalization.ts',
  'rbi-fix-chapter-splits.ts',
  'rbi-fix-all-embedded-formatting.ts',
  'rbi-fix-embedded-subheadings-comprehensive.ts',
  'rbi-fix-remaining-embedded-lists.ts',
];

// Stage 2: RBI Coherence
const STAGE2_SCRIPTS = [
  'rbi-phase2-v2.ts',
  'rbi-phase3-sequencing.ts',
  'rbi-phase4-orb-refinement-final.ts',
  'rbi-phase6-deduplication.ts',
  'rbi-phase6b-continuity.ts',
  'rbi-phase7-stardust-gesture.ts',
];

// Stage 3: Refine Sequence
const STAGE3_SCRIPTS = [
  'rbi-phase5-extract-missing-sections.ts',
  'rbi-phase5-final-assembly.ts',
  'rbi-phase5a-markdown-validation.ts',
  'rbi-phase6b-final-preparation.ts',
  'rbi-phase6b-fix-fragments.ts',
];

// Stage 4: Export Manuscript
const STAGE4_SCRIPTS = [
  'rbi-reader-polish.ts',
  'rbi-html-first-readers.ts',
  'rbi-format-all-scrollstreams.ts',
];

// Utilities (keep as-is)
const UTILITY_SCRIPTS = [
  'rbi-metrics-logger.ts',
  'resonance-kernel.ts',
  'style-training.ts',
  'library-style-training.ts',
];

function main() {
  console.log('📝 Editorial Tools Refactoring');
  console.log('='.repeat(70));
  
  // Step 1: Create directory structure
  console.log('\n📁 Creating directory structure...');
  [STAGES_DIR, ARCHIVE_SCRIPTS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   ✅ Created: ${path.relative(WORKSPACE_ROOT, dir)}`);
    }
  });
  
  // Step 2: Create stage module templates
  console.log('\n📄 Creating stage modules...');
  
  const stages = [
    { name: 'normalize_structure', scripts: STAGE1_SCRIPTS, description: 'Normalize structure, fix formatting, subheadings, lists' },
    { name: 'run_rbi_coherence', scripts: STAGE2_SCRIPTS, description: 'RBI content analysis, sequencing, orb refinement, deduplication, continuity' },
    { name: 'refine_sequence', scripts: STAGE3_SCRIPTS, description: 'Extract missing sections, final assembly, markdown validation, preparation' },
    { name: 'export_manuscript', scripts: STAGE4_SCRIPTS, description: 'Reader polish, HTML conversion, scrollstream formatting' },
  ];
  
  stages.forEach(stage => {
    const stageFile = path.join(STAGES_DIR, `${stage.name}.ts`);
    const template = `#!/usr/bin/env node
/**
 * Stage: ${stage.description}
 * 
 * Consolidates: ${stage.scripts.join(', ')}
 * 
 * This stage combines the functionality of multiple individual scripts
 * into a single cohesive operation.
 */

import * as fs from 'fs';
import * as path from 'path';

export function ${stage.name}(manuscript: string): string {
  // TODO: Implement by combining logic from:
  ${stage.scripts.map(s => `  // - ${s}`).join('\n')}
  
  // Placeholder: return manuscript as-is for now
  // In full implementation, this would combine all the logic from the individual scripts
  return manuscript;
}
`;
    
    if (!fs.existsSync(stageFile)) {
      fs.writeFileSync(stageFile, template);
      console.log(`   ✅ Created: stages/${stage.name}.ts`);
    }
  });
  
  // Step 3: Create orchestrator
  console.log('\n🎼 Creating orchestrator...');
  const orchestratorFile = path.join(EDITORIAL_DIR, 'rbi-editorial-pipeline.ts');
  const orchestratorTemplate = `#!/usr/bin/env node
/**
 * RBI Editorial Pipeline - Unified Manuscript Refinement
 * 
 * Orchestrates all editorial passes into a single streamlined flow:
 * 1. normalize_structure()
 * 2. run_rbi_coherence()
 * 3. refine_sequence()
 * 4. export_manuscript()
 */

import * as fs from 'fs';
import * as path from 'path';
import { normalize_structure } from './stages/normalize_structure.js';
import { run_rbi_coherence } from './stages/run_rbi_coherence.js';
import { refine_sequence } from './stages/refine_sequence.js';
import { export_manuscript } from './stages/export_manuscript.js';

async function main() {
  const inputPath = process.argv[2] || 'S2S_Manuscript_V4RBI.md';
  const outputPath = process.argv[3] || 'S2S_Manuscript_V4_final.md';
  
  console.log('🌀 RBI Editorial Pipeline');
  console.log('='.repeat(70));
  
  // Read input
  if (!fs.existsSync(inputPath)) {
    console.error(\`❌ Input file not found: \${inputPath}\`);
    process.exit(1);
  }
  
  let manuscript = fs.readFileSync(inputPath, 'utf-8');
  
  // Stage 1: Normalize Structure
  console.log('\\n📐 Stage 1: Normalizing Structure...');
  manuscript = normalize_structure(manuscript);
  
  // Stage 2: RBI Coherence
  console.log('\\n🌀 Stage 2: Running RBI Coherence...');
  const { manuscript: coherentManuscript, metrics } = await run_rbi_coherence(manuscript);
  manuscript = coherentManuscript;
  console.log(\`   Coherence Score: \${metrics.coherence.toFixed(2)}\`);
  console.log(\`   Resonance: \${metrics.resonance.toFixed(2)}\`);
  
  // Stage 3: Refine Sequence
  console.log('\\n✨ Stage 3: Refining Sequence...');
  manuscript = refine_sequence(manuscript);
  
  // Stage 4: Export
  console.log('\\n📤 Stage 4: Exporting Manuscript...');
  const { markdown, html } = export_manuscript(manuscript);
  
  // Write outputs
  fs.writeFileSync(outputPath, markdown, 'utf-8');
  fs.writeFileSync(outputPath.replace('.md', '.html'), html, 'utf-8');
  
  console.log('\\n✅ Pipeline Complete!');
  console.log(\`   Markdown: \${outputPath}\`);
  console.log(\`   HTML: \${outputPath.replace('.md', '.html')}\`);
}

main().catch(console.error);
`;
  
  if (!fs.existsSync(orchestratorFile)) {
    fs.writeFileSync(orchestratorFile, orchestratorTemplate);
    console.log(`   ✅ Created: rbi-editorial-pipeline.ts`);
  }
  
  // Step 4: Archive individual scripts (move to archive, don't delete)
  console.log('\n📦 Archiving individual scripts...');
  const allScripts = [...STAGE1_SCRIPTS, ...STAGE2_SCRIPTS, ...STAGE3_SCRIPTS, ...STAGE4_SCRIPTS];
  let archived = 0;
  
  allScripts.forEach(scriptName => {
    const sourcePath = path.join(EDITORIAL_DIR, scriptName);
    const destPath = path.join(ARCHIVE_SCRIPTS_DIR, scriptName);
    
    if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
      fs.copyFileSync(sourcePath, destPath);
      // Keep original for now, just document it
      console.log(`   📋 Documented: ${scriptName} → archive/individual_scripts/`);
      archived++;
    }
  });
  
  console.log(`   ✅ Archived ${archived} scripts (documented, originals kept)`);
  
  // Step 5: Generate refactoring report
  console.log('\n📊 Generating refactoring report...');
  const report = {
    timestamp: new Date().toISOString(),
    stages: stages.map(s => ({
      name: s.name,
      scripts: s.scripts,
      status: 'template_created',
    })),
    orchestrator: {
      file: 'rbi-editorial-pipeline.ts',
      status: 'created',
    },
    archived: {
      count: archived,
      location: 'archive/individual_scripts/',
    },
    utilities: {
      kept: UTILITY_SCRIPTS,
      reason: 'Utility scripts remain as-is',
    },
  };
  
  const reportPath = path.join(WORKSPACE_ROOT, 'EDITORIAL_REFACTORING_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`   ✅ Report: ${path.relative(WORKSPACE_ROOT, reportPath)}`);
  
  console.log('\n✅ Editorial tools refactoring complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Implement stage modules by combining logic from archived scripts');
  console.log('   2. Test each stage independently');
  console.log('   3. Test full pipeline with sample manuscript');
  console.log('   4. Remove individual scripts after verification');
}

main();

