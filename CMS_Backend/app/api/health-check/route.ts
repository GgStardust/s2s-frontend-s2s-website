import { NextRequest, NextResponse } from 'next/server';

// Prevent build-time execution
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Perform AI-powered content health analysis
 */
export async function POST(request: NextRequest) {
  try {
    // Dynamic imports to prevent build-time execution
    const { createClient } = await import('@supabase/supabase-js');
    const OpenAI = (await import('openai')).default;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Get all content files
    const { data: files, error: filesError } = await supabase
      .from('content_files')
      .select('*');

    if (filesError || !files) {
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
    }

    // Calculate basic metrics
    const metrics = {
      totalFiles: files.length,
      byType: {} as Record<string, number>,
      byOrb: {} as Record<string, number>,
      totalTags: new Set<string>(),
      totalWordCount: 0,
      scrollstreamCount: 0,
    };

    files.forEach((file: any) => {
      // Count by type
      metrics.byType[file.content_type] = (metrics.byType[file.content_type] || 0) + 1;

      // Count by Orb - handle both string and number formats
      if (file.orb_associations && Array.isArray(file.orb_associations)) {
        file.orb_associations.forEach((orb: string | number) => {
          let orbNum: number | null = null;
          if (typeof orb === 'string') {
            // Extract orb number from string like "Orb 1: Origin Intelligence"
            const match = orb.match(/Orb\s+(\d+)/i);
            if (match) orbNum = parseInt(match[1], 10);
          } else if (typeof orb === 'number') {
            orbNum = orb;
          }
          
          if (orbNum && orbNum >= 1 && orbNum <= 13) {
            metrics.byOrb[`Orb ${orbNum}`] = (metrics.byOrb[`Orb ${orbNum}`] || 0) + 1;
          }
        });
      }

      // Collect tags
      if (file.tags) {
        file.tags.forEach((tag: string) => metrics.totalTags.add(tag));
      }

      // Calculate word count from markdown_body if word_count is not available
      let wordCount = file.word_count || 0;
      if (!wordCount && file.markdown_body) {
        wordCount = file.markdown_body.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
      }

      // Sum word count
      metrics.totalWordCount += wordCount;
    });

    // Get scrollstream count
    const { count: scrollCount } = await supabase
      .from('scrollstreams')
      .select('*', { count: 'exact', head: true });

    metrics.scrollstreamCount = scrollCount || 0;

    // AI Analysis: Identify gaps and opportunities
    const systemPrompt = `You are analyzing the S2S Codex for content health.

Codex has ${metrics.totalFiles} files across ${Object.keys(metrics.byType).length} content types.

Orb distribution:
${Object.entries(metrics.byOrb).map(([orb, count]) => `- ${orb}: ${count} files`).join('\n')}

Content types:
${Object.entries(metrics.byType).map(([type, count]) => `- ${type}: ${count} files`).join('\n')}

Total tags used: ${metrics.totalTags.size}
Total word count: ${metrics.totalWordCount.toLocaleString()}
Scrollstreams: ${metrics.scrollstreamCount}

Analyze this codex and provide:
1. **Coverage Gaps**: Which Orbs need more content? Which are well-covered?
2. **Balance Issues**: Is content distribution healthy across types?
3. **Opportunities**: What content should be created next?
4. **Strengths**: What's working well?
5. **Recommendations**: 3-5 specific actionable suggestions

Format as markdown with clear sections.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [{ role: 'system', content: systemPrompt }],
    });

    const aiAnalysis = response.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      metrics: {
        ...metrics,
        totalTags: metrics.totalTags.size,
        totalWordCount: metrics.totalWordCount,
        avgWordsPerFile: metrics.totalFiles > 0 
          ? Math.round(metrics.totalWordCount / metrics.totalFiles) 
          : 0,
      },
      aiAnalysis,
    });
  } catch (err: any) {
    console.error('Error performing health check:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
