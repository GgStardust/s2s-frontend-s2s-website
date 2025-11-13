/**
 * Codex Content Loader
 * 
 * Loads and processes Codex markdown files for ScrollStream
 * Uses RBI resonance matching to select relevant content
 */

import matter from 'gray-matter';
import type { ResonanceMatrix } from '../rbi/kernel';

export interface CodexContent {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  orbTags?: number[];
  metadata?: Record<string, any>;
}

/**
 * Load Codex content from markdown files
 * For MVP, returns mock content. In production, would load from file system or API.
 */
export async function loadCodexContent(): Promise<CodexContent[]> {
  // Mock Codex content for MVP
  // In production, this would:
  // 1. Read from 09_PROCESSED/02f_S2S_codex_essays/ (relative to CMS_Backend root)
  // 2. Parse with gray-matter
  // 3. Extract excerpts and metadata
  
  const mockContent: CodexContent[] = [
    {
      id: '1',
      title: 'Resonance and Coherence',
      content: 'The field emerges from resonance relationships between all elements. Coherence creates structure through meaning, and each Orb connects to the living field.',
      excerpt: 'The field emerges from resonance relationships',
      orbTags: [1, 2, 3],
    },
    {
      id: '2',
      title: 'Temporal Sovereignty',
      content: 'Time flows not as a linear progression but as a field of possibilities. Sovereignty emerges when we align with the temporal field.',
      excerpt: 'Time flows not as a linear progression but as a field of possibilities',
      orbTags: [5, 9],
    },
    {
      id: '3',
      title: 'Quantum Intuition',
      content: 'Intuition bridges the quantum field and conscious awareness. It is the resonance between possibility and actuality.',
      excerpt: 'Intuition bridges the quantum field and conscious awareness',
      orbTags: [8, 11],
    },
    {
      id: '4',
      title: 'Ancestral Repatterning',
      content: 'Patterns inherited from ancestors can be transformed through resonance. The field remembers, but also evolves.',
      excerpt: 'Patterns inherited from ancestors can be transformed through resonance',
      orbTags: [10, 12],
    },
    {
      id: '5',
      title: 'Radiant Transparency',
      content: 'Transparency is not absence but presence. It is the clarity that emerges when coherence aligns with truth.',
      excerpt: 'Transparency is not absence but presence',
      orbTags: [11, 13],
    },
  ];

  return mockContent;
}

/**
 * Match Codex content to Orbs based on resonance
 * @param content - Codex content items
 * @param resonanceMatrix - Current resonance matrix
 * @param selectedOrbId - Currently selected Orb (optional)
 * @returns Sorted content by resonance relevance
 */
export function matchContentByResonance(
  content: CodexContent[],
  resonanceMatrix: ResonanceMatrix,
  selectedOrbId?: number
): CodexContent[] {
  // Calculate resonance score for each content item
  const scoredContent = content.map((item) => {
    let totalResonance = 0;
    let count = 0;

    // If content has orbTags, calculate average resonance
    if (item.orbTags && item.orbTags.length > 0) {
      item.orbTags.forEach((orbId) => {
        if (resonanceMatrix[orbId]) {
          Object.values(resonanceMatrix[orbId]).forEach((strength) => {
            totalResonance += strength;
            count++;
          });
        }
      });
    }

    // Boost resonance if matches selected Orb
    if (selectedOrbId && item.orbTags?.includes(selectedOrbId)) {
      totalResonance *= 1.5;
    }

    const avgResonance = count > 0 ? totalResonance / count : 0.5;

    return {
      ...item,
      resonanceScore: avgResonance,
    };
  });

  // Sort by resonance score (highest first)
  return scoredContent
    .sort((a, b) => (b.resonanceScore || 0) - (a.resonanceScore || 0))
    .map(({ resonanceScore, ...item }) => item);
}

/**
 * Extract text snippets from Codex content for ScrollStream
 * @param content - Codex content items
 * @param maxLength - Maximum length of each snippet
 * @returns Array of text snippets
 */
export function extractScrollStreamSnippets(
  content: CodexContent[],
  maxLength: number = 80
): string[] {
  const snippets: string[] = [];

  content.forEach((item) => {
    // Use excerpt if available, otherwise extract from content
    const text = item.excerpt || item.content;
    
    // Split into sentences and create snippets
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    
    sentences.forEach((sentence) => {
      const trimmed = sentence.trim();
      if (trimmed.length > 0 && trimmed.length <= maxLength) {
        snippets.push(trimmed);
      } else if (trimmed.length > maxLength) {
        // Split long sentences
        const words = trimmed.split(' ');
        let currentSnippet = '';
        
        words.forEach((word) => {
          if ((currentSnippet + ' ' + word).length <= maxLength) {
            currentSnippet += (currentSnippet ? ' ' : '') + word;
          } else {
            if (currentSnippet) {
              snippets.push(currentSnippet);
            }
            currentSnippet = word;
          }
        });
        
        if (currentSnippet) {
          snippets.push(currentSnippet);
        }
      }
    });
  });

  return snippets;
}

