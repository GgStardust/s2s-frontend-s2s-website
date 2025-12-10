'use client';

import { useState, useMemo } from 'react';
import { Essay } from '@/content/essays-data';

interface EssayGridProps {
  essays: Essay[];
}

export default function EssayGrid({ essays: essaysProp }: EssayGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrb, setSelectedOrb] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Get unique orbs for index
  const uniqueOrbs = useMemo(() => {
    const orbs = essaysProp.map(e => ({ orb: e.orb, name: e.orbName }));
    return Array.from(new Map(orbs.map(o => [o.orb, o])).values()).sort((a, b) => a.orb - b.orb);
  }, [essaysProp]);

  // Filter essays
  const filteredEssays = useMemo(() => {
    return essaysProp.filter(essay => {
      const matchesSearch = searchQuery === '' || 
        essay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        essay.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        essay.fullContent.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesOrb = selectedOrb === null || essay.orb === selectedOrb;
      
      return matchesSearch && matchesOrb;
    });
  }, [essaysProp, searchQuery, selectedOrb]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Index Panel */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="terminator-border sticky top-8">
          <div className="p-6 bg-cosmic-blue rounded-lg">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">Index</h3>
            
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search essays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-stone-800/50 border border-stone-600 rounded text-stone-200 placeholder-stone-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Orb Filter */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-cyan-300/80 mb-3">Filter by Orb</h4>
              <button
                onClick={() => setSelectedOrb(null)}
                className={`w-full text-left px-3 py-2 mb-2 rounded text-sm ${
                  selectedOrb === null
                    ? 'bg-cyan-400/20 text-cyan-300'
                    : 'bg-stone-800/50 text-stone-300 hover:bg-stone-700/50'
                }`}
              >
                All Essays
              </button>
              {uniqueOrbs.map(({ orb, name }) => (
                <button
                  key={orb}
                  onClick={() => setSelectedOrb(orb)}
                  className={`w-full text-left px-3 py-2 mb-2 rounded text-sm ${
                    selectedOrb === orb
                      ? 'bg-cyan-400/20 text-cyan-300'
                      : 'bg-stone-800/50 text-stone-300 hover:bg-stone-700/50'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Results count */}
            <div className="text-xs text-stone-400 pt-4 border-t border-stone-700">
              {filteredEssays.length} {filteredEssays.length === 1 ? 'essay' : 'essays'}
            </div>
          </div>
        </div>
      </aside>

      {/* Essay Grid */}
      <div className="flex-1">
        {filteredEssays.length === 0 ? (
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg text-center">
              <p className="text-stone-300">No essays found matching your search.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEssays.map(essay => (
              <EssayCard
                key={essay.id}
                essay={essay}
                isExpanded={expandedId === essay.id}
                onToggleExpand={() => toggleExpand(essay.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface EssayCardProps {
  essay: Essay;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function EssayCard({ essay, isExpanded, onToggleExpand }: EssayCardProps) {
  return (
    <div className="terminator-border">
      <div className="p-6 bg-cosmic-blue rounded-lg h-full flex flex-col">
        <div className="mb-3">
          <span className="px-2 py-1 bg-cyan-400/20 text-cyan-300 rounded text-xs font-medium">
            {essay.orbName}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-3 tracking-tight text-cyan-300">
          {essay.title}
        </h3>
        
        {!isExpanded ? (
          <>
            <p className="text-sm text-stone-300 mb-4 leading-relaxed line-clamp-4 flex-grow">
              {essay.excerpt}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleExpand();
              }}
              className="text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2 text-sm mt-auto cursor-pointer"
            >
              Read Full Essay →
            </button>
          </>
        ) : (
          <>
            <div className="text-sm text-stone-300 mb-4 leading-relaxed whitespace-pre-line flex-grow">
              {essay.fullContent}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleExpand();
              }}
              className="text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2 text-sm mt-auto cursor-pointer"
            >
              Show Less ↑
            </button>
          </>
        )}
      </div>
    </div>
  );
}
