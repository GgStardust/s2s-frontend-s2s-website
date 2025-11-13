'use client';

import { useState, useEffect } from 'react';

interface CodexEntry {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  contentType: string;
  orbAssociations: number[];
  tags: string[];
  resonanceVector: { x: number; y: number; z: number; w: number };
  proofStatus: string;
}

export default function ExplorePage() {
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/public_prototype/api/codex/search?limit=10');
      const data = await response.json();
      if (data.success) {
        setEntries(data.results);
      }
    } catch (error) {
      console.error('Error fetching codex entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      fetchEntries();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/public_prototype/api/codex/search?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      if (data.success) {
        setEntries(data.results);
      }
    } catch (error) {
      console.error('Error searching codex:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
      <h2 className="text-2xl font-bold text-creamy-white mb-4">Content Exploration</h2>
      <p className="text-creamy-white/60 text-sm mb-4">
        Explore selected excerpts from the Codex and book drafts by Orb and resonance
      </p>
      
      {/* Search Interface */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search consciousness, resonance, orbs..."
            className="flex-1 px-3 py-2 bg-deep-navy border border-deep-gold/30 rounded text-creamy-white text-sm focus:outline-none focus:border-deep-gold"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-deep-gold text-deep-navy rounded font-semibold hover:bg-creamy-white transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-creamy-white/60">Loading codex entries...</div>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-deep-navy/40 border border-deep-gold/20 rounded-lg p-4 hover:border-deep-gold/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-creamy-white font-semibold text-sm">{entry.title}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  entry.proofStatus === 'proven' ? 'bg-green-600 text-white' :
                  entry.proofStatus === 'disproven' ? 'bg-red-600 text-white' :
                  entry.proofStatus === 'inconclusive' ? 'bg-yellow-600 text-deep-navy' :
                  'bg-gray-600 text-white'
                }`}>
                  {entry.proofStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-creamy-white/80 text-sm mb-3">{entry.excerpt}</p>
              <div className="flex items-center space-x-4 text-xs">
                <div>
                  <span className="text-creamy-white/60">Source:</span>
                  <span className="text-deep-gold ml-1">{entry.source}</span>
                </div>
                <div>
                  <span className="text-creamy-white/60">Resonance:</span>
                  <span className="text-deep-gold ml-1">
                    {Math.sqrt(entry.resonanceVector.x**2 + entry.resonanceVector.y**2 + entry.resonanceVector.z**2 + entry.resonanceVector.w**2).toFixed(3)}
                  </span>
                </div>
                {entry.orbAssociations.length > 0 && (
                  <div>
                    <span className="text-creamy-white/60">Orbs:</span>
                    <span className="text-deep-gold ml-1">{entry.orbAssociations.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
