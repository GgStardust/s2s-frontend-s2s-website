'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card } from '@/components/backend';

interface ContentMapping {
  chapter_id: string;
  chapter_title: string;
  suggested_content: {
    content_id: string;
    title: string;
    content_type: string;
    relevance_score: number;
    orb_associations: number[];
    tags: string[];
    excerpt: string;
  }[];
}

interface MappingData {
  book_id: string;
  book_title: string;
  mapping: ContentMapping[];
  total_chapters: number;
  total_content_files: number;
  timestamp: string;
}

export default function ContentMappingPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [mappingData, setMappingData] = useState<MappingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<{ [chapterId: string]: string[] }>({});
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadMappingData();
  }, []);

  async function loadMappingData() {
    try {
      // Get mapping data from session storage
      const stored = sessionStorage.getItem('content_mapping');
      if (stored) {
        const data = JSON.parse(stored);
        setMappingData(data);
      } else {
        // If no stored data, redirect back to book
        router.push(`/creator/book-compiler/${bookId}`);
        return;
      }
    } catch (err) {
      console.error('Error loading mapping data:', err);
    } finally {
      setLoading(false);
    }
  }

  function toggleContentSelection(chapterId: string, contentId: string) {
    setSelectedContent(prev => {
      const chapterSelections = prev[chapterId] || [];
      const isSelected = chapterSelections.includes(contentId);
      
      if (isSelected) {
        return {
          ...prev,
          [chapterId]: chapterSelections.filter(id => id !== contentId)
        };
      } else {
        return {
          ...prev,
          [chapterId]: [...chapterSelections, contentId]
        };
      }
    });
  }

  async function applyContentMapping() {
    setApplying(true);
    try {
      // Apply the selected content to chapters
      const response = await fetch('/api/ai/apply-content-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: bookId,
          content_mapping: selectedContent
        })
      });

      if (response.ok) {
        alert('Content mapping applied successfully!');
        router.push(`/creator/book-compiler/${bookId}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to apply content mapping');
      }
    } catch (err) {
      console.error('Error applying content mapping:', err);
      alert('Failed to apply content mapping');
    } finally {
      setApplying(false);
    }
  }

  function getRelevanceColor(score: number): string {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    if (score >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  }

  function getRelevanceLabel(score: number): string {
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    if (score >= 0.4) return 'Low';
    return 'Very Low';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-backend-secondary flex items-center justify-center">
        <div className="text-backend-primary text-lg">Loading content mapping...</div>
      </div>
    );
  }

  if (!mappingData) {
    return (
      <div className="min-h-screen bg-backend-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="text-backend-primary text-lg mb-4">No mapping data found</div>
          <Link href={`/creator/book-compiler/${bookId}`}>
            <Button variant="primary">Back to Book</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalSelected = Object.values(selectedContent).flat().length;

  return (
    <div className="min-h-screen bg-backend-secondary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/creator/book-compiler/${bookId}`}
            className="text-backend-secondary hover:text-backend-primary mb-4 inline-block"
          >
            ← Back to Book
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-backend-primary mb-2">
                Content Mapping: {mappingData.book_title}
              </h1>
              <p className="text-backend-secondary">
                Review and select content to map to your book chapters
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-backend-secondary">
                {totalSelected} content pieces selected
              </div>
              <Button
                onClick={applyContentMapping}
                disabled={applying || totalSelected === 0}
                variant="primary"
              >
                {applying ? 'Applying...' : `Apply ${totalSelected} Selections`}
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-backend-primary">{mappingData.total_chapters}</div>
              <div className="text-backend-secondary text-sm">Chapters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-backend-primary">{mappingData.total_content_files}</div>
              <div className="text-backend-secondary text-sm">Available Content</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-backend-primary">{totalSelected}</div>
              <div className="text-backend-secondary text-sm">Selected</div>
            </div>
          </div>
        </Card>

        {/* Chapter Mappings */}
        <div className="space-y-8">
          {mappingData.mapping.map((chapterMapping) => (
            <Card key={chapterMapping.chapter_id} title={`Chapter: ${chapterMapping.chapter_title}`}>
              <div className="space-y-4">
                {chapterMapping.suggested_content.length === 0 ? (
                  <div className="text-center py-8 text-backend-secondary">
                    No relevant content found for this chapter
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chapterMapping.suggested_content.map((content) => {
                      const isSelected = selectedContent[chapterMapping.chapter_id]?.includes(content.content_id) || false;
                      
                      return (
                        <div
                          key={content.content_id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-backend-primary bg-backend-primary/5'
                              : 'border-backend-default hover:border-backend-hover'
                          }`}
                          onClick={() => toggleContentSelection(chapterMapping.chapter_id, content.content_id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-backend-primary text-sm line-clamp-2">
                              {content.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-medium ${getRelevanceColor(content.relevance_score)}`}>
                                {getRelevanceLabel(content.relevance_score)}
                              </span>
                              <span className="text-xs text-backend-secondary">
                                {(content.relevance_score * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-backend-secondary mb-2">
                            {content.content_type}
                          </div>

                          {content.orb_associations && Array.isArray(content.orb_associations) && content.orb_associations.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {content.orb_associations.slice(0, 3).map((orb) => (
                                <span
                                  key={orb}
                                  className="px-2 py-1 bg-deep-gold/20 text-deep-gold rounded text-xs"
                                >
                                  Orb {orb}
                                </span>
                              ))}
                              {content.orb_associations.length > 3 && (
                                <span className="text-xs text-backend-secondary">
                                  +{content.orb_associations.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-backend-secondary line-clamp-3">
                            {content.excerpt}
                          </p>

                          {content.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {content.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-1 py-0.5 bg-backend-accent text-backend-primary rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {content.tags.length > 3 && (
                                <span className="text-xs text-backend-secondary">
                                  +{content.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="mt-3 pt-2 border-t border-backend-default">
                            <Link
                              href={`/creator/library/${content.content_id}`}
                              className="text-xs text-backend-primary hover:text-backend-hover underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Full Content →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}