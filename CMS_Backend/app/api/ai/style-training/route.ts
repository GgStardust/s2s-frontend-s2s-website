import { NextRequest, NextResponse } from 'next/server';

// Prevent build-time execution
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Dynamic imports to prevent build-time execution
    const { writingStyleTrainer } = await import('@/lib/ai/style-training');

    const body = await request.json();
    const { action, example } = body;

    if (action === 'add_example') {
      if (!example || !example.content) {
        return NextResponse.json(
          { error: 'Example content is required' },
          { status: 400 }
        );
      }

      // Add the example to the trainer
      writingStyleTrainer.addExample({
        id: example.id || `example_${Date.now()}`,
        content: example.content,
        title: example.title || 'Untitled',
        orbAssociations: example.orbAssociations || [],
        tags: example.tags || [],
        scrollstreams: example.scrollstreams || []
      });

      return NextResponse.json({
        success: true,
        message: 'Writing example added successfully',
        totalExamples: writingStyleTrainer.getExamples().length
      });
    }

    if (action === 'get_patterns') {
      const patterns = writingStyleTrainer.getLearnedPatterns();
      const examples = writingStyleTrainer.getExamples();
      
      return NextResponse.json({
        patterns,
        examples: examples.map(ex => ({
          id: ex.id,
          title: ex.title,
          orbAssociations: ex.orbAssociations,
          tags: ex.tags,
          scrollstreams: ex.scrollstreams
        })),
        totalExamples: examples.length
      });
    }

    if (action === 'get_style_prompt') {
      const stylePrompt = writingStyleTrainer.generateStylePrompt();
      
      return NextResponse.json({
        stylePrompt,
        hasTraining: stylePrompt.length > 0
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: add_example, get_patterns, or get_style_prompt' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Style training API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Dynamic imports to prevent build-time execution
    const { writingStyleTrainer } = await import('@/lib/ai/style-training');

    const patterns = writingStyleTrainer.getLearnedPatterns();
    const examples = writingStyleTrainer.getExamples();
    
    return NextResponse.json({
      name: 'Writing Style Training API',
      description: 'Train AI to match user writing style within S2S Codex',
      totalExamples: examples.length,
      hasLearnedPatterns: patterns !== null,
      endpoints: {
        POST: {
          'add_example': 'Add a writing example for style analysis',
          'get_patterns': 'Get learned writing patterns',
          'get_style_prompt': 'Get style-aware system prompt'
        }
      },
      currentPatterns: patterns ? {
        sentenceLength: patterns.sentenceLength.variation,
        voice: patterns.voice.tone,
        orbIntegration: patterns.orbIntegration.crossOrbSynthesis,
        contentStructure: {
          operationalContext: patterns.contentStructure.operationalContext,
          essenceStatements: patterns.contentStructure.essenceStatements
        }
      } : null
    });
  } catch (error) {
    console.error('Style training API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
