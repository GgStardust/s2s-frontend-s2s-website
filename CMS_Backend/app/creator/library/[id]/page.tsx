'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ResonanceSidebar from '@/components/resonance/ResonanceSidebar';

interface ContentFile {
  id: string;
  title: string;
  file_path: string;
  content_type: string;
  status: string;
  markdown_body: string;
  yaml_frontmatter: any;
  orb_associations: number[];
  tags: string[];
  resonance_rating: number;
  resonance_metrics: any;
  created_at: string;
  updated_at: string;
}

export default function FileDetailPage() {
  const params = useParams();
  const [file, setFile] = useState<ContentFile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFile();
  }, [params.id]);

  async function loadFile() {
    try {
      console.log('Loading file with ID:', params.id);
      const response = await fetch(`/api/content-files/${params.id}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('API error:', response.status, response.statusText);
        setFile(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setFile(data.contentFile);
    } catch (error) {
      console.error('Error loading file:', error);
      setFile(null);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-creamy-white text-2xl">Loading file...</div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-center">
          <div className="text-creamy-white text-2xl mb-4">File not found</div>
          <Link
            href="/creator/library"
            className="text-deep-gold hover:text-creamy-white"
          >
            ← Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
          <Link
            href="/creator/library"
            className="text-deep-gold hover:text-creamy-white mb-4 inline-block"
          >
            ← Back to Library
          </Link>

          <h1 className="text-4xl font-bold text-creamy-white mb-4">
            {file.title}
          </h1>

          <div className="flex items-center space-x-4 text-creamy-white/60 text-sm mb-6">
            <span>{file.file_path}</span>
            <span>•</span>
            <span>Updated {new Date(file.updated_at).toLocaleDateString()}</span>
          </div>

          {/* Metadata Bar */}
          <div className="flex items-center space-x-4 flex-wrap gap-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              file.status === 'published'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
            }`}>
              {file.status}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-deep-gold/20 text-deep-gold border border-deep-gold/30">
              {file.content_type}
            </span>

            {file.orb_associations && Array.isArray(file.orb_associations) && file.orb_associations.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-creamy-white/60 text-xs mr-1">Orbs:</span>
                <span className="text-creamy-white text-sm">
                  {Math.min(file.orb_associations.length, 13)} associated
                </span>
              </div>
            )}

            {file.tags && file.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-creamy-white/60 text-xs mr-1">Tags:</span>
                {(() => {
                  // Filter out system tags and scrollstream content
                  const systemTags = ['@scrollstream', '@orb1', '@orb2', '@orb3', '@orb4', '@orb5', '@orb6', '@orb7', '@orb8', '@orb9', '@orb10', '@orb11', '@orb12', '@orb13'];
                  const filteredTags = file.tags.filter(tag => {
                    if (!tag) return false;
                    if (systemTags.includes(tag)) return false;
                    if (tag.toLowerCase().includes('scrollstream')) return false;
                    if (tag.length > 50) return false;
                    return true;
                  });
                  
                  return (
                    <>
                      {filteredTags.slice(0, 5).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded bg-cosmic-blue/20 text-cosmic-blue text-xs border border-cosmic-blue/30"
                        >
                          {tag}
                        </span>
                      ))}
                      {filteredTags.length > 5 && (
                        <span className="text-creamy-white/60 text-xs">
                          +{filteredTags.length - 5} more
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>


        {/* Full-Width YAML Frontmatter - Force Display */}
        {file && file.yaml_frontmatter ? (
          <div className="mb-8">
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-8 border border-deep-gold/30">
              <h2 className="text-2xl font-bold text-creamy-white mb-6">Metadata (YAML Frontmatter)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(file.yaml_frontmatter).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="text-creamy-white/60 text-sm font-medium uppercase tracking-wide">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="text-creamy-white">
                      {Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-1">
                          {value.map((item, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded bg-deep-gold/20 text-deep-gold text-xs border border-deep-gold/30"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : typeof value === 'object' && value !== null ? (
                        <pre className="text-xs text-creamy-white/80 overflow-x-auto whitespace-pre-wrap font-mono">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-creamy-white/90">{String(value)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-8 border border-deep-gold/30">
              <h2 className="text-2xl font-bold text-creamy-white mb-6">Metadata (YAML Frontmatter)</h2>
              <div className="text-creamy-white/60">No YAML frontmatter data available</div>
            </div>
          </div>
        )}

        {/* Full-Width Content */}
        <div className="mb-8">
          <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-8 border border-deep-gold/30">
            <h2 className="text-2xl font-bold text-creamy-white mb-6">Content</h2>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm text-creamy-white/90 leading-relaxed">
                {file.markdown_body}
              </pre>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
            <h3 className="text-lg font-bold text-creamy-white mb-4">Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href={`/creator/library/${file.id}/edit`}
                className="px-4 py-2 bg-deep-gold/20 text-deep-gold border border-deep-gold/30 rounded-lg hover:bg-deep-gold/30 transition-colors text-sm text-center"
              >
                Edit Content
              </Link>
              <button className="px-4 py-2 bg-cosmic-blue/20 text-cosmic-blue border border-cosmic-blue/30 rounded-lg hover:bg-cosmic-blue/30 transition-colors text-sm">
                Publish to Social
              </button>
              <button className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors text-sm">
                Add to Book
              </button>
            </div>
          </div>
            </div>
          </div>

          {/* Resonance Sidebar */}
          <div className="flex-shrink-0">
            <ResonanceSidebar contentId={file.id} title={file.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
