import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Prevent build-time execution
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Generate knowledge graph data from embeddings
 * Uses vector similarity to create edges between content
 */
export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get all content files with metadata
    const { data: files, error: filesError } = await supabase
      .from('content_files')
      .select('id, title, content_type, orb_associations, tags, yaml_frontmatter');

    if (filesError) {
      console.error('Supabase error:', filesError);
      return NextResponse.json({ error: 'Failed to fetch files: ' + filesError.message }, { status: 500 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No content files found' }, { status: 404 });
    }

    // Create nodes
    const nodes = files.map((file: any) => ({
      id: file.id,
      name: file.title,
      type: 'content',
      contentType: file.content_type,
      orbs: file.orb_associations || [],
      tags: file.tags || [],
      size: Math.min(file.word_count / 100 || 5, 20), // Node size based on word count
      color: getColorByType(file.content_type),
    }));

    // Add Orb nodes
    for (let i = 1; i <= 13; i++) {
      nodes.push({
        id: `orb-${i}`,
        name: `Orb ${i}`,
        type: 'orb',
        contentType: 'orb',
        orbs: [i],
        tags: [],
        size: 15,
        color: getOrbColor(i),
      });
    }

    // Create edges based on:
    // 1. Shared Orb associations
    // 2. Shared tags
    // 3. Content-to-Orb relationships
    const edges: any[] = [];

    // Content-to-Orb edges
    files.forEach((file: any) => {
      if (file.orb_associations && file.orb_associations.length > 0) {
        file.orb_associations.forEach((orb: number) => {
          edges.push({
            source: file.id,
            target: `orb-${orb}`,
            strength: 3,
            type: 'orb-association',
          });
        });
      }
    });

    // Content-to-Content edges (shared Orbs or tags)
    for (let i = 0; i < files.length; i++) {
      for (let j = i + 1; j < files.length; j++) {
        const file1 = files[i];
        const file2 = files[j];

        const sharedOrbs = file1.orb_associations?.filter((orb: number) =>
          file2.orb_associations?.includes(orb)
        ).length || 0;

        const sharedTags = file1.tags?.filter((tag: string) =>
          file2.tags?.includes(tag)
        ).length || 0;

        if (sharedOrbs > 0 || sharedTags >= 2) {
          edges.push({
            source: file1.id,
            target: file2.id,
            strength: sharedOrbs * 2 + sharedTags,
            type: 'similarity',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      graph: {
        nodes,
        links: edges,
      },
      stats: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        contentNodes: files.length,
        orbNodes: 13,
      },
    });
  } catch (err: any) {
    console.error('Error generating knowledge graph:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

function getColorByType(contentType: string): string {
  const colorMap: Record<string, string> = {
    scrollstream_entry: '#48D1CC',
    character_profile: '#9932CC',
    book_fragment: '#FFD700',
    orb_personality: '#FF4500',
    scenario_entry: '#4169E1',
    research_notes: '#1E90FF',
  };
  return colorMap[contentType] || '#F4F1E8';
}

function getOrbColor(orbNumber: number): string {
  const colors = [
    '#8B0000', '#1E90FF', '#FFFFFF', '#FFD700', '#9370DB',
    '#4169E1', '#FF4500', '#00CED1', '#48D1CC', '#8B4513',
    '#F0E68C', '#DAA520', '#9932CC'
  ];
  return colors[orbNumber - 1] || '#F4F1E8';
}
