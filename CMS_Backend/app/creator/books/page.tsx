'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

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
  created_at: string;
  updated_at: string;
}

interface ContentFile {
  id: string;
  title: string;
  file_path: string;
  content_type: string;
  orb_associations: number[];
}

export default function BooksPage() {
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<string>('all');

  // New chapter form
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [newChapter, setNewChapter] = useState({
    book_title: 'Stardust to Sovereignty',
    chapter_number: 1,
    chapter_title: '',
    part_number: null as number | null,
    part_title: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();

    // Load chapters
    const { data: chaptersData } = await supabase
      .from('book_chapters')
      .select('*')
      .order('book_title')
      .order('chapter_number');

    // Load content files
    const { data: filesData } = await supabase
      .from('content_files')
      .select('id, title, file_path, content_type, orb_associations')
      .order('title');

    setChapters(chaptersData || []);
    setFiles(filesData || []);
    setLoading(false);
  }

  async function createChapter() {
    if (!newChapter.chapter_title) {
      alert('Please enter a chapter title');
      return;
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('book_chapters')
      .insert({
        book_title: newChapter.book_title,
        chapter_number: newChapter.chapter_number,
        chapter_title: newChapter.chapter_title,
        part_number: newChapter.part_number,
        part_title: newChapter.part_title || null,
        status: 'outline',
        source_file_ids: [],
      });

    if (error) {
      alert(`Error creating chapter: ${error.message}`);
    } else {
      setShowNewChapter(false);
      loadData();
    }
  }

  const bookTitles = Array.from(new Set(chapters.map(c => c.book_title)));
  const filteredChapters = selectedBook === 'all'
    ? chapters
    : chapters.filter(c => c.book_title === selectedBook);

  // Group by book
  const chaptersByBook = filteredChapters.reduce((acc, chapter) => {
    if (!acc[chapter.book_title]) {
      acc[chapter.book_title] = [];
    }
    acc[chapter.book_title].push(chapter);
    return acc;
  }, {} as Record<string, BookChapter[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-creamy-white text-2xl">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <Link
              href="/"
              className="text-deep-gold hover:text-creamy-white mb-4 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-5xl font-bold text-creamy-white mb-4">Book Compiler</h1>
            <p className="text-creamy-white/80 text-lg">
              Assemble essays into book chapters · {chapters.length} chapters · {files.length} source files
            </p>
          </div>

          <button
            onClick={() => setShowNewChapter(!showNewChapter)}
            className="px-6 py-3 bg-deep-gold text-deep-navy rounded-lg font-bold hover:bg-creamy-white transition-colors"
          >
            + New Chapter
          </button>
        </div>

        {/* New Chapter Form */}
        {showNewChapter && (
          <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30 mb-8">
            <h2 className="text-2xl font-bold text-creamy-white mb-6">Create New Chapter</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-creamy-white/60 text-sm mb-2">Book Title</label>
                <input
                  type="text"
                  value={newChapter.book_title}
                  onChange={(e) => setNewChapter({...newChapter, book_title: e.target.value})}
                  className="w-full px-4 py-2 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white focus:outline-none focus:border-deep-gold"
                />
              </div>

              <div>
                <label className="block text-creamy-white/60 text-sm mb-2">Chapter Number</label>
                <input
                  type="number"
                  value={newChapter.chapter_number}
                  onChange={(e) => setNewChapter({...newChapter, chapter_number: Number(e.target.value)})}
                  className="w-full px-4 py-2 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white focus:outline-none focus:border-deep-gold"
                />
              </div>

              <div>
                <label className="block text-creamy-white/60 text-sm mb-2">Chapter Title</label>
                <input
                  type="text"
                  value={newChapter.chapter_title}
                  onChange={(e) => setNewChapter({...newChapter, chapter_title: e.target.value})}
                  placeholder="Enter chapter title..."
                  className="w-full px-4 py-2 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white focus:outline-none focus:border-deep-gold"
                />
              </div>

              <div>
                <label className="block text-creamy-white/60 text-sm mb-2">Part Number (optional)</label>
                <input
                  type="number"
                  value={newChapter.part_number || ''}
                  onChange={(e) => setNewChapter({...newChapter, part_number: e.target.value ? Number(e.target.value) : null})}
                  placeholder="e.g. 1, 2, 3..."
                  className="w-full px-4 py-2 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white focus:outline-none focus:border-deep-gold"
                />
              </div>

              {newChapter.part_number && (
                <div className="md:col-span-2">
                  <label className="block text-creamy-white/60 text-sm mb-2">Part Title</label>
                  <input
                    type="text"
                    value={newChapter.part_title}
                    onChange={(e) => setNewChapter({...newChapter, part_title: e.target.value})}
                    placeholder="e.g. The Foundation"
                    className="w-full px-4 py-2 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white focus:outline-none focus:border-deep-gold"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={createChapter}
                className="px-6 py-2 bg-deep-gold text-deep-navy rounded-lg font-bold hover:bg-creamy-white transition-colors"
              >
                Create Chapter
              </button>
              <button
                onClick={() => setShowNewChapter(false)}
                className="px-6 py-2 bg-creamy-white/10 text-creamy-white rounded-lg font-medium hover:bg-creamy-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30 mb-8">
          <label className="block text-creamy-white/60 text-sm mb-2">Filter by Book</label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="w-full md:w-64 px-4 py-2 bg-deep-navy border border-deep-gold/30 rounded-lg text-creamy-white focus:outline-none focus:border-deep-gold"
          >
            <option value="all">All Books</option>
            {bookTitles.map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        </div>

        {/* Books List */}
        {Object.entries(chaptersByBook).length === 0 ? (
          <div className="text-center py-20">
            <p className="text-creamy-white/60 text-xl mb-4">No chapters yet</p>
            <button
              onClick={() => setShowNewChapter(true)}
              className="text-deep-gold hover:text-creamy-white"
            >
              Create your first chapter →
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(chaptersByBook).map(([bookTitle, bookChapters]) => (
              <div key={bookTitle}>
                <h2 className="text-3xl font-bold text-creamy-white mb-6">{bookTitle}</h2>

                <div className="space-y-4">
                  {bookChapters.map(chapter => (
                    <Link
                      key={chapter.id}
                      href={`/creator/books/${chapter.id}`}
                      className="block bg-deep-navy/60 backdrop-blur-sm rounded-xl p-6 border border-deep-gold/30 hover:border-deep-gold/60 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-deep-gold font-bold text-lg">
                              Chapter {chapter.chapter_number}
                            </span>
                            {chapter.part_number && (
                              <span className="text-creamy-white/60 text-sm">
                                Part {chapter.part_number}: {chapter.part_title}
                              </span>
                            )}
                          </div>
                          <h3 className="text-creamy-white text-xl font-semibold mb-2">
                            {chapter.chapter_title}
                          </h3>
                          {chapter.chapter_content && (
                            <p className="text-creamy-white/60 text-sm line-clamp-2">
                              {chapter.chapter_content.substring(0, 150)}...
                            </p>
                          )}
                        </div>

                        <div className="ml-4 flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            chapter.status === 'complete'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : chapter.status === 'draft'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {chapter.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        {chapter.word_count && (
                          <span className="text-creamy-white/60">
                            {chapter.word_count.toLocaleString()} words
                          </span>
                        )}
                        {chapter.source_file_ids && chapter.source_file_ids.length > 0 && (
                          <span className="text-deep-gold">
                            {chapter.source_file_ids.length} source file(s)
                          </span>
                        )}
                        <span className="text-creamy-white/40">
                          Updated {new Date(chapter.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
