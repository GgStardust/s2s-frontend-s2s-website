/**
 * Orb System Validator
 * 
 * A living validator and semantic index for the 13-Orb System.
 * Provides validation, boundary checking, and semantic coherence for Codex content.
 */

import { canonicalStore } from './canonical-store';

export interface OrbDefinition {
  orbNumber: number;
  name: string;
  uniqueEssence: {
    coreFunction: string;
    primaryDomain: string;
    keyMechanism: string;
    uniqueQuality: string;
  };
  owns: string[];
  references: string[];
  redundancyToEliminate: string[];
}

export interface ValidationResult {
  isValid: boolean;
  violations: string[];
  suggestions: string[];
  orbBoundaries: {
    correctOrb: number;
    incorrectOrb: number;
    content: string;
  }[];
}

export class OrbSystemValidator {
  private orbDefinitions: Map<number, OrbDefinition> = new Map();
  private isInitialized = false;

  constructor() {
    this.initializeOrbDefinitions();
  }

  /**
   * Initialize the 13-Orb definitions from the comprehensive outline
   */
  private initializeOrbDefinitions(): void {
    // Orb 1: Origin Intelligence
    this.orbDefinitions.set(1, {
      orbNumber: 1,
      name: "Origin Intelligence",
      uniqueEssence: {
        coreFunction: "Origination code of embodiment",
        primaryDomain: "Pre-form light encoding meets biological activation",
        keyMechanism: "Mitochondrial ignition and cosmic biological circuitry",
        uniqueQuality: "The spark that makes consciousness possible"
      },
      owns: [
        "Stellar inheritance (atoms forged in stars)",
        "Mitochondrial ignition (cellular suns)",
        "Cosmic microwave background",
        "Pre-form light encoding",
        "Consciousness-technology gap resolution",
        "Photonic blueprint of embodiment",
        "Stellar architecture of human form",
        "Quantum-biological interface"
      ],
      references: [
        "Photonic intelligence (provides blueprint, but Orb 3 owns reflection)",
        "Resonance mechanics (provides signal, but Orb 2 owns translation)",
        "Harmonic architectures (provides foundation, but Orb 4 owns structuring)"
      ],
      redundancyToEliminate: [
        "Biophoton content (belongs to Orb 3's reflection mechanics)",
        "General 'light' content (too broad, not specific to origination)"
      ]
    });

    // Orb 2: Resonance Mechanics
    this.orbDefinitions.set(2, {
      orbNumber: 2,
      name: "Resonance Mechanics",
      uniqueEssence: {
        coreFunction: "Translation of encoded signal into structure",
        primaryDomain: "Sound, cymatics, emotion, resonance fields",
        keyMechanism: "Signal becomes architecture through vibration",
        uniqueQuality: "The universal language of coherence"
      },
      owns: [
        "Resonance as universal language",
        "Signal-to-form translation",
        "Vibrational architecture",
        "Field reading and atmospheric charge",
        "Musical transmission and acoustic resonance",
        "Frequency fit assessment",
        "Resonance database development",
        "Harmonic intervals between conflicting energies",
        "Bridge collapse lessons (Tacoma Narrows)"
      ],
      references: [
        "Origin Intelligence (receives signal from, but doesn't own origination)",
        "Photonic Intelligence (amplifies through, but doesn't own reflection)",
        "Harmonic Architectures (provides rhythm, but doesn't own structuring)"
      ],
      redundancyToEliminate: [
        "General 'field' content (too broad, not specific to resonance)",
        "Consciousness content (belongs to Orb 1's origination)"
      ]
    });

    // Orb 3: Photonic Intelligence
    this.orbDefinitions.set(3, {
      orbNumber: 3,
      name: "Photonic Intelligence",
      uniqueEssence: {
        coreFunction: "Light webs and relational mirrors for field observation",
        primaryDomain: "Reflection initiates coherence",
        keyMechanism: "Duality harnessed for synthesis, not opposition",
        uniqueQuality: "The mirror function of consciousness"
      },
      owns: [
        "Mirror function and self-recognition",
        "Reflection mechanics",
        "Duality synthesis (opposites becoming coherent)",
        "Relational mirrors as diagnostic tools",
        "Dream navigation and photonic projection",
        "Light webs and photonic interrelation",
        "Consciousness transfer through light",
        "Interspecies preparation through light exchange",
        "Shadow and distortion as information",
        "Hall of mirrors (distortion patterns)"
      ],
      references: [
        "Origin Intelligence (receives photonic blueprint, but doesn't own origination)",
        "Resonance Mechanics (amplifies through, but doesn't own signal translation)",
        "Bridging Intelligence (enables through reflection, but doesn't own bridging)"
      ],
      redundancyToEliminate: [
        "Biophoton content (belongs to Orb 1's mitochondrial ignition)",
        "Cosmic microwave background (Orb 1's domain)",
        "Stellar inheritance (Orb 1's stellar architecture)",
        "Consciousness-technology gap (Orb 1's domain)",
        "General 'light' content (too broad, not specific to reflection)"
      ]
    });

    // Continue with remaining orbs... (abbreviated for space)
    // In production, this would load from the actual outline file
    
    this.isInitialized = true;
  }

  /**
   * Validate content against Orb boundaries
   */
  async validateContent(content: string, claimedOrb: number): Promise<ValidationResult> {
    if (!this.isInitialized) {
      throw new Error('OrbSystemValidator not initialized');
    }

    const violations: string[] = [];
    const suggestions: string[] = [];
    const orbBoundaries: any[] = [];

    const claimedOrbDef = this.orbDefinitions.get(claimedOrb);
    if (!claimedOrbDef) {
      return {
        isValid: false,
        violations: [`Invalid Orb number: ${claimedOrb}`],
        suggestions: ['Use Orb numbers 1-13'],
        orbBoundaries: []
      };
    }

    // Check for content that belongs to other orbs
    for (const [orbNumber, orbDef] of this.orbDefinitions) {
      if (orbNumber === claimedOrb) continue;

      for (const ownedContent of orbDef.owns) {
        if (this.contentContainsConcept(content, ownedContent)) {
          violations.push(`Content "${ownedContent}" belongs to Orb ${orbNumber} (${orbDef.name}), not Orb ${claimedOrb}`);
          orbBoundaries.push({
            correctOrb: orbNumber,
            incorrectOrb: claimedOrb,
            content: ownedContent
          });
        }
      }
    }

    // Check for redundancy patterns
    for (const redundancy of claimedOrbDef.redundancyToEliminate) {
      if (this.contentContainsConcept(content, redundancy)) {
        violations.push(`Redundancy detected: ${redundancy}`);
      }
    }

    // Generate suggestions based on violations
    if (violations.length > 0) {
      suggestions.push('Review content to ensure it stays within Orb boundaries');
      suggestions.push('Consider moving content to the correct Orb');
      suggestions.push('Eliminate redundant concepts');
    }

    return {
      isValid: violations.length === 0,
      violations,
      suggestions,
      orbBoundaries
    };
  }

  /**
   * Get Orb definition by number
   */
  getOrbDefinition(orbNumber: number): OrbDefinition | undefined {
    return this.orbDefinitions.get(orbNumber);
  }

  /**
   * Get all Orb definitions
   */
  getAllOrbDefinitions(): OrbDefinition[] {
    return Array.from(this.orbDefinitions.values());
  }

  /**
   * Find the most appropriate Orb for given content
   */
  findBestOrbForContent(content: string): { orbNumber: number; confidence: number; reason: string }[] {
    const matches: { orbNumber: number; confidence: number; reason: string }[] = [];

    for (const [orbNumber, orbDef] of this.orbDefinitions) {
      let confidence = 0;
      const reasons: string[] = [];

      // Check against owned content
      for (const ownedContent of orbDef.owns) {
        if (this.contentContainsConcept(content, ownedContent)) {
          confidence += 0.3;
          reasons.push(`Contains: ${ownedContent}`);
        }
      }

      // Check against unique essence
      if (this.contentContainsConcept(content, orbDef.uniqueEssence.coreFunction)) {
        confidence += 0.4;
        reasons.push(`Core function: ${orbDef.uniqueEssence.coreFunction}`);
      }

      if (this.contentContainsConcept(content, orbDef.uniqueEssence.primaryDomain)) {
        confidence += 0.3;
        reasons.push(`Primary domain: ${orbDef.uniqueEssence.primaryDomain}`);
      }

      if (confidence > 0) {
        matches.push({
          orbNumber,
          confidence,
          reason: reasons.join('; ')
        });
      }
    }

    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Check if content contains a specific concept
   */
  private contentContainsConcept(content: string, concept: string): boolean {
    const contentLower = content.toLowerCase();
    const conceptLower = concept.toLowerCase();
    
    // Simple keyword matching - in production, this would use more sophisticated NLP
    const keywords = conceptLower.split(/[^a-zA-Z0-9]+/).filter(word => word.length > 3);
    return keywords.some(keyword => contentLower.includes(keyword));
  }

  /**
   * Get redundancy patterns to eliminate
   */
  getRedundancyPatterns(): { pattern: string; solution: string; affectedOrbs: number[] }[] {
    return [
      {
        pattern: "Biophoton content",
        solution: "Orb 1 owns mitochondrial ignition, Orb 3 owns reflection mechanics",
        affectedOrbs: [1, 3]
      },
      {
        pattern: "Cosmic microwave background",
        solution: "Orb 1 owns this as origin signature",
        affectedOrbs: [1, 3]
      },
      {
        pattern: "Stellar inheritance",
        solution: "Orb 1 owns stellar architecture, Orb 3 owns stellar reflection",
        affectedOrbs: [1, 3]
      },
      {
        pattern: "General 'light' content",
        solution: "Distribute specific light functions to appropriate orbs",
        affectedOrbs: [1, 3, 11]
      }
    ];
  }
}

// Export singleton instance
export const orbSystemValidator = new OrbSystemValidator();


