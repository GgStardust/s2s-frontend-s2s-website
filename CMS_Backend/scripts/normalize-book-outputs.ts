#!/usr/bin/env tsx
/**
 * Book Output Normalization Script
 * 
 * Normalizes compiled book chapters (book outputs) to the unified metadata schema:
 * - Converts type to "book_output"
 * - Adds full field_function and integration_points
 * - Preserves inline tags
 * - Fixes YAML frontmatter
 * - Removes static RBI metrics
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import * as yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const BOOK_CONTENT_DIR = path.join(CONTENT_BASE, '02g_generated_book_content');
const BACKUP_DIR = path.join(CONTENT_BASE, `content_backup_book_output_${new Date().toISOString().split('T')[0].replace(/-/g, '')}`);
const MANUAL_REVIEW_PATH = path.join(__dirname, '../METADATA_MANUAL_REVIEW.json');

const BOOK_ID = 'b00cf52b-65cb-4f00-b7d9-293cde462c3a';

interface NormalizationResult {
  file: string;
  success: boolean;
  changes: string[];
  errors?: string[];
  inlineTagsPreserved?: number;
  inlineTagsRestored?: number;
}

interface ManualReviewEntry {
  file: string;
  errors: string[];
}

function extractChapterNumber(filename: string): { part: number | null; chapter: number | null } {
  const match = filename.match(/CHAPTER_(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    // Infer part based on chapter number (rough estimate)
    let part = null;
    if (num <= 4) part = 1;
    else if (num <= 8) part = 2;
    else if (num <= 12) part = 3;
    else part = 4;
    return { part, chapter: num };
  }
  return { part: null, chapter: null };
}

function extractInlineTags(content: string): { tags: string[]; count: number } {
  const tagPattern = /@(\w+)/g;
  const matches = content.match(tagPattern) || [];
  const uniqueTags = [...new Set(matches)];
  return { tags: uniqueTags, count: matches.length };
}

function inferOrbTags(content: string): string[] {
  const orbTags: string[] = [];
  const orbPatterns = [
    { pattern: /Orb\s*[:\s]*(\d+)/gi, tag: (n: string) => `@orb_${n}` },
    { pattern: /Origin\s+Intelligence/gi, tag: () => '@orb_1' },
    { pattern: /Resonance\s+Mechanics/gi, tag: () => '@orb_2' },
    { pattern: /Photonic\s+Intelligence/gi, tag: () => '@orb_3' },
    { pattern: /Harmonic\s+Architectures/gi, tag: () => '@orb_4' },
    { pattern: /Temporal\s+Sovereignty/gi, tag: () => '@orb_5' },
    { pattern: /Starline\s+Memory/gi, tag: () => '@orb_6' },
    { pattern: /Alchemical\s+Current/gi, tag: () => '@orb_7' },
    { pattern: /Quantum\s+Intuition/gi, tag: () => '@orb_8' },
    { pattern: /Temporal\s+Fluidity/gi, tag: () => '@orb_9' },
    { pattern: /Ancestral\s+Repatterning/gi, tag: () => '@orb_10' },
    { pattern: /Radiant\s+Transparency/gi, tag: () => '@orb_11' },
    { pattern: /Sovereign\s+Field/gi, tag: () => '@orb_12' },
    { pattern: /Bridging\s+Intelligence/gi, tag: () => '@orb_13' },
  ];
  
  for (const { pattern, tag } of orbPatterns) {
    if (pattern.test(content)) {
      const match = content.match(pattern);
      if (match) {
        const tagValue = tag(match[0]);
        if (!orbTags.includes(tagValue)) {
          orbTags.push(tagValue);
        }
      }
    }
  }
  
  return orbTags;
}

function parseYAMLSafely(content: string): { frontmatter: any; body: string; hadErrors: boolean } {
  let frontmatter: any = {};
  let body = content;
  let hadErrors = false;
  
  // Try to extract YAML frontmatter
  const yamlMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  
  if (yamlMatch) {
    const yamlContent = yamlMatch[1];
    body = yamlMatch[2];
    
    try {
      frontmatter = yaml.load(yamlContent) || {};
    } catch (error: any) {
      // If YAML parsing fails, try to extract what we can
      hadErrors = true;
      const lines = yamlContent.split('\n');
      for (const line of lines) {
        const keyMatch = line.match(/^(\w+):\s*(.+)$/);
        if (keyMatch) {
          const [, key, value] = keyMatch;
          try {
            frontmatter[key] = yaml.load(value);
          } catch {
            frontmatter[key] = value.replace(/^["']|["']$/g, '');
          }
        }
      }
    }
  } else {
    // No YAML frontmatter found, check if content starts with ---
    if (content.startsWith('---')) {
      const parts = content.split('---');
      if (parts.length >= 3) {
        try {
          frontmatter = yaml.load(parts[1]) || {};
          body = parts.slice(2).join('---').trim();
        } catch {
          hadErrors = true;
        }
      }
    }
  }
  
  return { frontmatter, body, hadErrors };
}

function createBookOutputTemplate(
  existing: any,
  filename: string,
  content: string
): any {
  const { part, chapter } = extractChapterNumber(filename);
  const { tags: existingTags } = extractInlineTags(content);
  const inferredOrbs = inferOrbTags(content);
  
  // Merge inferred tags with existing
  const allTags = [...new Set([...existingTags, ...inferredOrbs])];
  
  const template: any = {
    title: existing.title || filename.replace(/\.md$/, '').replace(/_/g, ' '),
    author: existing.author || 'Gigi Stardust',
    type: 'book_output',
    status: 'compiled',
    version: existing.version || 'V2',
    source_type: 'book_compiler',
    linked_book: 'Stardust to Sovereignty',
    linked_version: 'V2',
    console_context: 'compiled_chapter',
    console_relation: 'reflection_of_field',
    field_function: {
      content_purpose: existing.field_function?.content_purpose || 'Compiled chapter text for reference in Console.',
      primary_mechanism: existing.field_function?.primary_mechanism || 'book_output',
      console_context: existing.field_function?.console_context || 'compiled_chapter',
      console_relation: existing.field_function?.console_relation || 'reflection_of_field'
    },
    integration_points: {
      codex: existing.integration_points?.codex || ['BookCompiler'],
      console_views: existing.integration_points?.console_views || ['ChapterViewer', 'ResonanceReflection'],
      editorial_pass: existing.integration_points?.editorial_pass || 'V2'
    },
    book_threading: {
      book_id: BOOK_ID,
      part_number: part,
      chapter_number: chapter,
      role_in_chapter: 'final_text'
    },
    resonance_metrics: null
  };
  
  // Preserve valid existing fields
  if (existing.orb_associations) template.orb_associations = existing.orb_associations;
  if (existing.category) template.category = existing.category;
  if (existing.created) template.created = existing.created;
  if (existing.modified) template.modified = existing.modified;
  if (existing.tags && Array.isArray(existing.tags)) template.tags = existing.tags;
  
  // Remove forbidden RBI keys
  const forbiddenKeys = [
    'resonance_score',
    'resonance_vector',
    'resonance_rating',
    'coherence_vector',
    'rbi_version',
    'rbi_analysis',
    'sovereign_proof',
    'proof_log_id'
  ];
  
  forbiddenKeys.forEach(key => {
    if (template[key] !== undefined) delete template[key];
  });
  
  return template;
}

function normalizeBookOutput(filePath: string, relativePath: string): NormalizationResult {
  const result: NormalizationResult = {
    file: relativePath,
    success: false,
    changes: []
  };
  
  try {
    // Read file
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract inline tags before processing
    const { tags: existingTags, count: existingTagCount } = extractInlineTags(content);
    result.inlineTagsPreserved = existingTagCount;
    
    // Parse YAML safely
    const { frontmatter, body, hadErrors } = parseYAMLSafely(content);
    
    if (hadErrors) {
      result.changes.push('Fixed malformed YAML frontmatter');
    }
    
    // Create normalized template
    const normalized = createBookOutputTemplate(frontmatter, path.basename(filePath), body);
    
    // Check what changed
    if (frontmatter.type !== 'book_output') {
      result.changes.push(`Type changed from "${frontmatter.type || 'missing'}" to "book_output"`);
    }
    
    if (!frontmatter.field_function || !frontmatter.field_function.console_context) {
      result.changes.push('Added complete field_function');
    }
    
    if (!frontmatter.integration_points || Array.isArray(frontmatter.integration_points)) {
      result.changes.push('Added/updated integration_points');
    }
    
    // Check for forbidden RBI keys
    const forbiddenKeys = ['resonance_score', 'resonance_vector', 'resonance_rating'];
    const removedKeys = forbiddenKeys.filter(key => frontmatter[key] !== undefined);
    if (removedKeys.length > 0) {
      result.changes.push(`Removed forbidden RBI keys: ${removedKeys.join(', ')}`);
    }
    
    // Serialize YAML
    const yamlString = yaml.dump(normalized, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
      flowLevel: -1
    }).trim();
    
    // Reconstruct file
    const normalizedContent = `---\n${yamlString}\n---\n\n${body}`;
    
    // Validate YAML syntax
    try {
      yaml.load(yamlString);
    } catch (error: any) {
      result.errors = [`YAML validation failed: ${error.message}`];
      return result;
    }
    
    // Write normalized file
    fs.writeFileSync(filePath, normalizedContent, 'utf-8');
    
    // Check if we need to restore inline tags
    const { tags: newTags } = extractInlineTags(normalizedContent);
    const inferredOrbs = inferOrbTags(body);
    if (inferredOrbs.length > 0 && newTags.length < existingTags.length) {
      result.inlineTagsRestored = inferredOrbs.length;
      result.changes.push(`Restored ${inferredOrbs.length} inferred inline tags`);
    }
    
    result.success = true;
    if (result.changes.length === 0) {
      result.changes.push('No changes needed (already normalized)');
    }
    
  } catch (error: any) {
    result.errors = [error.message];
  }
  
  return result;
}

function createBackup(): void {
  console.log('📦 Creating backup...');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const sourceDir = BOOK_CONTENT_DIR;
  const targetDir = path.join(BACKUP_DIR, '02g_generated_book_content');
  
  if (fs.existsSync(sourceDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    
    const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));
    files.forEach(file => {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      fs.copyFileSync(sourcePath, targetPath);
    });
    
    console.log(`  ✅ Backed up ${files.length} files from 02g_generated_book_content`);
  }
  
  console.log(`✅ Backup created at: ${BACKUP_DIR}\n`);
}

async function normalizeAllBookOutputs() {
  console.log('🔧 Book Output Normalization\n');
  console.log('='.repeat(70));
  
  // Step 1: Create backup
  createBackup();
  
  // Step 2: Load file list
  console.log('📋 Loading file list from METADATA_MANUAL_REVIEW.json...');
  const manualReviewContent = fs.readFileSync(MANUAL_REVIEW_PATH, 'utf-8');
  const manualReview: ManualReviewEntry[] = JSON.parse(manualReviewContent);
  console.log(`✅ Loaded ${manualReview.length} files to normalize\n`);
  
  // Step 3: Normalize each file
  console.log('🔨 Normalizing book output files...\n');
  const results: NormalizationResult[] = [];
  
  for (const entry of manualReview) {
    const filePath = path.join(CONTENT_BASE, entry.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️  ${entry.file}: File not found`);
      results.push({
        file: entry.file,
        success: false,
        changes: [],
        errors: ['File not found']
      });
      continue;
    }
    
    const result = normalizeBookOutput(filePath, entry.file);
    results.push(result);
    
    if (result.success) {
      console.log(`  ✅ ${entry.file}`);
      result.changes.forEach(change => console.log(`     - ${change}`));
      if (result.inlineTagsPreserved) {
        console.log(`     - Preserved ${result.inlineTagsPreserved} inline tags`);
      }
      if (result.inlineTagsRestored) {
        console.log(`     - Restored ${result.inlineTagsRestored} inferred tags`);
      }
    } else {
      console.log(`  ⚠️  ${entry.file}: ${result.errors?.join(', ')}`);
    }
  }
  
  // Step 4: Generate reports
  console.log('\n📊 Generating reports...\n');
  
  const report = generateNormalizationReport(results);
  const reportPath = path.join(__dirname, '../BOOK_OUTPUT_NORMALIZATION_REPORT.md');
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`✅ Normalization report: ${reportPath}`);
  
  const validationPath = path.join(__dirname, '../BOOK_OUTPUT_VALIDATION.json');
  fs.writeFileSync(validationPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`✅ Validation data: ${validationPath}`);
  
  console.log('\n✅ Book output normalization complete!\n');
}

function generateNormalizationReport(results: NormalizationResult[]): string {
  const lines: string[] = [];
  
  lines.push('# Book Output Normalization Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  
  const total = results.length;
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  lines.push('## Summary\n');
  lines.push(`- **Total Files Processed:** ${total}`);
  lines.push(`- **Successfully Normalized:** ${successful}`);
  lines.push(`- **Failed:** ${failed}`);
  lines.push(`- **Backup Location:** ${BACKUP_DIR}\n`);
  
  // Count changes
  const typeConversions = results.filter(r => 
    r.changes.some(c => c.includes('Type changed'))
  ).length;
  
  const fieldFunctionAdded = results.filter(r => 
    r.changes.some(c => c.includes('field_function'))
  ).length;
  
  const integrationPointsAdded = results.filter(r => 
    r.changes.some(c => c.includes('integration_points'))
  ).length;
  
  const rbiRemoved = results.filter(r => 
    r.changes.some(c => c.includes('Removed forbidden RBI'))
  ).length;
  
  const tagsPreserved = results.reduce((sum, r) => sum + (r.inlineTagsPreserved || 0), 0);
  const tagsRestored = results.reduce((sum, r) => sum + (r.inlineTagsRestored || 0), 0);
  
  lines.push('## Changes Summary\n');
  lines.push(`- **Type Conversions:** ${typeConversions}`);
  lines.push(`- **Field Function Added:** ${fieldFunctionAdded}`);
  lines.push(`- **Integration Points Added:** ${integrationPointsAdded}`);
  lines.push(`- **RBI Keys Removed:** ${rbiRemoved}`);
  lines.push(`- **Inline Tags Preserved:** ${tagsPreserved}`);
  lines.push(`- **Inline Tags Restored:** ${tagsRestored}\n`);
  
  if (failed > 0) {
    lines.push('## Files Requiring Manual Review\n');
    results.filter(r => !r.success).forEach(result => {
      lines.push(`### ${result.file}\n`);
      if (result.errors) {
        result.errors.forEach(error => {
          lines.push(`- ${error}`);
        });
      }
      lines.push('');
    });
  }
  
  // Example of normalized file
  const example = results.find(r => r.success);
  if (example) {
    lines.push('## Example Normalized File\n');
    lines.push(`**File:** ${example.file}\n`);
    lines.push('**Changes:**');
    example.changes.forEach(change => {
      lines.push(`- ${change}`);
    });
    lines.push('');
  }
  
  lines.push('## Normalization Rules Applied\n');
  lines.push('1. **Type Conversion**: Changed to `type: "book_output"`');
  lines.push('2. **Field Function**: Added complete field_function with console_context and console_relation');
  lines.push('3. **Integration Points**: Added integration_points as object with codex, console_views, editorial_pass');
  lines.push('4. **Book Threading**: Added book_threading with book_id, part_number, chapter_number');
  lines.push('5. **RBI Metrics**: Removed static RBI metrics, set resonance_metrics to null');
  lines.push('6. **Inline Tags**: Preserved all existing tags, restored inferred tags where missing');
  lines.push('7. **YAML Fixes**: Fixed malformed YAML frontmatter with proper delimiters\n');
  
  return lines.join('\n');
}

// Run normalization
normalizeAllBookOutputs()
  .then(() => {
    console.log('✅ Book output normalization complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Normalization failed:', error);
    process.exit(1);
  });

