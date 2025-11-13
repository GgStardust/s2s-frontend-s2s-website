#!/usr/bin/env tsx
/**
 * Consolidate Core Framework Files
 * 
 * Moves core framework files from 01_CORE_FRAMEWORK/ to 09_PROCESSED/02c_Supporting material/
 * Adds special handling metadata for Book Compiler and Console
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '../01_CORE_FRAMEWORK');
const TARGET_DIR = path.join(__dirname, '../09_PROCESSED/02c_Supporting material');
const BACKUP_DIR = path.join(__dirname, '../01_CORE_FRAMEWORK/backup_consolidate_' + new Date().toISOString().split('T')[0]);

// File-specific special handling metadata
const fileMetadata: Record<string, {
  use_in_book_compiler: boolean;
  usage_type: 'definition' | 'reference' | 'narrative';
  inclusion_weight: number;
  framework_priority: 'core' | 'auxiliary' | 'experimental';
  use_in_console: boolean;
  console_context: string;
  framework_handling?: {
    usage_option: string;
    auto_include_keywords: string[];
  };
}> = {
  'CANONICAL_13_ORB_SYSTEM_REFERENCE.md': {
    use_in_book_compiler: true,
    usage_type: 'definition',
    inclusion_weight: 0.4,
    framework_priority: 'core',
    use_in_console: true,
    console_context: 'framework_index',
    framework_handling: {
      usage_option: 'metadata_driven',
      auto_include_keywords: ['orb', 'framework', 'system', 'definition']
    }
  },
  'codex_Orb_Synthesis_Final.md': {
    use_in_book_compiler: true,
    usage_type: 'definition',
    inclusion_weight: 0.35,
    framework_priority: 'core',
    use_in_console: true,
    console_context: 'framework_index',
    framework_handling: {
      usage_option: 'metadata_driven',
      auto_include_keywords: ['orb', 'synthesis', 'framework']
    }
  },
  '13_ORB_SYSTEM_OUTLINE.md': {
    use_in_book_compiler: true,
    usage_type: 'reference',
    inclusion_weight: 0.3,
    framework_priority: 'core',
    use_in_console: true,
    console_context: 'reference_view',
    framework_handling: {
      usage_option: 'contextual',
      auto_include_keywords: ['orb', 'outline', 'boundary', 'redundancy']
    }
  },
  'ORB_SYSTEM_VALIDATOR_INTEGRATION.md': {
    use_in_book_compiler: false,
    usage_type: 'reference',
    inclusion_weight: 0.0,
    framework_priority: 'auxiliary',
    use_in_console: true,
    console_context: 'reference_view',
    framework_handling: {
      usage_option: 'reference_layer',
      auto_include_keywords: ['validator', 'validation', 'integration']
    }
  },
  'I_Written_System_Description_CLEAN.md': {
    use_in_book_compiler: true,
    usage_type: 'reference',
    inclusion_weight: 0.25,
    framework_priority: 'core',
    use_in_console: true,
    console_context: 'framework_index',
    framework_handling: {
      usage_option: 'metadata_driven',
      auto_include_keywords: ['system', 'architecture', 'field']
    }
  },
  'Stardust to Sovereignty Backbone_ORIGINAL.md': {
    use_in_book_compiler: true,
    usage_type: 'reference',
    inclusion_weight: 0.2,
    framework_priority: 'core',
    use_in_console: true,
    console_context: 'framework_index',
    framework_handling: {
      usage_option: 'metadata_driven',
      auto_include_keywords: ['backbone', 'system', 'architecture']
    }
  },
  'S2S — Undercurrents Codex.md': {
    use_in_book_compiler: true,
    usage_type: 'definition',
    inclusion_weight: 0.3,
    framework_priority: 'core',
    use_in_console: true,
    console_context: 'reference_view',
    framework_handling: {
      usage_option: 'contextual',
      auto_include_keywords: ['undercurrent', 'contextual', 'anchor']
    }
  }
};

interface ConsolidationResult {
  file: string;
  success: boolean;
  action: string;
  errors?: string[];
}

const results: ConsolidationResult[] = [];

function addSpecialHandlingMetadata(filePath: string, filename: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(content);
  const metadata = fileMetadata[filename];
  
  if (!metadata) {
    throw new Error(`No metadata configuration for ${filename}`);
  }

  // Add special handling fields
  parsed.data.use_in_book_compiler = metadata.use_in_book_compiler;
  parsed.data.usage_type = metadata.usage_type;
  parsed.data.inclusion_weight = metadata.inclusion_weight;
  parsed.data.framework_priority = metadata.framework_priority;
  parsed.data.use_in_console = metadata.use_in_console;
  parsed.data.console_context = metadata.console_context;
  
  if (metadata.framework_handling) {
    parsed.data.framework_handling = metadata.framework_handling;
  }

  // Serialize YAML
  const yamlString = yaml.dump(parsed.data, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
    flowLevel: -1
  }).trim();

  return `---\n${yamlString}\n---\n\n${parsed.content}`;
}

async function consolidateFiles() {
  console.log('📦 Consolidating Core Framework Files\n');
  console.log('='.repeat(70));
  console.log('Moving files to 09_PROCESSED/02c_Supporting material/\n');

  // Create backup
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Ensure target directory exists
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // Get all core framework files (excluding README)
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .map(f => ({
      filename: f,
      sourcePath: path.join(SOURCE_DIR, f),
      targetPath: path.join(TARGET_DIR, f)
    }));

  console.log(`Found ${files.length} files to consolidate\n`);

  for (const file of files) {
    console.log(`📄 Processing: ${file.filename}`);

    try {
      // Backup original
      const backupPath = path.join(BACKUP_DIR, file.filename);
      fs.copyFileSync(file.sourcePath, backupPath);

      // Add special handling metadata
      const enhancedContent = addSpecialHandlingMetadata(file.sourcePath, file.filename);

      // Check if target already exists (for 13_ORB_SYSTEM_OUTLINE.md)
      if (fs.existsSync(file.targetPath)) {
        // Backup existing
        const existingBackup = file.targetPath + '.backup_' + Date.now();
        fs.copyFileSync(file.targetPath, existingBackup);
        console.log(`  ⚠️  Replacing existing file (backed up to ${path.basename(existingBackup)})`);
        results.push({
          file: file.filename,
          success: true,
          action: 'replaced'
        });
      } else {
        results.push({
          file: file.filename,
          success: true,
          action: 'moved'
        });
      }

      // Write to target with enhanced metadata
      fs.writeFileSync(file.targetPath, enhancedContent, 'utf-8');
      console.log(`  ✅ Consolidated with special handling metadata`);

    } catch (error: any) {
      console.log(`  ❌ Failed: ${error.message}`);
      results.push({
        file: file.filename,
        success: false,
        action: 'failed',
        errors: [error.message]
      });
    }
    console.log('');
  }

  // Generate report
  const reportPath = path.join(__dirname, '../CORE_FRAMEWORK_CONSOLIDATION_REPORT.md');
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

  lines.push('# Core Framework Consolidation Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  lines.push('## Summary\n');
  lines.push(`- **Total Files:** ${results.length}`);
  lines.push(`- **Successful:** ${successful.length}`);
  lines.push(`- **Failed:** ${failed.length}\n`);

  lines.push('## Files Consolidated\n');
  successful.forEach(result => {
    lines.push(`### ${result.file}\n`);
    lines.push(`**Action:** ${result.action}`);
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
  lines.push('2. Update Book Compiler to use special handling metadata');
  lines.push('3. Update Console to use new console_context values');
  lines.push('4. Remove old files from `01_CORE_FRAMEWORK/` (after verification)\n');

  return lines.join('\n');
}

consolidateFiles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Consolidation failed:', error);
    process.exit(1);
  });

