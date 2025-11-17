/**
 * Shared Type Definitions for Book Compiler
 */

export interface ContentFile {
  file_path: string;
  title: string;
  yaml: any;
  content: string;
  inline_tags: string[];
  orb_tags: number[];
}

export interface ChapterOutline {
  chapter_number: number;
  title: string;
  description?: string;
  orb_focus?: number;
}

export interface CompiledChapter {
  chapter: ChapterOutline;
  content: string;
  sources: ContentFile[];
  metadata: {
    orb_associations: string[];
    field_function: any;
    integration_points: string[];
    book_threading: string;
    related_files: string[];
  };
  rbi_metrics?: {
    coherence?: number;
    field_strength?: number;
    stability?: number;
  };
  style_applied?: boolean;
}

export interface CompilationResult {
  chapter: ChapterOutline;
  sources: ContentFile[];
  compiled: boolean;
  outputPath?: string;
  compiledContent?: string;
  errors?: string[];
}

export interface TagExtractionResult {
  allTags: string[];
  orbTags: number[];
}

