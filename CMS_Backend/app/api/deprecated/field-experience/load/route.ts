import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Field Experience Integration API
 * 
 * Loads and processes 2 years of Orb essays and codex files with mathematical analysis:
 * - YAML frontmatter validation
 * - Content processing pipeline
 * - Mathematical analysis of field data
 * - Resonance pattern learning from field experiences
 */

export async function POST(request: NextRequest) {
  try {
    // Dynamic import to prevent build-time execution
    const { FieldExperienceIntegration } = await import('@/lib/content/field-experience-integration');
    
    const body = await request.json();
    const { action, contentDirectory } = body;

    const integration = new FieldExperienceIntegration(contentDirectory);

    if (action === 'load_field_data') {
      // Load and process all field experience content
      const fieldData = await integration.loadFieldExperienceData();
      
      return NextResponse.json({
        field_data: fieldData,
        summary: {
          total_files: fieldData.totalFiles,
          orb_essays: fieldData.orbEssays.length,
          codex_files: fieldData.codexFiles.length,
          average_resonance_score: fieldData.mathematicalInsights.averageResonanceScore,
          dominant_orb_patterns: fieldData.mathematicalInsights.dominantOrbPatterns,
          coherence_rank: fieldData.mathematicalInsights.coherenceMatrix.coherenceRank
        },
        generated_at: new Date().toISOString(),
        version: 'v1.0-field-integration'
      });
    }

    if (action === 'validate_frontmatter') {
      const { frontmatter } = body;
      
      if (!frontmatter) {
        return NextResponse.json(
          { error: 'frontmatter is required for validation' },
          { status: 400 }
        );
      }

      // Validate YAML frontmatter structure
      const validation = integration.validateFrontmatter(frontmatter);
      
      return NextResponse.json({
        validation,
        generated_at: new Date().toISOString(),
        version: 'v1.0-field-integration'
      });
    }

    if (action === 'analyze_content_sample') {
      const { content, title, orbAssociations } = body;
      
      if (!content || !title) {
        return NextResponse.json(
          { error: 'content and title are required for analysis' },
          { status: 400 }
        );
      }

      // Analyze a sample of content with mathematical layer
      const { EnhancedResonanceEngine } = await import('@/lib/mathematics/enhanced-resonance-engine');
      const enhancedEngine = EnhancedResonanceEngine.getInstance();
      
      const analysis = await enhancedEngine.analyzeContentWithMathematics(content, title);
      
      return NextResponse.json({
        analysis,
        mathematical_components: {
          resonance_vector: analysis.mathematical.resonanceVector,
          harmonic_frequency: analysis.mathematical.harmonicFrequency,
          coherence_matrix: analysis.mathematical.coherenceMatrix,
          field_dynamics: analysis.mathematical.fieldDynamics,
          sovereign_logic: analysis.mathematical.sovereignLogic
        },
        generated_at: new Date().toISOString(),
        version: 'v1.0-field-integration'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action specified. Valid actions: load_field_data, validate_frontmatter, analyze_content_sample' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Field Experience Integration API error:', error);
    return NextResponse.json(
      { error: 'Failed to process field experience integration', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
