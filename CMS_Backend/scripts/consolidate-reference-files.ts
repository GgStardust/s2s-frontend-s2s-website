#!/usr/bin/env tsx
/**
 * Consolidate Reference Files
 * 
 * Processes files from 02_REFERENCE/ folder:
 * - Adds YAML frontmatter if missing
 * - Adds special handling metadata
 * - Moves to 09_PROCESSED/02c_Supporting material/
 * - Updates references
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '../02_REFERENCE');
const TARGET_DIR = path.join(__dirname, '../09_PROCESSED/02c_Supporting material');
const BACKUP_DIR = path.join(__dirname, '../02_REFERENCE/backup_consolidate_' + new Date().toISOString().split('T')[0]);

// File-specific special handling metadata
const fileMetadata: Record<string, {
  title: string;
  use_in_book_compiler: boolean;
  usage_type: 'definition' | 'reference' | 'narrative';
  inclusion_weight: number;
  framework_priority: 'core' | 'auxiliary' | 'experimental';
  use_in_console: boolean;
  console_context: string;
  reference_category: string;
  content_purpose: string;
  framework_handling?: {
    usage_option: string;
    auto_include_keywords: string[];
  };
}> = {
  '03_Language_and_Definitions_CLEAN.md': {
    title: 'Language and Definitions',
    use_in_book_compiler: true,
    usage_type: 'definition',
    inclusion_weight: 0.3,
    framework_priority: 'core',
    use_in_console: true,
    console_context: 'reference_view',
    reference_category: 'language_definitions',
    content_purpose: 'Core language definitions and field-specific terms for S2S system',
    framework_handling: {
      usage_option: 'contextual',
      auto_include_keywords: ['definition', 'term', 'language', 'vocabulary']
    }
  },
  'TAG_REGISTRY.md': {
    title: 'Tag Registry',
    use_in_book_compiler: false,
    usage_type: 'reference',
    inclusion_weight: 0.0,
    framework_priority: 'core',
    use_in_console: true,
    console_context: 'reference_view',
    reference_category: 'tag_system',
    content_purpose: 'Master taxonomy for all tags used across S2S Codex system',
    framework_handling: {
      usage_option: 'reference_layer',
      auto_include_keywords: ['tag', 'taxonomy', 'validation']
    }
  },
  'PROCESSING_WORKFLOW.md': {
    title: 'S2S Codex Processing Workflow',
    use_in_book_compiler: false,
    usage_type: 'reference',
    inclusion_weight: 0.0,
    framework_priority: 'auxiliary',
    use_in_console: true,
    console_context: 'reference_view',
    reference_category: 'processing_workflow',
    content_purpose: 'Active protocol for processing source files into S2S Codex system',
    framework_handling: {
      usage_option: 'reference_layer',
      auto_include_keywords: ['processing', 'workflow', 'protocol']
    }
  },
  'BOOK_COMPILER_IMPLEMENTATION_PLAN_v2.md': {
    title: 'Book Compiler Implementation Plan v2',
    use_in_book_compiler: false,
    usage_type: 'reference',
    inclusion_weight: 0.0,
    framework_priority: 'auxiliary',
    use_in_console: true,
    console_context: 'reference_view',
    reference_category: 'implementation_plan',
    content_purpose: 'Implementation plan and specifications for Book Compiler system',
    framework_handling: {
      usage_option: 'reference_layer',
      auto_include_keywords: ['compiler', 'implementation', 'plan']
    }
  },
  'CONCEPT_MAP.md': {
    title: 'Concept Map',
    use_in_book_compiler: true,
    usage_type: 'reference',
    inclusion_weight: 0.25,
    framework_priority: 'core',
    use_in_console: true,
    console_context: 'framework_index',
    reference_category: 'concept_mapping',
    content_purpose: 'Conceptual mapping and relationships within S2S system',
    framework_handling: {
      usage_option: 'contextual',
      auto_include_keywords: ['concept', 'map', 'relationship', 'connection']
    }
  },
  'Orbital_Brain_Specification.md': {
    title: 'Orbital Brain Specification',
    use_in_book_compiler: true,
    usage_type: 'reference',
    inclusion_weight: 0.3,
    framework_priority: 'core',
    use_in_console: true,
    console_context: 'framework_index',
    reference_category: 'orbital_brain',
    content_purpose: 'Specification for Orbital Brain system architecture and integration',
    framework_handling: {
      usage_option: 'metadata_driven',
      auto_include_keywords: ['orbital', 'brain', 'specification', 'architecture']
    }
  },
  'PROJECT_COMPREHENSIVE_GUIDE.md': {
    title: 'Project Comprehensive Guide',
    use_in_book_compiler: false,
    usage_type: 'reference',
    inclusion_weight: 0.0,
    framework_priority: 'auxiliary',
    use_in_console: true,
    console_context: 'reference_view',
    reference_category: 'project_guide',
    content_purpose: 'Comprehensive guide to S2S project structure and development',
    framework_handling: {
      usage_option: 'reference_layer',
      auto_include_keywords: ['project', 'guide', 'structure']
    }
  },
  'OPPORTUNITY_TRACKING.md': {
    title: 'Opportunity Tracking',
    use_in_book_compiler: false,
    usage_type: 'reference',
    inclusion_weight: 0.0,
    framework_priority: 'auxiliary',
    use_in_console: true,
    console_context: 'reference_view',
    reference_category: 'opportunity_tracking',
    content_purpose: 'Tracking document for opportunities and project development',
    framework_handling: {
      usage_option: 'reference_layer',
      auto_include_keywords: ['opportunity', 'tracking', 'development']
    }
  }
};

interface ConsolidationResult {
  file: string;
  success: boolean;
  action: string;
  hadYAML: boolean;
  errors?: string[];
}

const results: ConsolidationResult[] = [];

function extractTitleFromContent(content: string, filename: string): string {
  // Try to extract title from first heading
  const headingMatch = content.match(/^#+\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].replace(/[*_]/g, '').trim();
  }
  
  // Fallback to filename
  return filename.replace('.md', '').replace(/_/g, ' ');
}

function processFile(filePath: string, filename: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  const metadata = fileMetadata[filename];
  
  if (!metadata) {
    throw new Error(`No metadata configuration for ${filename}`);
  }

  // Check if YAML frontmatter exists
  let parsed;
  let hadYAML = false;
  
  try {
    parsed = matter(content);
    hadYAML = parsed.data && Object.keys(parsed.data).length > 0;
  } catch (error) {
    // No YAML, create from scratch
    parsed = { data: {}, content };
  }

  // Build frontmatter
  const frontmatter: any = {
    title: metadata.title,
    author: 'Gigi Stardust',
    type: 'essay',
    status: 'canonical',
    version: 'V4',
    source_type: 'system_reference',
    system_role: 'reference_document',
    reference_category: metadata.reference_category,
    console_context: metadata.console_context,
    console_relation: 'foundational_framework',
    field_function: {
      content_purpose: metadata.content_purpose,
      primary_mechanism: 'system_reference',
      console_context: metadata.console_context,
      console_relation: 'foundational_framework'
    },
    integration_points: {
      codex: ['ReferenceSystem', 'CodexIndexer'],
      console_views: metadata.use_in_console ? [metadata.console_context] : [],
      editorial_pass: 'V4'
    },
    book_threading: {
      book_id: null,
      target_section: 'system_reference',
      role_in_chapter: metadata.use_in_book_compiler ? 'reference' : 'reference_only'
    },
    resonance_metrics: null,
    // Special handling metadata
    use_in_book_compiler: metadata.use_in_book_compiler,
    usage_type: metadata.usage_type,
    inclusion_weight: metadata.inclusion_weight,
    framework_priority: metadata.framework_priority,
    use_in_console: metadata.use_in_console
  };

  if (metadata.framework_handling) {
    frontmatter.framework_handling = metadata.framework_handling;
  }

  // Preserve existing fields if they exist
  if (parsed.data) {
    // Preserve orb_associations if present
    if (parsed.data.orb_associations) {
      frontmatter.orb_associations = parsed.data.orb_associations;
    }
    
    // Preserve tags if present
    if (parsed.data.tags) {
      frontmatter.tags = parsed.data.tags;
    }
    
    // Preserve other valid fields
    const preserveFields = ['created', 'modified', 'related_to', 'is_primary_source'];
    preserveFields.forEach(field => {
      if (parsed.data[field] !== undefined) {
        frontmatter[field] = parsed.data[field];
      }
    });
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

  return {
    content: `---\n${yamlString}\n---\n\n${parsed.content}`,
    hadYAML
  };
}

async function consolidateFiles() {
  console.log('📦 Consolidating Reference Files\n');
  console.log('='.repeat(70));
  console.log('Processing files from 02_REFERENCE/\n');

  // Create backup
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Ensure target directory exists
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // Get all markdown files
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => ({
      filename: f,
      sourcePath: path.join(SOURCE_DIR, f),
      targetPath: path.join(TARGET_DIR, f)
    }));

  console.log(`Found ${files.length} files to process\n`);

  for (const file of files) {
    console.log(`📄 Processing: ${file.filename}`);

    try {
      // Backup original
      const backupPath = path.join(BACKUP_DIR, file.filename);
      fs.copyFileSync(file.sourcePath, backupPath);

      // Process file
      const { content: enhancedContent, hadYAML } = processFile(file.sourcePath, file.filename);

      // Check if target already exists
      if (fs.existsSync(file.targetPath)) {
        const existingBackup = file.targetPath + '.backup_' + Date.now();
        fs.copyFileSync(file.targetPath, existingBackup);
        console.log(`  ⚠️  Replacing existing file (backed up)`);
        results.push({
          file: file.filename,
          success: true,
          action: 'replaced',
          hadYAML
        });
      } else {
        results.push({
          file: file.filename,
          success: true,
          action: 'moved',
          hadYAML
        });
      }

      // Write to target with enhanced metadata
      fs.writeFileSync(file.targetPath, enhancedContent, 'utf-8');
      console.log(`  ✅ Processed${hadYAML ? ' (had YAML, enhanced)' : ' (added YAML)'}`);

    } catch (error: any) {
      console.log(`  ❌ Failed: ${error.message}`);
      results.push({
        file: file.filename,
        success: false,
        action: 'failed',
        hadYAML: false,
        errors: [error.message]
      });
    }
    console.log('');
  }

  // Generate report
  const reportPath = path.join(__dirname, '../REFERENCE_FILES_CONSOLIDATION_REPORT.md');
  const report = generateReport();
  fs.writeFileSync(reportPath, report, 'utf-8');

  console.log('='.repeat(70));
  console.log('📊 Summary\n');
  console.log(`Total Files: ${files.length}`);
  console.log(`Successful: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  console.log(`Files with YAML: ${results.filter(r => r.hadYAML).length}`);
  console.log(`Files without YAML: ${results.filter(r => !r.hadYAML && r.success).length}`);
  console.log(`\n✅ Backup: ${BACKUP_DIR}`);
  console.log(`✅ Report: ${reportPath}\n`);
}

function generateReport(): string {
  const lines: string[] = [];

  lines.push('# Reference Files Consolidation Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  lines.push('## Summary\n');
  lines.push(`- **Total Files:** ${results.length}`);
  lines.push(`- **Successful:** ${successful.length}`);
  lines.push(`- **Failed:** ${failed.length}`);
  lines.push(`- **Had YAML:** ${results.filter(r => r.hadYAML).length}`);
  lines.push(`- **Added YAML:** ${results.filter(r => !r.hadYAML && r.success).length}\n`);

  lines.push('## Files Processed\n');
  successful.forEach(result => {
    lines.push(`### ${result.file}\n`);
    lines.push(`**Action:** ${result.action}`);
    lines.push(`**Had YAML:** ${result.hadYAML ? 'Yes' : 'No'}`);
    const metadata = fileMetadata[result.file];
    if (metadata) {
      lines.push(`**Book Compiler:** ${metadata.use_in_book_compiler ? 'Enabled' : 'Disabled'}`);
      lines.push(`**Usage Type:** ${metadata.usage_type}`);
      lines.push(`**Inclusion Weight:** ${metadata.inclusion_weight}`);
      lines.push(`**Framework Priority:** ${metadata.framework_priority}`);
      lines.push(`**Console:** ${metadata.use_in_console ? 'Enabled' : 'Disabled'}`);
    }
    lines.push('');
  });

  if (failed.length > 0) {
    lines.push('## Failed Files\n');
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
  lines.push('1. Update `canonical-store.ts` to reference new location');
  lines.push('2. Update any other hardcoded references');
  lines.push('3. Files are now in content library and will be picked up automatically\n');

  return lines.join('\n');
}

consolidateFiles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Consolidation failed:', error);
    process.exit(1);
  });

