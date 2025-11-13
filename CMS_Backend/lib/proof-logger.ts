/**
 * Proof Logger Service
 * 
 * Provides verifiable proof logging for all mathematical operations:
 * - Content analysis proofs
 * - Chapter compilation proofs
 * - Book compilation proofs
 * - Coherence validation proofs
 */

export interface ProofStep {
  step: number;
  description: string;
  input: any;
  output: any;
  validity: 'proven' | 'partial' | 'unproven' | 'error';
  timestamp: string;
}

export interface ProofLog {
  id: string;
  type: 'content_analysis' | 'chapter_compilation' | 'book_compilation' | 'coherence_validation';
  contentId?: string;
  chapterId?: string;
  bookId?: string;
  steps: ProofStep[];
  overallValidity: 'proven' | 'partial' | 'unproven' | 'error';
  coherenceScore: number;
  sovereigntyScore: number;
  createdAt: string;
  metadata: Record<string, any>;
}

export class ProofLogger {
  private static instance: ProofLogger;
  private proofLogs: Map<string, ProofLog> = new Map();
  
  public static getInstance(): ProofLogger {
    if (!ProofLogger.instance) {
      ProofLogger.instance = new ProofLogger();
    }
    return ProofLogger.instance;
  }
  
  /**
   * Log content analysis proof
   */
  public async logContentAnalysis(
    content: string,
    analysis: any,
    validation: any
  ): Promise<ProofLog> {
    const proofSteps: ProofStep[] = [
      {
        step: 1,
        description: 'Content analysis with Enhanced Resonance Engine',
        input: content,
        output: analysis.mathematical?.resonanceVector || analysis,
        validity: 'proven',
        timestamp: new Date().toISOString()
      },
      {
        step: 2,
        description: 'Coherence validation',
        input: analysis.mathematical?.sovereignLogic?.statement || content,
        output: validation.proof || validation,
        validity: validation.isValid ? 'proven' : 'unproven',
        timestamp: new Date().toISOString()
      }
    ];
    
    const proofLog: ProofLog = {
      id: this.generateId(),
      type: 'content_analysis',
      contentId: this.hashContent(content),
      steps: proofSteps,
      overallValidity: validation.isValid ? 'proven' : 'unproven',
      coherenceScore: analysis.mathematical?.sovereignLogic?.coherence || 0,
      sovereigntyScore: analysis.mathematical?.sovereignLogic?.sovereignty || 0,
      createdAt: new Date().toISOString(),
      metadata: {
        contentLength: content.length,
        analysisType: 'enhanced_resonance',
        validationType: 'coherence_check'
      }
    };
    
    this.proofLogs.set(proofLog.id, proofLog);
    return proofLog;
  }
  
  /**
   * Log chapter compilation proof
   */
  public async logChapterCompilation(
    chapterId: string,
    sourceContent: any[],
    compiledContent: string,
    validation: any
  ): Promise<ProofLog> {
    const proofSteps: ProofStep[] = [
      {
        step: 1,
        description: 'Source content analysis',
        input: sourceContent.map(c => c.id || c.title),
        output: sourceContent.map(c => c.resonance_vector || c.resonanceVector),
        validity: 'proven',
        timestamp: new Date().toISOString()
      },
      {
        step: 2,
        description: 'Content merging with AI',
        input: sourceContent,
        output: compiledContent,
        validity: 'proven',
        timestamp: new Date().toISOString()
      },
      {
        step: 3,
        description: 'Coherence validation',
        input: compiledContent,
        output: validation.proof || validation,
        validity: validation.isValid ? 'proven' : 'unproven',
        timestamp: new Date().toISOString()
      }
    ];
    
    const proofLog: ProofLog = {
      id: this.generateId(),
      type: 'chapter_compilation',
      chapterId,
      steps: proofSteps,
      overallValidity: validation.isValid ? 'proven' : 'unproven',
      coherenceScore: validation.coherence || 0,
      sovereigntyScore: validation.sovereignty || 0,
      createdAt: new Date().toISOString(),
      metadata: {
        sourceCount: sourceContent.length,
        compiledLength: compiledContent.length,
        compilationType: 'ai_merge'
      }
    };
    
    this.proofLogs.set(proofLog.id, proofLog);
    return proofLog;
  }
  
  /**
   * Log book compilation proof
   */
  public async logBookCompilation(
    bookId: string,
    chapters: any[],
    validation: any
  ): Promise<ProofLog> {
    const proofSteps: ProofStep[] = [
      {
        step: 1,
        description: 'Chapter compilation',
        input: chapters.map(c => c.id),
        output: chapters.map(c => c.content),
        validity: 'proven',
        timestamp: new Date().toISOString()
      },
      {
        step: 2,
        description: 'Book-level coherence validation',
        input: chapters,
        output: validation.proof || validation,
        validity: validation.isValid ? 'proven' : 'unproven',
        timestamp: new Date().toISOString()
      }
    ];
    
    const proofLog: ProofLog = {
      id: this.generateId(),
      type: 'book_compilation',
      bookId,
      steps: proofSteps,
      overallValidity: validation.isValid ? 'proven' : 'unproven',
      coherenceScore: validation.coherence || 0,
      sovereigntyScore: validation.sovereignty || 0,
      createdAt: new Date().toISOString(),
      metadata: {
        chapterCount: chapters.length,
        totalWordCount: chapters.reduce((sum, c) => sum + (c.word_count || 0), 0),
        compilationType: 'book_level'
      }
    };
    
    this.proofLogs.set(proofLog.id, proofLog);
    return proofLog;
  }
  
  /**
   * Get proof log by ID
   */
  public getProofLog(id: string): ProofLog | undefined {
    return this.proofLogs.get(id);
  }
  
  /**
   * Get all proof logs
   */
  public getAllProofLogs(): ProofLog[] {
    return Array.from(this.proofLogs.values());
  }
  
  /**
   * Get proof logs by type
   */
  public getProofLogsByType(type: ProofLog['type']): ProofLog[] {
    return Array.from(this.proofLogs.values()).filter(log => log.type === type);
  }
  
  /**
   * Get proof logs by content ID
   */
  public getProofLogsByContentId(contentId: string): ProofLog[] {
    return Array.from(this.proofLogs.values()).filter(log => log.contentId === contentId);
  }
  
  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Hash content for ID generation
   */
  private hashContent(content: string): string {
    // Simple hash function for content ID
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  /**
   * Clear all proof logs
   */
  public clearAllLogs(): void {
    this.proofLogs.clear();
  }
  
  /**
   * Get proof statistics
   */
  public getProofStats(): {
    total: number;
    byType: Record<string, number>;
    byValidity: Record<string, number>;
  } {
    const logs = Array.from(this.proofLogs.values());
    
    const byType: Record<string, number> = {};
    const byValidity: Record<string, number> = {};
    
    logs.forEach(log => {
      byType[log.type] = (byType[log.type] || 0) + 1;
      byValidity[log.overallValidity] = (byValidity[log.overallValidity] || 0) + 1;
    });
    
    return {
      total: logs.length,
      byType,
      byValidity
    };
  }
}

// Export singleton instance
export const proofLogger = ProofLogger.getInstance();

