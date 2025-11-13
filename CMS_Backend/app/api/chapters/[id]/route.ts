import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Prevent build-time execution
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/chapters/[id] - Get chapter by ID with sources
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const chapterId = params.id;

    // Get chapter details
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single();

    if (chapterError) {
      return NextResponse.json({ error: chapterError.message }, { status: 500 });
    }

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Get sources for this chapter
    const { data: sources, error: sourcesError } = await supabase
      .from('chapter_sources')
      .select(`
        *,
        content_files (
          id,
          title,
          file_path,
          content_type,
          content,
          markdown_body,
          orb_associations,
          tags,
          resonance_rating,
          resonance_metrics
        )
      `)
      .eq('chapter_id', chapterId)
      .order('relevance_score', { ascending: false });

    if (sourcesError) {
      return NextResponse.json({ error: sourcesError.message }, { status: 500 });
    }

    return NextResponse.json({ chapter, sources: sources || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/chapters/[id] - Update chapter
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const chapterId = params.id;
    const body = await request.json();

    const { title, content, notes, status, word_count, linked_sources, referenced_files, generation_params } = body;

    // Guard: prevent updates if parent book is complete (locked)
    const { data: chapterRow } = await supabase
      .from('chapters')
      .select('id, book_id')
      .eq('id', chapterId)
      .single();

    if (chapterRow?.book_id) {
      const { data: bookRow } = await supabase
        .from('books')
        .select('id, status')
        .eq('id', chapterRow.book_id)
        .single();

      if (bookRow?.status === 'complete') {
        return NextResponse.json({ error: 'Book is locked (complete). Edits are disabled.' }, { status: 423 });
      }
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (notes !== undefined) updateData.notes = notes;
    if (status) updateData.status = status;
    if (word_count !== undefined) updateData.word_count = word_count;
    if (linked_sources !== undefined) updateData.linked_sources = linked_sources;
    if (referenced_files !== undefined) updateData.referenced_files = referenced_files;
    if (generation_params !== undefined) updateData.generation_params = generation_params;

    const { data: chapter, error } = await supabase
      .from('chapters')
      .update(updateData)
      .eq('id', chapterId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ chapter });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/chapters/[id] - Delete chapter
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const chapterId = params.id;

    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', chapterId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Chapter deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


