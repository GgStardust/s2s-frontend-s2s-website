'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EmbeddingsPage() {
  const [initializing, setInitializing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleInitialize() {
    if (!confirm('Initialize embeddings for all 75 files?\n\nThis will:\n- Cost ~$1-2 in OpenAI credits\n- Take 10-15 minutes\n- Only needs to be done once\n\nProceed?')) {
      return;
    }

    setInitializing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/embeddings/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'yes-embed-all-files' }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to initialize embeddings');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize embeddings');
    } finally {
      setInitializing(false);
    }
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-deep-gold hover:text-creamy-white mb-4 inline-block text-base"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-creamy-white mb-4">
          Embeddings Initialization
        </h1>
        <p className="text-creamy-white/60 text-lg mb-8">
          One-time setup to enable semantic search and internal research
        </p>

        <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-8 border border-cosmic-blue/30 mb-6">
          <h2 className="text-2xl font-bold text-creamy-white mb-4">
            What This Does:
          </h2>
          <ul className="text-creamy-white/80 text-base space-y-2 mb-6">
            <li>✓ Processes all 75 content files</li>
            <li>✓ Generates vector embeddings (1536 dimensions)</li>
            <li>✓ Stores in Supabase for semantic search</li>
            <li>✓ Enables Orbital internal research</li>
            <li>✓ Powers &quot;find similar content&quot; features</li>
          </ul>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-500 font-semibold mb-2">Important:</h3>
            <ul className="text-creamy-white/70 text-sm space-y-1">
              <li>• Cost: ~$1-2 in OpenAI credits (one-time)</li>
              <li>• Time: 10-15 minutes to complete</li>
              <li>• Only needs to be done once</li>
              <li>• New files can be embedded individually later</li>
            </ul>
          </div>

          <button
            onClick={handleInitialize}
            disabled={initializing || result !== null}
            className="w-full px-8 py-4 bg-cosmic-blue text-white rounded-lg font-bold text-lg hover:bg-cosmic-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initializing
              ? 'Initializing... (10-15 minutes)'
              : result
              ? 'Embeddings Initialized ✓'
              : 'Initialize Embeddings'}
          </button>
        </div>

        {/* Progress/Result Display */}
        {initializing && (
          <div className="bg-cosmic-blue/10 backdrop-blur-sm rounded-2xl p-6 border border-cosmic-blue/30">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosmic-blue"></div>
              <div>
                <h3 className="text-xl font-bold text-cosmic-blue mb-2">
                  Processing...
                </h3>
                <p className="text-creamy-white/60 text-base">
                  This will take 10-15 minutes. You can close this page and come back.
                </p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              ✓ Embeddings Initialized Successfully!
            </h3>
            <div className="text-creamy-white/80 text-base space-y-2">
              <p>Total files: {result.results.total}</p>
              <p>Successfully embedded: {result.results.success}</p>
              <p>Failed: {result.results.failed}</p>
            </div>
            <div className="mt-6">
              <Link
                href="/creator/orbital"
                className="inline-block px-6 py-3 bg-cosmic-blue text-white rounded-lg font-bold hover:bg-cosmic-blue/80 transition-colors"
              >
                → Try Orbital Now
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
            <h3 className="text-xl font-bold text-red-400 mb-2">Error</h3>
            <p className="text-creamy-white/80 text-base">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
