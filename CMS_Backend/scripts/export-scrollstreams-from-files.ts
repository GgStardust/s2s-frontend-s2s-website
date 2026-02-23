#!/usr/bin/env tsx

/**
 * Export Scrollstreams from File System
 * 
 * Reads markdown files directly from the file system and extracts all scrollstreams.
 * This version doesn't require database or API access.
 * 
 * Scans:
 * - 09_PROCESSED/02d_Orb_Essays/
 * - 09_PROCESSED/02f_S2S_codex_essays/
 * - 09_PROCESSED/02g_generated_book_content/
 * - 01_CORE_FRAMEWORK/ (if exists)
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ScrollstreamEntry {
  id: string;
  content: string;
  orb_associations?: number[] | string[];
  tags?: string[];
  file_path: string;
  title?: string;
  source: string;
  line_number?: number;
}

const TARGET_DIRECTORIES = [
  '09_PROCESSED/02d_Orb_Essays',
  '09_PROCESSED/02f_S2S_codex_essays',
  '09_PROCESSED/02g_generated_book_content',
  '01_CORE_FRAMEWORK'
];

function extractScrollstreamsFromContent(content: string, filePath: string): ScrollstreamEntry[] {
  const entries: ScrollstreamEntry[] = [];
  const lines = content.split('\n');
  
  // Method 1: Extract **@scrollstream** followed by next line
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    const nextLine = lines[i + 1]?.trim();
    
    if (line === '**@scrollstream**' && nextLine && nextLine.length > 0) {
      entries.push({
        id: `${filePath}_line_${i + 1}`,
        content: nextLine,
        file_path: filePath,
        source: 'markdown_bold_tag',
        line_number: i + 2
      });
    }
  }
  
  // Method 2: Extract @scrollstream tags (regex pattern)
  const scrollstreamRegex = /@scrollstream[:\s]*([^\n@]+)/gi;
  const matches = Array.from(content.matchAll(scrollstreamRegex));
  
  matches.forEach((match, index) => {
    const scrollContent = match[1]?.trim();
    if (scrollContent && scrollContent.length > 0) {
      // Check if already added from method 1
      const alreadyAdded = entries.some(
        e => e.content === scrollContent && e.file_path === filePath
      );
      
      if (!alreadyAdded) {
        // Find line number
        const contentBeforeMatch = content.substring(0, match.index || 0);
        const lineNumber = contentBeforeMatch.split('\n').length;
        
        entries.push({
          id: `${filePath}_tag_${index}`,
          content: scrollContent,
          file_path: filePath,
          source: 'markdown_tag',
          line_number: lineNumber
        });
      }
    }
  });
  
  return entries;
}

function scanDirectory(dirPath: string, basePath: string): ScrollstreamEntry[] {
  const allEntries: ScrollstreamEntry[] = [];
  
  if (!fs.existsSync(dirPath)) {
    console.log(`   ⚠️  Directory not found: ${dirPath}`);
    return allEntries;
  }
  
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    const relativePath = path.relative(basePath, fullPath);
    
    if (file.isDirectory()) {
      // Recursively scan subdirectories
      allEntries.push(...scanDirectory(fullPath, basePath));
    } else if (file.name.endsWith('.md')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const { data: frontmatter, content: markdownBody } = matter(content);
        
        const scrollstreams = extractScrollstreamsFromContent(markdownBody, relativePath);
        
        // Enrich with metadata from frontmatter
        scrollstreams.forEach(entry => {
          entry.orb_associations = frontmatter.orb_associations || [];
          entry.tags = frontmatter.tags || [];
          entry.title = frontmatter.title || path.basename(file.name, '.md');
        });
        
        allEntries.push(...scrollstreams);
        
        if (scrollstreams.length > 0) {
          console.log(`   ✅ ${relativePath}: ${scrollstreams.length} scrollstream(s)`);
        }
      } catch (error: any) {
        console.error(`   ❌ Error reading ${relativePath}:`, error.message);
      }
    }
  }
  
  return allEntries;
}

function formatScrollstreamMarkdown(scrollstreams: ScrollstreamEntry[]): string {
  let markdown = `# All Scrollstreams (File System Export)\n\n`;
  markdown += `**Total Count:** ${scrollstreams.length}\n\n`;
  markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
  markdown += `**Source:** File system scan\n\n`;
  markdown += `---\n\n`;

  // Group by source file
  const byFile = scrollstreams.reduce((acc, s) => {
    const file = s.file_path || 'unknown';
    if (!acc[file]) acc[file] = [];
    acc[file].push(s);
    return acc;
  }, {} as Record<string, ScrollstreamEntry[]>);

  Object.entries(byFile).forEach(([filePath, entries]) => {
    const firstEntry = entries[0];
    markdown += `## ${firstEntry.title || filePath}\n\n`;
    markdown += `**File:** \`${filePath}\`\n\n`;
    
    if (firstEntry.orb_associations && firstEntry.orb_associations.length > 0) {
      const orbs = Array.isArray(firstEntry.orb_associations) 
        ? firstEntry.orb_associations.join(', ')
        : String(firstEntry.orb_associations);
      markdown += `**Orb Associations:** ${orbs}\n\n`;
    }
    
    if (firstEntry.tags && firstEntry.tags.length > 0) {
      markdown += `**Tags:** ${firstEntry.tags.join(', ')}\n\n`;
    }
    
    markdown += `**Scrollstreams (${entries.length}):**\n\n`;
    
    entries.forEach((entry, index) => {
      markdown += `### ${index + 1}. ${entry.content.substring(0, 50)}${entry.content.length > 50 ? '...' : ''}\n\n`;
      markdown += `> ${entry.content}\n\n`;
      if (entry.line_number) {
        markdown += `*Line ${entry.line_number} | Source: ${entry.source}*\n\n`;
      }
      markdown += `---\n\n`;
    });
  });

  // Simple list version
  markdown += `\n\n# Simple List (Content Only)\n\n`;
  scrollstreams.forEach((entry, index) => {
    markdown += `${index + 1}. ${entry.content}\n\n`;
  });

  return markdown;
}

async function main() {
  try {
    console.log('🚀 Starting scrollstream export from file system...\n');
    
    const basePath = process.cwd();
    const allScrollstreams: ScrollstreamEntry[] = [];
    
    for (const dir of TARGET_DIRECTORIES) {
      const fullPath = path.join(basePath, dir);
      console.log(`📁 Scanning: ${dir}...`);
      const entries = scanDirectory(fullPath, basePath);
      allScrollstreams.push(...entries);
      console.log(`   Found ${entries.length} scrollstream(s) in ${dir}\n`);
    }
    
    // Deduplicate
    const uniqueScrollstreams: ScrollstreamEntry[] = [];
    const seen = new Set<string>();
    
    allScrollstreams.forEach(entry => {
      const key = `${entry.content}|${entry.file_path}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueScrollstreams.push(entry);
      }
    });
    
    if (uniqueScrollstreams.length === 0) {
      console.log('\n⚠️  No scrollstreams found in file system.');
      console.log('   Checked directories:');
      TARGET_DIRECTORIES.forEach(dir => {
        const exists = fs.existsSync(path.join(basePath, dir));
        console.log(`     ${exists ? '✅' : '❌'} ${dir}`);
      });
      return;
    }
    
    console.log(`\n✅ Total unique scrollstreams found: ${uniqueScrollstreams.length}\n`);
    
    // Format and write
    const markdown = formatScrollstreamMarkdown(uniqueScrollstreams);
    const outputPath = path.join(basePath, 'all_scrollstreams_export.md');
    fs.writeFileSync(outputPath, markdown, 'utf-8');
    
    console.log(`\n✅ Export complete!`);
    console.log(`   File saved to: ${outputPath}`);
    console.log(`   Total scrollstreams: ${uniqueScrollstreams.length}`);
    
    // Summary by directory
    const byDir = uniqueScrollstreams.reduce((acc, s) => {
      const dir = s.file_path.split('/')[0] || 'unknown';
      acc[dir] = (acc[dir] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log(`\n   Breakdown by directory:`);
    Object.entries(byDir).forEach(([dir, count]) => {
      console.log(`     - ${dir}: ${count}`);
    });
    
  } catch (error: any) {
    console.error('\n❌ Error exporting scrollstreams:', error.message);
    process.exit(1);
  }
}

main();

