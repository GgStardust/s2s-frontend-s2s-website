/**
 * Canonical Data Store - Read-Only Reference Layer
 * 
 * Embeds all canonical .md documents as immutable reference layer
 * for Codex constraint enforcement.
 */

import fs from 'fs';
import path from 'path';

export interface CanonicalDocument {
  id: string;
  title: string;
  content: string;
  type: 'orb_system' | 'undercurrents' | 'language' | 'tags' | 'processing' | 'system_description';
  orbAssociations: number[];
  tags: string[];
  lastModified: string;
}

export class CanonicalStore {
  private documents: Map<string, CanonicalDocument> = new Map();
  private initialized = false;

  /**
   * Initialize the canonical store with all core documents
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const canonicalFiles = [
      {
        path: '01_CORE_FRAMEWORK/CANONICAL_13_ORB_SYSTEM_REFERENCE.md',
        type: 'orb_system' as const,
        id: 'canonical_13_orb_system'
      },
      {
        path: '01_CORE_FRAMEWORK/codex_Orb_Synthesis_Final.md',
        type: 'orb_system' as const,
        id: 'orb_synthesis_final'
      },
      {
        path: '01_CORE_FRAMEWORK/S2S — Undercurrents Codex.md',
        type: 'undercurrents' as const,
        id: 'undercurrents_codex'
      },
      {
        path: '02_REFERENCE/03_Language_and_Definitions_CLEAN.md',
        type: 'language' as const,
        id: 'language_definitions'
      },
      {
        path: '02_REFERENCE/TAG_REGISTRY.md',
        type: 'tags' as const,
        id: 'tag_registry'
      },
      {
        path: '02_REFERENCE/PROCESSING_WORKFLOW.md',
        type: 'processing' as const,
        id: 'processing_workflow'
      },
      {
        path: '01_CORE_FRAMEWORK/I_Written_System_Description_CLEAN.md',
        type: 'system_description' as const,
        id: 'system_description'
      }
    ];

    for (const file of canonicalFiles) {
      try {
        const fullPath = path.join(process.cwd(), file.path);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const stats = fs.statSync(fullPath);

        // Extract metadata from YAML frontmatter
        const { metadata, content: markdownContent } = this.parseMarkdownWithFrontmatter(content);

        const document: CanonicalDocument = {
          id: file.id,
          title: metadata.title || file.id,
          content: markdownContent,
          type: file.type,
          orbAssociations: this.extractOrbAssociations(metadata),
          tags: this.extractTags(metadata),
          lastModified: stats.mtime.toISOString()
        };

        this.documents.set(file.id, document);
      } catch (error) {
        console.error(`Failed to load canonical document ${file.path}:`, error);
      }
    }

    this.initialized = true;
    console.log(`Canonical store initialized with ${this.documents.size} documents`);
  }

  /**
   * Get all canonical documents
   */
  getAllDocuments(): CanonicalDocument[] {
    return Array.from(this.documents.values());
  }

  /**
   * Get document by ID
   */
  getDocument(id: string): CanonicalDocument | undefined {
    return this.documents.get(id);
  }

  /**
   * Get documents by type
   */
  getDocumentsByType(type: CanonicalDocument['type']): CanonicalDocument[] {
    return Array.from(this.documents.values()).filter(doc => doc.type === type);
  }

  /**
   * Get all orb system documents (primary reference)
   */
  getOrbSystemDocuments(): CanonicalDocument[] {
    return this.getDocumentsByType('orb_system');
  }

  /**
   * Get all content as single reference text
   */
  getAllContent(): string {
    return Array.from(this.documents.values())
      .map(doc => `# ${doc.title}\n\n${doc.content}`)
      .join('\n\n---\n\n');
  }

  /**
   * Get orb definitions only
   */
  getOrbDefinitions(): string {
    const orbDocs = this.getOrbSystemDocuments();
    return orbDocs.map(doc => doc.content).join('\n\n');
  }

  /**
   * Parse markdown with YAML frontmatter
   */
  private parseMarkdownWithFrontmatter(content: string): { metadata: any; content: string } {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (match) {
      const yamlContent = match[1];
      const markdownContent = match[2];
      
      // Simple YAML parsing (basic key-value pairs)
      const metadata: any = {};
      yamlContent.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
          metadata[key] = value;
        }
      });

      return { metadata, content: markdownContent };
    }

    return { metadata: {}, content };
  }

  /**
   * Extract orb associations from metadata
   */
  private extractOrbAssociations(metadata: any): number[] {
    const orbAssociations = metadata.orb_associations || metadata.orbAssociations || [];
    if (Array.isArray(orbAssociations)) {
      return orbAssociations
        .map((orb: string) => {
          const match = orb.match(/Orb (\d+)/);
          return match ? parseInt(match[1]) : null;
        })
        .filter((orb: number | null) => orb !== null && orb >= 1 && orb <= 13) as number[];
    }
    return [];
  }

  /**
   * Extract tags from metadata
   */
  private extractTags(metadata: any): string[] {
    const tags = metadata.tags || [];
    if (Array.isArray(tags)) {
      return tags.map((tag: string) => tag.replace('@', ''));
    }
    return [];
  }
}

// Singleton instance
export const canonicalStore = new CanonicalStore();
