import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface ContentMapping {
  chapter_id: string;
  chapter_title: string;
  suggested_content: {
    content_id: string;
    title: string;
    content_type: string;
    relevance_score: number;
    orb_associations: number[];
    tags: string[];
    excerpt: string;
  }[];
}

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { book_id } = await request.json();

    if (!book_id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // Get book details
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', book_id)
      .single();

    if (bookError || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Get book chapters
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', book_id)
      .order('chapter_number', { ascending: true });

    if (chaptersError) {
      return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
    }

    if (!chapters || chapters.length === 0) {
      return NextResponse.json({ error: 'No chapters found for this book' }, { status: 400 });
    }

    // Get all content files for mapping
    const { data: contentFiles, error: contentError } = await supabase
      .from('content_files')
      .select('id, title, content_type, orb_associations, tags, markdown_body, yaml_frontmatter')
      .order('created_at', { ascending: false });

    if (contentError) {
      return NextResponse.json({ error: 'Failed to fetch content files' }, { status: 500 });
    }

    if (!contentFiles || contentFiles.length === 0) {
      return NextResponse.json({ error: 'No content files available for mapping' }, { status: 400 });
    }

    // Generate content mappings for each chapter
    const mappings: ContentMapping[] = [];

    for (const chapter of chapters) {
      const suggestedContent = await findRelevantContent(
        chapter,
        contentFiles,
        book
      );

      mappings.push({
        chapter_id: chapter.id,
        chapter_title: chapter.title,
        suggested_content: suggestedContent
      });
    }

    return NextResponse.json({
      book_id,
      book_title: book.title,
      mapping: mappings,
      total_chapters: chapters.length,
      total_content_files: contentFiles.length,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Error mapping book content:', err);
    return NextResponse.json({ error: 'Internal server error: ' + err.message }, { status: 500 });
  }
}

async function findRelevantContent(
  chapter: any,
  contentFiles: any[],
  book: any
): Promise<any[]> {
  const suggestions: any[] = [];

  // Extract keywords from chapter title and description
  const chapterKeywords = extractKeywords(chapter.title + ' ' + (chapter.description || ''));
  
  // Extract keywords from book metadata
  const bookKeywords = extractKeywords(
    book.title + ' ' + 
    (book.description || '') + ' ' + 
    (book.purpose || '') + ' ' + 
    (book.overview || '')
  );

  // Score each content file for relevance to this chapter
  for (const content of contentFiles) {
    const relevanceScore = calculateRelevanceScore(
      content,
      chapter,
      chapterKeywords,
      bookKeywords
    );

    // Only include content with reasonable relevance
    if (relevanceScore > 0.1) {
      suggestions.push({
        content_id: content.id,
        title: content.title,
        content_type: content.content_type,
        relevance_score: relevanceScore,
        orb_associations: content.orb_associations || [],
        tags: content.tags || [],
        excerpt: extractExcerpt(content.markdown_body, 200)
      });
    }
  }

  // Sort by relevance score and return top 5 suggestions
  return suggestions
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 5);
}

function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !isCommonWord(word));
}

function isCommonWord(word: string): boolean {
  const commonWords = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'men', 'put', 'say', 'she', 'too', 'use'
  ];
  return commonWords.includes(word);
}

function calculateRelevanceScore(
  content: any,
  chapter: any,
  chapterKeywords: string[],
  bookKeywords: string[]
): number {
  let score = 0;

  // Title similarity
  const contentTitle = content.title.toLowerCase();
  const chapterTitle = chapter.title.toLowerCase();
  
  // Direct title match
  if (contentTitle.includes(chapterTitle) || chapterTitle.includes(contentTitle)) {
    score += 0.8;
  }

  // Keyword overlap with chapter
  const contentKeywords = extractKeywords(content.title + ' ' + (content.markdown_body || ''));
  const chapterOverlap = chapterKeywords.filter(kw => contentKeywords.includes(kw)).length;
  score += (chapterOverlap / Math.max(chapterKeywords.length, 1)) * 0.6;

  // Keyword overlap with book
  const bookOverlap = bookKeywords.filter(kw => contentKeywords.includes(kw)).length;
  score += (bookOverlap / Math.max(bookKeywords.length, 1)) * 0.4;

  // Orb association bonus
  if (content.orb_associations && content.orb_associations.length > 0) {
    score += 0.2;
  }

  // Content type relevance
  if (content.content_type === 'essay' || content.content_type === 'article') {
    score += 0.1;
  }

  // Tag relevance
  if (content.tags && content.tags.length > 0) {
    const relevantTags = content.tags.filter((tag: string) => 
      chapterKeywords.some(kw => tag.toLowerCase().includes(kw)) ||
      bookKeywords.some(kw => tag.toLowerCase().includes(kw))
    );
    score += (relevantTags.length / content.tags.length) * 0.3;
  }

  return Math.min(score, 1.0); // Cap at 1.0
}

function extractExcerpt(text: string, maxLength: number): string {
  if (!text) return '';
  
  // Remove markdown formatting for clean excerpt
  const cleanText = text
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // Find the last complete word within the limit
  const truncated = cleanText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}