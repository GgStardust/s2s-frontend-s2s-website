import { NextRequest, NextResponse } from 'next/server';

// Prevent build-time execution
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Dynamic imports to prevent build-time execution
    const { libraryStyleTrainer } = await import('@/lib/ai/library-style-training');

    const body = await request.json();
    const { action, config } = body;

    if (action === 'train_from_library') {
      // Update config if provided
      if (config) {
        libraryStyleTrainer.updateConfig(config);
      }

      // Train from library
      const result = await libraryStyleTrainer.trainFromLibrary();
      
      return NextResponse.json({
        success: result.success,
        examplesUsed: result.examplesUsed,
        errors: result.errors,
        patterns: result.patterns,
        message: result.success 
          ? `Successfully trained on ${result.examplesUsed} examples from your content library`
          : `Training failed: ${result.errors.join(', ')}`
      });
    }

    if (action === 'get_library_stats') {
      const stats = await libraryStyleTrainer.getLibraryTrainingStats();
      
      return NextResponse.json({
        success: true,
        stats
      });
    }

    if (action === 'update_config') {
      if (!config) {
        return NextResponse.json(
          { error: 'Config is required for update_config action' },
          { status: 400 }
        );
      }

      libraryStyleTrainer.updateConfig(config);
      const updatedConfig = libraryStyleTrainer.getConfig();
      
      return NextResponse.json({
        success: true,
        config: updatedConfig,
        message: 'Training configuration updated'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: train_from_library, get_library_stats, or update_config' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Library training API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Dynamic imports to prevent build-time execution
    const { libraryStyleTrainer } = await import('@/lib/ai/library-style-training');

    const config = libraryStyleTrainer.getConfig();
    const stats = await libraryStyleTrainer.getLibraryTrainingStats();
    
    return NextResponse.json({
      name: 'Library-Based Style Training API',
      description: 'Train AI on user\'s actual content from the content library',
      config,
      stats,
      endpoints: {
        POST: {
          'train_from_library': 'Train AI on content from the user\'s library',
          'get_library_stats': 'Get statistics about available content for training',
          'update_config': 'Update training configuration'
        }
      }
    });
  } catch (error) {
    console.error('Library training API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
