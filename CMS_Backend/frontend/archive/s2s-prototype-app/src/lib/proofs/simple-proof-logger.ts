/**
 * Simple Proof Logger
 * 
 * A simplified version of the proof logger for the prototype
 */

export interface ProofLog {
  id: string;
  timestamp: string;
  content: string;
  title?: string;
  proofType: 'sovereign_logic' | 'coc_validation' | 'resonance_analysis' | 'coherence_calculus';
  status: 'proven' | 'disproven' | 'inconclusive' | 'error';
  proofStatus: 'proven' | 'disproven' | 'inconclusive' | 'error';
  steps: Array<{
    step: number;
    description: string;
    result: 'success' | 'failure' | 'warning';
    details?: string;
    timestamp: string;
  }>;
  resonanceVector?: {
    x: number;
    y: number;
    z: number;
    w: number;
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

class SimpleProofLogger {
  private static instance: SimpleProofLogger;
  private logs: ProofLog[] = [];

  private constructor() {}

  public static getInstance(): SimpleProofLogger {
    if (!SimpleProofLogger.instance) {
      SimpleProofLogger.instance = new SimpleProofLogger();
    }
    return SimpleProofLogger.instance;
  }

  public logProof(proofLog: Omit<ProofLog, 'id' | 'timestamp'>): string {
    const id = `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const log: ProofLog = {
      ...proofLog,
      id,
      timestamp,
      proofStatus: proofLog.status
    };
    
    this.logs.unshift(log); // Add to beginning
    this.logs = this.logs.slice(0, 1000); // Keep only last 1000 logs
    
    return id;
  }

  public getRecentLogs(limit: number = 20): ProofLog[] {
    return this.logs.slice(0, limit);
  }

  public getLogById(id: string): ProofLog | undefined {
    return this.logs.find(log => log.id === id);
  }

  public getStatistics(): {
    total: number;
    byStatus: Record<string, number>;
    averageProcessingTime: number;
    successRate: number;
  } {
    const total = this.logs.length;
    const byStatus: Record<string, number> = {};
    let totalProcessingTime = 0;
    let provenCount = 0;

    this.logs.forEach(log => {
      byStatus[log.status] = (byStatus[log.status] || 0) + 1;
      totalProcessingTime += log.metadata.processingTime;
      if (log.status === 'proven') {
        provenCount++;
      }
    });

    return {
      total,
      byStatus,
      averageProcessingTime: total > 0 ? totalProcessingTime / total : 0,
      successRate: total > 0 ? provenCount / total : 0
    };
  }
}

export const simpleProofLogger = SimpleProofLogger.getInstance();
