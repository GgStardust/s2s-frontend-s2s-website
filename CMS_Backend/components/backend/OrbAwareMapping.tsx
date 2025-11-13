'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface ContentFile {
  id: string;
  title: string;
  content_type: string;
  orb_associations: number[];
  tags: string[];
  yaml_frontmatter: any;
  matchScore: number;
}

interface OrbContext {
  primary_orb?: string;
  secondary_orbs?: string[];
  integration_points?: string[];
}

interface OrbAwareMappingProps {
  chapterId: string;
  bookId: string;
  onClose: () => void;
  onContentSelected?: (contentIds: string[]) => void;
}

export default function OrbAwareMapping({ chapterId, bookId, onClose, onContentSelected }: OrbAwareMappingProps) {
  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState<any>(null);
  const [orbContext, setOrbContext] = useState<OrbContext | null>(null);
  const [matches, setMatches] = useState<ContentFile[]>([]);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMappingData();
  }, [chapterId, bookId]);

  async function loadMappingData() {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/orb-aware-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, bookId })
      });

      if (!response.ok) {
        throw new Error('Failed to load mapping data');
      }

      const data = await response.json();
      setChapter(data.chapter);
      setOrbContext(data.orbContext);
      setMatches(data.matches);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleContentSelection(contentId: string) {
    setSelectedContent(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  }

  function handleApplyMapping() {
    if (onContentSelected && selectedContent.length > 0) {
      onContentSelected(selectedContent);
    }
    onClose();
  }

  function displayContentFile(file: ContentFile, index: number) {
    const isSelected = selectedContent.includes(file.id);
    
    return (
      <Card 
        key={file.id} 
        className={`cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'border-deep-gold bg-deep-gold/10' 
            : 'hover:border-backend-hover'
        }`}
        onClick={() => toggleContentSelection(file.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-backend-primary mb-2">
              {file.title}
            </h4>
            <p className="text-backend-secondary text-sm mb-2">
              Type: {file.content_type}
            </p>
            
            {/* Orb-aware information */}
            {file.yaml_frontmatter && file.yaml_frontmatter.orb_associations ? (
              <div className="space-y-1 mb-2">
                {file.yaml_frontmatter.orb_associations.primary_orb && (
                  <p className="text-deep-gold text-sm">
                    <span className="font-medium">Primary Orb:</span> {file.yaml_frontmatter.orb_associations.primary_orb}
                  </p>
                )}
                {file.yaml_frontmatter.orb_associations.secondary_orbs && file.yaml_frontmatter.orb_associations.secondary_orbs.length > 0 && (
                  <p className="text-deep-gold text-sm">
                    <span className="font-medium">Secondary Orbs:</span> {file.yaml_frontmatter.orb_associations.secondary_orbs.join(', ')}
                  </p>
                )}
                {file.yaml_frontmatter.integration_points && file.yaml_frontmatter.integration_points.length > 0 && (
                  <p className="text-cosmic-blue text-sm">
                    <span className="font-medium">Integration Points:</span> {file.yaml_frontmatter.integration_points.join(', ')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-backend-muted text-sm mb-2">
                Orbs: {file.orb_associations?.join(', ') || 'None'}
              </p>
            )}
            
            <p className="text-backend-muted text-sm">
              Tags: {(file.tags || []).slice(0, 3).join(', ')}{file.tags && file.tags.length > 3 ? '...' : ''}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-deep-gold font-bold text-lg">
              {file.matchScore.toFixed(1)}
            </div>
            <div className="text-backend-muted text-xs">Score</div>
            {isSelected && (
              <div className="text-deep-gold text-sm font-medium mt-1">
                ✓ Selected
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="max-w-2xl w-full mx-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-gold mx-auto mb-4"></div>
            <p className="text-backend-primary">Loading Orb-aware mapping...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="max-w-2xl w-full mx-4">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button onClick={onClose} variant="secondary">Close</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-backend-default">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-backend-primary">
                S2S Codex Operator - Content Mapping
              </h2>
              <p className="text-backend-secondary mt-1">
                Chapter: {chapter?.title}
              </p>
            </div>
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Orb-aware context display */}
          {orbContext && (
            <Card className="mb-6 bg-deep-navy/10 border-deep-gold/30">
              <h3 className="text-lg font-semibold text-deep-gold mb-3">
                Orb-Aware Mode Detected
              </h3>
              <div className="space-y-2">
                {orbContext.primary_orb && (
                  <p className="text-backend-primary">
                    <span className="font-medium">Primary Orb:</span> {orbContext.primary_orb}
                  </p>
                )}
                {orbContext.secondary_orbs && orbContext.secondary_orbs.length > 0 && (
                  <p className="text-backend-primary">
                    <span className="font-medium">Secondary Orbs:</span> {orbContext.secondary_orbs.join(', ')}
                  </p>
                )}
                {orbContext.integration_points && orbContext.integration_points.length > 0 && (
                  <p className="text-cosmic-blue">
                    <span className="font-medium">Integration Points:</span> {orbContext.integration_points.join(', ')}
                  </p>
                )}
              </div>
              <p className="text-backend-muted text-sm mt-2">
                This content is configured for S2S Codex integration.
              </p>
            </Card>
          )}

          {/* Content matches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-backend-primary">
                Content Matches ({matches.length})
              </h3>
              {selectedContent.length > 0 && (
                <div className="text-deep-gold font-medium">
                  {selectedContent.length} selected
                </div>
              )}
            </div>

            {matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((file, index) => displayContentFile(file, index))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <p className="text-backend-muted">No matching content found.</p>
              </Card>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-backend-default bg-backend-secondary">
          <div className="flex items-center justify-between">
            <div className="text-backend-muted text-sm">
              {selectedContent.length > 0 
                ? `${selectedContent.length} content file(s) selected for mapping`
                : 'Select content files to map to this chapter'
              }
            </div>
            <div className="flex gap-3">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button 
                onClick={handleApplyMapping}
                disabled={selectedContent.length === 0}
                variant="primary"
              >
                Map Selected Content ({selectedContent.length})
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


