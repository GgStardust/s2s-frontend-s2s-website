'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface BookChapter {
  id: string;
  book_title: string;
  part_number: number | null;
  part_title: string | null;
  chapter_number: number;
  chapter_title: string;
  chapter_content: string | null;
  source_file_ids: string[];
  status: string;
  word_count: number | null;
}

interface ContentFile {
  id: string;
  title: string;
  file_path: string;
  markdown_body: string;
  content_type: string;
  orb_associations: number[];
}

export default function ChapterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [chapter, setChapter] = useState<BookChapter | null>(null);
  const [sourceFiles, setSourceFiles] = useState<ContentFile[]>([]);
  const [allFiles, setAllFiles] = useState<ContentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [merging, setMerging] = useState(false);

  // Editable fields
  const [chapterContent, setChapterContent] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [status, setStatus] = useState('outline');

  // Orbital suggestions
  const [orbitalSuggestions, setOrbitalSuggestions] = useState<any[]>([]);

  useEffect(() => {
    loadChapter();
  }, [params.id]);

  async function loadChapter() {
    const supabase = createClient();

    // Load chapter
    const { data: chapterData } = await supabase
      .from('book_chapters')
      .select('*')
      .eq('id', params.id)
      .single();

    if (chapterData) {
      setChapter(chapterData);
      setChapterContent(chapterData.chapter_content || '');
      setChapterTitle(chapterData.chapter_title);
      setStatus(chapterData.status);

      // Load source files
      if (chapterData.source_file_ids && chapterData.source_file_ids.length > 0) {
        const { data: filesData } = await supabase
          .from('content_files')
          .select('*')
          .in('id', chapterData.source_file_ids);

        setSourceFiles(filesData || []);
      }
    }

    // Load all files for adding
    const { data: allFilesData } = await supabase
      .from('content_files')
      .select('id, title, file_path, markdown_body, content_type, orb_associations')
      .order('title');

    setAllFiles(allFilesData || []);
    setLoading(false);
  }

  async function handleSave() {
    if (!chapter) return;

    setSaving(true);
    const supabase = createClient();

    const wordCount = chapterContent.split(/\s+/).filter(w => w.length > 0).length;

    const { error } = await supabase
      .from('book_chapters')
      .update({
        chapter_title: chapterTitle,
        chapter_content: chapterContent,
        status,
        word_count: wordCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    setSaving(false);

    if (error) {
      alert(`Error saving: ${error.message}`);
    } else {
      alert('Chapter saved successfully!');
    }
  }

  async function addSourceFile(fileId: string) {
    if (!chapter) return;

    const supabase = createClient();
    const newSourceFileIds = [...chapter.source_file_ids, fileId];

    const { error } = await supabase
      .from('book_chapters')
      .update({
        source_file_ids: newSourceFileIds,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      loadChapter();
    }
  }

  async function removeSourceFile(fileId: string) {
    if (!chapter) return;

    const supabase = createClient();
    const newSourceFileIds = chapter.source_file_ids.filter(id => id !== fileId);

    const { error } = await supabase
      .from('book_chapters')
      .update({
        source_file_ids: newSourceFileIds,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      loadChapter();
    }
  }

  function compileFromSources() {
    const compiled = sourceFiles
      .map(file => `# ${file.title}\n\n${file.markdown_body}`)
      .join('\n\n---\n\n');

    setChapterContent(compiled);
  }

  async function handleOrbitalSuggestions() {
    if (!chapter) return;

    setSuggesting(true);
    try {
      const response = await fetch('/api/ai/suggest-essays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter_title: chapterTitle,
          chapter_description: `Chapter ${chapter.chapter_number}: ${chapterTitle}`,
          chapter_orb: chapter.chapter_number, // Assume chapter number maps to Orb
        }),
      });

      const data = await response.json();
      setOrbitalSuggestions(data.suggestions || []);
      alert(`Orbital found ${data.suggestions?.length || 0} relevant essays for this chapter`);
    } catch (error) {
      console.error('Orbital suggestion error:', error);
      alert('Failed to get Orbital suggestions');
    } finally {
      setSuggesting(false);
    }
  }

  async function handleOrbitalMerge() {
    if (!chapter || sourceFiles.length === 0) {
      alert('Add source files first');
      return;
    }

    setMerging(true);
    try {
      const response = await fetch('/api/ai/merge-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter_title: chapterTitle,
          essay_ids: sourceFiles.map(f => f.id),
          book_voice: chapter.book_title.includes('Fiction') ? 'fiction' : 'non-fiction',
        }),
      });

      const data = await response.json();
      setChapterContent(data.merged_content || '');
      alert(`Orbital merged ${sourceFiles.length} essays with ${data.transitions_added} transitions added.\n\n${data.adaptation_notes}`);
    } catch (error) {
      console.error('Orbital merge error:', error);
      alert('Failed to merge with Orbital');
    } finally {
      setMerging(false);
    }
  }

  function addSuggestedEssay(fileId: string) {
    addSourceFile(fileId);
    setOrbitalSuggestions(prev => prev.filter(s => s.file_id !== fileId));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-creamy-white text-2xl">Loading chapter...</div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-center">
          <div className="text-creamy-white text-2xl mb-4">Chapter not found</div>
          <Link href="/creator/books" className="text-deep-gold hover:text-creamy-white">
            ← Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/creator/books" className="text-deep-gold hover:text-creamy-white mb-4 inline-block">
              ← Back to Books
            </Link>
            <h1 className="text-4xl font-bold text-creamy-white mb-2">
              {chapter.book_title}
            </h1>
            <p className="text-creamy-white/60">
              Chapter {chapter.chapter_number}
              {chapter.part_number && ` · Part ${chapter.part_number}: ${chapter.part_title}`}
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleOrbitalSuggestions}
              disabled={suggesting}
              className="px-6 py-3 bg-cosmic-blue text-deep-navy rounded-lg font-bold hover:bg-blue-400 transition-colors disabled:opacity-50"
            >
              {suggesting ? 'Finding...' : 'Orbital Suggest Essays'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-deep-gold text-deep-navy rounded-lg font-bold hover:bg-creamy-white transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Chapter'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chapter Title */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <label className="block text-creamy-white font-semibold mb-2">Chapter Title</label>
              <input
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="w-full px-4 py-3 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white text-lg focus:outline-none focus:border-deep-gold"
              />
            </div>

            {/* Chapter Content */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <div className="flex items-center justify-between mb-4">
                <label className="text-creamy-white font-semibold">Chapter Content</label>
                {sourceFiles.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={compileFromSources}
                      className="px-4 py-2 bg-creamy-white/10 text-creamy-white border border-creamy-white/30 rounded-lg hover:bg-creamy-white/20 transition-colors text-sm"
                    >
                      Basic Compile
                    </button>
                    <button
                      onClick={handleOrbitalMerge}
                      disabled={merging}
                      className="px-4 py-2 bg-cosmic-blue/20 text-cosmic-blue border border-cosmic-blue/30 rounded-lg hover:bg-cosmic-blue/30 transition-colors text-sm disabled:opacity-50"
                    >
                      {merging ? 'Merging...' : 'Orbital Merge'}
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={chapterContent}
                onChange={(e) => setChapterContent(e.target.value)}
                rows={30}
                className="w-full px-4 py-3 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white font-mono text-sm focus:outline-none focus:border-deep-gold resize-y"
                placeholder="Write or compile your chapter content..."
              />
              <div className="text-creamy-white/60 text-xs mt-2">
                {chapterContent.split(/\s+/).filter(w => w.length > 0).length.toLocaleString()} words
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <label className="block text-creamy-white font-semibold mb-3">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white focus:outline-none focus:border-deep-gold"
              >
                <option value="outline">Outline</option>
                <option value="draft">Draft</option>
                <option value="complete">Complete</option>
              </select>
            </div>

            {/* Source Files */}
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
              <h3 className="text-creamy-white font-semibold mb-4">
                Source Files ({sourceFiles.length})
              </h3>

              {sourceFiles.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {sourceFiles.map(file => (
                    <div
                      key={file.id}
                      className="flex items-start justify-between p-3 bg-deep-navy/60 rounded-lg border border-deep-gold/20"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-creamy-white text-sm font-medium truncate">
                          {file.title}
                        </div>
                        <div className="text-creamy-white/60 text-xs truncate">
                          {file.file_path}
                        </div>
                      </div>
                      <button
                        onClick={() => removeSourceFile(file.id)}
                        className="ml-2 text-creamy-white/60 hover:text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-creamy-white/60 text-sm mb-4">
                  No source files added yet
                </p>
              )}

              {/* Add Source File */}
              <details className="group">
                <summary className="cursor-pointer text-deep-gold text-sm font-medium hover:text-creamy-white">
                  + Add source file
                </summary>
                <div className="mt-3 max-h-64 overflow-y-auto space-y-1">
                  {allFiles
                    .filter(f => !chapter.source_file_ids.includes(f.id))
                    .slice(0, 50)
                    .map(file => (
                      <button
                        key={file.id}
                        onClick={() => addSourceFile(file.id)}
                        className="w-full text-left px-3 py-2 rounded hover:bg-deep-gold/20 text-creamy-white/80 hover:text-creamy-white text-xs transition-colors"
                      >
                        <div className="font-medium">{file.title}</div>
                        <div className="text-creamy-white/60 text-[10px] truncate">
                          {file.file_path}
                        </div>
                      </button>
                    ))}
                </div>
              </details>
            </div>

            {/* Orbital Suggestions */}
            {orbitalSuggestions.length > 0 && (
              <div className="bg-cosmic-blue/10 backdrop-blur-sm rounded-2xl p-6 border border-cosmic-blue/30">
                <h3 className="text-creamy-white font-semibold mb-4">
                  Orbital Suggested Essays ({orbitalSuggestions.length})
                </h3>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {orbitalSuggestions.map(suggestion => (
                    <div
                      key={suggestion.file_id}
                      className="p-3 bg-deep-navy/60 rounded-lg border border-cosmic-blue/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-creamy-white text-sm font-medium">
                            {suggestion.file_title}
                          </div>
                          <div className="text-cosmic-blue text-xs mt-1">
                            Relevance: {suggestion.relevance_score}/10
                          </div>
                        </div>
                        <button
                          onClick={() => addSuggestedEssay(suggestion.file_id)}
                          className="ml-2 px-3 py-1 bg-cosmic-blue/20 text-cosmic-blue text-xs rounded hover:bg-cosmic-blue/30 transition-colors whitespace-nowrap"
                        >
                          + Add
                        </button>
                      </div>
                      <p className="text-creamy-white/60 text-xs">
                        {suggestion.reasoning}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setOrbitalSuggestions([])}
                  className="mt-4 w-full text-center text-cosmic-blue/60 hover:text-cosmic-blue text-xs"
                >
                  Clear suggestions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
