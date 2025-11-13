'use client';

import { useState, useEffect } from 'react';

interface OrbitalContext {
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

interface OrbMappingVisualizationProps {
  content?: string;
  title?: string;
  onMappingComplete?: (context: OrbitalContext) => void;
}

const ORB_DESCRIPTIONS = {
  1: { name: 'Origin Intelligence', color: 'bg-purple-100 text-purple-800', description: 'Photonic blueprinting meets biological activation' },
  2: { name: 'Resonance Mechanics', color: 'bg-blue-100 text-blue-800', description: 'Frequency becomes form' },
  3: { name: 'Photonic Intelligence', color: 'bg-indigo-100 text-indigo-800', description: 'Light mirrors awareness' },
  4: { name: 'Harmonic Architectures', color: 'bg-green-100 text-green-800', description: 'Geometry stabilizes coherence' },
  5: { name: 'Temporal Sovereignty', color: 'bg-yellow-100 text-yellow-800', description: 'Spiral time and agency' },
  6: { name: 'Starline Memory', color: 'bg-pink-100 text-pink-800', description: 'Galactic/ancestral recall as signal' },
  7: { name: 'Alchemical Current', color: 'bg-orange-100 text-orange-800', description: 'Density to light through compression' },
  8: { name: 'Quantum Intuition', color: 'bg-teal-100 text-teal-800', description: 'Nonlinear directional knowing' },
  9: { name: 'Temporal Fluidity', color: 'bg-cyan-100 text-cyan-800', description: 'Attunement across timelines' },
  10: { name: 'Ancestral Repatterning', color: 'bg-red-100 text-red-800', description: 'Lineage transformation' },
  11: { name: 'Radiant Transparency', color: 'bg-lime-100 text-lime-800', description: 'Luminous truth expression' },
  12: { name: 'Sovereign Field', color: 'bg-emerald-100 text-emerald-800', description: 'Structural indivisibility' },
  13: { name: 'Bridging Intelligence', color: 'bg-violet-100 text-violet-800', description: 'Human ↔ nonhuman communication' }
};

const UNDERCURRENT_DESCRIPTIONS = {
  1: { name: 'Body as Energetic Technology', color: 'bg-slate-100 text-slate-800' },
  2: { name: 'Vibration & Frequency in Reality Creation', color: 'bg-gray-100 text-gray-800' },
  3: { name: 'Interconnection Through Light & Energy', color: 'bg-zinc-100 text-zinc-800' },
  4: { name: 'Higher Intelligence & Consciousness Evolution', color: 'bg-neutral-100 text-neutral-800' },
  5: { name: 'Sovereignty as Gateway to Liberation', color: 'bg-stone-100 text-stone-800' },
  6: { name: 'Collective Awakening', color: 'bg-red-100 text-red-800' },
  7: { name: 'Resting & Action Potential', color: 'bg-orange-100 text-orange-800' },
  8: { name: 'Intuition & Knowing', color: 'bg-amber-100 text-amber-800' },
  9: { name: 'Time as Nonlinear', color: 'bg-yellow-100 text-yellow-800' },
  10: { name: 'Energy Imprints & Ancestral Memory', color: 'bg-lime-100 text-lime-800' },
  11: { name: 'Sacred Patterns & Geometry', color: 'bg-green-100 text-green-800' },
  12: { name: 'Free Will vs Universal Flow', color: 'bg-emerald-100 text-emerald-800' }
};

export default function OrbMappingVisualization({ 
  content = '', 
  title = '',
  onMappingComplete 
}: OrbMappingVisualizationProps) {
  const [context, setContext] = useState<OrbitalContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (content && content.length > 10) {
      analyzeContent();
    }
  }, [content, title]);

  const analyzeContent = async () => {
    if (!content || content.length < 10) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/test/orbital-context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title,
          useLocal: false,
          testMode: 'normal'
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      setContext(data.result);
      
      if (onMappingComplete) {
        onMappingComplete(data.result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score: number) => {
    return (score * 10).toFixed(1);
  };

  if (loading) {
    return (
      <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-backend-primary mb-4">
          Orb Mapping Visualization
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-navy"></div>
          <span className="ml-3 text-backend-secondary">Mapping Orbs and Undercurrents...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-backend-primary mb-4">
          Orb Mapping Visualization
        </h3>
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4">
          <p className="font-medium">Mapping Error</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={analyzeContent}
            className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry Mapping
          </button>
        </div>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-backend-primary mb-4">
          Orb Mapping Visualization
        </h3>
        <div className="text-backend-secondary text-center py-8">
          <p>Enter content to map Orb associations</p>
          <p className="text-sm mt-2">Minimum 10 characters required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-backend-primary mb-4">
        Orb Mapping Visualization
      </h3>
      
      {/* Orb Associations */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-backend-primary mb-3">
          Orb Associations ({context.orbAssociations.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {context.orbAssociations.map((orbId) => {
            const orb = ORB_DESCRIPTIONS[orbId as keyof typeof ORB_DESCRIPTIONS];
            if (!orb) return null;
            
            return (
              <div key={orbId} className={`rounded-lg p-3 ${orb.color}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">Orb {orbId}</span>
                  <span className="text-xs opacity-75">Active</span>
                </div>
                <div className="font-semibold text-sm mb-1">{orb.name}</div>
                <div className="text-xs opacity-75">{orb.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Undercurrent Links */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-backend-primary mb-3">
          Undercurrent Links ({context.undercurrentLinks.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {context.undercurrentLinks.map((undercurrentId) => {
            const undercurrent = UNDERCURRENT_DESCRIPTIONS[undercurrentId as keyof typeof UNDERCURRENT_DESCRIPTIONS];
            if (!undercurrent) return null;
            
            return (
              <div key={undercurrentId} className={`rounded p-2 ${undercurrent.color}`}>
                <div className="text-sm font-medium">{undercurrent.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resonance Metrics */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-backend-primary mb-3">Resonance Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-deep-navy">
              {formatScore(context.resonanceMetrics.strength)}
            </div>
            <div className="text-sm text-backend-secondary">Strength</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-deep-navy">
              {formatScore(context.resonanceMetrics.clarity)}
            </div>
            <div className="text-sm text-backend-secondary">Clarity</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-deep-navy">
              {formatScore(context.resonanceMetrics.coherence)}
            </div>
            <div className="text-sm text-backend-secondary">Coherence</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-deep-navy">
              {formatScore(context.resonanceMetrics.pattern)}
            </div>
            <div className="text-sm text-backend-secondary">Pattern</div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {context.tags.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-backend-primary mb-3">
            Canonical Tags ({context.tags.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {context.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-backend-light text-backend-primary rounded text-xs font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Scrollstreams */}
      {context.scrollstreams.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-backend-primary mb-3">
            Scrollstreams ({context.scrollstreams.length})
          </h4>
          <div className="space-y-2">
            {context.scrollstreams.map((scrollstream, index) => (
              <div key={index} className="bg-backend-light rounded p-3">
                <div className="text-sm text-backend-primary">{scrollstream}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Codex Path */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-backend-primary mb-3">Codex Integration</h4>
        <div className="bg-backend-light rounded p-3">
          <div className="text-sm text-backend-secondary mb-1">Codex Path:</div>
          <div className="font-mono text-sm text-deep-navy">{context.codexPath}</div>
          <div className="text-sm text-backend-secondary mt-2 mb-1">Dashboard Component:</div>
          <div className="font-mono text-sm text-deep-navy">{context.dashboardComponent}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-backend-default">
        <button 
          onClick={analyzeContent}
          className="px-4 py-2 bg-deep-navy text-creamy-white rounded hover:bg-[#2A2D4A] transition-colors"
        >
          Re-map
        </button>
        <div className="text-xs text-backend-secondary">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

