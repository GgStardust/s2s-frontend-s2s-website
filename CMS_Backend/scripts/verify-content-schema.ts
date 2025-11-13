#!/usr/bin/env tsx
/**
 * Content Schema Verification Script
 * 
 * Verifies all 106 content files:
 * - Follow correct metadata schema
 * - Have no duplicates
 * - Contain no RBI residues (static RBI metrics)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import * as yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const ORB_ESSAYS_DIR = path.join(CONTENT_BASE, '02d_Orb_Essays');
const CODEX_ESSAYS_DIR = path.join(CONTENT_BASE, '02f_S2S_codex_essays');
const BOOK_CONTENT_DIR = path.join(CONTENT_BASE, '02g_generated_book_content');

const FORBIDDEN_RBI_KEYS = [
  'resonance_metrics', // Only allowed if null
  'resonance_score',
  'resonance_rating',
  'resonance_vector',
  'coherence_vector',
  'rbi_version',
  'rbi_analysis',
  'sovereign_proof',
  'proof_log_id'
];

const REQUIRED_CORE_KEYS = ['title', 'author', 'type', 'status', 'version', 'orb_associations'];
const REQUIRED_FIELD_FUNCTION_KEYS = ['content_purpose', 'primary_mechanism', 'console_context', 'console_relation'];
const REQUIRED_INTEGRATION_KEYS = ['codex', 'console_views', 'editorial_pass'];

interface FileInfo {
  path: string;
  relative: string;
  basename: string;
  size: number;
}

interface ValidationResult {
  file: string;
  valid: boolean;
  issues: string[];
  schemaCompliant: boolean;
  hasRBIResidues: boolean;
  hasDuplicates: boolean;
  type: string | null;
  fieldFunctionComplete: boolean;
  integrationPointsComplete: boolean;
}

interface DuplicateInfo {
  basename: string;
  files: string[];
}

function getAllContentFiles(): FileInfo[] {
  const files: FileInfo[] = [];
  
  const dirs = [
    { path: ORB_ESSAYS_DIR, prefix: '02d_Orb_Essays' },
    { path: CODEX_ESSAYS_DIR, prefix: '02f_S2S_codex_essays' },
    { path: BOOK_CONTENT_DIR, prefix: '02g_generated_book_content' }
  ];
  
  dirs.forEach(({ path: dirPath, prefix }) => {
    if (fs.existsSync(dirPath)) {
      const dirFiles = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.md'))
        .map(f => {
          const filePath = path.join(dirPath, f);
          const stats = fs.statSync(filePath);
          return {
            path: filePath,
            relative: `${prefix}/${f}`,
            basename: f,
            size: stats.size
          };
        });
      files.push(...dirFiles);
    }
  });
  
  return files;
}

function findDuplicates(files: FileInfo[]): Map<string, string[]> {
  const duplicates = new Map<string, string[]>();
  const basenameMap = new Map<string, string[]>();
  
  files.forEach(file => {
    if (!basenameMap.has(file.basename)) {
      basenameMap.set(file.basename, []);
    }
    basenameMap.get(file.basename)!.push(file.relative);
  });
  
  basenameMap.forEach((paths, basename) => {
    if (paths.length > 1) {
      duplicates.set(basename, paths);
    }
  });
  
  return duplicates;
}

function checkRBIResidues(frontmatter: any): string[] {
  const residues: string[] = [];
  
  FORBIDDEN_RBI_KEYS.forEach(key => {
    if (key === 'resonance_metrics') {
      // resonance_metrics is allowed but must be null
      if (frontmatter[key] !== undefined && frontmatter[key] !== null) {
        residues.push(`resonance_metrics has value (should be null): ${JSON.stringify(frontmatter[key])}`);
      }
    } else {
      // All other RBI keys are forbidden
      if (frontmatter[key] !== undefined && frontmatter[key] !== null) {
        residues.push(`${key}: ${JSON.stringify(frontmatter[key])}`);
      }
    }
  });
  
  return residues;
}

function validateSchema(frontmatter: any, filePath: string): { compliant: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check required core keys
  REQUIRED_CORE_KEYS.forEach(key => {
    if (frontmatter[key] === undefined || frontmatter[key] === null) {
      issues.push(`Missing required key: ${key}`);
    }
  });
  
  // Check type
  if (frontmatter.type) {
    const validTypes = ['essay', 'book_output'];
    if (!validTypes.includes(frontmatter.type)) {
      issues.push(`Invalid type: "${frontmatter.type}" (should be "essay" or "book_output")`);
    }
  }
  
  // Check field_function
  if (!frontmatter.field_function || typeof frontmatter.field_function !== 'object') {
    issues.push('Missing or invalid field_function');
  } else {
    REQUIRED_FIELD_FUNCTION_KEYS.forEach(key => {
      if (frontmatter.field_function[key] === undefined || frontmatter.field_function[key] === null) {
        issues.push(`Missing field_function.${key}`);
      }
    });
  }
  
  // Check integration_points
  if (!frontmatter.integration_points) {
    issues.push('Missing integration_points');
  } else if (Array.isArray(frontmatter.integration_points)) {
    issues.push('integration_points is array (should be object)');
  } else if (typeof frontmatter.integration_points !== 'object') {
    issues.push('integration_points is not an object');
  } else {
    REQUIRED_INTEGRATION_KEYS.forEach(key => {
      if (frontmatter.integration_points[key] === undefined) {
        issues.push(`Missing integration_points.${key}`);
      }
    });
  }
  
  return {
    compliant: issues.length === 0,
    issues
  };
}

function validateFile(fileInfo: FileInfo, duplicates: Map<string, string[]>): ValidationResult {
  const result: ValidationResult = {
    file: fileInfo.relative,
    valid: false,
    issues: [],
    schemaCompliant: false,
    hasRBIResidues: false,
    hasDuplicates: false,
    type: null,
    fieldFunctionComplete: false,
    integrationPointsComplete: false
  };
  
  try {
    // Check for duplicates
    if (duplicates.has(fileInfo.basename)) {
      const dupPaths = duplicates.get(fileInfo.basename)!;
      if (dupPaths.length > 1) {
        result.hasDuplicates = true;
        result.issues.push(`Duplicate filename found: ${dupPaths.join(', ')}`);
      }
    }
    
    // Read and parse file
    const content = fs.readFileSync(fileInfo.path, 'utf-8');
    const parsed = matter(content);
    const frontmatter = parsed.data;
    
    result.type = frontmatter.type || null;
    
    // Check schema compliance
    const schemaCheck = validateSchema(frontmatter, fileInfo.path);
    result.schemaCompliant = schemaCheck.compliant;
    result.issues.push(...schemaCheck.issues);
    
    // Check field_function completeness
    if (frontmatter.field_function && typeof frontmatter.field_function === 'object') {
      result.fieldFunctionComplete = REQUIRED_FIELD_FUNCTION_KEYS.every(
        key => frontmatter.field_function[key] !== undefined && frontmatter.field_function[key] !== null
      );
    }
    
    // Check integration_points completeness
    if (frontmatter.integration_points && typeof frontmatter.integration_points === 'object') {
      result.integrationPointsComplete = REQUIRED_INTEGRATION_KEYS.every(
        key => frontmatter.integration_points[key] !== undefined
      );
    }
    
    // Check for RBI residues
    const rbiResidues = checkRBIResidues(frontmatter);
    if (rbiResidues.length > 0) {
      result.hasRBIResidues = true;
      result.issues.push(...rbiResidues.map(r => `RBI residue: ${r}`));
    }
    
    // Overall validity
    result.valid = result.schemaCompliant && !result.hasRBIResidues && !result.hasDuplicates;
    
  } catch (error: any) {
    result.issues.push(`Parse error: ${error.message}`);
  }
  
  return result;
}

function generateVerificationReport(
  results: ValidationResult[],
  duplicates: Map<string, string[]>
): string {
  const lines: string[] = [];
  
  lines.push('# Content Schema Verification Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  
  const total = results.length;
  const valid = results.filter(r => r.valid).length;
  const invalid = results.filter(r => !r.valid).length;
  const schemaCompliant = results.filter(r => r.schemaCompliant).length;
  const hasRBIResidues = results.filter(r => r.hasRBIResidues).length;
  const hasDuplicates = results.filter(r => r.hasDuplicates).length;
  const fieldFunctionComplete = results.filter(r => r.fieldFunctionComplete).length;
  const integrationPointsComplete = results.filter(r => r.integrationPointsComplete).length;
  
  // Type distribution
  const typeCounts = new Map<string, number>();
  results.forEach(r => {
    const type = r.type || 'missing';
    typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
  });
  
  lines.push('## Summary\n');
  lines.push(`- **Total Files:** ${total}`);
  lines.push(`- **Valid Files:** ${valid} (${((valid / total) * 100).toFixed(1)}%)`);
  lines.push(`- **Invalid Files:** ${invalid} (${((invalid / total) * 100).toFixed(1)}%)\n`);
  
  lines.push('## Schema Compliance\n');
  lines.push(`- **Schema Compliant:** ${schemaCompliant}/${total} (${((schemaCompliant / total) * 100).toFixed(1)}%)`);
  lines.push(`- **Field Function Complete:** ${fieldFunctionComplete}/${total} (${((fieldFunctionComplete / total) * 100).toFixed(1)}%)`);
  lines.push(`- **Integration Points Complete:** ${integrationPointsComplete}/${total} (${((integrationPointsComplete / total) * 100).toFixed(1)}%)\n`);
  
  lines.push('## Issues Found\n');
  lines.push(`- **Files with RBI Residues:** ${hasRBIResidues}`);
  lines.push(`- **Files with Duplicate Names:** ${hasDuplicates}\n`);
  
  lines.push('## Type Distribution\n');
  lines.push('| Type | Count | Percentage |');
  lines.push('|------|-------|------------|');
  Array.from(typeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const percentage = ((count / total) * 100).toFixed(1);
      lines.push(`| ${type} | ${count} | ${percentage}% |`);
    });
  lines.push('');
  
  // Duplicates section
  if (duplicates.size > 0) {
    lines.push('## Duplicate Files\n');
    duplicates.forEach((paths, basename) => {
      lines.push(`### ${basename}\n`);
      paths.forEach(p => lines.push(`- ${p}`));
      lines.push('');
    });
  }
  
  // Files with issues
  const filesWithIssues = results.filter(r => !r.valid);
  if (filesWithIssues.length > 0) {
    lines.push('## Files with Issues\n');
    lines.push(`**Total:** ${filesWithIssues.length} files\n`);
    
    filesWithIssues.slice(0, 20).forEach(result => {
      lines.push(`### ${result.file}\n`);
      if (result.type) lines.push(`- **Type:** ${result.type}`);
      if (!result.schemaCompliant) lines.push('- **Schema:** Non-compliant');
      if (result.hasRBIResidues) lines.push('- **RBI Residues:** Yes');
      if (result.hasDuplicates) lines.push('- **Duplicates:** Yes');
      lines.push('- **Issues:**');
      result.issues.forEach(issue => {
        lines.push(`  - ${issue}`);
      });
      lines.push('');
    });
    
    if (filesWithIssues.length > 20) {
      lines.push(`\n*... and ${filesWithIssues.length - 20} more files with issues*\n`);
    }
  } else {
    lines.push('## ✅ All Files Valid\n');
    lines.push('No issues found. All files conform to the schema.\n');
  }
  
  return lines.join('\n');
}

async function verifyAllFiles() {
  console.log('🔍 Content Schema Verification\n');
  console.log('='.repeat(70));
  
  // Get all files
  console.log('📁 Scanning content files...');
  const allFiles = getAllContentFiles();
  console.log(`✅ Found ${allFiles.length} files\n`);
  
  // Find duplicates
  console.log('🔎 Checking for duplicates...');
  const duplicates = findDuplicates(allFiles);
  if (duplicates.size > 0) {
    console.log(`⚠️  Found ${duplicates.size} duplicate filenames`);
    duplicates.forEach((paths, basename) => {
      console.log(`  - ${basename}: ${paths.join(', ')}`);
    });
  } else {
    console.log('✅ No duplicate filenames found');
  }
  console.log('');
  
  // Validate each file
  console.log('🔨 Validating files...\n');
  const results: ValidationResult[] = [];
  
  for (const fileInfo of allFiles) {
    const result = validateFile(fileInfo, duplicates);
    results.push(result);
    
    if (!result.valid) {
      console.log(`  ⚠️  ${result.file}`);
      result.issues.slice(0, 3).forEach(issue => {
        console.log(`     - ${issue}`);
      });
      if (result.issues.length > 3) {
        console.log(`     ... and ${result.issues.length - 3} more issues`);
      }
    }
  }
  
  // Generate reports
  console.log('\n📊 Generating reports...\n');
  
  const report = generateVerificationReport(results, duplicates);
  const reportPath = path.join(__dirname, '../CONTENT_SCHEMA_VERIFICATION_REPORT.md');
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`✅ Verification report: ${reportPath}`);
  
  const validationPath = path.join(__dirname, '../CONTENT_SCHEMA_VALIDATION.json');
  fs.writeFileSync(validationPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`✅ Validation data: ${validationPath}`);
  
  // Summary
  const valid = results.filter(r => r.valid).length;
  const invalid = results.filter(r => !r.valid).length;
  const hasRBI = results.filter(r => r.hasRBIResidues).length;
  const hasDups = results.filter(r => r.hasDuplicates).length;
  
  console.log('\n📊 Verification Summary\n');
  console.log(`Total Files: ${results.length}`);
  console.log(`Valid: ${valid} (${((valid / results.length) * 100).toFixed(1)}%)`);
  console.log(`Invalid: ${invalid} (${((invalid / results.length) * 100).toFixed(1)}%)`);
  console.log(`Files with RBI Residues: ${hasRBI}`);
  console.log(`Files with Duplicates: ${hasDups}\n`);
  
  if (invalid === 0 && hasRBI === 0 && hasDups === 0) {
    console.log('✅ All files are valid and schema-compliant!\n');
  } else {
    console.log('⚠️  Some files need attention. See report for details.\n');
  }
}

// Run verification
verifyAllFiles()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });

