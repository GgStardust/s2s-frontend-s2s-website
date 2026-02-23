#!/usr/bin/env tsx

/**
 * Export All Scrollstreams
 * 
 * Fetches all scrollstreams from the database and exports them to a markdown file.
 * Includes scrollstreams from both:
 * - scrollstreams table (dedicated scrollstream entries)
 * - content_files table (extracted from @scrollstream tags)
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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
  source?: string; // 'scrollstreams_table' or 'content_files'
  file_path?: string; // For content_files entries
}

async function fetchAllScrollstreams(): Promise<ScrollstreamEntry[]> {
  const allScrollstreams: ScrollstreamEntry[] = [];

  console.log('📜 Fetching scrollstreams from database...\n');

  // 1. Fetch from scrollstreams table (all statuses)
  console.log('   Fetching from scrollstreams table...');
  try {
    // Try fetching all statuses by fetching each status separately
    const statuses = ['active', 'draft', 'published', 'archived'];
    let tableScrollstreams: any[] = [];
    
    for (const status of statuses) {
      const { data, error } = await supabase
        .from('scrollstreams')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn(`   ⚠️  Error fetching ${status} scrollstreams:`, error.message);
      } else if (data) {
        tableScrollstreams.push(...data);
      }
    }
    
    // Also try without status filter
    const { data: allData, error: allError } = await supabase
      .from('scrollstreams')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    
    if (!allError && allData) {
      // Merge and deduplicate
      const existingIds = new Set(tableScrollstreams.map(s => s.id));
      allData.forEach(item => {
        if (!existingIds.has(item.id)) {
          tableScrollstreams.push(item);
        }
      });
    }

    const tableEntries: ScrollstreamEntry[] = tableScrollstreams.map((item: any) => ({
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
    console.log(`   ✅ Found ${tableEntries.length} scrollstreams in table`);
  } catch (error: any) {
    console.error('   ❌ Error fetching from scrollstreams table:', error.message || error);
  }

  // 2. Fetch from content_files table (extracted @scrollstream tags)
  console.log('\n   Fetching from content_files table...');
  try {
    const { data: contentFiles, error: contentError } = await supabase
      .from('content_files')
      .select('id, title, file_path, scrollstreams, orb_associations, tags, created_at, updated_at')
      .not('scrollstreams', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (contentError) {
      console.error('   ❌ Error fetching from content_files table:', contentError.message || contentError);
    } else {
    const contentEntries: ScrollstreamEntry[] = [];
    (contentFiles || []).forEach((file: any) => {
      const scrollstreams = file.scrollstreams || [];
      if (Array.isArray(scrollstreams) && scrollstreams.length > 0) {
        scrollstreams.forEach((content: string, index: number) => {
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
              file_path: file.file_path || ''
            });
          }
        });
      }
    });
      allScrollstreams.push(...contentEntries);
      console.log(`   ✅ Found ${contentEntries.length} scrollstreams extracted from content files`);
    }
  } catch (error: any) {
    console.error('   ❌ Error fetching from content_files table:', error.message || error);
  }

  // 3. Also extract @scrollstream tags directly from content_files content
  console.log('\n   Extracting @scrollstream tags from content...');
  try {
    const { data: allContentFiles, error: allContentError } = await supabase
      .from('content_files')
      .select('id, title, file_path, content, markdown_body, orb_associations, tags, created_at')
      .or('content.not.is.null,markdown_body.not.is.null')
      .order('created_at', { ascending: false })
      .limit(500);

    if (allContentError) {
      console.error('   ❌ Error fetching content for tag extraction:', allContentError.message || allContentError);
    } else {
    const extractedEntries: ScrollstreamEntry[] = [];
    (allContentFiles || []).forEach((file: any) => {
      const content = file.content || file.markdown_body || '';
      if (content) {
        // Extract @scrollstream tags
        const scrollstreamRegex = /@scrollstream[:\s]*([^\n@]+)/gi;
        const matches = Array.from(content.matchAll(scrollstreamRegex));
        
        matches.forEach((match: RegExpMatchArray, index: number) => {
          const scrollContent = match[1]?.trim();
          if (scrollContent && scrollContent.length > 0) {
            // Check if we already have this from the scrollstreams array
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
                file_path: file.file_path || ''
              });
            }
          }
        });
      }
    });
      allScrollstreams.push(...extractedEntries);
      console.log(`   ✅ Extracted ${extractedEntries.length} additional scrollstreams from @scrollstream tags`);
    }
  } catch (error: any) {
    console.error('   ❌ Error extracting @scrollstream tags:', error.message || error);
  }

  return allScrollstreams;
}

function formatScrollstreamMarkdown(scrollstreams: ScrollstreamEntry[]): string {
  let markdown = `# All Scrollstreams\n\n`;
  markdown += `**Total Count:** ${scrollstreams.length}\n\n`;
  markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
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
    console.log('🚀 Starting scrollstream export...\n');

    const scrollstreams = await fetchAllScrollstreams();

    if (scrollstreams.length === 0) {
      console.log('\n⚠️  No scrollstreams found in database.');
      return;
    }

    console.log(`\n✅ Total scrollstreams found: ${scrollstreams.length}\n`);

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

  } catch (error) {
    console.error('\n❌ Error exporting scrollstreams:', error);
    process.exit(1);
  }
}

main();

