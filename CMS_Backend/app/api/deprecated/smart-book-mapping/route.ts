import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface SmartMapping {
  chapter_id: string;
  chapter_title: string;
  chapter_purpose: string;
  suggested_content: {
    content_id: string;
    title: string;
    content_type: string;
    relevance_score: number;
    reasoning: string;
    orb_associations: number[];
    tags: string[];
    excerpt: string;
    usage_suggestion: string;
  }[];
  chapter_outline: string;
  content_flow: string;
}

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { book_id } = await request.json();

    if (!book_id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // Get book details with full metadata
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

    // Get all content files with rich metadata
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

    // Generate AI-powered content mappings
    const mappings: SmartMapping[] = [];

    for (const chapter of chapters) {
      const smartMapping = await generateSmartMapping(
        chapter,
        book,
        contentFiles,
        chapters
      );
      mappings.push(smartMapping);
    }

    return NextResponse.json({
      book_id,
      book_title: book.title,
      book_type: book.type,
      mapping: mappings,
      total_chapters: chapters.length,
      total_content_files: contentFiles.length,
      ai_analysis: {
        book_theme: extractBookTheme(book),
        content_coverage: analyzeContentCoverage(contentFiles),
        orb_distribution: analyzeOrbDistribution(contentFiles),
        recommended_approach: generateRecommendedApproach(book, contentFiles)
      },
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Error generating smart book mapping:', err);
    return NextResponse.json({ error: 'Internal server error: ' + err.message }, { status: 500 });
  }
}

async function generateSmartMapping(
  chapter: any,
  book: any,
  contentFiles: any[],
  allChapters: any[]
): Promise<SmartMapping> {
  
  // Create context for AI analysis
  const bookContext = `
Book: ${book.title}
Type: ${book.type}
Purpose: ${book.purpose || 'Not specified'}
Overview: ${book.overview || 'Not specified'}
Structure: ${book.book_structure || 'Not specified'}
`;

  const chapterContext = `
Chapter: ${chapter.title}
Number: ${chapter.chapter_number}
Part: ${chapter.part_number ? `Part ${chapter.part_number}: ${chapter.part_title}` : 'No part'}
Status: ${chapter.status}
`;

  const availableContent = contentFiles.map(file => ({
    id: file.id,
    title: file.title,
    type: file.content_type,
    orbs: file.orb_associations || [],
    tags: file.tags || [],
    description: file.yaml_frontmatter?.description || file.yaml_frontmatter?.overview || '',
    excerpt: extractExcerpt(file.markdown_body, 300)
  }));

  // Use OpenAI to analyze and suggest content
  const prompt = `
You are an expert book editor and content strategist specializing in the Stardust to Sovereignty framework. 

BOOK CONTEXT:
${bookContext}

CHAPTER CONTEXT:
${chapterContext}

AVAILABLE CONTENT LIBRARY:
${availableContent.map(c => `- ${c.title} (${c.type}) - Orbs: ${c.orbs.join(', ')} - ${c.excerpt}`).join('\n')}

TASK: Analyze this chapter within the context of the book and suggest the most relevant content from the library to populate this chapter. Consider:

1. The chapter's role in the overall book narrative
2. Orb associations and thematic coherence
3. Content flow and logical progression
4. The chapter's specific purpose and goals
5. How content pieces can work together to create a cohesive chapter

For each suggested content piece, provide:
- Relevance score (0.0-1.0)
- Reasoning for why this content fits
- Suggested usage (introduction, main content, conclusion, etc.)
- How it contributes to the chapter's purpose

Return your analysis as JSON with this structure:
{
  "chapter_purpose": "Clear statement of what this chapter should accomplish",
  "suggested_content": [
    {
      "content_id": "id",
      "relevance_score": 0.9,
      "reasoning": "Why this content fits",
      "usage_suggestion": "How to use it in the chapter"
    }
  ],
  "chapter_outline": "Suggested structure for this chapter",
  "content_flow": "How the content should flow together"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert book editor specializing in consciousness and sovereignty frameworks. You must respond with ONLY valid JSON, no markdown formatting, no code blocks, no explanations - just pure JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // Clean the AI response to extract JSON from markdown code blocks
    let aiContent = completion.choices[0].message.content || '{}';
    
    // Remove markdown code block formatting if present
    if (aiContent.includes('```json')) {
      aiContent = aiContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (aiContent.includes('```')) {
      aiContent = aiContent.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Clean up any remaining markdown formatting
    aiContent = aiContent.trim();
    
    const aiResponse = JSON.parse(aiContent);
    
    // Map AI suggestions to actual content files
    const suggestedContent = aiResponse.suggested_content?.map((suggestion: any) => {
      const contentFile = contentFiles.find(f => f.id === suggestion.content_id);
      if (!contentFile) return null;

      return {
        content_id: contentFile.id,
        title: contentFile.title,
        content_type: contentFile.content_type,
        relevance_score: suggestion.relevance_score || 0.5,
        reasoning: suggestion.reasoning || 'AI suggested based on content analysis',
        orb_associations: contentFile.orb_associations || [],
        tags: contentFile.tags || [],
        excerpt: extractExcerpt(contentFile.markdown_body, 200),
        usage_suggestion: suggestion.usage_suggestion || 'Include as supporting content'
      };
    }).filter(Boolean) || [];

    return {
      chapter_id: chapter.id,
      chapter_title: chapter.title,
      chapter_purpose: aiResponse.chapter_purpose || 'To explore and develop the chapter theme',
      suggested_content: suggestedContent,
      chapter_outline: aiResponse.chapter_outline || 'Suggested chapter structure',
      content_flow: aiResponse.content_flow || 'Logical flow of content within the chapter'
    };

  } catch (aiError) {
    console.error('AI analysis failed, falling back to basic mapping:', aiError);
    
    // Fallback to basic content mapping
    return generateBasicMapping(chapter, book, contentFiles);
  }
}

function generateBasicMapping(chapter: any, book: any, contentFiles: any[]): SmartMapping {
  const suggestions = contentFiles
    .map(content => ({
      content_id: content.id,
      title: content.title,
      content_type: content.content_type,
      relevance_score: calculateBasicRelevance(content, chapter, book),
      reasoning: 'Basic keyword and theme matching',
      orb_associations: content.orb_associations || [],
      tags: content.tags || [],
      excerpt: extractExcerpt(content.markdown_body, 200),
      usage_suggestion: 'Review and integrate as appropriate'
    }))
    .filter(s => s.relevance_score > 0.3)
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 5);

  return {
    chapter_id: chapter.id,
    chapter_title: chapter.title,
    chapter_purpose: `Develop the theme of ${chapter.title}`,
    suggested_content: suggestions,
    chapter_outline: 'Basic chapter structure based on available content',
    content_flow: 'Sequential presentation of selected content'
  };
}

function calculateBasicRelevance(content: any, chapter: any, book: any): number {
  let score = 0;
  
  // Title similarity
  const contentTitle = content.title.toLowerCase();
  const chapterTitle = chapter.title.toLowerCase();
  
  if (contentTitle.includes(chapterTitle) || chapterTitle.includes(contentTitle)) {
    score += 0.8;
  }

  // Orb associations
  if (content.orb_associations && content.orb_associations.length > 0) {
    score += 0.3;
  }

  // Content type relevance
  if (content.content_type === 'essay' || content.content_type === 'article') {
    score += 0.2;
  }

  return Math.min(score, 1.0);
}

function extractBookTheme(book: any): string {
  const themeElements = [
    book.purpose,
    book.overview,
    book.description,
    book.title
  ].filter(Boolean);
  
  return themeElements.join(' ').substring(0, 200) + '...';
}

function analyzeContentCoverage(contentFiles: any[]): any {
  const typeCounts = contentFiles.reduce((acc, file) => {
    acc[file.content_type] = (acc[file.content_type] || 0) + 1;
    return acc;
  }, {});

  const orbCounts = contentFiles.reduce((acc, file) => {
    (file.orb_associations || []).forEach((orb: number) => {
      acc[orb] = (acc[orb] || 0) + 1;
    });
    return acc;
  }, {});

  return {
    content_types: typeCounts,
    orb_coverage: orbCounts,
    total_files: contentFiles.length
  };
}

function analyzeOrbDistribution(contentFiles: any[]): any {
  const orbStats: { [key: number]: { count: number; percentage: number } } = {};
  
  for (let i = 1; i <= 13; i++) {
    const filesWithOrb = contentFiles.filter(file => 
      (file.orb_associations || []).includes(i)
    );
    
    orbStats[i] = {
      count: filesWithOrb.length,
      percentage: (filesWithOrb.length / contentFiles.length) * 100
    };
  }
  
  return orbStats;
}

function generateRecommendedApproach(book: any, contentFiles: any[]): string {
  const orbCoverage = analyzeOrbDistribution(contentFiles);
  const coveredOrbs = Object.keys(orbCoverage).filter(orb => orbCoverage[orb].count > 0);
  
  if (coveredOrbs.length >= 10) {
    return "Comprehensive content library with good Orb coverage. Focus on thematic coherence and narrative flow.";
  } else if (coveredOrbs.length >= 5) {
    return "Moderate content library. Consider developing content for underrepresented Orbs to strengthen the book's foundation.";
  } else {
    return "Limited content library. Focus on core themes and consider expanding content before book completion.";
  }
}

function extractExcerpt(text: string, maxLength: number): string {
  if (!text) return '';
  
  const cleanText = text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  const truncated = cleanText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}
