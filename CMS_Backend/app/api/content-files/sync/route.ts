import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Only process these specific directories
const TARGET_DIRECTORIES = [
  '02d_Orb_Essays',
  '02f_S2S_codex_essays',
  '02g_generated_book_content'
];

// Scrollstreams are searched via resonance kernel (YAML + inline snake tags)
// No extraction needed - frontend will extract @scrollstream tags for display

type ValidationResult = { valid: true } | { valid: false; errors: string[] };

function validateFrontmatter(frontmatter: any, relativePath: string): ValidationResult {
  const errors: string[] = [];

  // Basic required fields
  if (!frontmatter || typeof frontmatter !== 'object') {
    errors.push('Missing or invalid YAML frontmatter');
    return { valid: false, errors };
  }
  if (!frontmatter.title) errors.push('Missing required field: title');
  if (!frontmatter.type) errors.push('Missing required field: type');
  
  // Validate type field - must be "essay" or "book_output"
  if (frontmatter.type && frontmatter.type !== 'essay' && frontmatter.type !== 'book_output') {
    errors.push(`Invalid type: "${frontmatter.type}" (must be "essay" or "book_output")`);
  }

  // Folder-specific schema rules
  if (relativePath.startsWith('02d_Orb_Essays') || relativePath.startsWith('02f_S2S_codex_essays')) {
    // Essays expect orb_associations as object
    const oa = frontmatter.orb_associations;
    if (!oa || Array.isArray(oa) || typeof oa !== 'object') {
      errors.push('orb_associations must be an object for essays');
    }
  }
  if (relativePath.startsWith('02g_generated_book_content')) {
    // Book chapters expect orb_associations as array (flat list)
    const oa = frontmatter.orb_associations;
    if (!Array.isArray(oa)) {
      errors.push('orb_associations must be an array for book content');
    }
  }

  // Optional: guard against duplicate top-level keys that often cause mapping errors
  // gray-matter already parses, but we can sanity check common fields
  const prohibitedPlainHeaders = ['Core System Integration', 'Field Function Analysis', 'Resonance Metrics', 'System Integration', 'Content Tags'];
  for (const key of prohibitedPlainHeaders) {
    if (frontmatter[key as any] !== undefined) {
      errors.push(`Invalid YAML key detected (should be a comment): ${key}`);
    }
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

async function importFile(filePath: string, relativePath: string, supabase: any, stats: any) {
  try {
    stats.total++;
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content: markdownBody } = matter(fileContent);

    // Pre-sync validation
    const validation = validateFrontmatter(frontmatter, relativePath);
    if (validation.valid === false) {
      stats.errors++;
      return { success: false, relativePath, error: `YAML validation failed: ${validation.errors.join('; ')}` };
    }
    
    // Extract orb associations
    let orbAssociations: string[] = [];
    if (frontmatter.orb_associations) {
      if (Array.isArray(frontmatter.orb_associations)) {
        orbAssociations = frontmatter.orb_associations;
      } else if (typeof frontmatter.orb_associations === 'object') {
        const orbRefs = new Set<string>();
        if (frontmatter.orb_associations.primary_orb) {
          orbRefs.add(frontmatter.orb_associations.primary_orb);
        }
        if (frontmatter.orb_associations.secondary_orbs?.length) {
          frontmatter.orb_associations.secondary_orbs.forEach((orb: string) => orbRefs.add(orb));
        }
        if (frontmatter.orb_associations.orb_mentions_all?.length) {
          frontmatter.orb_associations.orb_mentions_all.forEach((orb: string) => orbRefs.add(orb));
        }
        orbAssociations = Array.from(orbRefs);
      }
    }

    const contentData = {
      title: frontmatter.title || path.basename(filePath, '.md'),
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
      // book_assignment removed - not in schema
      is_primary_source: frontmatter.is_primary_source !== false,
      related_to: frontmatter.related_to || [],
    };

    const { data, error } = await supabase
      .from('content_files')
      .upsert(contentData, {
        onConflict: 'file_path',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Error importing ${relativePath}:`, error.message);
      stats.errors++;
      return;
    }

    stats.imported++;

    // Scrollstreams remain inline in content - frontend will extract via @scrollstream tags
    // No database extraction needed - resonance kernel searches via YAML and inline tags

    return { success: true, relativePath };
  } catch (err: any) {
    console.error(`❌ Error processing ${relativePath}:`, err.message);
    stats.errors++;
    return { success: false, error: err.message, relativePath };
  }
}

async function scanDirectory(dirPath: string, relativePath: string, supabase: any, stats: any, results: any[]) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const itemRelativePath = path.join(relativePath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (TARGET_DIRECTORIES.includes(item)) {
        await scanDirectory(fullPath, itemRelativePath, supabase, stats, results);
      }
    } else if (item.endsWith('.md') && !item.startsWith('.')) {
      // Skip non-content files (but allow manuscript files in 02g_generated_book_content)
      const skipFiles = [
        'README',
        'README_COMPILATION',
        'STARDUST_TO_SOVEREIGNTY_MAIN_CONTENT',
        'STARDUST_TO_SOVEREIGNTY_READER_VERSION',
      ];
      // Allow manuscript files in 02g_generated_book_content to be synced
      const isManuscriptFile = item.includes('STARDUST_TO_SOVEREIGNTY') && itemRelativePath.startsWith('02g_generated_book_content');
      const shouldSkip = !isManuscriptFile && skipFiles.some(skip => item.includes(skip));
      if (shouldSkip) {
        return; // Skip this file
      }
      
      const result = await importFile(fullPath, itemRelativePath, supabase, stats);
      if (result) results.push(result);
    }
  }
}

/**
 * POST /api/content-files/sync
 * 
 * Re-scans the file system and imports/updates all content files
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const processedDir = path.join(process.cwd(), '09_PROCESSED');
    
    if (!fs.existsSync(processedDir)) {
      return NextResponse.json(
        { success: false, error: '09_PROCESSED directory not found' },
        { status: 404 }
      );
    }

    const stats = {
      total: 0,
      imported: 0,
      errors: 0,
    };
    const results: any[] = [];

    await scanDirectory(processedDir, '', supabase, stats, results);

    return NextResponse.json({
      success: true,
      message: 'Content library sync completed',
      stats: {
        total: stats.total,
        imported: stats.imported,
        errors: stats.errors,
      },
      results: results.slice(0, 10), // First 10 results for preview
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
