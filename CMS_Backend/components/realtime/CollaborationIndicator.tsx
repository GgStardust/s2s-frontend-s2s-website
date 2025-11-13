'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Users, Edit3, Eye, Clock } from 'lucide-react';

interface Collaborator {
  userId: string;
  name: string;
  lastActivity: string;
  cursorPosition?: number;
  selection?: { start: number; end: number };
}

interface CollaborationIndicatorProps {
  contentId: string;
  contentType: string;
  tenantId: string;
  currentUserId: string;
  currentUserName: string;
  showDetails?: boolean;
}

export default function CollaborationIndicator({
  contentId,
  contentType,
  tenantId,
  currentUserId,
  currentUserName,
  showDetails = false
}: CollaborationIndicatorProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [participants, setParticipants] = useState<Collaborator[]>([]);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [lastActivity, setLastActivity] = useState<string>('');
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const loadParticipants = useCallback(async () => {
    try {
      const response = await fetch(`/api/realtime/connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_tenant_status',
          data: { tenantId }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // This would be populated by the socket server
        // For now, we'll use the participants from socket events
      }
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  }, [tenantId]);

  const connectSocket = useCallback(async () => {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
        path: '/api/realtime/socket',
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
        console.log('Collaboration socket connected');
        setConnected(true);
        reconnectAttempts.current = 0;

        // Authenticate
        newSocket.emit('authenticate', {
          token,
          tenantId
        });
      });

      newSocket.on('authenticated', (data) => {
        console.log('Collaboration socket authenticated:', data);
        setIsAuthenticated(true);
        
        // Join content collaboration
        newSocket.emit('join_content', {
          contentId,
          type: contentType
        });
        setIsCollaborating(true);
      });

      newSocket.on('auth_error', (error) => {
        console.error('Collaboration authentication error:', error);
        setIsAuthenticated(false);
      });

      newSocket.on('user_joined_content', (data) => {
        console.log('User joined content:', data);
        // Refresh participants list
        loadParticipants();
      });

      newSocket.on('user_left_content', (data) => {
        console.log('User left content:', data);
        // Refresh participants list
        loadParticipants();
      });

      newSocket.on('content_participants', (data) => {
        console.log('Content participants:', data);
        setParticipants(data.participants || []);
      });

      newSocket.on('content_edited', (data) => {
        console.log('Content edited:', data);
        setLastActivity(new Date().toLocaleString());
        
        // Update participant activity
        setParticipants(prev => 
          prev.map(p => 
            p.userId === data.userId 
              ? { ...p, lastActivity: data.timestamp }
              : p
          )
        );
      });

      newSocket.on('disconnect', () => {
        console.log('Collaboration socket disconnected');
        setConnected(false);
        setIsAuthenticated(false);
        setIsCollaborating(false);
        
        // Attempt reconnection
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts.current++;
            connectSocket();
          }, 2000 * reconnectAttempts.current);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Collaboration socket connection error:', error);
        setConnected(false);
      });

      setSocket(newSocket);

    } catch (error) {
      console.error('Error connecting collaboration socket:', error);
    }
  }, [contentId, tenantId, contentType, loadParticipants]);

  useEffect(() => {
    if (contentId && tenantId) {
      connectSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [contentId, tenantId, connectSocket, socket]);

  const leaveCollaboration = () => {
    if (socket) {
      socket.emit('leave_content', {
        contentId,
        type: contentType
      });
      setIsCollaborating(false);
    }
  };

  const joinCollaboration = () => {
    if (socket && isAuthenticated) {
      socket.emit('join_content', {
        contentId,
        type: contentType
      });
      setIsCollaborating(true);
    }
  };

  const getActivityStatus = (lastActivity: string) => {
    const now = new Date();
    const activityTime = new Date(lastActivity);
    const diffMinutes = (now.getTime() - activityTime.getTime()) / (1000 * 60);
    
    if (diffMinutes < 1) return 'text-green-400';
    if (diffMinutes < 5) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getActivityIcon = (lastActivity: string) => {
    const now = new Date();
    const activityTime = new Date(lastActivity);
    const diffMinutes = (now.getTime() - activityTime.getTime()) / (1000 * 60);
    
    if (diffMinutes < 1) return <Edit3 className="w-3 h-3" />;
    if (diffMinutes < 5) return <Eye className="w-3 h-3" />;
    return <Clock className="w-3 h-3" />;
  };

  return (
    <div className="bg-deep-navy/30 backdrop-blur-sm rounded-lg p-4 border border-deep-gold/20">
      {/* Collaboration Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-deep-gold" />
          <span className="text-sm text-creamy-white">
            {isCollaborating ? 'Collaborating' : 'Not Collaborating'}
          </span>
          {participants.length > 0 && (
            <span className="text-xs text-creamy-white/60">
              ({participants.length} active)
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            connected && isAuthenticated ? 'bg-green-400' : 'bg-red-400'
          }`} />
          
          {isCollaborating ? (
            <button
              onClick={leaveCollaboration}
              className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30 transition-colors"
            >
              Leave
            </button>
          ) : (
            <button
              onClick={joinCollaboration}
              className="px-2 py-1 bg-deep-gold/20 text-deep-gold text-xs rounded hover:bg-deep-gold/30 transition-colors"
              disabled={!connected || !isAuthenticated}
            >
              Join
            </button>
          )}
        </div>
      </div>

      {/* Active Participants */}
      {participants.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-creamy-white mb-2">Active Collaborators</h4>
          <div className="space-y-1">
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    getActivityStatus(participant.lastActivity)
                  }`} />
                  <span className="text-creamy-white/80">{participant.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {getActivityIcon(participant.lastActivity)}
                  <span className="text-creamy-white/60">
                    {new Date(participant.lastActivity).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Activity */}
      {lastActivity && (
        <div className="text-xs text-creamy-white/60">
          Last activity: {lastActivity}
        </div>
      )}

      {/* Connection Status */}
      {!connected && (
        <div className="text-center py-2">
          <p className="text-xs text-creamy-white/60">Connecting to collaboration server...</p>
        </div>
      )}

      {/* No Participants */}
      {connected && isAuthenticated && participants.length === 0 && (
        <div className="text-center py-2">
          <p className="text-xs text-creamy-white/60">No other collaborators active</p>
        </div>
      )}
    </div>
  );
}
