'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface CodexEntry {
  id?: string;
  title: string;
  content?: string;
  excerpt?: string;
  author?: string;
  type?: string;
  category?: string;
  codex_category?: string;
  status?: string;
  created?: string;
  modified?: string;
  orb_associations?: number[] | {
    primary_orb?: string;
    secondary_orbs?: string[];
    orb_mentions_all?: string[];
  };
  tags?: string[];
  field_function?: {
    content_purpose?: string;
    primary_mechanism?: string;
  };
  is_primary_source?: boolean;
  book_threading?: string;
  source_type?: 'orb' | 'codex';
}

export default function CodexPage() {
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [selectedOrb, setSelectedOrb] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load from static JSON file
        const response = await fetch('/codex-entries.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load codex entries: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.entries && Array.isArray(data.entries)) {
          console.log(`✅ Loaded ${data.entries.length} entries from static file`);
          setEntries(data.entries);
        } else {
          throw new Error('Invalid data format in codex-entries.json');
        }
      } catch (err: any) {
        console.error('Error loading entries:', err);
        setError(`Failed to load Codex entries: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  // Extract orb numbers from various formats
  const getOrbNumbers = (entry: CodexEntry): number[] => {
    if (Array.isArray(entry.orb_associations)) {
      return entry.orb_associations;
    }
    if (entry.orb_associations && typeof entry.orb_associations === 'object') {
      const orbs: number[] = [];
      if (entry.orb_associations.primary_orb) {
        const match = entry.orb_associations.primary_orb.match(/Orb\s+(\d+)/i);
        if (match) orbs.push(parseInt(match[1], 10));
      }
      if (Array.isArray(entry.orb_associations.secondary_orbs)) {
        entry.orb_associations.secondary_orbs.forEach((orb: string) => {
          const match = orb.match(/Orb\s+(\d+)/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (!orbs.includes(num)) orbs.push(num);
          }
        });
      }
      return orbs;
    }
    return [];
  };

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Orb filter
      if (selectedOrb !== null) {
        const orbNumbers = getOrbNumbers(entry);
        if (!orbNumbers.includes(selectedOrb)) return false;
      }

      // Category filter
      if (selectedCategory) {
        const category = entry.codex_category || entry.category || 'essay';
        if (category !== selectedCategory) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchable = [
          entry.title,
          entry.excerpt,
          entry.field_function?.content_purpose,
          entry.tags?.join(' '),
        ].filter(Boolean).join(' ').toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [entries, selectedOrb, selectedCategory, searchQuery]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    entries.forEach(entry => {
      const cat = entry.codex_category || entry.category || 'essay';
      cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [entries]);

  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-semibold mb-4 text-stone-100 leading-tight tracking-tight">
            The Codex
          </h1>
          <h2 className="text-xl lg:text-2xl font-light mb-6 text-stone-200 italic">
            The source material from which all books are compiled
          </h2>
        </div>
      </section>

      {/* What the Codex Is */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
                  The Codex
                </h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-cyan-300 text-2xl">✦</span>
                  <span className="text-sm text-cyan-300/80 italic">Source material that reveals its own structure</span>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  The Codex reveals foundational essays written over four years of research, contemplation, experience, and exploration. Each entry begins with inspiration: a thought, conversation, reflection, or article. The process moves through research, writing, and RBI analysis to identify resonance nodes.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  These essays function as the source material from which all books are compiled. They are manually tagged with metadata frontmatter and inline tagging, then analyzed through the Orb system and backbone to identify resonance patterns. This rigorous methodology produces the consciousness technology that becomes the books.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RBI: Post-Generative AI */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
                  Resonance-Based Intelligence
                </h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-cyan-300 text-2xl">✦</span>
                  <span className="text-sm text-cyan-300/80 italic">Post-Generative AI, patent pending</span>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  RBI functions as coherent intelligence: the next iteration beyond generative AI. It measures structural alignment rather than semantic similarity, validating through mathematical proofs rather than confidence scores. RBI produces deterministic verification, requires zero training, and operates as the infrastructure layer that makes AI viable at scale.
                </p>
                <p className="text-sm text-stone-400 mt-4">
                  <Link href="/rbi" className="text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2">
                    Learn more about RBI technology →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-8">
              The Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="text-cyan-300 text-2xl mb-2">1</div>
                <h3 className="text-lg font-semibold text-cyan-300">Inspiration</h3>
                <p className="text-sm text-stone-200">
                  A thought, conversation, reflection, or article initiates the process.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-cyan-300 text-2xl mb-2">2</div>
                <h3 className="text-lg font-semibold text-cyan-300">Research</h3>
                <p className="text-sm text-stone-200">
                  Deep investigation into the patterns, signals, and structures that emerge.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-cyan-300 text-2xl mb-2">3</div>
                <h3 className="text-lg font-semibold text-cyan-300">Write</h3>
                <p className="text-sm text-stone-200">
                  The essay captures the content needed to articulate the system.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-cyan-300 text-2xl mb-2">4</div>
                <h3 className="text-lg font-semibold text-cyan-300">RBI Analysis</h3>
                <p className="text-sm text-stone-200">
                  Resonance-Based Intelligence identifies patterns through the Orb system and backbone.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-cyan-400/30">
              <p className="text-base leading-relaxed text-stone-200">
                RBI analyzes resonance patterns to identify which essays align with the framework for each book. This compilation then moves through writing and editing to become the final manuscript. The Codex essays, Orb essays, backbone, and Orbs together form the paradigm: the foundation from which all books are compiled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Entries List with Filters */}
      {isLoading && (
        <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="text-center">
            <p className="text-stone-300">Loading Codex entries...</p>
          </div>
        </section>
      )}

      {error && (
        <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg border border-red-400/30">
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </section>
      )}

      {!isLoading && !error && entries.length > 0 && (
        <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
              Codex Entries
            </h2>
            <p className="text-sm text-stone-400 mb-6">
              {filteredEntries.length} of {entries.length} entries
            </p>

            {/* Filters */}
            <div className="space-y-4 mb-8">
              {/* Search */}
              <div>
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-96 px-4 py-2 bg-stone-800/50 border border-stone-600 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              {/* Orb Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedOrb(null)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedOrb === null
                      ? 'bg-cyan-400 text-stone-900'
                      : 'bg-stone-700/50 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  All Orbs
                </button>
                {Array.from({ length: 13 }, (_, i) => i + 1).map(orbNum => (
                  <button
                    key={orbNum}
                    onClick={() => setSelectedOrb(selectedOrb === orbNum ? null : orbNum)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      selectedOrb === orbNum
                        ? 'bg-cyan-400 text-stone-900'
                        : 'bg-stone-700/50 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    Orb {orbNum}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      selectedCategory === null
                        ? 'bg-cyan-400 text-stone-900'
                        : 'bg-stone-700/50 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-3 py-1 rounded text-sm capitalize transition-colors ${
                        selectedCategory === cat
                          ? 'bg-cyan-400 text-stone-900'
                          : 'bg-stone-700/50 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Entries Grid */}
          {filteredEntries.length === 0 ? (
            <div className="terminator-border">
              <div className="p-8 bg-cosmic-blue rounded-lg text-center">
                <p className="text-stone-300">No entries match your filters.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEntries.map((entry, index) => {
                const orbNumbers = getOrbNumbers(entry);
                const category = entry.codex_category || entry.category || 'essay';
                
                return (
                  <div
                    key={entry.id || index}
                    className="terminator-border"
                  >
                    <div className="p-6 bg-cosmic-blue rounded-lg h-full flex flex-col">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className="px-2 py-1 bg-cyan-400/20 text-cyan-300 rounded text-xs uppercase tracking-wide">
                          {category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold mb-3 tracking-tight text-cyan-300">
                        {entry.title || 'Untitled Entry'}
                      </h3>

                      {/* Orb Badges */}
                      {orbNumbers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {orbNumbers.slice(0, 5).map(orbNum => (
                            <span
                              key={orbNum}
                              className="px-2 py-1 bg-cyan-400/10 text-cyan-300 rounded text-xs font-medium"
                            >
                              Orb {orbNum}
                            </span>
                          ))}
                          {orbNumbers.length > 5 && (
                            <span className="px-2 py-1 text-stone-400 text-xs">
                              +{orbNumbers.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Excerpt */}
                      {entry.excerpt && (
                        <p className="text-sm text-stone-300 mb-4 leading-relaxed flex-grow">
                          {entry.excerpt}
                        </p>
                      )}

                      {/* Content Purpose (if no excerpt) */}
                      {!entry.excerpt && entry.field_function?.content_purpose && (
                        <p className="text-sm text-stone-300 mb-4 leading-relaxed flex-grow">
                          {entry.field_function.content_purpose.substring(0, 150)}
                          {entry.field_function.content_purpose.length > 150 ? '...' : ''}
                        </p>
                      )}

                      {/* Tags */}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {entry.tags.slice(0, 4).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-stone-700/50 text-stone-300 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {entry.tags.length > 4 && (
                            <span className="text-stone-400 text-xs">+{entry.tags.length - 4}</span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-auto pt-4 border-t border-cyan-400/20">
                        {entry.is_primary_source && (
                          <span className="text-xs text-cyan-400/80 italic">Primary source material</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {!isLoading && !error && entries.length === 0 && (
        <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg text-center">
              <p className="text-base text-stone-200 mb-4">
                Codex entries will appear here as they are added to the system.
              </p>
              <p className="text-sm text-stone-400 italic">
                The Codex updates continuously with new essays, often daily. The system remains alive, revealing fresh perspectives.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Connection to Books */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  From Codex to Books
                </h2>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-4">
                  The Codex essays are the foundation from which all books are compiled. Through RBI analysis, essays emerge from the content library to meet the framework identified for each book. RBI validates coherence, measures resonance, and generates mathematical proofs that ensure structural integrity.
                </p>
                <p className="text-base leading-relaxed text-stone-200 mb-4">
                  The non-fiction books compile this source material into cohesive, digestible structures. The fiction trilogy functions as direct companions, revealing another access point to the same foundational system.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  The Console functions as another interface, revealing dynamic access to the same source material through the RBI system.
                </p>
                <div className="mt-6">
                  <Button href="/books" variant="secondary">
                    Learn About the Books →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
