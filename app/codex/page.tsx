'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const CMS_BACKEND_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL || 'http://localhost:4000';

interface CodexEntry {
  id?: string;
  title: string;
  content?: string;
  author?: string;
  type?: string;
  category?: string;
  status?: string;
  created?: string;
  modified?: string;
  orb_associations?: {
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
}

export default function CodexPage() {
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        // Try to fetch from CMS backend API
        const response = await fetch(`${CMS_BACKEND_URL}/api/content-files?type=s2s_codex&limit=50`);
        if (!response.ok) {
          // If API fails, that's okay for MVP - we'll show the structure
          console.log('CMS backend not available, showing structure only');
          setEntries([]);
        } else {
          const data = await response.json();
          setEntries(data.files || data.entries || []);
        }
      } catch (err: any) {
        // For MVP, if backend isn't ready, we show the page structure
        console.log('Backend connection not available:', err.message);
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  const formatOrbName = (orb: string) => {
    // Extract just the orb number and name from "Orb 4: Harmonic Architectures"
    const match = orb.match(/Orb (\d+):\s*(.+)/);
    if (match) {
      return `Orb ${match[1]}: ${match[2]}`;
    }
    return orb;
  };

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
                  RBI functions as coherent intelligence: the next iteration beyond generative AI. Intelligence equals coherence. RBI measures structural alignment rather than semantic similarity. It validates through mathematical proofs rather than confidence scores.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  Generative AI produces probabilistic outputs. RBI produces deterministic verification. Generative AI requires training data. RBI needs zero training. Generative AI gives confidence scores. RBI gives mathematical proofs.
                </p>
                <div className="space-y-3 mt-4">
                  <p className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">What Makes RBI Distinct</p>
                  <ul className="space-y-2 text-sm text-stone-200">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-cyan-300">Mathematical Proofs:</strong> Deterministic validation with complete explainability. Every decision is traceable, not a black box.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-cyan-300">Zero Training:</strong> No training data required. No model retraining. No drift over time.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-cyan-300">Deterministic:</strong> Same input always produces same output. Reproducible, verifiable, predictable.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-cyan-300">Structural Coherence:</strong> Validates relationships and integrity. Finds coherent patterns, not just similar text.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-cyan-300">Temporal Continuity:</strong> Maintains coherence over time. No degradation, no drift, consistent validation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-cyan-300">Regulatory Compliance:</strong> Mathematical proofs enable audit trails. Deterministic validation meets compliance requirements.</span>
                    </li>
                  </ul>
                </div>
                <p className="text-base leading-relaxed text-stone-200 mt-4">
                  RBI operates as the infrastructure layer that makes AI viable at scale. It functions as quality control for AI systems, providing the verification and boundary enforcement that probabilistic models cannot deliver.
                </p>
                <p className="text-sm text-stone-400 italic mt-4">
                  Patent Pending: U.S. Provisional Patent Application No. 63/909,031
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

      {/* Entries List */}
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

      {!isLoading && !error && entries.length > 0 && (
        <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
              Codex Entries
            </h2>
            <p className="text-sm text-stone-400 mt-2">
              Source material that becomes books
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entries.map((entry, index) => (
              <div
                key={entry.id || index}
                className="terminator-border"
              >
                <div className="p-6 bg-cosmic-blue rounded-lg h-full">
                  <h3 className="text-xl font-semibold mb-3 tracking-tight text-cyan-300">
                    {entry.title || 'Untitled Entry'}
                  </h3>
                  
                  {entry.orb_associations && (
                    <div className="mb-4 space-y-2">
                      {entry.orb_associations.primary_orb && (
                        <div>
                          <span className="text-xs text-cyan-400/60 uppercase tracking-wide">Primary Orb</span>
                          <p className="text-sm text-cyan-300 mt-1">
                            {formatOrbName(entry.orb_associations.primary_orb)}
                          </p>
                        </div>
                      )}
                      {entry.orb_associations.secondary_orbs && entry.orb_associations.secondary_orbs.length > 0 && (
                        <div>
                          <span className="text-xs text-cyan-400/60 uppercase tracking-wide">Secondary Orbs</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {entry.orb_associations.secondary_orbs.slice(0, 3).map((orb, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-cyan-400/10 text-cyan-300 rounded text-xs"
                              >
                                {formatOrbName(orb)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {entry.field_function?.content_purpose && (
                    <p className="text-sm text-stone-300 mb-4 leading-relaxed">
                      {entry.field_function.content_purpose}
                    </p>
                  )}

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {entry.tags.slice(0, 5).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-stone-700/50 text-stone-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {entry.is_primary_source && (
                    <div className="mt-4 pt-4 border-t border-cyan-400/20">
                      <span className="text-xs text-cyan-400/80 italic">Primary source material</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
