'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Essay } from '@/content/essays-data';

interface EssayGridProps {
  essays: Essay[];
}

export default function EssayGrid({ essays: essaysProp }: EssayGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrb, setSelectedOrb] = useState<number | null>(null);

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


  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Index Panel */}
      <aside className="lg:w-72 flex-shrink-0">
        <div className="terminator-border sticky top-8">
          <div className="p-5 bg-cosmic-blue rounded-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">Index</h3>
            
            {/* Search */}
            <div className="mb-5">
              <input
                type="text"
                placeholder="Search essays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-stone-800/50 border border-stone-600 rounded text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Orb Filter */}
            <div className="mb-5">
              <h4 className="text-sm font-medium text-cyan-300/80 mb-2">Filter by Orb</h4>
              <button
                onClick={() => setSelectedOrb(null)}
                className={`w-full text-left px-2 py-1.5 mb-1.5 rounded text-xs ${
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
                  className={`w-full text-left px-2 py-1.5 mb-1.5 rounded text-xs ${
                    selectedOrb === orb
                      ? 'bg-cyan-400/20 text-cyan-300'
                      : 'bg-stone-800/50 text-stone-300 hover:bg-stone-700/50'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Essay List */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-cyan-300/80 mb-2">All Essays</h4>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {essaysProp.map(essay => {
                  const isVisible = filteredEssays.some(e => e.id === essay.id);
                  return (
                    <Link
                      key={essay.id}
                      href={`/codex/${essay.id}`}
                      className={`block px-2 py-1.5 rounded text-xs hover:bg-stone-700/50 transition-colors ${
                        isVisible 
                          ? 'text-stone-200' 
                          : 'text-stone-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-cyan-400/20 text-cyan-300 rounded text-[10px] font-medium flex-shrink-0">
                          {essay.orbName.replace('Orb ', '').replace(': ', ' ')}
                        </span>
                        <span className="truncate">{essay.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Results count */}
            <div className="text-xs text-stone-400 pt-3 border-t border-stone-700">
              {filteredEssays.length} {filteredEssays.length === 1 ? 'essay' : 'essays'} shown
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEssays.map(essay => (
              <EssayCard
                key={essay.id}
                essay={essay}
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
}

function EssayCard({ essay }: EssayCardProps) {
  return (
    <div className="terminator-border">
      <div className="p-4 bg-cosmic-blue rounded-lg h-full flex flex-col">
        <h3 className="text-lg font-semibold mb-3 tracking-tight text-cyan-300 line-clamp-2">
          {essay.title}
        </h3>
        
        <p className="text-sm text-stone-300 mb-3 leading-relaxed line-clamp-3 flex-grow">
          {essay.excerpt}
        </p>
        
        <Link
          href={`/codex/${essay.id}`}
          className="text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2 text-xs mt-auto inline-block"
        >
          Read Full Essay →
        </Link>
      </div>
    </div>
  );
}
