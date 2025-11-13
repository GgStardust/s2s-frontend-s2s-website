'use client';

import { useState, useEffect } from 'react';

interface ResonanceMetrics {
  strength: number;
  clarity: number;
  coherence: number;
  pattern: number;
}

interface ResonanceVector {
  x: number;
  y: number;
  z: number;
  w: number;
}

interface ResonanceAnalysis {
  signature: {
    clarity: number;
    coherence: number;
    resonance: number;
    sovereignty: number;
  };
  mathematical?: {
    resonanceVector: ResonanceVector;
    harmonicFrequency: number;
    coherenceMatrix: number[][];
    fieldDynamics: {
      temporal: number;
      spatial: number;
      energetic: number;
      informational: number;
    };
    sovereignLogic: {
      validity: 'proven' | 'partial' | 'unproven';
      coherence: number;
      sovereignty: number;
      proof: any;
    };
  };
}

interface ResonanceValidationPanelProps {
  content?: string;
  title?: string;
  onAnalysisComplete?: (analysis: ResonanceAnalysis) => void;
}

export default function ResonanceValidationPanel({ 
  content = '', 
  title = '',
  onAnalysisComplete 
}: ResonanceValidationPanelProps) {
  const [analysis, setAnalysis] = useState<ResonanceAnalysis | null>(null);
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
      const response = await fetch('/api/resonance/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title,
          includeMathematical: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score: number) => {
    return (score * 100).toFixed(1) + '%';
  };

  const getValidityColor = (validity: string) => {
    switch (validity) {
      case 'proven': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'unproven': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-backend-primary mb-4">
          Resonance Validation Panel
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-navy"></div>
          <span className="ml-3 text-backend-secondary">Analyzing resonance...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-backend-primary mb-4">
          Resonance Validation Panel
        </h3>
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4">
          <p className="font-medium">Analysis Error</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={analyzeContent}
            className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-backend-primary mb-4">
          Resonance Validation Panel
        </h3>
        <div className="text-backend-secondary text-center py-8">
          <p>Enter content to analyze resonance patterns</p>
          <p className="text-sm mt-2">Minimum 10 characters required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-backend-primary mb-4">
        Resonance Validation Panel
      </h3>
      
      {/* Energetic Signature */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-backend-primary mb-3">Energetic Signature</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-deep-navy">
              {formatScore(analysis.signature.clarity)}
            </div>
            <div className="text-sm text-backend-secondary">Clarity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-deep-navy">
              {formatScore(analysis.signature.coherence)}
            </div>
            <div className="text-sm text-backend-secondary">Coherence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-deep-navy">
              {formatScore(analysis.signature.resonance)}
            </div>
            <div className="text-sm text-backend-secondary">Resonance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-deep-navy">
              {formatScore(analysis.signature.sovereignty)}
            </div>
            <div className="text-sm text-backend-secondary">Sovereignty</div>
          </div>
        </div>
      </div>

      {/* Mathematical Analysis */}
      {analysis.mathematical && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-backend-primary mb-3">Mathematical Analysis</h4>
          
          {/* 4D Resonance Vector */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-backend-primary mb-2">4D Resonance Vector</h5>
            <div className="bg-backend-light rounded p-3">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-mono text-deep-navy">X: {analysis.mathematical.resonanceVector.x.toFixed(3)}</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-deep-navy">Y: {analysis.mathematical.resonanceVector.y.toFixed(3)}</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-deep-navy">Z: {analysis.mathematical.resonanceVector.z.toFixed(3)}</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-deep-navy">W: {analysis.mathematical.resonanceVector.w.toFixed(3)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Harmonic Frequency */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-backend-primary mb-2">Harmonic Frequency</h5>
            <div className="bg-backend-light rounded p-3">
              <div className="text-lg font-mono text-deep-navy">
                {analysis.mathematical.harmonicFrequency.toFixed(6)} Hz
              </div>
            </div>
          </div>

          {/* Field Dynamics */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-backend-primary mb-2">Field Dynamics</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-backend-light rounded p-2 text-center">
                <div className="text-sm font-medium text-deep-navy">
                  {analysis.mathematical.fieldDynamics.temporal.toFixed(3)}
                </div>
                <div className="text-xs text-backend-secondary">Temporal</div>
              </div>
              <div className="bg-backend-light rounded p-2 text-center">
                <div className="text-sm font-medium text-deep-navy">
                  {analysis.mathematical.fieldDynamics.spatial.toFixed(3)}
                </div>
                <div className="text-xs text-backend-secondary">Spatial</div>
              </div>
              <div className="bg-backend-light rounded p-2 text-center">
                <div className="text-sm font-medium text-deep-navy">
                  {analysis.mathematical.fieldDynamics.energetic.toFixed(3)}
                </div>
                <div className="text-xs text-backend-secondary">Energetic</div>
              </div>
              <div className="bg-backend-light rounded p-2 text-center">
                <div className="text-sm font-medium text-deep-navy">
                  {analysis.mathematical.fieldDynamics.informational.toFixed(3)}
                </div>
                <div className="text-xs text-backend-secondary">Informational</div>
              </div>
            </div>
          </div>

          {/* Sovereign Logic Validation */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-backend-primary mb-2">Sovereign Logic Validation</h5>
            <div className="bg-backend-light rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-backend-primary">Validity:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getValidityColor(analysis.mathematical.sovereignLogic.validity)}`}>
                  {analysis.mathematical.sovereignLogic.validity.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-backend-secondary">Coherence: </span>
                  <span className="font-medium text-deep-navy">
                    {formatScore(analysis.mathematical.sovereignLogic.coherence)}
                  </span>
                </div>
                <div>
                  <span className="text-backend-secondary">Sovereignty: </span>
                  <span className="font-medium text-deep-navy">
                    {formatScore(analysis.mathematical.sovereignLogic.sovereignty)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-backend-default">
        <button 
          onClick={analyzeContent}
          className="px-4 py-2 bg-deep-navy text-creamy-white rounded hover:bg-[#2A2D4A] transition-colors"
        >
          Re-analyze
        </button>
        <div className="text-xs text-backend-secondary">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

