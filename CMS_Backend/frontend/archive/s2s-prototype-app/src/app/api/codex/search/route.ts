import { NextRequest, NextResponse } from 'next/server';
import { livingCodexIndexer, CodexEntry } from '@/lib/codex/living-codex-indexer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const orb = searchParams.get('orb') ? parseInt(searchParams.get('orb')!, 10) : undefined;
    const status = searchParams.get('status') || undefined;
    const source = searchParams.get('source') || undefined;
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    // Ensure the indexer is initialized
    if (livingCodexIndexer.getIndex().length === 0) {
      await livingCodexIndexer.initialize();
    }

    let results = livingCodexIndexer.search(query, orb, status, source);

    // Sort by resonance (highest first)
    results.sort((a, b) => {
      const resonanceA = Math.sqrt(a.resonanceVector.x**2 + a.resonanceVector.y**2 + a.resonanceVector.z**2 + a.resonanceVector.w**2);
      const resonanceB = Math.sqrt(b.resonanceVector.x**2 + b.resonanceVector.y**2 + b.resonanceVector.z**2 + b.resonanceVector.w**2);
      return resonanceB - resonanceA;
    });

    const limitedResults = results.slice(0, limit);

    const totalEntries = livingCodexIndexer.getIndex().length;
    const provenEntries = livingCodexIndexer.getIndex().filter(entry => entry.proofStatus === 'proven').length;
    const averageResonance = livingCodexIndexer.getIndex().reduce((sum, entry) => sum + Math.sqrt(entry.resonanceVector.x**2 + entry.resonanceVector.y**2 + entry.resonanceVector.z**2 + entry.resonanceVector.w**2), 0) / totalEntries || 0;

    const bySource: { [key: string]: number } = {};
    livingCodexIndexer.getIndex().forEach(entry => {
      bySource[entry.source] = (bySource[entry.source] || 0) + 1;
    });

    const byOrb: { [key: number]: number } = {};
    livingCodexIndexer.getIndex().forEach(entry => {
      entry.orbAssociations.forEach(o => {
        byOrb[o] = (byOrb[o] || 0) + 1;
      });
    });

    return NextResponse.json({
      success: true,
      results: limitedResults.map(entry => ({
        id: entry.id,
        title: entry.title,
        excerpt: entry.excerpt,
        source: entry.source,
        contentType: entry.contentType,
        orbAssociations: entry.orbAssociations,
        tags: entry.tags,
        resonanceVector: entry.resonanceVector,
        proofStatus: entry.proofStatus,
        proofLogId: entry.proofLogId,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      })),
      statistics: {
        totalEntries,
        bySource,
        byOrb,
        averageResonance: averageResonance,
        provenEntries,
        successRate: totalEntries > 0 ? (provenEntries / totalEntries) * 100 : 0,
      },
      filters: { query, limit, orb, source, status },
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error searching codex:', error);
    return NextResponse.json(
      { error: 'Failed to search codex', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
