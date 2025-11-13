'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/backend/Card';
import { Button } from '@/components/backend/Button';
import ResonanceSidebar from '@/components/resonance/ResonanceSidebar';

interface ContentFile {
  id: string;
  title: string;
  content_type: string;
  orb_associations: string[] | number[]; // Can be strings like "Orb 1: Origin Intelligence" or numbers
  tags: string[];
  yaml_frontmatter?: any;
}

interface OrbData {
  id: number;
  name: string;
  contentCount: number;
  contentFiles: ContentFile[];
}

export default function ContentMatrixPage() {
  const [contentFiles, setContentFiles] = useState<ContentFile[]>([]);
  const [orbData, setOrbData] = useState<OrbData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrb, setSelectedOrb] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  useEffect(() => {
    // Add a small delay to ensure component is fully hydrated
    const timer = setTimeout(() => {
      loadContentData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  async function loadContentData() {
    try {
      console.log('Loading content data...');
      const response = await fetch('/api/content-files');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Data received:', data);
      
      if (data.contentFiles) {
        setContentFiles(data.contentFiles);
        
        // Group content by Orbs
        const orbMap: { [key: number]: ContentFile[] } = {};
        
        data.contentFiles.forEach((file: ContentFile) => {
          if (file.orb_associations) {
            file.orb_associations.forEach(orb => {
              // Extract orb number from string like "Orb 1: Origin Intelligence"
              let orbNum: number | null = null;
              if (typeof orb === 'string') {
                const match = orb.match(/Orb\s+(\d+)/i);
                if (match) orbNum = parseInt(match[1], 10);
              } else if (typeof orb === 'number') {
                orbNum = orb;
              }
              
              if (orbNum && orbNum >= 1 && orbNum <= 13) {
                if (!orbMap[orbNum]) orbMap[orbNum] = [];
                orbMap[orbNum].push(file);
              }
            });
          }
        });

        // Create Orb data
        const orbs: OrbData[] = [];
        for (let i = 1; i <= 13; i++) {
          orbs.push({
            id: i,
            name: `Orb ${i}`,
            contentCount: orbMap[i]?.length || 0,
            contentFiles: orbMap[i] || []
          });
        }
        
        setOrbData(orbs);
        console.log('Content data loaded successfully');
      }
    } catch (err) {
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredContent = selectedOrb 
    ? orbData.find(orb => orb.id === selectedOrb)?.contentFiles || []
    : contentFiles.filter(file => 
        filterType === 'all' || file.content_type === filterType
      );

  const contentTypes = [...new Set(contentFiles.map(f => f.content_type))];

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-creamy-white text-2xl">Loading content matrix...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-creamy-white mb-4">
            Content Relationship Matrix
          </h1>
          <p className="text-creamy-white/80 text-lg">
            Explore content relationships through Orbs and connections
          </p>
        </div>

        {/* Orb Overview */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-backend-primary mb-6">Orb Content Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {orbData.map(orb => (
              <button
                key={orb.id}
                onClick={() => setSelectedOrb(selectedOrb === orb.id ? null : orb.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedOrb === orb.id
                    ? 'border-deep-gold bg-deep-gold/20 text-deep-gold'
                    : 'border-backend-default bg-backend-secondary hover:border-backend-hover'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{orb.id}</div>
                  <div className="text-xs text-backend-muted mb-1">{orb.name}</div>
                  <div className="text-sm text-backend-muted">{orb.contentCount} files</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-backend-primary font-medium mb-2 block">Filter by Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-backend-default rounded-lg bg-backend-secondary text-backend-primary"
              >
                <option value="all">All Types</option>
                {contentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {selectedOrb && (
              <Button
                onClick={() => setSelectedOrb(null)}
                variant="secondary"
              >
                Clear Orb Filter
              </Button>
            )}
          </div>
        </Card>

        {/* Content Display */}
        <Card>
          <h2 className="text-2xl font-bold text-backend-primary mb-6">
            {selectedOrb 
              ? `Content for ${orbData.find(o => o.id === selectedOrb)?.name}` 
              : 'All Content'
            } ({filteredContent.length} files)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map(file => (
              <div
                key={file.id}
                className="p-4 border border-backend-default rounded-lg hover:border-backend-hover transition-all bg-backend-secondary"
              >
                <Link
                  href={`/creator/library/${file.id}`}
                  className="block"
                  onMouseEnter={() => setSelectedFileId(file.id)}
                  onMouseLeave={() => setSelectedFileId(null)}
                >
                <h3 className="font-semibold text-backend-primary mb-2 line-clamp-2">
                  {file.title}
                </h3>
                <div className="text-sm text-backend-muted mb-2">
                  {file.content_type}
                </div>
                {file.orb_associations && Array.isArray(file.orb_associations) && file.orb_associations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {file.orb_associations.slice(0, 3).map((orb, idx) => {
                      // Extract orb number from string like "Orb 1: Origin Intelligence" or use number directly
                      let orbNum: number | null = null;
                      if (typeof orb === 'string') {
                        const match = orb.match(/Orb\s+(\d+)/i);
                        if (match) orbNum = parseInt(match[1], 10);
                      } else if (typeof orb === 'number') {
                        orbNum = orb;
                      }
                      
                      return orbNum ? (
                      <span
                          key={`${file.id}-orb-${orbNum}-${idx}`}
                          className="px-2 py-1 bg-deep-gold/20 text-deep-gold text-xs rounded font-medium"
                      >
                          Orb {orbNum}
                      </span>
                      ) : null;
                    }).filter(Boolean)}
                    {file.orb_associations.length > 3 && (
                      <span className="text-backend-muted text-xs">
                        +{file.orb_associations.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                {file.tags && Array.isArray(file.tags) && file.tags.length > 0 && (
                  <div className="text-xs text-backend-muted">
                    {file.tags.slice(0, 3).join(', ')}
                    {file.tags.length > 3 && '...'}
                  </div>
                )}
                </Link>

                {/* Show resonance sidebar on hover/click */}
                {selectedFileId === file.id && (
                  <div className="mt-3">
                    <ResonanceSidebar 
                      contentId={file.id} 
                      title={file.title}
                      onClose={() => setSelectedFileId(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
