/**
 * Bridge Generation Utilities
 * 
 * Helper functions for generating and managing narrative bridges.
 */

import type { ContentFile } from '../types.js';
import type { BridgeResult } from './narrative-generation.js';

/**
 * Insert bridges into ordered content
 */
export function insertBridges(
  orderedSources: ContentFile[],
  bridges: Array<{ position: number; bridge: BridgeResult }>
): Array<ContentFile | { type: 'bridge'; content: string; metadata: any }> {
  const result: Array<ContentFile | { type: 'bridge'; content: string; metadata: any }> = [];
  
  // Sort bridges by position (descending) to insert from end
  const sortedBridges = [...bridges].sort((a, b) => b.position - a.position);
  
  let currentIndex = orderedSources.length;
  
  // Insert bridges from end to beginning
  for (const { position, bridge } of sortedBridges) {
    // Add all sources up to position
    while (currentIndex > position) {
      currentIndex--;
      result.unshift(orderedSources[currentIndex]);
    }
    
    // Insert bridge
    result.unshift({
      type: 'bridge',
      content: bridge.content,
      metadata: {
        resonance: bridge.resonance,
        coherence: bridge.coherence,
        source1: orderedSources[position - 1]?.title,
        source2: orderedSources[position]?.title
      }
    });
  }
  
  // Add remaining sources
  while (currentIndex > 0) {
    currentIndex--;
    result.unshift(orderedSources[currentIndex]);
  }
  
  return result;
}

/**
 * Format bridge content for chapter compilation
 */
export function formatBridge(bridge: BridgeResult, source1: ContentFile, source2: ContentFile): string {
  return `\n\n<!-- Bridge: ${source1.title} → ${source2.title} (Resonance: ${bridge.resonance.toFixed(2)}, Coherence: ${bridge.coherence.toFixed(2)}) -->\n\n${bridge.content}\n\n`;
}

