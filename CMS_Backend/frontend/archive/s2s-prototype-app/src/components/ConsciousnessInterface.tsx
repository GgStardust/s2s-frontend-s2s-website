'use client';

import React, { useState, useEffect } from 'react';
import { consciousnessFramework, ConsciousnessState, ConsciousnessAnalysis, ConsciousnessSession } from '@/lib/framework/consciousness-framework';

interface ConsciousnessInterfaceProps {
  className?: string;
}

export default function ConsciousnessInterface({ className = '' }: ConsciousnessInterfaceProps) {
  const [session, setSession] = useState<ConsciousnessSession | null>(null);
  const [currentState, setCurrentState] = useState<ConsciousnessState | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<ConsciousnessAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contentInput, setContentInput] = useState('');

  // Initialize framework
  useEffect(() => {
    consciousnessFramework.initialize();
  }, []);

  // Start new session
  const startSession = async () => {
    const newSession = await consciousnessFramework.startSession();
    setSession(newSession);
    setCurrentState(newSession.currentState);
  };

  // Analyze content
  const analyzeContent = async () => {
    if (!contentInput.trim() || !session) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await consciousnessFramework.analyzeContent(contentInput);
      setCurrentAnalysis(analysis);
      setCurrentState(consciousnessFramework.getCurrentState());
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get state color based on user state
  const getStateColor = (state: string) => {
    switch (state) {
      case 'idle': return 'text-gray-400';
      case 'analyzing': return 'text-blue-400 animate-pulse';
      case 'validated': return 'text-green-400';
      case 'learning': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  // Get Orb color
  const getOrbColor = (orbNumber: number) => {
    const colors = [
      'text-blue-400', 'text-cyan-400', 'text-yellow-400', 'text-purple-400',
      'text-green-400', 'text-orange-400', 'text-pink-400', 'text-indigo-400',
      'text-red-400', 'text-emerald-400', 'text-rose-400', 'text-violet-400',
      'text-sky-400'
    ];
    return colors[(orbNumber - 1) % colors.length];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            S2S Consciousness Interface
          </h1>
          <p className="text-xl text-gray-300">
            Unified consciousness technology demonstration
          </p>
        </div>

        {/* Session Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Consciousness Session</h2>
            <div className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-400">Inactive</span>
                </div>
              )}
            </div>
          </div>
          
          {!session ? (
            <button
              onClick={startSession}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Start Consciousness Session
            </button>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Session ID</h3>
                <p className="text-gray-300 font-mono text-sm">{session.id}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">State</h3>
                <p className={`font-medium ${getStateColor(currentState?.context.userState || 'idle')}`}>
                  {currentState?.context.userState || 'idle'}
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Analyses</h3>
                <p className="text-gray-300">{session.analysisHistory.length}</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Analysis */}
        {session && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Input Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Content Analysis</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enter content for consciousness analysis
                  </label>
                  <textarea
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    placeholder="Enter text to analyze through the consciousness framework..."
                    className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={analyzeContent}
                  disabled={!contentInput.trim() || isAnalyzing}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
                </button>
              </div>
            </div>

            {/* Current State Display */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Current Consciousness State</h3>
              {currentState && (
                <div className="space-y-4">
                  {/* Resonance Vector */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Resonance Vector</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Clarity:</span>
                        <span className="text-blue-400">{(currentState.resonanceVector.x * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Coherence:</span>
                        <span className="text-green-400">{(currentState.resonanceVector.y * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Resonance:</span>
                        <span className="text-purple-400">{(currentState.resonanceVector.z * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sovereignty:</span>
                        <span className="text-yellow-400">{(currentState.resonanceVector.w * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Orbs */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Active Orbs</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentState.activeOrbs.length > 0 ? (
                        currentState.activeOrbs.map((orb) => (
                          <span
                            key={orb}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getOrbColor(orb)} bg-gray-700/50`}
                          >
                            Orb {orb}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No active Orbs</span>
                      )}
                    </div>
                  </div>

                  {/* Field Dynamics */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Field Dynamics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Strength:</span>
                        <span className="text-white">{(currentState.fieldDynamics.fieldStrength * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stability:</span>
                        <span className="text-white">{(currentState.fieldDynamics.stability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Coherence:</span>
                        <span className="text-white">{(currentState.fieldDynamics.coherence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {currentAnalysis && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-6">Analysis Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mathematical Insights */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Mathematical Insights</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resonance Score:</span>
                    <span className="text-purple-400">{currentAnalysis.mathematicalInsights.harmonicFrequency.resonanceScore.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Logic Consistency:</span>
                    <span className="text-green-400">{(currentAnalysis.mathematicalInsights.sovereignLogic.logicalConsistency * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Field Strength:</span>
                    <span className="text-blue-400">{(currentAnalysis.mathematicalInsights.fieldDynamics.strength * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* CoC Validation */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">CoC Validation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coherence Score:</span>
                    <span className="text-green-400">{(currentAnalysis.cocValidation.coherenceScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Validated Orbs:</span>
                    <span className="text-white">{currentAnalysis.cocValidation.validatedOrbs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Similarity:</span>
                    <span className="text-yellow-400">{(currentAnalysis.contentResonance.similarity * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Content Resonance */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Content Resonance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orb Associations:</span>
                    <span className="text-white">{currentAnalysis.contentResonance.orbAssociations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Field Alignment:</span>
                    <span className="text-cyan-400">{(currentAnalysis.contentResonance.fieldAlignment * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Proof Status:</span>
                    <span className={`${
                      currentAnalysis.mathematicalInsights.sovereignLogic.validity === 'proven' ? 'text-green-400' :
                      currentAnalysis.mathematicalInsights.sovereignLogic.validity === 'disproven' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {currentAnalysis.mathematicalInsights.sovereignLogic.validity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session Metrics */}
        {session && session.sessionMetrics && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
            <h3 className="text-2xl font-bold text-white mb-6">Session Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{session.sessionMetrics.totalAnalysisTime}</div>
                <div className="text-sm text-gray-400">Analyses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{(session.sessionMetrics.coherenceImprovement * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Coherence Gain</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{(session.sessionMetrics.sovereigntyGain * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Sovereignty Gain</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{session.sessionMetrics.orbActivations}</div>
                <div className="text-sm text-gray-400">Orb Activations</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
