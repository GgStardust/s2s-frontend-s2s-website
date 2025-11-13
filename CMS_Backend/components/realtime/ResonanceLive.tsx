'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { TrendingUp, Activity, Zap, Brain, BarChart3, Hexagon, Compass, Sparkles } from 'lucide-react';

interface ResonanceData {
  contentId: string;
  scores: {
    clarity: number;
    coherence: number;
    resonance: number;
    sovereignty: number;
  };
  timestamp: string;
  updatedBy?: string;
  // Enhanced mathematical fields
  mathematical_proof?: any;
  harmonic_frequency?: {
    fundamental: number;
    harmonics: number[];
    dissonance: number;
    spectralDensity: number;
  };
  coherence_matrix?: {
    nxn: number[][];
    eigenvalues: number[];
    eigenvectors: number[][];
    coherenceRank: number;
  };
  field_dynamics?: {
    fieldStrength: number;
    gradient: number[];
    stability: number;
    coherence: number;
  };
}

interface ResonanceLiveProps {
  contentId?: string;
  tenantId: string;
  autoConnect?: boolean;
  showDetails?: boolean;
  showMathematicalInsights?: boolean;
  onMathematicalUpdate?: (data: any) => void;
}

export default function ResonanceLive({ 
  contentId, 
  tenantId, 
  autoConnect = true,
  showDetails = false,
  showMathematicalInsights = false,
  onMathematicalUpdate
}: ResonanceLiveProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [resonanceData, setResonanceData] = useState<ResonanceData | null>(null);
  const [liveUpdates, setLiveUpdates] = useState<ResonanceData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connectSocket = useCallback(async () => {
    try {
      // Get auth token
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
        console.log('Socket connected');
        setConnected(true);
        reconnectAttempts.current = 0;

        // Authenticate with server
        newSocket.emit('authenticate', {
          token,
          tenantId
        });
      });

      newSocket.on('authenticated', (data) => {
        console.log('Socket authenticated:', data);
        setIsAuthenticated(true);
      });

      newSocket.on('auth_error', (error) => {
        console.error('Socket authentication error:', error);
        setIsAuthenticated(false);
      });

      newSocket.on('resonance_updated', (data: ResonanceData) => {
        console.log('Resonance update received:', data);
        setResonanceData(data);
        
        // Add to live updates (keep last 10)
        setLiveUpdates(prev => [data, ...prev.slice(0, 9)]);
        
        // Notify parent component of mathematical updates
        if (onMathematicalUpdate && (data.mathematical_proof || data.harmonic_frequency || data.coherence_matrix || data.field_dynamics)) {
          onMathematicalUpdate(data);
        }
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
        setIsAuthenticated(false);
        
        // Attempt reconnection
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts.current++;
            connectSocket();
          }, 2000 * reconnectAttempts.current);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
      });

      setSocket(newSocket);

    } catch (error) {
      console.error('Error connecting socket:', error);
    }
  }, [tenantId]);

  useEffect(() => {
    if (autoConnect && tenantId) {
      connectSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [tenantId, autoConnect, connectSocket, socket]);

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setConnected(false);
      setIsAuthenticated(false);
    }
  };

  const getResonanceColor = (score: number) => {
    if (score >= 8.5) return 'text-green-400';
    if (score >= 7.0) return 'text-yellow-400';
    if (score >= 5.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const getResonanceIcon = (score: number) => {
    if (score >= 8.5) return <Zap className="w-4 h-4" />;
    if (score >= 7.0) return <TrendingUp className="w-4 h-4" />;
    if (score >= 5.0) return <Activity className="w-4 h-4" />;
    return <Brain className="w-4 h-4" />;
  };

  return (
    <div className="bg-deep-navy/30 backdrop-blur-sm rounded-lg p-4 border border-deep-gold/20">
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            connected && isAuthenticated ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`} />
          <span className="text-sm text-creamy-white">
            {connected && isAuthenticated ? 'Live Resonance' : 'Disconnected'}
          </span>
        </div>
        
        {!connected && (
          <button
            onClick={connectSocket}
            className="px-3 py-1 bg-deep-gold/20 text-deep-gold text-xs rounded hover:bg-deep-gold/30 transition-colors"
          >
            Connect
          </button>
        )}
        
        {connected && (
          <button
            onClick={disconnect}
            className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30 transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>

      {/* Current Resonance Data */}
      {resonanceData && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-creamy-white mb-2">Current Resonance</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              {getResonanceIcon(resonanceData.scores.clarity)}
              <span className="text-xs text-creamy-white/70">Clarity:</span>
              <span className={`text-xs font-semibold ${getResonanceColor(resonanceData.scores.clarity)}`}>
                {resonanceData.scores.clarity.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getResonanceIcon(resonanceData.scores.coherence)}
              <span className="text-xs text-creamy-white/70">Coherence:</span>
              <span className={`text-xs font-semibold ${getResonanceColor(resonanceData.scores.coherence)}`}>
                {resonanceData.scores.coherence.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getResonanceIcon(resonanceData.scores.resonance)}
              <span className="text-xs text-creamy-white/70">Resonance:</span>
              <span className={`text-xs font-semibold ${getResonanceColor(resonanceData.scores.resonance)}`}>
                {resonanceData.scores.resonance.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getResonanceIcon(resonanceData.scores.sovereignty)}
              <span className="text-xs text-creamy-white/70">Sovereignty:</span>
              <span className={`text-xs font-semibold ${getResonanceColor(resonanceData.scores.sovereignty)}`}>
                {resonanceData.scores.sovereignty.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mathematical Insights */}
      {showMathematicalInsights && resonanceData && (
        <div className="mt-4 p-3 bg-deep-navy/20 rounded-lg border border-deep-gold/10">
          <h3 className="text-sm font-semibold text-creamy-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-deep-gold" />
            Mathematical Analysis
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Harmonic Frequency */}
            {resonanceData.harmonic_frequency && (
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-creamy-white/70">Harmonic</span>
                </div>
                <div className="text-xs text-creamy-white/60">
                  Fundamental: {resonanceData.harmonic_frequency.fundamental.toFixed(2)} Hz
                </div>
                <div className="text-xs text-creamy-white/60">
                  Dissonance: {resonanceData.harmonic_frequency.dissonance.toFixed(3)}
                </div>
              </div>
            )}
            
            {/* Coherence Matrix */}
            {resonanceData.coherence_matrix && (
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Hexagon className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-creamy-white/70">Coherence</span>
                </div>
                <div className="text-xs text-creamy-white/60">
                  Rank: {resonanceData.coherence_matrix.coherenceRank}
                </div>
                <div className="text-xs text-creamy-white/60">
                  Eigenvalues: {resonanceData.coherence_matrix.eigenvalues.length}
                </div>
              </div>
            )}
            
            {/* Field Dynamics */}
            {resonanceData.field_dynamics && (
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Compass className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-creamy-white/70">Field</span>
                </div>
                <div className="text-xs text-creamy-white/60">
                  Strength: {resonanceData.field_dynamics.fieldStrength.toFixed(3)}
                </div>
                <div className="text-xs text-creamy-white/60">
                  Stability: {(resonanceData.field_dynamics.stability * 100).toFixed(1)}%
                </div>
              </div>
            )}
            
            {/* Mathematical Proof */}
            {resonanceData.mathematical_proof && (
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-creamy-white/70">Proof</span>
                </div>
                <div className="text-xs text-creamy-white/60">
                  Status: {resonanceData.mathematical_proof.validity || 'pending'}
                </div>
                <div className="text-xs text-creamy-white/60">
                  Confidence: {resonanceData.mathematical_proof.confidence ? 
                    (resonanceData.mathematical_proof.confidence * 100).toFixed(1) + '%' : 'N/A'
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Updates */}
      {showDetails && liveUpdates.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-creamy-white mb-2">Recent Updates</h3>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {liveUpdates.slice(0, 5).map((update, index) => (
              <div key={index} className="text-xs text-creamy-white/60 flex items-center gap-2">
                <span>{new Date(update.timestamp).toLocaleTimeString()}</span>
                <span>Resonance: {update.scores.resonance.toFixed(1)}</span>
                {update.updatedBy && (
                  <span className="text-deep-gold">by {update.updatedBy}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!resonanceData && connected && isAuthenticated && (
        <div className="text-center py-4">
          <Brain className="w-8 h-8 text-deep-gold/40 mx-auto mb-2" />
          <p className="text-sm text-creamy-white/60">Waiting for resonance updates...</p>
        </div>
      )}
    </div>
  );
}
