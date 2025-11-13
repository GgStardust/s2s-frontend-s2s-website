/**
 * Metadata-Compiler API Endpoint
 * 
 * Wraps the metadata-compiler script as an API endpoint
 * Compiles chapters using YAML frontmatter and inline tags only (no RBI)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

interface ContentFile {
  file_path: string;
  title: string;
  yaml: any;
  content: string;
  inline_tags: string[];
  orb_tags: number[];
}

function extractInlineTags(content: string): { orbTags: number[]; allTags: string[] } {
  const orbTags: number[] = [];
  const allTags: string[] = [];
  
  const orbMatches = content.matchAll(/@orb[_\s]*(\d+)/gi);
  for (const match of orbMatches) {
    const orbNum = parseInt(match[1]);
    if (orbNum >= 1 && orbNum <= 13) {
      orbTags.push(orbNum);
      allTags.push(`@orb_${orbNum}`);
    }
  }
  
  const tagMatches = content.matchAll(/@([a-z_]+)/gi);
  for (const match of tagMatches) {
    const tag = match[1].toLowerCase();
    if (!allTags.includes(`@${tag}`) && tag !== 'orb' && !tag.startsWith('orb')) {
      allTags.push(`@${tag}`);
    }
  }
  
  return {
    orbTags: Array.from(new Set(orbTags)).sort((a, b) => a - b),
    allTags: Array.from(new Set(allTags))
  };
}

function loadContentFiles(): ContentFile[] {
  const files: ContentFile[] = [];
  const baseDir = path.join(process.cwd(), '09_PROCESSED');
  
  const dirs = [
    path.join(baseDir, '02d_Orb_Essays'),
    path.join(baseDir, '02f_S2S_codex_essays')
  ];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    
    const filenames = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    for (const filename of filenames) {
      const filePath = path.join(dir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(content);
      const tags = extractInlineTags(parsed.content);
      
      files.push({
        file_path: filePath.replace(process.cwd() + '/', ''),
        title: parsed.data.title || filename.replace('.md', ''),
        yaml: parsed.data,
        content: parsed.content,
        inline_tags: tags.allTags,
        orb_tags: tags.orbTags
      });
    }
  }
  
  return files;
}

function selectSourcesForChapter(
  chapterTitle: string,
  chapterDescription: string,
  contentFiles: ContentFile[]
): ContentFile[] {
  const essayFiles = contentFiles.filter(f => {
    if (f.yaml.type !== 'essay') return false;
    
    if (f.yaml.source_type === 'system_reference' || f.yaml.system_role === 'core_framework') {
      return f.yaml.use_in_book_compiler === true;
    }
    
    return true;
  });
  
  const scored: Array<{ file: ContentFile; score: number; reasons: string[] }> = [];
  
  for (const file of essayFiles) {
    let score = 0;
    const reasons: string[] = [];
    
    // Framework keyword matching
    if (file.yaml.framework_handling?.auto_include_keywords) {
      const chapterText = `${chapterTitle} ${chapterDescription}`.toLowerCase();
      const keywords = file.yaml.framework_handling.auto_include_keywords.map((k: string) => k.toLowerCase());
      const hasMatch = keywords.some((keyword: string) => chapterText.includes(keyword));
      
      if (hasMatch) {
        const weight = typeof file.yaml.inclusion_weight === 'number' ? file.yaml.inclusion_weight : 0.25;
        score += 8 * weight;
        reasons.push(`framework keyword match (weight: ${weight})`);
      }
    }
    
    // Book threading match
    const bookThreading = file.yaml.book_threading || '';
    if (bookThreading.includes('Stardust to Sovereignty')) {
      score += 10;
      reasons.push('book_threading match');
    }
    
    // Field function match
    const fieldFunction = file.yaml.field_function || {};
    const contentPurpose = (fieldFunction.content_purpose || '').toLowerCase();
    const chapterText = `${chapterTitle} ${chapterDescription}`.toLowerCase();
    const chapterWords = chapterText.split(/\s+/).filter((w: string) => w.length > 4);
    const purposeWords = contentPurpose.split(/\s+/).filter((w: string) => w.length > 4);
    const matchingWords = purposeWords.filter((pw: string) =>
      chapterWords.some((cw: string) => cw.includes(pw) || pw.includes(cw))
    );
    
    if (matchingWords.length > 0) {
      score += matchingWords.length * 2;
      reasons.push(`content_purpose match (${matchingWords.length} keywords)`);
    }
    
    if (score > 0) {
      scored.push({ file, score, reasons });
    }
  }
  
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(item => item.file);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { chapter_id } = body;
    const bookId = params.id;

    if (!chapter_id) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get chapter details
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapter_id)
      .eq('book_id', bookId)
      .single();

    if (chapterError || !chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // Load content files
    const contentFiles = loadContentFiles();

    // Select sources using metadata
    const sources = selectSourcesForChapter(
      chapter.title,
      chapter.description || '',
      contentFiles
    );

    if (sources.length === 0) {
      return NextResponse.json(
        { error: 'No matching sources found' },
        { status: 400 }
      );
    }

    // Merge sources preserving inline tags
    let compiledContent = '';
    for (const source of sources) {
      compiledContent += `\n\n${source.content}\n\n`;
    }

    // Preserve all inline tags from sources
    const allTags = new Set<string>();
    sources.forEach(s => s.inline_tags.forEach(tag => allTags.add(tag)));

    return NextResponse.json({
      success: true,
      chapter_id,
      sources: sources.map(s => ({
        title: s.title,
        file_path: s.file_path,
        tags: s.inline_tags
      })),
      compiled_content: compiledContent,
      preserved_tags: Array.from(allTags),
      method: 'metadata_only'
    });

  } catch (error) {
    console.error('Error in metadata compiler:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

