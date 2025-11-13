import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { createClient } from '@/lib/supabase/server';

export interface SocketUser {
  id: string;
  tenantId: string;
  role: string;
  name?: string;
}

export interface SocketRoom {
  id: string;
  type: 'content' | 'book' | 'orb' | 'collaboration';
  tenantId: string;
  participants: string[];
}

class SocketServer {
  private io: SocketIOServer;
  private connectedUsers: Map<string, SocketUser> = new Map();
  private rooms: Map<string, SocketRoom> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      },
      path: "/api/realtime/socket"
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // User authentication and room joining
      socket.on('authenticate', async (data: { token: string, tenantId: string }) => {
        try {
          const supabase = createClient();
          const { data: { user }, error } = await supabase.auth.getUser(data.token);
          
          if (error || !user) {
            socket.emit('auth_error', { message: 'Invalid authentication' });
            return;
          }

          const userData: SocketUser = {
            id: user.id,
            tenantId: data.tenantId,
            role: user.user_metadata?.role || 'member',
            name: user.user_metadata?.name || user.email
          };

          this.connectedUsers.set(socket.id, userData);
          socket.join(`tenant:${data.tenantId}`);
          socket.emit('authenticated', { user: userData });

          // Notify others in tenant of new user
          socket.to(`tenant:${data.tenantId}`).emit('user_joined', {
            userId: user.id,
            name: userData.name
          });

        } catch (error) {
          socket.emit('auth_error', { message: 'Authentication failed' });
        }
      });

      // Join content collaboration room
      socket.on('join_content', (data: { contentId: string, type: string }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const roomId = `${data.type}:${data.contentId}`;
        socket.join(roomId);

        // Create or update room
        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, {
            id: roomId,
            type: data.type as any,
            tenantId: user.tenantId,
            participants: []
          });
        }

        const room = this.rooms.get(roomId)!;
        if (!room.participants.includes(user.id)) {
          room.participants.push(user.id);
        }

        // Notify others in room
        socket.to(roomId).emit('user_joined_content', {
          userId: user.id,
          name: user.name,
          contentId: data.contentId
        });

        // Send current participants to new user
        socket.emit('content_participants', {
          participants: room.participants.map(id => {
            const participant = Array.from(this.connectedUsers.values()).find(u => u.id === id);
            return participant ? { id: participant.id, name: participant.name } : null;
          }).filter(Boolean)
        });
      });

      // Leave content collaboration room
      socket.on('leave_content', (data: { contentId: string, type: string }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const roomId = `${data.type}:${data.contentId}`;
        socket.leave(roomId);

        const room = this.rooms.get(roomId);
        if (room) {
          room.participants = room.participants.filter(id => id !== user.id);
          if (room.participants.length === 0) {
            this.rooms.delete(roomId);
          } else {
            socket.to(roomId).emit('user_left_content', {
              userId: user.id,
              name: user.name,
              contentId: data.contentId
            });
          }
        }
      });

      // Real-time editing events
      socket.on('content_edit', (data: { contentId: string, type: string, changes: any }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const roomId = `${data.type}:${data.contentId}`;
        socket.to(roomId).emit('content_edited', {
          userId: user.id,
          name: user.name,
          contentId: data.contentId,
          changes: data.changes,
          timestamp: new Date().toISOString()
        });
      });

      // Resonance score updates
      socket.on('resonance_update', (data: { contentId: string, scores: any }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        // Broadcast to all users in tenant
        this.io.to(`tenant:${user.tenantId}`).emit('resonance_updated', {
          contentId: data.contentId,
          scores: data.scores,
          updatedBy: user.id,
          timestamp: new Date().toISOString()
        });
      });

      // System notifications
      socket.on('send_notification', (data: { type: string, message: string, targetUsers?: string[] }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const notification = {
          id: `notif_${Date.now()}`,
          type: data.type,
          message: data.message,
          from: user.id,
          fromName: user.name,
          timestamp: new Date().toISOString()
        };

        if (data.targetUsers) {
          // Send to specific users
          data.targetUsers.forEach(userId => {
            this.io.emit('notification', notification);
          });
        } else {
          // Send to all users in tenant
          this.io.to(`tenant:${user.tenantId}`).emit('notification', notification);
        }
      });

      // Disconnect handling
      socket.on('disconnect', () => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          // Notify tenant of user leaving
          socket.to(`tenant:${user.tenantId}`).emit('user_left', {
            userId: user.id,
            name: user.name
          });

          // Clean up user data
          this.connectedUsers.delete(socket.id);
        }
      });
    });
  }

  // Broadcast resonance update to all connected clients
  public broadcastResonanceUpdate(contentId: string, scores: any, tenantId: string) {
    this.io.to(`tenant:${tenantId}`).emit('resonance_updated', {
      contentId,
      scores,
      timestamp: new Date().toISOString()
    });
  }

  // Send notification to specific tenant
  public sendNotification(tenantId: string, notification: any) {
    this.io.to(`tenant:${tenantId}`).emit('notification', notification);
  }

  // Get connected users for a tenant
  public getConnectedUsers(tenantId: string): SocketUser[] {
    return Array.from(this.connectedUsers.values()).filter(user => user.tenantId === tenantId);
  }

  // Get room participants
  public getRoomParticipants(roomId: string): SocketUser[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    return room.participants.map(id => {
      return Array.from(this.connectedUsers.values()).find(u => u.id === id);
    }).filter(Boolean) as SocketUser[];
  }
}

export default SocketServer;





