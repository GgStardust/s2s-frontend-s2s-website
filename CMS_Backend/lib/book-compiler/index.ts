/**
 * Main Book Compiler Interface
 * 
 * Orchestrates all layers of the book compiler:
 * - Core (metadata matching)
 * - RBI (discovery, validation, ordering)
 * - Orbital Brain (narrative generation)
 * - Style Training (voice consistency)
 * - Editorial (readability & recognition-first)
 * 
 * Provides unified interface with configurable layers and backward compatibility.
 */

import * as fs from 'fs';
import * as path from 'path';

// Core modules
import { loadContentFiles } from './core/content-loader.js';
import { selectSourcesForChapter } from './core/metadata-selector.js';
import { compileChapter as compileChapterCore } from './core/chapter-compiler.js';
import { loadBookOutline, type OutlineInputMode, type OutlineLoaderConfig, createOutlineConfig } from './core/outline-loader.js';

// RBI modules
import { findResonantNeighbors, combineAndDeduplicate } from './rbi/discovery.js';
import { validateResonanceBetweenSources, validateChapterCoherence, filterSourcesByValidation } from './rbi/validation.js';
import { findOptimalOrdering } from './rbi/ordering.js';

// Orbital Brain modules
import { generateRecognitionFirstOpening, generateBridgesForGaps } from './orbital/narrative-generation.js';
import { formatBridge } from './orbital/bridges.js';

// Style modules
import { getStyleIntegration, buildBookCompilationStylePrompt, ensureStyleTraining } from './style/style-integration.js';

// Editorial modules
import { analyzeSectionReadability, identifyDenseSections } from './editorial/readability.js';
import { scoreAllSections, reorderForRecognitionFirst, getBestOpeningSection } from './editorial/recognition-first.js';
import { detectGaps, getCriticalGaps } from './editorial/gap-detection.js';
import { optimizeFlowForRecognitionFirst, validateFlow } from './editorial/flow-optimization.js';

// Types and config
import type { ContentFile, ChapterOutline, CompiledChapter, CompilationResult } from './types.js';
import type { CompilerConfig } from './config.js';
import { mergeConfig, DEFAULT_CONFIG } from './config.js';

export interface CompilationReport {
  chapter: ChapterOutline;
  success: boolean;
  sourcesUsed: number;
  layersApplied: string[];
  rbiMetrics?: {
    coherence: number;
    fieldStrength: number;
    stability: number;
  };
  editorialMetrics?: {
    readability: {
      averageClarity: number;
      averageAccessibility: number;
    };
    gapsDetected: number;
    recognitionFlow: 'improved' | 'maintained' | 'degraded';
  };
  style_applied?: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Compile a single chapter with all configured layers
 * 
 * @param chapter - Chapter outline
 * @param config - Compiler configuration
 * @param preSelectedSources - Optional: Pre-selected sources (skips metadata matching and RBI discovery)
 */
export async function compileChapter(
  chapter: ChapterOutline,
  config: Partial<CompilerConfig> = {},
  preSelectedSources?: ContentFile[]
): Promise<CompiledChapter & { layersApplied?: string[]; warnings?: string[] }> {
  const finalConfig = mergeConfig(config);
  const layersApplied: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    let selectedSources: ContentFile[];
    
    if (preSelectedSources && preSelectedSources.length > 0) {
      // Use pre-selected sources (from global optimization)
      selectedSources = preSelectedSources;
      layersApplied.push('global_optimization');
    } else {
      // Load all content files
      const allContentFiles = loadContentFiles({
        contentBasePath: finalConfig.contentBasePath,
        orbEssaysPath: finalConfig.orbEssaysPath,
        codexEssaysPath: finalConfig.codexEssaysPath,
        systemEssaysPath: finalConfig.systemEssaysPath
      });

      // Layer 1: Metadata Matching (always enabled)
      selectedSources = selectSourcesForChapter(
        chapter,
        allContentFiles,
        finalConfig.maxSources || 3
      );
      layersApplied.push('metadata_matching');

      // Layer 2: RBI Discovery (optional)
      if (finalConfig.useRBIDiscovery) {
        try {
          const rbiNeighbors = await findResonantNeighbors(
            chapter,
            allContentFiles,
            selectedSources,
            finalConfig.maxSources || 15
          );
          
          selectedSources = combineAndDeduplicate(selectedSources, rbiNeighbors);
          layersApplied.push('rbi_discovery');
        } catch (error) {
          errors.push(`RBI Discovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Layer 3: RBI Validation (optional)
    if (finalConfig.useRBIValidation && selectedSources.length > 1) {
      try {
        const validation = await validateResonanceBetweenSources(selectedSources);
        
        if (!validation.valid) {
          warnings.push(`Low resonance detected (avg: ${validation.averageResonance.toFixed(2)}, min: ${validation.minResonance.toFixed(2)})`);
          
          // Filter sources if validation fails
          if (finalConfig.minCoherence) {
            selectedSources = await filterSourcesByValidation(selectedSources, finalConfig.minCoherence);
          }
        }
        
        layersApplied.push('rbi_validation');
      } catch (error) {
        errors.push(`RBI Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Layer 4: RBI Ordering (optional)
    if (finalConfig.useRBIOrdering && selectedSources.length > 1) {
      try {
        const orderingResult = await findOptimalOrdering(selectedSources);
        selectedSources = orderingResult.ordered;
        layersApplied.push('rbi_ordering');
      } catch (error) {
        errors.push(`RBI Ordering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Layer 5: Style Training (optional)
    let stylePrompt: string | undefined;
    if (finalConfig.useStyleTraining) {
      try {
        const styleIntegration = getStyleIntegration();
        if (styleIntegration.hasTraining) {
          stylePrompt = buildBookCompilationStylePrompt({
            title: chapter.title,
            orb_focus: chapter.orb_focus
          });
          layersApplied.push('style_training');
        } else {
          // Try to train from library
          await ensureStyleTraining();
          const retry = getStyleIntegration();
          if (retry.hasTraining) {
            stylePrompt = buildBookCompilationStylePrompt({
              title: chapter.title,
              orb_focus: chapter.orb_focus
            });
            layersApplied.push('style_training');
          }
        }
      } catch (error) {
        warnings.push(`Style training unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Layer 6: Editorial - Recognition-First Restructuring (optional)
    if (finalConfig.useEditorialLayer && finalConfig.recognitionFirst) {
      try {
        // Score sections for recognition quality
        const recognitionScores = await scoreAllSections(selectedSources);
        
        // Reorder for recognition-first
        const reorderedScores = reorderForRecognitionFirst(recognitionScores);
        selectedSources = reorderedScores.map(rs => rs.section as ContentFile);
        
        layersApplied.push('recognition_first_restructuring');
      } catch (error) {
        errors.push(`Recognition-first restructuring failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Layer 7: Orbital Brain - Recognition-First Opening (optional)
    let openingContent = '';
    if (finalConfig.useOrbitalBrain) {
      try {
        const opening = await generateRecognitionFirstOpening(
          chapter,
          selectedSources,
          stylePrompt
        );
        openingContent = opening.content;
        layersApplied.push('orbital_brain_opening');
      } catch (error) {
        warnings.push(`Failed to generate opening: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Compile chapter with selected sources
    let compiledChapter = await compileChapterCore(chapter, selectedSources, finalConfig);

    // Layer 7: Orbital Brain - Bridges (optional)
    if (finalConfig.useOrbitalBrain && finalConfig.enableGapBridging && selectedSources.length > 1) {
      try {
        const gaps = await detectGaps(selectedSources, finalConfig.minCoherence);
        const bridges = await generateBridgesForGaps(selectedSources, stylePrompt);
        
        // Insert bridges into compiled content
        if (bridges.length > 0) {
          // Extract YAML and content from compiled chapter
          const yamlMatch = compiledChapter.content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          if (yamlMatch) {
            const yaml = yamlMatch[1];
            let chapterContent = yamlMatch[2];
            
            // Split content by source markers (## Source X:)
            const sourceMarkers = chapterContent.match(/^## Source \d+:/gm);
            if (sourceMarkers && sourceMarkers.length > 0) {
              // Find positions of each source in the content
              const sourcePositions: number[] = [];
              let searchIndex = 0;
              for (const marker of sourceMarkers) {
                const pos = chapterContent.indexOf(marker, searchIndex);
                if (pos !== -1) {
                  sourcePositions.push(pos);
                  searchIndex = pos + marker.length;
                }
              }
              
              // Insert bridges in reverse order (from end to beginning) to preserve positions
              const sortedBridges = [...bridges].sort((a, b) => b.position - a.position);
              
              for (const { position, bridge } of sortedBridges) {
                const source1 = selectedSources[position - 1];
                const source2 = selectedSources[position];
                if (source1 && source2 && sourcePositions[position]) {
                  const bridgeText = formatBridge(bridge, source1, source2);
                  // Insert bridge before the source at this position
                  const insertPos = sourcePositions[position];
                  chapterContent = chapterContent.slice(0, insertPos) + 
                                   bridgeText + 
                                   chapterContent.slice(insertPos);
                }
              }
            }
            
            // Reconstruct with opening if present
            let finalContent = chapterContent;
            if (openingContent) {
              // Find where chapter title/description ends and sources begin
              const titleMatch = chapterContent.match(/^# .+?\n\n/);
              if (titleMatch) {
                const afterTitle = chapterContent.slice(titleMatch[0].length);
                finalContent = titleMatch[0] + openingContent + '\n\n' + afterTitle;
              } else {
                finalContent = openingContent + '\n\n' + chapterContent;
              }
            }
            
            compiledChapter.content = `---\n${yaml}\n---\n\n${finalContent}`;
          }
          
          layersApplied.push('orbital_brain_bridges');
        }
      } catch (error) {
        warnings.push(`Failed to generate bridges: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Add opening if generated
    if (openingContent) {
      // Extract YAML and content from compiled chapter
      const yamlMatch = compiledChapter.content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (yamlMatch) {
        const yaml = yamlMatch[1];
        const existingContent = yamlMatch[2];
        compiledChapter.content = `---\n${yaml}\n---\n\n${openingContent}\n\n${existingContent}`;
      } else {
        compiledChapter.content = `${openingContent}\n\n${compiledChapter.content}`;
      }
    }

    // Layer 8: RBI Chapter Validation (optional)
    let rbiMetrics: CompiledChapter['rbi_metrics'];
    if (finalConfig.useRBIValidation) {
      try {
        const validation = await validateChapterCoherence(compiledChapter, finalConfig.minCoherence);
        rbiMetrics = {
          coherence: validation.coherence,
          field_strength: validation.fieldStrength,
          stability: validation.stability
        };
        
        if (!validation.isValid) {
          warnings.push(`Chapter coherence (${validation.coherence.toFixed(2)}) below threshold`);
        }
      } catch (error) {
        errors.push(`Chapter validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Layer 9: Editorial - Readability Analysis (optional)
    if (finalConfig.useEditorialLayer) {
      try {
        const readabilityResults = await analyzeSectionReadability(selectedSources);
        const denseSections = identifyDenseSections(readabilityResults);
        
        if (denseSections.length > 0) {
          warnings.push(`Found ${denseSections.length} dense sections that may need simplification`);
        }
      } catch (error) {
        warnings.push(`Readability analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      ...compiledChapter,
      rbi_metrics: rbiMetrics,
      style_applied: !!stylePrompt,
      layersApplied,
      warnings: warnings.length > 0 ? warnings : undefined
    };

  } catch (error) {
    throw new Error(`Chapter compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Compile full book with all configured layers
 */
export async function compileBook(
  chapters: ChapterOutline[],
  config: Partial<CompilerConfig> = {}
): Promise<{
  results: CompilationResult[];
  report: CompilationReport[];
  summary: {
    totalChapters: number;
    compiled: number;
    skipped: number;
    totalSources: number;
    layersUsed: string[];
  };
}> {
  const finalConfig = mergeConfig(config);
  const results: CompilationResult[] = [];
  const reports: CompilationReport[] = [];
  const allLayersUsed = new Set<string>();

  // Ensure style training if enabled
  if (finalConfig.useStyleTraining) {
    await ensureStyleTraining();
  }

  for (const chapter of chapters) {
    try {
      const compiled = await compileChapter(chapter, finalConfig);
      
      // Track layers used
      // (This would be tracked in compileChapter, but for now we'll infer from config)
      if (finalConfig.useRBIDiscovery) allLayersUsed.add('rbi_discovery');
      if (finalConfig.useRBIValidation) allLayersUsed.add('rbi_validation');
      if (finalConfig.useRBIOrdering) allLayersUsed.add('rbi_ordering');
      if (finalConfig.useOrbitalBrain) allLayersUsed.add('orbital_brain');
      if (finalConfig.useStyleTraining) allLayersUsed.add('style_training');
      if (finalConfig.useEditorialLayer) allLayersUsed.add('editorial');

      results.push({
        chapter,
        sources: compiled.sources,
        compiled: true,
        compiledContent: compiled.content
      });

      // Build report
      const report: CompilationReport = {
        chapter,
        success: true,
        sourcesUsed: compiled.sources.length,
        layersApplied: compiled.layersApplied || Array.from(allLayersUsed),
        rbiMetrics: compiled.rbi_metrics,
        style_applied: compiled.style_applied,
        warnings: compiled.warnings
      };

      reports.push(report);

    } catch (error) {
      results.push({
        chapter,
        sources: [],
        compiled: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });

      reports.push({
        chapter,
        success: false,
        sourcesUsed: 0,
        layersApplied: [],
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  const compiled = results.filter(r => r.compiled).length;
  const totalSources = results.reduce((sum, r) => sum + r.sources.length, 0);

  return {
    results,
    report: reports,
    summary: {
      totalChapters: chapters.length,
      compiled,
      skipped: chapters.length - compiled,
      totalSources,
      layersUsed: Array.from(allLayersUsed)
    }
  };
}

/**
 * Save compiled chapter to file
 */
export function saveCompiledChapter(
  compiledChapter: CompiledChapter,
  outputPath: string
): void {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, compiledChapter.content, 'utf-8');
}

/**
 * Generate compilation report
 */
export function generateCompilationReport(
  results: CompilationResult[],
  reports: CompilationReport[]
): string {
  const lines: string[] = [];
  
  lines.push('# Book Compilation Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  
  const compiled = results.filter(r => r.compiled).length;
  const totalSources = results.reduce((sum, r) => sum + r.sources.length, 0);
  
  lines.push('## Summary\n');
  lines.push(`- **Total Chapters:** ${results.length}`);
  lines.push(`- **Compiled:** ${compiled}`);
  lines.push(`- **Skipped:** ${results.length - compiled}`);
  lines.push(`- **Total Sources Used:** ${totalSources}\n`);
  
  lines.push('## Chapter Details\n');
  lines.push('| Chapter | Title | Status | Sources | Layers |');
  lines.push('|---------|-------|--------|--------|--------|');
  
  reports.forEach((report, idx) => {
    const status = report.success ? '✅ Compiled' : '⏭️ Skipped';
    const layers = report.layersApplied.join(', ') || 'metadata_only';
    lines.push(`| ${report.chapter.chapter_number} | ${report.chapter.title} | ${status} | ${report.sourcesUsed} | ${layers} |`);
  });
  
  if (reports.some(r => r.errors && r.errors.length > 0)) {
    lines.push('\n## Errors\n');
    reports.forEach(report => {
      if (report.errors && report.errors.length > 0) {
        lines.push(`### Chapter ${report.chapter.chapter_number}: ${report.chapter.title}`);
        report.errors.forEach(error => lines.push(`- ${error}`));
        lines.push('');
      }
    });
  }
  
  if (reports.some(r => r.warnings && r.warnings.length > 0)) {
    lines.push('\n## Warnings\n');
    reports.forEach(report => {
      if (report.warnings && report.warnings.length > 0) {
        lines.push(`### Chapter ${report.chapter.chapter_number}: ${report.chapter.title}`);
        report.warnings.forEach(warning => lines.push(`- ⚠️ ${warning}`));
        lines.push('');
      }
    });
  }
  
  return lines.join('\n');
}

/**
 * Load outline and compile book in one step
 * 
 * This is a convenience function that combines outline loading with book compilation.
 * Supports all outline input modes (database, markdown, json, yaml, direct).
 * 
 * @example
 * // Load from markdown file
 * const result = await loadAndCompileBook(
 *   { mode: 'markdown', file_path: './outline.md' },
 *   { useRBIDiscovery: true, useEditorialLayer: true }
 * );
 * 
 * @example
 * // Load from database
 * const result = await loadAndCompileBook(
 *   { mode: 'database', book_id: 'uuid-here' },
 *   { useRBIDiscovery: true }
 * );
 */
export async function loadAndCompileBook(
  outlineInput: OutlineInputMode,
  config: Partial<CompilerConfig> = {},
  outlineOptions?: {
    supabaseUrl?: string;
    supabaseKey?: string;
  }
): Promise<{
  results: CompilationResult[];
  report: CompilationReport[];
  summary: {
    totalChapters: number;
    compiled: number;
    skipped: number;
    totalSources: number;
    layersUsed: string[];
  };
}> {
  // Load outline first
  const outlineConfig = createOutlineConfig(outlineInput, outlineOptions);
  const chapters = await loadBookOutline(outlineConfig);
  
  // Then compile
  return await compileBook(chapters, config);
}

/**
 * Compile book with global optimization
 * 
 * This function optimizes content assignment across ALL chapters simultaneously,
 * ensuring optimal distribution and prioritizing Orb essays appropriately.
 */
export async function compileBookWithGlobalOptimization(
  chapters: ChapterOutline[],
  config: Partial<CompilerConfig> = {}
): Promise<{
  results: CompilationResult[];
  report: CompilationReport[];
  summary: {
    totalChapters: number;
    compiled: number;
    skipped: number;
    totalSources: number;
    layersUsed: string[];
  };
  optimization?: {
    assignments: Array<{ chapter: ChapterOutline; sources: ContentFile[]; score: number }>;
    unusedContent: ContentFile[];
    overusedContent: Array<{ file: ContentFile; usedIn: number }>;
    metrics: {
      contentUtilizationRate: number;
      orbEssayUtilization: number;
    };
  };
}> {
  const finalConfig = mergeConfig(config);
  
  // Load all content files
  const allContentFiles = loadContentFiles({
    contentBasePath: finalConfig.contentBasePath,
    orbEssaysPath: finalConfig.orbEssaysPath,
    codexEssaysPath: finalConfig.codexEssaysPath,
    systemEssaysPath: finalConfig.systemEssaysPath
  });

  // Run global optimization
  const { optimizeGlobally, generateOptimizationReport } = await import('./core/global-optimizer.js');
  const optimizationResult = optimizeGlobally(chapters, allContentFiles, {
    minSourcesPerChapter: 3,
    maxSourcesPerChapter: finalConfig.maxSources || 15,
    maxUsesPerContent: 3,
    prioritizeOrbEssays: true,
  });

  // Compile each chapter using optimized assignments
  const results: CompilationResult[] = [];
  const reports: CompilationReport[] = [];
  const allLayersUsed = new Set<string>();

  if (finalConfig.useStyleTraining) {
    await ensureStyleTraining();
  }

  for (const assignment of optimizationResult.assignments) {
    try {
      // Use the globally optimized sources for this chapter
      const compiled = await compileChapter(
        assignment.chapter,
        finalConfig,
        assignment.sources // Pass pre-selected sources from global optimization
      );
      
      // For now, we'll compile normally but track the optimization
      if (finalConfig.useRBIDiscovery) allLayersUsed.add('rbi_discovery');
      if (finalConfig.useRBIValidation) allLayersUsed.add('rbi_validation');
      if (finalConfig.useRBIOrdering) allLayersUsed.add('rbi_ordering');
      if (finalConfig.useOrbitalBrain) allLayersUsed.add('orbital_brain');
      if (finalConfig.useStyleTraining) allLayersUsed.add('style_training');
      if (finalConfig.useEditorialLayer) allLayersUsed.add('editorial');

      results.push({
        chapter: assignment.chapter,
        sources: assignment.sources, // Use globally optimized sources
        compiled: true,
        compiledContent: compiled.content
      });

      reports.push({
        chapter: assignment.chapter,
        success: true,
        sourcesUsed: assignment.sources.length, // Use globally optimized source count
        layersApplied: compiled.layersApplied || Array.from(allLayersUsed),
        rbiMetrics: compiled.rbi_metrics,
        style_applied: compiled.style_applied,
        warnings: compiled.warnings
      });

    } catch (error) {
      results.push({
        chapter: assignment.chapter,
        sources: [],
        compiled: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });

      reports.push({
        chapter: assignment.chapter,
        success: false,
        sourcesUsed: 0,
        layersApplied: [],
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  const compiled = results.filter(r => r.compiled).length;
  const totalSources = results.reduce((sum, r) => sum + r.sources.length, 0);

  return {
    results,
    report: reports,
    summary: {
      totalChapters: chapters.length,
      compiled,
      skipped: chapters.length - compiled,
      totalSources,
      layersUsed: Array.from(allLayersUsed)
    },
    optimization: {
      assignments: optimizationResult.assignments.map(a => ({
        chapter: a.chapter,
        sources: a.sources,
        score: a.score
      })),
      unusedContent: optimizationResult.unusedContent,
      overusedContent: optimizationResult.overusedContent.map(o => ({
        file: o.file,
        usedIn: o.usedIn
      })),
      metrics: {
        contentUtilizationRate: optimizationResult.optimizationMetrics.contentUtilizationRate,
        orbEssayUtilization: optimizationResult.optimizationMetrics.orbEssayUtilization,
      }
    }
  };
}

// Export types and config
export * from './types.js';
export * from './config.js';
export * from './core/index.js';
export * from './rbi/index.js';
export * from './orbital/index.js';
export * from './style/index.js';
export * from './editorial/index.js';

