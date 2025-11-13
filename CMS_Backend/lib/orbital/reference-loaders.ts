/**
 * Dynamic Reference Loaders for Orbital Brain
 * 
 * Loads TAG_REGISTRY, PROCESSING_WORKFLOW, CONCEPT_MAP, and Language Definitions
 * dynamically from files instead of hardcoding values.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface TagRegistry {
  canonicalTags: string[];
  provisionalTags: string[];
  archivedTags: string[];
  categories: {
    [category: string]: Array<{ tag: string; description: string }>;
  };
}

export interface ProcessingWorkflow {
  rules: {
    preserveContent: boolean;
    useCanonicalOrbNames: boolean;
    tagsFromRegistryOnly: boolean;
    snakeCaseFormat: boolean;
    affirmativeDefinitionsOnly: boolean;
    scrollstreamsMustBeResonant: boolean;
  };
  orbSystem: Array<{ number: number; name: string; synthesis: string }>;
  contentTypes: string[];
  statusClassifications: string[];
  dashboardComponents: string[];
}

export interface ConceptMap {
  primaryAxes: Array<{ orb1: number; orb2: number; description: string }>;
  secondaryPairings: Array<{ orb1: number; orb2: number; description: string }>;
  orb0Expressions: Array<{ from: number; to: number; description: string }>;
  orbDetails: Array<{
    number: number;
    name: string;
    synthesis: string;
    satellites: string[];
    domains: string[];
    tags: string[];
  }>;
  satellites: Array<{ tag: string; description: string; linkedOrbs: number[] }>;
  domains: Array<{ tag: string; description: string; linkedOrbs: number[] }>;
}

export interface LanguageDefinitions {
  terms: Array<{ term: string; definition: string }>;
  philosophy: string;
}

export interface OrbPersonality {
  number: number;
  name: string;
  coreTraits: string[];
  communicationStyle: string[];
  culturalArchetype: string;
  scientificAuthority: string[];
  mysticalHeritage: string[];
  uniqueGift: string;
}

export interface OrbPersonalities {
  personalities: OrbPersonality[];
}

class ReferenceLoaders {
  private tagRegistryCache: TagRegistry | null = null;
  private processingWorkflowCache: ProcessingWorkflow | null = null;
  private conceptMapCache: ConceptMap | null = null;
  private languageDefinitionsCache: LanguageDefinitions | null = null;
  private orbPersonalitiesCache: OrbPersonalities | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Load TAG_REGISTRY.md and parse into structured format
   */
  async loadTagRegistry(): Promise<TagRegistry> {
    if (this.tagRegistryCache && Date.now() - this.cacheTimestamp < this.CACHE_TTL) {
      return this.tagRegistryCache;
    }

    // Try multiple possible locations for TAG_REGISTRY
    const possiblePaths = [
      path.join(process.cwd(), '02_REFERENCE/TAG_REGISTRY.md'),
      path.join(process.cwd(), 'archive/production-cleanup_2025-11-12/02_REFERENCE/TAG_REGISTRY.md'),
      path.join(process.cwd(), 'CMS_Backend_Archive/02_REFERENCE/TAG_REGISTRY.md'),
    ];
    
    let filePath: string | null = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }
    
    if (!filePath) {
      console.warn('[reference-loaders] TAG_REGISTRY.md not found, using empty registry');
      return {
        canonicalTags: [],
        provisionalTags: [],
        archivedTags: [],
        categories: {}
      };
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const canonicalTags: string[] = [];
    const provisionalTags: string[] = [];
    const archivedTags: string[] = [];
    const categories: { [category: string]: Array<{ tag: string; description: string }> } = {};

    // Parse tag categories
    const categoryRegex = /### (.+?)\n([\s\S]*?)(?=### |$)/g;
    let match;
    
    while ((match = categoryRegex.exec(content)) !== null) {
      const categoryName = match[1].trim();
      const categoryContent = match[2];
      
      // Extract tags from this category
      const tagRegex = /- `@?([^`]+)` — (.+)/g;
      const tags: Array<{ tag: string; description: string }> = [];
      
      let tagMatch;
      while ((tagMatch = tagRegex.exec(categoryContent)) !== null) {
        const tag = tagMatch[1].trim();
        const description = tagMatch[2].trim();
        tags.push({ tag, description });
        canonicalTags.push(tag);
      }
      
      if (tags.length > 0) {
        categories[categoryName] = tags;
      }
    }

    // Extract all unique tags (remove @ prefix if present)
    const allTags = Array.from(new Set(canonicalTags.map(t => t.replace('@', ''))));

    this.tagRegistryCache = {
      canonicalTags: allTags,
      provisionalTags,
      archivedTags,
      categories
    };

    this.cacheTimestamp = Date.now();
    return this.tagRegistryCache;
  }

  /**
   * Get all valid tags as a flat array
   */
  async getValidTags(): Promise<string[]> {
    const registry = await this.loadTagRegistry();
    return registry.canonicalTags;
  }

  /**
   * Validate a tag against the registry
   */
  async validateTag(tag: string): Promise<boolean> {
    const registry = await this.loadTagRegistry();
    const cleanTag = tag.replace('@', '').toLowerCase();
    return registry.canonicalTags.includes(cleanTag);
  }

  /**
   * Load PROCESSING_WORKFLOW.md and parse into structured format
   */
  async loadProcessingWorkflow(): Promise<ProcessingWorkflow> {
    if (this.processingWorkflowCache && Date.now() - this.cacheTimestamp < this.CACHE_TTL) {
      return this.processingWorkflowCache;
    }

    // Try multiple possible locations for PROCESSING_WORKFLOW
    const possiblePaths = [
      path.join(process.cwd(), '02_REFERENCE/PROCESSING_WORKFLOW.md'),
      path.join(process.cwd(), 'archive/production-cleanup_2025-11-12/02_REFERENCE/PROCESSING_WORKFLOW.md'),
      path.join(process.cwd(), 'CMS_Backend_Archive/02_REFERENCE/PROCESSING_WORKFLOW.md'),
    ];
    
    let filePath: string | null = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }
    
    if (!filePath) {
      console.warn('[reference-loaders] PROCESSING_WORKFLOW.md not found, using defaults');
      return {
        rules: {
          preserveContent: true,
          useCanonicalOrbNames: true,
          tagsFromRegistryOnly: true,
          snakeCaseFormat: true,
          affirmativeDefinitionsOnly: true,
          scrollstreamsMustBeResonant: true
        },
        orbSystem: [],
        contentTypes: [],
        statusClassifications: ['canonical', 'active', 'draft', 'archived'],
        dashboardComponents: []
      };
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract Orb System from the table
    const orbSystemRegex = /\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;
    const orbSystem: Array<{ number: number; name: string; synthesis: string }> = [];
    
    let orbMatch;
    while ((orbMatch = orbSystemRegex.exec(content)) !== null) {
      const number = parseInt(orbMatch[1]);
      const name = orbMatch[2].trim();
      const synthesis = orbMatch[3].trim();
      if (number >= 1 && number <= 13) {
        orbSystem.push({ number, name, synthesis });
      }
    }

    // Extract content types
    const contentTypeRegex = /- \*\*([^:]+):\*\* (.+)/g;
    const contentTypes: string[] = [];
    let contentTypeMatch;
    while ((contentTypeMatch = contentTypeRegex.exec(content)) !== null) {
      contentTypes.push(contentTypeMatch[1].trim());
    }

    // Extract status classifications
    const statusRegex = /- \*\*([^:]+):\*\* (.+)/g;
    const statusClassifications: string[] = ['canonical', 'active', 'draft', 'archived'];

    // Extract dashboard components
    const dashboardRegex = /- \*\*([^:]+):\*\* (.+)/g;
    const dashboardComponents: string[] = [
      'book_fragments',
      'orb_explorer',
      'scrollstream',
      'relational_inquiry',
      'research_viewer',
      'consciousness_field_design'
    ];

    this.processingWorkflowCache = {
      rules: {
        preserveContent: true,
        useCanonicalOrbNames: true,
        tagsFromRegistryOnly: true,
        snakeCaseFormat: true,
        affirmativeDefinitionsOnly: true,
        scrollstreamsMustBeResonant: true
      },
      orbSystem,
      contentTypes,
      statusClassifications,
      dashboardComponents
    };

    this.cacheTimestamp = Date.now();
    return this.processingWorkflowCache;
  }

  /**
   * Get Orb System array
   */
  async getOrbSystem(): Promise<Array<{ number: number; name: string; synthesis: string }>> {
    const workflow = await this.loadProcessingWorkflow();
    return workflow.orbSystem;
  }

  /**
   * Load CONCEPT_MAP.md and parse into structured format
   */
  async loadConceptMap(): Promise<ConceptMap> {
    if (this.conceptMapCache && Date.now() - this.cacheTimestamp < this.CACHE_TTL) {
      return this.conceptMapCache;
    }

    // Try multiple possible locations for CONCEPT_MAP
    const possiblePaths = [
      path.join(process.cwd(), '02_REFERENCE/CONCEPT_MAP.md'),
      path.join(process.cwd(), 'archive/production-cleanup_2025-11-12/02_REFERENCE/CONCEPT_MAP.md'),
      path.join(process.cwd(), 'CMS_Backend_Archive/02_REFERENCE/CONCEPT_MAP.md'),
    ];
    
    let filePath: string | null = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }
    
    if (!filePath) {
      console.warn('[reference-loaders] CONCEPT_MAP.md not found, using empty map');
      return {
        primaryAxes: [],
        secondaryPairings: [],
        orb0Expressions: [],
        orbDetails: [],
        satellites: [],
        domains: []
      };
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');

    const primaryAxes: Array<{ orb1: number; orb2: number; description: string }> = [];
    const secondaryPairings: Array<{ orb1: number; orb2: number; description: string }> = [];
    const orb0Expressions: Array<{ from: number; to: number; description: string }> = [];
    const orbDetails: Array<{
      number: number;
      name: string;
      synthesis: string;
      satellites: string[];
      domains: string[];
      tags: string[];
    }> = [];
    const satellites: Array<{ tag: string; description: string; linkedOrbs: number[] }> = [];
    const domains: Array<{ tag: string; description: string; linkedOrbs: number[] }> = [];

    // Parse Primary Axes
    const primaryAxisRegex = /- \*\*Orb (\d+) ↔ Orb (\d+):\*\* (.+?) \(([^)]+)\)/g;
    let axisMatch;
    while ((axisMatch = primaryAxisRegex.exec(content)) !== null) {
      primaryAxes.push({
        orb1: parseInt(axisMatch[1]),
        orb2: parseInt(axisMatch[2]),
        description: `${axisMatch[3]} (${axisMatch[4]})`
      });
    }

    // Parse Secondary Pairings
    const secondaryPairingRegex = /- \*\*Orb (\d+) ↔ Orb (\d+):\*\* (.+?) \(([^)]+)\)/g;
    let pairingMatch;
    while ((pairingMatch = secondaryPairingRegex.exec(content)) !== null) {
      // Skip if already in primary axes
      const orb1 = parseInt(pairingMatch[1]);
      const orb2 = parseInt(pairingMatch[2]);
      if (!primaryAxes.some(a => (a.orb1 === orb1 && a.orb2 === orb2) || (a.orb1 === orb2 && a.orb2 === orb1))) {
        secondaryPairings.push({
          orb1,
          orb2,
          description: `${pairingMatch[3]} (${pairingMatch[4]})`
        });
      }
    }

    // Parse Orb 0 Expressions
    const orb0Regex = /- \*\*Orb 0 → Orb (\d+):\*\* (.+)/g;
    let orb0Match;
    while ((orb0Match = orb0Regex.exec(content)) !== null) {
      orb0Expressions.push({
        from: 0,
        to: parseInt(orb0Match[1]),
        description: orb0Match[2].trim()
      });
    }

    // Parse Orb Details
    const orbDetailRegex = /### Orb (\d+): ([^\n]+)\n- \*\*Synthesis:\*\* ([^\n]+)\n- \*\*Satellites:\*\* ([^\n]+)\n- \*\*Domains:\*\* ([^\n]+)\n- \*\*Associated Tags:\*\* ([^\n]+)/g;
    let orbDetailMatch;
    while ((orbDetailMatch = orbDetailRegex.exec(content)) !== null) {
      const number = parseInt(orbDetailMatch[1]);
      const name = orbDetailMatch[2].trim();
      const synthesis = orbDetailMatch[3].trim();
      const satellitesStr = orbDetailMatch[4].trim();
      const domainsStr = orbDetailMatch[5].trim();
      const tagsStr = orbDetailMatch[6].trim();

      orbDetails.push({
        number,
        name,
        synthesis,
        satellites: satellitesStr === 'None' ? [] : satellitesStr.split(',').map(s => s.trim()),
        domains: domainsStr.split(',').map(d => d.trim()),
        tags: tagsStr.split(',').map(t => t.replace('@', '').trim())
      });
    }

    // Parse Satellites
    const satelliteRegex = /- `@([^`]+)` — (.+), linked to Orb (\d+)(?: & (\d+))?/g;
    let satelliteMatch;
    while ((satelliteMatch = satelliteRegex.exec(content)) !== null) {
      const linkedOrbs = [parseInt(satelliteMatch[3])];
      if (satelliteMatch[4]) {
        linkedOrbs.push(parseInt(satelliteMatch[4]));
      }
      satellites.push({
        tag: satelliteMatch[1],
        description: satelliteMatch[2].trim(),
        linkedOrbs
      });
    }

    // Parse Domains
    const domainRegex = /- `@([^`]+)` — (.+?) \(linked to Orbs ([^)]+)\)/g;
    let domainMatch;
    while ((domainMatch = domainRegex.exec(content)) !== null) {
      const linkedOrbs = domainMatch[3].split(',').map(o => parseInt(o.trim()));
      domains.push({
        tag: domainMatch[1],
        description: domainMatch[2].trim(),
        linkedOrbs
      });
    }

    this.conceptMapCache = {
      primaryAxes,
      secondaryPairings,
      orb0Expressions,
      orbDetails,
      satellites,
      domains
    };

    this.cacheTimestamp = Date.now();
    return this.conceptMapCache;
  }

  /**
   * Get Orb relationships (axes and pairings)
   */
  async getOrbRelationships(): Promise<{
    axes: Array<{ orb1: number; orb2: number; description: string; type: string }>;
    pairings: Array<{ orb1: number; orb2: number; description: string; type: string }>;
  }> {
    const conceptMap = await this.loadConceptMap();
    return {
      axes: conceptMap.primaryAxes.map(a => ({ ...a, type: 'primary_axis' })),
      pairings: conceptMap.secondaryPairings.map(p => ({ ...p, type: 'secondary_pairing' }))
    };
  }

  /**
   * Load Language Definitions
   */
  async loadLanguageDefinitions(): Promise<LanguageDefinitions> {
    if (this.languageDefinitionsCache && Date.now() - this.cacheTimestamp < this.CACHE_TTL) {
      return this.languageDefinitionsCache;
    }

    const filePath = path.join(process.cwd(), '09_PROCESSED/02c_Supporting material/03_Language_and_Definitions_CLEAN.md');
    const content = fs.readFileSync(filePath, 'utf-8');

    const terms: Array<{ term: string; definition: string }> = [];

    // Parse term definitions
    const termRegex = /### \*\*([^\*]+)\*\*\n([\s\S]*?)(?=### |## |$)/g;
    let termMatch;
    while ((termMatch = termRegex.exec(content)) !== null) {
      const term = termMatch[1].trim();
      const definition = termMatch[2].trim();
      terms.push({ term, definition });
    }

    // Extract philosophy section
    const philosophyMatch = content.match(/## \*\*Language Philosophy\*\*\n([\s\S]*?)(?=---|$)/);
    const philosophy = philosophyMatch ? philosophyMatch[1].trim() : '';

    this.languageDefinitionsCache = {
      terms,
      philosophy
    };

    this.cacheTimestamp = Date.now();
    return this.languageDefinitionsCache;
  }

  /**
   * Load Orb Personalities from ORB_PERSONALITY_SYSTEMV2.md
   */
  async loadOrbPersonalities(): Promise<OrbPersonalities> {
    if (this.orbPersonalitiesCache && Date.now() - this.cacheTimestamp < this.CACHE_TTL) {
      return this.orbPersonalitiesCache;
    }

    const filePath = path.join(process.cwd(), 'lib/orbital/orb-personalities/ORB_PERSONALITY_SYSTEMV2.md');
    const content = fs.readFileSync(filePath, 'utf-8');

    const personalities: OrbPersonality[] = [];

    // Parse each Orb personality section
    const orbRegex = /## \*\*Orb (\d+): ([^\*]+)\*\*\n([\s\S]*?)(?=## \*\*Orb |$)/g;
    let orbMatch;

    while ((orbMatch = orbRegex.exec(content)) !== null) {
      const number = parseInt(orbMatch[1]);
      const name = orbMatch[2].trim();
      const sectionContent = orbMatch[3];

      // Extract core traits
      const traitsMatch = sectionContent.match(/### \*\*Core Personality Traits:\*\*\n([\s\S]*?)(?=### |$)/);
      const coreTraits = traitsMatch
        ? traitsMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*\*\*/, '').replace(/\*\*.*$/, '').trim())
        : [];

      // Extract communication style
      const commMatch = sectionContent.match(/### \*\*Communication Style:\*\*\n([\s\S]*?)(?=### |$)/);
      const communicationStyle = commMatch
        ? commMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*\*\*/, '').replace(/\*\*.*$/, '').trim())
        : [];

      // Extract cultural archetype
      const archetypeMatch = sectionContent.match(/\*\*The ([^\*]+)\*\*/);
      const culturalArchetype = archetypeMatch ? `The ${archetypeMatch[1]}` : '';

      // Extract scientific authority
      const sciMatch = sectionContent.match(/### \*\*Scientific Authority:\*\*\n([\s\S]*?)(?=### |$)/);
      const scientificAuthority = sciMatch
        ? sciMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim())
        : [];

      // Extract mystical heritage
      const mystMatch = sectionContent.match(/### \*\*Mystical Heritage:\*\*\n([\s\S]*?)(?=### |$)/);
      const mysticalHeritage = mystMatch
        ? mystMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim())
        : [];

      // Extract unique gift
      const giftMatch = sectionContent.match(/\*\*The ability to ([^\*]+)\*\*/);
      const uniqueGift = giftMatch ? `The ability to ${giftMatch[1]}` : '';

      personalities.push({
        number,
        name,
        coreTraits,
        communicationStyle,
        culturalArchetype,
        scientificAuthority,
        mysticalHeritage,
        uniqueGift
      });
    }

    this.orbPersonalitiesCache = { personalities };
    this.cacheTimestamp = Date.now();
    return this.orbPersonalitiesCache;
  }

  /**
   * Get specific Orb personality by number
   */
  async getOrbPersonality(orbNumber: number): Promise<OrbPersonality | null> {
    const personalities = await this.loadOrbPersonalities();
    return personalities.personalities.find(p => p.number === orbNumber) || null;
  }

  /**
   * Clear all caches (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.tagRegistryCache = null;
    this.processingWorkflowCache = null;
    this.conceptMapCache = null;
    this.languageDefinitionsCache = null;
    this.orbPersonalitiesCache = null;
    this.cacheTimestamp = 0;
  }
}

// Singleton instance
export const referenceLoaders = new ReferenceLoaders();

