/**
 * Field Experience Integration - Connect 2 Years of Data to Mathematical Layer
 * 
 * Integrates your Orb essays and codex files with the mathematical consciousness framework:
 * - YAML frontmatter validation
 * - Content processing pipeline
 * - Mathematical analysis of field data
 * - Resonance pattern learning from your experiences
 */

import { EnhancedResonanceEngine } from '../mathematics/enhanced-resonance-engine';
import { ResonanceVectorMath } from 'rbi-kernel';
import { SovereignLogic } from 'rbi-kernel';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface ContentFile {
  id: string;
  title: string;
  content: string;
  frontmatter: any;
  filePath: string;
  type: 'orb_essay' | 'codex_entry' | 'scrollstream' | 'research_notes';
  orbAssociations: number[];
  tags: string[];
  resonanceScore?: number;
  mathematicalAnalysis?: any;
}

export interface FieldExperienceData {
  orbEssays: ContentFile[];
  codexFiles: ContentFile[];
  totalFiles: number;
  mathematicalInsights: {
    averageResonanceScore: number;
    dominantOrbPatterns: number[];
    coherenceMatrix: any;
    fieldDynamics: any;
  };
}

export class FieldExperienceIntegration {
  private enhancedEngine: EnhancedResonanceEngine;
  private contentDirectory: string;

  constructor(contentDirectory: string = path.join(process.cwd(), '09_PROCESSED')) {
    this.enhancedEngine = EnhancedResonanceEngine.getInstance();
    this.contentDirectory = contentDirectory;
  }

  /**
   * Load and process all field experience content
   */
  public async loadFieldExperienceData(): Promise<FieldExperienceData> {
    console.log('🧠 Loading 2 years of field experience data...');
    
    try {
      // Load Orb essays
      const orbEssays = await this.loadContentDirectory('02d_Orb_Essays');
      
      // Load codex files
      const codexFiles = await this.loadContentDirectory('02f_S2S_codex_essays');
      
      // Process all content with mathematical analysis
      const processedOrbEssays = await this.processContentWithMathematics(orbEssays);
      const processedCodexFiles = await this.processContentWithMathematics(codexFiles);
      
      // Calculate mathematical insights
      const mathematicalInsights = await this.calculateMathematicalInsights([
        ...processedOrbEssays,
        ...processedCodexFiles
      ]);
      
      console.log(`✅ Loaded ${processedOrbEssays.length} Orb essays and ${processedCodexFiles.length} codex files`);
      console.log(`📊 Average resonance score: ${mathematicalInsights.averageResonanceScore.toFixed(3)}`);
      
      return {
        orbEssays: processedOrbEssays,
        codexFiles: processedCodexFiles,
        totalFiles: processedOrbEssays.length + processedCodexFiles.length,
        mathematicalInsights
      };
    } catch (error) {
      console.error('❌ Failed to load field experience data:', error);
      throw error;
    }
  }

  /**
   * Validate YAML frontmatter structure
   */
  public validateFrontmatter(frontmatter: any): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!frontmatter.title) errors.push('Missing required field: title');
    if (!frontmatter.type) errors.push('Missing required field: type');
    if (!frontmatter.author) warnings.push('Missing author field');

    // Validate type
    const validTypes = ['orb_essay', 'codex_entry', 'scrollstream', 'research_notes'];
    if (frontmatter.type && !validTypes.includes(frontmatter.type)) {
      errors.push(`Invalid type: ${frontmatter.type}. Must be one of: ${validTypes.join(', ')}`);
    }

    // Validate orb associations
    if (frontmatter.orb_associations) {
      if (frontmatter.orb_associations.primary_orb) {
        const orbNumber = this.extractOrbNumber(frontmatter.orb_associations.primary_orb);
        if (orbNumber < 1 || orbNumber > 13) {
          errors.push(`Invalid primary orb number: ${orbNumber}. Must be 1-13`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Process content with mathematical analysis
   */
  private async processContentWithMathematics(contentFiles: ContentFile[]): Promise<ContentFile[]> {
    const processedFiles: ContentFile[] = [];

    for (const file of contentFiles) {
      try {
        // METADATA-FIRST: Extract metadata from frontmatter BEFORE calling RBI
        const orbAssociations = this.extractOrbAssociations(file.frontmatter);
        const tags = this.extractTags(file.frontmatter);
        
        const metadata = {
          orb_associations: orbAssociations,
          field_function: file.frontmatter?.field_function,
          book_threading: file.frontmatter?.book_threading,
          integration_points: file.frontmatter?.integration_points,
          tags: tags
        };
        
        // Analyze content with enhanced mathematical layer - WITH METADATA
        const analysis = await this.enhancedEngine.analyzeContentWithMathematics(
          file.content,
          file.title,
          metadata
        );

        // Calculate resonance score
        const resonanceScore = analysis.overall_score;

        processedFiles.push({
          ...file,
          orbAssociations,
          tags,
          resonanceScore,
          mathematicalAnalysis: analysis.mathematical
        });

        console.log(`✅ Processed: ${file.title} (Resonance: ${resonanceScore.toFixed(3)})`);
      } catch (error) {
        console.error(`❌ Failed to process ${file.title}:`, error);
      }
    }

    return processedFiles;
  }

  /**
   * Calculate mathematical insights from all content
   */
  private async calculateMathematicalInsights(contentFiles: ContentFile[]): Promise<{
    averageResonanceScore: number;
    dominantOrbPatterns: number[];
    coherenceMatrix: any;
    fieldDynamics: any;
  }> {
    // Calculate average resonance score
    const resonanceScores = contentFiles
      .filter(f => f.resonanceScore !== undefined)
      .map(f => f.resonanceScore!);
    const averageResonanceScore = resonanceScores.reduce((sum, score) => sum + score, 0) / resonanceScores.length;

    // Find dominant orb patterns
    const orbCounts: Record<number, number> = {};
    contentFiles.forEach(file => {
      file.orbAssociations.forEach(orb => {
        orbCounts[orb] = (orbCounts[orb] || 0) + 1;
      });
    });
    const dominantOrbPatterns = Object.entries(orbCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([orb]) => parseInt(orb));

    // Calculate coherence matrix for all orbs
    const allOrbAssociations = contentFiles.flatMap(f => f.orbAssociations);
    const coherenceMatrix = ResonanceVectorMath.buildCoherenceMatrix(allOrbAssociations);

    // Calculate field dynamics
    const allResonanceVectors = contentFiles
      .filter(f => f.mathematicalAnalysis?.resonanceVector)
      .map(f => f.mathematicalAnalysis.resonanceVector);
    
    const averageVector = this.calculateAverageResonanceVector(allResonanceVectors);
    const fieldDynamics = ResonanceVectorMath.calculateFieldDynamics(averageVector, allOrbAssociations);

    return {
      averageResonanceScore,
      dominantOrbPatterns,
      coherenceMatrix,
      fieldDynamics
    };
  }

  /**
   * Load content from a specific directory
   */
  private async loadContentDirectory(subDirectory: string): Promise<ContentFile[]> {
    const directoryPath = path.join(this.contentDirectory, subDirectory);
    const files = fs.readdirSync(directoryPath);
    const contentFiles: ContentFile[] = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        try {
          const filePath = path.join(directoryPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          
          // Parse YAML frontmatter
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          let frontmatter: any = {};
          
          if (frontmatterMatch) {
            try {
              frontmatter = yaml.load(frontmatterMatch[1]) as any;
            } catch (error) {
              console.warn(`⚠️ Failed to parse YAML frontmatter for ${file}:`, error);
            }
          }

          // Extract content (everything after frontmatter)
          const contentStart = frontmatterMatch ? frontmatterMatch[0].length : 0;
          const markdownContent = content.substring(contentStart).trim();

          contentFiles.push({
            id: file.replace('.md', ''),
            title: frontmatter.title || file.replace('.md', ''),
            content: markdownContent,
            frontmatter,
            filePath,
            type: frontmatter.type || 'codex_entry',
            orbAssociations: this.extractOrbAssociations(frontmatter),
            tags: this.extractTags(frontmatter)
          });
        } catch (error) {
          console.error(`❌ Failed to load ${file}:`, error);
        }
      }
    }

    return contentFiles;
  }

  /**
   * Extract orb associations from frontmatter
   */
  private extractOrbAssociations(frontmatter: any): number[] {
    const associations: number[] = [];

    if (frontmatter.orb_associations?.primary_orb) {
      const primaryOrb = this.extractOrbNumber(frontmatter.orb_associations.primary_orb);
      if (primaryOrb >= 1 && primaryOrb <= 13) {
        associations.push(primaryOrb);
      }
    }

    if (frontmatter.orb_associations?.secondary_orbs) {
      frontmatter.orb_associations.secondary_orbs.forEach((orb: string) => {
        const orbNumber = this.extractOrbNumber(orb);
        if (orbNumber >= 1 && orbNumber <= 13) {
          associations.push(orbNumber);
        }
      });
    }

    return [...new Set(associations)]; // Remove duplicates
  }

  /**
   * Extract orb number from orb string
   */
  private extractOrbNumber(orbString: string): number {
    const match = orbString.match(/Orb (\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Extract tags from frontmatter
   */
  private extractTags(frontmatter: any): string[] {
    const tags: string[] = [];

    if (frontmatter.tags) {
      if (Array.isArray(frontmatter.tags)) {
        tags.push(...frontmatter.tags);
      } else if (typeof frontmatter.tags === 'string') {
        tags.push(...frontmatter.tags.split(',').map((tag: string) => tag.trim()));
      }
    }

    if (frontmatter.category) {
      tags.push(frontmatter.category);
    }

    if (frontmatter.type) {
      tags.push(frontmatter.type);
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Calculate average resonance vector
   */
  private calculateAverageResonanceVector(vectors: any[]): any {
    if (vectors.length === 0) {
      return { x: 0, y: 0, z: 0, w: 0 };
    }

    const sum = vectors.reduce((acc, vector) => ({
      x: acc.x + vector.x,
      y: acc.y + vector.y,
      z: acc.z + vector.z,
      w: acc.w + vector.w
    }), { x: 0, y: 0, z: 0, w: 0 });

    return {
      x: sum.x / vectors.length,
      y: sum.y / vectors.length,
      z: sum.z / vectors.length,
      w: sum.w / vectors.length
    };
  }
}
