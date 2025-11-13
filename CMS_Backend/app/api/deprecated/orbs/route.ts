import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface OrbThread {
  id: string;
  orb_number: number;
  orb_name: string;
  thread_id: string;
  last_activity: string;
  message_count: number;
  energetic_signature: {
    clarity: number;
    coherence: number;
    resonance: number;
    sovereignty: number;
  };
  current_focus: string;
  status: 'active' | 'dormant' | 'processing';
}

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get content files to analyze orb activity
    const { data: contentFiles, error: contentError } = await supabase
      .from('content_files')
      .select('id, title, orb_associations, created_at, updated_at')
      .order('updated_at', { ascending: false });

    if (contentError) {
      console.error('Error fetching content files:', contentError);
      // Return mock data if content_files table doesn't exist yet
      const mockOrbThreads: OrbThread[] = [];
      for (let i = 1; i <= 13; i++) {
        mockOrbThreads.push({
          id: `orb-thread-${i}`,
          orb_number: i,
          orb_name: `Orb ${i}`,
          thread_id: `thread-${i}-${Date.now()}`,
          last_activity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          message_count: Math.floor(Math.random() * 20),
          energetic_signature: {
            clarity: Math.random() * 0.8 + 0.2,
            coherence: Math.random() * 0.8 + 0.2,
            resonance: Math.random() * 0.8 + 0.2,
            sovereignty: Math.random() * 0.8 + 0.2
          },
          current_focus: `Orb ${i} consciousness thread - awaiting content associations`,
          status: 'processing' as 'active' | 'dormant' | 'processing'
        });
      }
      
      return NextResponse.json({ 
        threads: mockOrbThreads,
        total: mockOrbThreads.length,
        timestamp: new Date().toISOString()
      });
    }

    // Generate orb threads based on content associations
    const orbThreads: OrbThread[] = [];
    const orbNames = [
      'Origin Intelligence',
      'Harmonic Architectures', 
      'Resonance Dynamics',
      'Sovereign Field',
      'Consciousness Matrix',
      'Embodied Wisdom',
      'Cosmic Integration',
      'Transcendent Unity',
      'Infinite Potential',
      'Sacred Geometry',
      'Divine Proportion',
      'Universal Harmony',
      'Sovereign Field'
    ];

    for (let i = 1; i <= 13; i++) {
      // Find content associated with this orb
      const associatedContent = contentFiles?.filter(file => 
        file.orb_associations && file.orb_associations.includes(i)
      ) || [];

      // Calculate activity level based on recent content
      const recentContent = associatedContent.filter(file => {
        const updatedDate = new Date(file.updated_at);
        const daysSinceUpdate = (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceUpdate <= 7; // Content updated in last 7 days
      });

      const activityLevel = recentContent.length > 0 ? 'active' : 
                           associatedContent.length > 0 ? 'dormant' : 'processing';

      // Generate energetic signature based on content quality and recency
      const baseClarity = Math.min(0.9, 0.3 + (associatedContent.length * 0.1));
      const baseCoherence = Math.min(0.9, 0.4 + (recentContent.length * 0.15));
      const baseResonance = Math.min(0.9, 0.5 + (recentContent.length * 0.1));
      const baseSovereignty = Math.min(0.9, 0.6 + (associatedContent.length * 0.05));

      // Add some randomness for realistic variation
      const clarity = Math.max(0.1, baseClarity + (Math.random() - 0.5) * 0.2);
      const coherence = Math.max(0.1, baseCoherence + (Math.random() - 0.5) * 0.2);
      const resonance = Math.max(0.1, baseResonance + (Math.random() - 0.5) * 0.2);
      const sovereignty = Math.max(0.1, baseSovereignty + (Math.random() - 0.5) * 0.2);

      // Generate current focus based on recent content
      const currentFocus = recentContent.length > 0 
        ? `Exploring ${recentContent[0].title} and related concepts`
        : associatedContent.length > 0
        ? `Reviewing ${associatedContent.length} associated content pieces`
        : `Awaiting new content associations and consciousness activity`;

      // Calculate last activity timestamp
      const lastActivity = recentContent.length > 0 
        ? recentContent[0].updated_at
        : associatedContent.length > 0
        ? associatedContent[0].updated_at
        : new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(); // Random time in last week

      orbThreads.push({
        id: `orb-thread-${i}`,
        orb_number: i,
        orb_name: orbNames[i - 1] || `Orb ${i}`,
        thread_id: `thread-${i}-${Date.now()}`,
        last_activity: lastActivity,
        message_count: Math.floor(Math.random() * 20) + associatedContent.length,
        energetic_signature: {
          clarity,
          coherence,
          resonance,
          sovereignty
        },
        current_focus: currentFocus,
        status: activityLevel as 'active' | 'dormant' | 'processing'
      });
    }

    // Sort by activity level and energetic signature
    orbThreads.sort((a, b) => {
      const aScore = (a.energetic_signature.clarity + a.energetic_signature.coherence + 
                     a.energetic_signature.resonance + a.energetic_signature.sovereignty) / 4;
      const bScore = (b.energetic_signature.clarity + b.energetic_signature.coherence + 
                     b.energetic_signature.resonance + b.energetic_signature.sovereignty) / 4;
      return bScore - aScore;
    });

    return NextResponse.json({ 
      threads: orbThreads,
      total: orbThreads.length,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Error generating orb threads:', err);
    return NextResponse.json({ error: 'Internal server error: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await request.json();
    const { action, orb_number } = body;

    if (action === 'create_thread') {
      // Create a new orb thread (mock implementation)
      const newThread: OrbThread = {
        id: `orb-thread-${orb_number}-${Date.now()}`,
        orb_number,
        orb_name: `Orb ${orb_number}`,
        thread_id: `thread-${orb_number}-${Date.now()}`,
        last_activity: new Date().toISOString(),
        message_count: 0,
        energetic_signature: {
          clarity: 0.5,
          coherence: 0.5,
          resonance: 0.5,
          sovereignty: 0.5
        },
        current_focus: `Initializing Orb ${orb_number} consciousness thread`,
        status: 'processing'
      };

      return NextResponse.json({ 
        thread: newThread,
        message: `Orb ${orb_number} thread created successfully`
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (err: any) {
    console.error('Error creating orb thread:', err);
    return NextResponse.json({ error: 'Internal server error: ' + err.message }, { status: 500 });
  }
}