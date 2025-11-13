'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  type: 'non_fiction' | 'fiction';
  status: string;
  description: string;
  current_word_count: number;
  target_word_count: number;
}

export default function BookCompilerPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      setLoading(true);
      console.log('Loading books...');
      const response = await fetch('/api/books');
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Books data:', data);
        setBooks(data.books || []);
      } else {
        console.error('Response not ok:', response.status);
      }
    } catch (err) {
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  }

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(book => {
    const matchesType = filterType === 'all' || book.type === filterType;
    const matchesSearch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const nonFictionBooks = filteredBooks.filter(book => book.type === 'non_fiction');
  const fictionBooks = filteredBooks.filter(book => book.type === 'fiction');

  return (
    <div className="min-h-screen bg-backend-secondary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-backend-primary mb-2">Book Compiler</h1>
            <p className="text-base text-backend-secondary">Intelligent book compilation system</p>
          </div>
          <Link
            href="/creator/book-compiler/create"
            className="px-4 py-2 bg-deep-navy text-creamy-white rounded-lg hover:bg-[#2A2D4A] transition-colors"
          >
            + Create New Book
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books..."
            className="flex-1 px-4 py-2 border border-backend-default rounded-lg bg-white"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-backend-default rounded-lg bg-white"
          >
            <option value="all">All Types</option>
            <option value="non_fiction">Non-Fiction</option>
            <option value="fiction">Fiction</option>
          </select>
        </div>
        
        {/* Unified Library View - All Books */}
        <div className="bg-white border border-backend-default rounded-lg shadow-sm p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-backend-primary">
              All Books ({filteredBooks.length})
            </h2>
            {(nonFictionBooks.length > 0 || fictionBooks.length > 0) && (
              <div className="flex gap-2 text-sm">
                <span className="px-3 py-1 bg-deep-navy/10 text-deep-navy rounded">
                  {nonFictionBooks.length} Non-Fiction
                </span>
                <span className="px-3 py-1 bg-deep-gold/10 text-deep-gold rounded">
                  {fictionBooks.length} Fiction
                </span>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-backend-secondary">Loading books...</div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12 text-backend-secondary">
              <p className="mb-4">No books found</p>
              <Link
                href="/creator/book-compiler/create"
                className="px-4 py-2 bg-deep-navy text-creamy-white rounded-lg hover:bg-[#2A2D4A] transition-colors inline-block"
              >
                Create Your First Book
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/creator/book-compiler/${book.id}`}
                  className="border border-backend-default rounded-lg p-5 hover:border-backend-hover hover:shadow-md transition-all bg-backend-secondary"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-backend-primary text-lg line-clamp-2">
                      {book.title}
                    </h3>
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      book.type === 'non_fiction' 
                        ? 'bg-deep-navy/10 text-deep-navy' 
                        : 'bg-deep-gold/10 text-deep-gold'
                    }`}>
                      {book.type === 'non_fiction' ? 'NF' : 'F'}
                    </span>
                  </div>
                  {book.description && (
                    <p className="text-sm text-backend-muted mb-3 line-clamp-2">
                      {book.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-backend-secondary">
                      {book.current_word_count?.toLocaleString() || 0} / {book.target_word_count?.toLocaleString() || 0} words
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      book.status === 'complete' 
                        ? 'bg-green-100 text-green-700'
                        : book.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {book.status || 'draft'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}