#!/usr/bin/env tsx
/**
 * Post-Normalization Validation
 * 
 * Validates that normalization was successful:
 * - Type distribution (essay vs book_chapter)
 * - Field function completeness
 * - Integration points structure
 * - Forbidden keys removal
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const ORB_ESSAYS_DIR = path.join(CONTENT_BASE, '02d_Orb_Essays');
const CODEX_ESSAYS_DIR = path.join(CONTENT_BASE, '02f_S2S_codex_essays');
const BOOK_CONTENT_DIR = path.join(CONTENT_BASE, '02g_generated_book_content');

const FORBIDDEN_KEYS = [
  'resonance_metrics',
  'resonance_rating',
  'resonance_vector',
  'resonance_score',
  'coherence_vector',
  'rbi_version',
  'rbi_analysis',
  'sovereign_proof',
  'proof_log_id'
];

interface ValidationStats {
  total: number;
  byType: Map<string, number>;
  completeFieldFunction: number;
  completeIntegrationPoints: number;
  forbiddenKeysFound: number;
  filesWithIssues: Array<{
    file: string;
    issues: string[];
  }>;
}

function scanAllFiles(): Array<{ path: string; relative: string }> {
  const files: Array<{ path: string; relative: string }> = [];
  
  const dirs = [
    { path: ORB_ESSAYS_DIR, prefix: '02d_Orb_Essays' },
    { path: CODEX_ESSAYS_DIR, prefix: '02f_S2S_codex_essays' },
    { path: BOOK_CONTENT_DIR, prefix: '02g_generated_book_content' }
  ];
  
  dirs.forEach(({ path: dirPath, prefix }) => {
    if (fs.existsSync(dirPath)) {
      const dirFiles = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.md'))
        .map(f => ({
          path: path.join(dirPath, f),
          relative: `${prefix}/${f}`
        }));
      files.push(...dirFiles);
    }
  });
  
  return files;
}

function validateFile(filePath: string, relativePath: string): {
  type: string;
  hasCompleteFieldFunction: boolean;
  hasCompleteIntegrationPoints: boolean;
  hasForbiddenKeys: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    const yaml = parsed.data;
    
    // Check type
    const type = yaml.type || 'missing';
    
    // Check field function
    let hasCompleteFieldFunction = false;
    if (yaml.field_function && typeof yaml.field_function === 'object') {
      const ff = yaml.field_function;
      hasCompleteFieldFunction = !!(
        ff.content_purpose &&
        ff.primary_mechanism &&
        ff.console_context &&
        ff.console_relation
      );
      
      if (!hasCompleteFieldFunction) {
        const missing = [];
        if (!ff.content_purpose) missing.push('content_purpose');
        if (!ff.primary_mechanism) missing.push('primary_mechanism');
        if (!ff.console_context) missing.push('console_context');
        if (!ff.console_relation) missing.push('console_relation');
        issues.push(`Incomplete field_function: missing ${missing.join(', ')}`);
      }
    } else {
      issues.push('Missing or invalid field_function');
    }
    
    // Check integration points
    let hasCompleteIntegrationPoints = false;
    if (yaml.integration_points) {
      if (Array.isArray(yaml.integration_points)) {
        issues.push('integration_points is still an array (should be object)');
      } else if (typeof yaml.integration_points === 'object') {
        const ip = yaml.integration_points;
        hasCompleteIntegrationPoints = (
          ip.codex !== undefined &&
          ip.console_views !== undefined &&
          ip.editorial_pass !== undefined
        );
        
        if (!hasCompleteIntegrationPoints) {
          const missing = [];
          if (ip.codex === undefined) missing.push('codex');
          if (ip.console_views === undefined) missing.push('console_views');
          if (ip.editorial_pass === undefined) missing.push('editorial_pass');
          issues.push(`Incomplete integration_points: missing ${missing.join(', ')}`);
        }
      }
    } else {
      issues.push('Missing integration_points');
    }
    
    // Check for forbidden keys
    let hasForbiddenKeys = false;
    FORBIDDEN_KEYS.forEach(key => {
      if (yaml[key] !== undefined && yaml[key] !== null) {
        hasForbiddenKeys = true;
        issues.push(`Contains forbidden key: ${key}`);
      }
    });
    
    return {
      type,
      hasCompleteFieldFunction,
      hasCompleteIntegrationPoints,
      hasForbiddenKeys,
      issues
    };
  } catch (error: any) {
    return {
      type: 'error',
      hasCompleteFieldFunction: false,
      hasCompleteIntegrationPoints: false,
      hasForbiddenKeys: false,
      issues: [`Parse error: ${error.message}`]
    };
  }
}

function validateNormalization(): ValidationStats {
  const stats: ValidationStats = {
    total: 0,
    byType: new Map(),
    completeFieldFunction: 0,
    completeIntegrationPoints: 0,
    forbiddenKeysFound: 0,
    filesWithIssues: []
  };
  
  const files = scanAllFiles();
  stats.total = files.length;
  
  files.forEach(({ path: filePath, relative: relativePath }) => {
    const validation = validateFile(filePath, relativePath);
    
    // Count types
    stats.byType.set(validation.type, (stats.byType.get(validation.type) || 0) + 1);
    
    // Count completions
    if (validation.hasCompleteFieldFunction) stats.completeFieldFunction++;
    if (validation.hasCompleteIntegrationPoints) stats.completeIntegrationPoints++;
    if (validation.hasForbiddenKeys) stats.forbiddenKeysFound++;
    
    // Track issues
    if (validation.issues.length > 0) {
      stats.filesWithIssues.push({
        file: relativePath,
        issues: validation.issues
      });
    }
  });
  
  return stats;
}

function generateValidationReport(stats: ValidationStats): string {
  const lines: string[] = [];
  
  lines.push('# Post-Normalization Validation Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  
  lines.push('## Summary\n');
  lines.push(`- **Total Files Validated:** ${stats.total}`);
  lines.push(`- **Files with Complete Field Function:** ${stats.completeFieldFunction}/${stats.total} (${((stats.completeFieldFunction / stats.total) * 100).toFixed(1)}%)`);
  lines.push(`- **Files with Complete Integration Points:** ${stats.completeIntegrationPoints}/${stats.total} (${((stats.completeIntegrationPoints / stats.total) * 100).toFixed(1)}%)`);
  lines.push(`- **Files with Forbidden Keys:** ${stats.forbiddenKeysFound}`);
  lines.push(`- **Files with Issues:** ${stats.filesWithIssues.length}\n`);
  
  lines.push('## Type Distribution\n');
  lines.push('| Type | Count | Percentage |');
  lines.push('|------|-------|------------|');
  
  const sortedTypes = Array.from(stats.byType.entries())
    .sort((a, b) => b[1] - a[1]);
  
  sortedTypes.forEach(([type, count]) => {
    const percentage = ((count / stats.total) * 100).toFixed(1);
    lines.push(`| ${type} | ${count} | ${percentage}% |`);
  });
  
  lines.push('\n## Validation Results\n');
  
  const essayCount = stats.byType.get('essay') || 0;
  const bookChapterCount = Array.from(stats.byType.entries())
    .filter(([type]) => type.startsWith('book_'))
    .reduce((sum, [, count]) => sum + count, 0);
  
  lines.push(`- **Essays (type: "essay"):** ${essayCount} (expected: majority)`);
  lines.push(`- **Book Chapters (type: "book_*"):** ${bookChapterCount} (expected: only in locked directories)\n`);
  
  if (stats.filesWithIssues.length > 0) {
    lines.push('## Files Requiring Attention\n');
    lines.push(`**Total:** ${stats.filesWithIssues.length} files\n`);
    
    stats.filesWithIssues.slice(0, 20).forEach(file => {
      lines.push(`### ${file.file}\n`);
      file.issues.forEach(issue => {
        lines.push(`- ${issue}`);
      });
      lines.push('');
    });
    
    if (stats.filesWithIssues.length > 20) {
      lines.push(`\n*... and ${stats.filesWithIssues.length - 20} more files with issues*\n`);
    }
  } else {
    lines.push('## ✅ All Files Validated Successfully\n');
    lines.push('No issues found. All files conform to the standard metadata template.\n');
  }
  
  return lines.join('\n');
}

// Run validation
const stats = validateNormalization();
const report = generateValidationReport(stats);
const reportPath = path.join(__dirname, '../POST_NORMALIZATION_VALIDATION.md');
fs.writeFileSync(reportPath, report, 'utf-8');

console.log('📊 Post-Normalization Validation\n');
console.log('='.repeat(70));
console.log(`Total Files: ${stats.total}`);
console.log(`Complete Field Function: ${stats.completeFieldFunction}/${stats.total} (${((stats.completeFieldFunction / stats.total) * 100).toFixed(1)}%)`);
console.log(`Complete Integration Points: ${stats.completeIntegrationPoints}/${stats.total} (${((stats.completeIntegrationPoints / stats.total) * 100).toFixed(1)}%)`);
console.log(`Forbidden Keys Found: ${stats.forbiddenKeysFound}`);
console.log(`Files with Issues: ${stats.filesWithIssues.length}`);
console.log(`\n✅ Validation report: ${reportPath}\n`);

// Update normalization report with validation results
const normalizationReportPath = path.join(__dirname, '../METADATA_NORMALIZATION_REPORT.md');
let normalizationReport = fs.readFileSync(normalizationReportPath, 'utf-8');
normalizationReport += '\n\n---\n\n';
normalizationReport += '## Post-Normalization Validation\n\n';
normalizationReport += `- **Complete Field Function:** ${stats.completeFieldFunction}/${stats.total} (${((stats.completeFieldFunction / stats.total) * 100).toFixed(1)}%)\n`;
normalizationReport += `- **Complete Integration Points:** ${stats.completeIntegrationPoints}/${stats.total} (${((stats.completeIntegrationPoints / stats.total) * 100).toFixed(1)}%)\n`;
normalizationReport += `- **Forbidden Keys Remaining:** ${stats.forbiddenKeysFound}\n`;
normalizationReport += `- **Files with Issues:** ${stats.filesWithIssues.length}\n`;
normalizationReport += `\nSee POST_NORMALIZATION_VALIDATION.md for full details.\n`;
fs.writeFileSync(normalizationReportPath, normalizationReport, 'utf-8');

process.exit(0);

