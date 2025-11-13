#!/usr/bin/env tsx
/**
 * Metadata Normalization Script
 * 
 * Normalizes all content files to the standard metadata template:
 * - Ensures required core keys exist
 * - Converts types to "essay" (except locked book chapters)
 * - Removes forbidden RBI metrics
 * - Normalizes field_function and integration_points
 * - Preserves all inline tags and content
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
const BACKUP_DIR = path.join(CONTENT_BASE, `content_backup_metadata_${new Date().toISOString().split('T')[0].replace(/-/g, '')}`);

const CONVERSION_PLAN_PATH = path.join(__dirname, '../METADATA_CONVERSION_PLAN.json');
const FIELD_FUNCTION_AUDIT_PATH = path.join(__dirname, '../FIELD_FUNCTION_AUDIT.json');

// Forbidden RBI keys (must be removed or set to null)
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

// Types that should be converted to "essay"
const ESSAY_TYPES = [
  'orb_essay',
  'codex_essay',
  'codex_entry',
  'book_fragment',
  'field_note',
  'orb_definition_persona',
  'scrollstream_entry',
  'protocol',
  'system_architecture',
  'research_notes',
  'practical_application_essay',
  'supporting_framework',
  'scroll',
  'codex_scroll'
];

interface NormalizationLog {
  file: string;
  changes: string[];
  errors?: string[];
}

interface ConversionPlan {
  type_conversions: Array<{
    file: string;
    current_type: string;
    target_type: string;
    reason: string;
  }>;
  missing_keys: Array<{
    file: string;
    missing_keys: string[];
    suggested_values: any;
  }>;
  field_function_updates: Array<{
    file: string;
    issue: string;
    suggested?: any;
    missing_keys?: string[];
  }>;
  integration_points_updates: Array<{
    file: string;
    issue: string;
    suggested?: any;
    current?: any;
  }>;
  forbidden_keys: Array<{
    file: string;
    forbidden_keys: string[];
  }>;
}

function loadConversionPlan(): ConversionPlan {
  try {
    const content = fs.readFileSync(CONVERSION_PLAN_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    console.error(`Failed to load conversion plan: ${error.message}`);
    return {
      type_conversions: [],
      missing_keys: [],
      field_function_updates: [],
      integration_points_updates: [],
      forbidden_keys: []
    };
  }
}

function loadFieldFunctionAudit(): any {
  try {
    const content = fs.readFileSync(FIELD_FUNCTION_AUDIT_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    return { missing_console_context: [], missing_console_relation: [] };
  }
}

function isLockedBookChapter(filePath: string): boolean {
  // Book chapters in 02g_generated_book_content are considered locked
  return filePath.includes('02g_generated_book_content');
}

function normalizeType(
  currentType: string | undefined,
  filePath: string,
  conversionPlan: ConversionPlan
): string {
  // Check if this file is in conversion plan
  const conversion = conversionPlan.type_conversions.find(c => 
    filePath.includes(c.file.replace(/^.*\//, '')) || filePath.endsWith(c.file)
  );
  
  if (conversion) {
    return conversion.target_type;
  }
  
  // If it's a locked book chapter, preserve book_chapter type
  if (isLockedBookChapter(filePath)) {
    if (currentType === 'book_chapter' || 
        currentType === 'book_interlude' ||
        currentType === 'book_prologue' ||
        currentType === 'book_epilogue' ||
        currentType === 'book_introduction' ||
        currentType === 'book_conclusion' ||
        currentType === 'book_afterword' ||
        currentType === 'book_frontmatter') {
      return currentType;
    }
  }
  
  // Convert essay-like types to "essay"
  if (currentType && ESSAY_TYPES.includes(currentType)) {
    return 'essay';
  }
  
  // Default to essay if type is missing or unknown
  return currentType || 'essay';
}

function normalizeFieldFunction(
  existing: any,
  filePath: string,
  conversionPlan: ConversionPlan,
  fieldFunctionAudit: any
): any {
  const normalized: any = {
    content_purpose: null,
    primary_mechanism: null,
    console_context: null,
    console_relation: null
  };
  
  // Preserve existing values
  if (existing) {
    if (existing.content_purpose) normalized.content_purpose = existing.content_purpose;
    if (existing.primary_mechanism) normalized.primary_mechanism = existing.primary_mechanism;
    if (existing.secondary_mechanisms) normalized.secondary_mechanisms = existing.secondary_mechanisms;
    if (existing.mentions) normalized.mentions = existing.mentions;
    if (existing.resonance_indicators) normalized.resonance_indicators = existing.resonance_indicators;
    if (existing.integration_points) normalized.integration_points = existing.integration_points;
  }
  
  // Get suggestions from conversion plan
  const update = conversionPlan.field_function_updates.find(u => 
    filePath.includes(u.file.replace(/^.*\//, '')) || filePath.endsWith(u.file)
  );
  
  if (update?.suggested) {
    if (!normalized.console_context && update.suggested.console_context) {
      normalized.console_context = update.suggested.console_context;
    }
    if (!normalized.console_relation && update.suggested.console_relation) {
      normalized.console_relation = update.suggested.console_relation;
    }
    if (!normalized.content_purpose && update.suggested.content_purpose) {
      normalized.content_purpose = update.suggested.content_purpose;
    }
    if (!normalized.primary_mechanism && update.suggested.primary_mechanism) {
      normalized.primary_mechanism = update.suggested.primary_mechanism;
    }
  }
  
  // Get from field function audit
  const consoleContextEntry = fieldFunctionAudit.missing_console_context?.find((e: any) => 
    filePath.includes(e.file.replace(/^.*\//, '')) || filePath.endsWith(e.file)
  );
  if (consoleContextEntry && !normalized.console_context) {
    normalized.console_context = consoleContextEntry.suggested;
  }
  
  const consoleRelationEntry = fieldFunctionAudit.missing_console_relation?.find((e: any) => 
    filePath.includes(e.file.replace(/^.*\//, '')) || filePath.endsWith(e.file)
  );
  if (consoleRelationEntry && !normalized.console_relation) {
    normalized.console_relation = consoleRelationEntry.suggested;
  }
  
  // Infer from file path if still missing
  if (!normalized.console_context) {
    if (filePath.includes('Orb_Essays')) {
      normalized.console_context = 'orb_explorer';
    } else if (filePath.includes('codex_essays')) {
      normalized.console_context = 'codex_viewer';
    } else {
      normalized.console_context = 'general';
    }
  }
  
  if (!normalized.console_relation) {
    normalized.console_relation = 'standalone';
  }
  
  return normalized;
}

function normalizeIntegrationPoints(
  existing: any,
  filePath: string,
  conversionPlan: ConversionPlan
): any {
  const normalized: any = {
    codex: [],
    console_views: [],
    editorial_pass: null
  };
  
  // If it's already an object, preserve values
  if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
    if (existing.codex !== undefined) normalized.codex = existing.codex;
    if (existing.console_views !== undefined) normalized.console_views = existing.console_views;
    if (existing.editorial_pass !== undefined) normalized.editorial_pass = existing.editorial_pass;
    return normalized;
  }
  
  // If it's an array, convert to object
  if (Array.isArray(existing)) {
    // Get suggestions from conversion plan
    const update = conversionPlan.integration_points_updates.find(u => 
      filePath.includes(u.file.replace(/^.*\//, '')) || filePath.endsWith(u.file)
    );
    
    if (update?.suggested) {
      normalized.codex = update.suggested.codex || [];
      normalized.console_views = update.suggested.console_views || [];
      normalized.editorial_pass = update.suggested.editorial_pass || null;
    } else {
      // Infer from array contents
      normalized.codex = existing.includes('codex') || existing.includes('codex_scrolls') ? ['codex'] : [];
      normalized.console_views = existing.includes('console') || existing.includes('dashboard_modules') ? ['console'] : [];
      normalized.editorial_pass = existing.includes('editorial') ? 'V4' : null;
    }
    return normalized;
  }
  
  // If missing, use defaults
  return normalized;
}


function removeForbiddenKeys(frontmatter: any): { removed: string[]; frontmatter: any } {
  const removed: string[] = [];
  const cleaned: any = { ...frontmatter };
  
  FORBIDDEN_KEYS.forEach(key => {
    if (cleaned[key] !== undefined && cleaned[key] !== null) {
      delete cleaned[key];
      removed.push(key);
    }
  });
  
  return { removed, frontmatter: cleaned };
}

function ensureRequiredKeys(
  frontmatter: any,
  filePath: string,
  conversionPlan: ConversionPlan
): { added: string[]; frontmatter: any } {
  const added: string[] = [];
  const normalized: any = { ...frontmatter };
  
  // Title
  if (!normalized.title) {
    const basename = path.basename(filePath, '.md');
    normalized.title = basename.replace(/_/g, ' ');
    added.push('title');
  }
  
  // Author
  if (!normalized.author) {
    normalized.author = 'Gigi Stardust';
    added.push('author');
  }
  
  // Type
  if (!normalized.type) {
    normalized.type = normalizeType(undefined, filePath, conversionPlan);
    added.push('type');
  } else {
    const newType = normalizeType(normalized.type, filePath, conversionPlan);
    if (newType !== normalized.type) {
      normalized.type = newType;
      added.push(`type (changed from ${normalized.type} to ${newType})`);
    }
  }
  
  // Status
  if (!normalized.status) {
    normalized.status = 'canonical';
    added.push('status');
  }
  
  // Version
  if (!normalized.version) {
    normalized.version = '1.0';
    added.push('version');
  }
  
  // Orb associations
  if (!normalized.orb_associations) {
    normalized.orb_associations = [];
    added.push('orb_associations');
  }
  
  // Field function
  if (!normalized.field_function || typeof normalized.field_function !== 'object') {
    normalized.field_function = normalizeFieldFunction(
      normalized.field_function,
      filePath,
      conversionPlan,
      loadFieldFunctionAudit()
    );
    added.push('field_function');
  } else {
    const normalizedFieldFunction = normalizeFieldFunction(
      normalized.field_function,
      filePath,
      conversionPlan,
      loadFieldFunctionAudit()
    );
    const hadChanges = Object.keys(normalizedFieldFunction).some(key => 
      normalized.field_function[key] !== normalizedFieldFunction[key]
    );
    if (hadChanges) {
      normalized.field_function = normalizedFieldFunction;
      added.push('field_function (updated)');
    }
  }
  
  // Integration points
  if (!normalized.integration_points || Array.isArray(normalized.integration_points)) {
    normalized.integration_points = normalizeIntegrationPoints(
      normalized.integration_points,
      filePath,
      conversionPlan
    );
    added.push('integration_points');
  } else {
    const normalizedIntegration = normalizeIntegrationPoints(
      normalized.integration_points,
      filePath,
      conversionPlan
    );
    const hadChanges = JSON.stringify(normalized.integration_points) !== JSON.stringify(normalizedIntegration);
    if (hadChanges) {
      normalized.integration_points = normalizedIntegration;
      added.push('integration_points (converted from array)');
    }
  }
  
  return { added, frontmatter: normalized };
}

function normalizeFile(
  filePath: string,
  conversionPlan: ConversionPlan
): NormalizationLog {
  const log: NormalizationLog = {
    file: path.relative(CONTENT_BASE, filePath),
    changes: []
  };
  
  try {
    // Read file
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix common YAML issues: closing --- on same line as last tag
    content = content.replace(/([^"])\"---\n/g, '$1"\n---\n');
    content = content.replace(/([^"])\"---$/gm, '$1"\n---');
    content = content.replace(/:\s*"([^"]+)"---\n/g, ': "$1"\n---\n');
    content = content.replace(/:\s*"([^"]+)"---$/gm, ': "$1"\n---');
    
    const parsed = matter(content);
    
    // Remove forbidden keys
    const { removed: forbiddenRemoved, frontmatter: cleanedFrontmatter } = removeForbiddenKeys(parsed.data);
    if (forbiddenRemoved.length > 0) {
      log.changes.push(`Removed forbidden keys: ${forbiddenRemoved.join(', ')}`);
    }
    
    // Ensure required keys
    const { added: requiredAdded, frontmatter: normalizedFrontmatter } = ensureRequiredKeys(
      cleanedFrontmatter,
      filePath,
      conversionPlan
    );
    if (requiredAdded.length > 0) {
      log.changes.push(`Added/updated keys: ${requiredAdded.join(', ')}`);
    }
    
    // Reconstruct file with normalized YAML using js-yaml
    const yamlString = yaml.dump(normalizedFrontmatter, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
      flowLevel: -1
    }).trim();
    const normalizedContent = `---\n${yamlString}\n---\n\n${parsed.content}`;
    
    // Write back
    fs.writeFileSync(filePath, normalizedContent, 'utf-8');
    
    if (log.changes.length === 0) {
      log.changes.push('No changes needed');
    }
    
  } catch (error: any) {
    log.errors = [error.message];
  }
  
  return log;
}

function createBackup(): void {
  console.log('📦 Creating backup...');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  // Copy directories
  const dirs = ['02d_Orb_Essays', '02f_S2S_codex_essays', '02g_generated_book_content'];
  
  dirs.forEach(dir => {
    const sourceDir = path.join(CONTENT_BASE, dir);
    const targetDir = path.join(BACKUP_DIR, dir);
    
    if (fs.existsSync(sourceDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      
      const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));
      files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        fs.copyFileSync(sourcePath, targetPath);
      });
      
      console.log(`  ✅ Backed up ${files.length} files from ${dir}`);
    }
  });
  
  console.log(`✅ Backup created at: ${BACKUP_DIR}\n`);
}

function getAllContentFiles(): string[] {
  const files: string[] = [];
  
  const dirs = [
    { path: ORB_ESSAYS_DIR, name: '02d_Orb_Essays' },
    { path: CODEX_ESSAYS_DIR, name: '02f_S2S_codex_essays' },
    { path: BOOK_CONTENT_DIR, name: '02g_generated_book_content' }
  ];
  
  dirs.forEach(({ path: dirPath, name }) => {
    if (fs.existsSync(dirPath)) {
      const dirFiles = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.md'))
        .map(f => path.join(dirPath, f));
      files.push(...dirFiles);
    }
  });
  
  return files;
}

async function normalizeAllFiles() {
  console.log('🔧 Metadata Normalization\n');
  console.log('='.repeat(70));
  
  // Step 1: Create backup
  createBackup();
  
  // Step 2: Load conversion plan
  console.log('📋 Loading conversion plan...');
  const conversionPlan = loadConversionPlan();
  console.log(`✅ Loaded conversion plan with ${conversionPlan.type_conversions.length} type conversions\n`);
  
  // Step 3: Get all files
  console.log('📁 Scanning content files...');
  const allFiles = getAllContentFiles();
  console.log(`✅ Found ${allFiles.length} files\n`);
  
  // Step 4: Normalize each file
  console.log('🔨 Normalizing files...\n');
  const logs: NormalizationLog[] = [];
  const manualReview: NormalizationLog[] = [];
  
  for (const filePath of allFiles) {
    const log = normalizeFile(filePath, conversionPlan);
    logs.push(log);
    
    if (log.errors) {
      manualReview.push(log);
      console.log(`  ⚠️  ${log.file}: ${log.errors.join(', ')}`);
    } else if (log.changes.length > 0 && log.changes[0] !== 'No changes needed') {
      console.log(`  ✅ ${log.file}`);
      log.changes.forEach(change => console.log(`     - ${change}`));
    }
  }
  
  // Step 5: Generate reports
  console.log('\n📊 Generating reports...\n');
  
  const report = generateNormalizationReport(logs, manualReview);
  const reportPath = path.join(__dirname, '../METADATA_NORMALIZATION_REPORT.md');
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`✅ Normalization report: ${reportPath}`);
  
  if (manualReview.length > 0) {
    const manualReviewPath = path.join(__dirname, '../METADATA_MANUAL_REVIEW.json');
    fs.writeFileSync(manualReviewPath, JSON.stringify(manualReview, null, 2), 'utf-8');
    console.log(`⚠️  Manual review needed: ${manualReviewPath}`);
  }
  
  console.log('\n✅ Normalization complete!\n');
}

function generateNormalizationReport(
  logs: NormalizationLog[],
  manualReview: NormalizationLog[]
): string {
  const lines: string[] = [];
  
  lines.push('# Metadata Normalization Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  
  const totalFiles = logs.length;
  const filesWithChanges = logs.filter(l => 
    l.changes.length > 0 && l.changes[0] !== 'No changes needed'
  ).length;
  const filesWithErrors = manualReview.length;
  
  lines.push('## Summary\n');
  lines.push(`- **Total Files Processed:** ${totalFiles}`);
  lines.push(`- **Files Modified:** ${filesWithChanges}`);
  lines.push(`- **Files Requiring Manual Review:** ${filesWithErrors}`);
  lines.push(`- **Backup Location:** ${BACKUP_DIR}\n`);
  
  // Count changes by type
  const typeConversions = logs.filter(l => 
    l.changes.some(c => c.includes('type (changed'))
  ).length;
  
  const forbiddenRemovals = logs.filter(l => 
    l.changes.some(c => c.includes('Removed forbidden keys'))
  ).length;
  
  const fieldFunctionUpdates = logs.filter(l => 
    l.changes.some(c => c.includes('field_function'))
  ).length;
  
  const integrationPointUpdates = logs.filter(l => 
    l.changes.some(c => c.includes('integration_points'))
  ).length;
  
  lines.push('## Changes Summary\n');
  lines.push(`- **Type Conversions:** ${typeConversions}`);
  lines.push(`- **Forbidden Keys Removed:** ${forbiddenRemovals}`);
  lines.push(`- **Field Function Updates:** ${fieldFunctionUpdates}`);
  lines.push(`- **Integration Points Updates:** ${integrationPointUpdates}\n`);
  
  if (manualReview.length > 0) {
    lines.push('## Files Requiring Manual Review\n');
    lines.push('See `METADATA_MANUAL_REVIEW.json` for details.\n');
    manualReview.forEach(log => {
      lines.push(`- **${log.file}**: ${log.errors?.join(', ')}`);
    });
    lines.push('');
  }
  
  lines.push('## Normalization Rules Applied\n');
  lines.push('1. **Type Normalization**: Converted essay-like types to "essay", preserved book_chapter types only in locked directories');
  lines.push('2. **Forbidden Keys Removed**: Removed static RBI metrics (resonance_metrics, resonance_rating, etc.)');
  lines.push('3. **Field Function**: Ensured all files have complete field_function with console_context and console_relation');
  lines.push('4. **Integration Points**: Converted array format to object format with codex, console_views, editorial_pass');
  lines.push('5. **Required Keys**: Added missing required core keys with sensible defaults\n');
  
  return lines.join('\n');
}

// Run normalization
normalizeAllFiles()
  .then(() => {
    console.log('✅ Metadata normalization complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Normalization failed:', error);
    process.exit(1);
  });

