'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/backend/Button';
import { Card, CardGrid } from '@/components/backend/Card';
import { PageHeader } from '@/components/backend/Layout';

interface ResourceCounts {
  characters: number;
  locations: number;
  wildlife: number;
  orb_personalities: number;
}

export default function FictionResourcesPage() {
  const [counts, setCounts] = useState<ResourceCounts>({
    characters: 0,
    locations: 0,
    wildlife: 0,
    orb_personalities: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCounts();
  }, []);

  async function loadCounts() {
    try {
      // Fetch counts from each table
      const [charactersRes, locationsRes, wildlifeRes, orbsRes] = await Promise.all([
        fetch('/api/fiction-resources/characters'),
        fetch('/api/fiction-resources/locations'),
        fetch('/api/fiction-resources/wildlife'),
        fetch('/api/fiction-resources/orb-personalities'),
      ]);

      const [characters, locations, wildlife, orbs] = await Promise.all([
        charactersRes.json(),
        locationsRes.json(),
        wildlifeRes.json(),
        orbsRes.json(),
      ]);

      setCounts({
        characters: characters.characters?.length || 0,
        locations: locations.locations?.length || 0,
        wildlife: wildlife.wildlife?.length || 0,
        orb_personalities: orbs.orb_personalities?.length || 0,
      });
    } catch (err) {
      console.error('Error loading counts:', err);
    } finally {
      setLoading(false);
    }
  }

  const resources = [
    {
      title: 'Character Profiles',
      description: 'Protagonist, Maya, Mike, and supporting characters',
      count: counts.characters,
      href: '/creator/fiction-resources/characters',
      color: 'blue',
    },
    {
      title: 'Sausalito Locations',
      description: 'Boardwalk, Hurricane Gulch, No Name Bar, and more',
      count: counts.locations,
      href: '/creator/fiction-resources/locations',
      color: 'green',
    },
    {
      title: 'Orb Personalities',
      description: '13 Orb archetypes with traits and communication styles',
      count: counts.orb_personalities,
      href: '/creator/fiction-resources/orb-personalities',
      color: 'purple',
    },
    {
      title: 'Wildlife Observations',
      description: 'Sea lions, crows, pelicans as field transmission nodes',
      count: counts.wildlife,
      href: '/creator/fiction-resources/wildlife',
      color: 'blue',
    },
  ];

  return (
    <div className="min-h-screen bg-backend-secondary">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/creator/book-compiler"
            className="text-backend-secondary hover:text-backend-primary mb-4 inline-block"
          >
            ← Back to Book Compiler
          </Link>

          <PageHeader
            title="Fiction Development Resources"
            subtitle='Character profiles, Sausalito locations, Orb personalities, and wildlife observations for "Future Primitive"'
          />
        </div>

        {/* Resource Grid */}
        {loading ? (
          <div className="text-center py-12 text-backend-secondary">Loading resources...</div>
        ) : (
          <CardGrid columns={2}>
            {resources.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                className="block"
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-4 py-2 rounded-lg ${
                      resource.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                      resource.color === 'green' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    } font-bold text-2xl`}>
                      {resource.count}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-backend-primary mb-2 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h2>
                  <p className="text-backend-secondary">{resource.description}</p>

                  <div className="mt-4 text-blue-600 text-sm font-medium">
                    View & Manage →
                  </div>
                </Card>
              </Link>
            ))}
          </CardGrid>
        )}

        {/* Quick Actions */}
        <Card title="Quick Actions" className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/creator/book-compiler">
              <Button variant="secondary" fullWidth>
                View Fiction Book
              </Button>
            </Link>
            <Link href="/creator/book-compiler/real-world-content">
              <Button variant="secondary" fullWidth>
                Add Real-World Content
              </Button>
            </Link>
            <Link href="/creator/library">
              <Button variant="secondary" fullWidth>
                Content Library
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
