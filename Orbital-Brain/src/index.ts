/**
 * Orbital Brain - Main Export
 * 
 * CMS_Backend imports this (full functionality)
 * S2S_Console imports orbital-brain/types (types only)
 */

import { ContextManager } from './core/context_manager.js';
import { ResonanceInterpreter } from './core/resonance_interpreter.js';
import { NarrativeGenerator } from './core/narrative_generator.js';
import type { OrbitalResponse, ContentMetadata, RBIOutput, OrbitalContext } from './types/index.js';

export class OrbitalBrain {
  private contextManager: ContextManager;
  private interpreter: ResonanceInterpreter;
  private generator: NarrativeGenerator;

  constructor() {
    this.contextManager = new ContextManager();
    this.interpreter = new ResonanceInterpreter();
    this.generator = new NarrativeGenerator();
  }

  /**
   * Generate Orbital response from RBI output and metadata
   * 
   * This is the main entry point for CMS_Backend
   */
  async generateOrbitalResponse(params: {
    inquiry: string;
    content?: string;
    metadata: ContentMetadata;
    rbi_output: RBIOutput;
    session_id?: string;
  }): Promise<OrbitalResponse> {
    // Get session context
    const context = this.contextManager.getSessionContext(params.session_id);
    
    // Interpret RBI output
    const interpretation = this.interpreter.interpret(
      params.rbi_output,
      params.metadata
    );
    
    // Generate narrative
    const narrative = await this.generator.generate(
      params.inquiry,
      params.metadata,
      params.rbi_output,
      interpretation,
      context
    );
    
    // Update session
    this.contextManager.updateSession(
      context.session_id!,
      'assistant',
      narrative,
      params.metadata
    );
    
    // Build response
    return {
      content: narrative,
      metadata: params.metadata,
      rbi_output: params.rbi_output,
      orbital_interpretation: interpretation,
      field_memory: {
        session_id: context.session_id,
        context_continuity: this.contextManager.calculateContinuity(context.session_id!),
        previous_interactions: context.conversation_history?.length || 0
      }
    };
  }
}

// Export singleton instance
export const orbitalBrain = new OrbitalBrain();

// Export main function
export async function generateOrbitalResponse(params: {
  inquiry: string;
  content?: string;
  metadata: ContentMetadata;
  rbi_output: RBIOutput;
  session_id?: string;
}): Promise<OrbitalResponse> {
  return orbitalBrain.generateOrbitalResponse(params);
}

// Export types (safe for Console)
export type * from './types/index.js';

// Export OpenAI service (for CMS_Backend use)
export { 
  OpenAIService, 
  openAIService,
  chatCompletions,
  createEmbedding,
  chatCompletionsJSON
} from './core/openai-service.js';

