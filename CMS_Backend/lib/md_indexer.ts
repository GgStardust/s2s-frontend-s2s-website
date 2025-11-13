import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createSlug } from './slug';
import { Orb, Module, PublicCodex } from './types';

export function extractOrbsFromContent(content: string): Orb[] {
  const orbs: Orb[] = [];
  
  // Extract orbs from the codex_Orb_Synthesis_Final.md content
  const orbMatches = content.match(/\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g);
  
  if (orbMatches) {
    orbMatches.forEach((match, index) => {
      const parts = match.split('|').map(part => part.trim());
      if (parts.length >= 4 && parts[1] && parts[2] && parts[3]) {
        const id = parseInt(parts[1]);
        const title = parts[2].trim();
        const synthesis = parts[3].trim();
        
        if (!isNaN(id) && title && synthesis) {
          orbs.push({
            id,
            title,
            slug: createSlug(title),
            synthesis
          });
        }
      }
    });
  }
  
  return orbs;
}

export function extractScrollstreamFromContent(content: string): string[] {
  const phrases: string[] = [];
  
  // Extract scrollstream phrases from both files
  const scrollstreamMatches = content.match(/\*\*@scrollstream\*\*\s*([^*]+)/g);
  
  if (scrollstreamMatches) {
    scrollstreamMatches.forEach((match) => {
      const text = match.replace(/\*\*@scrollstream\*\*\s*/, '').trim();
      if (text) {
        phrases.push(text);
      }
    });
  }
  
  return phrases;
}

export function createModules(): Module[] {
  return [
    {
      id: 1,
      title: 'Orb Explorer',
      slug: 'orb-explorer',
      summary: 'Navigate the 13 fundamental Orbs that govern sovereign consciousness and human evolution.',
      category: 'core'
    },
    {
      id: 2,
      title: 'Scrollstream',
      slug: 'scrollstream',
      summary: 'Live transmission phrases that capture the essence of the S2S system in real-time.',
      category: 'transmission'
    },
    {
      id: 3,
      title: 'Undercurrents Library',
      slug: 'undercurrents',
      summary: 'The 12 contextual anchors that flow through the Orb backbone, providing depth and application.',
      category: 'library'
    }
  ];
}

export function buildPublicCodex(): PublicCodex {
  const contentDir = path.join(process.cwd(), '01_CORE_FRAMEWORK');
  
  // Read the three content files
  const backboneContent = fs.readFileSync(path.join(contentDir, 'Stardust to Sovereignty Backbone_.md'), 'utf8');
  const orbContent = fs.readFileSync(path.join(contentDir, 'codex_Orb_Synthesis_Final.md'), 'utf8');
  const undercurrentsContent = fs.readFileSync(path.join(contentDir, 'S2S — Undercurrents Codex.md'), 'utf8');
  
  // Extract orbs from the orb synthesis file
  const orbs = extractOrbsFromContent(orbContent);
  
  // Extract scrollstream phrases from both files
  const scrollstreamFromOrbs = extractScrollstreamFromContent(orbContent);
  const scrollstreamFromUndercurrents = extractScrollstreamFromContent(undercurrentsContent);
  const scrollstream = [...scrollstreamFromOrbs, ...scrollstreamFromUndercurrents];
  
  // Create modules
  const modules = createModules();
  
  return {
    orbs,
    modules,
    scrollstream
  };
}
