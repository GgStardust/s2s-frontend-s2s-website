'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card } from '@/components/backend';

interface SmartContent {
  content_id: string;
  title: string;
  content_type: string;
  relevance_score: number;
  reasoning: string;
  orb_associations: number[];
  tags: string[];
  excerpt: string;
  usage_suggestion: string;
}

interface SmartMapping {
  chapter_id: string;
  chapter_title: string;
  chapter_purpose: string;
  suggested_content: SmartContent[];
  chapter_outline: string;
  content_flow: string;
}

interface SmartMappingData {
  book_id: string;
  book_title: string;
  book_type: string;
  mapping: SmartMapping[];
  total_chapters: number;
  total_content_files: number;
  ai_analysis: {
    book_theme: string;
    content_coverage: any;
    orb_distribution: any;
    recommended_approach: string;
  };
  timestamp: string;
}

export default function SmartMappingPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [mappingData, setMappingData] = useState<SmartMappingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{ [chapterId: string]: string[] }>({});
  const [applying, setApplying] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have stored mapping data
    const stored = sessionStorage.getItem('smart_mapping_data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setMappingData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error parsing stored mapping data:', err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  async function generateSmartMapping() {
    setGenerating(true);
    try {
      const response = await fetch('/api/ai/smart-book-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: bookId }),
      });

      if (response.ok) {
        const data = await response.json();
        setMappingData(data);
        sessionStorage.setItem('smart_mapping_data', JSON.stringify(data));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate smart mapping');
      }
    } catch (err) {
      console.error('Error generating smart mapping:', err);
      alert('Failed to generate smart mapping');
    } finally {
      setGenerating(false);
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

  async function applySmartMapping() {
    setApplying(true);
    try {
      const response = await fetch('/api/ai/apply-content-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: bookId,
          content_mapping: selectedContent
        })
      });

      if (response.ok) {
        alert('Smart content mapping applied successfully!');
        sessionStorage.removeItem('smart_mapping_data');
        router.push(`/creator/book-compiler/${bookId}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to apply content mapping');
      }
    } catch (err) {
      console.error('Error applying smart mapping:', err);
      alert('Failed to apply content mapping');
    } finally {
      setApplying(false);
    }
  }

  function getRelevanceColor(score: number): string {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50';
    if (score >= 0.4) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  }

  function getRelevanceLabel(score: number): string {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-backend-secondary flex items-center justify-center">
        <div className="text-backend-primary text-lg">Loading smart mapping...</div>
      </div>
    );
  }

  if (!mappingData) {
    return (
      <div className="min-h-screen bg-backend-secondary">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-backend-primary mb-4">
              AI-Powered Content Mapping
            </h1>
            <p className="text-backend-secondary mb-8">
              Use AI to intelligently map your content library to book chapters
            </p>
            <Button
              onClick={generateSmartMapping}
              disabled={generating}
              variant="primary"
              className="text-lg px-8 py-3"
            >
              {generating ? 'Analyzing Content...' : 'Generate Smart Mapping'}
            </Button>
          </div>
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
                AI Content Mapping: {mappingData.book_title}
              </h1>
              <p className="text-backend-secondary">
                Intelligent content mapping powered by AI analysis
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-backend-secondary">
                {totalSelected} content pieces selected
              </div>
              <Button
                onClick={applySmartMapping}
                disabled={applying || totalSelected === 0}
                variant="primary"
              >
                {applying ? 'Applying...' : `Apply ${totalSelected} Selections`}
              </Button>
            </div>
          </div>
        </div>

        {/* AI Analysis Summary */}
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-backend-primary mb-4">AI Analysis Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-backend-primary mb-2">Book Theme</h4>
              <p className="text-backend-secondary text-sm">{mappingData.ai_analysis.book_theme}</p>
            </div>
            <div>
              <h4 className="font-medium text-backend-primary mb-2">Recommended Approach</h4>
              <p className="text-backend-secondary text-sm">{mappingData.ai_analysis.recommended_approach}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-backend-primary mb-2">Content Coverage</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-backend-primary">{mappingData.total_content_files}</div>
                <div className="text-backend-secondary text-sm">Total Content</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-backend-primary">{mappingData.total_chapters}</div>
                <div className="text-backend-secondary text-sm">Chapters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-backend-primary">{totalSelected}</div>
                <div className="text-backend-secondary text-sm">Selected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-backend-primary">
                  {Object.keys(mappingData.ai_analysis.orb_distribution).filter(orb => 
                    mappingData.ai_analysis.orb_distribution[orb].count > 0
                  ).length}
                </div>
                <div className="text-backend-secondary text-sm">Orbs Covered</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Chapter Mappings */}
        <div className="space-y-8">
          {mappingData.mapping.map((chapterMapping) => (
            <Card key={chapterMapping.chapter_id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-backend-primary">
                    {chapterMapping.chapter_title}
                  </h3>
                  <Button
                    onClick={() => setActiveChapter(
                      activeChapter === chapterMapping.chapter_id ? null : chapterMapping.chapter_id
                    )}
                    variant="secondary"
                    className="text-sm"
                  >
                    {activeChapter === chapterMapping.chapter_id ? 'Hide Details' : 'Show Details'}
                  </Button>
                </div>

                <p className="text-backend-secondary mb-4">{chapterMapping.chapter_purpose}</p>

                {activeChapter === chapterMapping.chapter_id && (
                  <div className="mb-6 p-4 bg-backend-accent rounded-lg">
                    <h4 className="font-medium text-backend-primary mb-2">Chapter Outline</h4>
                    <p className="text-backend-secondary text-sm mb-3">{chapterMapping.chapter_outline}</p>
                    <h4 className="font-medium text-backend-primary mb-2">Content Flow</h4>
                    <p className="text-backend-secondary text-sm">{chapterMapping.content_flow}</p>
                  </div>
                )}

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
                            <h4 className="font-semibold text-backend-primary text-sm line-clamp-2">
                              {content.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getRelevanceColor(content.relevance_score)}`}>
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

                          <div className="mb-2">
                            <p className="text-xs text-backend-primary font-medium mb-1">AI Reasoning:</p>
                            <p className="text-xs text-backend-secondary">{content.reasoning}</p>
                          </div>

                          <div className="mb-2">
                            <p className="text-xs text-backend-primary font-medium mb-1">Usage Suggestion:</p>
                            <p className="text-xs text-backend-secondary">{content.usage_suggestion}</p>
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

                          <p className="text-xs text-backend-secondary line-clamp-3 mb-3">
                            {content.excerpt}
                          </p>

                          {content.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
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

                          <div className="pt-2 border-t border-backend-default">
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


