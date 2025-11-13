/**
 * Mathematical Fields Database Integration
 * 
 * Handles integration of enhanced mathematical fields with the resonance_scores table:
 * - mathematical_proof JSONB
 * - harmonic_frequency JSONB  
 * - coherence_matrix JSONB
 * - field_dynamics JSONB
 * - visualization_data JSONB
 */

import { createClient } from '@/lib/supabase/server';

export interface MathematicalProof {
  validity: 'proven' | 'partial' | 'unproven' | 'error';
  confidence: number;
  proof: any;
  coherence: number;
  sovereignty: number;
  statement: string;
}

export interface HarmonicFrequency {
  fundamental: number;
  harmonics: number[];
  dissonance: number;
  spectralDensity: number;
}

export interface CoherenceMatrix {
  nxn: number[][];
  eigenvalues: number[];
  eigenvectors: number[][];
  coherenceRank: number;
}

export interface FieldDynamics {
  fieldStrength: number;
  gradient: number[];
  stability: number;
  coherence: number;
}

export interface VisualizationData {
  vector3D: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  trajectory: Array<{ x: number; y: number; z: number }>;
  lastUpdate: string;
}

export interface EnhancedResonanceScore {
  id: string;
  content_id: string;
  tenant_id: string;
  strength: number;
  clarity: number;
  coherence: number;
  pattern: number;
  overall_score: number;
  mathematical_proof?: MathematicalProof;
  harmonic_frequency?: HarmonicFrequency;
  coherence_matrix?: CoherenceMatrix;
  field_dynamics?: FieldDynamics;
  visualization_data?: VisualizationData;
  computed_at: string;
  updated_at: string;
}

class MathematicalFieldsIntegration {
  private supabase = createClient();

  /**
   * Store enhanced resonance score with mathematical fields
   */
  async storeEnhancedResonanceScore(
    contentId: string,
    tenantId: string,
    scores: {
      strength: number;
      clarity: number;
      coherence: number;
      pattern: number;
    },
    mathematicalData: {
      proof?: MathematicalProof;
      harmonicFrequency?: HarmonicFrequency;
      coherenceMatrix?: CoherenceMatrix;
      fieldDynamics?: FieldDynamics;
      visualizationData?: VisualizationData;
    }
  ): Promise<EnhancedResonanceScore | null> {
    try {
      const { data, error } = await this.supabase
        .from('resonance_scores')
        .upsert({
          content_id: contentId,
          tenant_id: tenantId,
          strength: scores.strength,
          clarity: scores.clarity,
          coherence: scores.coherence,
          pattern: scores.pattern,
          mathematical_proof: mathematicalData.proof,
          harmonic_frequency: mathematicalData.harmonicFrequency,
          coherence_matrix: mathematicalData.coherenceMatrix,
          field_dynamics: mathematicalData.fieldDynamics,
          visualization_data: mathematicalData.visualizationData,
          computed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing enhanced resonance score:', error);
        return null;
      }

      return data as EnhancedResonanceScore;
    } catch (error) {
      console.error('Error in storeEnhancedResonanceScore:', error);
      return null;
    }
  }

  /**
   * Get enhanced resonance scores with mathematical fields
   */
  async getEnhancedResonanceScores(
    tenantId: string,
    contentId?: string,
    limit: number = 50
  ): Promise<EnhancedResonanceScore[]> {
    try {
      let query = this.supabase
        .from('resonance_scores')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('computed_at', { ascending: false })
        .limit(limit);

      if (contentId) {
        query = query.eq('content_id', contentId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching enhanced resonance scores:', error);
        return [];
      }

      return data as EnhancedResonanceScore[];
    } catch (error) {
      console.error('Error in getEnhancedResonanceScores:', error);
      return [];
    }
  }

  /**
   * Update mathematical proof for a resonance score
   */
  async updateMathematicalProof(
    scoreId: string,
    proof: MathematicalProof
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('resonance_scores')
        .update({
          mathematical_proof: proof,
          updated_at: new Date().toISOString()
        })
        .eq('id', scoreId);

      if (error) {
        console.error('Error updating mathematical proof:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateMathematicalProof:', error);
      return false;
    }
  }

  /**
   * Update harmonic frequency analysis
   */
  async updateHarmonicFrequency(
    scoreId: string,
    harmonicFrequency: HarmonicFrequency
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('resonance_scores')
        .update({
          harmonic_frequency: harmonicFrequency,
          updated_at: new Date().toISOString()
        })
        .eq('id', scoreId);

      if (error) {
        console.error('Error updating harmonic frequency:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateHarmonicFrequency:', error);
      return false;
    }
  }

  /**
   * Update coherence matrix analysis
   */
  async updateCoherenceMatrix(
    scoreId: string,
    coherenceMatrix: CoherenceMatrix
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('resonance_scores')
        .update({
          coherence_matrix: coherenceMatrix,
          updated_at: new Date().toISOString()
        })
        .eq('id', scoreId);

      if (error) {
        console.error('Error updating coherence matrix:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateCoherenceMatrix:', error);
      return false;
    }
  }

  /**
   * Update field dynamics analysis
   */
  async updateFieldDynamics(
    scoreId: string,
    fieldDynamics: FieldDynamics
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('resonance_scores')
        .update({
          field_dynamics: fieldDynamics,
          updated_at: new Date().toISOString()
        })
        .eq('id', scoreId);

      if (error) {
        console.error('Error updating field dynamics:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateFieldDynamics:', error);
      return false;
    }
  }

  /**
   * Update visualization data
   */
  async updateVisualizationData(
    scoreId: string,
    visualizationData: VisualizationData
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('resonance_scores')
        .update({
          visualization_data: visualizationData,
          last_visualization_update: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', scoreId);

      if (error) {
        console.error('Error updating visualization data:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateVisualizationData:', error);
      return false;
    }
  }

  /**
   * Get mathematical analytics for a tenant
   */
  async getMathematicalAnalytics(tenantId: string): Promise<{
    totalScores: number;
    averageProofConfidence: number;
    averageFieldStability: number;
    averageHarmonicDissonance: number;
    coherenceRankDistribution: Record<number, number>;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('resonance_scores')
        .select('mathematical_proof, harmonic_frequency, coherence_matrix, field_dynamics')
        .eq('tenant_id', tenantId)
        .not('mathematical_proof', 'is', null);

      if (error) {
        console.error('Error fetching mathematical analytics:', error);
        return {
          totalScores: 0,
          averageProofConfidence: 0,
          averageFieldStability: 0,
          averageHarmonicDissonance: 0,
          coherenceRankDistribution: {}
        };
      }

      const scores = data || [];
      const totalScores = scores.length;

      // Calculate average proof confidence
      const proofConfidences = scores
        .map(s => s.mathematical_proof?.confidence)
        .filter(c => c !== null && c !== undefined);
      const averageProofConfidence = proofConfidences.length > 0 
        ? proofConfidences.reduce((sum, c) => sum + c, 0) / proofConfidences.length 
        : 0;

      // Calculate average field stability
      const fieldStabilities = scores
        .map(s => s.field_dynamics?.stability)
        .filter(s => s !== null && s !== undefined);
      const averageFieldStability = fieldStabilities.length > 0 
        ? fieldStabilities.reduce((sum, s) => sum + s, 0) / fieldStabilities.length 
        : 0;

      // Calculate average harmonic dissonance
      const harmonicDissonances = scores
        .map(s => s.harmonic_frequency?.dissonance)
        .filter(d => d !== null && d !== undefined);
      const averageHarmonicDissonance = harmonicDissonances.length > 0 
        ? harmonicDissonances.reduce((sum, d) => sum + d, 0) / harmonicDissonances.length 
        : 0;

      // Calculate coherence rank distribution
      const coherenceRanks = scores
        .map(s => s.coherence_matrix?.coherenceRank)
        .filter(r => r !== null && r !== undefined);
      const coherenceRankDistribution = coherenceRanks.reduce((acc, rank) => {
        acc[rank] = (acc[rank] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      return {
        totalScores,
        averageProofConfidence,
        averageFieldStability,
        averageHarmonicDissonance,
        coherenceRankDistribution
      };
    } catch (error) {
      console.error('Error in getMathematicalAnalytics:', error);
      return {
        totalScores: 0,
        averageProofConfidence: 0,
        averageFieldStability: 0,
        averageHarmonicDissonance: 0,
        coherenceRankDistribution: {}
      };
    }
  }

  /**
   * Get real-time mathematical updates for visualization
   */
  async getRealTimeMathematicalUpdates(
    tenantId: string,
    lastUpdate?: string
  ): Promise<EnhancedResonanceScore[]> {
    try {
      let query = this.supabase
        .from('resonance_scores')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (lastUpdate) {
        query = query.gt('updated_at', lastUpdate);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching real-time mathematical updates:', error);
        return [];
      }

      return data as EnhancedResonanceScore[];
    } catch (error) {
      console.error('Error in getRealTimeMathematicalUpdates:', error);
      return [];
    }
  }
}

const mathematicalFieldsIntegration = new MathematicalFieldsIntegration();
export default mathematicalFieldsIntegration;

