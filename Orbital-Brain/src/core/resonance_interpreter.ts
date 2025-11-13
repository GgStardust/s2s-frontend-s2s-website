/**
 * Resonance Interpreter - Maps RBI vectors to Codex semantics
 */

import type { RBIOutput, OrbitalInterpretation, ContentMetadata } from '../types/index.js';

export class ResonanceInterpreter {
  /**
   * Interpret RBI output in S2S/Codex context
   */
  interpret(
    rbiOutput: RBIOutput,
    metadata: ContentMetadata
  ): OrbitalInterpretation {
    // Determine primary orb from metadata or RBI analysis
    const primaryOrb = this.determinePrimaryOrb(metadata, rbiOutput);
    
    // Map RBI coherence to field state
    const fieldState = this.mapFieldState(rbiOutput);
    
    // Calculate narrative coherence from RBI metrics
    const narrativeCoherence = this.calculateNarrativeCoherence(rbiOutput);
    
    // Check Codex alignment
    const codexAlignment = this.checkCodexAlignment(metadata, rbiOutput);

    return {
      primary_orb: primaryOrb,
      field_state: fieldState,
      narrative_coherence: narrativeCoherence,
      orb_context: primaryOrb ? this.getOrbContext(primaryOrb) : undefined,
      codex_alignment: codexAlignment
    };
  }

  private determinePrimaryOrb(
    metadata: ContentMetadata,
    rbiOutput: RBIOutput
  ): number | undefined {
    // Prefer metadata orb associations (metadata-first)
    if (metadata.orb_associations && metadata.orb_associations.length > 0) {
      return metadata.orb_associations[0];
    }
    
    // Fallback to RBI analysis if no metadata
    // (This should rarely happen in metadata-first architecture)
    return undefined;
  }

  private mapFieldState(rbiOutput: RBIOutput): 'resonant' | 'coherent' | 'dissonant' | 'neutral' {
    const coherence = rbiOutput.coherence ?? 
                     rbiOutput.mathematical?.sovereignLogic?.coherence ?? 
                     rbiOutput.mathematical?.fieldDynamics?.coherence ?? 
                     0;

    if (coherence >= 0.8) return 'resonant';
    if (coherence >= 0.6) return 'coherent';
    if (coherence >= 0.4) return 'neutral';
    return 'dissonant';
  }

  private calculateNarrativeCoherence(rbiOutput: RBIOutput): number {
    const metrics = rbiOutput.resonance_metrics;
    if (!metrics) return 0.5;

    // Weighted average of RBI metrics
    return (
      metrics.clarity * 0.3 +
      metrics.coherence * 0.4 +
      metrics.strength * 0.2 +
      metrics.pattern * 0.1
    ) / 10; // Normalize to 0-1
  }

  private checkCodexAlignment(
    metadata: ContentMetadata,
    rbiOutput: RBIOutput
  ): { aligned: boolean; confidence: number; matched_concepts: string[] } {
    const hasOrbAssociations = (metadata.orb_associations?.length ?? 0) > 0;
    const hasFieldFunction = !!metadata.field_function?.content_purpose;
    const hasIntegrationPoints = (metadata.integration_points?.codex?.length ?? 0) > 0;
    
    const alignmentScore = (
      (hasOrbAssociations ? 0.4 : 0) +
      (hasFieldFunction ? 0.3 : 0) +
      (hasIntegrationPoints ? 0.3 : 0)
    );

    return {
      aligned: alignmentScore >= 0.6,
      confidence: alignmentScore,
      matched_concepts: [
        ...(metadata.orb_associations?.map(o => `Orb ${o}`) || []),
        ...(metadata.tags || [])
      ]
    };
  }

  private getOrbContext(orbId: number): {
    orb_id: number;
    personality_traits: string[];
    communication_style: string[];
  } {
    // This would load from Orb personalities system
    // For now, return placeholder - will be integrated with CMS_Backend Orb personalities
    return {
      orb_id: orbId,
      personality_traits: [],
      communication_style: []
    };
  }
}

