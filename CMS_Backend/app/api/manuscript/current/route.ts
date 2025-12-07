import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { getCorsHeaders } from '@/lib/cors';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Resolve manuscript paths - only check 02g_generated_book_content folder
function getManuscriptPaths(): string[] {
  // In Next.js API routes, process.cwd() is the project root (CMS_Backend directory)
  const baseDir = process.cwd();
  const generatedContentPath = path.join(baseDir, '09_PROCESSED', '02g_generated_book_content');
  
  return [
    path.join(generatedContentPath, 'STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT.md'),
    path.join(generatedContentPath, 'STARDUST_TO_SOVEREIGNTY_COMPLETE.md'),
    path.join(generatedContentPath, 'STARDUST_TO_SOVEREIGNTY.md')
  ];
}

function findManuscriptFile(): string | null {
  const paths = getManuscriptPaths();
  
  for (const filePath of paths) {
    try {
      if (fs.existsSync(filePath)) {
        // Verify it's actually a file and readable
        const stats = fs.statSync(filePath);
        if (stats.isFile() && stats.size > 0) {
          console.log(`[manuscript/current] Found manuscript file: ${filePath} (${stats.size} bytes)`);
          return filePath;
        } else {
          console.warn(`[manuscript/current] File exists but is empty or not a file: ${filePath}`);
        }
      }
    } catch (error) {
      console.warn(`[manuscript/current] Error checking path ${filePath}:`, error);
      // Continue to next path
      continue;
    }
  }
  
  console.warn(`[manuscript/current] No manuscript file found in any of these paths:`, paths);
  return null;
}

// Try to load manuscript from Supabase
async function loadManuscriptFromSupabase(): Promise<{ content: string; metadata: any } | null> {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Look for manuscript in content_files table
    // Try multiple possible file paths
    const possiblePaths = [
      '02g_generated_book_content/STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT.md',
      '02g_generated_book_content/STARDUST_TO_SOVEREIGNTY_COMPLETE.md',
      '02g_generated_book_content/STARDUST_TO_SOVEREIGNTY.md'
    ];

    for (const filePath of possiblePaths) {
      const { data, error } = await supabase
        .from('content_files')
        .select('*')
        .eq('file_path', filePath)
        .eq('content_type', 'book_output')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        const content = data.markdown_body || data.content || '';
        const metadata = data.yaml_frontmatter || {};
        return { content, metadata };
      }
    }

    return null;
  } catch (error) {
    console.error('[manuscript/current] Error loading from Supabase:', error);
    return null;
  }
}

interface ChapterInfo {
  chapter_number?: number;
  title: string;
  content: string;
  type: 'chapter' | 'interlude' | 'front_matter' | 'back_matter';
  part?: string;
  word_count: number;
  orb_tags: number[];
  inline_tags: string[];
}

function extractInlineTags(content: string): { allTags: string[]; orbTags: number[] } {
  const allTags: string[] = [];
  const orbTags: number[] = [];
  
  const orbMatches = content.matchAll(/@orb[_\s]*(\d+)/gi);
  for (const match of orbMatches) {
    const orbNum = parseInt(match[1]);
    if (orbNum >= 1 && orbNum <= 13) {
      orbTags.push(orbNum);
      const originalTag = match[0];
      if (!allTags.includes(originalTag)) {
        allTags.push(originalTag);
      }
    }
  }
  
  const scrollMatches = content.matchAll(/@scrollstream[:\s]*([^\n@]*)/gi);
  for (const match of scrollMatches) {
    const originalTag = match[0];
    if (!allTags.includes(originalTag)) {
      allTags.push(originalTag);
    }
  }
  
  const tagMatches = content.matchAll(/@([a-z_]+)/gi);
  for (const match of tagMatches) {
    const originalTag = match[0];
    if (!allTags.includes(originalTag) && !originalTag.startsWith('@orb') && !originalTag.startsWith('@scrollstream')) {
      allTags.push(originalTag);
    }
  }
  
  return {
    allTags: Array.from(new Set(allTags)),
    orbTags: Array.from(new Set(orbTags)).sort((a, b) => a - b)
  };
}

function parseManuscript(content: string): ChapterInfo[] {
  const lines = content.split('\n');
  const chapters: ChapterInfo[] = [];
  
  let currentChapter: ChapterInfo | null = null;
  let currentContent: string[] = [];
  let currentPart: string | undefined;
  
  const patterns = {
    part: /^###?\s*\*\*PART\s+(\d+):\s*(.+?)\*\*/i,
    chapter: /^#+\s*Chapter\s+(\d+):\s*(.+?)$/i,
    interlude: /^#+\s*Interlude:\s*(.+?)$/i,
    front_matter: /^#+\s*(Series Note|Prologue|Introduction|Entering the Field)/i,
    back_matter: /^#+\s*(Conclusion|Afterword|Epilogue|APPENDIX [A-Z]|Appendix [A-Z])/i,
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    const partMatch = line.match(patterns.part);
    if (partMatch) {
      currentPart = `Part ${partMatch[1]}: ${partMatch[2]}`;
      continue;
    }
    
    const chapterMatch = line.match(patterns.chapter);
    if (chapterMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        chapter_number: parseInt(chapterMatch[1]),
        title: `Chapter ${chapterMatch[1]}: ${chapterMatch[2]}`,
        content: '',
        type: 'chapter',
        part: currentPart,
        word_count: 0,
        orb_tags: [],
        inline_tags: []
      };
      currentContent = [];
      continue;
    }
    
    const interludeMatch = line.match(patterns.interlude);
    if (interludeMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: `Interlude: ${interludeMatch[1]}`,
        content: '',
        type: 'interlude',
        part: currentPart,
        word_count: 0,
        orb_tags: [],
        inline_tags: []
      };
      currentContent = [];
      continue;
    }
    
    const frontMatch = line.match(patterns.front_matter);
    if (frontMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: frontMatch[1],
        content: '',
        type: 'front_matter',
        word_count: 0,
        orb_tags: [],
        inline_tags: []
      };
      currentContent = [];
      continue;
    }
    
    const backMatch = line.match(patterns.back_matter);
    if (backMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: backMatch[1],
        content: '',
        type: 'back_matter',
        word_count: 0,
        orb_tags: [],
        inline_tags: []
      };
      currentContent = [];
      continue;
    }
    
    if (currentChapter) {
      currentContent.push(line);
    }
  }
  
  if (currentChapter) {
    currentChapter.content = currentContent.join('\n');
    const tags = extractInlineTags(currentChapter.content);
    currentChapter.inline_tags = tags.allTags;
    currentChapter.orb_tags = tags.orbTags;
    currentChapter.word_count = currentChapter.content.split(/\s+/).length;
    chapters.push(currentChapter);
  }
  
  return chapters;
}

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    // 204 No Content should not have a body
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('[manuscript/current] OPTIONS handler error:', error);
    // Fallback CORS headers
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    let content: string | undefined;
    let metadata: any;
    let source: 'file' | 'supabase' = 'file';

    // Try file system first (for local development with V7)
    const manuscriptPath = findManuscriptFile();
    if (manuscriptPath) {
      console.log('[manuscript/current] Reading manuscript from:', manuscriptPath);
      try {
        const fileContent = fs.readFileSync(manuscriptPath, 'utf-8');
        if (!fileContent || fileContent.trim().length === 0) {
          throw new Error('Manuscript file is empty');
        }
        const parsed = matter(fileContent);
        content = parsed.content;
        metadata = parsed.data;
        source = 'file';
        console.log(`[manuscript/current] Successfully loaded manuscript (${content.length} chars, ${Object.keys(metadata).length} metadata fields)`);
      } catch (fileError) {
        console.error('[manuscript/current] Error reading manuscript file:', fileError);
        // Fall through to Supabase
        content = undefined;
      }
    }
    
    if (!content) {
      // Fall back to Supabase (for production/Vercel)
      console.log('[manuscript/current] File not found or failed to read, trying Supabase...');
      const supabaseResult = await loadManuscriptFromSupabase();
      if (supabaseResult && supabaseResult.content) {
        content = supabaseResult.content;
        metadata = supabaseResult.metadata || {};
        source = 'supabase';
        console.log('[manuscript/current] Loaded from Supabase');
      } else {
        const searchedPaths = getManuscriptPaths();
        console.error('[manuscript/current] Manuscript not found in file system or Supabase');
        return NextResponse.json(
          { 
            success: false,
            error: 'Current manuscript not found', 
            searched_paths: searchedPaths,
            message: 'Manuscript not found in file system or Supabase. Place V7 in 02g_generated_book_content/ or sync to Supabase.'
          },
          { 
            status: 404,
            headers: getCorsHeaders(origin),
          }
        );
      }
    }
    
    // Parse chapters
    const chapters = parseManuscript(content);
    
    // Get metadata
    const finalMetadata = {
      title: metadata?.title || 'Stardust to Sovereignty',
      author: metadata?.author || 'Gigi Stardust',
      version: metadata?.version || 'current',
      date: metadata?.date || new Date().toISOString().split('T')[0],
      description: metadata?.description || '',
    };
    
    return NextResponse.json({
      success: true,
      source, // Indicate where it came from
      metadata: finalMetadata,
      chapters,
      total_chapters: chapters.filter(c => c.type === 'chapter').length,
      total_interludes: chapters.filter(c => c.type === 'interlude').length,
      total_sections: chapters.length,
      total_word_count: chapters.reduce((sum, c) => sum + c.word_count, 0),
    }, {
      headers: getCorsHeaders(origin),
    });
    
  } catch (error) {
    console.error('Error reading manuscript:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read manuscript',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}

