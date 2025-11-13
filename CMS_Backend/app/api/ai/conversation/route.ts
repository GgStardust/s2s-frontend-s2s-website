import { NextRequest, NextResponse } from 'next/server';
import { buildOrbitalSystemPrompt } from '@/lib/orbital/system-prompt';
import { EnhancedResonanceEngine } from '@/lib/mathematics/enhanced-resonance-engine';
import { generateOrbitalResponse } from 'orbital-brain';
import type { ContentMetadata, RBIOutput } from 'orbital-brain/types';
import { getCorsHeaders } from '@/lib/cors';
import { referenceLoaders } from '@/lib/orbital/reference-loaders';

// Prevent build-time execution
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    return NextResponse.json({}, {
      status: 204,
      headers: getCorsHeaders(origin),
    });
  } catch (error) {
    console.error('OPTIONS handler error:', error);
    // Fallback CORS headers
    return NextResponse.json({}, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle CORS preflight
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    // Dynamic imports to prevent build-time execution
    const { chatCompletions } = await import('orbital-brain');
    const { runResonanceValidation } = await import('@/lib/resonance-api');
    const { writingStyleTrainer } = await import('@/lib/ai/style-training');

    const body = await request.json();
    const { messages, currentContent, title, orbContext, metadata, session_id } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get the user's inquiry (last message)
    const inquiry = messages[messages.length - 1]?.content || '';
    
    // METADATA-FIRST: Extract metadata from request or create minimal metadata
    const contentMetadata: ContentMetadata = metadata || {
      orb_associations: orbContext ? [orbContext] : undefined,
      field_function: {
        content_purpose: 'user_inquiry',
        console_context: 'field_console',
        console_relation: 'inquiry_response'
      },
      integration_points: {
        codex: ['FieldConsole'],
        console_views: ['InquiryResponse']
      }
    };

    // STEP 1: Call RBI Kernel with metadata (metadata-first)
    const resonanceEngine = EnhancedResonanceEngine.getInstance();
    const rbiAnalysis = await resonanceEngine.analyzeContentWithMathematics(
      inquiry,
      title || undefined,
      contentMetadata
    );

    // Format RBI output for Orbital Brain
    const rbiOutput: RBIOutput = {
      resonance_metrics: {
        strength: rbiAnalysis.mathematical?.fieldDynamics?.fieldStrength ? 
                 Math.round(rbiAnalysis.mathematical.fieldDynamics.fieldStrength * 10) / 10 : 0,
        clarity: rbiAnalysis.signature?.clarity ? 
                Math.round(rbiAnalysis.signature.clarity * 10) / 10 : 0,
        coherence: rbiAnalysis.mathematical?.sovereignLogic?.coherence ? 
                  Math.round(rbiAnalysis.mathematical.sovereignLogic.coherence * 10) / 10 : 0,
        pattern: rbiAnalysis.mathematical?.harmonicFrequency?.fundamental ? 
                Math.round(rbiAnalysis.mathematical.harmonicFrequency.fundamental * 10) / 10 : 0
      },
      coherence: rbiAnalysis.mathematical?.sovereignLogic?.coherence || 0,
      proof_status: rbiAnalysis.mathematical?.sovereignLogic?.validity || 'unproven',
      mathematical: {
        resonanceVector: rbiAnalysis.mathematical?.resonanceVector,
        fieldDynamics: rbiAnalysis.mathematical?.fieldDynamics,
        sovereignLogic: rbiAnalysis.mathematical?.sovereignLogic
      }
    };

    // STEP 2: Generate Orbital Brain response
    const orbitalResponse = await generateOrbitalResponse({
      inquiry,
      content: currentContent,
      metadata: contentMetadata,
      rbi_output: rbiOutput,
      session_id
    });

    // STEP 3: Use Orbital Brain interpretation to enhance OpenAI prompt
    let baseSystemPrompt = await buildOrbitalSystemPrompt();
    
    // Add Orbital Brain context to system prompt
    baseSystemPrompt += `\n\n## FIELD STATE: ${orbitalResponse.orbital_interpretation.field_state.toUpperCase()}\n`;
    baseSystemPrompt += `Narrative Coherence: ${(orbitalResponse.orbital_interpretation.narrative_coherence * 100).toFixed(0)}%\n`;
    
    if (orbitalResponse.orbital_interpretation.primary_orb) {
      const personality = await referenceLoaders.getOrbPersonality(orbitalResponse.orbital_interpretation.primary_orb);
      if (personality) {
        baseSystemPrompt += `\n## PRIMARY ORB CONTEXT: Orb ${personality.number} - ${personality.name}\n`;
        baseSystemPrompt += `When responding, embody the personality of ${personality.name}:\n`;
        baseSystemPrompt += `- Core Traits: ${personality.coreTraits.join(', ')}\n`;
        baseSystemPrompt += `- Communication Style: ${personality.communicationStyle.join(', ')}\n`;
        baseSystemPrompt += `- Archetype: ${personality.culturalArchetype}\n`;
        baseSystemPrompt += `- Unique Gift: ${personality.uniqueGift}\n`;
      }
    }

    // Add conversation mode context
    baseSystemPrompt += `\n\n## CONVERSATION MODE\n\nYou are operating in conversation mode. Be helpful, expansive, and engaging. Use the field state and Orb context to guide your response style.\n`;

    // Add style training if available
    const stylePrompt = writingStyleTrainer.generateStylePrompt();
    const systemPrompt = baseSystemPrompt + (stylePrompt ? '\n\n' + stylePrompt : '');

    // Build conversation messages
    const conversationMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
        .filter((msg: any) => msg.content && msg.content.trim() !== '')
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }))
    ];

    // Add current content context if available
    if (currentContent) {
      conversationMessages.push({
        role: 'system',
        content: `Current content being worked on:\nTitle: ${title || 'Untitled'}\nContent: ${currentContent}`
      });
    }

    // STEP 4: Call OpenAI with enhanced prompt (using shared Orbital-Brain service)
    const aiResponse = await chatCompletions({
      model: 'gpt-4o',
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    // STEP 5: Return unified OrbitalResponse structure
    // Use OpenAI response as the narrative content, but include all Orbital Brain interpretation
    return NextResponse.json({
      content: aiResponse || orbitalResponse.content, // Use OpenAI response, fallback to Orbital Brain narrative
      metadata: orbitalResponse.metadata,
      rbi_output: orbitalResponse.rbi_output,
      orbital_interpretation: orbitalResponse.orbital_interpretation,
      field_memory: orbitalResponse.field_memory
    }, {
      headers: corsHeaders,
    });

  } catch (error: any) {
    console.error('AI conversation error:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { 
        error: 'Internal server error',
        content: 'I apologize, but I encountered an error. Please try again.',
        message: error?.message || 'Unknown error'
      },
      { 
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}
