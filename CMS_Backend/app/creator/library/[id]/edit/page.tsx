'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface ContentFile {
  id: string;
  title: string;
  file_path: string;
  content_type: string;
  status: string;
  markdown_body: string;
  yaml_frontmatter: any;
  orb_associations: number[];
  tags: string[];
  resonance_rating: number;
}

export default function EditFilePage() {
  const params = useParams();
  const router = useRouter();
  const [file, setFile] = useState<ContentFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Editable fields
  const [title, setTitle] = useState('');
  const [markdownBody, setMarkdownBody] = useState('');
  const [status, setStatus] = useState('draft');
  const [contentType, setContentType] = useState('');
  const [orbAssociations, setOrbAssociations] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [resonanceRating, setResonanceRating] = useState(5);

  // Orbital suggestions
  const [orbitalSuggestions, setOrbitalSuggestions] = useState<any>(null);
  const [extractedScrollstreams, setExtractedScrollstreams] = useState<string[]>([]);

  useEffect(() => {
    loadFile();
  }, [params.id]);

  async function loadFile() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('content_files')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error loading file:', error);
    } else {
      setFile(data);
      // Set editable fields
      setTitle(data.title);
      setMarkdownBody(data.markdown_body);
      setStatus(data.status);
      setContentType(data.content_type);
      setOrbAssociations(data.orb_associations || []);
      setTags(data.tags || []);
      setResonanceRating(data.resonance_rating || 5);
    }

    setLoading(false);
  }

  async function handleSave() {
    if (!file) return;

    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('content_files')
      .update({
        title,
        markdown_body: markdownBody,
        status,
        content_type: contentType,
        orb_associations: orbAssociations,
        tags,
        resonance_rating: resonanceRating,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    setSaving(false);

    if (error) {
      alert(`Error saving: ${error.message}`);
    } else {
      alert('File saved successfully!');
      router.push(`/creator/library/${params.id}`);
    }
  }

  async function handleOrbitalAnalysis() {
    if (!markdownBody) {
      alert('Please write some content first');
      return;
    }

    setAnalyzing(true);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdownBody, title }),
      });

      if (!response.ok) {
        throw new Error('Orbital analysis failed');
      }

      const analysis = await response.json();
      setOrbitalSuggestions(analysis);
      setExtractedScrollstreams(analysis.scrollstreams || []);

      alert(`Orbital Analysis Complete!\n\nSuggested ${analysis.orb_associations.length} Orbs, ${analysis.tags.length} tags, and extracted ${analysis.scrollstreams.length} scrollstreams.`);
    } catch (error) {
      console.error('Orbital analysis error:', error);
      alert('Orbital analysis failed. Check console for details.');
    } finally {
      setAnalyzing(false);
    }
  }

  function applyOrbitalSuggestions() {
    if (!orbitalSuggestions) return;

    setOrbAssociations(orbitalSuggestions.orb_associations);
    setTags(orbitalSuggestions.tags);
    setResonanceRating(orbitalSuggestions.resonance_rating);

    alert('Orbital suggestions applied!');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-creamy-white text-2xl">Loading editor...</div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-center">
          <div className="text-creamy-white text-2xl mb-4">File not found</div>
          <Link
            href="/creator/library"
            className="text-deep-gold hover:text-creamy-white"
          >
            ← Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href={`/creator/library/${params.id}`}
              className="text-deep-gold hover:text-creamy-white mb-4 inline-block"
            >
              ← Cancel
            </Link>
            <h1 className="text-4xl font-bold text-creamy-white">
              Edit Content
            </h1>
            <p className="text-creamy-white/60 text-sm mt-2">{file.file_path}</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleOrbitalAnalysis}
              disabled={analyzing || !markdownBody}
              className="px-6 py-3 bg-cosmic-blue text-deep-navy rounded-lg font-bold hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? 'Analyzing...' : 'Orbital Analysis'}
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-deep-gold text-deep-navy rounded-lg font-bold hover:bg-creamy-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <label className="block text-creamy-white font-semibold mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white text-lg focus:outline-none focus:border-deep-gold"
              />
            </div>

            {/* Markdown Body */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <label className="block text-creamy-white font-semibold mb-2">Content (Markdown)</label>
              <textarea
                value={markdownBody}
                onChange={(e) => setMarkdownBody(e.target.value)}
                rows={30}
                className="w-full px-4 py-3 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white font-mono text-sm focus:outline-none focus:border-deep-gold resize-y"
                placeholder="Write your markdown content here..."
              />
              <div className="text-creamy-white/60 text-xs mt-2">
                {markdownBody.split(/\s+/).filter(w => w.length > 0).length} words
              </div>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <label className="block text-creamy-white font-semibold mb-3">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white focus:outline-none focus:border-deep-gold"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Content Type */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <label className="block text-creamy-white font-semibold mb-3">Content Type</label>
              <input
                type="text"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-4 py-2 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white focus:outline-none focus:border-deep-gold"
              />
            </div>

            {/* Orb Associations */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <label className="block text-creamy-white font-semibold mb-3">Orb Associations</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(orb => (
                  <button
                    key={orb}
                    onClick={() => {
                      if (orbAssociations.includes(orb)) {
                        setOrbAssociations(orbAssociations.filter(o => o !== orb));
                      } else {
                        setOrbAssociations([...orbAssociations, orb].sort((a, b) => a - b));
                      }
                    }}
                    className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                      orbAssociations.includes(orb)
                        ? 'bg-deep-gold text-deep-navy'
                        : 'bg-deep-navy border border-deep-gold/40 text-deep-gold hover:bg-deep-gold/20'
                    }`}
                  >
                    {orb}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <label className="block text-creamy-white font-semibold mb-3">Tags</label>
              <input
                type="text"
                value={tags.join(', ')}
                onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0))}
                placeholder="tag1, tag2, tag3"
                className="w-full px-4 py-2 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white focus:outline-none focus:border-deep-gold"
              />
              <div className="text-creamy-white/60 text-xs mt-2">
                Comma-separated tags
              </div>
            </div>

            {/* Resonance Rating */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <label className="block text-creamy-white font-semibold mb-3">
                Resonance Rating: {resonanceRating}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={resonanceRating}
                onChange={(e) => setResonanceRating(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Orbital Suggestions */}
            {orbitalSuggestions && (
              <div className="bg-cosmic-blue/10 backdrop-blur-sm rounded-2xl p-6 border border-cosmic-blue/30">
                <h3 className="text-creamy-white font-semibold mb-4 flex items-center justify-between">
                  <span>Orbital Suggestions</span>
                  <button
                    onClick={applyOrbitalSuggestions}
                    className="text-xs px-3 py-1 bg-cosmic-blue/20 text-cosmic-blue rounded hover:bg-cosmic-blue/30 transition-colors"
                  >
                    Apply All
                  </button>
                </h3>

                {/* Suggested Orbs */}
                {orbitalSuggestions.orb_associations && orbitalSuggestions.orb_associations.length > 0 && (
                  <div className="mb-4">
                    <div className="text-creamy-white/60 text-sm mb-2">Suggested Orbs:</div>
                    <div className="flex flex-wrap gap-2">
                      {orbitalSuggestions.orb_associations.map((orb: number) => (
                        <span key={orb} className="px-2 py-1 bg-deep-gold/20 text-deep-gold rounded text-sm">
                          Orb {orb}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Tags */}
                {orbitalSuggestions.tags && orbitalSuggestions.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="text-creamy-white/60 text-sm mb-2">Suggested Tags:</div>
                    <div className="flex flex-wrap gap-1">
                      {orbitalSuggestions.tags.slice(0, 10).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-cosmic-blue/20 text-cosmic-blue rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {orbitalSuggestions.tags.length > 10 && (
                        <span className="text-creamy-white/60 text-xs">+{orbitalSuggestions.tags.length - 10} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Extracted Scrollstreams */}
                {extractedScrollstreams.length > 0 && (
                  <div>
                    <div className="text-creamy-white/60 text-sm mb-2">Extracted Scrollstreams:</div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {extractedScrollstreams.map((scroll, idx) => (
                        <div key={idx} className="text-creamy-white/80 text-xs p-2 bg-deep-navy/40 rounded">
                          &quot;{scroll}&quot;
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {orbitalSuggestions.analysis_notes && (
                  <div className="mt-4 text-creamy-white/60 text-xs">
                    {orbitalSuggestions.analysis_notes}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
