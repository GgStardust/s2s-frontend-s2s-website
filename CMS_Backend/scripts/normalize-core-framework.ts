#!/usr/bin/env tsx
/**
 * Normalize Core Framework Files
 * 
 * Normalizes 01_CORE_FRAMEWORK files to match the metadata schema:
 * - Convert types to "essay" (for consistency)
 * - Add system_reference metadata
 * - Add field_function structure
 * - Convert integration_points to object
 * - Remove static RBI metrics
 * - Add console metadata
 * - Ensure Book Compiler exclusion
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORE_FRAMEWORK_DIR = path.join(__dirname, '../01_CORE_FRAMEWORK');
const BACKUP_DIR = path.join(__dirname, '../01_CORE_FRAMEWORK/backup_normalize_' + new Date().toISOString().split('T')[0]);

interface NormalizationResult {
  file: string;
  success: boolean;
  changes: string[];
  errors?: string[];
}

const results: NormalizationResult[] = [];

// File-specific configurations
const fileConfigs: Record<string, {
  reference_category: string;
  content_purpose: string;
  console_views: string[];
}> = {
  'CANONICAL_13_ORB_SYSTEM_REFERENCE.md': {
    reference_category: 'orb_framework',
    content_purpose: 'Single source of truth for 13-Orb system definitions, Orb personalities, and system integration',
    console_views: ['SystemReferenceView', 'OrbExplorer', 'CodexArchitecture']
  },
  'codex_Orb_Synthesis_Final.md': {
    reference_category: 'orb_framework',
    content_purpose: 'Core synthesis of 13-Orb framework with Orb definitions and foundational principles',
    console_views: ['SystemReferenceView', 'OrbExplorer', 'CodexArchitecture']
  },
  '13_ORB_SYSTEM_OUTLINE.md': {
    reference_category: 'orb_framework',
    content_purpose: 'Comprehensive Orb outline with unique qualities, boundaries, and content development guidelines',
    console_views: ['SystemReferenceView', 'OrbExplorer', 'CodexArchitecture']
  },
  'ORB_SYSTEM_VALIDATOR_INTEGRATION.md': {
    reference_category: 'integration_guide',
    content_purpose: 'Integration guide for Orb System Validator with API endpoints and validation logic',
    console_views: ['SystemReferenceView', 'CodexArchitecture', 'IntegrationGuide']
  },
  'I_Written_System_Description_CLEAN.md': {
    reference_category: 'system_architecture',
    content_purpose: 'System architecture description with Orb map table and functional domains',
    console_views: ['SystemReferenceView', 'CodexArchitecture', 'SystemArchitecture']
  },
  'Stardust to Sovereignty Backbone_ORIGINAL.md': {
    reference_category: 'system_architecture',
    content_purpose: 'Original backbone document with complete system architecture and implementation details',
    console_views: ['SystemReferenceView', 'CodexArchitecture', 'BackboneView']
  },
  'S2S — Undercurrents Codex.md': {
    reference_category: 'orb_framework',
    content_purpose: '12 Undercurrents as contextual anchors supporting the Orb backbone',
    console_views: ['SystemReferenceView', 'OrbExplorer', 'UndercurrentsView']
  }
};

function normalizeFile(filePath: string): NormalizationResult {
  const filename = path.basename(filePath);
  const config = fileConfigs[filename];
  const changes: string[] = [];
  const errors: string[] = [];

  try {
    // Read file
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix common YAML issues
    content = content.replace(/([^"])\"---\n/g, '$1"\n---\n');
    content = content.replace(/([^"])\"---$/gm, '$1"\n---');
    content = content.replace(/:\s*"([^"]+)"---\n/g, ': "$1"\n---\n');
    content = content.replace(/:\s*"([^"]+)"---$/gm, ': "$1"\n---');

    // Parse YAML
    const parsed = matter(content);
    let frontmatter = parsed.data || {};

    // Track changes
    const originalType = frontmatter.type;
    const originalIntegrationPoints = frontmatter.integration_points;
    const hasStaticRBI = frontmatter.resonance_metrics && typeof frontmatter.resonance_metrics === 'object';

    // Normalize type
    if (frontmatter.type && frontmatter.type !== 'essay') {
      changes.push(`type: "${frontmatter.type}" → "essay"`);
      frontmatter.type = 'essay';
    } else if (!frontmatter.type) {
      changes.push('Added type: "essay"');
      frontmatter.type = 'essay';
    }

    // Add system reference metadata
    if (!frontmatter.source_type) {
      changes.push('Added source_type: "system_reference"');
      frontmatter.source_type = 'system_reference';
    }
    
    if (!frontmatter.system_role) {
      changes.push('Added system_role: "core_framework"');
      frontmatter.system_role = 'core_framework';
    }

    if (config && !frontmatter.reference_category) {
      changes.push(`Added reference_category: "${config.reference_category}"`);
      frontmatter.reference_category = config.reference_category;
    }

    // Add console metadata
    if (!frontmatter.console_context) {
      changes.push('Added console_context: "system_reference"');
      frontmatter.console_context = 'system_reference';
    }

    if (!frontmatter.console_relation) {
      changes.push('Added console_relation: "foundational_framework"');
      frontmatter.console_relation = 'foundational_framework';
    }

    // Add field_function
    if (!frontmatter.field_function || typeof frontmatter.field_function !== 'object') {
      changes.push('Added field_function structure');
      frontmatter.field_function = {
        content_purpose: config?.content_purpose || 'System architecture reference',
        primary_mechanism: 'system_reference',
        console_context: 'system_reference',
        console_relation: 'foundational_framework'
      };
    } else {
      // Ensure required fields exist
      if (!frontmatter.field_function.content_purpose && config) {
        frontmatter.field_function.content_purpose = config.content_purpose;
        changes.push('Updated field_function.content_purpose');
      }
      if (!frontmatter.field_function.primary_mechanism) {
        frontmatter.field_function.primary_mechanism = 'system_reference';
        changes.push('Added field_function.primary_mechanism');
      }
      if (!frontmatter.field_function.console_context) {
        frontmatter.field_function.console_context = 'system_reference';
        changes.push('Added field_function.console_context');
      }
      if (!frontmatter.field_function.console_relation) {
        frontmatter.field_function.console_relation = 'foundational_framework';
        changes.push('Added field_function.console_relation');
      }
    }

    // Normalize integration_points (array → object)
    if (Array.isArray(frontmatter.integration_points)) {
      const legacyPoints = [...frontmatter.integration_points];
      changes.push('Converted integration_points from array to object');
      frontmatter.integration_points = {
        codex: config?.console_views || ['OrbFramework', 'SystemArchitecture', 'CodexIndexer'],
        console_views: config?.console_views || ['SystemReferenceView', 'CodexArchitecture'],
        editorial_pass: frontmatter.version || 'V4'
      };
      // Preserve legacy for backward compatibility
      frontmatter.integration_points_legacy = legacyPoints;
    } else if (!frontmatter.integration_points || typeof frontmatter.integration_points !== 'object') {
      changes.push('Added integration_points object');
      frontmatter.integration_points = {
        codex: config?.console_views || ['OrbFramework', 'SystemArchitecture', 'CodexIndexer'],
        console_views: config?.console_views || ['SystemReferenceView', 'CodexArchitecture'],
        editorial_pass: frontmatter.version || 'V4'
      };
    } else {
      // Ensure object structure is complete
      if (!frontmatter.integration_points.codex) {
        frontmatter.integration_points.codex = config?.console_views || ['OrbFramework', 'SystemArchitecture', 'CodexIndexer'];
        changes.push('Added integration_points.codex');
      }
      if (!frontmatter.integration_points.console_views) {
        frontmatter.integration_points.console_views = config?.console_views || ['SystemReferenceView', 'CodexArchitecture'];
        changes.push('Added integration_points.console_views');
      }
      if (!frontmatter.integration_points.editorial_pass) {
        frontmatter.integration_points.editorial_pass = frontmatter.version || 'V4';
        changes.push('Added integration_points.editorial_pass');
      }
    }

    // Add book_threading with exclusion marker
    if (!frontmatter.book_threading || typeof frontmatter.book_threading !== 'object') {
      const legacyThreading = frontmatter.book_threading;
      changes.push('Added book_threading object with exclusion marker');
      frontmatter.book_threading = {
        book_id: null,
        target_section: 'system_reference',
        role_in_chapter: 'reference_only'
      };
      if (legacyThreading) {
        frontmatter.book_threading_legacy = legacyThreading;
      }
    } else {
      // Ensure exclusion marker exists
      if (frontmatter.book_threading.role_in_chapter !== 'reference_only') {
        frontmatter.book_threading.role_in_chapter = 'reference_only';
        changes.push('Updated book_threading.role_in_chapter to "reference_only"');
      }
    }

    // Remove static RBI metrics
    if (hasStaticRBI) {
      changes.push('Removed static RBI metrics → resonance_metrics: null');
      frontmatter.resonance_metrics = null;
    } else if (frontmatter.resonance_metrics === undefined) {
      frontmatter.resonance_metrics = null;
      changes.push('Added resonance_metrics: null');
    }

    // Ensure required fields
    if (!frontmatter.title) {
      frontmatter.title = filename.replace('.md', '');
      changes.push(`Added title: "${frontmatter.title}"`);
    }

    if (!frontmatter.author) {
      frontmatter.author = 'Gigi Stardust';
      changes.push('Added author: "Gigi Stardust"');
    }

    if (!frontmatter.status) {
      frontmatter.status = 'canonical';
      changes.push('Added status: "canonical"');
    }

    if (!frontmatter.version) {
      frontmatter.version = 'V4';
      changes.push('Added version: "V4"');
    }

    // Normalize orb_associations (ensure array format)
    if (frontmatter.orb_associations && !Array.isArray(frontmatter.orb_associations)) {
      // Convert object to array if needed
      if (typeof frontmatter.orb_associations === 'object') {
        const orbArray: string[] = [];
        if (frontmatter.orb_associations.primary_orb) {
          orbArray.push(frontmatter.orb_associations.primary_orb);
        }
        if (Array.isArray(frontmatter.orb_associations.secondary_orbs)) {
          orbArray.push(...frontmatter.orb_associations.secondary_orbs);
        }
        if (Array.isArray(frontmatter.orb_associations.orb_mentions_all)) {
          orbArray.push(...frontmatter.orb_associations.orb_mentions_all);
        }
        frontmatter.orb_associations = [...new Set(orbArray)];
        changes.push('Converted orb_associations from object to array');
      }
    }

    // Serialize YAML
    const yamlString = yaml.dump(frontmatter, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
      flowLevel: -1
    }).trim();

    // Reconstruct file
    const normalizedContent = `---\n${yamlString}\n---\n\n${parsed.content}`;

    // Write normalized file
    fs.writeFileSync(filePath, normalizedContent, 'utf-8');

    return {
      file: filename,
      success: true,
      changes
    };

  } catch (error: any) {
    errors.push(error.message);
    return {
      file: filename,
      success: false,
      changes,
      errors
    };
  }
}

async function normalizeCoreFramework() {
  console.log('🔧 Normalizing Core Framework Files\n');
  console.log('='.repeat(70));
  console.log('Applying metadata schema to system architecture files...\n');

  // Create backup
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Get all markdown files
  const files = fs.readdirSync(CORE_FRAMEWORK_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .map(f => path.join(CORE_FRAMEWORK_DIR, f));

  console.log(`Found ${files.length} files to normalize\n`);

  // Normalize each file
  for (const filePath of files) {
    const filename = path.basename(filePath);
    console.log(`📄 Processing: ${filename}`);

    // Backup
    const backupPath = path.join(BACKUP_DIR, filename);
    fs.copyFileSync(filePath, backupPath);

    // Normalize
    const result = normalizeFile(filePath);
    results.push(result);

    if (result.success) {
      console.log(`  ✅ Success (${result.changes.length} changes)`);
      if (result.changes.length > 0) {
        result.changes.slice(0, 3).forEach(change => console.log(`     - ${change}`));
        if (result.changes.length > 3) {
          console.log(`     ... and ${result.changes.length - 3} more`);
        }
      }
    } else {
      console.log(`  ❌ Failed: ${result.errors?.join(', ')}`);
    }
    console.log('');
  }

  // Generate report
  const reportPath = path.join(__dirname, '../CORE_FRAMEWORK_NORMALIZATION_REPORT.md');
  const report = generateReport();
  fs.writeFileSync(reportPath, report, 'utf-8');

  console.log('='.repeat(70));
  console.log('📊 Summary\n');
  console.log(`Total Files: ${files.length}`);
  console.log(`Successful: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  console.log(`\n✅ Backup: ${BACKUP_DIR}`);
  console.log(`✅ Report: ${reportPath}\n`);
}

function generateReport(): string {
  const lines: string[] = [];

  lines.push('# Core Framework Normalization Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  lines.push('## Summary\n');
  lines.push(`- **Total Files:** ${results.length}`);
  lines.push(`- **Successful:** ${successful.length}`);
  lines.push(`- **Failed:** ${failed.length}\n`);

  if (successful.length > 0) {
    lines.push('## Successful Normalizations\n');
    successful.forEach(result => {
      lines.push(`### ${result.file}\n`);
      lines.push(`**Changes:** ${result.changes.length}\n`);
      result.changes.forEach(change => {
        lines.push(`- ${change}`);
      });
      lines.push('');
    });
  }

  if (failed.length > 0) {
    lines.push('## Failed Normalizations\n');
    failed.forEach(result => {
      lines.push(`### ${result.file}\n`);
      lines.push(`**Errors:**\n`);
      result.errors?.forEach(error => {
        lines.push(`- ${error}`);
      });
      lines.push('');
    });
  }

  lines.push('## Next Steps\n');
  lines.push('1. Verify normalized files have correct metadata');
  lines.push('2. Update Book Compiler to exclude `source_type: "system_reference"`');
  lines.push('3. Verify Console can read normalized files');
  lines.push('4. Test Codex indexer with normalized metadata\n');

  return lines.join('\n');
}

normalizeCoreFramework()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Normalization failed:', error);
    process.exit(1);
  });

