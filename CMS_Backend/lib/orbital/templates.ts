/**
 * Orbital Content Templates
 * Based on Orbital_Brain_Specification.md Section 4
 */

export type ContentType =
  | 'scrollstream_entry'
  | 'character_profile'
  | 'book_fragment'
  | 'orb_personality'
  | 'scenario_entry'
  | 'research_notes'
  | 'long_form_essay';

interface OrbitalOutput {
  yaml: string;
  markdown: string;
  fullContent: string;
}

const today = new Date().toISOString().split('T')[0];

/**
 * 4.A) Scrollstream Entry
 */
export function generateScrollstreamTemplate(rawText: string): OrbitalOutput {
  const yaml = `---
title: "Scrollstream Entry"
author: "Gigi Stardust"
type: "scrollstream_entry"
category: "scrollstream"
status: "active"
version: "1.0"
created: "${today}"
modified: "${today}"
orb_associations:
  - "Orb 1: Origin Intelligence"
undercurrent_links: []
tags: ["@scrollstream"]
dashboard_component: "scrollstream"
codex_destination: "/codex/scrolls/"
---`;

  const markdown = `
**@scrollstream** ${rawText.split('\n')[0] || rawText.substring(0, 280)}

${rawText}`;

  const fullContent = `${yaml}\n${markdown}`;

  return { yaml, markdown, fullContent };
}

/**
 * 4.B) Fiction Character Profile
 */
export function generateCharacterProfileTemplate(rawText: string): OrbitalOutput {
  const yaml = `---
title: "Character Name"
type: "character_profile"
category: "fiction_codex"
status: "in_development"
version: "1.0"
orb_associations: []
undercurrent_links: []
themes: []
related_scrolls: []
dashboard_component: "narrative_codex"
codex_destination: "/fiction/characters/"
---`;

  const markdown = `
## Essence
${rawText}

## Function
[Symbolic or structural function in storyfield]

## Relational Threads
[Links to Orbs, undercurrents, other characters]

## Scene Pulse
[Short scene fragment in S2S voice]`;

  const fullContent = `${yaml}\n${markdown}`;

  return { yaml, markdown, fullContent };
}

/**
 * 4.C) Nonfiction Book Fragment
 */
export function generateBookFragmentTemplate(rawText: string): OrbitalOutput {
  const yaml = `---
title: "Chapter/Section Title"
type: "book_fragment"
category: "nonfiction"
status: "active"
version: "1.0"
orb_associations: []
integration_points: ["book_fragments", "codex_core"]
book_threading: ""
codex_destination: "/book_fragments/"
tags: ["@book_fragments"]
---`;

  const markdown = `
${rawText}

## Scrollstream Extraction
**@scrollstream** [Extract resonant lines]

## Notes for Compiler
- [Include anchors or tokens for book compiler]`;

  const fullContent = `${yaml}\n${markdown}`;

  return { yaml, markdown, fullContent };
}

/**
 * 4.D) Orb Personality Essay
 */
export function generateOrbPersonalityTemplate(rawText: string): OrbitalOutput {
  const yaml = `---
title: "Orb X Personality — Codename"
type: "orb_personality"
category: "orb_expressions"
status: "active"
version: "1.0"
orb_associations: []
tags: ["@persona", "@dashboard_component"]
dashboard_component: "orb_personas"
codex_destination: "/orb_personalities/"
---`;

  const markdown = `
## Gesture
${rawText}

## Language Pattern
[Signature phrases, inquiry style]

## Guidance
[How this persona advises within the dashboard]`;

  const fullContent = `${yaml}\n${markdown}`;

  return { yaml, markdown, fullContent };
}

/**
 * 4.E) Scenario / Consulting Case
 */
export function generateScenarioTemplate(rawText: string): OrbitalOutput {
  const yaml = `---
title: "Scenario Title"
type: "scenario_entry"
category: "consulting_system"
status: "active"
version: "1.0"
orb_associations: []
tags: ["@consulting_system", "@scenario"]
codex_destination: "/consulting_system/scenarios/"
---`;

  const markdown = `
## Situation
${rawText}

## Field Reading
[Sovereignty lens, distortion/clarity]

## Intervention
[Actions, prompts, measures]

## Resonance Notes
[What shifted; metrics if used]`;

  const fullContent = `${yaml}\n${markdown}`;

  return { yaml, markdown, fullContent };
}

/**
 * 4.F) Research Note
 */
export function generateResearchNotesTemplate(rawText: string): OrbitalOutput {
  const yaml = `---
title: "Research Topic"
type: "research_notes"
category: "reference"
status: "active"
version: "1.0"
orb_associations: []
tags: ["@research"]
codex_destination: "/reference/research/"
---`;

  const markdown = `
## Internal Codex Findings
${rawText}

## External Findings
[Citation list with links; brief synthesis aligned to S2S]

## Integration Pulse
[How this mirrors Codex logic]`;

  const fullContent = `${yaml}\n${markdown}`;

  return { yaml, markdown, fullContent };
}

/**
 * 4.G) Long Form Essay
 */
export function generateLongFormEssayTemplate(rawText: string): OrbitalOutput {
  const yaml = `---
title: "Essay Title"
type: "long_form_essay"
category: "essay"
status: "draft"
version: "1.0"
orb_associations: []
undercurrent_links: []
tags: ["@essay", "@long_form"]
dashboard_component: "essay_workspace"
codex_destination: "/essays/"
word_count: 0
resonance_score: 0
---`;

  const markdown = `# ${rawText.split('\n')[0] || 'Essay Title'}

${rawText}

## Scrollstream Extraction
**@scrollstream** [Key insights and resonant phrases will be extracted here]

## Orb Associations
[Orb associations will be automatically detected and added]

## Development Notes
[Space for ongoing development and refinement]`;

  const fullContent = `${yaml}\n${markdown}`;

  return { yaml, markdown, fullContent };
}

/**
 * Main template router
 */
export function applyOrbitalTemplate(rawText: string, contentType: ContentType): OrbitalOutput {
  switch (contentType) {
    case 'scrollstream_entry':
      return generateScrollstreamTemplate(rawText);
    case 'character_profile':
      return generateCharacterProfileTemplate(rawText);
    case 'book_fragment':
      return generateBookFragmentTemplate(rawText);
    case 'orb_personality':
      return generateOrbPersonalityTemplate(rawText);
    case 'scenario_entry':
      return generateScenarioTemplate(rawText);
    case 'research_notes':
      return generateResearchNotesTemplate(rawText);
    case 'long_form_essay':
      return generateLongFormEssayTemplate(rawText);
    default:
      return generateScrollstreamTemplate(rawText);
  }
}

export const contentTypeLabels: Record<ContentType, string> = {
  scrollstream_entry: 'Scrollstream Entry',
  character_profile: 'Fiction Character Profile',
  book_fragment: 'Nonfiction Book Fragment',
  orb_personality: 'Orb Personality Essay',
  scenario_entry: 'Consulting Scenario',
  research_notes: 'Research Note',
  long_form_essay: 'Long Form Essay',
};
