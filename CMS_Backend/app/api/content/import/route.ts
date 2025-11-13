/**
 * Content Import API
 * 
 * Modern content ingestion workflow with automatic resonance validation.
 * Accepts multipart/form-data with Markdown files.
 * 
 * Step 4 of Backend Stabilization Plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';
import { runResonanceValidation } from '@/lib/resonance-api';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface ImportResult {
  imported: number;
  updated: number;
  errors: Array<{ file: string; error: string }>;
}

/**
 * Calculate file checksum for change detection
 */
function calculateChecksum(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Extract orb associations from YAML frontmatter
 */
function extractOrbAssociations(frontmatter: any): string[] {
  if (!frontmatter.orb_associations) {
    return [];
  }

  // Handle array format
  if (Array.isArray(frontmatter.orb_associations)) {
    return frontmatter.orb_associations.map((orb: any) => {
      if (typeof orb === 'string') return orb;
      if (typeof orb === 'number') return `Orb ${orb}`;
      if (orb?.primary_orb) return orb.primary_orb;
      return String(orb);
    });
  }

  // Handle object format
  if (typeof frontmatter.orb_associations === 'object') {
    const orbs: string[] = [];
    if (frontmatter.orb_associations.primary_orb) {
      orbs.push(frontmatter.orb_associations.primary_orb);
    }
    if (Array.isArray(frontmatter.orb_associations.secondary_orbs)) {
      orbs.push(...frontmatter.orb_associations.secondary_orbs);
    }
    return orbs;
  }

  return [];
}

/**
 * POST /api/content/import
 * 
 * Accepts multipart/form-data with 'file' field containing Markdown content
 * or JSON with { filePath, content } structure
 */
export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const results: ImportResult = {
    imported: 0,
    updated: 0,
    errors: [],
  };

  try {
    const contentType = request.headers.get('content-type') || '';

    let files: Array<{ path: string; content: string }> = [];

    if (contentType.includes('application/json')) {
      // JSON format: { filePath, content } or [{ filePath, content }, ...]
      const body = await request.json();
      files = Array.isArray(body) ? body : [body];
    } else if (contentType.includes('multipart/form-data')) {
      // Multipart form data
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const filePath = formData.get('filePath') as string || 'unknown.md';

      if (file) {
        const content = await file.text();
        files = [{ path: filePath, content }];
      }
    } else {
      // Try to parse as single file content
      const content = await request.text();
      if (content) {
        files = [{ path: 'imported.md', content }];
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Process each file
    for (const file of files) {
      try {
        const { path, content } = file;

        // Parse frontmatter
        const { data: frontmatter, content: markdownBody } = matter(content);

        // Extract metadata
        const title = frontmatter.title || path.replace(/\.md$/, '').replace(/\//g, ' - ');
        const filePath = frontmatter.file_path || path;
        const contentType = frontmatter.type || frontmatter.content_type || 'essay';
        const status = frontmatter.status || 'active';
        const orbAssociations = extractOrbAssociations(frontmatter);
        const tags = frontmatter.tags || [];
        const version = frontmatter.version || '1.0';
        const modified = frontmatter.modified || new Date().toISOString();

        // Run resonance validation
        let resonanceResult;
        let resonanceMetrics = {
          strength: 10,
          clarity: 10,
          coherence: 10,
          pattern: 10,
        };

        try {
          resonanceResult = await runResonanceValidation(markdownBody, title);
          resonanceMetrics = {
            strength: resonanceResult.metrics.strength,
            clarity: resonanceResult.metrics.clarity,
            coherence: resonanceResult.metrics.coherence,
            pattern: resonanceResult.metrics.pattern,
          };
        } catch (resonanceError) {
          console.warn(`Resonance validation failed for ${path}:`, resonanceError);
          // Continue with default metrics
        }

        // Calculate checksum for change detection (optional - only if column exists)
        const checksum = calculateChecksum(content);

        // Check if file already exists
        const { data: existing } = await supabase
          .from('content_files')
          .select('id')
          .eq('file_path', filePath)
          .single();

        const contentData: any = {
          title,
          file_path: filePath,
          content_type: contentType,
          status,
          markdown_body: markdownBody,
          yaml_frontmatter: frontmatter,
          orb_associations: orbAssociations,
          tags,
          resonance_rating: frontmatter.resonance_rating || 5,
          resonance_metrics: resonanceMetrics,
          // checksum - only include if column exists in schema
          dashboard_component: frontmatter.dashboard_component || null,
          codex_destination: frontmatter.codex_destination || null,
          book_threading: frontmatter.book_threading || null,
          is_primary_source: frontmatter.is_primary_source !== false,
          related_to: frontmatter.related_to || [],
        };

        // Store resonance result in yaml_frontmatter for reference
        if (resonanceResult) {
          contentData.yaml_frontmatter = {
            ...frontmatter,
            _resonance_validation: {
              coherenceScore: resonanceResult.coherenceScore,
              proofStatus: resonanceResult.proofStatus,
              validatedOrbs: resonanceResult.validatedOrbs,
              timestamp: new Date().toISOString(),
            },
          };
        }

        if (existing) {
          // Update existing file (always update for now, can add checksum comparison later)
          const { error: updateError } = await supabase
            .from('content_files')
            .update(contentData)
            .eq('id', existing.id);

          if (updateError) {
            throw updateError;
          }
          results.updated++;
        } else {
          // Insert new file
          const { error: insertError } = await supabase
            .from('content_files')
            .insert(contentData);

          if (insertError) {
            throw insertError;
          }
          results.imported++;
        }
      } catch (fileError: any) {
        results.errors.push({
          file: file.path,
          error: fileError.message || String(fileError),
        });
        console.error(`Error processing file ${file.path}:`, fileError);
      }
    }

    return NextResponse.json({
      success: true,
      summary: results,
    });
  } catch (error: any) {
    console.error('Content import error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        summary: results,
      },
      { status: 500 }
    );
  }
}

