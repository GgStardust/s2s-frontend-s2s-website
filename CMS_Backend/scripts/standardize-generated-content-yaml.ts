#!/usr/bin/env tsx

/**
 * Standardize Generated Content YAML
 * 
 * Converts generated book content YAML to match the existing content library format
 * for proper Supabase integration.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const GENERATED_CONTENT_DIR = path.join(process.cwd(), '09_PROCESSED/02g_generated_book_content');

interface StandardizedYAML {
  title: string;
  author: string;
  type: string;
  category: string;
  status: string;
  version: string;
  created: string;
  modified: string;
  
  // Core System Integration
  orb_associations: string[];
  
  // Field Function Analysis
  field_function: {
    content_purpose: string;
    primary_mechanism: string;
    secondary_mechanisms: string[];
    resonance_indicators: string[];
    integration_points: string[];
  };
  
  // Resonance Metrics
  resonance_metrics: {
    strength: number;
    clarity: number;
    coherence: number;
    pattern: number;
    overall_score: number;
  };
  
  // System Integration
  integration_points: string[];
  book_threading: string;
  is_primary_source: boolean;
  related_files: string[];
}

function standardizeYAML(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content: markdownContent } = matter(content);
  
  // Determine content type and category
  let type = 'book_fragment';
  let category = 'foundational';
  
  if (filePath.includes('CHAPTER_')) {
    type = 'book_chapter';
  } else if (filePath.includes('INTERLUDE_')) {
    type = 'book_interlude';
  } else if (filePath.includes('ORB_AXIS_MAP') || filePath.includes('SOMATIC_CODEX_DIAGRAM')) {
    type = 'system_architecture';
  } else if (filePath.includes('SCROLLSTREAM_')) {
    type = 'scrollstream_entry';
  }
  
  // Extract Orb associations from existing YAML
  const primaryOrb = frontmatter.orb_associations?.primary_orb || 
                    frontmatter.orb_associations?.primary || 
                    'Orb 1: Origin Intelligence';
  
  const secondaryOrbs = frontmatter.orb_associations?.secondary_orbs || 
                       frontmatter.orb_associations?.secondary || 
                       [];
  
  const orbMentionsAll = frontmatter.orb_associations?.orb_mentions_all || 
                        frontmatter.orb_mentions_all || 
                        [];
  
  // Create standardized YAML
  const standardizedYAML: StandardizedYAML = {
    title: frontmatter.title || path.basename(filePath, '.md'),
    author: frontmatter.author || 'Gigi Stardust',
    type,
    category,
    status: frontmatter.status === 'compiled' ? 'coherent_refined' : 'canonical',
    version: frontmatter.version || '1.0',
    created: frontmatter.created || '2025-10-28',
    modified: frontmatter.modified || '2025-10-28',
    
    orb_associations: [primaryOrb, ...(Array.isArray(secondaryOrbs) ? secondaryOrbs : [secondaryOrbs]).filter(Boolean), ...(Array.isArray(orbMentionsAll) ? orbMentionsAll : [orbMentionsAll]).filter(Boolean)],
    
    field_function: {
      content_purpose: frontmatter.field_function?.content_purpose || 
                     `Generated ${type} content for Stardust to Sovereignty book compilation`,
      primary_mechanism: frontmatter.field_function?.primary_mechanism || 
                       `${primaryOrb} - primary mechanism for this content`,
      secondary_mechanisms: frontmatter.field_function?.secondary_mechanisms || 
                           secondaryOrbs.map((orb: any) => `${orb} - secondary mechanism`),
      resonance_indicators: frontmatter.field_function?.resonance_indicators || 
                           ['Generated content', 'Book compilation', 'Resonance-based'],
      integration_points: frontmatter.field_function?.integration_points || 
                         ['Book Compiler', 'Orbital Brain', 'Resonance Engine']
    },
    
    resonance_metrics: {
      strength: frontmatter.resonance_metrics?.strength || 8,
      clarity: frontmatter.resonance_metrics?.clarity || 8,
      coherence: frontmatter.resonance_metrics?.coherence || 8,
      pattern: frontmatter.resonance_metrics?.pattern || 8,
      overall_score: frontmatter.resonance_metrics?.overall_score || 8
    },
    
    integration_points: frontmatter.integration_points || ['Book Compiler', 'Content Library'],
    book_threading: frontmatter.book_assignment || 'Book 1: Stardust to Sovereignty',
    is_primary_source: frontmatter.is_primary_source || true,
    related_files: frontmatter.related_files || []
  };
  
  // Create new content with standardized YAML
  const newContent = `---
${Object.entries(standardizedYAML).map(([key, value]) => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return `${key}:\n${JSON.stringify(value, null, 2).split('\n').map(line => '  ' + line).join('\n')}`;
  }
  return `${key}: ${JSON.stringify(value)}`;
}).join('\n')}
---

${markdownContent}`;
  
  // Write back to file
  fs.writeFileSync(filePath, newContent);
  console.log(`✅ Standardized YAML for: ${path.basename(filePath)}`);
}

function main() {
  console.log('🔄 Standardizing generated content YAML...');
  
  const files = fs.readdirSync(GENERATED_CONTENT_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(GENERATED_CONTENT_DIR, file));
  
  files.forEach(standardizeYAML);
  
  console.log(`✅ Standardized ${files.length} files`);
}

if (require.main === module) {
  main();
}
