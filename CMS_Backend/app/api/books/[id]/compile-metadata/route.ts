/**
 * Book Compiler API Endpoint
 * 
 * Compiles chapters using the modular book compiler.
 * Supports both metadata-only and full-featured compilation modes.
 * 
 * Request body:
 * {
 *   chapter_id: string (required),
 *   mode?: 'metadata' | 'full' (default: 'metadata'),
 *   config?: Partial<CompilerConfig> (optional overrides)
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as path from 'path';
import { compileChapter } from '@/lib/book-compiler/index.js';
import type { ChapterOutline, CompilerConfig } from '@/lib/book-compiler/index.js';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { chapter_id, mode = 'metadata', config: configOverrides } = body;
    const bookId = params.id;

    if (!chapter_id) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get chapter details from database
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('id, chapter_number, title, description, orb_focus, notes')
      .eq('id', chapter_id)
      .eq('book_id', bookId)
      .single();

    if (chapterError || !chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // Convert database chapter to ChapterOutline
    const chapterOutline: ChapterOutline = {
      chapter_number: chapter.chapter_number,
      title: chapter.title,
      description: chapter.description || chapter.notes || undefined,
      orb_focus: chapter.orb_focus ? parseInt(chapter.orb_focus.toString()) : undefined,
    };

    // Build compiler config based on mode
    const baseConfig: Partial<CompilerConfig> = {
      contentBasePath: path.join(process.cwd(), '09_PROCESSED'),
      orbEssaysPath: path.join(process.cwd(), '09_PROCESSED', '02d_Orb_Essays'),
      codexEssaysPath: path.join(process.cwd(), '09_PROCESSED', '02f_S2S_codex_essays'),
      systemEssaysPath: path.join(process.cwd(), '09_PROCESSED', '02a_System_essays'),
    };

    if (mode === 'full') {
      // Full-featured compilation with all layers
      baseConfig.useRBIDiscovery = true;
      baseConfig.useRBIValidation = true;
      baseConfig.useRBIOrdering = true;
      baseConfig.useOrbitalBrain = true;
      baseConfig.useStyleTraining = true;
      baseConfig.useEditorialLayer = true;
      baseConfig.enableGapBridging = true;
      baseConfig.maxSources = 15;
      baseConfig.minCoherence = 0.7;
    } else {
      // Metadata-only mode (backward compatible)
      baseConfig.useRBIDiscovery = false;
      baseConfig.useRBIValidation = false;
      baseConfig.useRBIOrdering = false;
      baseConfig.useOrbitalBrain = false;
      baseConfig.useStyleTraining = false;
      baseConfig.useEditorialLayer = false;
      baseConfig.enableGapBridging = false;
      baseConfig.maxSources = 3;
    }

    // Merge with any provided overrides
    const finalConfig: Partial<CompilerConfig> = {
      ...baseConfig,
      ...configOverrides,
    };

    // Compile chapter using modular compiler
    const compiled = await compileChapter(chapterOutline, finalConfig);

    // Extract preserved tags from sources
    const allTags = new Set<string>();
    compiled.sources.forEach(source => {
      source.inline_tags.forEach(tag => allTags.add(tag));
    });

    // Build response
    return NextResponse.json({
      success: true,
      chapter_id,
      chapter_number: chapter.chapter_number,
      chapter_title: chapter.title,
      sources: compiled.sources.map(s => ({
        title: s.title,
        file_path: s.file_path,
        tags: s.inline_tags,
        orb_tags: s.orb_tags,
      })),
      compiled_content: compiled.content,
      preserved_tags: Array.from(allTags),
      method: mode,
      layers_applied: compiled.layersApplied || ['metadata_matching'],
      rbi_metrics: compiled.rbi_metrics,
      style_applied: compiled.style_applied,
      warnings: compiled.warnings,
    });

  } catch (error) {
    console.error('Error in book compiler API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

