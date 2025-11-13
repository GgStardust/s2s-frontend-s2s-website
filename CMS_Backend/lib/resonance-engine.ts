/**
 * Resonance Engine - Calculus of Construction Implementation
 * 
 * Implements the S2S resonance validation system based on:
 * - 13 Canonical Orbs
 * - Resonance scoring metrics (strength, clarity, coherence, pattern)
 * - Proof status validation
 */

export interface ResonanceResult {
  proofStatus: 'proven' | 'partial' | 'unproven' | 'error';
  coherenceScore: number; // 0-1 scale
  validatedOrbs: number[]; // Array of orb numbers (1-13)
  metrics: {
    strength: number; // 1-10 scale
    clarity: number; // 1-10 scale
    coherence: number; // 1-10 scale
    pattern: number; // 1-10 scale
  };
  explanation: string;
}

export interface ResonanceContext {
  content: string;
  title?: string;
  existingOrbs?: number[];
  existingTags?: string[];
}

// Canonical Orb System (from system-prompt.ts)
const ORB_SYSTEM = [
  { number: 1, name: "Origin Intelligence", synthesis: "Photonic blueprinting meets biological activation" },
  { number: 2, name: "Resonance Mechanics", synthesis: "Sovereign signal enters form and becomes architecture" },
  { number: 3, name: "Photonic Intelligence", synthesis: "Reflection initiates coherence through light webs" },
  { number: 4, name: "Harmonic Architectures", synthesis: "Chaos becomes rhythm through harmonic law" },
  { number: 5, name: "Temporal Sovereignty", synthesis: "Exit time as container and reclaim it as tool" },
  { number: 6, name: "Starline Memory", synthesis: "Memory returns as signal across galactic networks" },
  { number: 7, name: "Alchemical Current", synthesis: "Density becomes light through heat and compression" },
  { number: 8, name: "Quantum Intuition", synthesis: "Intuition becomes infrastructure for decision-making" },
  { number: 9, name: "Temporal Fluidity", synthesis: "Attunement across time without fragmentation" },
  { number: 10, name: "Ancestral Repatterning", synthesis: "Body becomes myth; field becomes form" },
  { number: 11, name: "Radiant Transparency", synthesis: "Inner architecture emitted outward with clarity" },
  { number: 12, name: "Sovereign Field", synthesis: "Structural indivisibility; coherence made field" },
  { number: 13, name: "Bridging Intelligence", synthesis: "Communication pathways between human and nonhuman" },
];

// Key terms for each orb (simplified mapping)
const ORB_KEYWORDS = {
  1: ['origin', 'intelligence', 'photonic', 'blueprint', 'biological', 'activation'],
  2: ['resonance', 'mechanics', 'signal', 'form', 'architecture', 'frequency', 'vibration'],
  3: ['photonic', 'intelligence', 'reflection', 'coherence', 'light', 'webs'],
  4: ['harmonic', 'architectures', 'chaos', 'rhythm', 'geometry', 'sacred'],
  5: ['temporal', 'sovereignty', 'time', 'spiral', 'agency', 'container'],
  6: ['starline', 'memory', 'galactic', 'ancestral', 'recall', 'signal'],
  7: ['alchemical', 'current', 'density', 'light', 'compression', 'transmutation'],
  8: ['quantum', 'intuition', 'nonlinear', 'knowing', 'infrastructure'],
  9: ['temporal', 'fluidity', 'attunement', 'timelines', 'fragmentation'],
  10: ['ancestral', 'repatterning', 'lineage', 'myth', 'field', 'form'],
  11: ['radiant', 'transparency', 'clarity', 'architecture', 'emitted'],
  12: ['sovereign', 'field', 'indivisibility', 'coherence', 'structural'],
  13: ['bridging', 'intelligence', 'communication', 'human', 'nonhuman', 'pathways']
};

export class ResonanceEngine {
  /**
   * Main validation function - analyzes content for resonance
   */
  async validateResonance(context: ResonanceContext): Promise<ResonanceResult> {
    try {
      const { content, title, existingOrbs = [], existingTags = [] } = context;
      
      // Step 1: Analyze content for orb associations
      const detectedOrbs = this.detectOrbAssociations(content, title);
      
      // Step 2: Calculate resonance metrics
      const metrics = this.calculateResonanceMetrics(content, detectedOrbs);
      
      // Step 3: Determine proof status
      const proofStatus = this.determineProofStatus(metrics, detectedOrbs);
      
      // Step 4: Calculate coherence score
      const coherenceScore = this.calculateCoherenceScore(metrics, detectedOrbs);
      
      // Step 5: Generate explanation
      const explanation = this.generateExplanation(proofStatus, metrics, detectedOrbs);
      
      return {
        proofStatus,
        coherenceScore,
        validatedOrbs: detectedOrbs,
        metrics,
        explanation
      };
    } catch (error) {
      console.error('Resonance validation error:', error);
      return {
        proofStatus: 'error',
        coherenceScore: 0,
        validatedOrbs: [],
        metrics: { strength: 0, clarity: 0, coherence: 0, pattern: 0 },
        explanation: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Detect which orbs are associated with the content
   */
  private detectOrbAssociations(content: string, title?: string): number[] {
    const fullText = `${title || ''} ${content}`.toLowerCase();
    const associatedOrbs: number[] = [];
    
    for (const [orbNumber, keywords] of Object.entries(ORB_KEYWORDS)) {
      const orbNum = parseInt(orbNumber);
      const keywordMatches = keywords.filter(keyword => 
        fullText.includes(keyword.toLowerCase())
      ).length;
      
      // If content contains 2+ keywords for an orb, associate it
      if (keywordMatches >= 2) {
        associatedOrbs.push(orbNum);
      }
    }
    
    // If no orbs detected, default to Orb 1 (Origin Intelligence)
    if (associatedOrbs.length === 0) {
      associatedOrbs.push(1);
    }
    
    return associatedOrbs;
  }

  /**
   * Calculate resonance metrics based on content analysis
   */
  private calculateResonanceMetrics(content: string, orbs: number[]): {
    strength: number;
    clarity: number;
    coherence: number;
    pattern: number;
  } {
    const wordCount = content.split(/\s+/).length;
    const orbCount = orbs.length;
    
    // Strength: Based on content length and orb associations
    const strength = Math.min(10, Math.max(1, Math.round((wordCount / 100) + (orbCount * 2))));
    
    // Clarity: Based on sentence structure and technical terms
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = wordCount / sentences.length;
    const clarity = Math.min(10, Math.max(1, Math.round(10 - (avgSentenceLength - 15) / 5)));
    
    // Coherence: Based on orb system alignment
    const coherence = Math.min(10, Math.max(1, orbCount * 3));
    
    // Pattern: Based on structural elements (headers, lists, etc.)
    const hasHeaders = /^#+\s/.test(content);
    const hasLists = /^[\s]*[-*+]\s/.test(content);
    const hasCode = /```/.test(content);
    const patternElements = [hasHeaders, hasLists, hasCode].filter(Boolean).length;
    const pattern = Math.min(10, Math.max(1, patternElements * 3 + 4));
    
    return { strength, clarity, coherence, pattern };
  }

  /**
   * Determine proof status based on metrics and orb associations
   */
  private determineProofStatus(
    metrics: { strength: number; clarity: number; coherence: number; pattern: number },
    orbs: number[]
  ): 'proven' | 'partial' | 'unproven' | 'error' {
    const avgMetric = (metrics.strength + metrics.clarity + metrics.coherence + metrics.pattern) / 4;
    
    if (avgMetric >= 8 && orbs.length >= 2) {
      return 'proven';
    } else if (avgMetric >= 6 && orbs.length >= 1) {
      return 'partial';
    } else if (avgMetric >= 4) {
      return 'unproven';
    } else {
      return 'error';
    }
  }

  /**
   * Calculate overall coherence score (0-1 scale)
   */
  private calculateCoherenceScore(
    metrics: { strength: number; clarity: number; coherence: number; pattern: number },
    orbs: number[]
  ): number {
    const avgMetric = (metrics.strength + metrics.clarity + metrics.coherence + metrics.pattern) / 4;
    const orbBonus = Math.min(0.2, orbs.length * 0.05); // Up to 20% bonus for multiple orbs
    return Math.min(1, (avgMetric / 10) + orbBonus);
  }

  /**
   * Generate human-readable explanation of validation results
   */
  private generateExplanation(
    proofStatus: string,
    metrics: { strength: number; clarity: number; coherence: number; pattern: number },
    orbs: number[]
  ): string {
    const orbNames = orbs.map(num => `Orb ${num}: ${ORB_SYSTEM[num - 1]?.name || 'Unknown'}`).join(', ');
    
    return `Resonance validation ${proofStatus}. Content shows ${metrics.strength}/10 strength, ${metrics.clarity}/10 clarity, ${metrics.coherence}/10 coherence, and ${metrics.pattern}/10 pattern. Associated with: ${orbNames}.`;
  }
}

// Export singleton instance
export const resonanceEngine = new ResonanceEngine();

// Export main validation function for easy use
export async function validateResonance(content: string, title?: string): Promise<ResonanceResult> {
  return resonanceEngine.validateResonance({ content, title });
}