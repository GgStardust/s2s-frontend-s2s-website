'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button, Card, Input, PageHeader, EmptyState } from '@/components/backend';
import ResonanceDiscovery from '@/components/resonance/ResonanceDiscovery';

interface ContentFile {
  id: string;
  title: string;
  file_path: string;
  content_type: string;
  status: string;
  orb_associations: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
  yaml_frontmatter?: any;
  markdown_body?: string;
}

export default function ContentLibraryPage() {
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterOrb, setFilterOrb] = useState<number | null>(null);
  const [filterTag, setFilterTag] = useState<string>('all');
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadFiles();
  }, []);

  async function loadFiles() {
    try {
      console.log('Starting to load files...');
      
      // Try using the API endpoint instead of direct Supabase client
      const response = await fetch('/api/content-files');
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        console.error('API error:', response.status, response.statusText);
        setFiles([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('API data loaded:', data?.contentFiles?.length || 0, 'files');
      console.log('Sample file:', data?.contentFiles?.[0]);
      
      // Extract contentFiles from the API response
      const contentFiles = data.contentFiles || [];
      if (Array.isArray(contentFiles)) {
        setFiles(contentFiles);
        console.log('Files set successfully:', contentFiles.length);
        setLoading(false);
      } else {
        console.error('API returned non-array contentFiles:', typeof contentFiles);
        setFiles([]);
        setLoading(false);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setFiles([]);
      setLoading(false);
    }
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch =
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.file_path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.tags && Array.isArray(file.tags) && file.tags.some(tag => tag && tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesType = filterType === 'all' || file.content_type === filterType;
    
    // Fix orb association filtering - extract orb number from strings like "Orb 1: Origin Intelligence"
    const matchesOrb = !filterOrb || (file.orb_associations && 
      Array.isArray(file.orb_associations) &&
      file.orb_associations.some(orb => {
        if (orb == null || typeof orb !== 'string') return false;
        const match = orb.match(/Orb\s+(\d+)/i);
        return match && parseInt(match[1], 10) === filterOrb;
      }));
    
    const matchesTag = filterTag === 'all' || (file.tags && Array.isArray(file.tags) && file.tags.includes(filterTag));

    return matchesSearch && matchesType && matchesOrb && matchesTag;
  });

  const contentTypes = [...new Set(files.map(f => f.content_type).filter(Boolean))];
  
  // Filter out system tags and scrollstream content from sortable tags
  const systemTags = ['@scrollstream', '@orb1', '@orb2', '@orb3', '@orb4', '@orb5', '@orb6', '@orb7', '@orb8', '@orb9', '@orb10', '@orb11', '@orb12', '@orb13'];
  const allTags = [...new Set(files.flatMap(f => (Array.isArray(f.tags) ? f.tags : []) || []))]
    .filter(tag => {
      if (!tag) return false;
      // Exclude system tags
      if (systemTags.includes(tag)) return false;
      // Exclude any tag that starts with @scrollstream
      if (tag.toLowerCase().includes('scrollstream')) return false;
      // Exclude very long tags (likely content, not metadata)
      if (tag.length > 50) return false;
      return true;
    })
    .sort();
  
  const filteredTags = allTags.filter(tag =>
    tag && tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-backend-secondary flex items-center justify-center">
        <div className="text-backend-primary text-lg">Loading content library...</div>
        <div className="text-backend-muted text-sm mt-2">Debug: {isClient ? `${files.length} files loaded` : 'Initializing...'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backend-secondary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageHeader
          title="Content Library"
          subtitle={`${files.length} files imported from 09_PROCESSED`}
          action={
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={loadFiles}
                disabled={loading}
                title="Reload from database"
              >
                {loading ? 'Refreshing...' : '🔄 Refresh DB'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={async () => {
                  setLoading(true);
                  try {
                    const response = await fetch('/api/content-files/sync', {
                      method: 'POST',
                    });
                    const result = await response.json();
                    if (result.success) {
                      await loadFiles(); // Reload after sync
                      alert('Content library synced successfully');
                    } else {
                      alert(`Sync failed: ${result.error}`);
                    }
                  } catch (error: any) {
                    alert(`Sync error: ${error.message}`);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                title="Re-scan file system and sync to database"
              >
                {loading ? 'Syncing...' : '🔁 Sync FS'}
              </Button>
              <Link href="/creator/library/new">
                <Button variant="primary">+ Create New Content</Button>
              </Link>
            </div>
          }
        />

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search titles, paths, tags..."
              label="Search"
            />

            <div>
              <label className="block text-sm font-medium text-backend-primary mb-1.5">
                Content Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-backend-default rounded-md text-backend-primary focus:outline-none focus:ring-2 focus:ring-backend-focus focus:border-transparent"
              >
                <option value="all">All Types</option>
                {contentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-backend-primary mb-1.5">
                Orb Association
              </label>
              <select
                value={filterOrb || ''}
                onChange={(e) => setFilterOrb(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 bg-white border border-backend-default rounded-md text-backend-primary focus:outline-none focus:ring-2 focus:ring-backend-focus focus:border-transparent"
              >
                <option value="">All Orbs</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(orb => (
                  <option key={orb} value={orb}>Orb {orb}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-backend-primary mb-1.5">
                Tag ({allTags.length} tags)
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full px-3 py-2 bg-white border border-backend-default rounded-md text-backend-primary text-sm focus:outline-none focus:ring-2 focus:ring-backend-focus focus:border-transparent"
                />
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-backend-default rounded-md text-backend-primary text-sm focus:outline-none focus:ring-2 focus:ring-backend-focus focus:border-transparent"
                  size={5}
                >
                  <option value="all">All Tags</option>
                  {filteredTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-backend-secondary">
          Showing {filteredFiles.length} of {files.length} files
        </div>

        {/* File List */}
        <div className="space-y-3">
          {filteredFiles.length === 0 ? (
            <Card>
              <EmptyState
                title="No files match your filters"
                description="Try adjusting your search or filter criteria"
              />
            </Card>
          ) : (
            filteredFiles.map(file => (
              <div key={file.id}>
                <Link
                  href={`/creator/library/${file.id}`}
                  className="block"
                >
                  <Card className="hover:border-backend-hover transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-backend-primary mb-1">
                        {file.title}
                      </h3>
                      <p className="text-sm text-backend-muted mb-2">
                        {file.file_path}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ml-4 ${
                      file.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {file.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-backend-muted text-xs">Type:</span>
                      <span className="text-backend-primary font-medium">
                        {file.content_type}
                      </span>
                    </div>

                    {file.orb_associations && Array.isArray(file.orb_associations) && file.orb_associations.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-backend-muted text-xs">Orbs:</span>
                        <div className="flex flex-wrap gap-1">
                          {file.orb_associations.slice(0, 3).map(orb => (
                            <span
                              key={orb}
                              className="px-2 py-0.5 rounded bg-orb-1/10 text-orb-1 text-xs font-medium"
                            >
                              Orb {orb}
                            </span>
                          ))}
                          {file.orb_associations.length > 3 && (
                            <span className="text-backend-muted text-xs">
                              +{file.orb_associations.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {file.tags && Array.isArray(file.tags) && file.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-backend-muted text-xs">Tags:</span>
                        <div className="flex flex-wrap gap-1">
                          {file.tags.filter(tag => !systemTags.includes(tag)).slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded bg-cosmic-blue/10 text-cosmic-blue text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {file.tags.filter(tag => !systemTags.includes(tag)).length > 2 && (
                            <span className="text-backend-muted text-xs">
                              +{file.tags.filter(tag => !systemTags.includes(tag)).length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Show YAML metadata if available */}
                    {file.yaml_frontmatter && Object.keys(file.yaml_frontmatter).length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-backend-muted text-xs">Metadata:</span>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(file.yaml_frontmatter).slice(0, 3).map(([key, value]) => (
                            <span
                              key={key}
                              className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs"
                              title={`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                            >
                              {key}: {Array.isArray(value) ? value.length : String(value).slice(0, 20)}
                            </span>
                          ))}
                          {Object.keys(file.yaml_frontmatter).length > 3 && (
                            <span className="text-backend-muted text-xs">
                              +{Object.keys(file.yaml_frontmatter).length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-backend-muted text-xs ml-auto">
                      Updated {new Date(file.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Resonance Discovery */}
              <ResonanceDiscovery 
                contentId={file.id} 
                title={file.title}
                variant="inline"
              />
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
