/**
 * Proof Logger - Mathematical Consciousness Verification Logs
 * 
 * Stores and manages proof logs from Sovereign Logic, CoC validation,
 * and resonance vector calculations for visibility and debugging.
 */

export interface ProofLog {
  id: string;
  timestamp: Date;
  content: string;
  title?: string;
  proofType: 'sovereign_logic' | 'coc_validation' | 'resonance_analysis' | 'coherence_calculus';
  status: 'proven' | 'disproven' | 'inconclusive' | 'error';
  steps: ProofStep[];
  resonanceVector?: {
    x: number; // Clarity
    y: number; // Coherence  
    z: number; // Resonance
    w: number; // Sovereignty
  };
  orbAssociations?: number[];
  fieldDynamics?: {
    fieldStrength: number;
    gradient: number[];
    stability: number;
    coherence: number;
  };
  sovereignLogic?: {
    validity: 'proven' | 'disproven' | 'inconclusive';
    proofSteps: string[];
    logicalConsistency: number;
  };
  cocValidation?: {
    coherenceScore: number;
    validatedOrbs: number[];
    explanation: string;
  };
  metadata: {
    processingTime: number;
    engineVersion: string;
    contentLength: number;
  };
}

export interface ProofStep {
  step: number;
  description: string;
  result: 'success' | 'failure' | 'warning';
  details?: string;
  timestamp: Date;
}

class ProofLogger {
  private static instance: ProofLogger;
  private logs: ProofLog[] = [];
  private maxLogs: number = 1000; // Keep last 1000 proofs

  public static getInstance(): ProofLogger {
    if (!ProofLogger.instance) {
      ProofLogger.instance = new ProofLogger();
    }
    return ProofLogger.instance;
  }

  /**
   * Log a proof result from mathematical analysis
   */
  public logProof(
    content: string,
    title: string | undefined,
    proofType: ProofLog['proofType'],
    status: ProofLog['status'],
    steps: ProofStep[],
    mathematicalData: {
      resonanceVector?: ProofLog['resonanceVector'];
      orbAssociations?: number[];
      fieldDynamics?: ProofLog['fieldDynamics'];
      sovereignLogic?: ProofLog['sovereignLogic'];
      cocValidation?: ProofLog['cocValidation'];
    },
    processingTime: number
  ): string {
    const logId = `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const proofLog: ProofLog = {
      id: logId,
      timestamp: new Date(),
      content,
      title,
      proofType,
      status,
      steps,
      resonanceVector: mathematicalData.resonanceVector,
      orbAssociations: mathematicalData.orbAssociations,
      fieldDynamics: mathematicalData.fieldDynamics,
      sovereignLogic: mathematicalData.sovereignLogic,
      cocValidation: mathematicalData.cocValidation,
      metadata: {
        processingTime,
        engineVersion: 'v1.0-mathematical',
        contentLength: content.length
      }
    };

    this.logs.unshift(proofLog); // Add to beginning
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    return logId;
  }

  /**
   * Get recent proof logs
   */
  public getRecentLogs(limit: number = 50): ProofLog[] {
    return this.logs.slice(0, limit);
  }

  /**
   * Get proof log by ID
   */
  public getProofById(id: string): ProofLog | undefined {
    return this.logs.find(log => log.id === id);
  }

  /**
   * Get proof logs by type
   */
  public getProofsByType(proofType: ProofLog['proofType'], limit: number = 50): ProofLog[] {
    return this.logs
      .filter(log => log.proofType === proofType)
      .slice(0, limit);
  }

  /**
   * Get proof logs by status
   */
  public getProofsByStatus(status: ProofLog['status'], limit: number = 50): ProofLog[] {
    return this.logs
      .filter(log => log.status === status)
      .slice(0, limit);
  }

  /**
   * Get proof statistics
   */
  public getProofStatistics(): {
    total: number;
    byType: Record<ProofLog['proofType'], number>;
    byStatus: Record<ProofLog['status'], number>;
    averageProcessingTime: number;
    successRate: number;
  } {
    const total = this.logs.length;
    const byType: Record<ProofLog['proofType'], number> = {
      sovereign_logic: 0,
      coc_validation: 0,
      resonance_analysis: 0,
      coherence_calculus: 0
    };
    const byStatus: Record<ProofLog['status'], number> = {
      proven: 0,
      disproven: 0,
      inconclusive: 0,
      error: 0
    };

    let totalProcessingTime = 0;
    let successfulProofs = 0;

    this.logs.forEach(log => {
      byType[log.proofType]++;
      byStatus[log.status]++;
      totalProcessingTime += log.metadata.processingTime;
      
      if (log.status === 'proven') {
        successfulProofs++;
      }
    });

    return {
      total,
      byType,
      byStatus,
      averageProcessingTime: total > 0 ? totalProcessingTime / total : 0,
      successRate: total > 0 ? successfulProofs / total : 0
    };
  }

  /**
   * Clear old logs (keep last N)
   */
  public clearOldLogs(keepCount: number = 100): void {
    this.logs = this.logs.slice(0, keepCount);
  }
}

export const proofLogger = ProofLogger.getInstance();
