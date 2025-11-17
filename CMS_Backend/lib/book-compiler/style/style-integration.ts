/**
 * Style Training Integration Module
 * 
 * Integrates style training to ensure voice consistency in generated content.
 * Uses the existing style training system to learn patterns from content library.
 * 
 * Part of Layer 5 (Interfaces) of the compiler architecture.
 */

import { writingStyleTrainer } from '@/lib/ai/style-training';
import { libraryStyleTrainer } from '@/lib/ai/library-style-training';
import type { WritingStylePattern } from '@/lib/ai/style-training';

export interface StyleIntegrationResult {
  stylePrompt: string;
  hasTraining: boolean;
  patterns: WritingStylePattern | null;
}

/**
 * Get style prompt for narrative generation
 * 
 * Returns the style prompt if training is available, empty string otherwise.
 */
export function getStylePrompt(): string {
  return writingStyleTrainer.generateStylePrompt();
}

/**
 * Get style integration result
 * 
 * Returns style prompt, training status, and patterns.
 */
export function getStyleIntegration(): StyleIntegrationResult {
  const stylePrompt = getStylePrompt();
  const patterns = writingStyleTrainer.getLearnedPatterns();
  
  return {
    stylePrompt,
    hasTraining: stylePrompt.length > 0,
    patterns
  };
}

/**
 * Train style from content library
 * 
 * Optionally trains the style trainer from the content library if not already trained.
 */
export async function ensureStyleTraining(options?: {
  forceRetrain?: boolean;
  maxExamples?: number;
  minContentLength?: number;
}): Promise<{
  success: boolean;
  examplesUsed: number;
  errors: string[];
  patterns: WritingStylePattern | null;
}> {
  // Check if already trained
  const existingPatterns = writingStyleTrainer.getLearnedPatterns();
  if (existingPatterns && !options?.forceRetrain) {
    return {
      success: true,
      examplesUsed: writingStyleTrainer.getExamples().length,
      errors: [],
      patterns: existingPatterns
    };
  }

  // Update library trainer config if options provided
  if (options) {
    libraryStyleTrainer.updateConfig({
      maxExamples: options.maxExamples,
      minContentLength: options.minContentLength
    });
  }

  // Train from library
  const result = await libraryStyleTrainer.trainFromLibrary();
  
  return {
    success: result.success,
    examplesUsed: result.examplesUsed,
    errors: result.errors,
    patterns: result.patterns
  };
}

/**
 * Add style example for training
 * 
 * Manually add a writing example to the style trainer.
 */
export function addStyleExample(example: {
  id?: string;
  content: string;
  title: string;
  orbAssociations?: number[];
  tags?: string[];
  scrollstreams?: string[];
}): void {
  writingStyleTrainer.addExample(example);
}

/**
 * Check if style training is available
 */
export function hasStyleTraining(): boolean {
  const patterns = writingStyleTrainer.getLearnedPatterns();
  return patterns !== null;
}

/**
 * Get style training statistics
 */
export async function getStyleTrainingStats(): Promise<{
  totalExamples: number;
  hasPatterns: boolean;
  libraryStats?: {
    totalFiles: number;
    eligibleFiles: number;
    averageWordCount: number;
  };
}> {
  const examples = writingStyleTrainer.getExamples();
  const patterns = writingStyleTrainer.getLearnedPatterns();
  
  try {
    const libraryStats = await libraryStyleTrainer.getLibraryTrainingStats();
    
    return {
      totalExamples: examples.length,
      hasPatterns: patterns !== null,
      libraryStats: {
        totalFiles: libraryStats.totalFiles,
        eligibleFiles: libraryStats.eligibleFiles,
        averageWordCount: libraryStats.averageWordCount
      }
    };
  } catch (error) {
    return {
      totalExamples: examples.length,
      hasPatterns: patterns !== null
    };
  }
}

/**
 * Build enhanced style prompt for book compilation
 * 
 * Adds book-specific context to the style prompt.
 */
export function buildBookCompilationStylePrompt(
  chapterContext?: {
    title?: string;
    orb_focus?: number;
  }
): string {
  const basePrompt = getStylePrompt();
  
  if (!basePrompt) {
    return '';
  }

  let enhancedPrompt = basePrompt;

  // Add book compilation context
  if (chapterContext) {
    enhancedPrompt += `\n\n## BOOK COMPILATION CONTEXT\n`;
    if (chapterContext.title) {
      enhancedPrompt += `- Chapter: ${chapterContext.title}\n`;
    }
    if (chapterContext.orb_focus) {
      enhancedPrompt += `- Primary Orb Focus: Orb ${chapterContext.orb_focus}\n`;
    }
    enhancedPrompt += `- Purpose: Generate recognition-first, coherent narrative for book compilation\n`;
    enhancedPrompt += `- Maintain voice consistency with existing content library\n`;
  }

  return enhancedPrompt;
}

