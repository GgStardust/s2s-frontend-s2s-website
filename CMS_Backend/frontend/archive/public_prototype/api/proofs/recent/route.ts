import { NextRequest, NextResponse } from 'next/server';
import { proofLogger } from '@/lib/proofs/proof-logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const type = searchParams.get('type') || 'all'; // e.g., 'sovereign_logic', 'coc_validation'
    const status = searchParams.get('status') || 'all'; // e.g., 'proven', 'disproven'

    let logs = proofLogger.getRecentLogs(limit);

    if (type !== 'all') {
      logs = logs.filter(log => log.steps.some(step => step.description.toLowerCase().includes(type.toLowerCase())));
    }

    if (status !== 'all') {
      logs = logs.filter(log => log.status === status);
    }

    const total = proofLogger.getRecentLogs(100).length; // Get total from a larger set for stats
    const proven = proofLogger.getRecentLogs(100).filter(log => log.status === 'proven').length;

    const statistics = {
      total: total,
      byType: {
        sovereign_logic: proofLogger.getRecentLogs(100).filter(log => log.steps.some(step => step.description.includes('Sovereign Logic'))).length,
        coc_validation: proofLogger.getRecentLogs(100).filter(log => log.steps.some(step => step.description.includes('CoC Validation'))).length,
        resonance_analysis: proofLogger.getRecentLogs(100).filter(log => log.steps.some(step => step.description.includes('Resonance Vector'))).length,
        coherence_calculus: proofLogger.getRecentLogs(100).filter(log => log.steps.some(step => step.description.includes('Coherence Matrix'))).length,
      },
      byStatus: {
        proven: proven,
        disproven: proofLogger.getRecentLogs(100).filter(log => log.status === 'disproven').length,
        inconclusive: proofLogger.getRecentLogs(100).filter(log => log.status === 'inconclusive').length,
        error: proofLogger.getRecentLogs(100).filter(log => log.status === 'error').length,
      },
      averageProcessingTime: 0, // Placeholder for now
      successRate: total > 0 ? (proven / total) * 100 : 0,
    };

    return NextResponse.json({
      success: true,
      logs,
      statistics,
      filters: { limit, type, status },
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching recent proof logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent proof logs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
