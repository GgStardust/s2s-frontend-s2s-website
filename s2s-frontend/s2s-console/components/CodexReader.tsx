'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CMS_BACKEND_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL || 'http://localhost:4000';

interface CodexReaderProps {
  entryId: string;
  onClose?: () => void;
}

export default function CodexReader({ entryId, onClose }: CodexReaderProps) {
  const [entry, setEntry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Codex entry when component mounts
  useEffect(() => {
    const loadEntry = async () => {
      try {
        // Fetch Codex entry from Codex API
        const response = await fetch(`${CMS_BACKEND_URL}/api/codex/entries/${entryId}`);
        if (!response.ok) {
          throw new Error('Failed to load Codex entry');
        }
        const data = await response.json();
        // API returns { entry: {...} }
        setEntry(data.entry || data);
      } catch (err: any) {
        setError(err.message || 'Failed to load entry');
      } finally {
        setIsLoading(false);
      }
    };

    loadEntry();
  }, [entryId]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <p className="text-editorial-text/60">Loading Codex entry...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:opacity-90"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <p className="text-editorial-text/60">Codex entry not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {onClose && (
          <button
            onClick={onClose}
            className="mb-4 text-editorial-text/60 hover:text-editorial-text underline text-sm"
          >
            ← Back to Pathway
          </button>
        )}
        <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-editorial-text">
          {entry.title || 'Codex Entry'}
        </h1>
        {(entry.orb_associations || entry.console_tags) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.orb_associations?.map((orb: number) => (
              <span
                key={orb}
                className="px-3 py-1 bg-editorial-gold/20 rounded text-sm text-editorial-text"
              >
                Orb {orb}
              </span>
            ))}
            {entry.console_tags?.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded text-sm text-editorial-text/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {entry.content ? (
          typeof entry.content === 'string' ? (
            <div
              className="text-editorial-text/90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: entry.content }}
            />
          ) : (
            <pre className="text-editorial-text/90 leading-relaxed whitespace-pre-wrap">
              {JSON.stringify(entry.content, null, 2)}
            </pre>
          )
        ) : (
          <p className="text-editorial-text/60 italic">No content available for this entry.</p>
        )}
      </div>

      {/* Navigation (if multiple entries) */}
      {entry.navigation && (
        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
          {entry.navigation.previous && (
            <Link
              href={`/codex/${entry.navigation.previous.id}`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:border-editorial-gold transition-colors text-editorial-text"
            >
              ← Previous
            </Link>
          )}
          {entry.navigation.next && (
            <Link
              href={`/codex/${entry.navigation.next.id}`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:border-editorial-gold transition-colors text-editorial-text ml-auto"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

