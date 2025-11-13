/**
 * Living Codex Indexer
 * 
 * Ingests backbone files and codex documents to create a searchable index
 * powered by mathematical consciousness analysis and resonance vectors.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { simpleEnhancedResonanceEngine } from '../mathematics/simple-enhanced-resonance-engine';
import { simpleProofLogger } from '../proofs/simple-proof-logger';

export interface CodexEntry {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  source: string;
  contentType: string;
  tags: string[];
  orbAssociations: number[];
  resonanceVector: {
    x: number; // Clarity
    y: number; // Coherence
    z: number; // Resonance
    w: number; // Sovereignty
  };
  fieldDynamics: {
    fieldStrength: number;
    gradient: number[];
    stability: number;
    coherence: number;
  };
  sovereignLogic: {
    validity: 'proven' | 'disproven' | 'inconclusive' | 'error';
    proofSteps: string[];
    logicalConsistency: number;
  };
  cocValidation: {
    coherenceScore: number;
    validatedOrbs: number[];
    explanation: string;
  };
  proofStatus: 'proven' | 'disproven' | 'inconclusive' | 'error';
  proofId: string;
  proofLogId: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    contentLength: number;
    processingTime: number;
    indexedAt: string;
    sourceType: 'backbone' | 'codex' | 'orb_essay' | 's2s_codex';
  };
}

export interface CodexIndex {
  entries: CodexEntry[];
  statistics: {
    totalEntries: number;
    bySource: Record<string, number>;
    byOrb: Record<number, number>;
    averageResonance: number;
    provenEntries: number;
    successRate: number;
  };
  lastUpdated: string;
}

class LivingCodexIndexer {
  private static instance: LivingCodexIndexer;
  private index: CodexIndex;
  private enhancedEngine: typeof simpleEnhancedResonanceEngine;

  private constructor() {
    this.enhancedEngine = simpleEnhancedResonanceEngine;
    this.index = {
      entries: [],
      statistics: {
        totalEntries: 0,
        bySource: {},
        byOrb: {},
        averageResonance: 0,
        provenEntries: 0,
        successRate: 0
      },
      lastUpdated: new Date().toISOString()
    };
  }

  public static getInstance(): LivingCodexIndexer {
    if (!LivingCodexIndexer.instance) {
      LivingCodexIndexer.instance = new LivingCodexIndexer();
    }
    return LivingCodexIndexer.instance;
  }

  /**
   * Index all backbone and codex files
   */
  public async indexAllFiles(): Promise<CodexIndex> {
    console.log('Starting Living Codex indexing...');
    
    const entries: CodexEntry[] = [];
    
    // Index backbone files
    const backboneFiles = await this.indexBackboneFiles();
    entries.push(...backboneFiles);
    
    // Index codex files
    const codexFiles = await this.indexCodexFiles();
    entries.push(...codexFiles);
    
    // Index orb essays
    const orbEssays = await this.indexOrbEssays();
    entries.push(...orbEssays);
    
    // Index S2S codex essays
    const s2sCodexEssays = await this.indexS2SCodexEssays();
    entries.push(...s2sCodexEssays);
    
    // Update index
    this.index.entries = entries;
    this.index.lastUpdated = new Date().toISOString();
    
    // Calculate statistics
    this.calculateStatistics();
    
    console.log(`Living Codex indexing completed: ${entries.length} entries indexed`);
    return this.index;
  }

  /**
   * Index backbone files
   */
  private async indexBackboneFiles(): Promise<CodexEntry[]> {
    const entries: CodexEntry[] = [];
    
    try {
      // Index stardust_to_sovereignty_backbone.md from parent directory
      const backbonePath = join(process.cwd(), '..', 'CLEANED_SYSTEM', '01_CORE_FRAMEWORK', 'Stardust to Sovereignty Backbone_ORIGINAL.md');
      if (this.fileExists(backbonePath)) {
        const content = readFileSync(backbonePath, 'utf-8');
        const entry = await this.createCodexEntry(
          content,
          'Stardust to Sovereignty Backbone',
          'backbone',
          'backbone'
        );
        entries.push(entry);
      }
    } catch (error) {
      console.error('Error indexing backbone files:', error);
    }
    
    return entries;
  }

  /**
   * Index codex files
   */
  private async indexCodexFiles(): Promise<CodexEntry[]> {
    const entries: CodexEntry[] = [];
    
    try {
      // Index codex_Orb_Synthesis_Final.md from parent directory
      const codexPath = join(process.cwd(), '..', 'CLEANED_SYSTEM', '01_CORE_FRAMEWORK', 'codex_Orb_Synthesis_Final.md');
      if (this.fileExists(codexPath)) {
        const content = readFileSync(codexPath, 'utf-8');
        const entry = await this.createCodexEntry(
          content,
          'Codex Orb Synthesis Final',
          'codex',
          'codex'
        );
        entries.push(entry);
      }
      
      // Index S2S — Undercurrents Codex.md from parent directory
      const undercurrentsPath = join(process.cwd(), '..', 'CLEANED_SYSTEM', '01_CORE_FRAMEWORK', 'S2S — Undercurrents Codex.md');
      if (this.fileExists(undercurrentsPath)) {
        const content = readFileSync(undercurrentsPath, 'utf-8');
        const entry = await this.createCodexEntry(
          content,
          'S2S Undercurrents Codex',
          'undercurrents',
          'codex'
        );
        entries.push(entry);
      }
    } catch (error) {
      console.error('Error indexing codex files:', error);
    }
    
    return entries;
  }

  /**
   * Index orb essays
   */
  private async indexOrbEssays(): Promise<CodexEntry[]> {
    const entries: CodexEntry[] = [];
    
    try {
      const orbEssaysPath = join(process.cwd(), '..', 'CLEANED_SYSTEM', '09_PROCESSED', '02d_Orb_Essays');
      if (this.directoryExists(orbEssaysPath)) {
        const files = readdirSync(orbEssaysPath).filter(file => file.endsWith('.md'));
        
        for (const file of files) {
          const filePath = join(orbEssaysPath, file);
          const content = readFileSync(filePath, 'utf-8');
          const title = file.replace('.md', '').replace(/_/g, ' ');
          
          const entry = await this.createCodexEntry(
            content,
            title,
            `orb_essay_${file}`,
            'orb_essay'
          );
          entries.push(entry);
        }
      }
    } catch (error) {
      console.error('Error indexing orb essays:', error);
    }
    
    return entries;
  }

  /**
   * Index S2S codex essays
   */
  private async indexS2SCodexEssays(): Promise<CodexEntry[]> {
    const entries: CodexEntry[] = [];
    
    try {
      const s2sCodexPath = join(process.cwd(), '..', 'CLEANED_SYSTEM', '09_PROCESSED', '02f_S2S_codex_essays');
      if (this.directoryExists(s2sCodexPath)) {
        const files = readdirSync(s2sCodexPath).filter(file => file.endsWith('.md'));
        
        for (const file of files) {
          const filePath = join(s2sCodexPath, file);
          const content = readFileSync(filePath, 'utf-8');
          const title = file.replace('.md', '').replace(/_/g, ' ');
          
          const entry = await this.createCodexEntry(
            content,
            title,
            `s2s_codex_${file}`,
            's2s_codex'
          );
          entries.push(entry);
        }
      }
    } catch (error) {
      console.error('Error indexing S2S codex essays:', error);
    }
    
    return entries;
  }

  /**
   * Create a codex entry with mathematical analysis
   */
  private async createCodexEntry(
    content: string,
    title: string,
    source: string,
    sourceType: CodexEntry['metadata']['sourceType']
  ): Promise<CodexEntry> {
    const startTime = Date.now();
    
    try {
      // Analyze content with enhanced mathematical engine
      const analysis = await this.enhancedEngine.analyzeContentWithMathematics(content, title);
      
      const processingTime = Date.now() - startTime;
      
      return {
        id: `codex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        content,
        excerpt: content.substring(0, 200) + '...',
        source,
        contentType: 'text/markdown',
        tags: ['consciousness', 'resonance', 'mathematics'],
        orbAssociations: analysis.orb_associations,
        resonanceVector: analysis.resonanceVector,
        fieldDynamics: analysis.fieldDynamics,
        sovereignLogic: analysis.sovereignLogic,
        cocValidation: {
          coherenceScore: analysis.coherenceMatrix.coherenceRank,
          validatedOrbs: analysis.orb_associations,
          explanation: `Mathematical validation completed with ${analysis.sovereignLogic.validity} result`
        },
        proofStatus: analysis.sovereignLogic.validity === 'proven' ? 'proven' : 
                     analysis.sovereignLogic.validity === 'disproven' ? 'disproven' : 'inconclusive',
        proofId: analysis.proofId || '',
        proofLogId: analysis.proofId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          contentLength: content.length,
          processingTime,
          indexedAt: new Date().toISOString(),
          sourceType
        }
      };
    } catch (error) {
      console.error(`Error creating codex entry for ${title}:`, error);
      
      // Return minimal entry on error
      return {
        id: `codex_error_${Date.now()}`,
        title,
        content,
        excerpt: content.substring(0, 200) + '...',
        source,
        contentType: 'text/markdown',
        tags: ['error'],
        orbAssociations: [],
        resonanceVector: { x: 0, y: 0, z: 0, w: 0 },
        fieldDynamics: { fieldStrength: 0, gradient: [], stability: 0, coherence: 0 },
        sovereignLogic: { validity: 'inconclusive', proofSteps: [], logicalConsistency: 0 },
        cocValidation: { coherenceScore: 0, validatedOrbs: [], explanation: 'Analysis failed' },
        proofStatus: 'error',
        proofId: '',
        proofLogId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          contentLength: content.length,
          processingTime: Date.now() - startTime,
          indexedAt: new Date().toISOString(),
          sourceType
        }
      };
    }
  }

  /**
   * Calculate index statistics
   */
  private calculateStatistics(): void {
    const entries = this.index.entries;
    const totalEntries = entries.length;
    
    // Count by source
    const bySource: Record<string, number> = {};
    const byOrb: Record<number, number> = {};
    let totalResonance = 0;
    let provenEntries = 0;
    
    entries.forEach(entry => {
      // Count by source
      bySource[entry.source] = (bySource[entry.source] || 0) + 1;
      
      // Count by orb
      entry.orbAssociations.forEach(orb => {
        byOrb[orb] = (byOrb[orb] || 0) + 1;
      });
      
      // Calculate average resonance
      const resonanceMagnitude = Math.sqrt(
        entry.resonanceVector.x ** 2 + entry.resonanceVector.y ** 2 +
        entry.resonanceVector.z ** 2 + entry.resonanceVector.w ** 2
      );
      totalResonance += resonanceMagnitude;
      
      // Count proven entries
      if (entry.proofStatus === 'proven') {
        provenEntries++;
      }
    });
    
    this.index.statistics = {
      totalEntries,
      bySource,
      byOrb,
      averageResonance: totalEntries > 0 ? totalResonance / totalEntries : 0,
      provenEntries,
      successRate: totalEntries > 0 ? provenEntries / totalEntries : 0
    };
  }

  /**
   * Search the codex index
   */
  public searchCodex(query: string, limit: number = 20): CodexEntry[] {
    if (!query.trim()) {
      return this.index.entries.slice(0, limit);
    }
    
    const searchTerm = query.toLowerCase();
    
    return this.index.entries
      .filter(entry => 
        entry.title.toLowerCase().includes(searchTerm) ||
        entry.content.toLowerCase().includes(searchTerm) ||
        entry.source.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => {
        // Sort by resonance vector magnitude
        const aMagnitude = Math.sqrt(
          a.resonanceVector.x ** 2 + a.resonanceVector.y ** 2 +
          a.resonanceVector.z ** 2 + a.resonanceVector.w ** 2
        );
        const bMagnitude = Math.sqrt(
          b.resonanceVector.x ** 2 + b.resonanceVector.y ** 2 +
          b.resonanceVector.z ** 2 + b.resonanceVector.w ** 2
        );
        return bMagnitude - aMagnitude;
      })
      .slice(0, limit);
  }

  /**
   * Search with filters
   */
  public search(query: string, orb?: number, status?: string, source?: string): CodexEntry[] {
    let results = this.index.entries;
    
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      results = results.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm) ||
        entry.content.toLowerCase().includes(searchTerm) ||
        entry.source.toLowerCase().includes(searchTerm)
      );
    }
    
    if (orb !== undefined) {
      results = results.filter(entry => entry.orbAssociations.includes(orb));
    }
    
    if (status) {
      results = results.filter(entry => entry.proofStatus === status);
    }
    
    if (source) {
      results = results.filter(entry => entry.source === source);
    }
    
    return results.sort((a, b) => {
      // Sort by resonance vector magnitude
      const aMagnitude = Math.sqrt(
        a.resonanceVector.x ** 2 + a.resonanceVector.y ** 2 +
        a.resonanceVector.z ** 2 + a.resonanceVector.w ** 2
      );
      const bMagnitude = Math.sqrt(
        b.resonanceVector.x ** 2 + b.resonanceVector.y ** 2 +
        b.resonanceVector.z ** 2 + b.resonanceVector.w ** 2
      );
      return bMagnitude - aMagnitude;
    });
  }

  /**
   * Get index statistics
   */
  public getStatistics(): CodexIndex['statistics'] {
    return this.index.statistics;
  }

  /**
   * Get all entries
   */
  public getAllEntries(): CodexEntry[] {
    return this.index.entries;
  }

  /**
   * Get index entries
   */
  public getIndex(): CodexEntry[] {
    return this.index.entries;
  }

  /**
   * Initialize the indexer
   */
  public async initialize(): Promise<void> {
    await this.indexAllFiles();
  }

  /**
   * Get entry by ID
   */
  public getEntryById(id: string): CodexEntry | undefined {
    return this.index.entries.find(entry => entry.id === id);
  }

  /**
   * Utility methods
   */
  private fileExists(path: string): boolean {
    try {
      return statSync(path).isFile();
    } catch {
      return false;
    }
  }

  private directoryExists(path: string): boolean {
    try {
      return statSync(path).isDirectory();
    } catch {
      return false;
    }
  }
}

export const livingCodexIndexer = LivingCodexIndexer.getInstance();
