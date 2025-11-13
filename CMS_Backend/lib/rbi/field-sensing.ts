/**
 * RBI Field-Sensing Service
 * 
 * Real-time resonance calculations for Console content
 * Operates in field-sensing mode around the Console
 */

import { EnhancedResonanceEngine } from '../mathematics/enhanced-resonance-engine';
import { computeResonance } from '../rbi/core';
import { createClient } from '@/lib/supabase/server';

export interface FieldSensingResult {
  contentId: string;
  title: string;
  resonance: {
    strength: number;
    clarity: number;
    coherence: number;
    pattern: number;
  };
  coherenceScore: number;
  proofStatus: 'proven' | 'partial' | 'unproven';
  fieldMetrics: {
    fieldStrength: number;
    gradient: number[];
    stability: number;
  };
  timestamp: Date;
}

export interface FieldState {
  visibleContent: FieldSensingResult[];
  overallCoherence: number;
  fieldStrength: number;
  resonanceMatrix: number[][];
  lastUpdated: Date;
}

export class FieldSensingService {
  private static instance: FieldSensingService;
  private resonanceEngine: EnhancedResonanceEngine;
  private fieldState: FieldState | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.resonanceEngine = EnhancedResonanceEngine.getInstance();
  }

  public static getInstance(): FieldSensingService {
    if (!FieldSensingService.instance) {
      FieldSensingService.instance = new FieldSensingService();
    }
    return FieldSensingService.instance;
  }

  /**
   * Sense field for visible Console content
   */
  async senseField(contentIds: string[]): Promise<FieldState> {
    const supabase = await createClient();

    // Fetch content files
    const { data: contentFiles, error } = await supabase
      .from('content_files')
      .select('*')
      .in('id', contentIds)
      .eq('status', 'active');

    if (error || !contentFiles) {
      throw new Error('Failed to fetch content for field sensing');
    }

    // Analyze each content file
    const sensingResults: FieldSensingResult[] = await Promise.all(
      contentFiles.map(async (file: any) => {
        const content = file.markdown_body || file.content || '';
        const analysis = await this.resonanceEngine.analyzeContentWithMathematics(content, file.title);

        return {
          contentId: file.id,
          title: file.title,
          resonance: {
            strength: analysis.signature?.resonance || 0,
            clarity: analysis.signature?.clarity || 0,
            coherence: analysis.signature?.coherence || 0,
            pattern: analysis.signature?.sovereignty || 0
          },
          coherenceScore: analysis.mathematical?.sovereignLogic?.coherence || 0,
          proofStatus: analysis.mathematical?.sovereignLogic?.validity === 'proven' ? 'proven' :
                      analysis.mathematical?.sovereignLogic?.validity === 'partial' ? 'partial' : 'unproven',
          fieldMetrics: {
            fieldStrength: analysis.mathematical?.fieldDynamics?.fieldStrength || 0,
            gradient: analysis.mathematical?.fieldDynamics?.gradient || [],
            stability: analysis.mathematical?.fieldDynamics?.stability || 0
          },
          timestamp: new Date()
        };
      })
    );

    // Calculate overall field state
    const overallCoherence = sensingResults.reduce((sum, r) => sum + r.coherenceScore, 0) / sensingResults.length;
    const fieldStrength = sensingResults.reduce((sum, r) => sum + r.fieldMetrics.fieldStrength, 0) / sensingResults.length;

    // Build resonance matrix (simplified - could be enhanced)
    const resonanceMatrix: number[][] = sensingResults.map(result => [
      result.resonance.strength,
      result.resonance.clarity,
      result.resonance.coherence,
      result.resonance.pattern
    ]);

    this.fieldState = {
      visibleContent: sensingResults,
      overallCoherence,
      fieldStrength,
      resonanceMatrix,
      lastUpdated: new Date()
    };

    return this.fieldState;
  }

  /**
   * Start continuous field sensing
   */
  startContinuousSensing(contentIds: string[], intervalMs: number = 5000): void {
    this.stopContinuousSensing();

    this.updateInterval = setInterval(async () => {
      try {
        await this.senseField(contentIds);
      } catch (error) {
        console.error('Error in continuous field sensing:', error);
      }
    }, intervalMs);
  }

  /**
   * Stop continuous field sensing
   */
  stopContinuousSensing(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Get current field state
   */
  getFieldState(): FieldState | null {
    return this.fieldState;
  }
}

export const fieldSensingService = FieldSensingService.getInstance();

