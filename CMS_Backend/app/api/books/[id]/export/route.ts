/**
 * Book Export API
 * 
 * Exports compiled book to PDF, DOCX, or ePub format
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { exportToPDF, exportToMarkdown } from '@/lib/export/book-export';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'pdf'; // pdf, docx, epub, markdown
    const bookId = params.id;

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get book details
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (bookError || !book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Get all chapters for this book
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', bookId)
      .order('chapter_number', { ascending: true });

    if (chaptersError) {
      return NextResponse.json(
        { error: 'Failed to fetch chapters' },
        { status: 500 }
      );
    }

    if (!chapters || chapters.length === 0) {
      return NextResponse.json(
        { error: 'No chapters found for this book' },
        { status: 400 }
      );
    }

    // Format chapters for export
    const exportChapters = chapters.map((chapter: any) => ({
      chapter_number: chapter.chapter_number,
      chapter_title: chapter.title,
      content: chapter.content || ''
    }));

    // Export based on format
    if (format === 'markdown') {
      const markdown = exportToMarkdown(book.title, exportChapters);
      return new NextResponse(markdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="${book.title.replace(/[^a-z0-9]/gi, '_')}.md"`
        }
      });
    }

    if (format === 'pdf') {
      // Note: PDF export requires client-side generation or server-side PDF library
      // For now, return markdown as fallback
      const markdown = exportToMarkdown(book.title, exportChapters);
      return new NextResponse(markdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="${book.title.replace(/[^a-z0-9]/gi, '_')}.md"`
        }
      });
    }

    if (format === 'docx' || format === 'epub') {
      // TODO: Implement full DOCX/ePub generation
      // For now, return markdown
      const markdown = exportToMarkdown(book.title, exportChapters);
      return new NextResponse(markdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="${book.title.replace(/[^a-z0-9]/gi, '_')}.md"`
        }
      });
    }

    return NextResponse.json(
      { error: `Unsupported format: ${format}. Supported: pdf, docx, epub, markdown` },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error exporting book:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

