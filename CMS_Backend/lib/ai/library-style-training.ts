/**
 * Library-Based Style Training System
 * 
 * Trains AI on user's actual content from the content library
 * to learn authentic writing patterns and style constraints.
 */

import { createClient } from '@/lib/supabase/client';
import { writingStyleTrainer } from './style-training';

export interface LibraryTrainingConfig {
  minContentLength: number; // Minimum words to include in training
  maxExamples: number; // Maximum number of examples to use
  includeDrafts: boolean; // Whether to include draft content
  contentTypes: string[]; // Which content types to include
  orbAssociations: number[]; // Specific orbs to focus on (empty = all)
}

export class LibraryStyleTrainer {
  private config: LibraryTrainingConfig;

  constructor(config: Partial<LibraryStyleTrainer> = {}) {
    this.config = {
      minContentLength: 100, // At least 100 words
      maxExamples: 10, // Use up to 10 examples
      includeDrafts: true,
      contentTypes: ['essay', 'codex_entry', 'book_fragment', 'research_notes'],
      orbAssociations: [], // All orbs
      ...config
    };
  }

  /**
   * Train on content from the user's library
   */
  async trainFromLibrary(): Promise<{
    success: boolean;
    examplesUsed: number;
    errors: string[];
    patterns: any;
  }> {
    try {
      const supabase = createClient();
      
      // Build query for content files
      let query = supabase
        .from('content_files')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by content types if specified
      if (this.config.contentTypes.length > 0) {
        query = query.in('content_type', this.config.contentTypes);
      }

      // Filter by status
      if (!this.config.includeDrafts) {
        query = query.eq('status', 'published');
      }

      const { data: files, error } = await query;

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      if (!files || files.length === 0) {
        return {
          success: false,
          examplesUsed: 0,
          errors: ['No content files found in library'],
          patterns: null
        };
      }

      // Filter and process files
      const trainingExamples = [];
      const errors = [];

      for (const file of files.slice(0, this.config.maxExamples)) {
        try {
          // Check minimum content length
          const wordCount = file.markdown_body?.split(/\s+/).length || 0;
          if (wordCount < this.config.minContentLength) {
            continue;
          }

          // Extract scrollstreams from content
          const scrollstreams = this.extractScrollstreams(file.markdown_body);

          // Add to training examples
          trainingExamples.push({
            id: `library_${file.id}`,
            content: file.markdown_body,
            title: file.title,
            orbAssociations: file.orb_associations || [],
            tags: file.tags || [],
            scrollstreams,
            source: 'content_library',
            wordCount,
            contentType: file.content_type,
            status: file.status
          });

        } catch (error) {
          errors.push(`Error processing file ${file.title}: ${error}`);
        }
      }

      // Train the style trainer with library examples
      for (const example of trainingExamples) {
        writingStyleTrainer.addExample(example);
      }

      const patterns = writingStyleTrainer.getLearnedPatterns();

      return {
        success: true,
        examplesUsed: trainingExamples.length,
        errors,
        patterns
      };

    } catch (error) {
      return {
        success: false,
        examplesUsed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        patterns: null
      };
    }
  }

  /**
   * Get training statistics from library
   */
  async getLibraryTrainingStats(): Promise<{
    totalFiles: number;
    eligibleFiles: number;
    contentTypes: { [key: string]: number };
    orbDistribution: { [key: number]: number };
    averageWordCount: number;
    statusDistribution: { [key: string]: number };
  }> {
    try {
      const supabase = createClient();
      
      const { data: files, error } = await supabase
        .from('content_files')
        .select('*');

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      if (!files) {
        return {
          totalFiles: 0,
          eligibleFiles: 0,
          contentTypes: {},
          orbDistribution: {},
          averageWordCount: 0,
          statusDistribution: {}
        };
      }

      // Calculate statistics
      const eligibleFiles = files.filter(file => {
        const wordCount = file.markdown_body?.split(/\s+/).length || 0;
        return wordCount >= this.config.minContentLength;
      });

      const contentTypes: { [key: string]: number } = {};
      const orbDistribution: { [key: number]: number } = {};
      const statusDistribution: { [key: string]: number } = {};
      let totalWords = 0;

      files.forEach(file => {
        // Content types
        const type = file.content_type || 'unknown';
        contentTypes[type] = (contentTypes[type] || 0) + 1;

        // Status distribution
        const status = file.status || 'unknown';
        statusDistribution[status] = (statusDistribution[status] || 0) + 1;

        // Word count
        const wordCount = file.markdown_body?.split(/\s+/).length || 0;
        totalWords += wordCount;

        // Orb associations
        if (file.orb_associations) {
          file.orb_associations.forEach((orb: number) => {
            orbDistribution[orb] = (orbDistribution[orb] || 0) + 1;
          });
        }
      });

      return {
        totalFiles: files.length,
        eligibleFiles: eligibleFiles.length,
        contentTypes,
        orbDistribution,
        averageWordCount: files.length > 0 ? Math.round(totalWords / files.length) : 0,
        statusDistribution
      };

    } catch (error) {
      throw new Error(`Error getting library stats: ${error}`);
    }
  }

  /**
   * Extract scrollstreams from content
   */
  private extractScrollstreams(content: string): string[] {
    const scrollstreams = [];
    
    // Look for @scrollstream markers
    const scrollstreamMatches = content.match(/@scrollstream[:\s]*([^\n]+)/gi);
    if (scrollstreamMatches) {
      scrollstreams.push(...scrollstreamMatches.map(match => 
        match.replace(/@scrollstream[:\s]*/i, '').trim()
      ));
    }

    // Look for quoted scrollstreams
    const quotedMatches = content.match(/"([^"]{10,80})"/g);
    if (quotedMatches) {
      scrollstreams.push(...quotedMatches.map(match => 
        match.replace(/"/g, '').trim()
      ));
    }

    return [...new Set(scrollstreams)]; // Remove duplicates
  }

  /**
   * Update training configuration
   */
  updateConfig(updates: Partial<LibraryTrainingConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Get current configuration
   */
  getConfig(): LibraryTrainingConfig {
    return { ...this.config };
  }
}

// Singleton instance
export const libraryStyleTrainer = new LibraryStyleTrainer();



