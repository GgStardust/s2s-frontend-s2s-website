'use client';

import { useState, useEffect } from 'react';
import SimpleResonanceVector from '@/components/SimpleResonanceVector';
import MathematicalInsights from '@/components/MathematicalInsights';

export default function VisualizationPage() {
  const [resonanceVector, setResonanceVector] = useState({
    x: 0.75, // Clarity
    y: 0.82, // Coherence
    z: 0.88, // Resonance
    w: 0.91  // Sovereignty
  });

  const [comparisonVector, setComparisonVector] = useState({
    x: 0.68,
    y: 0.74,
    z: 0.79,
    w: 0.85
  });

  const [isRealTime, setIsRealTime] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setResonanceVector(prev => ({
          x: Math.max(0, Math.min(1, prev.x + (Math.random() - 0.5) * 0.1)),
          y: Math.max(0, Math.min(1, prev.y + (Math.random() - 0.5) * 0.1)),
          z: Math.max(0, Math.min(1, prev.z + (Math.random() - 0.5) * 0.1)),
          w: Math.max(0, Math.min(1, prev.w + (Math.random() - 0.5) * 0.1))
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            4D Resonance Visualization
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Interactive mathematical visualization of consciousness resonance patterns and field dynamics
          </p>
          
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isRealTime 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {isRealTime ? 'Stop Real-time' : 'Start Real-time'}
            </button>
            
            <div className="text-sm text-gray-400">
              {isRealTime ? 'Live updates enabled' : 'Static visualization'}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resonance Vector Visualization */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <SimpleResonanceVector
              vector={resonanceVector}
              comparisonVector={comparisonVector}
              realTime={isRealTime}
              showTrajectory={true}
              onVectorUpdate={(vector) => {
                console.log('Vector updated:', vector);
              }}
            />
          </div>

          {/* Mathematical Insights Dashboard */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            <MathematicalInsights
              harmonicFrequency={{
                fundamental: 0.618,
                harmonics: [1.236, 2.0, 3.236, 5.236],
                resonance: Math.sqrt(resonanceVector.x**2 + resonanceVector.y**2 + resonanceVector.z**2 + resonanceVector.w**2),
                stability: 0.92
              }}
              coherenceMatrix={{
                clarity: resonanceVector.x,
                coherence: resonanceVector.y,
                resonance: resonanceVector.z,
                sovereignty: resonanceVector.w,
                coherenceRank: (resonanceVector.x + resonanceVector.y + resonanceVector.z + resonanceVector.w) / 4,
                coherenceScore: (resonanceVector.x + resonanceVector.y + resonanceVector.z + resonanceVector.w) / 4
              }}
              fieldDynamics={{
                fieldStrength: Math.sqrt(resonanceVector.x**2 + resonanceVector.y**2),
                gradient: [resonanceVector.x, resonanceVector.y, resonanceVector.z, resonanceVector.w],
                stability: 0.89,
                coherence: (resonanceVector.x + resonanceVector.y + resonanceVector.z + resonanceVector.w) / 4
              }}
              sovereignLogic={{
                validity: 'proven' as const,
                proofSteps: [
                  'Initial coherence check: PASSED',
                  'Logical consistency validation: PASSED',
                  'Sovereignty verification: PASSED',
                  'Mathematical proof completion: VERIFIED'
                ],
                logicalConsistency: 0.94
              }}
            />
          </div>
        </div>

        {/* Vector Controls */}
        <div className="mt-8 bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
          <h3 className="text-lg font-semibold text-white mb-4">Vector Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Clarity (X)', value: resonanceVector.x, onChange: (val: number) => setResonanceVector(prev => ({ ...prev, x: val })) },
              { label: 'Coherence (Y)', value: resonanceVector.y, onChange: (val: number) => setResonanceVector(prev => ({ ...prev, y: val })) },
              { label: 'Resonance (Z)', value: resonanceVector.z, onChange: (val: number) => setResonanceVector(prev => ({ ...prev, z: val })) },
              { label: 'Sovereignty (W)', value: resonanceVector.w, onChange: (val: number) => setResonanceVector(prev => ({ ...prev, w: val })) }
            ].map(({ label, value, onChange }) => (
              <div key={label} className="space-y-2">
                <label className="text-sm text-gray-400">{label}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={value}
                  onChange={(e) => onChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  disabled={isRealTime}
                />
                <div className="text-sm text-white font-mono">{value.toFixed(3)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
