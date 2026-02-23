#!/usr/bin/env tsx

/**
 * Export All Scrollstreams (API Version)
 * 
 * Fetches all scrollstreams using API endpoints instead of direct database access.
 * This version works by calling the existing API routes.
 * 
 * Usage:
 *   Option 1: Run with Next.js dev server running (http://localhost:3000)
 *   Option 2: Set BASE_URL environment variable to your deployed URL
 */

import fs from 'fs';
import path from 'path';

interface ScrollstreamEntry {
  id: string;
  content: string;
  orb_associations?: number[] | string[];
  tags?: string[];
  status?: string;
  resonance_score?: number;
  scrollstream_type?: string;
  created_at?: string;
  updated_at?: string;
  source?: string;
  file_path?: string;
  title?: string;
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function fetchFromAPI(endpoint: string, params?: Record<string, string>): Promise<any> {
  const url = new URL(endpoint, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    if (error.message?.includes('ECONNREFUSED') || error.message?.includes('fetch failed')) {
      throw new Error(
        `Cannot connect to ${BASE_URL}. Make sure:\n` +
        `  1. Next.js dev server is running (npm run dev)\n` +
        `  2. Or set BASE_URL environment variable to your deployed URL`
      );
    }
    throw error;
  }
}

async function fetchAllScrollstreams(): Promise<ScrollstreamEntry[]> {
  const allScrollstreams: ScrollstreamEntry[] = [];

  console.log('📜 Fetching scrollstreams via API...\n');
  console.log(`   Base URL: ${BASE_URL}\n`);

  // 1. Fetch from scrollstreams API (all statuses)
  console.log('   Fetching from /api/scrollstreams...');
  try {
    const statuses = ['active', 'draft', 'published', 'archived'];
    
    for (const status of statuses) {
      try {
        const response = await fetchFromAPI('/api/scrollstreams', {
          status,
          limit: '1000'
        });
        
        const scrollstreams = response.scrollstreams || [];
        const tableEntries: ScrollstreamEntry[] = scrollstreams.map((item: any) => ({
          id: item.id,
          content: item.content || '',
          orb_associations: item.orb_associations || [],
          tags: item.tags || [],
          status: item.status || 'unknown',
          resonance_score: item.resonance_score,
          scrollstream_type: item.scrollstream_type || 'pulse',
          created_at: item.created_at,
          updated_at: item.updated_at,
          source: 'scrollstreams_table'
        }));
        allScrollstreams.push(...tableEntries);
        console.log(`     ✅ Found ${tableEntries.length} ${status} scrollstreams`);
      } catch (error: any) {
        console.warn(`     ⚠️  Error fetching ${status}: ${error.message}`);
      }
    }
    
    console.log(`   ✅ Total from scrollstreams table: ${allScrollstreams.length}\n`);
  } catch (error: any) {
    console.error('   ❌ Error fetching from scrollstreams API:', error.message);
  }

  // 2. Fetch from console content API (content_files with scrollstreams)
  console.log('   Fetching from /api/console/content...');
  try {
    const response = await fetchFromAPI('/api/console/content', {
      console_view: 'ScrollStream'
    });
    
    const contentFiles = response.data || [];
    const contentEntries: ScrollstreamEntry[] = [];
    
    contentFiles.forEach((file: any) => {
      // Extract from scrollstreams array if present
      if (file.scrollstreams && Array.isArray(file.scrollstreams)) {
        file.scrollstreams.forEach((content: string, index: number) => {
          if (content && content.trim()) {
            contentEntries.push({
              id: `${file.id}_scrollstream_${index}`,
              content: content.trim(),
              orb_associations: file.orb_associations || [],
              tags: file.tags || [],
              status: 'extracted',
              created_at: file.created_at,
              updated_at: file.updated_at,
              source: 'content_files',
              file_path: file.file_path || '',
              title: file.title
            });
          }
        });
      }
      
      // Extract @scrollstream tags from content
      const content = file.content || file.markdown_body || '';
      if (content) {
        const scrollstreamRegex = /@scrollstream[:\s]*([^\n@]+)/gi;
        const matches = Array.from(content.matchAll(scrollstreamRegex));
        
        matches.forEach((match: RegExpMatchArray, index: number) => {
          const scrollContent = match[1]?.trim();
          if (scrollContent && scrollContent.length > 0) {
            // Check if already added
            const alreadyAdded = contentEntries.some(
              s => s.content === scrollContent && s.file_path === file.file_path
            );
            
            if (!alreadyAdded) {
              contentEntries.push({
                id: `${file.id}_tag_${index}`,
                content: scrollContent,
                orb_associations: file.orb_associations || [],
                tags: file.tags || [],
                status: 'tag_extracted',
                created_at: file.created_at,
                source: 'content_files_tag',
                file_path: file.file_path || '',
                title: file.title
              });
            }
          }
        });
      }
    });
    
    allScrollstreams.push(...contentEntries);
    console.log(`   ✅ Found ${contentEntries.length} scrollstreams from content files\n`);
  } catch (error: any) {
    console.error('   ❌ Error fetching from console content API:', error.message);
  }

  // 3. Also fetch all content files to extract more @scrollstream tags
  console.log('   Fetching all content files for tag extraction...');
  try {
    const response = await fetchFromAPI('/api/console/content');
    const allContentFiles = response.data || [];
    
    const extractedEntries: ScrollstreamEntry[] = [];
    
    allContentFiles.forEach((file: any) => {
      const content = file.content || file.markdown_body || '';
      if (content) {
        const scrollstreamRegex = /@scrollstream[:\s]*([^\n@]+)/gi;
        const matches = Array.from(content.matchAll(scrollstreamRegex));
        
        matches.forEach((match: RegExpMatchArray, index: number) => {
          const scrollContent = match[1]?.trim();
          if (scrollContent && scrollContent.length > 0) {
            // Check if we already have this
            const alreadyAdded = allScrollstreams.some(
              s => s.content === scrollContent && s.file_path === file.file_path
            );
            
            if (!alreadyAdded) {
              extractedEntries.push({
                id: `${file.id}_tag_${index}`,
                content: scrollContent,
                orb_associations: file.orb_associations || [],
                tags: file.tags || [],
                status: 'tag_extracted',
                created_at: file.created_at,
                source: 'content_files_tag',
                file_path: file.file_path || '',
                title: file.title
              });
            }
          }
        });
      }
    });
    
    allScrollstreams.push(...extractedEntries);
    console.log(`   ✅ Extracted ${extractedEntries.length} additional scrollstreams from tags\n`);
  } catch (error: any) {
    console.error('   ❌ Error extracting tags from content files:', error.message);
  }

  // Deduplicate by content and file_path
  const uniqueScrollstreams: ScrollstreamEntry[] = [];
  const seen = new Set<string>();
  
  allScrollstreams.forEach(entry => {
    const key = `${entry.content}|${entry.file_path || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueScrollstreams.push(entry);
    }
  });

  return uniqueScrollstreams;
}

function formatScrollstreamMarkdown(scrollstreams: ScrollstreamEntry[]): string {
  let markdown = `# All Scrollstreams\n\n`;
  markdown += `**Total Count:** ${scrollstreams.length}\n\n`;
  markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
  markdown += `**Source:** ${BASE_URL}\n\n`;
  markdown += `---\n\n`;

  // Group by source
  const bySource = scrollstreams.reduce((acc, s) => {
    const source = s.source || 'unknown';
    if (!acc[source]) acc[source] = [];
    acc[source].push(s);
    return acc;
  }, {} as Record<string, ScrollstreamEntry[]>);

  Object.entries(bySource).forEach(([source, entries]) => {
    markdown += `## ${source.replace(/_/g, ' ').toUpperCase()}\n\n`;
    markdown += `**Count:** ${entries.length}\n\n`;

    entries.forEach((entry, index) => {
      markdown += `### ${index + 1}. ${entry.id.substring(0, 8)}...\n\n`;
      
      if (entry.title) {
        markdown += `**Title:** ${entry.title}\n\n`;
      }
      
      if (entry.file_path) {
        markdown += `**Source File:** \`${entry.file_path}\`\n\n`;
      }
      
      if (entry.orb_associations && entry.orb_associations.length > 0) {
        const orbs = Array.isArray(entry.orb_associations) 
          ? entry.orb_associations.join(', ')
          : String(entry.orb_associations);
        markdown += `**Orb Associations:** ${orbs}\n\n`;
      }
      
      if (entry.tags && entry.tags.length > 0) {
        markdown += `**Tags:** ${entry.tags.join(', ')}\n\n`;
      }
      
      if (entry.status) {
        markdown += `**Status:** ${entry.status}\n\n`;
      }
      
      if (entry.resonance_score !== null && entry.resonance_score !== undefined) {
        markdown += `**Resonance Score:** ${entry.resonance_score}\n\n`;
      }
      
      if (entry.scrollstream_type) {
        markdown += `**Type:** ${entry.scrollstream_type}\n\n`;
      }
      
      markdown += `**Content:**\n\n`;
      markdown += `> ${entry.content}\n\n`;
      
      if (entry.created_at) {
        markdown += `*Created: ${new Date(entry.created_at).toLocaleString()}*\n\n`;
      }
      
      markdown += `---\n\n`;
    });
  });

  // Also create a simple list version
  markdown += `\n\n# Simple List (Content Only)\n\n`;
  scrollstreams.forEach((entry, index) => {
    markdown += `${index + 1}. ${entry.content}\n\n`;
  });

  return markdown;
}

async function main() {
  try {
    console.log('🚀 Starting scrollstream export via API...\n');

    const scrollstreams = await fetchAllScrollstreams();

    if (scrollstreams.length === 0) {
      console.log('\n⚠️  No scrollstreams found.');
      console.log('   Make sure your Next.js server is running (npm run dev)');
      return;
    }

    console.log(`\n✅ Total unique scrollstreams found: ${scrollstreams.length}\n`);

    // Format as markdown
    const markdown = formatScrollstreamMarkdown(scrollstreams);

    // Write to file
    const outputPath = path.resolve(process.cwd(), 'all_scrollstreams_export.md');
    fs.writeFileSync(outputPath, markdown, 'utf-8');

    console.log(`\n✅ Export complete!`);
    console.log(`   File saved to: ${outputPath}`);
    console.log(`   Total scrollstreams: ${scrollstreams.length}`);
    
    // Print summary by source
    const bySource = scrollstreams.reduce((acc, s) => {
      const source = s.source || 'unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log(`\n   Breakdown by source:`);
    Object.entries(bySource).forEach(([source, count]) => {
      console.log(`     - ${source}: ${count}`);
    });

  } catch (error: any) {
    console.error('\n❌ Error exporting scrollstreams:', error.message);
    if (error.message?.includes('ECONNREFUSED') || error.message?.includes('fetch failed')) {
      console.error('\n💡 Tip: Make sure your Next.js dev server is running:');
      console.error('   cd CMS_Backend && npm run dev');
    }
    process.exit(1);
  }
}

main();

