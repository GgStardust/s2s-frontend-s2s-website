/**
 * Compiler Configuration Interface
 */

export interface CompilerConfig {
  // Core (always enabled)
  useMetadataMatching: boolean;  // Always true - base layer
  
  // RBI Layers
  useRBIDiscovery?: boolean;      // Find resonant content beyond metadata
  useRBIValidation?: boolean;    // Validate resonance between sources
  useRBIOrdering?: boolean;       // Optimal content ordering
  
  // Narrative Layers
  useOrbitalBrain?: boolean;      // Narrative generation (openings, bridges)
  useStyleTraining?: boolean;     // Voice consistency
  
  // Editorial Layer
  useEditorialLayer?: boolean;    // Readability & recognition-first restructuring
  
  // Options
  maxSources?: number;           // Default: 3 (metadata) or 15 (with RBI)
  recognitionFirst?: boolean;    // Recognition-first flow
  minCoherence?: number;        // Minimum coherence threshold (0-1)
  enableGapBridging?: boolean;   // Auto-generate bridges for gaps
  
  // Content Curation (Priority 2)
  enableContentCuration?: boolean;  // Extract key sections instead of full essays (default: true)
  maxSectionsPerSource?: number;    // Max sections to extract per source (default: 3)
  maxLengthPerSource?: number;      // Max length per source in chars (default: 5000)
  
  // Source Restructuring (Priority 3)
  enableSourceRestructuring?: boolean;  // Restructure sections within sources for recognition-first (default: true)
  
  // Synthesis (Priority 4)
  enableSynthesis?: boolean;        // Create unified narrative instead of source compilation (default: false)
  maxChapterLength?: number;        // Max chapter length in chars when using synthesis (default: 50000)
  preserveScrollstreams?: boolean;  // Keep scrollstreams in synthesized content (default: false)
  
  // Paths (optional - defaults provided)
  contentBasePath?: string;
  orbEssaysPath?: string;
  codexEssaysPath?: string;
  systemEssaysPath?: string;  // System essays (philosophical foundation, etc.)
  outputPath?: string;
}

export const DEFAULT_CONFIG: CompilerConfig = {
  useMetadataMatching: true,
  useRBIDiscovery: false,
  useRBIValidation: false,
  useRBIOrdering: false,
  useOrbitalBrain: false,
  useStyleTraining: false,
  useEditorialLayer: false,
  maxSources: 3,
  recognitionFirst: false,
  minCoherence: 0.7,
  enableGapBridging: false,
  enableContentCuration: true,  // Default: enabled (Priority 2)
  maxSectionsPerSource: 3,
  maxLengthPerSource: 5000,
  enableSourceRestructuring: true,  // Default: enabled (Priority 3)
  enableSynthesis: false,  // Default: disabled (Priority 4) - can be enabled for narrative synthesis
  maxChapterLength: 30000,  // Reduced from 50000 - synthesis should be more focused
  preserveScrollstreams: false,
};

/**
 * Merge user config with defaults
 */
export function mergeConfig(userConfig: Partial<CompilerConfig>): CompilerConfig {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };
}

