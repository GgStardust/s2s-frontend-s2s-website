'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardGrid, PageHeader } from '@/components/backend';

interface SystemStats {
  contentFiles: number;
  scrollstreams: number;
  coreOrbs: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-backend-secondary">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-backend-primary mb-4">
            Stardust to Sovereignty
          </h1>
          <p className="text-xl text-deep-gold mb-2">
            A Cosmological Framework for Consciousness Evolution
          </p>
          <p className="text-sm text-backend-muted">
            Backend Dashboard · Content Management System
          </p>
        </div>

        {/* Quick Stats */}
        <Card className="mb-6">
          <h3 className="text-base font-semibold text-backend-primary mb-4">
            System Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-backend-secondary rounded-lg">
              <div className="text-2xl font-bold text-backend-primary mb-1">
                {loading ? '...' : (stats?.contentFiles || 0).toLocaleString()}
              </div>
              <div className="text-backend-muted text-sm">Content Files</div>
            </div>
            <div className="text-center p-4 bg-backend-secondary rounded-lg">
              <div className="text-2xl font-bold text-backend-primary mb-1">
                {stats?.coreOrbs || 13}
              </div>
              <div className="text-backend-muted text-sm">Core Orbs</div>
            </div>
            <div className="text-center p-4 bg-backend-secondary rounded-lg">
              <div className="text-2xl font-bold text-backend-primary mb-1">
                {loading ? '...' : (stats?.scrollstreams || 0).toLocaleString()}
              </div>
              <div className="text-backend-muted text-sm">Scrollstreams</div>
            </div>
          </div>
        </Card>

        {/* Content Creation Tools */}
        <Card className="mb-6">
          <h3 className="text-base font-semibold text-backend-primary mb-4">
            Content Creation Tools
          </h3>
          <CardGrid columns={2}>
            <Link href="/creator/scrollstreams">
              <Card className="hover:border-backend-hover transition-all cursor-pointer h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-backend-primary mb-2">
                    Scrollstreams
                  </h3>
                  <p className="text-backend-muted text-sm">
                    Live consciousness transmissions
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/creator/style-training">
              <Card className="hover:border-backend-hover transition-all cursor-pointer h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-backend-primary mb-2">
                    Style Training
                  </h3>
                  <p className="text-backend-muted text-sm">
                    Train AI to match your writing style
                  </p>
                </div>
              </Card>
            </Link>
          </CardGrid>
        </Card>

        {/* Book Creation Tools */}
        <Card className="mb-6">
          <h3 className="text-base font-semibold text-backend-primary mb-4">
            Book Creation Tools
          </h3>
          <CardGrid columns={3}>
            <Link href="/creator/book-compiler">
              <Card className="hover:border-backend-hover transition-all cursor-pointer h-full border-2 border-deep-gold/30 bg-gradient-to-br from-deep-navy/80 to-deep-navy">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-deep-gold mb-2">
                    Book Compiler
                  </h3>
                  <p className="text-creamy-white/80 text-sm">
                    Write books from library content with AI assistance
                  </p>
                  <div className="mt-2 text-xs text-deep-gold/60">
                    Smart content mapping & auto-generation
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/creator/books">
              <Card className="hover:border-backend-hover transition-all cursor-pointer h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-backend-primary mb-2">
                    Books
                  </h3>
                  <p className="text-backend-muted text-sm">
                    Manage compiled books and chapters
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/creator/fiction-resources">
              <Card className="hover:border-backend-hover transition-all cursor-pointer h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-backend-primary mb-2">
                    Fiction Resources
                  </h3>
                  <p className="text-backend-muted text-sm">
                    Characters, locations, orb personalities
                  </p>
                </div>
              </Card>
            </Link>
          </CardGrid>
        </Card>

        {/* Content Management */}
        <Card className="mb-6">
          <h3 className="text-base font-semibold text-backend-primary mb-4">
            Content Management
          </h3>
          <CardGrid columns={2}>
            <Link href="/creator/library">
              <Card className="hover:border-backend-hover transition-all cursor-pointer h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-backend-primary mb-2">
                    Content Library
                  </h3>
                  <p className="text-backend-muted text-sm">
                    Browse and manage all content files
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/creator/content-matrix">
              <Card className="hover:border-backend-hover transition-all cursor-pointer h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-backend-primary mb-2">
                    Content Matrix
                  </h3>
                  <p className="text-backend-muted text-sm">
                    Explore content relationships through Orbs
                  </p>
                </div>
              </Card>
            </Link>
          </CardGrid>
        </Card>

        {/* Advanced Tools */}
        <Card className="mb-6">
          <h3 className="text-base font-semibold text-backend-primary mb-4">
            Advanced Tools
          </h3>
          <CardGrid columns={3}>
            <Link href="/creator/health">
              <Card className="hover:border-backend-hover transition-all cursor-pointer h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-backend-primary mb-2">
                    Health Dashboard
                  </h3>
                  <p className="text-backend-muted text-sm">
                    System health and performance monitoring
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/creator/orbital">
              <Card className="hover:border-backend-hover transition-all cursor-pointer h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-backend-primary mb-2">
                    Orbital Brain
                  </h3>
                  <p className="text-backend-muted text-sm">
                    AI-powered content processing and refinement
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/creator/knowledge-graph">
              <Card className="hover:border-backend-hover transition-all cursor-pointer h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-backend-primary mb-2">
                    Knowledge Graph
                  </h3>
                  <p className="text-backend-muted text-sm">
                    Visualize content connections and relationships
                  </p>
                </div>
              </Card>
            </Link>
          </CardGrid>
        </Card>
      </div>
    </div>
  );
}
