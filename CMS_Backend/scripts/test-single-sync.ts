#!/usr/bin/env tsx

/**
 * Test syncing a single file to debug issues
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testSync() {
  const testFile = path.join(process.cwd(), '09_PROCESSED/02g_generated_book_content/CHAPTER_01_THE_STARDUST_WITHIN.md');
  const relativePath = '02g_generated_book_content/CHAPTER_01_THE_STARDUST_WITHIN.md';
  
  console.log('🧪 Testing single file sync...\n');
  console.log(`File: ${testFile}\n`);
  
  const fileContent = fs.readFileSync(testFile, 'utf8');
  const { data: frontmatter, content: markdownBody } = matter(fileContent);
  
  console.log('✅ YAML parsed successfully');
  console.log(`   Title: ${frontmatter.title}`);
  console.log(`   Type: ${frontmatter.type}`);
  console.log(`   Version: ${frontmatter.version}`);
  console.log(`   Orb associations: ${Array.isArray(frontmatter.orb_associations) ? 'array ✓' : typeof frontmatter.orb_associations}\n`);
  
  // Extract orb associations
  let orbAssociations: string[] = [];
  if (frontmatter.orb_associations) {
    if (Array.isArray(frontmatter.orb_associations)) {
      orbAssociations = frontmatter.orb_associations;
    }
  }
  
  const contentData = {
    title: frontmatter.title || path.basename(testFile, '.md'),
    file_path: relativePath,
    content_type: frontmatter.type || 'essay',
    status: frontmatter.status || 'active',
    markdown_body: markdownBody,
    yaml_frontmatter: frontmatter,
    orb_associations: orbAssociations,
    tags: frontmatter.tags || [],
    resonance_rating: frontmatter.resonance_rating || 5,
    resonance_metrics: frontmatter.resonance_metrics || {
      strength: 10,
      clarity: 10,
      coherence: 10,
      pattern: 10,
    },
    dashboard_component: frontmatter.dashboard_component || null,
    codex_destination: frontmatter.codex_destination || null,
    book_threading: frontmatter.book_threading || null,
    book_assignment: frontmatter.book_assignment || 'none',
    is_primary_source: frontmatter.is_primary_source !== false,
    related_to: frontmatter.related_to || [],
  };
  
  console.log('📤 Attempting database upsert...\n');
  
  const { data, error } = await supabase
    .from('content_files')
    .upsert(contentData, {
      onConflict: 'file_path',
      ignoreDuplicates: false,
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Database error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Details:', error.details);
    return;
  }
  
  console.log('✅ Successfully synced!');
  console.log(`   ID: ${data.id}`);
  console.log(`   Version in DB: ${(data.yaml_frontmatter as any)?.version}`);
  console.log(`   Modified in DB: ${(data.yaml_frontmatter as any)?.modified}\n`);
}

testSync();

