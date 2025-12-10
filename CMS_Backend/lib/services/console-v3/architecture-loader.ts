/**
 * Core Architecture Loader
 * 
 * Loads and parses the three core architecture files that define the S2S system:
 * 1. CANONICAL_13_ORB_SYSTEM_REFERENCE.md - Single source of truth for orb system
 * 2. S2S — Undercurrents Codex.md - 12 Undercurrents as contextual anchors
 * 3. 13_ORB_SYSTEM_OUTLINE.md - Orb boundaries and ownership rules
 * 
 * These files are built into the console backend as the foundational framework.
 * RBI analyzes these FIRST to understand the system structure.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Path to core architecture files
// Fix: process.cwd() in Next.js returns project root, need to include CMS_Backend
const ARCHITECTURE_DIR = path.resolve(process.cwd(), 'CMS_Backend/09_PROCESSED/02c_Supporting material');

export interface OrbDefinition {
  number: number;
  name: string;
  synthesis?: string;
  function?: string;
  expression?: string;
  integration?: string;
  uniqueEssence?: {
    coreFunction?: string;
    primaryDomain?: string;
    keyMechanism?: string;
    uniqueQuality?: string;
  };
  owns?: string[];
  references?: string[];
  redundancyToEliminate?: string[];
}

export interface UndercurrentDefinition {
  number: number;
  name: string;
  synthesis?: string;
  coreTheme?: string;
  keyElements?: string[];
  orbAssociations?: number[];
}

export interface CoreArchitecture {
  orbs: Map<number, OrbDefinition>;
  undercurrents: Map<number, UndercurrentDefinition>;
  specialDomains?: any;
  satelliteOrbs?: any;
  systemIntegrationPoints?: any;
  loadedAt: Date;
}

let cachedArchitecture: CoreArchitecture | null = null;

/**
 * Load and parse CANONICAL_13_ORB_SYSTEM_REFERENCE.md
 */
function loadCanonicalOrbReference(): Map<number, OrbDefinition> {
  const filePath = path.join(ARCHITECTURE_DIR, 'CANONICAL_13_ORB_SYSTEM_REFERENCE.md');
  
  if (!fs.existsSync(filePath)) {
    console.warn(`[Architecture] CANONICAL_13_ORB_SYSTEM_REFERENCE.md not found at ${filePath}`);
    return new Map();
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(fileContent);
  
  const orbs = new Map<number, OrbDefinition>();
  
  // Parse orb definitions from the canonical reference
  // Format: ### **Orb X: Name**
  const orbRegex = /### \*\*Orb (\d+): ([^*]+)\*\*/g;
  let match;
  
  while ((match = orbRegex.exec(content)) !== null) {
    const orbNumber = parseInt(match[1]);
    const orbName = match[2].trim();
    
    // Extract content between this orb and the next
    const nextMatchIndex = content.indexOf('### **Orb', match.index + match[0].length);
    const orbContent = nextMatchIndex > 0 
      ? content.substring(match.index, nextMatchIndex)
      : content.substring(match.index);
    
    // Parse synthesis, function, expression, integration
    const synthesisMatch = orbContent.match(/- \*\*Synthesis\*\*: (.+)/);
    const functionMatch = orbContent.match(/- \*\*Function\*\*: (.+)/);
    const expressionMatch = orbContent.match(/- \*\*Expression\*\*: (.+)/);
    const integrationMatch = orbContent.match(/- \*\*Integration\*\*: (.+)/);
    
    orbs.set(orbNumber, {
      number: orbNumber,
      name: orbName,
      synthesis: synthesisMatch?.[1]?.trim(),
      function: functionMatch?.[1]?.trim(),
      expression: expressionMatch?.[1]?.trim(),
      integration: integrationMatch?.[1]?.trim(),
    });
  }
  
  return orbs;
}

/**
 * Load and parse 13_ORB_SYSTEM_OUTLINE.md
 */
function loadOrbOutline(): Map<number, Partial<OrbDefinition>> {
  const filePath = path.join(ARCHITECTURE_DIR, '13_ORB_SYSTEM_OUTLINE.md');
  
  if (!fs.existsSync(filePath)) {
    console.warn(`[Architecture] 13_ORB_SYSTEM_OUTLINE.md not found at ${filePath}`);
    return new Map();
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(fileContent);
  
  const orbDetails = new Map<number, Partial<OrbDefinition>>();
  
  // Parse orb sections
  const orbSectionRegex = /## \*\*Orb (\d+): ([^*]+)\*\*/g;
  let match;
  
  while ((match = orbSectionRegex.exec(content)) !== null) {
    const orbNumber = parseInt(match[1]);
    const orbName = match[2].trim();
    
    // Extract content between this orb and the next
    const nextMatchIndex = content.indexOf('## **Orb', match.index + match[0].length);
    const orbContent = nextMatchIndex > 0 
      ? content.substring(match.index, nextMatchIndex)
      : content.substring(match.index);
    
    // Parse Unique Essence
    const uniqueEssence: any = {};
    const coreFunctionMatch = orbContent.match(/- \*\*Core Function\*\*: (.+)/);
    const primaryDomainMatch = orbContent.match(/- \*\*Primary Domain\*\*: (.+)/);
    const keyMechanismMatch = orbContent.match(/- \*\*Key Mechanism\*\*: (.+)/);
    const uniqueQualityMatch = orbContent.match(/- \*\*Unique Quality\*\*: (.+)/);
    
    if (coreFunctionMatch || primaryDomainMatch || keyMechanismMatch || uniqueQualityMatch) {
      uniqueEssence.coreFunction = coreFunctionMatch?.[1]?.trim();
      uniqueEssence.primaryDomain = primaryDomainMatch?.[1]?.trim();
      uniqueEssence.keyMechanism = keyMechanismMatch?.[1]?.trim();
      uniqueEssence.uniqueQuality = uniqueQualityMatch?.[1]?.trim();
    }
    
    // Parse "What It Owns"
    const ownsSectionMatch = orbContent.match(/### \*\*What It Owns\*\*\s*\n((?:- .+\n?)+)/);
    const owns: string[] = [];
    if (ownsSectionMatch) {
      const ownsLines = ownsSectionMatch[1].match(/- (.+)/g);
      if (ownsLines) {
        owns.push(...ownsLines.map(line => line.replace(/^- /, '').trim()));
      }
    }
    
    // Parse "What It References (But Doesn't Own)"
    const referencesSectionMatch = orbContent.match(/### \*\*What It References \(But Doesn't Own\)\*\*\s*\n((?:- .+\n?)+)/);
    const references: string[] = [];
    if (referencesSectionMatch) {
      const referencesLines = referencesSectionMatch[1].match(/- (.+)/g);
      if (referencesLines) {
        references.push(...referencesLines.map(line => line.replace(/^- /, '').trim()));
      }
    }
    
    // Parse "Redundancy to Eliminate"
    const redundancySectionMatch = orbContent.match(/### \*\*Redundancy to Eliminate\*\*\s*\n((?:- .+\n?)+)/);
    const redundancy: string[] = [];
    if (redundancySectionMatch) {
      const redundancyLines = redundancySectionMatch[1].match(/- (.+)/g);
      if (redundancyLines) {
        redundancy.push(...redundancyLines.map(line => line.replace(/^- /, '').trim()));
      }
    }
    
    orbDetails.set(orbNumber, {
      number: orbNumber,
      name: orbName,
      uniqueEssence: Object.keys(uniqueEssence).length > 0 ? uniqueEssence : undefined,
      owns: owns.length > 0 ? owns : undefined,
      references: references.length > 0 ? references : undefined,
      redundancyToEliminate: redundancy.length > 0 ? redundancy : undefined,
    });
  }
  
  return orbDetails;
}

/**
 * Load and parse S2S — Undercurrents Codex.md
 */
function loadUndercurrentsCodex(): Map<number, UndercurrentDefinition> {
  const filePath = path.join(ARCHITECTURE_DIR, 'S2S — Undercurrents Codex.md');
  
  if (!fs.existsSync(filePath)) {
    console.warn(`[Architecture] S2S — Undercurrents Codex.md not found at ${filePath}`);
    return new Map();
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(fileContent);
  
  const undercurrents = new Map<number, UndercurrentDefinition>();
  
  // Parse undercurrent sections
  const undercurrentRegex = /## \*\*Undercurrent (\d+): ([^*]+)\*\*/g;
  let match;
  
  while ((match = undercurrentRegex.exec(content)) !== null) {
    const ucNumber = parseInt(match[1]);
    const ucName = match[2].trim();
    
    // Extract content between this undercurrent and the next
    const nextMatchIndex = content.indexOf('## **Undercurrent', match.index + match[0].length);
    const ucContent = nextMatchIndex > 0 
      ? content.substring(match.index, nextMatchIndex)
      : content.substring(match.index);
    
    // Parse synthesis
    const synthesisMatch = ucContent.match(/- \*\*Synthesis:\*\* (.+)/);
    
    // Parse core theme
    const coreThemeMatch = ucContent.match(/- \*\*Core Theme:\*\* (.+)/);
    
    // Parse key elements
    const keyElementsSectionMatch = ucContent.match(/- \*\*Key Elements:\*\*\s*\n((?:  - .+\n?)+)/);
    const keyElements: string[] = [];
    if (keyElementsSectionMatch) {
      const elementsLines = keyElementsSectionMatch[1].match(/  - (.+)/g);
      if (elementsLines) {
        keyElements.push(...elementsLines.map(line => line.replace(/^  - /, '').trim()));
      }
    }
    
    // Extract orb associations from tags (e.g., @orb1, @orb4)
    const orbTagMatches = ucContent.match(/@orb(\d+)/g);
    const orbAssociations: number[] = [];
    if (orbTagMatches) {
      orbTagMatches.forEach(tag => {
        const orbNum = parseInt(tag.replace('@orb', ''));
        if (!isNaN(orbNum) && !orbAssociations.includes(orbNum)) {
          orbAssociations.push(orbNum);
        }
      });
    }
    
    undercurrents.set(ucNumber, {
      number: ucNumber,
      name: ucName,
      synthesis: synthesisMatch?.[1]?.trim(),
      coreTheme: coreThemeMatch?.[1]?.trim(),
      keyElements: keyElements.length > 0 ? keyElements : undefined,
      orbAssociations: orbAssociations.length > 0 ? orbAssociations : undefined,
    });
  }
  
  return undercurrents;
}

/**
 * Load and merge all core architecture files
 */
export function loadCoreArchitecture(): CoreArchitecture {
  // Return cached version if available and recent (cache for 1 hour)
  if (cachedArchitecture) {
    const cacheAge = Date.now() - cachedArchitecture.loadedAt.getTime();
    if (cacheAge < 3600000) { // 1 hour
      return cachedArchitecture;
    }
  }
  
  console.log('[Architecture] Loading core architecture files...');
  
  // Load canonical orb reference
  const canonicalOrbs = loadCanonicalOrbReference();
  
  // Load orb outline for detailed boundaries
  const orbOutline = loadOrbOutline();
  
  // Merge canonical and outline data
  const mergedOrbs = new Map<number, OrbDefinition>();
  
  // Start with canonical definitions
  canonicalOrbs.forEach((orb, number) => {
    mergedOrbs.set(number, { ...orb });
  });
  
  // Merge outline details
  orbOutline.forEach((outline, number) => {
    const existing = mergedOrbs.get(number);
    if (existing) {
      mergedOrbs.set(number, {
        ...existing,
        ...outline,
        // Preserve canonical data, add outline details
        uniqueEssence: outline.uniqueEssence || existing.uniqueEssence,
        owns: outline.owns || existing.owns,
        references: outline.references || existing.references,
        redundancyToEliminate: outline.redundancyToEliminate || existing.redundancyToEliminate,
      });
    } else {
      // If orb exists in outline but not canonical, add it
      mergedOrbs.set(number, {
        number,
        name: outline.name || `Orb ${number}`,
        ...outline,
      });
    }
  });
  
  // Load undercurrents
  const undercurrents = loadUndercurrentsCodex();
  
  const architecture: CoreArchitecture = {
    orbs: mergedOrbs,
    undercurrents,
    loadedAt: new Date(),
  };
  
  // Cache the result
  cachedArchitecture = architecture;
  
  console.log(`[Architecture] Loaded ${mergedOrbs.size} orbs and ${undercurrents.size} undercurrents`);
  
  return architecture;
}

/**
 * Get orb definition by number
 */
export function getOrbDefinition(orbNumber: number): OrbDefinition | undefined {
  const architecture = loadCoreArchitecture();
  return architecture.orbs.get(orbNumber);
}

/**
 * Get undercurrent definition by number
 */
export function getUndercurrentDefinition(ucNumber: number): UndercurrentDefinition | undefined {
  const architecture = loadCoreArchitecture();
  return architecture.undercurrents.get(ucNumber);
}

/**
 * Get all orb definitions
 */
export function getAllOrbDefinitions(): OrbDefinition[] {
  const architecture = loadCoreArchitecture();
  return Array.from(architecture.orbs.values()).sort((a, b) => a.number - b.number);
}

/**
 * Get all undercurrent definitions
 */
export function getAllUndercurrentDefinitions(): UndercurrentDefinition[] {
  const architecture = loadCoreArchitecture();
  return Array.from(architecture.undercurrents.values()).sort((a, b) => a.number - b.number);
}

/**
 * Find orbs by keyword (searches name, synthesis, function, expression, integration)
 */
export function findOrbsByKeyword(keyword: string): OrbDefinition[] {
  const architecture = loadCoreArchitecture();
  const keywordLower = keyword.toLowerCase();
  
  return Array.from(architecture.orbs.values()).filter(orb => {
    return (
      orb.name.toLowerCase().includes(keywordLower) ||
      orb.synthesis?.toLowerCase().includes(keywordLower) ||
      orb.function?.toLowerCase().includes(keywordLower) ||
      orb.expression?.toLowerCase().includes(keywordLower) ||
      orb.integration?.toLowerCase().includes(keywordLower) ||
      orb.uniqueEssence?.coreFunction?.toLowerCase().includes(keywordLower) ||
      orb.uniqueEssence?.primaryDomain?.toLowerCase().includes(keywordLower) ||
      orb.uniqueEssence?.uniqueQuality?.toLowerCase().includes(keywordLower) ||
      orb.owns?.some(item => item.toLowerCase().includes(keywordLower)) ||
      false
    );
  });
}

/**
 * Find undercurrents by keyword
 */
export function findUndercurrentsByKeyword(keyword: string): UndercurrentDefinition[] {
  const architecture = loadCoreArchitecture();
  const keywordLower = keyword.toLowerCase();
  
  return Array.from(architecture.undercurrents.values()).filter(uc => {
    return (
      uc.name.toLowerCase().includes(keywordLower) ||
      uc.synthesis?.toLowerCase().includes(keywordLower) ||
      uc.coreTheme?.toLowerCase().includes(keywordLower) ||
      uc.keyElements?.some(item => item.toLowerCase().includes(keywordLower)) ||
      false
    );
  });
}


