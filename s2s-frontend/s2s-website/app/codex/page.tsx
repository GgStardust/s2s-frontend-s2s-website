'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CMS_BACKEND_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL || 'http://localhost:4000';

interface CodexEntry {
  id: string;
  title: string;
  codex_category?: string;
  orb_associations?: number[];
  practice_associations?: number[];
  console_tags?: string[];
  content?: string;
  created_at?: string;
}

export default function CodexPage() {
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await fetch(`${CMS_BACKEND_URL}/api/codex/entries?limit=50`);
        if (!response.ok) {
          throw new Error('Failed to load Codex entries');
        }
        const data = await response.json();
        setEntries(data.entries || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load entries');
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto py-20 px-6">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black tracking-tight">The Codex</h1>
          <h2 className="text-xl md:text-2xl font-light mb-6 text-neutral-700 italic">
            The structural archive of Stardust to Sovereignty.
          </h2>
      </div>
      </section>

      {/* Active Codex Explanation */}
      <section className="max-w-4xl mx-auto py-16 lg:py-24 border-t border-neutral-200/20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-black">
              The Archive
            </h2>
          </div>
          <div className="lg:col-span-3">
            <p className="text-base leading-relaxed text-neutral-700 mb-4">
              The Codex is the refined layer beneath the Console.
              It contains curated entries that map to Orbs, Practices,
              diagnostic indices, and paradigm elements.
              Every module the Console shows you originates here.
        </p>
            <p className="text-base leading-relaxed text-neutral-700">
              This page will dynamically render Codex entries
              as they are ingested and tagged in the backend.
        </p>
      </div>
        </div>
      </section>

      {/* Entries List */}
      {isLoading && (
        <section className="max-w-4xl mx-auto py-16 lg:py-24 border-t border-cyan-500/20 px-6 bg-cyan-500/3">
          <div className="text-center">
            <p className="text-neutral-500">Loading Codex entries...</p>
          </div>
        </section>
      )}

      {error && (
        <section className="max-w-4xl mx-auto py-16 lg:py-24 border-t border-cyan-500/20 px-6 bg-cyan-500/3">
          <div className="border border-red-200 rounded-lg p-8 bg-red-50">
            <p className="text-red-700">{error}</p>
          </div>
        </section>
      )}

      {!isLoading && !error && entries.length === 0 && (
        <section className="max-w-4xl mx-auto py-16 lg:py-24 border-t border-cyan-500/20 px-6 bg-cyan-500/3">
          <div className="border border-neutral-200 rounded-lg p-8 bg-white shadow-sm text-center">
            <p className="text-base text-neutral-600 italic">
              No Codex entries are available yet. Entries will appear here as they are added to the system.
            </p>
          </div>
        </section>
      )}

      {!isLoading && !error && entries.length > 0 && (
        <section className="max-w-4xl mx-auto py-16 lg:py-24 border-t border-cyan-500/20 px-6 bg-cyan-500/3">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-black">
              Codex Entries
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="border border-neutral-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3 text-black tracking-tight">
                  {entry.title || 'Untitled Entry'}
                </h3>
                {(entry.orb_associations || entry.practice_associations || entry.console_tags) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {entry.orb_associations?.map((orb) => (
                      <span
                        key={orb}
                        className="px-3 py-1 bg-warm-accent/10 text-warm-accent rounded text-xs font-medium"
                      >
                        Orb {orb}
                      </span>
                    ))}
                    {entry.practice_associations?.map((practice) => (
                      <span
                        key={practice}
                        className="px-3 py-1 bg-warm-accent/10 text-warm-accent rounded text-xs font-medium"
                      >
                        Practice {practice}
                      </span>
                    ))}
                    {entry.console_tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {entry.codex_category && (
                  <p className="text-xs text-warm-accent uppercase tracking-wide mb-2">
                    {entry.codex_category}
                  </p>
                )}
                {entry.content && (
                  <div
                    className="text-sm text-neutral-600 leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof entry.content === 'string'
                          ? entry.content.substring(0, 200) + '...'
                          : '',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
