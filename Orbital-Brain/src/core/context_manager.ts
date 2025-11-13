/**
 * Context Manager - Manages session and field memory
 */

import type { OrbitalContext, ContentMetadata } from '../types/index.js';

export class ContextManager {
  private sessions: Map<string, OrbitalContext> = new Map();

  /**
   * Get or create session context
   */
  getSessionContext(sessionId?: string): OrbitalContext {
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        session_id: sessionId,
        field_state: 'active',
        active_orbs: [],
        conversation_history: []
      });
    }

    return this.sessions.get(sessionId)!;
  }

  /**
   * Update session with new interaction
   */
  updateSession(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: ContentMetadata
  ): void {
    const context = this.getSessionContext(sessionId);
    
    context.conversation_history = context.conversation_history || [];
    context.conversation_history.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });

    // Update active orbs from metadata
    if (metadata?.orb_associations) {
      context.active_orbs = Array.from(
        new Set([...(context.active_orbs || []), ...metadata.orb_associations])
      );
    }
  }

  /**
   * Calculate context continuity score
   */
  calculateContinuity(sessionId: string): number {
    const context = this.getSessionContext(sessionId);
    const history = context.conversation_history || [];
    
    if (history.length < 2) return 1.0;
    
    // Simple continuity: more interactions = higher continuity
    return Math.min(1.0, history.length / 10);
  }
}

