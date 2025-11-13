import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { book_id, content_mapping } = await request.json();

    if (!book_id || !content_mapping) {
      return NextResponse.json({ error: 'Book ID and content mapping are required' }, { status: 400 });
    }

    // Get the book to verify it exists
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', book_id)
      .single();

    if (bookError || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Get all chapters for this book
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', book_id);

    if (chaptersError) {
      return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
    }

    // Apply content mapping to each chapter
    const updatePromises = [];

    for (const [chapterId, contentIds] of Object.entries(content_mapping)) {
      if (!Array.isArray(contentIds) || contentIds.length === 0) continue;

      // Get the chapter
      const chapter = chapters?.find(c => c.id === chapterId);
      if (!chapter) continue;

      // Get the content files
      const { data: contentFiles, error: contentError } = await supabase
        .from('content_files')
        .select('id, title, markdown_body, orb_associations, tags')
        .in('id', contentIds);

      if (contentError || !contentFiles) continue;

      // Create a combined content for this chapter
      const combinedContent = contentFiles
        .map(file => `# ${file.title}\n\n${file.markdown_body}`)
        .join('\n\n---\n\n');

      // Update the chapter with the combined content
      const updatePromise = supabase
        .from('chapters')
        .update({
          content: combinedContent,
          word_count: combinedContent.split(/\s+/).length,
          updated_at: new Date().toISOString()
        })
        .eq('id', chapterId);

      updatePromises.push(updatePromise);
    }

    // Execute all updates
    const results = await Promise.all(updatePromises);
    
    // Check for any errors
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error('Some chapter updates failed:', errors);
      return NextResponse.json({ 
        error: 'Some chapters failed to update',
        details: errors.map(e => e.error)
      }, { status: 500 });
    }

    // Update book word count
    const { data: updatedChapters, error: updatedChaptersError } = await supabase
      .from('chapters')
      .select('word_count')
      .eq('book_id', book_id);

    if (!updatedChaptersError && updatedChapters) {
      const totalWordCount = updatedChapters.reduce((sum, chapter) => sum + (chapter.word_count || 0), 0);
      
      await supabase
        .from('books')
        .update({ 
          current_word_count: totalWordCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', book_id);
    }

    return NextResponse.json({
      success: true,
      book_id,
      chapters_updated: Object.keys(content_mapping).length,
      total_content_mapped: Object.values(content_mapping).flat().length,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Error applying content mapping:', err);
    return NextResponse.json({ error: 'Internal server error: ' + err.message }, { status: 500 });
  }
}


