/**
 * Resonance Engine - Computes energetic signatures for content and Orb threads
 * This is the real Resonance Engine implementation (Sprint 3)
 */

export interface EnergeticSignature {
  clarity: number;
  coherence: number;
  resonance: number;
  sovereignty: number;
  computed_at: string;
  computed_by: string;
}

export interface ResonanceAnalysis {
  overall_score: number;
  signature: EnergeticSignature;
  orb_associations: number[];
  scrollstream_pulses: string[];
  cross_references: string[];
  recommendations: string[];
}

export class ResonanceEngine {
  private static instance: ResonanceEngine;

  private constructor() {
    // Initialize Resonance Engine
  }

  public static getInstance(): ResonanceEngine {
    if (!ResonanceEngine.instance) {
      ResonanceEngine.instance = new ResonanceEngine();
    }
    return ResonanceEngine.instance;
  }

  /**
   * Analyze content and compute energetic signature
   */
  public async analyzeContent(content: string, title?: string): Promise<ResonanceAnalysis> {
    try {
      // Extract key metrics from content
      const wordCount = content.split(/\s+/).length;
      const sentenceCount = content.split(/[.!?]+/).length;
      const paragraphCount = content.split(/\n\s*\n/).length;
      
      // Compute clarity (based on structure and readability)
      const clarity = this.computeClarity(content, wordCount, sentenceCount, paragraphCount);
      
      // Compute coherence (based on logical flow and consistency)
      const coherence = this.computeCoherence(content);
      
      // Compute resonance (based on Orb associations and energetic language)
      const resonance = this.computeResonance(content);
      
      // Compute sovereignty (based on authority and confidence)
      const sovereignty = this.computeSovereignty(content, title);

      const signature: EnergeticSignature = {
        clarity,
        coherence,
        resonance,
        sovereignty,
        computed_at: new Date().toISOString(),
        computed_by: 'resonance_engine_v1'
      };

      // Extract Orb associations
      const orbAssociations = this.extractOrbAssociations(content);
      
      // Extract Scrollstream pulses
      const scrollstreamPulses = this.extractScrollstreamPulses(content);
      
      // Generate cross-references
      const crossReferences = this.generateCrossReferences(content, orbAssociations);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(signature, orbAssociations);

      return {
        overall_score: (clarity + coherence + resonance + sovereignty) / 4,
        signature,
        orb_associations: orbAssociations,
        scrollstream_pulses: scrollstreamPulses,
        cross_references: crossReferences,
        recommendations
      };
    } catch (error) {
      console.error('Resonance Engine analysis error:', error);
      throw new Error('Failed to analyze content with Resonance Engine');
    }
  }

  /**
   * Update Orb thread energetic signature based on new messages
   */
  public async updateOrbSignature(
    currentSignature: EnergeticSignature,
    newMessage: string,
    messageRole: 'user' | 'assistant' | 'system'
  ): Promise<EnergeticSignature> {
    try {
      // Analyze the new message
      const messageAnalysis = await this.analyzeContent(newMessage);
      
      // Compute impact based on message role and content
      const impact = this.computeMessageImpact(messageAnalysis, messageRole);
      
      // Update signature with weighted average
      const updatedSignature: EnergeticSignature = {
        clarity: this.weightedAverage(currentSignature.clarity, messageAnalysis.signature.clarity, impact.clarity),
        coherence: this.weightedAverage(currentSignature.coherence, messageAnalysis.signature.coherence, impact.coherence),
        resonance: this.weightedAverage(currentSignature.resonance, messageAnalysis.signature.resonance, impact.resonance),
        sovereignty: this.weightedAverage(currentSignature.sovereignty, messageAnalysis.signature.sovereignty, impact.sovereignty),
        computed_at: new Date().toISOString(),
        computed_by: 'resonance_engine_v1'
      };

      return updatedSignature;
    } catch (error) {
      console.error('Resonance Engine signature update error:', error);
      return currentSignature; // Return unchanged signature on error
    }
  }

  /**
   * Compute clarity score based on content structure
   */
  private computeClarity(content: string, wordCount: number, sentenceCount: number, paragraphCount: number): number {
    // Base clarity from sentence length and structure
    const avgSentenceLength = wordCount / sentenceCount;
    const sentenceClarity = Math.max(0, Math.min(1, 1 - (avgSentenceLength - 15) / 30));
    
    // Paragraph structure clarity
    const avgParagraphLength = wordCount / paragraphCount;
    const paragraphClarity = Math.max(0, Math.min(1, 1 - (avgParagraphLength - 100) / 200));
    
    // Vocabulary complexity (simplified)
    const complexWords = content.match(/\b\w{8,}\b/g) || [];
    const vocabularyClarity = Math.max(0, Math.min(1, 1 - complexWords.length / wordCount * 10));
    
    return (sentenceClarity + paragraphClarity + vocabularyClarity) / 3;
  }

  /**
   * Compute coherence score based on logical flow
   */
  private computeCoherence(content: string): number {
    // Transition words and phrases
    const transitionWords = ['however', 'therefore', 'furthermore', 'moreover', 'consequently', 'meanwhile', 'additionally'];
    const transitions = transitionWords.filter(word => content.toLowerCase().includes(word)).length;
    const transitionScore = Math.min(1, transitions / 5);
    
    // Repetition of key concepts
    const words = content.toLowerCase().split(/\s+/);
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      if (word.length > 4) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    const maxFreq = Math.max(...Object.values(wordFreq));
    const repetitionScore = Math.min(1, maxFreq / words.length * 20);
    
    // Sentence connection patterns
    const connectionScore = content.includes('this') || content.includes('that') || content.includes('these') ? 0.7 : 0.3;
    
    return (transitionScore + repetitionScore + connectionScore) / 3;
  }

  /**
   * Compute resonance score based on Orb associations
   */
  private computeResonance(content: string): number {
    const orbKeywords = {
      1: ['origin', 'foundation', 'beginning', 'source', 'fundamental'],
      2: ['resonance', 'vibration', 'frequency', 'harmony', 'rhythm'],
      3: ['light', 'photon', 'illumination', 'clarity', 'vision'],
      4: ['structure', 'architecture', 'pattern', 'design', 'framework'],
      5: ['time', 'temporal', 'moment', 'duration', 'sequence'],
      6: ['memory', 'remember', 'recall', 'past', 'history'],
      7: ['transform', 'change', 'alchemy', 'transmute', 'evolve'],
      8: ['intuition', 'knowing', 'insight', 'perception', 'awareness'],
      9: ['flow', 'fluidity', 'movement', 'dynamic', 'current'],
      10: ['ancestral', 'heritage', 'lineage', 'tradition', 'wisdom'],
      11: ['transparency', 'clarity', 'openness', 'honesty', 'authenticity'],
      12: ['sovereignty', 'autonomy', 'independence', 'authority', 'power'],
      13: ['bridge', 'connection', 'link', 'unite', 'integrate']
    };

    let totalResonance = 0;
    let orbCount = 0;

    Object.entries(orbKeywords).forEach(([orbNum, keywords]) => {
      const matches = keywords.filter(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      
      if (matches > 0) {
        totalResonance += Math.min(1, matches / keywords.length);
        orbCount++;
      }
    });

    return orbCount > 0 ? totalResonance / orbCount : 0.3;
  }

  /**
   * Compute sovereignty score based on authority and confidence
   */
  private computeSovereignty(content: string, title?: string): number {
    // Authority indicators
    const authorityWords = ['know', 'understand', 'realize', 'recognize', 'perceive', 'comprehend'];
    const authorityScore = authorityWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length / authorityWords.length;

    // Confidence indicators
    const confidenceWords = ['certain', 'definite', 'clear', 'obvious', 'evident', 'apparent'];
    const confidenceScore = confidenceWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length / confidenceWords.length;

    // Title authority
    const titleScore = title && title.length > 10 ? 0.8 : 0.5;

    // Sentence structure authority
    const declarativeSentences = content.split(/[.!?]+/).filter(sentence => 
      sentence.trim().length > 0 && !sentence.includes('?')
    ).length;
    const totalSentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const structureScore = totalSentences > 0 ? declarativeSentences / totalSentences : 0.5;

    return (authorityScore + confidenceScore + titleScore + structureScore) / 4;
  }

  /**
   * Extract Orb associations from content
   */
  private extractOrbAssociations(content: string): number[] {
    const orbKeywords = {
      1: ['origin', 'foundation', 'beginning', 'source', 'fundamental'],
      2: ['resonance', 'vibration', 'frequency', 'harmony', 'rhythm'],
      3: ['light', 'photon', 'illumination', 'clarity', 'vision'],
      4: ['structure', 'architecture', 'pattern', 'design', 'framework'],
      5: ['time', 'temporal', 'moment', 'duration', 'sequence'],
      6: ['memory', 'remember', 'recall', 'past', 'history'],
      7: ['transform', 'change', 'alchemy', 'transmute', 'evolve'],
      8: ['intuition', 'knowing', 'insight', 'perception', 'awareness'],
      9: ['flow', 'fluidity', 'movement', 'dynamic', 'current'],
      10: ['ancestral', 'heritage', 'lineage', 'tradition', 'wisdom'],
      11: ['transparency', 'clarity', 'openness', 'honesty', 'authenticity'],
      12: ['sovereignty', 'autonomy', 'independence', 'authority', 'power'],
      13: ['bridge', 'connection', 'link', 'unite', 'integrate']
    };

    const associations: number[] = [];

    Object.entries(orbKeywords).forEach(([orbNum, keywords]) => {
      const matches = keywords.filter(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      
      if (matches > 0) {
        associations.push(parseInt(orbNum));
      }
    });

    return associations;
  }

  /**
   * Extract Scrollstream pulses (wisdom phrases)
   */
  private extractScrollstreamPulses(content: string): string[] {
    // Look for patterns that indicate wisdom or insight
    const patterns = [
      /the (?:true|real|essential) (?:nature|essence|meaning) of/i,
      /(?:consciousness|awareness|being) (?:is|exists|manifests) (?:as|through|in)/i,
      /(?:we|one) (?:must|can|will) (?:recognize|understand|realize)/i,
      /(?:this|that) (?:reveals|shows|demonstrates|indicates)/i,
      /(?:the|a) (?:path|way|process) (?:to|of|toward)/i
    ];

    const pulses: string[] = [];
    const sentences = content.split(/[.!?]+/);

    sentences.forEach(sentence => {
      patterns.forEach(pattern => {
        if (pattern.test(sentence.trim())) {
          pulses.push(sentence.trim());
        }
      });
    });

    return pulses.slice(0, 5); // Limit to 5 pulses
  }

  /**
   * Generate cross-references based on Orb associations
   */
  private generateCrossReferences(content: string, orbAssociations: number[]): string[] {
    const references: string[] = [];
    
    orbAssociations.forEach(orbNum => {
      references.push(`Orb ${orbNum}: ${this.getOrbName(orbNum)}`);
    });

    return references;
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(signature: EnergeticSignature, orbAssociations: number[]): string[] {
    const recommendations: string[] = [];

    if (signature.clarity < 0.6) {
      recommendations.push('Consider simplifying sentence structure for greater clarity');
    }

    if (signature.coherence < 0.6) {
      recommendations.push('Add transition words to improve logical flow');
    }

    if (signature.resonance < 0.5) {
      recommendations.push('Include more Orb-specific terminology to increase resonance');
    }

    if (signature.sovereignty < 0.6) {
      recommendations.push('Strengthen authoritative language and declarative statements');
    }

    if (orbAssociations.length < 3) {
      recommendations.push('Consider exploring connections to additional Orbs');
    }

    return recommendations;
  }

  /**
   * Compute message impact based on role and analysis
   */
  private computeMessageImpact(analysis: ResonanceAnalysis, role: 'user' | 'assistant' | 'system'): EnergeticSignature {
    const baseImpact = 0.1; // Base impact weight
    const roleMultiplier = role === 'assistant' ? 1.5 : role === 'system' ? 2.0 : 1.0;

    return {
      clarity: baseImpact * roleMultiplier,
      coherence: baseImpact * roleMultiplier,
      resonance: baseImpact * roleMultiplier,
      sovereignty: baseImpact * roleMultiplier,
      computed_at: new Date().toISOString(),
      computed_by: 'resonance_engine_v1'
    };
  }

  /**
   * Compute weighted average for signature updates
   */
  private weightedAverage(current: number, newValue: number, weight: number): number {
    return current * (1 - weight) + newValue * weight;
  }

  /**
   * Get Orb name by number
   */
  private getOrbName(orbNumber: number): string {
    const orbNames: { [key: number]: string } = {
      1: 'Origin Intelligence',
      2: 'Resonance Mechanics',
      3: 'Photonic Intelligence',
      4: 'Harmonic Architectures',
      5: 'Temporal Sovereignty',
      6: 'Starline Memory',
      7: 'Alchemical Current',
      8: 'Quantum Intuition',
      9: 'Temporal Fluidity',
      10: 'Ancestral Repatterning',
      11: 'Radiant Transparency',
      12: 'Sovereign Field',
      13: 'Bridging Intelligence'
    };
    return orbNames[orbNumber] || `Unknown Orb ${orbNumber}`;
  }
}

// Export singleton instance
export const resonanceEngine = ResonanceEngine.getInstance();



