import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Create a new chapter
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { book_id, title, part_number, part_title } = body;

    if (!book_id || !title) {
      return NextResponse.json(
        { error: 'book_id and title are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the next chapter number
    const { data: existingChapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('chapter_number')
      .eq('book_id', book_id)
      .order('chapter_number', { ascending: false })
      .limit(1);

    if (chaptersError) {
      console.error('Error fetching chapters:', chaptersError);
      return NextResponse.json(
        { error: 'Failed to fetch existing chapters' },
        { status: 500 }
      );
    }

    const nextChapterNumber = existingChapters && existingChapters.length > 0 
      ? existingChapters[0].chapter_number + 1 
      : 1;

    // Create the new chapter
    const { data: chapter, error } = await supabase
      .from('chapters')
      .insert({
        book_id,
        chapter_number: nextChapterNumber,
        title: title.trim(),
        part_number: part_number || null,
        part_title: part_title?.trim() || null,
        status: 'draft',
        word_count: 0,
        content: null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating chapter:', error);
      return NextResponse.json(
        { error: 'Failed to create chapter' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      chapter,
      message: 'Chapter created successfully'
    });

  } catch (error) {
    console.error('Chapter creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    );
  }
}

/**
 * Get chapters for a book
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const book_id = searchParams.get('book_id');

    if (!book_id) {
      return NextResponse.json(
        { error: 'book_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: chapters, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', book_id)
      .order('chapter_number', { ascending: true });

    if (error) {
      console.error('Error fetching chapters:', error);
      return NextResponse.json(
        { error: 'Failed to fetch chapters' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      chapters: chapters || []
    });

  } catch (error) {
    console.error('Chapter fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}