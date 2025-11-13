#!/usr/bin/env node
/**
 * Manuscript Alignment Script
 * 
 * Aligns manuscript files with CMS schema and creates canonical structure
 * Based on PROMPT_2_MANUSCRIPT_ALIGNMENT.md
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const MANUSCRIPT_DIR = path.join(WORKSPACE_ROOT, 'S2S_Manuscript');
const CURRENT_DIR = path.join(MANUSCRIPT_DIR, 'current');
const ARCHIVE_DIR = path.join(MANUSCRIPT_DIR, 'archive');

function main() {
  console.log('📚 Manuscript Alignment Script');
  console.log('='.repeat(70));
  
  // Step 1: Create directory structure
  console.log('\n📁 Creating directory structure...');
  [CURRENT_DIR, ARCHIVE_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   ✅ Created: ${path.relative(WORKSPACE_ROOT, dir)}`);
    }
  });
  
  // Step 2: Identify authoritative manuscript
  const authoritativeFile = path.join(MANUSCRIPT_DIR, 'STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT.md');
  let currentFile = null;
  
  if (fs.existsSync(authoritativeFile)) {
    console.log('\n📄 Found authoritative manuscript');
    console.log(`   ${path.relative(WORKSPACE_ROOT, authoritativeFile)}`);
    
    // Copy to current/ directory
    currentFile = path.join(CURRENT_DIR, 'STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT.md');
    fs.copyFileSync(authoritativeFile, currentFile);
    console.log(`   ✅ Copied to: ${path.relative(WORKSPACE_ROOT, currentFile)}`);
  } else {
    console.log('\n⚠️  Authoritative manuscript not found!');
    return;
  }
  
  // Step 3: Move development files to archive
  console.log('\n📦 Archiving development files...');
  const deltaDir = path.join(MANUSCRIPT_DIR, 'manuscript_development_delta');
  const bookDemoDir = path.join(MANUSCRIPT_DIR, 'BOOK_COMPILER_DEMONSTRATION');
  
  if (fs.existsSync(deltaDir)) {
    const archiveDelta = path.join(ARCHIVE_DIR, 'manuscript_development_delta');
    if (!fs.existsSync(archiveDelta)) {
      fs.renameSync(deltaDir, archiveDelta);
      console.log(`   ✅ Moved: manuscript_development_delta → archive/`);
    }
  }
  
  if (fs.existsSync(bookDemoDir)) {
    const archiveBook = path.join(ARCHIVE_DIR, 'BOOK_COMPILER_DEMONSTRATION');
    if (!fs.existsSync(archiveBook)) {
      fs.renameSync(bookDemoDir, archiveBook);
      console.log(`   ✅ Moved: BOOK_COMPILER_DEMONSTRATION → archive/`);
    }
  }
  
  // Step 4: Generate sync report
  console.log('\n📊 Generating sync report...');
  const report = {
    authoritative: currentFile ? path.relative(WORKSPACE_ROOT, currentFile) : null,
    structure: {
      current: path.relative(WORKSPACE_ROOT, CURRENT_DIR),
      archive: path.relative(WORKSPACE_ROOT, ARCHIVE_DIR),
    },
    timestamp: new Date().toISOString(),
  };
  
  const reportPath = path.join(WORKSPACE_ROOT, 'MANUSCRIPT_ALIGNMENT_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`   ✅ Report: ${path.relative(WORKSPACE_ROOT, reportPath)}`);
  
  console.log('\n✅ Manuscript alignment complete!');
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Review ${path.relative(WORKSPACE_ROOT, currentFile)}`);
  console.log(`   2. Link CMS entries to manuscript sections`);
  console.log(`   3. Verify archive structure`);
}

main();

