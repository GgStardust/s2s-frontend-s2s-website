/**
 * RBI Discovery Module
 * 
 * Finds resonant content beyond metadata matches using RBI neighbor finding.
 * This expands the content pool from top 3 (metadata) to top 15 (with RBI).
 * 
 * Layer 2 of the compiler architecture.
 */

import { EnhancedResonanceEngine } from '@/lib/mathematics/enhanced-resonance-engine';
import { findNeighbors, type NeighborSearchParams, type NeighborItem } from '@/lib/rbi/core/index.js';
import { ResonanceVectorMath, type ResonanceVector } from '@/lib/mathematics/resonance-vectors.js';
import type { ContentFile, ChapterOutline } from '../types.js';

export interface DiscoveryResult {
  file: ContentFile;
  score: number;
  coherence?: number;
  fieldDynamics?: {
    fieldStrength: number;
    stability: number;
    coherence: number;
  };
}

/**
 * Find resonant neighbors for a chapter using RBI
 * 
 * This searches the ENTIRE content library and finds content that resonates
 * with the chapter, even if metadata doesn't match perfectly.
 */
export async function findResonantNeighbors(
  chapter: ChapterOutline,
  allContentFiles: ContentFile[],
  metadataMatches: ContentFile[],
  maxNeighbors: number = 15
): Promise<ContentFile[]> {
  // Create query from chapter
  const chapterQuery = {
    text: `${chapter.title} ${chapter.description || ''}`,
    orbAssociations: chapter.orb_focus ? [chapter.orb_focus] : []
  };

  // Analyze chapter to get resonance vector
  const resonanceEngine = EnhancedResonanceEngine.getInstance();
  const chapterAnalysis = await resonanceEngine.analyzeContentWithMathematics(
    chapterQuery.text,
    chapter.title,
    {
      orb_associations: chapterQuery.orbAssociations
    }
  );

  const chapterResonanceVector = chapterAnalysis.mathematical.resonanceVector;

  // Convert all content files to candidates with resonance vectors
  const candidates = await Promise.all(
    allContentFiles.map(async (file) => {
      try {
        // Skip if already in metadata matches (avoid duplicates)
        const isMetadataMatch = metadataMatches.some(m => m.file_path === file.file_path);
        if (isMetadataMatch) {
          return null;
        }

        // Filter to only essays (same as metadata selector)
        // Allow files without explicit type if they have content (RBI can work with content alone)
        const fileType = file.yaml?.type || 'essay';
        if (fileType !== 'essay' && !file.content) {
          return null;
        }

        // Check framework files
        if (file.yaml.source_type === 'system_reference' || file.yaml.system_role === 'core_framework') {
          if (file.yaml.use_in_book_compiler !== true) {
            return null;
          }
        }

        // Analyze content to get resonance vector
        const fileAnalysis = await resonanceEngine.analyzeContentWithMathematics(
          file.content,
          file.title,
          {
            orb_associations: file.orb_tags.length > 0 ? file.orb_tags : undefined
          }
        );

        return {
          id: file.file_path,
          text: file.content,
          resonanceVector: fileAnalysis.mathematical.resonanceVector,
          orbAssociations: file.orb_tags.length > 0 ? file.orb_tags : undefined,
          metadata: {
            file_path: file.file_path,
            title: file.title,
            yaml: file.yaml
          },
          sourceFile: file
        };
      } catch (error) {
        console.warn(`Warning: Failed to analyze ${file.title} for RBI discovery:`, error);
        return null;
      }
    })
  );

  // Filter out nulls
  const validCandidates = candidates.filter((c): c is NonNullable<typeof c> => c !== null);

  if (validCandidates.length === 0) {
    return [];
  }

  // Use RBI findNeighbors to discover resonant content
  const searchParams: NeighborSearchParams = {
    query: {
      text: chapterQuery.text,
      resonanceVector: chapterResonanceVector,
      orbAssociations: chapterQuery.orbAssociations.length > 0 ? chapterQuery.orbAssociations : undefined
    },
    candidates: validCandidates,
    topN: maxNeighbors,
    useResonance: true,
    useOrbSystem: true // Use Orb system for enhanced discovery
  };

  const neighbors = findNeighbors(searchParams);

  // Convert neighbors back to ContentFile format
  const discoveredFiles: ContentFile[] = neighbors
    .map(neighbor => {
      const candidate = validCandidates.find(c => c.id === neighbor.id);
      return candidate?.sourceFile;
    })
    .filter((file): file is ContentFile => file !== undefined);

  return discoveredFiles;
}

/**
 * Get discovery details for debugging/logging
 */
export async function getDiscoveryDetails(
  chapter: ChapterOutline,
  allContentFiles: ContentFile[],
  metadataMatches: ContentFile[],
  maxNeighbors: number = 15
): Promise<{ discovered: ContentFile[]; details: DiscoveryResult[] }> {
  const discovered = await findResonantNeighbors(
    chapter,
    allContentFiles,
    metadataMatches,
    maxNeighbors
  );

  // Get detailed scores for discovered files
  const resonanceEngine = EnhancedResonanceEngine.getInstance();
  const chapterQuery = {
    text: `${chapter.title} ${chapter.description || ''}`,
    orbAssociations: chapter.orb_focus ? [chapter.orb_focus] : []
  };

  const chapterAnalysis = await resonanceEngine.analyzeContentWithMathematics(
    chapterQuery.text,
    chapter.title,
    {
      orb_associations: chapterQuery.orbAssociations
    }
  );

  const chapterResonanceVector = chapterAnalysis.mathematical.resonanceVector;

  const details: DiscoveryResult[] = await Promise.all(
    discovered.map(async (file) => {
      try {
        const fileAnalysis = await resonanceEngine.analyzeContentWithMathematics(
          file.content,
          file.title,
          {
            orb_associations: file.orb_tags.length > 0 ? file.orb_tags : undefined
          }
        );

        const fileResonanceVector = fileAnalysis.mathematical.resonanceVector;
        const fieldDynamics = fileAnalysis.mathematical.fieldDynamics;

        // Calculate similarity score (simplified - using vector similarity)
        const similarity = calculateVectorSimilarity(chapterResonanceVector, fileResonanceVector);

        return {
          file,
          score: similarity,
          coherence: fieldDynamics.coherence,
          fieldDynamics: {
            fieldStrength: fieldDynamics.fieldStrength,
            stability: fieldDynamics.stability,
            coherence: fieldDynamics.coherence
          }
        };
      } catch (error) {
        console.warn(`Warning: Failed to get details for ${file.title}:`, error);
        return {
          file,
          score: 0
        };
      }
    })
  );

  return { discovered, details };
}

/**
 * Combine metadata matches and RBI discoveries, removing duplicates
 */
export function combineAndDeduplicate(
  metadataMatches: ContentFile[],
  rbiDiscoveries: ContentFile[]
): ContentFile[] {
  const metadataPaths = new Set(metadataMatches.map(m => m.file_path));
  
  // Add all metadata matches
  const combined = [...metadataMatches];
  
  // Add RBI discoveries that aren't already in metadata matches
  for (const discovery of rbiDiscoveries) {
    if (!metadataPaths.has(discovery.file_path)) {
      combined.push(discovery);
    }
  }
  
  return combined;
}

/**
 * Calculate cosine similarity between two resonance vectors
 */
function calculateVectorSimilarity(
  vector1: ResonanceVector,
  vector2: ResonanceVector
): number {
  const dotProduct = 
    vector1.x * vector2.x +
    vector1.y * vector2.y +
    vector1.z * vector2.z +
    vector1.w * vector2.w;
  
  const magnitude1 = Math.sqrt(
    vector1.x * vector1.x +
    vector1.y * vector1.y +
    vector1.z * vector1.z +
    vector1.w * vector1.w
  );
  
  const magnitude2 = Math.sqrt(
    vector2.x * vector2.x +
    vector2.y * vector2.y +
    vector2.z * vector2.z +
    vector2.w * vector2.w
  );
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
}

