import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Get chapters for a specific book
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Return empty for 'new' or 'create' routes (new book has no chapters yet)
    if (bookId === 'new' || bookId === 'create') {
      return NextResponse.json({ chapters: [] }, { status: 200 });
    }

    // Handle both simple IDs and UUIDs
    const supabase = await createClient();
    
    // First try to find the book by ID (could be simple ID or UUID)
    let bookQuery = supabase.from('books').select('id').eq('id', bookId);
    
    // If it's a simple number, also try to find by row number
    if (/^\d+$/.test(bookId)) {
      const { data: books } = await supabase
        .from('books')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(parseInt(bookId));
      
      if (books && books.length > 0) {
        const actualBookId = books[parseInt(bookId) - 1]?.id;
        if (actualBookId) {
          const { data: chapters, error } = await supabase
            .from('chapters')
            .select('*')
            .eq('book_id', actualBookId)
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
        }
      }
    }

    // Try with the original ID (UUID case)
    const { data: chapters, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', bookId)
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