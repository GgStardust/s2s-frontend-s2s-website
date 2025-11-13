'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Zap, Brain, Target, Compass, BarChart3, PieChart } from 'lucide-react';

interface HarmonicFrequency {
  fundamental: number;
  harmonics: number[];
  resonance: number;
  stability: number;
}

interface CoherenceMatrix {
  clarity: number;
  coherence: number;
  resonance: number;
  sovereignty: number;
  coherenceRank: number;
  coherenceScore: number;
}

interface FieldDynamics {
  fieldStrength: number;
  gradient: number[];
  stability: number;
  coherence: number;
}

interface SovereignLogic {
  validity: 'proven' | 'disproven' | 'inconclusive' | 'error';
  proofSteps: string[];
  logicalConsistency: number;
}

interface MathematicalInsightsProps {
  harmonicFrequency?: HarmonicFrequency;
  coherenceMatrix?: CoherenceMatrix;
  fieldDynamics?: FieldDynamics;
  sovereignLogic?: SovereignLogic;
  className?: string;
}

export default function MathematicalInsights({
  harmonicFrequency,
  coherenceMatrix,
  fieldDynamics,
  sovereignLogic,
  className = ''
}: MathematicalInsightsProps) {
  const [activeTab, setActiveTab] = useState<'harmonic' | 'coherence' | 'field' | 'logic'>('harmonic');
  const [isAnimating, setIsAnimating] = useState(false);

  // Default data for demonstration
  const defaultHarmonicFrequency: HarmonicFrequency = {
    fundamental: 0.618,
    harmonics: [1.236, 2.0, 3.236, 5.236],
    resonance: 0.85,
    stability: 0.92
  };

  const defaultCoherenceMatrix: CoherenceMatrix = {
    clarity: 0.78,
    coherence: 0.82,
    resonance: 0.85,
    sovereignty: 0.88,
    coherenceRank: 0.83,
    coherenceScore: 0.84
  };

  const defaultFieldDynamics: FieldDynamics = {
    fieldStrength: 0.76,
    gradient: [0.2, 0.4, 0.6, 0.8],
    stability: 0.89,
    coherence: 0.87
  };

  const defaultSovereignLogic: SovereignLogic = {
    validity: 'proven',
    proofSteps: [
      'Initial coherence check: PASSED',
      'Logical consistency validation: PASSED',
      'Sovereignty verification: PASSED',
      'Mathematical proof completion: VERIFIED'
    ],
    logicalConsistency: 0.94
  };

  const harmonicData = harmonicFrequency || defaultHarmonicFrequency;
  const coherenceData = coherenceMatrix || defaultCoherenceMatrix;
  const fieldData = fieldDynamics || defaultFieldDynamics;
  const logicData = sovereignLogic || defaultSovereignLogic;

  const getValidityColor = (validity: string) => {
    switch (validity) {
      case 'proven': return 'text-green-400 bg-green-900/20';
      case 'disproven': return 'text-red-400 bg-red-900/20';
      case 'inconclusive': return 'text-yellow-400 bg-yellow-900/20';
      case 'error': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Mathematical Insights Dashboard</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              isAnimating 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isAnimating ? 'Live' : 'Static'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
        {[
          { id: 'harmonic', label: 'Harmonic Frequency', icon: Activity },
          { id: 'coherence', label: 'Coherence Matrix', icon: BarChart3 },
          { id: 'field', label: 'Field Dynamics', icon: Compass },
          { id: 'logic', label: 'Sovereign Logic', icon: Brain }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Harmonic Frequency Tab */}
      {activeTab === 'harmonic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity className="mr-2" />
                Fundamental Frequency
              </h3>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {harmonicData.fundamental.toFixed(3)}
              </div>
              <div className="text-sm text-gray-400">
                Golden ratio harmonic base
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Zap className="mr-2" />
                Resonance Score
              </h3>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {(harmonicData.resonance * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">
                Harmonic resonance strength
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Harmonic Series</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {harmonicData.harmonics.map((harmonic, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {harmonic.toFixed(3)}
                  </div>
                  <div className="text-sm text-gray-400">
                    H{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Coherence Matrix Tab */}
      {activeTab === 'coherence' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Clarity', value: coherenceData.clarity, color: 'blue' },
              { label: 'Coherence', value: coherenceData.coherence, color: 'green' },
              { label: 'Resonance', value: coherenceData.resonance, color: 'purple' },
              { label: 'Sovereignty', value: coherenceData.sovereignty, color: 'yellow' }
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-800 rounded-lg p-4 text-center">
                <div className={`text-2xl font-bold text-${color}-400 mb-1`}>
                  {(value * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Coherence Rank</h3>
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {coherenceData.coherenceRank.toFixed(3)}
              </div>
              <div className="text-sm text-gray-400">
                Matrix coherence ranking
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Overall Score</h3>
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {(coherenceData.coherenceScore * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">
                Integrated coherence score
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field Dynamics Tab */}
      {activeTab === 'field' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="mr-2" />
                Field Strength
              </h3>
              <div className="text-3xl font-bold text-red-400 mb-2">
                {fieldData.fieldStrength.toFixed(3)}
              </div>
              <div className="text-sm text-gray-400">
                Electromagnetic field intensity
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Compass className="mr-2" />
                Stability
              </h3>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {(fieldData.stability * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">
                Field stability index
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Field Gradient</h3>
            <div className="grid grid-cols-4 gap-4">
              {fieldData.gradient.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {value.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    G{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sovereign Logic Tab */}
      {activeTab === 'logic' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Brain className="mr-2" />
                Proof Status
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getValidityColor(logicData.validity)}`}>
                {logicData.validity.toUpperCase()}
              </span>
            </div>
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {(logicData.logicalConsistency * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">
              Logical consistency score
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Proof Steps</h3>
            <div className="space-y-3">
              {logicData.proofSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="text-sm text-gray-300">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Mathematical Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(harmonicData.resonance)}`}>
              {(harmonicData.resonance * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">Resonance</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(coherenceData.coherenceScore)}`}>
              {(coherenceData.coherenceScore * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">Coherence</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(fieldData.stability)}`}>
              {(fieldData.stability * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">Stability</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(logicData.logicalConsistency)}`}>
              {(logicData.logicalConsistency * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">Logic</div>
          </div>
        </div>
      </div>
    </div>
  );
}
