import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface OrbResonanceSuggestion {
  contentFile: any;
  resonanceScore: number;
  orbAlignment: string[];
  reasoning: string;
}

export async function POST(request: NextRequest) {
  try {
    const { chapterId, bookId } = await request.json();
    
    if (!chapterId) {
      return NextResponse.json({ error: 'Chapter ID is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get chapter details
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single();

    if (chapterError || !chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Get book details for additional context
    const { data: book } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    // Get all content files
    const { data: contentFiles, error: contentError } = await supabase
      .from('content_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (contentError) {
      return NextResponse.json({ error: 'Failed to load content files' }, { status: 500 });
    }

    // Calculate Orb resonance for each content file
    const suggestions: OrbResonanceSuggestion[] = [];

    for (const contentFile of contentFiles) {
      let resonanceScore = calculateOrbResonance(chapter, contentFile, book);
      
      // Prioritize exact Orb matches
      if (chapter.orb_focus && contentFile.title.includes(chapter.orb_focus.replace(/[():]/g, '').trim())) {
        resonanceScore += 0.5; // Extra boost for exact title match
      }
      
      if (resonanceScore > 0.05) { // Even lower threshold to catch Orb 1 essay
        const orbAlignment = getOrbAlignment(chapter, contentFile);
        const reasoning = generateReasoning(chapter, contentFile, resonanceScore, orbAlignment);
        
        suggestions.push({
          contentFile,
          resonanceScore,
          orbAlignment,
          reasoning
        });
      }
    }

    // Sort by resonance score (highest first)
    suggestions.sort((a, b) => b.resonanceScore - a.resonanceScore);

    return NextResponse.json({
      suggestions: suggestions.slice(0, 10), // Top 10 suggestions
      chapterTitle: chapter.title,
      totalContentFiles: contentFiles.length,
      resonanceThreshold: 0.05
    });

  } catch (err: any) {
    console.error('Error generating Orb resonance suggestions:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function calculateOrbResonance(chapter: any, contentFile: any, book: any): number {
  let score = 0;
  let factors = 0;

  // Factor 1: Orb focus alignment (PRIMARY - metadata-driven)
  if (chapter.orb_focus && contentFile.orb_associations) {
    const chapterOrb = chapter.orb_focus.toLowerCase();
    const contentOrbs = contentFile.orb_associations.map((orb: any) => orb.toString().toLowerCase());
    
    // Direct Orb match (highest priority) - normalize punctuation
    const normalizedChapterOrb = chapterOrb.replace(/[():]/g, '').trim();
    const normalizedContentOrbs = contentOrbs.map((orb: string) => orb.replace(/[():]/g, '').trim());
    
    if (normalizedContentOrbs.some((orb: string) => 
      orb.includes(normalizedChapterOrb) || normalizedChapterOrb.includes(orb)
    )) {
      score += 0.8; // 80% weight for direct Orb match (boosted)
      factors++;
    }
    
    // Orb number pattern matching (e.g., "orb 1" matches "Orb 1: Origin Intelligence")
    const chapterOrbNumber = chapterOrb.match(/orb\s*(\d+)/)?.[1];
    if (chapterOrbNumber && contentOrbs.some((orb: string) => orb.includes(`orb ${chapterOrbNumber}`))) {
      score += 0.4; // 40% weight for Orb number match
      factors++;
    }
  }

  // Factor 1b: Direct Orb association overlap (if chapter has orb_associations)
  if (chapter.orb_associations && contentFile.orb_associations) {
    const chapterOrbs = new Set(chapter.orb_associations);
    const contentOrbs = new Set(contentFile.orb_associations);
    const overlap = [...chapterOrbs].filter(orb => contentOrbs.has(orb)).length;
    const totalOrbs = new Set([...chapterOrbs, ...contentOrbs]).size;
    
    if (totalOrbs > 0) {
      score += (overlap / totalOrbs) * 0.3; // 30% weight
      factors++;
    }
  }

  // Factor 2: Tag resonance (metadata-driven)
  if (chapter.tags && contentFile.tags) {
    const chapterTags = new Set(chapter.tags);
    const contentTags = new Set(contentFile.tags);
    const tagOverlap = [...chapterTags].filter(tag => contentTags.has(tag)).length;
    const totalTags = new Set([...chapterTags, ...contentTags]).size;
    
    if (totalTags > 0) {
      score += (tagOverlap / totalTags) * 0.3; // 30% weight
      factors++;
    }
  }

  // Factor 3: Content type alignment (metadata-driven)
  if (contentFile.content_type === 'orb_essay') {
    score += 0.3; // 30% weight for Orb essays
    factors++;
  }

  // Factor 4: YAML metadata alignment
  if (contentFile.yaml_frontmatter) {
    const yaml = contentFile.yaml_frontmatter;
    
    // Canonical status gets priority
    if (yaml.status === 'canonical') {
      score += 0.2; // 20% weight
      factors++;
    }
    
    // Category alignment
    if (yaml.category === 'foundational' && chapter.title?.toLowerCase().includes('foundation')) {
      score += 0.1; // 10% weight
      factors++;
    }
  }

  // Factor 5: Title keyword alignment (metadata-driven)
  if (chapter.title && contentFile.title) {
    const chapterTitle = chapter.title.toLowerCase();
    const contentTitle = contentFile.title.toLowerCase();
    
    // Check for keyword overlap in titles
    const chapterWords = chapterTitle.split(/\s+/);
    const contentWords = contentTitle.split(/\s+/);
    const wordOverlap = chapterWords.filter((word: string) => contentWords.includes(word)).length;
    
    if (wordOverlap > 0) {
      score += (wordOverlap / Math.max(chapterWords.length, contentWords.length)) * 0.2; // 20% weight
      factors++;
    }
  }

  return factors > 0 ? score / factors : 0;
}

function getOrbAlignment(chapter: any, contentFile: any): string[] {
  const alignments: string[] = [];
  
  if (chapter.orb_associations && contentFile.orb_associations) {
    const chapterOrbs = new Set(chapter.orb_associations);
    const contentOrbs = new Set(contentFile.orb_associations);
    const overlap = [...chapterOrbs].filter(orb => contentOrbs.has(orb));
    
    overlap.forEach(orb => {
      alignments.push(`Orb ${orb} resonance`);
    });
  }

  if (chapter.tags && contentFile.tags) {
    const chapterTags = new Set(chapter.tags);
    const contentTags = new Set(contentFile.tags);
    const tagOverlap = [...chapterTags].filter(tag => contentTags.has(tag));
    
    tagOverlap.forEach(tag => {
      alignments.push(`Tag: ${tag}`);
    });
  }

  return alignments;
}

function generateReasoning(chapter: any, contentFile: any, resonanceScore: number, orbAlignment: string[]): string {
  const reasons: string[] = [];
  
  if (resonanceScore > 0.7) {
    reasons.push('High Orb resonance detected');
  } else if (resonanceScore > 0.5) {
    reasons.push('Moderate Orb resonance');
  } else {
    reasons.push('Low but meaningful resonance');
  }

  if (orbAlignment.length > 0) {
    reasons.push(`Shared: ${orbAlignment.slice(0, 3).join(', ')}`);
  }

  if (contentFile.content_type === 'orb_essay') {
    reasons.push('Orb essay content type');
  }

  if (contentFile.yaml_frontmatter?.status === 'canonical') {
    reasons.push('Canonical status');
  }

  return reasons.join(' • ');
}
