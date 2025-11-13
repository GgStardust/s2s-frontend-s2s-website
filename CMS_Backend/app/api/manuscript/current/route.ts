import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { getCorsHeaders } from '@/lib/cors';

// Resolve manuscript paths - only check 02g_generated_book_content folder
function getManuscriptPaths(): string[] {
  const baseDir = process.cwd();
  const generatedContentPath = path.join(baseDir, '09_PROCESSED/02g_generated_book_content');
  
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
        if (stats.isFile()) {
          return filePath;
        }
      }
    } catch (error) {
      // Continue to next path
      continue;
    }
  }
  
  return null;
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
    return NextResponse.json({}, {
      status: 204,
      headers: getCorsHeaders(origin),
    });
  } catch (error) {
    console.error('OPTIONS handler error:', error);
    return NextResponse.json({}, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Find manuscript file
    const manuscriptPath = findManuscriptFile();
    const origin = request.headers.get('origin');
    if (!manuscriptPath) {
      const searchedPaths = getManuscriptPaths();
      console.error('[manuscript/current] Manuscript not found. Searched paths:', searchedPaths);
      console.error('[manuscript/current] Current working directory:', process.cwd());
      return NextResponse.json(
        { 
          error: 'Current manuscript not found', 
          searched_paths: searchedPaths.slice(0, 10), // Limit to first 10 for response size
          cwd: process.cwd()
        },
        { 
          status: 404,
          headers: getCorsHeaders(origin),
        }
      );
    }
    
    console.log('[manuscript/current] Found manuscript at:', manuscriptPath);
    
    // Read manuscript file
    const content = fs.readFileSync(manuscriptPath, 'utf-8');
    const parsed = matter(content);
    
    // Parse chapters
    const chapters = parseManuscript(parsed.content);
    
    // Get metadata
    const metadata = {
      title: parsed.data.title || 'Stardust to Sovereignty',
      author: parsed.data.author || 'Gigi Stardust',
      version: parsed.data.version || 'current',
      date: parsed.data.date || new Date().toISOString().split('T')[0],
      description: parsed.data.description || '',
    };
    
    return NextResponse.json({
      success: true,
      metadata,
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

