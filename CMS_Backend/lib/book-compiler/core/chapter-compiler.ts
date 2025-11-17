/**
 * Chapter Compiler Module
 * 
 * Compiles selected sources into a chapter with YAML frontmatter.
 * Preserves all inline tags and metadata.
 */

import type { ContentFile, ChapterOutline, CompiledChapter } from '../types.js';
import { curateSource } from '../editorial/content-curation.js';
import type { CompilerConfig } from '../config.js';

/**
 * Compile a chapter from selected sources
 */
export async function compileChapter(
  chapter: ChapterOutline,
  sources: ContentFile[],
  config?: Partial<CompilerConfig>
): Promise<CompiledChapter> {
  // Start with YAML frontmatter for the chapter
  const chapterYAML: any = {
    title: chapter.title,
    author: 'Gigi Stardust',
    type: 'book_output',
    category: 'foundational',
    status: 'canonical',
    version: 'metadata-compiled',
    created: new Date().toISOString().split('T')[0],
    modified: new Date().toISOString().split('T')[0],
    orb_associations: [],
    field_function: {
      content_purpose: chapter.description || '',
      primary_mechanism: '',
      secondary_mechanisms: [],
      resonance_indicators: ['Metadata-compiled', 'YAML-based selection'],
      integration_points: ['Book Compiler', 'Metadata Compiler']
    },
    integration_points: ['Book Compiler', 'Content Library'],
    book_threading: 'Book : Stardust to Sovereignty',
    is_primary_source: true,
    related_files: sources.map(s => s.file_path)
  };
  
  // Collect all orb associations from sources
  const allOrbs = new Set<number>();
  sources.forEach(source => {
    source.orb_tags.forEach(orb => allOrbs.add(orb));
    // Also check YAML orb_associations
    if (source.yaml.orb_associations) {
      if (Array.isArray(source.yaml.orb_associations)) {
        source.yaml.orb_associations.forEach((orb: any) => {
          if (typeof orb === 'number') allOrbs.add(orb);
          if (typeof orb === 'string') {
            const match = orb.match(/Orb\s*(\d+)/i);
            if (match) allOrbs.add(parseInt(match[1]));
          }
        });
      } else if (source.yaml.orb_associations.primary_orb) {
        const match = String(source.yaml.orb_associations.primary_orb).match(/Orb\s*(\d+)/i);
        if (match) allOrbs.add(parseInt(match[1]));
      }
    }
  });
  
  chapterYAML.orb_associations = Array.from(allOrbs).sort((a, b) => a - b).map(n => `Orb ${n}`);
  
  // Build chapter content - preserve all inline tags
  let chapterContent = `# ${chapter.title}\n\n`;
  
  if (chapter.description) {
    chapterContent += `${chapter.description}\n\n`;
  }
  
  // Check if synthesis is enabled
  let enableSynthesis = config?.enableSynthesis === true;
  const enableRestructuring = config?.enableSourceRestructuring !== false; // Default: true
  const enableCuration = config?.enableContentCuration !== false; // Default: true
  const maxSectionsPerSource = config?.maxSectionsPerSource || 3;
  const maxLengthPerSource = config?.maxLengthPerSource || 5000;
  
  if (enableSynthesis) {
    // Priority 4: Use synthesis layer to create unified narrative
    const { synthesizeChapter } = await import('../editorial/synthesis.js');
    try {
      const synthesisResult = await synthesizeChapter(sources, {
        maxLength: config?.maxChapterLength || 50000,
        preserveScrollstreams: config?.preserveScrollstreams || false,
        createNarrativeFlow: true
      });
      
      // Build chapter from synthesized sections
      for (let idx = 0; idx < synthesisResult.sections.length; idx++) {
        const section = synthesisResult.sections[idx];
        // Remove scrollstreams and protocol blocks from synthesized content
        const cleanContent = removeProtocolSections(removeAllScrollstreams(section.content));
        chapterContent += `## ${section.theme}\n\n`;
        chapterContent += `${cleanContent}\n\n`;
        if (idx < synthesisResult.sections.length - 1) {
          chapterContent += `---\n\n`;
        }
      }
    } catch (error) {
      console.warn(`Warning: Synthesis failed, falling back to source compilation:`, error);
      // Fall through to source compilation
      enableSynthesis = false;
    }
  }
  
  if (!enableSynthesis) {
    // Standard source compilation with curation and restructuring
    for (let idx = 0; idx < sources.length; idx++) {
      const source = sources[idx];
      chapterContent += `## Source ${idx + 1}: ${source.title}\n\n`;
      
      // Include source YAML metadata as comment
      chapterContent += `<!-- Source YAML Metadata:\n`;
      chapterContent += `  Book Threading: ${source.yaml.book_threading || 'none'}\n`;
      chapterContent += `  Field Function: ${source.yaml.field_function?.content_purpose || 'none'}\n`;
      const integrationPoints = Array.isArray(source.yaml.integration_points) 
        ? source.yaml.integration_points.join(', ')
        : (source.yaml.integration_points || 'none');
      chapterContent += `  Integration Points: ${integrationPoints}\n`;
      chapterContent += `-->\n\n`;
      
      // Priority 3: Restructure source content for recognition-first
      let sourceContent = source.content;
      if (enableRestructuring && config?.recognitionFirst) {
        try {
          const { restructureSourceForRecognitionFirst } = await import('../editorial/recognition-first.js');
          sourceContent = await restructureSourceForRecognitionFirst({
            content: sourceContent,
            title: source.title
          });
        } catch (error) {
          console.warn(`Warning: Source restructuring failed for ${source.title}:`, error);
          // Continue with original content
        }
      }
      
      // Curate source if enabled (use restructured content if available)
      if (enableCuration) {
        try {
          // Create temporary source with restructured content for curation
          const sourceForCuration: ContentFile = {
            ...source,
            content: sourceContent // Use restructured content
          };
          
          const curated = await curateSource(sourceForCuration, {
            maxSections: maxSectionsPerSource,
            maxLength: maxLengthPerSource,
            recognitionFirst: config?.recognitionFirst !== false
          });
          sourceContent = curated.curatedContent;
        } catch (error) {
          // If curation fails, use restructured content (or original if restructuring also failed)
          console.warn(`Warning: Content curation failed for ${source.title}, using restructured content:`, error);
        }
      }
      
      // Remove scrollstreams and protocol sections (they're for console/workbooks, not manuscript)
      sourceContent = removeProtocolSections(removeAllScrollstreams(sourceContent));
      
      // Include source content with ALL tags preserved (except scrollstreams)
      chapterContent += `${sourceContent}\n\n`;
      chapterContent += `---\n\n`;
    }
  }
  
  // Convert YAML to string (simple format)
  const yamlString = formatYAML(chapterYAML);
  
  const fullContent = yamlString + '\n' + chapterContent;
  
  return {
    chapter,
    content: fullContent,
    sources,
    metadata: {
      orb_associations: chapterYAML.orb_associations,
      field_function: chapterYAML.field_function,
      integration_points: chapterYAML.integration_points,
      book_threading: chapterYAML.book_threading,
      related_files: chapterYAML.related_files
    }
  };
}

/**
 * Format YAML object to string
 */
function formatYAML(obj: any): string {
  const lines: string[] = ['---'];
  
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      value.forEach((v: any) => {
        lines.push(`  - ${JSON.stringify(v)}`);
      });
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${key}:`);
      for (const [k, v] of Object.entries(value)) {
        if (Array.isArray(v)) {
          lines.push(`  ${k}:`);
          v.forEach((item: any) => {
            lines.push(`    - ${JSON.stringify(item)}`);
          });
        } else {
          lines.push(`  ${k}: ${JSON.stringify(v)}`);
        }
      }
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }
  
  lines.push('---');
  return lines.join('\n');
}

/**
 * Remove all scrollstreams from content
 * Scrollstreams are for console use, not manuscript
 */
function removeAllScrollstreams(content: string): string {
  // Remove @scrollstream lines (with or without leading whitespace)
  let cleaned = content.replace(/^\s*@scrollstream\s+.*$/gm, '');
  // Remove @scrollstream blocks (multiple consecutive lines)
  cleaned = cleaned.replace(/(@scrollstream[^\n]*\n\s*)+/g, '');
  // Remove any remaining @scrollstream references
  cleaned = cleaned.replace(/@scrollstream[^\n]*/g, '');
  // Clean up multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  // Remove blank lines at start/end
  return cleaned.trim();
}

const PROTOCOL_SECTION_KEYWORDS = [
  'Integration Protocols',
  'Advanced Resonance Protocols',
  'Advanced Temporal Protocols',
  'Advanced Origin Protocols',
  'Core Memory Practices',
  'Core Origin Practices',
  'Core Alchemical Practices',
  'Core Repatterning Practices',
  'Core Practices',
  'Advanced Practices'
];

/**
 * Remove repetitive protocol/practice blocks that clutter the manuscript
 * These are meant for console/workbooks, not the final manuscript
 */
function removeProtocolSections(content: string): string {
  let cleaned = content;
  
  const labelPattern = PROTOCOL_SECTION_KEYWORDS.map(escapeRegex).join('|');
  
  // Strategy: Split by lines and process, removing protocol sections
  const lines = cleaned.split('\n');
  const filteredLines: string[] = [];
  let inProtocolSection = false;
  let protocolStartIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this line is a protocol/practice label
    const isProtocolLabel = PROTOCOL_SECTION_KEYWORDS.some(keyword => {
      const escaped = escapeRegex(keyword);
      const regex = new RegExp(`^${escaped}\\s*$`, 'i');
      return regex.test(trimmed);
    });
    
    // Check if this is a markdown heading with protocol keyword
    const isProtocolHeading = /^#{2,6}\s/.test(trimmed) && 
      PROTOCOL_SECTION_KEYWORDS.some(keyword => {
        return new RegExp(escapeRegex(keyword), 'i').test(trimmed);
      });
    
    // Check if this is a bullet list item (starts with -, *, or +)
    const isBulletItem = /^\s*[-*+]\s/.test(line);
    
    // Check if this is a blank line
    const isBlank = trimmed === '';
    
    // Check if this is a heading (any heading)
    const isHeading = /^#{1,6}\s/.test(trimmed);
    
    if (isProtocolLabel || isProtocolHeading) {
      // Start of a protocol section
      inProtocolSection = true;
      protocolStartIndex = filteredLines.length;
      // Don't add this line
      continue;
    }
    
    if (inProtocolSection) {
      if (isBulletItem) {
        // Still in protocol section, skip this bullet item
        continue;
      } else if (isBlank) {
        // Blank line might end the section, but check next line
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          const nextIsBullet = /^\s*[-*+]\s/.test(nextLine);
          const nextIsProtocol = PROTOCOL_SECTION_KEYWORDS.some(keyword => {
            return new RegExp(`^\\s*${escapeRegex(keyword)}\\s*$`, 'i').test(nextLine.trim());
          });
          if (nextIsBullet || nextIsProtocol) {
            // Still in protocol section, skip blank line
            continue;
          }
        }
        // End of protocol section
        inProtocolSection = false;
        // Remove the blank line before protocol if we added one
        if (protocolStartIndex >= 0 && filteredLines[protocolStartIndex] === '') {
          filteredLines.splice(protocolStartIndex, 1);
        }
        protocolStartIndex = -1;
        // Don't add this blank line (it was part of the protocol section)
        continue;
      } else if (isHeading) {
        // New heading ends the protocol section
        inProtocolSection = false;
        protocolStartIndex = -1;
        // Add this heading
        filteredLines.push(line);
      } else {
        // Non-bullet, non-blank, non-heading line - end of protocol section
        inProtocolSection = false;
        protocolStartIndex = -1;
        // Add this line
        filteredLines.push(line);
      }
    } else {
      // Not in protocol section, add the line
      filteredLines.push(line);
    }
  }
  
  // Join back together
  cleaned = filteredLines.join('\n');
  
  // Also remove any remaining standalone protocol keyword lines (fallback)
  for (const keyword of PROTOCOL_SECTION_KEYWORDS) {
    const escaped = escapeRegex(keyword);
    const regex = new RegExp(`^\\s*${escaped}\\s*$`, 'gmi');
    cleaned = cleaned.replace(regex, '');
  }
  
  // Normalize excess blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

