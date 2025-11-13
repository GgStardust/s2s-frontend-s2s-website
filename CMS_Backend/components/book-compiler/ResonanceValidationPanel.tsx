'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/backend';

interface ResonanceMetrics {
  strength: number;
  clarity: number;
  coherence: number;
  pattern: number;
}

interface ResonanceData {
  chapter_id: string;
  chapter_title: string;
  resonance_score: number;
  resonance_metrics: ResonanceMetrics;
  orb_associations: number[];
  sources_analyzed: number;
  selected_sources: number;
}

interface ResonanceValidationPanelProps {
  chapterId: string;
  onResonanceUpdate?: (data: ResonanceData) => void;
}

export default function ResonanceValidationPanel({ 
  chapterId, 
  onResonanceUpdate 
}: ResonanceValidationPanelProps) {
  const [resonanceData, setResonanceData] = useState<ResonanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeResonance = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/resonance-source-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chapter_id: chapterId,
          max_sources: 3
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const resonanceData: ResonanceData = {
          chapter_id: data.chapter_id,
          chapter_title: data.chapter_title,
          resonance_score: data.selected_sources[0]?.resonance_score || 0,
          resonance_metrics: data.selected_sources[0]?.resonance_metrics || {
            strength: 0,
            clarity: 0,
            coherence: 0,
            pattern: 0
          },
          orb_associations: data.selected_sources[0]?.orb_associations || [],
          sources_analyzed: data.total_analyzed,
          selected_sources: data.selected_sources.length
        };
        
        setResonanceData(resonanceData);
        onResonanceUpdate?.(resonanceData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to analyze resonance');
      }
    } catch (err) {
      console.error('Error analyzing resonance:', err);
      setError('Failed to analyze resonance');
    } finally {
      setLoading(false);
    }
  };

  const getResonanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResonanceLabel = (score: number) => {
    if (score >= 0.8) return 'High Resonance';
    if (score >= 0.6) return 'Medium Resonance';
    return 'Low Resonance';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-backend-primary">
          Resonance Validation
        </h3>
        <button
          onClick={analyzeResonance}
          disabled={loading}
          className="px-4 py-2 bg-backend-accent text-white rounded-md hover:bg-backend-accent-dark disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Resonance'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {resonanceData && (
        <div className="space-y-4">
          {/* Overall Resonance Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-backend-primary">
              Overall Resonance Score (R_ij):
            </span>
            <span className={`text-lg font-bold ${getResonanceColor(resonanceData.resonance_score)}`}>
              {resonanceData.resonance_score.toFixed(3)}
            </span>
          </div>

          <div className="text-center">
            <span className={`text-sm font-medium ${getResonanceColor(resonanceData.resonance_score)}`}>
              {getResonanceLabel(resonanceData.resonance_score)}
            </span>
          </div>

          {/* 4D Resonance Vector */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-backend-primary">
                {resonanceData.resonance_metrics.strength.toFixed(1)}
              </div>
              <div className="text-xs text-backend-secondary">Strength</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-backend-primary">
                {resonanceData.resonance_metrics.clarity.toFixed(1)}
              </div>
              <div className="text-xs text-backend-secondary">Clarity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-backend-primary">
                {resonanceData.resonance_metrics.coherence.toFixed(1)}
              </div>
              <div className="text-xs text-backend-secondary">Coherence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-backend-primary">
                {resonanceData.resonance_metrics.pattern.toFixed(1)}
              </div>
              <div className="text-xs text-backend-secondary">Pattern</div>
            </div>
          </div>

          {/* Orb Associations */}
          {resonanceData.orb_associations.length > 0 && (
            <div>
              <div className="text-sm font-medium text-backend-primary mb-2">
                Orb Associations:
              </div>
              <div className="flex flex-wrap gap-2">
                {resonanceData.orb_associations.map((orb) => (
                  <span
                    key={orb}
                    className="px-2 py-1 bg-backend-accent text-white text-xs rounded-md"
                  >
                    Orb {orb}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Summary */}
          <div className="text-xs text-backend-secondary">
            Analyzed {resonanceData.sources_analyzed} sources, selected {resonanceData.selected_sources} highest resonance matches
          </div>
        </div>
      )}

      {!resonanceData && !loading && !error && (
          <div className="text-center text-backend-secondary">
            <p className="text-sm">Click &quot;Analyze Resonance&quot; to validate chapter coherence</p>
          </div>
      )}
    </Card>
  );
}
