'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/backend/Card';
import { Badge } from '@/components/backend/Badge';

interface ResonanceMatch {
  id: string;
  title: string;
  content_type: string;
  orb_associations: number[];
  tags: string[];
  resonance_score: number;
  match_reasons: string[];
}

interface ResonanceDiscoveryProps {
  contentId: string;
  title: string;
  variant?: 'inline' | 'modal' | 'tooltip';
}

export default function ResonanceDiscovery({ contentId, title, variant = 'inline' }: ResonanceDiscoveryProps) {
  const [matches, setMatches] = useState<ResonanceMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function loadResonantContent() {
    if (matches.length > 0) {
      setExpanded(!expanded);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/resonance/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, limit: 5 }),
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
        setExpanded(true);
      }
    } catch (err) {
      console.error('Error loading resonant content:', err);
    } finally {
      setLoading(false);
    }
  }

  if (variant === 'tooltip') {
    return (
      <button
        onClick={loadResonantContent}
        className="text-xs text-backend-secondary hover:text-backend-primary"
        title="Show resonant content"
      >
        Link
      </button>
    );
  }

  if (!expanded && matches.length === 0) {
    return (
      <button
        onClick={loadResonantContent}
        disabled={loading}
        className="text-xs text-backend-secondary hover:text-backend-primary inline-flex items-center gap-1"
      >
        {loading ? 'Loading...' : 'Find resonant content →'}
      </button>
    );
  }

  if (loading) {
    return <div className="text-xs text-backend-secondary">Loading resonant content...</div>;
  }

  if (matches.length === 0) {
    return null;
  }

  return (
    <Card className="mt-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-backend-primary">
          Resonant Content ({matches.length})
        </h4>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-backend-secondary hover:text-backend-primary"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {expanded && (
        <div className="space-y-2">
          {matches.map((match) => (
            <Link
              key={match.id}
              href={`/creator/library/${match.id}`}
              className="block p-2 border border-backend-default rounded hover:border-backend-hover transition-all"
            >
              <div className="flex items-start justify-between mb-1">
                <h5 className="text-xs font-medium text-backend-primary line-clamp-1 flex-1">
                  {match.title}
                </h5>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {Math.round(match.resonance_score * 100)}%
                </Badge>
              </div>
              
              {match.orb_associations && match.orb_associations.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {match.orb_associations.slice(0, 2).map((orb) => (
                    <span
                      key={orb}
                      className="px-1 py-0.5 bg-deep-gold/10 text-deep-gold text-xs rounded"
                    >
                      Orb {orb}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

