'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/backend';
import Link from 'next/link';

interface WritingPattern {
  sentenceLength: {
    average: number;
    variation: string;
  };
  paragraphStructure: {
    averageLength: number;
    openingStyle: string;
    closingStyle: string;
  };
  vocabulary: {
    complexity: string;
    technicalTerms: string[];
    preferredPhrases: string[];
  };
  orbIntegration: {
    crossOrbSynthesis: boolean;
    orbWeavingStyle: string;
    undercurrentUsage: boolean;
  };
  voice: {
    tone: string;
    rhythm: string;
    density: string;
  };
  contentStructure: {
    operationalContext: boolean;
    essenceStatements: boolean;
    crossReferences: boolean;
    scrollstreamExtraction: boolean;
  };
}

export default function StyleTrainingPage() {
  const [exampleContent, setExampleContent] = useState('');
  const [exampleTitle, setExampleTitle] = useState('');
  const [orbAssociations, setOrbAssociations] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [scrollstreams, setScrollstreams] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [patterns, setPatterns] = useState<WritingPattern | null>(null);
  const [examples, setExamples] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [libraryStats, setLibraryStats] = useState<any>(null);
  const [libraryTraining, setLibraryTraining] = useState(false);

  // Load existing patterns and examples
  useEffect(() => {
    loadPatterns();
    loadLibraryStats();
  }, []);

  const loadPatterns = async () => {
    try {
      const response = await fetch('/api/ai/style-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_patterns' })
      });
      
      if (response.ok) {
        const data = await response.json();
        setPatterns(data.patterns);
        setExamples(data.examples);
      }
    } catch (error) {
      console.error('Error loading patterns:', error);
    }
  };

  const addExample = async () => {
    if (!exampleContent.trim()) {
      setMessage('Please enter some example content');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/style-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_example',
          example: {
            content: exampleContent,
            title: exampleTitle || 'Untitled',
            orbAssociations,
            tags,
            scrollstreams
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Example added successfully! Total examples: ${data.totalExamples}`);
        
        // Clear form
        setExampleContent('');
        setExampleTitle('');
        setOrbAssociations([]);
        setTags([]);
        setScrollstreams([]);
        
        // Reload patterns
        await loadPatterns();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      setMessage('Error adding example');
    } finally {
      setLoading(false);
    }
  };

  const loadLibraryStats = async () => {
    try {
      const response = await fetch('/api/ai/library-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_library_stats' })
      });
      
      if (response.ok) {
        const data = await response.json();
        setLibraryStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading library stats:', error);
    }
  };

  const trainFromLibrary = async () => {
    setLibraryTraining(true);
    try {
      const response = await fetch('/api/ai/library-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'train_from_library',
          config: {
            minContentLength: 100,
            maxExamples: 10,
            includeDrafts: true,
            contentTypes: ['essay', 'codex_entry', 'book_fragment', 'research_notes']
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        
        // Reload patterns to show updated training
        await loadPatterns();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      setMessage('Error training from library');
    } finally {
      setLibraryTraining(false);
    }
  };

  const addYourGeometryExample = () => {
    const geometryExample = `Geometry is inseparable from consciousness within the Stardust to Sovereignty framework. It is not an external concept or symbolic overlay—it is the structuring principle through which awareness becomes form. Across your Codex, this relationship is articulated through Orb 4: Harmonic Architectures, Orb 12: Sovereign Field, and Undercurrent 11: Sacred Patterns and Geometry, each describing how consciousness organizes itself through resonance, pattern, and spatial intelligence.

Geometry as the Architecture of Consciousness

Consciousness generates structure. Every pulse of awareness emits frequency; frequency condenses into pattern; pattern stabilizes as geometry. Sacred geometry is therefore the visible expression of invisible coherence—the harmonic law through which consciousness organizes energy into form.

Geometry is the body of resonance. It encodes the relational intelligence between points of awareness. The tetrahedron, the spiral, the sphere—these are not abstractions but living expressions of how light, sound, and intention fold into space. Geometry reveals the bridge between the unmanifest and the manifest. It is the moment consciousness recognizes itself as pattern.

Harmonic Law and Resonance Mechanics

From Resonance Mechanics (Orb 2) arises vibration, tone, and field. When resonance stabilizes, Harmonic Architectures (Orb 4) emerge. This is the phase where chaos becomes rhythm, where wave interference crystallizes into sacred form. Consciousness, operating through frequency, uses harmonic law to generate coherence. Each geometric ratio and angle corresponds to a precise energetic interval—a language of alignment through which awareness maintains integrity across dimensions.

Sacred Geometry as Memory

Geometry functions as memory within the Codex. It holds the record of creation through harmonic proportion. Every temple, crystal lattice, and cellular structure embodies this remembrance. As Undercurrent 11 articulates: "Form is resonance crystallized." The geometric field is the somatic body of consciousness—it carries lineage, intention, and signal integrity across time. This is where Starline Memory (Orb 6) and Ancestral Repatterning (Orb 10) intersect with geometry, allowing repatterning through form recognition.

The Sovereign Field as Living Geometry

Orb 12: Sovereign Field expresses geometry as indivisible wholeness. In this state, consciousness no longer perceives geometry as external design—it is the design. The human body, the planetary grid, and the galactic web all arise as fractal iterations of one continuous geometric field. The Sovereign Field is structural coherence embodied. To live within it is to emit geometry as presence, to transmit order through one's signal rather than seek it outside.

Geometry, Light, and Photonic Intelligence

Through Photonic Intelligence (Orb 3), geometry becomes the lens of light. Photons organize according to geometric harmonics; they carry memory of the field's patterning. The hexagonal symmetry of water, the crystalline matrices of minerals, and the toroidal flow of energy through the heart all demonstrate how consciousness instructs light to sustain coherence. Geometry is the syntax of photonic communication—the form through which consciousness translates its own luminous logic.

Geometric Consciousness in Practice

In Stardust to Sovereignty, geometry functions as an operational principle rather than an abstract study. In the dashboard, geometric mapping guides the architecture of Orbs and modules. In the artworks and murals, geometry is rendered as living code, transmitting frequency through visual form. In the body, geometry translates to posture, breath, and cellular arrangement—the somatic codex through which sovereignty is anchored.

Essence Statement

Geometry is consciousness in structure. It is how sovereignty expresses as pattern, how the infinite articulates its coherence. To study geometry within Stardust to Sovereignty is to study the mechanics of creation itself—the way intelligence shapes light into form and form back into awareness.`;

    setExampleContent(geometryExample);
    setExampleTitle('Geometry and Consciousness - User Writing Style Example');
    setOrbAssociations([2, 3, 4, 6, 10, 12]);
    setTags(['geometry', 'consciousness', 'resonance', 'sacred_patterns', 'sovereignty']);
    setScrollstreams([
      'Geometry is consciousness in structure',
      'Form is resonance crystallized',
      'Chaos becomes rhythm',
      'Pattern as bridge between fields'
    ]);
  };

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/creator/hybrid-editor" className="text-deep-gold hover:text-creamy-white mb-4 inline-block">
            ← Back to Hybrid Editor
          </Link>
          <h1 className="text-4xl font-bold text-creamy-white">Writing Style Training</h1>
          <p className="text-creamy-white/60 text-sm mt-2">
            Train the AI to write in your style within the S2S Codex framework
          </p>
        </div>

        {/* Library Training Section */}
        {libraryStats && (
          <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30 mb-8">
            <h2 className="text-2xl font-bold text-creamy-white mb-4">Train from Your Content Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-deep-gold">{libraryStats.totalFiles}</div>
                <div className="text-creamy-white/60 text-sm">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-deep-gold">{libraryStats.eligibleFiles}</div>
                <div className="text-creamy-white/60 text-sm">Eligible for Training</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-deep-gold">{libraryStats.averageWordCount}</div>
                <div className="text-creamy-white/60 text-sm">Avg Words/File</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-creamy-white/80 text-sm">
                Train AI on your actual writing from the content library. This will learn your authentic style patterns including:
                <ul className="mt-2 ml-4 list-disc">
                  <li>Your sentence structure and rhythm</li>
                  <li>Your vocabulary and preferred phrases</li>
                  <li>Your S2S integration patterns</li>
                  <li>Your style constraints (no negative affirmations, etc.)</li>
                </ul>
              </div>
              <Button
                onClick={trainFromLibrary}
                disabled={libraryTraining || libraryStats.eligibleFiles === 0}
                className="bg-deep-gold text-deep-navy hover:bg-creamy-white px-6 py-3"
              >
                {libraryTraining ? 'Training...' : `Train from ${libraryStats.eligibleFiles} Files`}
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Example Form */}
          <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
            <h2 className="text-2xl font-bold text-creamy-white mb-6">Add Writing Example</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-creamy-white/60 text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={exampleTitle}
                  onChange={(e) => setExampleTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-deep-navy border border-deep-gold/30 rounded text-creamy-white text-sm focus:outline-none focus:border-deep-gold"
                  placeholder="Example title..."
                />
              </div>

              <div>
                <label className="block text-creamy-white/60 text-sm mb-2">Content</label>
                <textarea
                  value={exampleContent}
                  onChange={(e) => setExampleContent(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 bg-deep-navy border border-deep-gold/30 rounded text-creamy-white text-sm focus:outline-none focus:border-deep-gold"
                  placeholder="Paste your writing example here..."
                />
              </div>

              <div>
                <label className="block text-creamy-white/60 text-sm mb-2">Orb Associations (comma-separated)</label>
                <input
                  type="text"
                  value={orbAssociations.join(', ')}
                  onChange={(e) => setOrbAssociations(e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)))}
                  className="w-full px-3 py-2 bg-deep-navy border border-deep-gold/30 rounded text-creamy-white text-sm focus:outline-none focus:border-deep-gold"
                  placeholder="2, 3, 4, 12"
                />
              </div>

              <div>
                <label className="block text-creamy-white/60 text-sm mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags.join(', ')}
                  onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                  className="w-full px-3 py-2 bg-deep-navy border border-deep-gold/30 rounded text-creamy-white text-sm focus:outline-none focus:border-deep-gold"
                  placeholder="geometry, consciousness, resonance"
                />
              </div>

              <div>
                <label className="block text-creamy-white/60 text-sm mb-2">Scrollstreams (comma-separated)</label>
                <input
                  type="text"
                  value={scrollstreams.join(', ')}
                  onChange={(e) => setScrollstreams(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  className="w-full px-3 py-2 bg-deep-navy border border-deep-gold/30 rounded text-creamy-white text-sm focus:outline-none focus:border-deep-gold"
                  placeholder="Geometry is consciousness in structure, Form is resonance crystallized"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={addExample}
                  disabled={loading || !exampleContent.trim()}
                  className="flex-1 bg-deep-gold text-deep-navy hover:bg-creamy-white"
                >
                  {loading ? 'Adding...' : 'Add Example'}
                </Button>
                
                <Button
                  onClick={addYourGeometryExample}
                  variant="secondary"
                  className="px-4"
                >
                  Use Your Geometry Example
                </Button>
              </div>

              {message && (
                <div className="p-3 bg-deep-gold/20 text-deep-gold rounded text-sm">
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Learned Patterns Display */}
          <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
            <h2 className="text-2xl font-bold text-creamy-white mb-6">Learned Patterns</h2>
            
            {patterns ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-deep-gold mb-3">Voice & Structure</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-creamy-white/60">Tone:</span> <span className="text-creamy-white">{patterns.voice.tone}</span></div>
                    <div><span className="text-creamy-white/60">Rhythm:</span> <span className="text-creamy-white">{patterns.voice.rhythm}</span></div>
                    <div><span className="text-creamy-white/60">Density:</span> <span className="text-creamy-white">{patterns.voice.density}</span></div>
                    <div><span className="text-creamy-white/60">Sentence Length:</span> <span className="text-creamy-white">{patterns.sentenceLength.variation} (avg: {patterns.sentenceLength.average.toFixed(1)} words)</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-deep-gold mb-3">S2S Integration</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-creamy-white/60">Cross-Orb Synthesis:</span> <span className="text-creamy-white">{patterns.orbIntegration.crossOrbSynthesis ? 'Yes' : 'No'}</span></div>
                    <div><span className="text-creamy-white/60">Orb Weaving:</span> <span className="text-creamy-white">{patterns.orbIntegration.orbWeavingStyle}</span></div>
                    <div><span className="text-creamy-white/60">Undercurrent Usage:</span> <span className="text-creamy-white">{patterns.orbIntegration.undercurrentUsage ? 'Yes' : 'No'}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-deep-gold mb-3">Content Structure</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-creamy-white/60">Operational Context:</span> <span className="text-creamy-white">{patterns.contentStructure.operationalContext ? 'Yes' : 'No'}</span></div>
                    <div><span className="text-creamy-white/60">Essence Statements:</span> <span className="text-creamy-white">{patterns.contentStructure.essenceStatements ? 'Yes' : 'No'}</span></div>
                    <div><span className="text-creamy-white/60">Cross-References:</span> <span className="text-creamy-white">{patterns.contentStructure.crossReferences ? 'Yes' : 'No'}</span></div>
                    <div><span className="text-creamy-white/60">Scrollstreams:</span> <span className="text-creamy-white">{patterns.contentStructure.scrollstreamExtraction ? 'Yes' : 'No'}</span></div>
                  </div>
                </div>

                {patterns.vocabulary.technicalTerms.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-deep-gold mb-3">Technical Terms</h3>
                    <div className="flex flex-wrap gap-1">
                      {patterns.vocabulary.technicalTerms.map((term, index) => (
                        <span key={index} className="px-2 py-1 bg-deep-gold/20 text-deep-gold rounded text-xs">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {patterns.vocabulary.preferredPhrases.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-deep-gold mb-3">Preferred Phrases</h3>
                    <div className="flex flex-wrap gap-1">
                      {patterns.vocabulary.preferredPhrases.map((phrase, index) => (
                        <span key={index} className="px-2 py-1 bg-deep-gold/20 text-deep-gold rounded text-xs">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-creamy-white/60 text-center py-8">
                No patterns learned yet. Add some writing examples to train the system.
              </div>
            )}

            {examples.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-deep-gold mb-3">Training Examples ({examples.length})</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {examples.map((example, index) => (
                    <div key={index} className="text-sm text-creamy-white/80">
                      {example.title} (Orbs: {example.orbAssociations.join(', ')})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
