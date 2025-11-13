# Orbital Brain Architecture

## Recommended Structure: Separate Workspace Package

Following the pattern of `RBI-Kernel/`, create `Orbital-Brain/` as a separate package that both CMS_Backend and S2S_Console can import.

### Folder Structure

```
S2S_RBI_System/
  ├── CMS_Backend/
  │   └── package.json (depends on orbital-brain)
  ├── S2S_Console/
  │   └── package.json (depends on orbital-brain/types only)
  ├── RBI-Kernel/
  └── Orbital-Brain/          ← NEW
      ├── src/
      │   ├── core/
      │   │   ├── context_manager.ts      # Session/field memory
      │   │   ├── resonance_interpreter.ts # RBI → Codex mapping
      │   │   └── narrative_generator.ts   # S2S-style response generation
      │   ├── types/
      │   │   └── index.ts                 # Type definitions (no RBI imports)
      │   └── index.ts                     # Main exports
      ├── package.json
      └── tsconfig.json
```

### Package.json Structure

**Orbital-Brain/package.json:**
```json
{
  "name": "orbital-brain",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./types": {
      "import": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    }
  },
  "dependencies": {
    "rbi-kernel": "file:../RBI-Kernel"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

**CMS_Backend/package.json:**
```json
{
  "dependencies": {
    "orbital-brain": "file:../Orbital-Brain",
    "rbi-kernel": "file:../RBI-Kernel"
  }
}
```

**S2S_Console/package.json:**
```json
{
  "dependencies": {
    "orbital-brain": "file:../Orbital-Brain"
  }
}
```

### TypeScript Interfaces

**Orbital-Brain/src/types/index.ts:**
```typescript
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
```

**Orbital-Brain/src/core/context_manager.ts:**
```typescript
/**
 * Context Manager - Manages session and field memory
 */

import type { OrbitalContext, ContentMetadata } from '../types';

export class ContextManager {
  private sessions: Map<string, OrbitalContext> = new Map();

  /**
   * Get or create session context
   */
  getSessionContext(sessionId?: string): OrbitalContext {
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        session_id: sessionId,
        field_state: 'active',
        active_orbs: [],
        conversation_history: []
      });
    }

    return this.sessions.get(sessionId)!;
  }

  /**
   * Update session with new interaction
   */
  updateSession(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: ContentMetadata
  ): void {
    const context = this.getSessionContext(sessionId);
    
    context.conversation_history = context.conversation_history || [];
    context.conversation_history.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });

    // Update active orbs from metadata
    if (metadata?.orb_associations) {
      context.active_orbs = Array.from(
        new Set([...(context.active_orbs || []), ...metadata.orb_associations])
      );
    }
  }

  /**
   * Calculate context continuity score
   */
  calculateContinuity(sessionId: string): number {
    const context = this.getSessionContext(sessionId);
    const history = context.conversation_history || [];
    
    if (history.length < 2) return 1.0;
    
    // Simple continuity: more interactions = higher continuity
    return Math.min(1.0, history.length / 10);
  }
}
```

**Orbital-Brain/src/core/resonance_interpreter.ts:**
```typescript
/**
 * Resonance Interpreter - Maps RBI vectors to Codex semantics
 */

import type { RBIOutput, OrbitalInterpretation, ContentMetadata } from '../types';

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
    // For now, return placeholder
    return {
      orb_id: orbId,
      personality_traits: [],
      communication_style: []
    };
  }
}
```

**Orbital-Brain/src/core/narrative_generator.ts:**
```typescript
/**
 * Narrative Generator - Composes S2S-style responses
 */

import type { OrbitalResponse, OrbitalInterpretation, ContentMetadata, RBIOutput } from '../types';

export class NarrativeGenerator {
  /**
   * Generate S2S-style narrative response
   */
  async generate(
    inquiry: string,
    metadata: ContentMetadata,
    rbiOutput: RBIOutput,
    interpretation: OrbitalInterpretation,
    context?: { session_id?: string; conversation_history?: any[] }
  ): Promise<string> {
    // Build narrative based on:
    // 1. RBI-validated coherence
    // 2. Orb personality (if primary_orb exists)
    // 3. Field state
    // 4. Codex alignment
    
    const narrative = this.composeNarrative(
      inquiry,
      interpretation,
      rbiOutput,
      metadata
    );

    return narrative;
  }

  private composeNarrative(
    inquiry: string,
    interpretation: OrbitalInterpretation,
    rbiOutput: RBIOutput,
    metadata: ContentMetadata
  ): string {
    // Start with field-aware opening
    let narrative = this.getFieldAwareOpening(interpretation.field_state);
    
    // Add Orb personality voice if available
    if (interpretation.orb_context) {
      narrative += this.applyOrbPersonality(interpretation.orb_context);
    }
    
    // Include RBI-validated insights
    if (rbiOutput.proof_status === 'proven') {
      narrative += this.includeProvenInsights(rbiOutput);
    }
    
    // Close with Codex alignment
    if (interpretation.codex_alignment.aligned) {
      narrative += this.includeCodexAlignment(interpretation);
    }
    
    return narrative;
  }

  private getFieldAwareOpening(fieldState: string): string {
    const openings = {
      resonant: "The field resonates with clarity...",
      coherent: "A coherent pattern emerges...",
      neutral: "The inquiry finds its place in the field...",
      dissonant: "There is tension in the field that invites exploration..."
    };
    return openings[fieldState as keyof typeof openings] || openings.neutral;
  }

  private applyOrbPersonality(context: { orb_id: number; personality_traits: string[]; communication_style: string[] }): string {
    // Apply Orb personality traits to narrative voice
    // This would integrate with Orb personalities system
    return "";
  }

  private includeProvenInsights(rbiOutput: RBIOutput): string {
    // Include RBI-validated insights in narrative
    return "";
  }

  private includeCodexAlignment(interpretation: OrbitalInterpretation): string {
    // Reference Codex alignment
    return "";
  }
}
```

**Orbital-Brain/src/index.ts:**
```typescript
/**
 * Orbital Brain - Main Export
 * 
 * CMS_Backend imports this (full functionality)
 * S2S_Console imports orbital-brain/types (types only)
 */

import { ContextManager } from './core/context_manager';
import { ResonanceInterpreter } from './core/resonance_interpreter';
import { NarrativeGenerator } from './core/narrative_generator';
import type { OrbitalResponse, ContentMetadata, RBIOutput, OrbitalContext } from './types';

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
export type * from './types';
```

### Usage in CMS_Backend

**CMS_Backend/app/api/ai/conversation/route.ts:**
```typescript
import { EnhancedResonanceEngine } from '@/lib/mathematics/enhanced-resonance-engine';
import { generateOrbitalResponse } from 'orbital-brain';
import type { ContentMetadata } from 'orbital-brain/types';

// ... existing code ...

// 1. Extract metadata FIRST
const metadata: ContentMetadata = {
  orb_associations: body.orb_associations,
  field_function: body.field_function,
  // ... etc
};

// 2. Call RBI Kernel (with metadata)
const rbiAnalysis = await resonanceEngine.analyzeContentWithMathematics(
  content,
  title,
  metadata
);

// 3. Pass to Orbital Brain
const orbitalResponse = await generateOrbitalResponse({
  inquiry: messages[messages.length - 1].content,
  content: currentContent,
  metadata,
  rbi_output: {
    resonance_metrics: { /* from rbiAnalysis */ },
    coherence: rbiAnalysis.mathematical?.sovereignLogic?.coherence,
    proof_status: rbiAnalysis.mathematical?.sovereignLogic?.validity,
    mathematical: rbiAnalysis.mathematical
  },
  session_id: body.session_id
});

// 4. Return unified response
return NextResponse.json(orbitalResponse);
```

### Usage in S2S_Console

**S2S_Console/src/components/InquiryInterface.tsx:**
```typescript
// Console only imports types - no RBI execution
import type { OrbitalResponse } from 'orbital-brain/types';

// Use the response structure
const response: OrbitalResponse = await fetch(...).then(r => r.json());

// Display narrative
setAIResponse(response.content);

// Display RBI metrics (transparency)
displayRBIMetrics(response.rbi_output);

// Display Orbital interpretation
displayOrbitalContext(response.orbital_interpretation);
```

### Benefits

1. ✅ **Separation of Concerns**: Orbital Brain is separate from RBI Kernel
2. ✅ **Type Safety**: Console gets types without RBI execution
3. ✅ **Reusability**: Both CMS and Console can import
4. ✅ **Metadata-First**: Orbital Brain receives metadata + RBI output
5. ✅ **Follows Pattern**: Same structure as RBI-Kernel package

### Next Steps

1. Create `Orbital-Brain/` folder structure
2. Implement the three core modules
3. Update CMS_Backend to use `generateOrbitalResponse()`
4. Update S2S_Console to import types only
5. Complete InquiryInterface cleanup

