/**
 * Validation Layer - Proof Logger
 * 
 * Logging system for Proof-of-Meaning operations.
 * Tracks validation steps and results.
 * 
 * Architecture Layer: 4 (Validation)
 */

export interface ProofStep {
  step: number;
  description: string;
  result: 'success' | 'warning' | 'failure';
  details?: string;
  timestamp: Date;
}

export interface ProofLog {
  id: string;
  content: string;
  title?: string;
  type: string;
  status: 'proven' | 'inconclusive' | 'disproven' | 'error';
  steps: ProofStep[];
  metadata: Record<string, any>;
  processingTime: number;
  timestamp: Date;
}

class ProofLogger {
  private logs: Map<string, ProofLog> = new Map();

  /**
   * Log a proof
   */
  public logProof(
    content: string,
    title: string | undefined,
    type: string,
    status: 'proven' | 'inconclusive' | 'disproven' | 'error',
    steps: ProofStep[],
    metadata: Record<string, any>,
    processingTime: number
  ): string {
    const id = this.generateId();
    const log: ProofLog = {
      id,
      content,
      title,
      type,
      status,
      steps,
      metadata,
      processingTime,
      timestamp: new Date()
    };

    this.logs.set(id, log);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Proof ${id}] ${status.toUpperCase()}: ${type}`);
      steps.forEach(step => {
        console.log(`  Step ${step.step}: ${step.description} - ${step.result}`);
        if (step.details) {
          console.log(`    ${step.details}`);
        }
      });
    }

    return id;
  }

  /**
   * Get a proof log by ID
   */
  public getProof(id: string): ProofLog | undefined {
    return this.logs.get(id);
  }

  /**
   * Get all proof logs
   */
  public getAllProofs(): ProofLog[] {
    return Array.from(this.logs.values());
  }

  /**
   * Clear all proof logs
   */
  public clearProofs(): void {
    this.logs.clear();
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const proofLogger = new ProofLogger();

