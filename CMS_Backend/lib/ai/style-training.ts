/**
 * Writing Style Training System
 * 
 * Analyzes user writing patterns and trains AI to match their style
 * within the S2S Codex framework.
 */

export interface WritingStylePattern {
  // Structural patterns
  sentenceLength: {
    average: number;
    variation: 'short' | 'medium' | 'long' | 'mixed';
  };
  paragraphStructure: {
    averageLength: number;
    openingStyle: 'question' | 'statement' | 'concept' | 'mixed';
    closingStyle: 'essence' | 'summary' | 'expansion' | 'mixed';
  };
  
  // Language patterns
  vocabulary: {
    complexity: 'simple' | 'intermediate' | 'advanced' | 'academic';
    technicalTerms: string[];
    preferredPhrases: string[];
  };
  
  // S2S-specific patterns
  orbIntegration: {
    crossOrbSynthesis: boolean;
    orbWeavingStyle: 'sequential' | 'interwoven' | 'layered';
    undercurrentUsage: boolean;
  };
  
  // Voice characteristics
  voice: {
    tone: 'poetic' | 'analytical' | 'conversational' | 'authoritative' | 'mixed';
    rhythm: 'flowing' | 'staccato' | 'rhythmic' | 'varied';
    density: 'sparse' | 'moderate' | 'dense' | 'layered';
  };
  
  // Content patterns
  contentStructure: {
    operationalContext: boolean; // Always includes practical applications
    essenceStatements: boolean; // Ends with distilled truths
    crossReferences: boolean; // Weaves multiple concepts together
    scrollstreamExtraction: boolean; // Uses @scrollstream format
  };
}

export interface StyleExample {
  id: string;
  content: string;
  title: string;
  orbAssociations: number[];
  tags: string[];
  scrollstreams: string[];
  analysis: WritingStylePattern;
}

export class WritingStyleTrainer {
  private examples: StyleExample[] = [];
  private learnedPatterns: WritingStylePattern | null = null;

  /**
   * Add a writing example for analysis
   */
  addExample(example: Omit<StyleExample, 'analysis'>): void {
    const analysis = this.analyzeWritingStyle(example.content);
    this.examples.push({
      ...example,
      analysis
    });
    
    // Recalculate learned patterns
    this.learnPatterns();
  }

  /**
   * Analyze writing style from content
   */
  private analyzeWritingStyle(content: string): WritingStylePattern {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    // Sentence length analysis
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    
    // Paragraph structure analysis
    const paragraphLengths = paragraphs.map(p => p.split(/\s+/).length);
    const avgParagraphLength = paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length;

    // Vocabulary analysis
    const technicalTerms = this.extractTechnicalTerms(content);
    const preferredPhrases = this.extractPreferredPhrases(content);

    // S2S-specific analysis
    const orbMentions = (content.match(/Orb \d+/g) || []).length;
    const undercurrentMentions = (content.match(/Undercurrent \d+/g) || []).length;
    const crossOrbSynthesis = orbMentions > 1;

    // Voice analysis
    const tone = this.analyzeTone(content);
    const rhythm = this.analyzeRhythm(content);

    // Content structure analysis
    const hasOperationalContext = /dashboard|artwork|body|practice|application/i.test(content);
    const hasEssenceStatements = /essence|therefore|thus|in essence/i.test(content);
    const hasScrollstreams = /@scrollstream/i.test(content);

    return {
      sentenceLength: {
        average: avgSentenceLength,
        variation: avgSentenceLength < 15 ? 'short' : avgSentenceLength < 25 ? 'medium' : 'long'
      },
      paragraphStructure: {
        averageLength: avgParagraphLength,
        openingStyle: this.analyzeOpeningStyle(paragraphs),
        closingStyle: this.analyzeClosingStyle(paragraphs)
      },
      vocabulary: {
        complexity: this.analyzeComplexity(content),
        technicalTerms,
        preferredPhrases
      },
      orbIntegration: {
        crossOrbSynthesis,
        orbWeavingStyle: crossOrbSynthesis ? 'interwoven' : 'sequential',
        undercurrentUsage: undercurrentMentions > 0
      },
      voice: {
        tone,
        rhythm,
        density: avgParagraphLength > 100 ? 'dense' : avgParagraphLength > 50 ? 'moderate' : 'sparse'
      },
      contentStructure: {
        operationalContext: hasOperationalContext,
        essenceStatements: hasEssenceStatements,
        crossReferences: crossOrbSynthesis,
        scrollstreamExtraction: hasScrollstreams
      }
    };
  }

  /**
   * Learn patterns from all examples
   */
  private learnPatterns(): void {
    if (this.examples.length === 0) return;

    // Aggregate patterns from all examples
    const aggregatedPatterns = this.examples.reduce((acc, example) => {
      const analysis = example.analysis;
      
      // Average sentence length
      acc.sentenceLength.average = (acc.sentenceLength.average + analysis.sentenceLength.average) / 2;
      
      // Most common variation
      acc.sentenceLength.variation = this.getMostCommonVariation(
        this.examples.map(e => e.analysis.sentenceLength.variation)
      );
      
      // Average paragraph length
      acc.paragraphStructure.averageLength = (acc.paragraphStructure.averageLength + analysis.paragraphStructure.averageLength) / 2;
      
      // Most common opening/closing styles
      acc.paragraphStructure.openingStyle = this.getMostCommonVariation(
        this.examples.map(e => e.analysis.paragraphStructure.openingStyle)
      );
      acc.paragraphStructure.closingStyle = this.getMostCommonVariation(
        this.examples.map(e => e.analysis.paragraphStructure.closingStyle)
      );
      
      // Aggregate vocabulary
      acc.vocabulary.technicalTerms = [...new Set([
        ...acc.vocabulary.technicalTerms,
        ...analysis.vocabulary.technicalTerms
      ])];
      acc.vocabulary.preferredPhrases = [...new Set([
        ...acc.vocabulary.preferredPhrases,
        ...analysis.vocabulary.preferredPhrases
      ])];
      
      // Most common complexity
      acc.vocabulary.complexity = this.getMostCommonVariation(
        this.examples.map(e => e.analysis.vocabulary.complexity)
      );
      
      // S2S patterns
      acc.orbIntegration.crossOrbSynthesis = this.examples.some(e => e.analysis.orbIntegration.crossOrbSynthesis);
      acc.orbIntegration.orbWeavingStyle = this.getMostCommonVariation(
        this.examples.map(e => e.analysis.orbIntegration.orbWeavingStyle)
      );
      acc.orbIntegration.undercurrentUsage = this.examples.some(e => e.analysis.orbIntegration.undercurrentUsage);
      
      // Voice patterns
      acc.voice.tone = this.getMostCommonVariation(
        this.examples.map(e => e.analysis.voice.tone)
      );
      acc.voice.rhythm = this.getMostCommonVariation(
        this.examples.map(e => e.analysis.voice.rhythm)
      );
      acc.voice.density = this.getMostCommonVariation(
        this.examples.map(e => e.analysis.voice.density)
      );
      
      // Content structure
      acc.contentStructure.operationalContext = this.examples.some(e => e.analysis.contentStructure.operationalContext);
      acc.contentStructure.essenceStatements = this.examples.some(e => e.analysis.contentStructure.essenceStatements);
      acc.contentStructure.crossReferences = this.examples.some(e => e.analysis.contentStructure.crossReferences);
      acc.contentStructure.scrollstreamExtraction = this.examples.some(e => e.analysis.contentStructure.scrollstreamExtraction);
      
      return acc;
    }, this.getDefaultPattern());

    this.learnedPatterns = aggregatedPatterns;
  }

  /**
   * Generate style-aware system prompt
   */
  generateStylePrompt(): string {
    if (!this.learnedPatterns) {
      return '';
    }

    const patterns = this.learnedPatterns;
    
    return `
## WRITING STYLE TRAINING (Based on User Examples)

You have been trained on the user's writing style. Apply these patterns:

### STRUCTURAL PATTERNS:
- **Sentence Length**: ${patterns.sentenceLength.variation} (avg: ${patterns.sentenceLength.average.toFixed(1)} words)
- **Paragraph Structure**: ${patterns.paragraphStructure.averageLength.toFixed(0)} words avg, ${patterns.paragraphStructure.openingStyle} openings, ${patterns.paragraphStructure.closingStyle} closings
- **Voice**: ${patterns.voice.tone} tone, ${patterns.voice.rhythm} rhythm, ${patterns.voice.density} density

### S2S INTEGRATION STYLE:
- **Cross-Orb Synthesis**: ${patterns.orbIntegration.crossOrbSynthesis ? 'YES - Weave multiple Orbs together' : 'NO - Focus on individual Orbs'}
- **Orb Weaving**: ${patterns.orbIntegration.orbWeavingStyle} style
- **Undercurrent Usage**: ${patterns.orbIntegration.undercurrentUsage ? 'YES' : 'NO'}

### CONTENT STRUCTURE REQUIREMENTS:
- **Operational Context**: ${patterns.contentStructure.operationalContext ? 'ALWAYS include practical applications (dashboard, body, artworks, etc.)' : 'Focus on theoretical aspects'}
- **Essence Statements**: ${patterns.contentStructure.essenceStatements ? 'ALWAYS end with distilled truth statements' : 'Use standard conclusions'}
- **Cross-References**: ${patterns.contentStructure.crossReferences ? 'ALWAYS weave multiple concepts together' : 'Focus on single concepts'}
- **Scrollstreams**: ${patterns.contentStructure.scrollstreamExtraction ? 'ALWAYS extract with @scrollstream format' : 'Use standard formatting'}

### VOCABULARY & PHRASES:
- **Complexity**: ${patterns.vocabulary.complexity}
- **Technical Terms**: ${patterns.vocabulary.technicalTerms.join(', ')}
- **Preferred Phrases**: ${patterns.vocabulary.preferredPhrases.join(', ')}

### CRITICAL STYLE CONSTRAINTS (From User Training):
- **NO NEGATIVE AFFIRMATIONS**: Never use "not", "no", "never", "cannot", "doesn't", "isn't", "won't", "shouldn't", "couldn't", "wouldn't"
- **NO WEAK CONNECTIONS**: Avoid "at the intersection of", "it's about", "it's like", "it's similar to", "it's related to"
- **NO DASHES OR WEAK PUNCTUATION**: Avoid em-dashes (—), use periods and semicolons instead
- **NO HEDGING LANGUAGE**: Avoid "perhaps", "maybe", "might", "could", "possibly", "seems", "appears"
- **AFFIRMATIVE DEFINITIONS ONLY**: Define by what IS, not what is NOT
- **STRONG, DECLARATIVE STATEMENTS**: Use "is", "are", "becomes", "expresses", "manifests", "generates"

### WRITING INSTRUCTIONS:
1. **Match the learned sentence rhythm and paragraph structure**
2. **Use the same vocabulary complexity and preferred phrases**
3. **Apply the same S2S integration patterns (cross-Orb synthesis, etc.)**
4. **Include operational context and essence statements as learned**
5. **Maintain the same voice characteristics (tone, rhythm, density)**
6. **Extract scrollstreams in the same format if applicable**
7. **ENFORCE STYLE CONSTRAINTS**: No negative affirmations, weak connections, or hedging language
8. **USE AFFIRMATIVE LANGUAGE**: Every statement must be positive and declarative

Write in the user's style while maintaining Codex constraints and enforcing these critical style rules.
`;
  }

  /**
   * Get learned patterns
   */
  getLearnedPatterns(): WritingStylePattern | null {
    return this.learnedPatterns;
  }

  /**
   * Get all examples
   */
  getExamples(): StyleExample[] {
    return this.examples;
  }

  // Helper methods
  private extractTechnicalTerms(content: string): string[] {
    const terms = [];
    const s2sTerms = /(resonance|sovereignty|orb|undercurrent|scrollstream|harmonic|photonic|quantum|dimensional|geometric|consciousness|intelligence|field|frequency|coherence|pattern|architecture)/gi;
    const matches = content.match(s2sTerms);
    if (matches) {
      terms.push(...matches.map(m => m.toLowerCase()));
    }
    return [...new Set(terms)];
  }

  private extractPreferredPhrases(content: string): string[] {
    const phrases: string[] = [];
    const commonPhrases = [
      'within the framework',
      'operational principle',
      'essence statement',
      'cross-orb synthesis',
      'resonance mechanics',
      'sovereignty language',
      'architectonic precision',
      'multidimensional intelligence'
    ];
    
    commonPhrases.forEach(phrase => {
      if (content.toLowerCase().includes(phrase)) {
        phrases.push(phrase);
      }
    });
    
    return phrases;
  }

  private analyzeTone(content: string): WritingStylePattern['voice']['tone'] {
    if (/therefore|thus|in essence|operational|practical/i.test(content)) {
      return 'authoritative';
    } else if (/consciousness|resonance|harmonic|sacred/i.test(content)) {
      return 'poetic';
    } else if (/framework|system|architecture|structure/i.test(content)) {
      return 'analytical';
    } else {
      return 'mixed';
    }
  }

  private analyzeRhythm(content: string): WritingStylePattern['voice']['rhythm'] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const lengths = sentences.map(s => s.split(/\s+/).length);
    const variation = Math.max(...lengths) - Math.min(...lengths);
    
    if (variation > 15) return 'varied';
    if (variation > 8) return 'rhythmic';
    if (variation > 3) return 'flowing';
    return 'staccato';
  }

  private analyzeComplexity(content: string): WritingStylePattern['vocabulary']['complexity'] {
    const words = content.split(/\s+/);
    const complexWords = words.filter(word => word.length > 8).length;
    const ratio = complexWords / words.length;
    
    if (ratio > 0.3) return 'academic';
    if (ratio > 0.2) return 'advanced';
    if (ratio > 0.1) return 'intermediate';
    return 'simple';
  }

  private analyzeOpeningStyle(paragraphs: string[]): WritingStylePattern['paragraphStructure']['openingStyle'] {
    const openings = paragraphs.map(p => p.trim().split(/[.!?]/)[0].toLowerCase());
    const questionCount = openings.filter(o => o.includes('?')).length;
    const conceptCount = openings.filter(o => /consciousness|resonance|orb|sovereignty/i.test(o)).length;
    
    if (questionCount > conceptCount) return 'question';
    if (conceptCount > 0) return 'concept';
    return 'statement';
  }

  private analyzeClosingStyle(paragraphs: string[]): WritingStylePattern['paragraphStructure']['closingStyle'] {
    const closings = paragraphs.map(p => p.trim().split(/[.!?]/).pop()?.toLowerCase() || '');
    const essenceCount = closings.filter(c => /essence|therefore|thus|in essence/i.test(c)).length;
    const summaryCount = closings.filter(c => /in summary|conclusion|finally/i.test(c)).length;
    
    if (essenceCount > summaryCount) return 'essence';
    if (summaryCount > 0) return 'summary';
    return 'expansion';
  }

  private getMostCommonVariation<T>(variations: T[]): T {
    const counts = variations.reduce((acc, variation) => {
      acc[variation as string] = (acc[variation as string] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0] as T;
  }

  private getDefaultPattern(): WritingStylePattern {
    return {
      sentenceLength: { average: 20, variation: 'medium' },
      paragraphStructure: { averageLength: 80, openingStyle: 'statement', closingStyle: 'expansion' },
      vocabulary: { complexity: 'intermediate', technicalTerms: [], preferredPhrases: [] },
      orbIntegration: { crossOrbSynthesis: false, orbWeavingStyle: 'sequential', undercurrentUsage: false },
      voice: { tone: 'analytical', rhythm: 'flowing', density: 'moderate' },
      contentStructure: { operationalContext: false, essenceStatements: false, crossReferences: false, scrollstreamExtraction: false }
    };
  }
}

// Singleton instance
export const writingStyleTrainer = new WritingStyleTrainer();
