import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from '@/lib/cors';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/codex/entries/fallback
 * Fallback endpoint that reads markdown files directly when Supabase has no entries
 * Reads from 02d_Orb_Essays and 02f_S2S_codex_essays directories
 */
export async function GET(request: NextRequest) {
  try {
    const processedDir = path.join(process.cwd(), '09_PROCESSED');
    const orbEssaysDir = path.join(processedDir, '02d_Orb_Essays');
    const codexEssaysDir = path.join(processedDir, '02f_S2S_codex_essays');

    const entries: any[] = [];

    // Helper to extract orb number from orb association string
    const extractOrbNumber = (orbStr: string): number | null => {
      const match = orbStr.match(/Orb\s+(\d+)/i);
      return match ? parseInt(match[1], 10) : null;
    };

    // Helper to parse a markdown file
    const parseFile = (filePath: string, relativePath: string, source: 'orb' | 'codex') => {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = matter(content);
        const frontmatter = parsed.data || {};
        const body = parsed.content;

        // Extract orb associations
        const orbAssociations: number[] = [];
        if (frontmatter.orb_associations) {
          if (frontmatter.orb_associations.primary_orb) {
            const num = extractOrbNumber(frontmatter.orb_associations.primary_orb);
            if (num) orbAssociations.push(num);
          }
          if (Array.isArray(frontmatter.orb_associations.secondary_orbs)) {
            frontmatter.orb_associations.secondary_orbs.forEach((orb: string) => {
              const num = extractOrbNumber(orb);
              if (num && !orbAssociations.includes(num)) orbAssociations.push(num);
            });
          }
        }

        // Extract excerpt (first 150 chars of body)
        const excerpt = body
          .replace(/^#+\s+/gm, '') // Remove headers
          .replace(/\n+/g, ' ') // Replace newlines with spaces
          .trim()
          .substring(0, 150) + (body.length > 150 ? '...' : '');

        const entry = {
          id: relativePath.replace(/[^a-zA-Z0-9]/g, '_'),
          title: frontmatter.title || path.basename(filePath, '.md').replace(/_/g, ' '),
          content: body,
          excerpt,
          author: frontmatter.author || 'Gigi Stardust',
          type: frontmatter.type || 'essay',
          category: frontmatter.category || 'foundational',
          codex_category: source === 'orb' ? 'essay' : (frontmatter.codex_category || 'essay'),
          status: frontmatter.status || 'canonical',
          created: frontmatter.created || null,
          modified: frontmatter.modified || null,
          orb_associations: orbAssociations,
          orb_associations_obj: frontmatter.orb_associations || {},
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          field_function: frontmatter.field_function || {},
          is_primary_source: frontmatter.is_primary_source !== false,
          book_threading: frontmatter.book_threading || null,
          file_path: relativePath,
          source_type: source,
        };

        return entry;
      } catch (error) {
        console.warn(`Failed to parse ${filePath}:`, error);
        return null;
      }
    };

    // Load Orb Essays
    if (fs.existsSync(orbEssaysDir)) {
      const orbFiles = fs.readdirSync(orbEssaysDir).filter(f => f.endsWith('.md'));
      orbFiles.forEach(filename => {
        const filePath = path.join(orbEssaysDir, filename);
        const relativePath = `02d_Orb_Essays/${filename}`;
        const entry = parseFile(filePath, relativePath, 'orb');
        if (entry) entries.push(entry);
      });
    }

    // Load Codex Essays
    if (fs.existsSync(codexEssaysDir)) {
      const codexFiles = fs.readdirSync(codexEssaysDir).filter(f => f.endsWith('.md'));
      codexFiles.forEach(filename => {
        const filePath = path.join(codexEssaysDir, filename);
        const relativePath = `02f_S2S_codex_essays/${filename}`;
        const entry = parseFile(filePath, relativePath, 'codex');
        if (entry) entries.push(entry);
      });
    }

    // Sort by created date or filename
    entries.sort((a, b) => {
      if (a.created && b.created) {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      }
      return b.title.localeCompare(a.title);
    });

    const origin = request.headers.get('origin');
    return NextResponse.json(
      {
        entries: entries,
        count: entries.length,
        source: 'file_system',
      },
      {
        headers: getCorsHeaders(origin),
      }
    );
  } catch (err: any) {
    console.error('Error in fallback codex entries:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Failed to load codex entries', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}
