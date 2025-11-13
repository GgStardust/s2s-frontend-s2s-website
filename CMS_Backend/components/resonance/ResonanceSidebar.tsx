'use client';

import { useEffect, useState } from 'react';
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

interface ResonanceSidebarProps {
  contentId: string;
  title?: string;
  onClose?: () => void;
}

export default function ResonanceSidebar({ contentId, title, onClose }: ResonanceSidebarProps) {
  const [matches, setMatches] = useState<ResonanceMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contentId) return;

    async function loadResonantContent() {
      try {
        setLoading(true);
        const response = await fetch('/api/resonance/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentId, limit: 8 }),
        });

        if (response.ok) {
          const data = await response.json();
          setMatches(data.matches || []);
        }
      } catch (err) {
        console.error('Error loading resonant content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadResonantContent();
  }, [contentId]);

  if (loading) {
    return (
      <div className="w-80 bg-white border border-backend-default rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-semibold text-backend-primary mb-3">Resonant Content</h3>
        <div className="text-sm text-backend-secondary">Loading...</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="w-80 bg-white border border-backend-default rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-semibold text-backend-primary mb-3">Resonant Content</h3>
        <div className="text-sm text-backend-secondary">No resonant content found</div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border border-backend-default rounded-lg shadow-sm p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-backend-primary">
          Resonant Content ({matches.length})
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-backend-secondary hover:text-backend-primary text-xs"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {matches.map((match) => (
          <Link
            key={match.id}
            href={`/creator/library/${match.id}`}
            className="block p-3 border border-backend-default rounded hover:border-backend-hover hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-backend-primary line-clamp-2 flex-1">
                {match.title}
              </h4>
              <Badge variant="secondary" className="ml-2 text-xs">
                {Math.round(match.resonance_score * 100)}%
              </Badge>
            </div>
            
            <div className="text-xs text-backend-muted mb-2">
              {match.content_type}
            </div>

            {match.orb_associations && match.orb_associations.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {match.orb_associations.slice(0, 3).map((orb) => (
                  <span
                    key={orb}
                    className="px-1.5 py-0.5 bg-deep-gold/10 text-deep-gold text-xs rounded"
                  >
                    Orb {orb}
                  </span>
                ))}
                {match.orb_associations.length > 3 && (
                  <span className="text-xs text-backend-secondary">
                    +{match.orb_associations.length - 3}
                  </span>
                )}
              </div>
            )}

            {match.match_reasons && match.match_reasons.length > 0 && (
              <div className="text-xs text-backend-secondary mt-2">
                <div className="font-medium mb-1">Why resonant:</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {match.match_reasons.slice(0, 2).map((reason, idx) => (
                    <li key={idx} className="text-xs">{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

