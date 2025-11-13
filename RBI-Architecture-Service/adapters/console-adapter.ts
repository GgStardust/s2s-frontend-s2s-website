/**
 * Field Console Adapter for RBI Architecture Service
 * 
 * Provides interface for Field Console to interact with RBI Architecture Service
 */

interface ServiceConfig {
  baseUrl: string;
  timeout?: number;
}

interface FieldScore {
  clarity: number;
  coherence: number;
  resonance: number;
  sovereignty: number;
  fieldDynamics: {
    fieldStrength: number;
    stability: number;
    coherence: number;
  };
  timestamp: string;
}

interface ValidationResult {
  verified: boolean;
  confidence: number;
  mathematicalProof: string;
  resonanceVector: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  fieldDynamics: {
    fieldStrength: number;
    stability: number;
    coherence: number;
  };
  sovereignLogic: {
    validity: string;
    coherence: number;
    sovereignty: number;
  };
  timestamp: string;
}

export class ConsoleAdapter {
  private config: ServiceConfig;

  constructor(config: ServiceConfig) {
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:3001',
      timeout: config.timeout || 10000
    };
  }

  /**
   * Push data to service and get score
   */
  async pushData(content: string): Promise<FieldScore> {
    try {
      const response = await fetch(`${this.config.baseUrl}/field/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content }),
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        throw new Error(`Service returned ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Console Adapter error: ${error.message}`);
    }
  }

  /**
   * Fetch score for existing content
   */
  async fetchScore(content: string): Promise<FieldScore> {
    return this.pushData(content);
  }

  /**
   * Validate content using Proof-of-Meaning
   */
  async validateContent(content: string, orbAssociations: number[] = []): Promise<ValidationResult> {
    try {
      const response = await fetch(`${this.config.baseUrl}/field/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, orbAssociations }),
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        throw new Error(`Service returned ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Console Adapter validation error: ${error.message}`);
    }
  }

  /**
   * Check service status
   */
  async checkStatus(): Promise<{
    status: string;
    uptime: { seconds: number; formatted: string };
    activeFields: number;
  }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/field/status`, {
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Service returned ${response.status}`);
      }

      const data = await response.json();
      return {
        status: data.status,
        uptime: data.uptime,
        activeFields: data.activeFields
      };
    } catch (error: any) {
      throw new Error(`Console Adapter status check error: ${error.message}`);
    }
  }
}

