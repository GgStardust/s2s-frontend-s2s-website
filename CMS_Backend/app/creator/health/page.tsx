'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HealthDashboardPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  async function runHealthCheck() {
    setAnalyzing(true);

    try {
      const response = await fetch('/api/health-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      }
    } catch (err) {
      console.error('Error running health check:', err);
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-deep-gold hover:text-creamy-white mb-4 inline-block text-base"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-creamy-white mb-4">
            Content Health Dashboard
          </h1>
          <p className="text-creamy-white/60 text-lg mb-6">
            Orbital-powered analysis of your codex coverage, gaps, and opportunities
          </p>

          <button
            onClick={runHealthCheck}
            disabled={analyzing}
            className="px-8 py-4 bg-cosmic-blue text-white rounded-lg font-bold text-lg hover:bg-cosmic-blue/80 transition-colors disabled:opacity-50"
          >
            {analyzing ? 'Analyzing Codex...' : 'Run Health Check'}
          </button>
        </div>

        {results && (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-deep-navy/60 backdrop-blur-sm rounded-xl p-6 border border-cosmic-blue/30">
                <div className="text-3xl font-bold text-cosmic-blue mb-2">
                  {results.metrics.totalFiles}
                </div>
                <div className="text-creamy-white/60 text-sm">Total Files</div>
              </div>

              <div className="bg-deep-navy/60 backdrop-blur-sm rounded-xl p-6 border border-deep-gold/30">
                <div className="text-3xl font-bold text-deep-gold mb-2">
                  {results.metrics.scrollstreamCount}
                </div>
                <div className="text-creamy-white/60 text-sm">Scrollstreams</div>
              </div>

              <div className="bg-deep-navy/60 backdrop-blur-sm rounded-xl p-6 border border-electric-green/30">
                <div className="text-3xl font-bold text-electric-green mb-2">
                  {results.metrics.totalTags}
                </div>
                <div className="text-creamy-white/60 text-sm">Unique Tags</div>
              </div>

              <div className="bg-deep-navy/60 backdrop-blur-sm rounded-xl p-6 border border-orb-7/30">
                <div className="text-3xl font-bold text-orb-7 mb-2">
                  {results.metrics.avgWordsPerFile?.toLocaleString() || '0'}
                </div>
                <div className="text-creamy-white/60 text-sm">Avg Words/File</div>
                {results.metrics.totalWordCount && (
                  <div className="text-creamy-white/40 text-xs mt-1">
                    {results.metrics.totalWordCount.toLocaleString()} total words
                  </div>
                )}
              </div>
            </div>

            {/* Orb Distribution */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-cosmic-blue/30">
              <h2 className="text-2xl font-bold text-creamy-white mb-4">
                Orb Distribution
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {Object.entries(results.metrics.byOrb).map(([orb, count]: [string, any]) => (
                  <div key={orb} className="text-center">
                    <div className="text-2xl font-bold text-cosmic-blue mb-1">
                      {count}
                    </div>
                    <div className="text-creamy-white/60 text-sm">{orb}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Types */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <h2 className="text-2xl font-bold text-creamy-white mb-4">
                Content Types
              </h2>
              <div className="space-y-3">
                {Object.entries(results.metrics.byType).map(([type, count]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-creamy-white text-base">{type}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-48 h-2 bg-deep-navy rounded-full overflow-hidden">
                        <div
                          className="h-full bg-deep-gold"
                          style={{ width: `${(count / results.metrics.totalFiles) * 100}%` }}
                        />
                      </div>
                      <span className="text-deep-gold font-semibold text-base w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orbital Analysis */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-8 border border-electric-green/30">
              <h2 className="text-2xl font-bold text-electric-green mb-6">
                Orbital Analysis & Recommendations
              </h2>
              <div
                className="prose prose-invert max-w-none text-creamy-white/80 text-base"
                dangerouslySetInnerHTML={{
                  __html: results.aiAnalysis.replace(/\n/g, '<br/>'),
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
