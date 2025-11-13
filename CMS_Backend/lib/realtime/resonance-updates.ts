import { createClient } from '@/lib/supabase/server';
import { notificationQueue } from '@/lib/queue/bull';

export interface ResonanceUpdate {
  contentId: string;
  scores: {
    clarity: number;
    coherence: number;
    resonance: number;
    sovereignty: number;
  };
  orbAssociations: number[];
  timestamp: string;
  updatedBy: string;
}

export interface ResonancePattern {
  id: string;
  pattern: string;
  strength: number;
  frequency: number;
  lastSeen: string;
}

class ResonanceUpdateManager {
  private supabase = createClient();
  private queue = notificationQueue;

  // Process resonance score updates and broadcast to connected clients
  async processResonanceUpdate(contentId: string, scores: any, tenantId: string, userId: string) {
    try {
      // Update database with new scores
      const { error } = await this.supabase
        .from('resonance_scores')
        .upsert({
          content_id: contentId,
          clarity: scores.clarity,
          coherence: scores.coherence,
          resonance: scores.resonance,
          sovereignty: scores.sovereignty,
          updated_by: userId,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating resonance scores:', error);
        return;
      }

      // Queue real-time broadcast job
      if (this.queue) {
        await this.queue.add('resonance-broadcast', {
          contentId,
          scores,
          tenantId,
          userId,
          timestamp: new Date().toISOString()
        });
      }

      // Detect resonance patterns
      await this.detectResonancePatterns(contentId, scores, tenantId);

    } catch (error) {
      console.error('Error processing resonance update:', error);
    }
  }

  // Detect emerging resonance patterns across content
  private async detectResonancePatterns(contentId: string, scores: any, tenantId: string) {
    try {
      // Get recent resonance scores for pattern analysis
      const { data: recentScores } = await this.supabase
        .from('resonance_scores')
        .select('*')
        .eq('tenant_id', tenantId)
        .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('updated_at', { ascending: false })
        .limit(50);

      if (!recentScores || recentScores.length < 5) return;

      // Analyze for patterns
      const patterns = this.analyzeResonancePatterns(recentScores);
      
      if (patterns.length > 0) {
        // Store patterns in database
        await this.supabase
          .from('resonance_patterns')
          .upsert(patterns.map(pattern => ({
            tenant_id: tenantId,
            pattern: pattern.pattern,
            strength: pattern.strength,
            frequency: pattern.frequency,
            last_seen: pattern.lastSeen
          })));

        // Queue pattern notification
        if (this.queue) {
          await this.queue.add('pattern-notification', {
            tenantId,
            patterns,
            timestamp: new Date().toISOString()
          });
        }
      }

    } catch (error) {
      console.error('Error detecting resonance patterns:', error);
    }
  }

  // Analyze resonance data for emerging patterns
  private analyzeResonancePatterns(scores: any[]): ResonancePattern[] {
    const patterns: ResonancePattern[] = [];

    // High resonance pattern
    const highResonance = scores.filter(s => s.resonance > 8.0);
    if (highResonance.length >= 3) {
      patterns.push({
        id: `high_resonance_${Date.now()}`,
        pattern: 'High Resonance Cluster',
        strength: highResonance.length / scores.length,
        frequency: highResonance.length,
        lastSeen: new Date().toISOString()
      });
    }

    // Clarity coherence pattern
    const clarityCoherence = scores.filter(s => s.clarity > 7.5 && s.coherence > 7.5);
    if (clarityCoherence.length >= 3) {
      patterns.push({
        id: `clarity_coherence_${Date.now()}`,
        pattern: 'Clarity-Coherence Alignment',
        strength: clarityCoherence.length / scores.length,
        frequency: clarityCoherence.length,
        lastSeen: new Date().toISOString()
      });
    }

    // Sovereignty emergence pattern
    const sovereigntyEmergence = scores.filter(s => s.sovereignty > 8.5);
    if (sovereigntyEmergence.length >= 2) {
      patterns.push({
        id: `sovereignty_emergence_${Date.now()}`,
        pattern: 'Sovereignty Emergence',
        strength: sovereigntyEmergence.length / scores.length,
        frequency: sovereigntyEmergence.length,
        lastSeen: new Date().toISOString()
      });
    }

    return patterns;
  }

  // Get resonance analytics for dashboard
  async getResonanceAnalytics(tenantId: string, timeRange: string = '24h') {
    try {
      const timeFilter = this.getTimeFilter(timeRange);
      
      const { data: scores } = await this.supabase
        .from('resonance_scores')
        .select('*')
        .eq('tenant_id', tenantId)
        .gte('updated_at', timeFilter)
        .order('updated_at', { ascending: false });

      if (!scores) return null;

      // Calculate analytics
      const analytics = {
        totalUpdates: scores.length,
        averageResonance: this.calculateAverage(scores, 'resonance'),
        averageClarity: this.calculateAverage(scores, 'clarity'),
        averageCoherence: this.calculateAverage(scores, 'coherence'),
        averageSovereignty: this.calculateAverage(scores, 'sovereignty'),
        highResonanceCount: scores.filter(s => s.resonance > 8.0).length,
        trendingContent: this.getTrendingContent(scores),
        patterns: await this.getRecentPatterns(tenantId)
      };

      return analytics;

    } catch (error) {
      console.error('Error getting resonance analytics:', error);
      return null;
    }
  }

  private getTimeFilter(timeRange: string): string {
    const now = new Date();
    switch (timeRange) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  }

  private calculateAverage(scores: any[], field: string): number {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + (score[field] || 0), 0);
    return Math.round((sum / scores.length) * 100) / 100;
  }

  private getTrendingContent(scores: any[]): any[] {
    // Group by content_id and count updates
    const contentCounts = scores.reduce((acc, score) => {
      acc[score.content_id] = (acc[score.content_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(contentCounts)
      .map(([contentId, count]) => ({ contentId, updateCount: count as number }))
      .sort((a, b) => (b.updateCount as number) - (a.updateCount as number))
      .slice(0, 5);
  }

  private async getRecentPatterns(tenantId: string) {
    try {
      const { data } = await this.supabase
        .from('resonance_patterns')
        .select('*')
        .eq('tenant_id', tenantId)
        .gte('last_seen', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('last_seen', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error getting recent patterns:', error);
      return [];
    }
  }
}

const resonanceUpdateManager = new ResonanceUpdateManager();
export default resonanceUpdateManager;
