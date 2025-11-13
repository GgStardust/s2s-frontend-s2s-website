/**
 * Orbital Context Service - Enhanced with Caching & Model Autonomy
 * 
 * Provides Orbital Brain integration for S2S content analysis:
 * - Orb associations mapping
 * - Undercurrent links detection
 * - Canonical tags application
 * - Scrollstream extractions
 * - Resonance metrics calculation
 * - Database caching for performance
 * - Retry logic with exponential backoff
 * - Local computation fallback
 */

import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export interface OrbitalContext {
  orbAssociations: number[];
  undercurrentLinks: number[];
  tags: string[];
  scrollstreams: string[];
  resonanceMetrics: {
    strength: number;
    clarity: number;
    coherence: number;
    pattern: number;
  };
  codexPath: string;
  dashboardComponent: string;
}

export interface ContentAnalysis {
  content: string;
  title?: string;
  contentType?: string;
}

export interface CachedOrbitalContext {
  id: string;
  content_hash: string;
  orb_associations: number[];
  undercurrent_links: number[];
  tags: string[];
  scrollstreams: string[];
  resonance_metrics: {
    strength: number;
    clarity: number;
    coherence: number;
    pattern: number;
  };
  codex_path: string;
  dashboard_component: string;
  created_at: string;
  expires_at: string;
  source: 'api' | 'local' | 'cache';
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export class OrbitalContextService {
  private static instance: OrbitalContextService;
  private contextCache: Map<string, OrbitalContext> = new Map();
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  };
  
  public static getInstance(): OrbitalContextService {
    if (!OrbitalContextService.instance) {
      OrbitalContextService.instance = new OrbitalContextService();
    }
    return OrbitalContextService.instance;
  }
  
  /**
   * Get Orbital context for content with enhanced caching and fallback
   */
  public async getOrbitalContext(content: string, title?: string, useLocal = false): Promise<OrbitalContext> {
    const contentHash = this.hashContent(content, title);
    
    // Check in-memory cache first
    if (this.contextCache.has(contentHash)) {
      console.log('Using in-memory cache for orbital context');
      return this.contextCache.get(contentHash)!;
    }
    
    // Check database cache
    const cachedContext = await this.getCachedContext(contentHash);
    if (cachedContext && new Date(cachedContext.expires_at) > new Date()) {
      console.log('Using database cache for orbital context');
      const context = this.convertCachedToContext(cachedContext);
      this.contextCache.set(contentHash, context);
      return context;
    }
    
    // Generate new context with fallback
    const context = await this.generateOrbitalContextWithFallback(content, title, useLocal);
    
    // Cache the context
    await this.cacheContext(contentHash, context, useLocal ? 'local' : 'api');
    this.contextCache.set(contentHash, context);
    
    return context;
  }
  
  /**
   * Generate Orbital context with fallback strategy
   */
  private async generateOrbitalContextWithFallback(content: string, title?: string, useLocal = false): Promise<OrbitalContext> {
    if (useLocal || !process.env.OPENAI_API_KEY) {
      console.log('Using local computation for orbital context');
      return this.generateFallbackContext(content);
    }
    
    try {
      return await this.callOpenAIWithRetry(content, title);
    } catch (error) {
      console.log('API failed, falling back to local computation:', error);
      return this.generateFallbackContext(content);
    }
  }
  
  /**
   * Call OpenAI API with retry logic and exponential backoff
   * Uses shared Orbital-Brain OpenAI service
   */
  private async callOpenAIWithRetry(content: string, title?: string): Promise<OrbitalContext> {
    // Dynamic import to avoid build-time issues
    const { chatCompletionsJSON } = await import('orbital-brain');
    
    for (let attempt = 0; attempt < this.retryConfig.maxRetries; attempt++) {
      try {
        const analysis = await chatCompletionsJSON<{
          orbAssociations?: number[];
          undercurrentLinks?: number[];
          tags?: string[];
          scrollstreams?: string[];
          resonanceMetrics?: {
            strength: number;
            clarity: number;
            coherence: number;
            pattern: number;
          };
          codexPath?: string;
          dashboardComponent?: string;
        }>({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are Orbital, the Codex-integrated intelligence for Stardust to Sovereignty. 
                       Analyze this content and provide:
                       1. Orb associations (1-13) - which Orbs best represent this content
                       2. Undercurrent links (1-12) - which Undercurrents connect to this content
                       3. Canonical tags - snake_case tags from the S2S Tag Registry
                       4. Scrollstream extractions - key resonant transmissions
                       5. Resonance metrics - strength, clarity, coherence, pattern (0-10 scale)
                       6. Codex path - where this content belongs in the Codex
                       7. Dashboard component - which dashboard module this activates
                       
                       Return JSON format with all required fields.`
            },
            {
              role: 'user',
              content: `Title: ${title || 'Untitled'}\n\nContent: ${content}`
            }
          ],
          temperature: 0.3,
        });
        
        return {
          orbAssociations: analysis.orbAssociations || [],
          undercurrentLinks: analysis.undercurrentLinks || [],
          tags: analysis.tags || [],
          scrollstreams: analysis.scrollstreams || [],
          resonanceMetrics: {
            strength: analysis.resonanceMetrics?.strength || 5,
            clarity: analysis.resonanceMetrics?.clarity || 5,
            coherence: analysis.resonanceMetrics?.coherence || 5,
            pattern: analysis.resonanceMetrics?.pattern || 5,
          },
          codexPath: analysis.codexPath || '/codex/',
          dashboardComponent: analysis.dashboardComponent || 'general'
        };
      } catch (error: any) {
        // Handle rate limiting and retries
        if (error?.status === 429 || error?.message?.includes('rate limit')) {
          const delay = Math.min(
            this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt),
            this.retryConfig.maxDelay
          );
          console.log(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${this.retryConfig.maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (attempt === this.retryConfig.maxRetries - 1) {
          throw error;
        }
        
        const delay = this.retryConfig.baseDelay * (attempt + 1);
        console.log(`Request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${this.retryConfig.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Max retries exceeded');
  }
  
  /**
   * Generate fallback context when AI is unavailable
   */
  private generateFallbackContext(content: string): OrbitalContext {
    // Basic keyword analysis for Orb associations
    const orbKeywords = {
      1: ['origin', 'intelligence', 'photonic', 'blueprint', 'activation'],
      2: ['resonance', 'mechanics', 'frequency', 'form', 'sound'],
      3: ['photonic', 'intelligence', 'light', 'mirror', 'awareness'],
      4: ['harmonic', 'architectures', 'geometry', 'coherence', 'pattern'],
      5: ['temporal', 'sovereignty', 'time', 'agency', 'spiral'],
      6: ['starline', 'memory', 'galactic', 'ancestral', 'recall'],
      7: ['alchemical', 'current', 'density', 'light', 'compression'],
      8: ['quantum', 'intuition', 'nonlinear', 'knowing', 'direction'],
      9: ['temporal', 'fluidity', 'attunement', 'timelines', 'movement'],
      10: ['ancestral', 'repatterning', 'lineage', 'transformation', 'myth'],
      11: ['radiant', 'transparency', 'luminous', 'truth', 'expression'],
      12: ['sovereign', 'field', 'indivisibility', 'structural', 'coherence'],
      13: ['bridging', 'intelligence', 'communication', 'human', 'nonhuman']
    };
    
    const contentLower = content.toLowerCase();
    const detectedOrbs: number[] = [];
    
    Object.entries(orbKeywords).forEach(([orbId, keywords]) => {
      if (keywords.some(keyword => contentLower.includes(keyword))) {
        detectedOrbs.push(parseInt(orbId));
      }
    });
    
    // Default to Orb 1 if no associations found
    if (detectedOrbs.length === 0) {
      detectedOrbs.push(1);
    }
    
    return {
      orbAssociations: detectedOrbs,
      undercurrentLinks: [1, 2], // Default undercurrents
      tags: ['@orbital', '@analysis'],
      scrollstreams: [],
      resonanceMetrics: {
        strength: 5,
        clarity: 5,
        coherence: 5,
        pattern: 5,
      },
      codexPath: '/codex/analysis/',
      dashboardComponent: 'orbital_analysis'
    };
  }
  
  /**
   * Hash content for caching (includes title for better uniqueness)
   */
  private hashContent(content: string, title?: string): string {
    const input = `${content}${title || ''}`;
    return crypto.createHash('sha256').update(input).digest('hex');
  }
  
  /**
   * Get cached context from database
   */
  private async getCachedContext(contentHash: string): Promise<CachedOrbitalContext | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('orbital_context')
        .select('*')
        .eq('content_hash', contentHash)
        .single();
      
      if (error || !data) {
        return null;
      }
      
      return data as CachedOrbitalContext;
    } catch (error) {
      console.error('Error fetching cached context:', error);
      return null;
    }
  }
  
  /**
   * Cache context in database
   */
  private async cacheContext(contentHash: string, context: OrbitalContext, source: 'api' | 'local'): Promise<void> {
    try {
      const supabase = await createClient();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await supabase.from('orbital_context').upsert({
        content_hash: contentHash,
        orb_associations: context.orbAssociations,
        undercurrent_links: context.undercurrentLinks,
        tags: context.tags,
        scrollstreams: context.scrollstreams,
        resonance_metrics: context.resonanceMetrics,
        codex_path: context.codexPath,
        dashboard_component: context.dashboardComponent,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        source: source
      });
      
      console.log(`Cached orbital context for hash: ${contentHash.substring(0, 8)}...`);
    } catch (error) {
      console.error('Error caching context:', error);
      // Don't throw - caching failure shouldn't break the main flow
    }
  }
  
  /**
   * Convert cached context to OrbitalContext interface
   */
  private convertCachedToContext(cached: CachedOrbitalContext): OrbitalContext {
    return {
      orbAssociations: cached.orb_associations,
      undercurrentLinks: cached.undercurrent_links,
      tags: cached.tags,
      scrollstreams: cached.scrollstreams,
      resonanceMetrics: cached.resonance_metrics,
      codexPath: cached.codex_path,
      dashboardComponent: cached.dashboard_component
    };
  }
  
  /**
   * Clear context cache (both in-memory and database)
   */
  public async clearCache(): Promise<void> {
    this.contextCache.clear();
    
    try {
      const supabase = await createClient();
      await supabase.from('orbital_context').delete().lt('expires_at', new Date().toISOString());
      console.log('Cleared expired orbital context cache');
    } catch (error) {
      console.error('Error clearing database cache:', error);
    }
  }
  
  /**
   * Get cache statistics
   */
  public async getCacheStats(): Promise<{ 
    memorySize: number; 
    memoryKeys: string[]; 
    databaseCount: number;
    expiredCount: number;
  }> {
    let databaseCount = 0;
    let expiredCount = 0;
    
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('orbital_context')
        .select('expires_at');
      
      if (data) {
        databaseCount = data.length;
        expiredCount = data.filter(item => new Date(item.expires_at) < new Date()).length;
      }
    } catch (error) {
      console.error('Error getting database cache stats:', error);
    }
    
    return {
      memorySize: this.contextCache.size,
      memoryKeys: Array.from(this.contextCache.keys()),
      databaseCount,
      expiredCount
    };
  }
  
  /**
   * Update retry configuration
   */
  public updateRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }
  
  /**
   * Force local computation mode for testing
   */
  public async getOrbitalContextLocal(content: string, title?: string): Promise<OrbitalContext> {
    return this.getOrbitalContext(content, title, true);
  }
}

// Export singleton instance
export const orbitalContextService = OrbitalContextService.getInstance();
