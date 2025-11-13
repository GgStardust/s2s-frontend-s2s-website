#!/usr/bin/env tsx
/**
 * Metadata Integrity and Template Audit
 * 
 * 1. Identifies current metadata template used in all content files
 * 2. Compares against desired standard template
 * 3. Detects files where type ≠ "essay" (unless locked book chapter)
 * 4. Checks for missing or malformed YAML keys
 * 5. Generates three reports:
 *    - METADATA_TEMPLATE_REPORT.md
 *    - METADATA_CONVERSION_PLAN.json
 *    - FIELD_FUNCTION_AUDIT.json
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

// Standard template definition
const STANDARD_TEMPLATE = {
  required_core: {
    title: 'string',
    author: 'string',
    type: 'string (default: "essay")',
    status: 'string',
    version: 'string',
    orb_associations: 'object|array',
    field_function: {
      content_purpose: 'string',
      primary_mechanism: 'string',
      console_context: 'string',
      console_relation: 'string'
    },
    integration_points: {
      codex: 'boolean|string',
      console_views: 'boolean|string',
      editorial_pass: 'boolean|string'
    }
  },
  optional_compilation: {
    book_threading: {
      book_id: 'string',
      target_section: 'string',
      target_chapter: 'string',
      relevance_score: 'number',
      position_in_sequence: 'number',
      role_in_chapter: 'string'
    }
  },
  forbidden: [
    'resonance_metrics',
    'resonance_rating',
    'resonance_vector',
    'sovereign_proof',
    'proof_log_id'
  ]
};

interface FileMetadata {
  file_path: string;
  relative_path: string;
  yaml: any;
  has_yaml: boolean;
  issues: string[];
  type: string;
  is_locked_book_chapter: boolean;
}

interface TemplateAnalysis {
  all_keys: Set<string>;
  key_frequency: Map<string, number>;
  value_patterns: Map<string, Set<string>>;
  type_distribution: Map<string, number>;
  missing_keys: Map<string, number>;
  malformed_keys: Map<string, string[]>;
}

function scanContentFiles(): FileMetadata[] {
  const files: FileMetadata[] = [];
  
  // Scan Orb Essays
  if (fs.existsSync(ORB_ESSAYS_DIR)) {
    const orbFiles = fs.readdirSync(ORB_ESSAYS_DIR).filter(f => f.endsWith('.md'));
    orbFiles.forEach(filename => {
      const filePath = path.join(ORB_ESSAYS_DIR, filename);
      const relativePath = `02d_Orb_Essays/${filename}`;
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(content);
      
      files.push({
        file_path: filePath,
        relative_path: relativePath,
        yaml: parsed.data,
        has_yaml: Object.keys(parsed.data).length > 0,
        issues: [],
        type: parsed.data.type || 'unknown',
        is_locked_book_chapter: false // Orb essays are not book chapters
      });
    });
  }
  
  // Scan Codex Essays
  if (fs.existsSync(CODEX_ESSAYS_DIR)) {
    const codexFiles = fs.readdirSync(CODEX_ESSAYS_DIR).filter(f => f.endsWith('.md'));
    codexFiles.forEach(filename => {
      const filePath = path.join(CODEX_ESSAYS_DIR, filename);
      const relativePath = `02f_S2S_codex_essays/${filename}`;
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(content);
      
      files.push({
        file_path: filePath,
        relative_path: relativePath,
        yaml: parsed.data,
        has_yaml: Object.keys(parsed.data).length > 0,
        issues: [],
        type: parsed.data.type || 'unknown',
        is_locked_book_chapter: false // Codex essays are not book chapters
      });
    });
  }
  
  // Scan Book Content (these are locked book chapters)
  if (fs.existsSync(BOOK_CONTENT_DIR)) {
    const bookFiles = fs.readdirSync(BOOK_CONTENT_DIR).filter(f => f.endsWith('.md'));
    bookFiles.forEach(filename => {
      const filePath = path.join(BOOK_CONTENT_DIR, filename);
      const relativePath = `02g_generated_book_content/${filename}`;
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(content);
      
      files.push({
        file_path: filePath,
        relative_path: relativePath,
        yaml: parsed.data,
        has_yaml: Object.keys(parsed.data).length > 0,
        issues: [],
        type: parsed.data.type || 'unknown',
        is_locked_book_chapter: true // These are locked book chapters
      });
    });
  }
  
  return files;
}

function analyzeTemplate(files: FileMetadata[]): TemplateAnalysis {
  const analysis: TemplateAnalysis = {
    all_keys: new Set(),
    key_frequency: new Map(),
    value_patterns: new Map(),
    type_distribution: new Map(),
    missing_keys: new Map(),
    malformed_keys: new Map()
  };
  
  // Collect all keys and patterns
  files.forEach(file => {
    if (!file.has_yaml) return;
    
    Object.keys(file.yaml).forEach(key => {
      analysis.all_keys.add(key);
      analysis.key_frequency.set(key, (analysis.key_frequency.get(key) || 0) + 1);
      
      // Collect value patterns
      const value = file.yaml[key];
      if (!analysis.value_patterns.has(key)) {
        analysis.value_patterns.set(key, new Set());
      }
      
      if (typeof value === 'string') {
        analysis.value_patterns.get(key)!.add(value);
      } else if (typeof value === 'number') {
        analysis.value_patterns.get(key)!.add(`number:${value}`);
      } else if (typeof value === 'boolean') {
        analysis.value_patterns.get(key)!.add(`boolean:${value}`);
      } else if (Array.isArray(value)) {
        analysis.value_patterns.get(key)!.add(`array[${value.length}]`);
      } else if (typeof value === 'object' && value !== null) {
        analysis.value_patterns.get(key)!.add(`object:${Object.keys(value).join(',')}`);
      }
    });
    
    // Track type distribution
    const type = file.yaml.type || 'missing';
    analysis.type_distribution.set(type, (analysis.type_distribution.get(type) || 0) + 1);
  });
  
  // Check for missing required keys
  const requiredKeys = Object.keys(STANDARD_TEMPLATE.required_core);
  files.forEach(file => {
    requiredKeys.forEach(key => {
      if (!file.yaml[key]) {
        analysis.missing_keys.set(key, (analysis.missing_keys.get(key) || 0) + 1);
      }
    });
  });
  
  return analysis;
}

function validateFile(file: FileMetadata): string[] {
  const issues: string[] = [];
  
  // Check type
  if (!file.is_locked_book_chapter && file.yaml.type !== 'essay' && file.yaml.type !== undefined) {
    if (file.yaml.type === 'book_chapter') {
      issues.push(`Type should be "essay" but is "book_chapter" (not in locked book directory)`);
    } else {
      issues.push(`Type is "${file.yaml.type}" but should be "essay"`);
    }
  }
  
  // Check required keys
  const requiredKeys = Object.keys(STANDARD_TEMPLATE.required_core);
  requiredKeys.forEach(key => {
    if (!file.yaml[key]) {
      issues.push(`Missing required key: ${key}`);
    }
  });
  
  // Check field_function structure
  if (file.yaml.field_function) {
    if (typeof file.yaml.field_function !== 'object') {
      issues.push(`field_function is not an object`);
    } else {
      const requiredFieldFunctionKeys = ['content_purpose', 'primary_mechanism', 'console_context', 'console_relation'];
      requiredFieldFunctionKeys.forEach(key => {
        if (!file.yaml.field_function[key]) {
          issues.push(`Missing field_function.${key}`);
        }
      });
    }
  } else {
    issues.push(`Missing field_function object`);
  }
  
  // Check integration_points structure
  if (file.yaml.integration_points) {
    if (Array.isArray(file.yaml.integration_points)) {
      // Old format - should be object
      issues.push(`integration_points is array but should be object with codex, console_views, editorial_pass`);
    } else if (typeof file.yaml.integration_points === 'object') {
      const requiredIntegrationKeys = ['codex', 'console_views', 'editorial_pass'];
      requiredIntegrationKeys.forEach(key => {
        if (file.yaml.integration_points[key] === undefined) {
          issues.push(`Missing integration_points.${key}`);
        }
      });
    }
  } else {
    issues.push(`Missing integration_points`);
  }
  
  // Check for forbidden keys
  STANDARD_TEMPLATE.forbidden.forEach(forbiddenKey => {
    if (file.yaml[forbiddenKey] !== undefined && file.yaml[forbiddenKey] !== null) {
      issues.push(`Contains forbidden key: ${forbiddenKey} (should be null or omitted)`);
    }
  });
  
  // Check orb_associations structure
  if (file.yaml.orb_associations) {
    if (typeof file.yaml.orb_associations !== 'object') {
      issues.push(`orb_associations is not an object or array`);
    }
  }
  
  return issues;
}

function generateTemplateReport(
  analysis: TemplateAnalysis,
  files: FileMetadata[]
): string {
  const lines: string[] = [];
  
  lines.push('# Metadata Template Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  
  lines.push('## Summary\n');
  lines.push(`- **Total Files Analyzed:** ${files.length}`);
  lines.push(`- **Files with YAML:** ${files.filter(f => f.has_yaml).length}`);
  lines.push(`- **Unique Keys Found:** ${analysis.all_keys.size}`);
  lines.push(`- **Files with Issues:** ${files.filter(f => f.issues.length > 0).length}\n`);
  
  lines.push('## Current Key Distribution\n');
  lines.push('| Key | Frequency | Percentage | Value Patterns |');
  lines.push('|-----|-----------|------------|---------------|');
  
  const sortedKeys = Array.from(analysis.key_frequency.entries())
    .sort((a, b) => b[1] - a[1]);
  
  sortedKeys.forEach(([key, count]) => {
    const percentage = ((count / files.length) * 100).toFixed(1);
    const patterns = Array.from(analysis.value_patterns.get(key) || [])
      .slice(0, 5)
      .join(', ');
    lines.push(`| ${key} | ${count} | ${percentage}% | ${patterns.substring(0, 100)}... |`);
  });
  
  lines.push('\n## Type Distribution\n');
  lines.push('| Type | Count | Percentage |');
  lines.push('|------|-------|------------|');
  
  const sortedTypes = Array.from(analysis.type_distribution.entries())
    .sort((a, b) => b[1] - a[1]);
  
  sortedTypes.forEach(([type, count]) => {
    const percentage = ((count / files.length) * 100).toFixed(1);
    lines.push(`| ${type} | ${count} | ${percentage}% |`);
  });
  
  lines.push('\n## Missing Required Keys\n');
  lines.push('| Key | Missing Count | Percentage |');
  lines.push('|-----|--------------|------------|');
  
  const sortedMissing = Array.from(analysis.missing_keys.entries())
    .sort((a, b) => b[1] - a[1]);
  
  sortedMissing.forEach(([key, count]) => {
    const percentage = ((count / files.length) * 100).toFixed(1);
    lines.push(`| ${key} | ${count} | ${percentage}% |`);
  });
  
  lines.push('\n## Standard Template Definition\n');
  lines.push('### Required Core Keys\n');
  lines.push('```yaml');
  Object.entries(STANDARD_TEMPLATE.required_core).forEach(([key, value]) => {
    if (typeof value === 'string') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'object') {
      lines.push(`${key}:`);
      Object.entries(value).forEach(([subKey, subValue]) => {
        lines.push(`  ${subKey}: ${subValue}`);
      });
    }
  });
  lines.push('```\n');
  
  lines.push('### Optional Compilation Keys\n');
  lines.push('```yaml');
  lines.push('book_threading:');
  Object.entries(STANDARD_TEMPLATE.optional_compilation.book_threading).forEach(([key, value]) => {
    lines.push(`  ${key}: ${value}`);
  });
  lines.push('```\n');
  
  lines.push('### Forbidden Keys\n');
  lines.push('These keys should be `null` or omitted (RBI metrics are computed dynamically):\n');
  STANDARD_TEMPLATE.forbidden.forEach(key => {
    lines.push(`- ${key}`);
  });
  lines.push('');
  
  lines.push('## Current vs Standard Comparison\n');
  lines.push('| Key | Standard | Current Status |');
  lines.push('|-----|----------|----------------|');
  
  const standardKeys = new Set([
    ...Object.keys(STANDARD_TEMPLATE.required_core),
    ...Object.keys(STANDARD_TEMPLATE.optional_compilation)
  ]);
  
  standardKeys.forEach(key => {
    const frequency = analysis.key_frequency.get(key) || 0;
    const percentage = ((frequency / files.length) * 100).toFixed(1);
    const status = frequency === files.length ? '✅ Complete' :
                   frequency > files.length * 0.8 ? '⚠️ Mostly Present' :
                   frequency > 0 ? '❌ Partial' : '❌ Missing';
    lines.push(`| ${key} | Required/Optional | ${status} (${percentage}%) |`);
  });
  
  // Check for non-standard keys
  const nonStandardKeys = Array.from(analysis.all_keys).filter(
    key => !standardKeys.has(key) && !STANDARD_TEMPLATE.forbidden.includes(key)
  );
  
  if (nonStandardKeys.length > 0) {
    lines.push('\n## Non-Standard Keys Found\n');
    lines.push('These keys exist but are not in the standard template:\n');
    nonStandardKeys.forEach(key => {
      const frequency = analysis.key_frequency.get(key) || 0;
      lines.push(`- ${key} (appears in ${frequency} files)`);
    });
  }
  
  return lines.join('\n');
}

function generateConversionPlan(files: FileMetadata[]): any {
  const conversionPlan = {
    type_conversions: [] as any[],
    missing_keys: [] as any[],
    malformed_structure: [] as any[],
    forbidden_keys: [] as any[],
    field_function_updates: [] as any[],
    integration_points_updates: [] as any[]
  };
  
  files.forEach(file => {
    if (!file.has_yaml) return;
    
    // Type conversions
    if (!file.is_locked_book_chapter && file.yaml.type !== 'essay' && file.yaml.type !== undefined) {
      conversionPlan.type_conversions.push({
        file: file.relative_path,
        current_type: file.yaml.type,
        target_type: 'essay',
        reason: 'Not in locked book directory, should be essay'
      });
    }
    
    // Missing required keys
    const requiredKeys = Object.keys(STANDARD_TEMPLATE.required_core);
    const missing = requiredKeys.filter(key => !file.yaml[key]);
    if (missing.length > 0) {
      conversionPlan.missing_keys.push({
        file: file.relative_path,
        missing_keys: missing,
        suggested_values: inferValues(file, missing)
      });
    }
    
    // Malformed field_function
    if (!file.yaml.field_function || typeof file.yaml.field_function !== 'object') {
      conversionPlan.field_function_updates.push({
        file: file.relative_path,
        issue: !file.yaml.field_function ? 'missing' : 'not_object',
        current: file.yaml.field_function,
        suggested: {
          content_purpose: inferContentPurpose(file),
          primary_mechanism: inferPrimaryMechanism(file),
          console_context: inferConsoleContext(file),
          console_relation: inferConsoleRelation(file)
        }
      });
    } else {
      const requiredFieldFunctionKeys = ['content_purpose', 'primary_mechanism', 'console_context', 'console_relation'];
      const missingFieldFunction = requiredFieldFunctionKeys.filter(key => !file.yaml.field_function[key]);
      if (missingFieldFunction.length > 0) {
        conversionPlan.field_function_updates.push({
          file: file.relative_path,
          issue: 'missing_subkeys',
          missing_keys: missingFieldFunction,
          current: file.yaml.field_function,
          suggested: missingFieldFunction.reduce((acc: any, key) => {
            acc[key] = inferFieldFunctionValue(file, key);
            return acc;
          }, {})
        });
      }
    }
    
    // Malformed integration_points
    if (!file.yaml.integration_points) {
      conversionPlan.integration_points_updates.push({
        file: file.relative_path,
        issue: 'missing',
        suggested: {
          codex: true,
          console_views: true,
          editorial_pass: false
        }
      });
    } else if (Array.isArray(file.yaml.integration_points)) {
      conversionPlan.integration_points_updates.push({
        file: file.relative_path,
        issue: 'is_array',
        current: file.yaml.integration_points,
        suggested: {
          codex: file.yaml.integration_points.includes('codex') || file.yaml.integration_points.includes('codex_scrolls'),
          console_views: file.yaml.integration_points.includes('console') || file.yaml.integration_points.includes('dashboard_modules'),
          editorial_pass: file.yaml.integration_points.includes('editorial') || false
        }
      });
    } else if (typeof file.yaml.integration_points === 'object') {
      const requiredIntegrationKeys = ['codex', 'console_views', 'editorial_pass'];
      const missingIntegration = requiredIntegrationKeys.filter(key => file.yaml.integration_points[key] === undefined);
      if (missingIntegration.length > 0) {
        conversionPlan.integration_points_updates.push({
          file: file.relative_path,
          issue: 'missing_subkeys',
          missing_keys: missingIntegration,
          current: file.yaml.integration_points,
          suggested: missingIntegration.reduce((acc: any, key) => {
            acc[key] = inferIntegrationPoint(file, key);
            return acc;
          }, {})
        });
      }
    }
    
    // Forbidden keys
    const forbidden = STANDARD_TEMPLATE.forbidden.filter(key => 
      file.yaml[key] !== undefined && file.yaml[key] !== null
    );
    if (forbidden.length > 0) {
      conversionPlan.forbidden_keys.push({
        file: file.relative_path,
        forbidden_keys: forbidden,
        current_values: forbidden.reduce((acc: any, key) => {
          acc[key] = file.yaml[key];
          return acc;
        }, {})
      });
    }
  });
  
  return conversionPlan;
}

function generateFieldFunctionAudit(files: FileMetadata[]): any {
  const audit = {
    total_files: files.length,
    with_field_function: 0,
    complete_field_function: 0,
    missing_console_context: [] as any[],
    missing_console_relation: [] as any[],
    incomplete_field_function: [] as any[]
  };
  
  files.forEach(file => {
    if (!file.has_yaml) return;
    
    if (file.yaml.field_function && typeof file.yaml.field_function === 'object') {
      audit.with_field_function++;
      
      const hasContentPurpose = !!file.yaml.field_function.content_purpose;
      const hasPrimaryMechanism = !!file.yaml.field_function.primary_mechanism;
      const hasConsoleContext = !!file.yaml.field_function.console_context;
      const hasConsoleRelation = !!file.yaml.field_function.console_relation;
      
      if (hasContentPurpose && hasPrimaryMechanism && hasConsoleContext && hasConsoleRelation) {
        audit.complete_field_function++;
      } else {
        audit.incomplete_field_function.push({
          file: file.relative_path,
          has_content_purpose: hasContentPurpose,
          has_primary_mechanism: hasPrimaryMechanism,
          has_console_context: hasConsoleContext,
          has_console_relation: hasConsoleRelation
        });
      }
      
      if (!hasConsoleContext) {
        audit.missing_console_context.push({
          file: file.relative_path,
          suggested: inferConsoleContext(file)
        });
      }
      
      if (!hasConsoleRelation) {
        audit.missing_console_relation.push({
          file: file.relative_path,
          suggested: inferConsoleRelation(file)
        });
      }
    }
  });
  
  return audit;
}

// Inference helpers
function inferValues(file: FileMetadata, missingKeys: string[]): any {
  const inferred: any = {};
  
  missingKeys.forEach(key => {
    if (key === 'type') {
      inferred.type = file.is_locked_book_chapter ? 'book_chapter' : 'essay';
    } else if (key === 'author') {
      inferred.author = 'Gigi Stardust';
    } else if (key === 'status') {
      inferred.status = 'canonical';
    } else if (key === 'version') {
      inferred.version = '1.0';
    }
  });
  
  return inferred;
}

function inferContentPurpose(file: FileMetadata): string {
  // Try to infer from existing field_function or title
  if (file.yaml.field_function?.content_purpose) {
    return file.yaml.field_function.content_purpose;
  }
  return `Content purpose for ${file.yaml.title || file.relative_path}`;
}

function inferPrimaryMechanism(file: FileMetadata): string {
  if (file.yaml.field_function?.primary_mechanism) {
    return file.yaml.field_function.primary_mechanism;
  }
  // Try to infer from orb_associations
  if (file.yaml.orb_associations) {
    const primaryOrb = Array.isArray(file.yaml.orb_associations) 
      ? file.yaml.orb_associations[0]
      : file.yaml.orb_associations.primary_orb;
    return `${primaryOrb} - primary mechanism`;
  }
  return 'Primary mechanism to be defined';
}

function inferConsoleContext(file: FileMetadata): string {
  if (file.yaml.field_function?.console_context) {
    return file.yaml.field_function.console_context;
  }
  // Infer from file location
  if (file.relative_path.includes('Orb_Essays')) {
    return 'orb_explorer';
  } else if (file.relative_path.includes('codex_essays')) {
    return 'codex_viewer';
  }
  return 'general';
}

function inferConsoleRelation(file: FileMetadata): string {
  if (file.yaml.field_function?.console_relation) {
    return file.yaml.field_function.console_relation;
  }
  return 'standalone';
}

function inferFieldFunctionValue(file: FileMetadata, key: string): string {
  if (key === 'content_purpose') return inferContentPurpose(file);
  if (key === 'primary_mechanism') return inferPrimaryMechanism(file);
  if (key === 'console_context') return inferConsoleContext(file);
  if (key === 'console_relation') return inferConsoleRelation(file);
  return '';
}

function inferIntegrationPoint(file: FileMetadata, key: string): boolean {
  if (key === 'codex') {
    return !file.relative_path.includes('generated_book_content');
  }
  if (key === 'console_views') {
    return true; // Most content should be viewable in console
  }
  if (key === 'editorial_pass') {
    return false; // Default to false, set manually
  }
  return false;
}

async function runAudit() {
  console.log('🔍 Metadata Integrity and Template Audit\n');
  console.log('='.repeat(70));
  
  // Scan files
  console.log('📁 Scanning content files...');
  const files = scanContentFiles();
  console.log(`✅ Found ${files.length} files\n`);
  
  // Validate each file
  console.log('🔎 Validating files...');
  files.forEach(file => {
    file.issues = validateFile(file);
  });
  console.log(`✅ Validated ${files.length} files\n`);
  
  // Analyze template
  console.log('📊 Analyzing template patterns...');
  const analysis = analyzeTemplate(files);
  console.log(`✅ Analyzed ${analysis.all_keys.size} unique keys\n`);
  
  // Generate reports
  console.log('📝 Generating reports...');
  
  const templateReport = generateTemplateReport(analysis, files);
  const templateReportPath = path.join(__dirname, '../METADATA_TEMPLATE_REPORT.md');
  fs.writeFileSync(templateReportPath, templateReport, 'utf-8');
  console.log(`✅ Template report: ${templateReportPath}`);
  
  const conversionPlan = generateConversionPlan(files);
  const conversionPlanPath = path.join(__dirname, '../METADATA_CONVERSION_PLAN.json');
  fs.writeFileSync(conversionPlanPath, JSON.stringify(conversionPlan, null, 2), 'utf-8');
  console.log(`✅ Conversion plan: ${conversionPlanPath}`);
  
  const fieldFunctionAudit = generateFieldFunctionAudit(files);
  const fieldFunctionAuditPath = path.join(__dirname, '../FIELD_FUNCTION_AUDIT.json');
  fs.writeFileSync(fieldFunctionAuditPath, JSON.stringify(fieldFunctionAudit, null, 2), 'utf-8');
  console.log(`✅ Field function audit: ${fieldFunctionAuditPath}\n`);
  
  // Summary
  console.log('='.repeat(70));
  console.log('📊 AUDIT SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Files: ${files.length}`);
  console.log(`Files with Issues: ${files.filter(f => f.issues.length > 0).length}`);
  console.log(`Type Conversions Needed: ${conversionPlan.type_conversions.length}`);
  console.log(`Missing Keys: ${conversionPlan.missing_keys.length}`);
  console.log(`Field Function Updates: ${conversionPlan.field_function_updates.length}`);
  console.log(`Integration Points Updates: ${conversionPlan.integration_points_updates.length}`);
  console.log(`Forbidden Keys Found: ${conversionPlan.forbidden_keys.length}`);
  console.log(`\nField Function Completeness:`);
  console.log(`  With field_function: ${fieldFunctionAudit.with_field_function}/${files.length}`);
  console.log(`  Complete: ${fieldFunctionAudit.complete_field_function}/${files.length}`);
  console.log(`  Missing console_context: ${fieldFunctionAudit.missing_console_context.length}`);
  console.log(`  Missing console_relation: ${fieldFunctionAudit.missing_console_relation.length}`);
  console.log('\n✅ Audit complete!\n');
}

runAudit()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  });

