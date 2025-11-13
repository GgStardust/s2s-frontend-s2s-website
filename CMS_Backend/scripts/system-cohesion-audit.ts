#!/usr/bin/env tsx
/**
 * System Cohesion Audit
 * 
 * Verifies that all system components are aligned with the new metadata schema:
 * - Book Compiler filters out book_output types
 * - Console/Codex handles book_output correctly
 * - API routes respect type system
 * - Database sync validates correctly
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CohesionIssue {
  component: string;
  file: string;
  issue: string;
  severity: 'critical' | 'warning' | 'info';
  fix: string;
}

const issues: CohesionIssue[] = [];

// Check Book Compiler API routes
function checkBookCompilerAPIs() {
  console.log('🔍 Checking Book Compiler API routes...\n');
  
  const resonanceRoute = path.join(__dirname, '../app/api/ai/resonance-source-selection/route.ts');
  if (fs.existsSync(resonanceRoute)) {
    const content = fs.readFileSync(resonanceRoute, 'utf-8');
    
    // Check if it filters by type
    if (!content.includes('type') || !content.includes('essay') || !content.includes('book_output')) {
      issues.push({
        component: 'Book Compiler API',
        file: 'app/api/ai/resonance-source-selection/route.ts',
        issue: 'Does not filter out book_output types - may select compiled chapters as sources',
        severity: 'critical',
        fix: 'Add filter: contentFiles.filter(f => f.type === "essay") before resonance scoring'
      });
    }
  }
  
  const mergeRoute = path.join(__dirname, '../app/api/ai/merge-chapter/route.ts');
  if (fs.existsSync(mergeRoute)) {
    const content = fs.readFileSync(mergeRoute, 'utf-8');
    
    if (!content.includes('type') || !content.includes('essay')) {
      issues.push({
        component: 'Book Compiler API',
        file: 'app/api/ai/merge-chapter/route.ts',
        issue: 'Does not validate source types - may merge book_output files',
        severity: 'critical',
        fix: 'Add validation: ensure all sources have type === "essay"'
      });
    }
  }
}

// Check metadata compiler script
function checkMetadataCompiler() {
  console.log('🔍 Checking metadata-compiler script...\n');
  
  const scriptPath = path.join(__dirname, 'metadata-compiler.ts');
  if (fs.existsSync(scriptPath)) {
    const content = fs.readFileSync(scriptPath, 'utf-8');
    
    // Check if it filters by type
    if (!content.includes('type') || !content.includes('essay') || content.includes('book_output')) {
      issues.push({
        component: 'Metadata Compiler',
        file: 'scripts/metadata-compiler.ts',
        issue: 'Does not filter out book_output types in source selection',
        severity: 'critical',
        fix: 'Add filter in selectSourcesForChapter: contentFiles.filter(f => f.yaml.type === "essay")'
      });
    }
    
    // Check if it sets correct output type
    if (content.includes("type: 'book_chapter'")) {
      issues.push({
        component: 'Metadata Compiler',
        file: 'scripts/metadata-compiler.ts',
        issue: 'Sets output type as "book_chapter" instead of "book_output"',
        severity: 'warning',
        fix: 'Change type: "book_chapter" to type: "book_output" in compileChapter function'
      });
    }
  }
}

// Check content sync route
function checkContentSync() {
  console.log('🔍 Checking content sync route...\n');
  
  const syncRoute = path.join(__dirname, '../app/api/content-files/sync/route.ts');
  if (fs.existsSync(syncRoute)) {
    const content = fs.readFileSync(syncRoute, 'utf-8');
    
    // Check validation
    if (!content.includes('type') || !content.includes('essay') || !content.includes('book_output')) {
      issues.push({
        component: 'Content Sync API',
        file: 'app/api/content-files/sync/route.ts',
        issue: 'Does not validate type field against allowed values',
        severity: 'warning',
        fix: 'Add validation: type must be "essay" or "book_output"'
      });
    }
  }
}

// Check Console/Codex loaders
function checkConsoleLoaders() {
  console.log('🔍 Checking Console/Codex loaders...\n');
  
  // Check if Console filters book_output correctly
  const codexLoader = path.join(__dirname, '../../S2S_Console/src/lib/content/codexLoader.ts');
  if (fs.existsSync(codexLoader)) {
    const content = fs.readFileSync(codexLoader, 'utf-8');
    
    // Console should be able to read both essay and book_output
    // But might want to filter book_output for certain views
    if (!content.includes('type') && !content.includes('book_output')) {
      issues.push({
        component: 'Console Codex Loader',
        file: 'S2S_Console/src/lib/content/codexLoader.ts',
        issue: 'May not handle book_output type correctly',
        severity: 'info',
        fix: 'Ensure book_output files are included in Console views (they should be)'
      });
    }
  }
}

// Check for hardcoded old types
function checkHardcodedTypes() {
  console.log('🔍 Checking for hardcoded old types...\n');
  
  const searchDirs = [
    path.join(__dirname, '../app'),
    path.join(__dirname, '../lib'),
    path.join(__dirname, '../scripts')
  ];
  
  const oldTypes = ['orb_essay', 'codex_essay', 'book_fragment', 'book_chapter'];
  const filesToCheck: string[] = [];
  
  searchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = getAllTypeScriptFiles(dir);
      filesToCheck.push(...files);
    }
  });
  
  filesToCheck.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    oldTypes.forEach(oldType => {
      // Check for string literals or comparisons
      if (content.includes(`'${oldType}'`) || content.includes(`"${oldType}"`) || 
          content.includes(`=== '${oldType}'`) || content.includes(`=== "${oldType}"`)) {
        const relativePath = path.relative(__dirname + '/..', file);
        issues.push({
          component: 'Code Reference',
          file: relativePath,
          issue: `References old type "${oldType}" - should use "essay" or "book_output"`,
          severity: 'warning',
          fix: `Replace "${oldType}" with "essay" (for inputs) or "book_output" (for compiled outputs)`
        });
      }
    });
  });
}

function getAllTypeScriptFiles(dir: string): string[] {
  const files: string[] = [];
  
  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and .next
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
          walk(fullPath);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function generateReport(): string {
  const lines: string[] = [];
  
  lines.push('# System Cohesion Audit Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  
  const critical = issues.filter(i => i.severity === 'critical');
  const warnings = issues.filter(i => i.severity === 'warning');
  const info = issues.filter(i => i.severity === 'info');
  
  lines.push('## Summary\n');
  lines.push(`- **Total Issues:** ${issues.length}`);
  lines.push(`- **Critical:** ${critical.length}`);
  lines.push(`- **Warnings:** ${warnings.length}`);
  lines.push(`- **Info:** ${info.length}\n`);
  
  if (critical.length > 0) {
    lines.push('## Critical Issues\n');
    critical.forEach(issue => {
      lines.push(`### ${issue.component}: ${issue.file}\n`);
      lines.push(`**Issue:** ${issue.issue}\n`);
      lines.push(`**Fix:** ${issue.fix}\n`);
    });
    lines.push('');
  }
  
  if (warnings.length > 0) {
    lines.push('## Warnings\n');
    warnings.forEach(issue => {
      lines.push(`### ${issue.component}: ${issue.file}\n`);
      lines.push(`**Issue:** ${issue.issue}\n`);
      lines.push(`**Fix:** ${issue.fix}\n`);
    });
    lines.push('');
  }
  
  if (info.length > 0) {
    lines.push('## Information\n');
    info.forEach(issue => {
      lines.push(`### ${issue.component}: ${issue.file}\n`);
      lines.push(`**Note:** ${issue.issue}\n`);
    });
    lines.push('');
  }
  
  if (issues.length === 0) {
    lines.push('## ✅ All Systems Cohesive\n');
    lines.push('No issues found. All components are aligned with the metadata schema.\n');
  }
  
  return lines.join('\n');
}

async function runAudit() {
  console.log('🔍 System Cohesion Audit\n');
  console.log('='.repeat(70));
  console.log('Checking alignment with metadata schema across all components...\n');
  
  checkBookCompilerAPIs();
  checkMetadataCompiler();
  checkContentSync();
  checkConsoleLoaders();
  checkHardcodedTypes();
  
  console.log('\n📊 Generating report...\n');
  
  const report = generateReport();
  const reportPath = path.join(__dirname, '../SYSTEM_COHESION_AUDIT_REPORT.md');
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`✅ Report: ${reportPath}`);
  
  const jsonPath = path.join(__dirname, '../SYSTEM_COHESION_AUDIT.json');
  fs.writeFileSync(jsonPath, JSON.stringify(issues, null, 2), 'utf-8');
  console.log(`✅ Data: ${jsonPath}`);
  
  console.log('\n📊 Summary\n');
  console.log(`Total Issues: ${issues.length}`);
  console.log(`Critical: ${issues.filter(i => i.severity === 'critical').length}`);
  console.log(`Warnings: ${issues.filter(i => i.severity === 'warning').length}`);
  console.log(`Info: ${issues.filter(i => i.severity === 'info').length}\n`);
  
  if (issues.length === 0) {
    console.log('✅ All systems are cohesive!\n');
  } else {
    console.log('⚠️  Issues found. See report for details.\n');
  }
}

runAudit()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  });

