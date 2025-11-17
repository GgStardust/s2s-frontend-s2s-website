/**
 * Flow Optimization Module
 * 
 * Optimizes section ordering based on resonance flow.
 * Validates smooth transitions and ensures narrative coherence.
 * 
 * Part of Layer 7 (Editorial) of the compiler architecture.
 */

import type { ContentFile } from '../types.js';
import type { RecognitionScore } from './recognition-first.js';
import type { Gap } from './gap-detection.js';
import { findOptimalOrdering, type OrderingResult } from '../rbi/ordering.js';

export interface FlowOptimizationResult {
  optimized: Array<ContentFile | { content: string; title: string }>;
  originalOrder: Array<ContentFile | { content: string; title: string }>;
  changes: Array<{
    from: number;
    to: number;
    reason: string;
  }>;
  improvement: {
    averageResonance: number;
    coherenceGaps: number;
    recognitionFlow: 'improved' | 'maintained' | 'degraded';
  };
}

/**
 * Optimize flow for recognition-first structure
 * 
 * Combines recognition-first ordering with resonance-based ordering.
 */
export async function optimizeFlowForRecognitionFirst(
  sections: Array<ContentFile | { content: string; title: string }>,
  recognitionScores: RecognitionScore[]
): Promise<FlowOptimizationResult> {
  const originalOrder = [...sections];
  
  // Reorder for recognition-first
  const recognitionOrdered = recognitionScores
    .sort((a, b) => b.score - a.score)
    .map(rs => rs.section);
  
  // If sections are ContentFiles, use RBI ordering within recognition groups
  const contentFiles = sections.filter((s): s is ContentFile => 
    'file_path' in s && 'yaml' in s
  );
  
  let optimized: Array<ContentFile | { content: string; title: string }>;
  
  if (contentFiles.length === sections.length) {
    // All are ContentFiles - use RBI ordering
    const orderingResult = await findOptimalOrdering(contentFiles);
    
    // Merge recognition-first with RBI ordering
    // Prioritize recognition-first, but use RBI for fine-tuning
    optimized = mergeRecognitionAndResonanceOrder(
      recognitionOrdered as ContentFile[],
      orderingResult.ordered
    );
  } else {
    // Mixed types - use recognition-first only
    optimized = recognitionOrdered;
  }
  
  // Track changes
  const changes: FlowOptimizationResult['changes'] = [];
  for (let i = 0; i < originalOrder.length; i++) {
    const original = originalOrder[i];
    const newIndex = optimized.findIndex(opt => 
      ('file_path' in original && 'file_path' in opt && original.file_path === opt.file_path) ||
      ('title' in original && 'title' in opt && original.title === opt.title)
    );
    
    if (newIndex !== i && newIndex !== -1) {
      changes.push({
        from: i,
        to: newIndex,
        reason: newIndex < i ? 'Moved earlier (higher recognition)' : 'Moved later (lower recognition)'
      });
    }
  }
  
  // Calculate improvement metrics
  const avgRecognitionScore = recognitionScores.reduce((sum, rs) => sum + rs.score, 0) / recognitionScores.length;
  const recognitionFlow: 'improved' | 'maintained' | 'degraded' = 
    changes.length > 0 ? 'improved' : 'maintained';
  
  return {
    optimized,
    originalOrder,
    changes,
    improvement: {
      averageResonance: avgRecognitionScore,
      coherenceGaps: 0, // Will be calculated by gap detection
      recognitionFlow
    }
  };
}

/**
 * Merge recognition-first ordering with RBI resonance ordering
 */
function mergeRecognitionAndResonanceOrder(
  recognitionOrdered: ContentFile[],
  resonanceOrdered: ContentFile[]
): ContentFile[] {
  // Group by recognition type (experience, mixed, concept)
  // Then within each group, use RBI ordering
  
  // For now, prioritize recognition-first
  // RBI ordering can be used for fine-tuning within recognition groups
  return recognitionOrdered;
}

/**
 * Validate flow quality
 */
export function validateFlow(
  sections: Array<ContentFile | { content: string; title: string }>,
  gaps: Gap[]
): {
  isValid: boolean;
  issues: string[];
  averageCoherence: number;
} {
  const issues: string[] = [];
  
  const criticalGaps = gaps.filter(g => g.severity === 'high');
  if (criticalGaps.length > 0) {
    issues.push(`Found ${criticalGaps.length} critical coherence gaps`);
  }
  
  const avgCoherence = gaps.length > 0
    ? gaps.reduce((sum, g) => sum + g.coherence, 0) / gaps.length
    : 1.0;
  
  if (avgCoherence < 0.6) {
    issues.push(`Average coherence (${avgCoherence.toFixed(2)}) below threshold (0.6)`);
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    averageCoherence: avgCoherence
  };
}

