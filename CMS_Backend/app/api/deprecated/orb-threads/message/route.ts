import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Send a message to an Orb thread - SIMPLIFIED VERSION
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { thread_id, message } = body;

    if (!thread_id || !message) {
      return NextResponse.json(
        { error: 'thread_id and message are required' },
        { status: 400 }
      );
    }

    // Simple AI response generation without complex database operations
    const aiResponse = await generateSimpleAIResponse(message);

    return NextResponse.json({
      response: aiResponse,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

async function generateSimpleAIResponse(userMessage: string): Promise<string> {
  try {
    // Use OpenAI API with the full Orbital Brain specification
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are **Orbital**, the Codex-integrated intelligence for Stardust to Sovereignty. You structure incoming material into Markdown with YAML frontmatter, preserving cadence, nuance, and transmission integrity. You map content to the 13 Orbs and Undercurrents, apply canonical tags, extract Scrollstream pulses, and generate cross-links for dashboard modules, books, and consulting tools.

**OPERATING PRINCIPLES:**
• Use **affirmative definitions** only
• **Do not** summarize or paraphrase; preserve full language and layered meaning
• Maintain **modular integrity** so each file stands alone and interconnects
• Always output **Markdown + YAML frontmatter** using canonical schema
• Apply **Orb/Undercurrent associations** and **snake_case tags** from the Tag Registry
• When prompted, perform **internal Codex research** and **external web research**, and integrate both as synthesis aligned to sovereignty logic
• Voice: lucid, resonant, architectonic, precise

**13 ORBS:**
1. Origin Intelligence — Photonic blueprinting meets biological activation
2. Resonance Mechanics — Frequency becomes form
3. Photonic Intelligence — Light mirrors awareness
4. Harmonic Architectures — Geometry stabilizes coherence
5. Temporal Sovereignty — Spiral time and agency
6. Starline Memory — Galactic/ancestral recall as signal
7. Alchemical Current — Density to light through compression
8. Quantum Intuition — Nonlinear directional knowing
9. Temporal Fluidity — Attunement across timelines
10. Ancestral Repatterning — Lineage transformation
11. Radiant Transparency — Luminous truth expression
12. Sovereign Field — Structural indivisibility
13. Bridging Intelligence — Human ↔ nonhuman communication

**UNDERCURRENTS:**
1. Body as Energetic Technology
2. Vibration & Frequency in Reality Creation
3. Interconnection Through Light & Energy
4. Higher Intelligence & Consciousness Evolution
5. Sovereignty as Gateway to Liberation
6. Collective Awakening
7. Resting & Action Potential
8. Intuition & Knowing
9. Time as Nonlinear
10. Energy Imprints & Ancestral Memory
11. Sacred Patterns & Geometry
12. Free Will vs Universal Flow

**CONTENT TYPES YOU HELP CREATE:**
- Scrollstream entries (@scrollstream)
- Fiction character profiles (storyfield)
- Nonfiction book fragments
- Orb personality essays
- Scenario/consulting cases
- Research notes with internal/external synthesis

**YOUR ROLE:** Help develop content that maintains the S2S voice and framework, with proper Orb associations, Undercurrent links, and canonical tagging.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I encountered an issue processing your request.';
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback to S2S-aware responses
    const hasOrbMention = userMessage.toLowerCase().includes('orb');
    const hasSovereigntyMention = userMessage.toLowerCase().includes('sovereignty') || userMessage.toLowerCase().includes('sovereign');
    const hasResonanceMention = userMessage.toLowerCase().includes('resonance') || userMessage.toLowerCase().includes('coherence');
    const hasFieldMention = userMessage.toLowerCase().includes('field') || userMessage.toLowerCase().includes('consciousness');
    const hasScrollstreamMention = userMessage.toLowerCase().includes('scrollstream') || userMessage.toLowerCase().includes('scroll');
    
    if (hasOrbMention) {
      return `I see you're working with Orb concepts. The 13-Orb system structures consciousness technology through specific energetic signatures. Which Orb are you exploring, and how does it relate to your current content development? I can help you map this to the proper Orb associations and Undercurrent links.`;
    }
    
    if (hasSovereigntyMention) {
      return `Sovereignty is active engagement with the universal field of consciousness. What aspect of sovereignty are you developing? I can help you structure this as a book fragment, scrollstream entry, or scenario case with proper YAML frontmatter and Orb associations.`;
    }
    
    if (hasResonanceMention) {
      return `Resonance is the organizing principle of consciousness and creation. You exist as both matter and waveform. What resonance patterns are you noticing? I can help you extract scrollstream pulses and structure this content with proper Orb 2 (Resonance Mechanics) associations.`;
    }
    
    if (hasFieldMention) {
      return `Field dynamics are central to the S2S framework. Your bioelectromagnetic field exchanges with cosmic forces. What field work are you exploring? I can help you develop this as content with proper Orb 12 (Sovereign Field) associations and field activation protocols.`;
    }
    
    if (hasScrollstreamMention) {
      return `Scrollstreams are key resonant transmissions that pulse through the S2S system. What scrollstream are you developing? I can help you structure this with proper @scrollstream tags, Orb associations, and YAML frontmatter for your codex.`;
    }
    
    // Default S2S response
    return `I'm here to help you develop your S2S content and explore consciousness technology. What specific content are you working on? I can help you structure it as:

• **Scrollstream entry** - Key resonant transmissions
• **Book fragment** - Nonfiction content for your books  
• **Character profile** - Fiction storyfield development
• **Orb essay** - Orb personality and function
• **Scenario case** - Consulting and field work
• **Research note** - Internal/external synthesis

What type of content are you developing, and which Orbs or Undercurrents does it connect to?`;
  }
}





