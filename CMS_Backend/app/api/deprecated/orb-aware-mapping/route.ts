import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface ContentFile {
  id: string;
  title: string;
  content_type: string;
  orb_associations: number[];
  tags: string[];
  yaml_frontmatter: any;
}

interface OrbContext {
  primary_orb?: string;
  secondary_orbs?: string[];
  integration_points?: string[];
}

// Detect Orb-aware mode from YAML frontmatter
function detectOrbAwareMode(file: any): OrbContext | null {
  if (!file.yaml_frontmatter || !file.yaml_frontmatter.orb_associations) {
    return null;
  }
  
  const yaml = file.yaml_frontmatter;
  const orbContext: OrbContext = {};
  
  if (yaml.orb_associations.primary_orb) {
    orbContext.primary_orb = yaml.orb_associations.primary_orb;
  }
  
  if (yaml.orb_associations.secondary_orbs && yaml.orb_associations.secondary_orbs.length > 0) {
    orbContext.secondary_orbs = yaml.orb_associations.secondary_orbs;
  }
  
  if (yaml.integration_points && yaml.integration_points.length > 0) {
    orbContext.integration_points = yaml.integration_points;
  }
  
  return orbContext;
}

// Orb-aware content matching with YAML frontmatter analysis
function findMatchingContent(contentFiles: ContentFile[], chapterTitle: string, chapterDescription: string = '', orbContext: OrbContext | null = null) {
  const searchText = `${chapterTitle} ${chapterDescription}`.toLowerCase();
  const keywords = searchText.split(/\s+/).filter(word => word.length > 3);
  
  return contentFiles.map(file => {
    let score = 0;
    const fileText = `${file.title} ${file.content_type} ${(file.tags || []).join(' ')}`.toLowerCase();
    
    // Check for keyword matches
    keywords.forEach(keyword => {
      if (fileText.includes(keyword)) {
        score += 1;
      }
    });
    
    // Orb-aware matching
    if (file.yaml_frontmatter) {
      const yaml = file.yaml_frontmatter;
      
      // Check primary orb match
      if (yaml.orb_associations && yaml.orb_associations.primary_orb) {
        const primaryOrb = yaml.orb_associations.primary_orb.toLowerCase();
        if (orbContext && orbContext.primary_orb) {
          if (primaryOrb.includes(orbContext.primary_orb.toLowerCase()) || 
              orbContext.primary_orb.toLowerCase().includes(primaryOrb)) {
            score += 2; // High bonus for primary orb match
          }
        } else {
          score += 1; // Bonus for having primary orb defined
        }
      }
      
      // Check secondary orbs match
      if (yaml.orb_associations && yaml.orb_associations.secondary_orbs) {
        const secondaryOrbs = yaml.orb_associations.secondary_orbs.map((o: string) => o.toLowerCase());
        if (orbContext && orbContext.secondary_orbs) {
          const contextOrbs = orbContext.secondary_orbs.map(o => o.toLowerCase());
          const matches = secondaryOrbs.filter((orb: string) => 
            contextOrbs.some((contextOrb: string) => 
              orb.includes(contextOrb) || contextOrb.includes(orb)
            )
          );
          score += matches.length * 0.5; // Bonus for each secondary orb match
        } else {
          score += 0.3; // Small bonus for having secondary orbs
        }
      }
      
      // Check integration points
      if (yaml.integration_points && yaml.integration_points.length > 0) {
        score += 0.2; // Bonus for having integration points
      }
    }
    
    // Check for orb associations (legacy format)
    if (file.orb_associations && file.orb_associations.length > 0) {
      score += 0.5; // Bonus for having orb associations
    }
    
    // Check content type relevance
    if (file.content_type === 'essay' || file.content_type === 'analysis') {
      score += 0.3;
    }
    
    return { ...file, matchScore: score };
  })
  .filter(file => file.matchScore > 0)
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 10); // Top 10 matches
}

export async function POST(request: NextRequest) {
  try {
    const { chapterId, bookId } = await request.json();
    
    if (!chapterId || !bookId) {
      return NextResponse.json({ error: 'Chapter ID and Book ID are required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get chapter details
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single();

    if (chapterError || !chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Get all content files
    const { data: contentFiles, error: filesError } = await supabase
      .from('content_files')
      .select('id, title, content_type, orb_associations, tags, yaml_frontmatter')
      .order('created_at', { ascending: false });

    if (filesError) {
      return NextResponse.json({ error: 'Failed to fetch content files' }, { status: 500 });
    }

    // Check for Orb-aware mode in the chapter
    const orbContext = detectOrbAwareMode(chapter);
    
    // Find matching content
    const matches = findMatchingContent(
      contentFiles || [],
      chapter.title,
      chapter.part_title || '',
      orbContext
    );

    return NextResponse.json({
      chapter,
      orbContext,
      matches,
      totalContentFiles: contentFiles?.length || 0
    });

  } catch (error: any) {
    console.error('Error in orb-aware mapping:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
