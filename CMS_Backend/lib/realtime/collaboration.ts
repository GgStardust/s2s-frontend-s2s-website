import { createClient } from '@/lib/supabase/server';
import { notificationQueue } from '@/lib/queue/bull';

export interface CollaborationSession {
  id: string;
  contentId: string;
  contentType: string;
  tenantId: string;
  participants: string[];
  activeUsers: {
    userId: string;
    name: string;
    lastActivity: string;
    cursorPosition?: number;
    selection?: { start: number; end: number };
  }[];
  createdAt: string;
  lastActivity: string;
}

export interface CollaborationEvent {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  eventType: 'join' | 'leave' | 'edit' | 'cursor_move' | 'selection_change';
  data: any;
  timestamp: string;
}

class CollaborationManager {
  private supabase = createClient();
  private queue = notificationQueue;
  private activeSessions: Map<string, CollaborationSession> = new Map();

  // Start a collaboration session
  async startCollaborationSession(
    contentId: string, 
    contentType: string, 
    tenantId: string, 
    userId: string,
    userName: string
  ): Promise<CollaborationSession> {
    try {
      const sessionId = `${contentType}:${contentId}`;
      
      // Check if session already exists
      let session = this.activeSessions.get(sessionId);
      
      if (!session) {
        // Create new session
        session = {
          id: sessionId,
          contentId,
          contentType,
          tenantId,
          participants: [],
          activeUsers: [],
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };
        
        this.activeSessions.set(sessionId, session);
      }

      // Add user to session
      if (!session.participants.includes(userId)) {
        session.participants.push(userId);
      }

      // Update active users
      const existingUserIndex = session.activeUsers.findIndex(u => u.userId === userId);
      if (existingUserIndex >= 0) {
        session.activeUsers[existingUserIndex].lastActivity = new Date().toISOString();
      } else {
        session.activeUsers.push({
          userId,
          name: userName,
          lastActivity: new Date().toISOString()
        });
      }

      // Log collaboration event
      await this.logCollaborationEvent(sessionId, userId, userName, 'join', {
        contentId,
        contentType
      });

      return session;

    } catch (error) {
      console.error('Error starting collaboration session:', error);
      throw error;
    }
  }

  // End collaboration session for a user
  async endCollaborationSession(
    contentId: string, 
    contentType: string, 
    userId: string
  ): Promise<void> {
    try {
      const sessionId = `${contentType}:${contentId}`;
      const session = this.activeSessions.get(sessionId);
      
      if (!session) return;

      // Remove user from active users
      session.activeUsers = session.activeUsers.filter(u => u.userId !== userId);
      session.participants = session.participants.filter(id => id !== userId);
      session.lastActivity = new Date().toISOString();

      // If no more active users, clean up session
      if (session.activeUsers.length === 0) {
        this.activeSessions.delete(sessionId);
      }

      // Log collaboration event
      await this.logCollaborationEvent(sessionId, userId, '', 'leave', {
        contentId,
        contentType
      });

    } catch (error) {
      console.error('Error ending collaboration session:', error);
    }
  }

  // Update user activity in collaboration session
  async updateUserActivity(
    contentId: string,
    contentType: string,
    userId: string,
    userName: string,
    activity: {
      cursorPosition?: number;
      selection?: { start: number; end: number };
      editData?: any;
    }
  ): Promise<void> {
    try {
      const sessionId = `${contentType}:${contentId}`;
      const session = this.activeSessions.get(sessionId);
      
      if (!session) return;

      // Update user activity
      const userIndex = session.activeUsers.findIndex(u => u.userId === userId);
      if (userIndex >= 0) {
        session.activeUsers[userIndex].lastActivity = new Date().toISOString();
        if (activity.cursorPosition !== undefined) {
          session.activeUsers[userIndex].cursorPosition = activity.cursorPosition;
        }
        if (activity.selection) {
          session.activeUsers[userIndex].selection = activity.selection;
        }
      }

      session.lastActivity = new Date().toISOString();

      // Log activity event
      const eventType = activity.editData ? 'edit' : 
                       activity.cursorPosition !== undefined ? 'cursor_move' : 'selection_change';
      
      await this.logCollaborationEvent(sessionId, userId, userName, eventType, activity);

    } catch (error) {
      console.error('Error updating user activity:', error);
    }
  }

  // Get active collaboration sessions for a tenant
  async getActiveSessions(tenantId: string): Promise<CollaborationSession[]> {
    try {
      const sessions = Array.from(this.activeSessions.values())
        .filter(session => session.tenantId === tenantId)
        .map(session => ({
          ...session,
          activeUsers: session.activeUsers.filter(user => {
            // Remove users inactive for more than 5 minutes
            const lastActivity = new Date(user.lastActivity);
            const now = new Date();
            return (now.getTime() - lastActivity.getTime()) < 5 * 60 * 1000;
          })
        }))
        .filter(session => session.activeUsers.length > 0);

      return sessions;

    } catch (error) {
      console.error('Error getting active sessions:', error);
      return [];
    }
  }

  // Get collaboration history for content
  async getCollaborationHistory(
    contentId: string, 
    contentType: string, 
    limit: number = 50
  ): Promise<CollaborationEvent[]> {
    try {
      const sessionId = `${contentType}:${contentId}`;
      
      const { data } = await this.supabase
        .from('collaboration_events')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      return data || [];

    } catch (error) {
      console.error('Error getting collaboration history:', error);
      return [];
    }
  }

  // Log collaboration event to database
  private async logCollaborationEvent(
    sessionId: string,
    userId: string,
    userName: string,
    eventType: string,
    data: any
  ): Promise<void> {
    try {
      await this.supabase
        .from('collaboration_events')
        .insert({
          session_id: sessionId,
          user_id: userId,
          user_name: userName,
          event_type: eventType,
          data: data,
          timestamp: new Date().toISOString()
        });

    } catch (error) {
      console.error('Error logging collaboration event:', error);
    }
  }

  // Clean up inactive sessions
  async cleanupInactiveSessions(): Promise<void> {
    try {
      const now = new Date();
      const inactiveThreshold = 10 * 60 * 1000; // 10 minutes

      for (const [sessionId, session] of this.activeSessions.entries()) {
        const lastActivity = new Date(session.lastActivity);
        if (now.getTime() - lastActivity.getTime() > inactiveThreshold) {
          this.activeSessions.delete(sessionId);
        }
      }

    } catch (error) {
      console.error('Error cleaning up inactive sessions:', error);
    }
  }

  // Get collaboration analytics
  async getCollaborationAnalytics(tenantId: string, timeRange: string = '24h') {
    try {
      const timeFilter = this.getTimeFilter(timeRange);
      
      const { data: events } = await this.supabase
        .from('collaboration_events')
        .select('*')
        .eq('tenant_id', tenantId)
        .gte('timestamp', timeFilter);

      if (!events) return null;

      const analytics = {
        totalEvents: events.length,
        activeSessions: this.activeSessions.size,
        mostActiveUsers: this.getMostActiveUsers(events),
        collaborationTrends: this.getCollaborationTrends(events),
        contentCollaboration: this.getContentCollaboration(events)
      };

      return analytics;

    } catch (error) {
      console.error('Error getting collaboration analytics:', error);
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

  private getMostActiveUsers(events: any[]): any[] {
    const userCounts = events.reduce((acc, event) => {
      acc[event.user_id] = (acc[event.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(userCounts)
      .map(([userId, count]) => ({ userId, eventCount: count as number }))
      .sort((a, b) => (b.eventCount as number) - (a.eventCount as number))
      .slice(0, 5);
  }

  private getCollaborationTrends(events: any[]): any[] {
    // Group events by hour
    const hourlyEvents = events.reduce((acc, event) => {
      const hour = new Date(event.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(hourlyEvents)
      .map(([hour, count]) => ({ hour: parseInt(hour), eventCount: count }))
      .sort((a, b) => a.hour - b.hour);
  }

  private getContentCollaboration(events: any[]): any[] {
    const contentCounts = events.reduce((acc, event) => {
      const contentId = event.data?.contentId;
      if (contentId) {
        acc[contentId] = (acc[contentId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(contentCounts)
      .map(([contentId, count]) => ({ contentId, collaborationCount: count as number }))
      .sort((a, b) => (b.collaborationCount as number) - (a.collaborationCount as number))
      .slice(0, 10);
  }
}

const collaborationManager = new CollaborationManager();
export default collaborationManager;
