'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  type: 'non_fiction' | 'fiction';
  status: string;
  description: string;
  current_word_count: number;
  target_word_count: number;
  purpose: string | null;
  overview: string | null;
  book_structure: string | null;
  table_of_contents: string | null;
}

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
}

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback static data
  const fallbackBook: Book = {
    id: "54a14d89-b819-4362-be2f-bb1760c848e6",
    title: "Stardust to Sovereignty",
    type: "non_fiction",
    status: "in_progress",
    description: "A comprehensive guide to consciousness technology and the 13-Orb framework for sovereignty",
    current_word_count: 25000,
    target_word_count: 80000,
    purpose: "To provide a comprehensive framework for understanding and developing sovereign consciousness through 13 fundamental Orbs.",
    overview: "This book explores the intersection of science, spirituality, and consciousness technology, offering practical tools for personal and collective evolution.",
    book_structure: "The book is organized into four main parts: The Cosmic Tapestry, The Sovereign Self, Architecting Reality, and Embodying Sovereignty.",
    table_of_contents: "1. Introduction\n2. The Body as Advanced Biological Technology\n3. Metabolic Intelligence\n4. Resonance and the Energetic Universe\n5. Defining Energetic Sovereignty"
  };

  const fallbackChapters: Chapter[] = [
    {
      id: "1d560c79-f36f-4488-b075-5986d44f85bf",
      book_id: "54a14d89-b819-4362-be2f-bb1760c848e6",
      chapter_number: 1,
      title: "Introduction: We Are Made of Stardust",
      part_number: 1,
      part_title: "The Cosmic Tapestry",
      status: "complete",
      word_count: 2500,
      content: "We are made of stardust, animated by bioelectric forces...",
      notes: "Introduction to the Stardust to Sovereignty premise",
      orb_focus: "Orb 1 (Origin Intelligence)",
      source_file_ids: ["origin_intelligence_pulse.md"],
      scrollstreams: ["To feast on the galaxy is to absorb the vibrations of stars"]
    }
  ];

  useEffect(() => {
    loadBook();
  }, [bookId]);

  async function loadBook() {
    try {
      setLoading(true);
      setError(null);
      
      // Load book details
      const bookResponse = await fetch(`/api/books/${bookId}`);
      if (bookResponse.ok) {
        const bookData = await bookResponse.json();
        setBook(bookData.book);
      } else {
        console.warn('Book API failed, using fallback data');
        setBook(fallbackBook);
      }

      // Load chapters
      const chaptersResponse = await fetch(`/api/books/${bookId}/chapters`);
      if (chaptersResponse.ok) {
        const chaptersData = await chaptersResponse.json();
        setChapters(chaptersData.chapters || []);
      } else {
        console.warn('Chapters API failed, using fallback data');
        setChapters(fallbackChapters);
      }
    } catch (err) {
      console.error('Error loading book:', err);
      setError('Failed to load book data');
      setBook(fallbackBook);
      setChapters(fallbackChapters);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-backend-secondary flex items-center justify-center">
        <div className="text-backend-primary text-2xl">Loading book...</div>
      </div>
    );
  }

  const displayBook = book || fallbackBook;
  const displayChapters = chapters.length > 0 ? chapters : fallbackChapters;

  // Helper function to render markdown-like content
  const renderMarkdownContent = (content: string) => {
    if (!content) return null;
    
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-semibold text-gray-900 mb-2">
            {line.slice(2, -2)}
          </div>
        );
      }
      
      if (line.match(/^\d+\./)) {
        return (
          <div key={index} className="ml-4 mb-1 text-gray-600">
            {line}
          </div>
        );
      }
      
      return (
        <div key={index} className="text-gray-600 mb-2">
          {line}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-backend-secondary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-backend-primary mb-2">{displayBook.title}</h1>
          <p className="text-base text-backend-secondary">{displayBook.description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Purpose and Overview Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {displayBook.purpose && (
                <div className="bg-white border border-backend-default rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Purpose</h2>
                  <div className="prose prose-sm max-w-none">
                    {renderMarkdownContent(displayBook.purpose)}
                  </div>
                </div>
              )}
              
              {displayBook.overview && (
                <div className="bg-white border border-backend-default rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Overview</h2>
                  <div className="prose prose-sm max-w-none">
                    {renderMarkdownContent(displayBook.overview)}
                  </div>
                </div>
              )}
            </div>

            {/* Book Structure */}
            {displayBook.book_structure && (
              <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Structure</h2>
                <div className="prose prose-sm max-w-none">
                  {renderMarkdownContent(displayBook.book_structure)}
                </div>
              </div>
            )}

            {/* Table of Contents */}
            {displayBook.table_of_contents && (
              <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
                <div className="prose prose-sm max-w-none">
                  {renderMarkdownContent(displayBook.table_of_contents)}
                </div>
              </div>
            )}

            {/* Chapters */}
            <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Chapters</h2>
              <div className="space-y-3">
                {displayChapters.map((chapter) => (
                  <div key={chapter.id} className="border border-backend-default rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Chapter {chapter.chapter_number}: {chapter.title}
                        </h3>
                        {chapter.part_title && (
                          <p className="text-sm text-gray-600">
                            {chapter.part_title}
                          </p>
                        )}
                        {chapter.orb_focus && (
                          <p className="text-xs text-deep-gold mt-1">
                            {chapter.orb_focus}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        chapter.status === 'complete'
                          ? 'bg-green-100 text-green-700'
                          : chapter.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {chapter.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {chapter.notes && (
                      <p className="text-sm text-gray-600 mb-2">
                        {chapter.notes}
                      </p>
                    )}
                    
                    {chapter.scrollstreams && chapter.scrollstreams.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 mb-1">Scrollstreams:</p>
                        <div className="text-xs text-deep-gold">
                          {chapter.scrollstreams.slice(0, 2).map((stream, idx) => (
                            <div key={idx}>• {stream}</div>
                          ))}
                          {chapter.scrollstreams.length > 2 && (
                            <div>• +{chapter.scrollstreams.length - 2} more...</div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {chapter.word_count.toLocaleString()} words
                      </span>
                      <Link 
                        href={`/creator/book-compiler/${bookId}/chapters/${chapter.id}`}
                        className="px-3 py-1 bg-deep-navy text-creamy-white rounded text-sm hover:bg-[#2A2D4A] transition-colors"
                      >
                        Edit Chapter
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Word Count</span>
                  <span className="font-medium text-gray-900">
                    {displayBook.current_word_count.toLocaleString()} / {displayBook.target_word_count.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapters</span>
                  <span className="font-medium text-gray-900">{displayChapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-gray-900">
                    {displayBook.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-deep-gold h-2 rounded-full" 
                    style={{
                      width: `${Math.min(100, (displayBook.current_word_count / displayBook.target_word_count) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-deep-navy text-creamy-white rounded hover:bg-[#2A2D4A] transition-colors">
                  Add Chapter
                </button>
                <button className="w-full px-4 py-2 bg-deep-gold text-deep-navy rounded hover:bg-creamy-white transition-colors">
                  Map Content
                </button>
                <button className="w-full px-4 py-2 border border-backend-default text-gray-900 rounded hover:bg-backend-secondary transition-colors">
                  Export Book
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}