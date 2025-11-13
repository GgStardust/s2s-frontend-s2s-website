'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Textarea } from '@/components/backend';
import EditableTagList from '@/components/book-compiler/EditableTagList';
import GenerationControls from '@/components/book-compiler/GenerationControls';
import ResonanceValidationPanel from '@/components/book-compiler/ResonanceValidationPanel';

interface Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  part_number: number | null;
  part_title: string | null;
  status: string;
  word_count: number;
  content: string | null;
  notes: string | null;
  orb_focus: string | null;
  source_file_ids: string[] | null;
  scrollstreams: string[] | null;
  linked_sources: string[];
  referenced_files: string[];
  generation_params: {
    max_words: number;
    include_scrollstreams: boolean;
    include_notes: boolean;
    linked_orbs_only: boolean;
  };
}

interface Source {
  id: string;
  source_file_id: string;
  source_type: string;
  source_content: string;
  relevance_score: number;
  ai_suggested: boolean;
  user_confirmed: boolean;
  integration_notes: string | null;
  content_files: {
    id: string;
    title: string;
    file_path: string;
    content_type: string;
    orb_associations: number[];
    tags: string[];
  };
}

export default function ChapterEditorPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const chapterId = params.chapterId as string;

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const [content, setContent] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('outline');
  const [locked, setLocked] = useState(false);
  
  // New state for YAML-driven source management
  const [linkedSources, setLinkedSources] = useState<string[]>([]);
  const [referencedFiles, setReferencedFiles] = useState<string[]>([]);
  const [generationParams, setGenerationParams] = useState({
    max_words: 3000,
    include_scrollstreams: true,
    include_notes: true,
    linked_orbs_only: true
  });

  const loadChapter = useCallback(async () => {
    try {
      const response = await fetch(`/api/chapters/${chapterId}`);
      const data = await response.json();
      setChapter(data.chapter);
      setSources(data.sources || []);

      setContent(data.chapter.content || '');
      setNotes(data.chapter.notes || '');
      setStatus(data.chapter.status || 'outline');
      
      // Load new JSONB fields with fallbacks
      setLinkedSources(data.chapter.linked_sources || []);
      setReferencedFiles(data.chapter.referenced_files || []);
      setGenerationParams(data.chapter.generation_params || {
        max_words: 3000,
        include_scrollstreams: true,
        include_notes: true,
        linked_orbs_only: true
      });
    } catch (err) {
      console.error('Error loading chapter:', err);
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    loadChapter();
    // Load book to determine lock state
    (async () => {
      try {
        const res = await fetch(`/api/books/${bookId}`);
        if (res.ok) {
          const d = await res.json();
          if (d?.book?.status === 'complete') setLocked(true);
        }
      } catch {}
    })();
  }, [loadChapter]);

  async function handleSave() {
    if (locked) return;
    setSaving(true);
    try {
      const wordCount = content.trim().split(/\s+/).length;

      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          notes,
          status,
          word_count: wordCount,
          linked_sources: linkedSources,
          referenced_files: referencedFiles,
          generation_params: generationParams,
        }),
      });

      if (response.ok) {
        await loadChapter();
      }
    } catch (err) {
      console.error('Error saving chapter:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveSource(sourceId: string) {
    if (locked) return;
    setRemoving(sourceId);
    try {
      const response = await fetch('/api/chapter-sources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter_id: chapterId,
          file_ids: [sourceId]
        }),
      });

      if (response.ok) {
        // Reload chapter to get updated sources
        await loadChapter();
      } else {
        console.error('Failed to remove source');
        alert('Failed to remove source. Please try again.');
      }
    } catch (err) {
      console.error('Error removing source:', err);
      alert('Error removing source. Please try again.');
    } finally {
      setRemoving(null);
    }
  }

  async function handleGenerateChapter() {
    if (locked) return;
    if (linkedSources.length === 0 && referencedFiles.length === 0) {
      // Try resonance-based source selection first
      try {
        const response = await fetch('/api/ai/resonance-source-selection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chapter_id: chapterId,
            max_sources: 3,
            orb_focus: chapter?.orb_focus
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.selected_sources && data.selected_sources.length > 0) {
            // Use resonance-selected sources
            setLinkedSources(data.selected_sources.map((s: any) => s.id));
            alert(`Found ${data.selected_sources.length} resonance-matched sources automatically!`);
          } else {
            alert('No resonance-matched sources found. Please add sources manually.');
            return;
          }
        } else {
          alert('Resonance source selection failed. Please add sources manually.');
          return;
        }
      } catch (err) {
        console.error('Error in resonance source selection:', err);
        alert('Resonance source selection failed. Please add sources manually.');
        return;
      }
    }

    // Validate generation parameters
    if (linkedSources.length > 3) {
      alert('Too many linked sources. Limit to 3 per chapter.');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/ai/merge-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chapter_id: chapterId,
          generation_params: generationParams,
          linked_sources: linkedSources,
          referenced_files: referencedFiles
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await loadChapter();
        alert(`Chapter generated! ${data.merged.word_count} words, ${data.merged.transitions_added} transitions added.`);
      } else {
        alert(data.error || 'Failed to generate chapter');
      }
    } catch (err) {
      console.error('Error generating chapter:', err);
      alert('Failed to generate chapter');
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-backend-secondary flex items-center justify-center">
        <div className="text-backend-primary text-2xl">Loading chapter...</div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-backend-secondary flex items-center justify-center">
        <div className="text-backend-primary text-2xl">Chapter not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backend-secondary">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/creator/book-compiler/${bookId}`}
            className="text-backend-secondary hover:text-backend-primary mb-4 inline-block"
          >
            ← Back to Book
          </Link>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-backend-primary mb-2">
                Chapter {chapter.chapter_number}: {chapter.title}
              </h1>
              {chapter.part_number && (
                <p className="text-backend-secondary">
                  Part {chapter.part_number}: {chapter.part_title}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="px-4 py-2 bg-white border border-backend-default rounded-md text-backend-primary focus:outline-none focus:ring-2 focus:ring-backend-focus"
              >
                <option value="outline">Outline</option>
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="complete">Complete</option>
              </select>

              <Button
                onClick={handleSave}
                disabled={saving}
                variant="primary"
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Editor */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-backend-primary">Chapter Content</h2>
                <span className="text-backend-secondary text-sm">
                  {content.trim().split(/\s+/).filter(w => w.length > 0).length.toLocaleString()} words
                </span>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Start writing your chapter content here..."
                className="w-full h-96 px-3 py-2 bg-white border border-backend-default rounded-md text-backend-primary placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-backend-focus focus:border-transparent"
              />
            </Card>

            {/* Notes */}
            <Card title="Chapter Notes">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add notes, ideas, or reminders for this chapter..."
                className="w-full h-64 px-3 py-2 bg-white border border-backend-default rounded-md text-backend-primary placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-backend-focus focus:border-transparent whitespace-pre-wrap font-mono text-sm"
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resonance Validation Panel */}
            <ResonanceValidationPanel 
              chapterId={chapterId}
              onResonanceUpdate={(data) => {
                console.log('Resonance updated:', data);
              }}
            />

            {/* Orb Focus */}
            {chapter.orb_focus && (
              <Card title="Orb Focus">
                <p className="text-backend-secondary text-sm">{chapter.orb_focus}</p>
              </Card>
            )}

            {/* Scrollstreams */}
            {chapter.scrollstreams && chapter.scrollstreams.length > 0 && (
              <Card title="Scrollstreams">
                <div className="space-y-2">
                  {chapter.scrollstreams.map((stream, idx) => (
                    <div key={idx} className="text-backend-secondary text-sm italic border-l-2 border-backend-default pl-3">
                      {stream}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Dynamic Source Management */}
            <Card title="Source Management">
              <div className="space-y-4">
                <EditableTagList
                  tags={linkedSources}
                  onTagsChange={setLinkedSources}
                  label="Linked Sources"
                  placeholder="Add source tag (e.g., sovereign_field_navigation)"
                  maxTags={3}
                />
                
                <EditableTagList
                  tags={referencedFiles}
                  onTagsChange={setReferencedFiles}
                  label="Referenced Files"
                  placeholder="Add file name (e.g., origin_intelligence_pulse.md)"
                  maxTags={5}
                />
              </div>
            </Card>

            {/* Generation Controls */}
            <GenerationControls
              params={generationParams}
              onParamsChange={setGenerationParams}
              onGenerate={handleGenerateChapter}
              isGenerating={generating}
            />

            {/* Quick Actions */}
            <Card title="Orbital Tools">
              <div className="space-y-2">
                <Link
                  href={`/creator/book-compiler/${bookId}/chapters/${chapterId}/add-sources`}
                  className="block w-full px-4 py-2 bg-white border border-backend-default rounded-lg text-backend-primary text-center hover:border-backend-hover transition-colors"
                >
                  + Add Legacy Sources
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
