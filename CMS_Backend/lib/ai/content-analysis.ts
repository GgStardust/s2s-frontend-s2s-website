/**
 * OpenAI Content Analysis Service
 *
 * Analyzes S2S content following PROCESSING_WORKFLOW.md rules:
 * - Suggests Orb associations (1-13)
 * - Suggests tags from TAG_REGISTRY only
 * - Extracts scrollstreams
 * - Scores resonance metrics
 * - Preserves every word (no edits)
 */

import { chatCompletionsJSON } from 'orbital-brain';
import { runResonanceValidation } from '../resonance-api';
import { referenceLoaders } from '../orbital/reference-loaders';

export interface ContentAnalysisResult {
  orb_associations: number[];
  tags: string[];
  scrollstreams: string[];
  resonance_rating: number;
  resonance_metrics: {
    strength: number;
    clarity: number;
    coherence: number;
    pattern: number;
  };
  coc_validation: {
    proof_status: 'proven' | 'partial' | 'unproven' | 'error';
    coherence_score: number;
    explanation: string;
    validated_orbs: number[];
  };
  analysis_notes?: string;
}

async function buildSystemPrompt(): Promise<string> {
  // Dynamically load Orb System and Tags
  const orbSystem = await referenceLoaders.getOrbSystem();
  const validTags = await referenceLoaders.getValidTags();
  const workflow = await referenceLoaders.loadProcessingWorkflow();

  return `You are an AI assistant analyzing content for the Stardust to Sovereignty (S2S) Codex system.

# CRITICAL RULES (from PROCESSING_WORKFLOW.md):
1. **Preserve every word** — You are ONLY analyzing, not editing. Never suggest content changes.
2. **Use canonical Orb names** — Only reference Orbs 1-13 by their canonical names.
3. **Tags from TAG_REGISTRY ONLY** — You can ONLY suggest tags that exist in the provided valid tags list.
4. **Snake_case format** — All tags use lowercase with underscores (e.g., "sovereign_field" not "Sovereign Field").
5. **Affirmative definitions only** — When analyzing, describe what things ARE, not what they are NOT.
6. **Scrollstreams must be resonant** — Only extract lines that pulse as standalone transmissions.

# 13-ORB SYSTEM:
${orbSystem.map(orb => `Orb ${orb.number}: ${orb.name} — ${orb.synthesis}`).join('\n')}

# VALID TAGS (from TAG_REGISTRY.md):
${validTags.map(tag => `@${tag}`).join(', ')}

# YOUR TASK:
Analyze the provided content and return a JSON object with:
1. **orb_associations**: Array of Orb numbers (1-13) that relate to this content
2. **tags**: Array of tags (from VALID TAGS ONLY) that describe key concepts
3. **scrollstreams**: Array of particularly resonant lines that work as standalone transmissions
4. **resonance_rating**: Overall resonance score 1-10 (how coherent, clear, and powerful is this transmission?)
5. **resonance_metrics**: Object with strength, clarity, coherence, pattern scores (each 1-10)

# SCROLLSTREAM EXTRACTION RULES:
- Must be a complete, standalone thought
- Should pulse with resonance when read alone
- Typically 1-2 sentences maximum
- Embodies core transmission essence
- Examples of good scrollstreams:
  * "Density becomes light through compression"
  * "Every human body is architecture of layers"
  * "Sovereignty is signal integrity"

# RESPONSE FORMAT:
Return ONLY valid JSON (no markdown, no explanation):
{
  "orb_associations": [7, 4, 12],
  "tags": ["alchemical_current", "transformation", "density"],
  "scrollstreams": [
    "Density becomes light through compression",
    "The alchemy of experience transforms everything"
  ],
  "resonance_rating": 8,
  "resonance_metrics": {
    "strength": 9,
    "clarity": 8,
    "coherence": 8,
    "pattern": 7
  }
}`;
}

export async function analyzeContent(
  content: string,
  existingTitle?: string
): Promise<ContentAnalysisResult> {
  try {
    // Dynamically load system prompt with current tags and Orbs
    const systemPrompt = await buildSystemPrompt();
    const validTags = await referenceLoaders.getValidTags();

    // Step 1: AI Analysis with OpenAI (using shared Orbital-Brain service)
    const result = await chatCompletionsJSON<{
      orb_associations: number[];
      tags: string[];
      scrollstreams: string[];
      resonance_rating: number;
      resonance_metrics: {
        strength: number;
        clarity: number;
        coherence: number;
        pattern: number;
      };
    }>({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Analyze this S2S content:\n\nTitle: ${existingTitle || 'Untitled'}\n\nContent:\n${content.substring(0, 8000)}`
        },
      ],
      temperature: 0.3,
    });

    // Validate and filter tags to only include valid ones
    const validatedTags = (result.tags || [])
      .filter((tag: string) => {
        const cleanTag = tag.replace('@', '').toLowerCase();
        return validTags.includes(cleanTag);
      })
      .slice(0, 15); // Limit to 15 tags per PROCESSING_WORKFLOW

    // Validate Orb associations (1-13 only)
    const validatedOrbs = (result.orb_associations || [])
      .filter((orb: number) => orb >= 1 && orb <= 13);

    // Step 2: CoC Validation with Resonance Engine
    const cocResult = await runResonanceValidation(content, existingTitle);

    return {
      orb_associations: validatedOrbs,
      tags: validatedTags,
      scrollstreams: (result.scrollstreams || []).slice(0, 10), // Limit to 10 scrollstreams
      resonance_rating: Math.min(10, Math.max(1, result.resonance_rating || 5)),
      resonance_metrics: {
        strength: Math.min(10, Math.max(1, result.resonance_metrics?.strength || 7)),
        clarity: Math.min(10, Math.max(1, result.resonance_metrics?.clarity || 7)),
        coherence: Math.min(10, Math.max(1, result.resonance_metrics?.coherence || 7)),
        pattern: Math.min(10, Math.max(1, result.resonance_metrics?.pattern || 7)),
      },
      coc_validation: {
        proof_status: cocResult.proofStatus,
        coherence_score: cocResult.coherenceScore,
        explanation: cocResult.explanation,
        validated_orbs: cocResult.validatedOrbs,
      },
      analysis_notes: `AI analyzed with GPT-4 + CoC validation. ${validatedOrbs.length} Orbs, ${validatedTags.length} tags, ${result.scrollstreams?.length || 0} scrollstreams extracted. CoC: ${cocResult.proofStatus} (${(cocResult.coherenceScore * 100).toFixed(1)}% coherence).`,
    };
  } catch (error) {
    console.error('Content analysis error:', error);
    throw new Error('Failed to analyze content with AI and CoC');
  }
}

export async function getOrbName(orbNumber: number): Promise<string> {
  const orbSystem = await referenceLoaders.getOrbSystem();
  const orb = orbSystem.find(o => o.number === orbNumber);
  return orb ? `Orb ${orb.number}: ${orb.name}` : `Orb ${orbNumber}`;
}

export async function getOrbSynthesis(orbNumber: number): Promise<string> {
  const orbSystem = await referenceLoaders.getOrbSystem();
  const orb = orbSystem.find(o => o.number === orbNumber);
  return orb?.synthesis || '';
}

// Export loaders for backward compatibility
export { referenceLoaders };
