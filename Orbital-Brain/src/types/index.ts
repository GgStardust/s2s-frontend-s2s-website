/**
 * Type definitions for Orbital Brain
 * NO RBI imports - safe for Console to import
 */

export interface ContentMetadata {
  orb_associations?: number[];
  field_function?: {
    content_purpose?: string;
    primary_mechanism?: string;
    console_context?: string;
    console_relation?: string;
  };
  book_threading?: {
    book_id?: string;
    target_section?: string;
    target_chapter?: string;
    relevance_score?: number;
  };
  integration_points?: {
    codex?: string[];
    console_views?: string[];
    editorial_pass?: string;
  };
  tags?: string[];
  category?: string;
  dashboard_component?: string;
}

export interface RBIOutput {
  resonance_metrics?: {
    strength: number;
    clarity: number;
    coherence: number;
    pattern: number;
  };
  coherence?: number;
  proof_status?: 'proven' | 'partial' | 'unproven' | 'error';
  mathematical?: {
    resonanceVector?: {
      x: number;
      y: number;
      z: number;
      w: number;
    };
    fieldDynamics?: {
      fieldStrength: number;
      coherence: number;
      stability: number;
    };
    sovereignLogic?: {
      validity: 'proven' | 'partial' | 'unproven' | 'error';
      coherence: number;
      sovereignty: number;
    };
  };
}

export interface OrbitalInterpretation {
  primary_orb?: number;
  field_state: 'resonant' | 'coherent' | 'dissonant' | 'neutral';
  narrative_coherence: number;
  orb_context?: {
    orb_id: number;
    personality_traits: string[];
    communication_style: string[];
  };
  codex_alignment: {
    aligned: boolean;
    confidence: number;
    matched_concepts: string[];
  };
}

export interface OrbitalResponse {
  content: string;              // Narrative response
  metadata: ContentMetadata;   // Original metadata
  rbi_output: RBIOutput;       // RBI analysis
  orbital_interpretation: OrbitalInterpretation;
  field_memory?: {
    session_id?: string;
    context_continuity?: number;
    previous_interactions?: number;
  };
}

export interface OrbitalContext {
  session_id?: string;
  field_state?: 'active' | 'passive' | 'resonant';
  active_orbs?: number[];
  conversation_history?: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
}

