import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Research content library
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Search through content files using vector similarity
    const { data: results, error } = await supabase
      .from('content_embeddings')
      .select(`
        content_files (
          id,
          title,
          content,
          markdown_body,
          file_path,
          content_type,
          orb_associations,
          tags,
          resonance_rating,
          resonance_metrics
        ),
        similarity
      `)
      .textSearch('content', query)
      .order('similarity', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error searching content:', error);
      return NextResponse.json(
        { error: 'Failed to search content' },
        { status: 500 }
      );
    }

    // Format results
    const formattedResults = results?.map(result => ({
      file_title: (result.content_files as any)?.title || 'Untitled',
      excerpt: extractExcerpt((result.content_files as any)?.content || '', query),
      similarity: result.similarity || 0,
      orb_associations: (result.content_files as any)?.orb_associations || [],
      tags: (result.content_files as any)?.tags || []
    })) || [];

    return NextResponse.json({
      results: formattedResults,
      query,
      message: 'Research completed successfully'
    });

  } catch (error) {
    console.error('Research error:', error);
    return NextResponse.json(
      { error: 'Failed to perform research' },
      { status: 500 }
    );
  }
}

function extractExcerpt(content: string, query: string): string {
  // Simple excerpt extraction - find sentences containing the query
  const sentences = content.split(/[.!?]+/);
  const queryWords = query.toLowerCase().split(' ');
  
  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    if (queryWords.some(word => lowerSentence.includes(word))) {
      return sentence.trim().substring(0, 200) + '...';
    }
  }
  
  // Fallback to first 200 characters
  return content.substring(0, 200) + '...';
}





