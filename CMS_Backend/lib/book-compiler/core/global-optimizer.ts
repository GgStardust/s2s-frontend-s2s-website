/**
 * Global Optimization Module
 * 
 * Optimizes content assignment across ALL chapters simultaneously.
 * This ensures:
 * - Each piece of content is used in its best location
 * - No content is overused or underused
 * - Orb essays are prioritized where most relevant
 * - Content is distributed optimally across the book
 * 
 * This is a non-linear, holistic approach to book compilation.
 */

import type { ContentFile, ChapterOutline } from '../types.js';
import { getSelectionDetails } from './metadata-selector.js';
import type { SelectionResult } from './metadata-selector.js';

export interface GlobalAssignment {
  chapter: ChapterOutline;
  sources: ContentFile[];
  score: number;
  reasons: string[];
}

export interface GlobalOptimizationResult {
  assignments: GlobalAssignment[];
  unusedContent: ContentFile[];
  overusedContent: Array<{ file: ContentFile; usedIn: number; chapters: number[] }>;
  optimizationMetrics: {
    totalChapters: number;
    totalContentFiles: number;
    averageSourcesPerChapter: number;
    contentUtilizationRate: number;
    orbEssayUtilization: number;
  };
}

/**
 * Optimize content assignment globally across all chapters
 * 
 * Strategy:
 * 1. Score all content against all chapters
 * 2. Build a preference matrix (content → chapters, ranked by score)
 * 3. Use Hungarian algorithm or greedy assignment to optimize
 * 4. Ensure Orb essays are prioritized appropriately
 * 5. Balance content usage (avoid overusing popular pieces)
 */
export function optimizeGlobally(
  chapters: ChapterOutline[],
  allContentFiles: ContentFile[],
  config: {
    minSourcesPerChapter?: number;
    maxSourcesPerChapter?: number;
    maxUsesPerContent?: number;
    prioritizeOrbEssays?: boolean;
  } = {}
): GlobalOptimizationResult {
  const {
    minSourcesPerChapter = 3,
    maxSourcesPerChapter = 15,
    maxUsesPerContent = 3, // Allow content to be used in up to 3 chapters
    prioritizeOrbEssays = true,
  } = config;

  // Step 1: Score all content against all chapters
  const preferenceMatrix: Map<string, Array<{ chapter: ChapterOutline; score: number; details: SelectionResult }>> = new Map();
  
  for (const contentFile of allContentFiles) {
    const fileKey = contentFile.file_path;
    const scores: Array<{ chapter: ChapterOutline; score: number; details: SelectionResult }> = [];

    for (const chapter of chapters) {
      const { details } = getSelectionDetails(chapter, [contentFile], 1);
      if (details.length > 0) {
        scores.push({
          chapter,
          score: details[0].score,
          details: details[0],
        });
      }
    }

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);
    preferenceMatrix.set(fileKey, scores);
  }

  // Step 2: Identify Orb essays for prioritization
  const orbEssays = allContentFiles.filter(f => 
    f.file_path.includes('orb_') && 
    f.file_path.includes('02d_Orb_Essays')
  );

  // Step 3: Greedy assignment with constraints
  const assignments: GlobalAssignment[] = [];
  const contentUsageCount: Map<string, number> = new Map();
  const contentUsedIn: Map<string, number[]> = new Map();

  // Initialize usage tracking
  for (const file of allContentFiles) {
    contentUsageCount.set(file.file_path, 0);
    contentUsedIn.set(file.file_path, []);
  }

  // Process chapters in order, but with global awareness
  for (const chapter of chapters) {
    const chapterAssignments: Array<{ file: ContentFile; score: number; reasons: string[] }> = [];
    
    // Get all potential sources for this chapter
    const { details } = getSelectionDetails(chapter, allContentFiles, maxSourcesPerChapter * 2);
    
    // Sort by score, but apply global constraints
    const candidateSources = details
      .map(d => ({
        file: d.file,
        score: d.score,
        reasons: d.reasons,
        usageCount: contentUsageCount.get(d.file.file_path) || 0,
        isOrbEssay: orbEssays.some(oe => oe.file_path === d.file.file_path),
      }))
      .sort((a, b) => {
        // Prioritize Orb essays if enabled
        if (prioritizeOrbEssays) {
          if (a.isOrbEssay && !b.isOrbEssay) return -1;
          if (!a.isOrbEssay && b.isOrbEssay) return 1;
        }
        
        // Prefer less-used content (diversity bonus)
        const usageDiff = a.usageCount - b.usageCount;
        if (Math.abs(usageDiff) > 0) {
          return usageDiff; // Lower usage = higher priority
        }
        
        // Then by score
        return b.score - a.score;
      })
      .filter(candidate => {
        // Apply max uses constraint
        return candidate.usageCount < maxUsesPerContent;
      });

    // Select top sources for this chapter
    const selected = candidateSources.slice(0, maxSourcesPerChapter);
    
    // Update usage tracking
    for (const selectedSource of selected) {
      const currentCount = contentUsageCount.get(selectedSource.file.file_path) || 0;
      contentUsageCount.set(selectedSource.file.file_path, currentCount + 1);
      
      const usedIn = contentUsedIn.get(selectedSource.file.file_path) || [];
      usedIn.push(chapter.chapter_number);
      contentUsedIn.set(selectedSource.file.file_path, usedIn);
    }

    // Calculate chapter score (average of source scores)
    const chapterScore = selected.length > 0
      ? selected.reduce((sum, s) => sum + s.score, 0) / selected.length
      : 0;

    assignments.push({
      chapter,
      sources: selected.map(s => s.file),
      score: chapterScore,
      reasons: selected.flatMap(s => s.reasons),
    });
  }

  // Step 4: Identify unused and overused content
  const unusedContent = allContentFiles.filter(f => {
    const count = contentUsageCount.get(f.file_path) || 0;
    return count === 0;
  });

  const overusedContent = Array.from(contentUsageCount.entries())
    .filter(([_, count]) => count > maxUsesPerContent)
    .map(([filePath, count]) => {
      const file = allContentFiles.find(f => f.file_path === filePath)!;
      const chapters = contentUsedIn.get(filePath) || [];
      return { file, usedIn: count, chapters };
    });

  // Step 5: Calculate metrics
  const totalSources = assignments.reduce((sum, a) => sum + a.sources.length, 0);
  const usedContentCount = allContentFiles.length - unusedContent.length;
  const orbEssaysUsed = orbEssays.filter(oe => {
    const count = contentUsageCount.get(oe.file_path) || 0;
    return count > 0;
  }).length;

  const optimizationMetrics = {
    totalChapters: chapters.length,
    totalContentFiles: allContentFiles.length,
    averageSourcesPerChapter: totalSources / chapters.length,
    contentUtilizationRate: usedContentCount / allContentFiles.length,
    orbEssayUtilization: orbEssaysUsed / orbEssays.length,
  };

  return {
    assignments,
    unusedContent,
    overusedContent,
    optimizationMetrics,
  };
}

/**
 * Get optimization report as markdown
 */
export function generateOptimizationReport(result: GlobalOptimizationResult): string {
  const lines: string[] = [];
  
  lines.push('# Global Book Compilation Optimization Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  
  lines.push('## Optimization Metrics\n');
  lines.push(`- **Total Chapters:** ${result.optimizationMetrics.totalChapters}`);
  lines.push(`- **Total Content Files:** ${result.optimizationMetrics.totalContentFiles}`);
  lines.push(`- **Average Sources per Chapter:** ${result.optimizationMetrics.averageSourcesPerChapter.toFixed(2)}`);
  lines.push(`- **Content Utilization Rate:** ${(result.optimizationMetrics.contentUtilizationRate * 100).toFixed(1)}%`);
  lines.push(`- **Orb Essay Utilization:** ${(result.optimizationMetrics.orbEssayUtilization * 100).toFixed(1)}%\n`);
  
  if (result.unusedContent.length > 0) {
    lines.push('## Unused Content\n');
    lines.push(`Found ${result.unusedContent.length} content files that were not assigned to any chapter:\n`);
    result.unusedContent.slice(0, 20).forEach(file => {
      lines.push(`- ${file.title} (${file.file_path})`);
    });
    if (result.unusedContent.length > 20) {
      lines.push(`\n... and ${result.unusedContent.length - 20} more`);
    }
    lines.push('');
  }
  
  if (result.overusedContent.length > 0) {
    lines.push('## Overused Content\n');
    lines.push(`Found ${result.overusedContent.length} content files used in more than the recommended number of chapters:\n`);
    result.overusedContent.forEach(item => {
      lines.push(`- **${item.file.title}**: Used in ${item.usedIn} chapters (${item.chapters.join(', ')})`);
    });
    lines.push('');
  }
  
  lines.push('## Chapter Assignments\n');
  lines.push('| Chapter | Title | Sources | Avg Score |');
  lines.push('|---------|-------|---------|-----------|');
  
  result.assignments.forEach(assignment => {
    lines.push(`| ${assignment.chapter.chapter_number} | ${assignment.chapter.title} | ${assignment.sources.length} | ${assignment.score.toFixed(1)} |`);
  });
  
  lines.push('\n## Detailed Assignments\n');
  
  result.assignments.forEach(assignment => {
    lines.push(`### Chapter ${assignment.chapter.chapter_number}: ${assignment.chapter.title}\n`);
    lines.push(`**Score:** ${assignment.score.toFixed(1)} | **Sources:** ${assignment.sources.length}\n`);
    
    assignment.sources.forEach((source, idx) => {
      lines.push(`${idx + 1}. **${source.title}**`);
      lines.push(`   - File: ${source.file_path}`);
      if (source.orb_tags.length > 0) {
        lines.push(`   - Orbs: ${source.orb_tags.join(', ')}`);
      }
    });
    lines.push('');
  });
  
  return lines.join('\n');
}

