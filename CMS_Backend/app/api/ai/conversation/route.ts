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
    const corsHeaders = getCorsHeaders(origin);
    // 204 No Content should not have a body
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('[ai/conversation] OPTIONS handler error:', error);
    // Fallback CORS headers
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    // Validate environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error('[ai/conversation] OPENAI_API_KEY not set');
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          message: 'OPENAI_API_KEY environment variable is required'
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // Dynamic imports to prevent build-time execution
    let chatCompletions: any;
    try {
      const orbitalBrain = await import('orbital-brain');
      chatCompletions = orbitalBrain.chatCompletions;
      if (!chatCompletions) {
        throw new Error('chatCompletions not exported from orbital-brain');
      }
    } catch (importError: any) {
      console.error('[ai/conversation] Failed to import orbital-brain:', importError);
      return NextResponse.json(
        { 
          error: 'Failed to load orbital-brain package',
          message: importError?.message || 'orbital-brain package not available'
        },
        { status: 500, headers: corsHeaders }
      );
    }

    const { runResonanceValidation } = await import('@/lib/resonance-api');
    const { writingStyleTrainer } = await import('@/lib/ai/style-training');

    const body = await request.json();
    const { messages, currentContent, title, orbContext, metadata, session_id } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get the user's inquiry (last message)
    const inquiry = messages[messages.length - 1]?.content || '';
    
    if (!inquiry || inquiry.trim().length === 0) {
      return NextResponse.json(
        { error: 'Inquiry message content is required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
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
    let rbiAnalysis: any;
    try {
      const resonanceEngine = EnhancedResonanceEngine.getInstance();
      rbiAnalysis = await resonanceEngine.analyzeContentWithMathematics(
        inquiry,
        title || undefined,
        contentMetadata
      );
      if (!rbiAnalysis) {
        throw new Error('RBI analysis returned null or undefined');
      }
    } catch (rbiError: any) {
      console.error('[ai/conversation] RBI analysis error:', rbiError);
      return NextResponse.json(
        { 
          error: 'RBI analysis failed',
          message: rbiError?.message || 'Failed to analyze content with RBI kernel'
        },
        { status: 500, headers: corsHeaders }
      );
    }

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
    let orbitalResponse: any;
    try {
      orbitalResponse = await generateOrbitalResponse({
        inquiry,
        content: currentContent,
        metadata: contentMetadata,
        rbi_output: rbiOutput,
        session_id
      });
      if (!orbitalResponse) {
        throw new Error('Orbital Brain response returned null or undefined');
      }
    } catch (orbitalError: any) {
      console.error('[ai/conversation] Orbital Brain error:', orbitalError);
      return NextResponse.json(
        { 
          error: 'Orbital Brain generation failed',
          message: orbitalError?.message || 'Failed to generate Orbital Brain response'
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // STEP 3: Use Orbital Brain interpretation to enhance OpenAI prompt
    let baseSystemPrompt = await buildOrbitalSystemPrompt();
    
    // Add Orbital Brain context to system prompt (with safety checks)
    const orbitalInterpretation = orbitalResponse.orbital_interpretation || {};
    if (orbitalInterpretation.field_state) {
      baseSystemPrompt += `\n\n## FIELD STATE: ${String(orbitalInterpretation.field_state).toUpperCase()}\n`;
    }
    if (orbitalInterpretation.narrative_coherence !== undefined) {
      baseSystemPrompt += `Narrative Coherence: ${(orbitalInterpretation.narrative_coherence * 100).toFixed(0)}%\n`;
    }
    
    // Get primary orb (handle both object and number formats)
    const primaryOrb = orbitalInterpretation.primary_orb;
    const primaryOrbId = typeof primaryOrb === 'number' ? primaryOrb : primaryOrb?.id;
    
    if (primaryOrbId) {
      try {
        const personality = await referenceLoaders.getOrbPersonality(primaryOrbId);
        if (personality) {
          baseSystemPrompt += `\n## PRIMARY ORB CONTEXT: Orb ${personality.number} - ${personality.name}\n`;
          baseSystemPrompt += `When responding, embody the personality of ${personality.name}:\n`;
          baseSystemPrompt += `- Core Traits: ${personality.coreTraits.join(', ')}\n`;
          baseSystemPrompt += `- Communication Style: ${personality.communicationStyle.join(', ')}\n`;
          baseSystemPrompt += `- Archetype: ${personality.culturalArchetype}\n`;
          baseSystemPrompt += `- Unique Gift: ${personality.uniqueGift}\n`;
        }
      } catch (personalityError) {
        console.warn(`[ai/conversation] Failed to load Orb ${primaryOrbId} personality:`, personalityError);
        // Continue without personality context
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
    let aiResponse: string;
    try {
      aiResponse = await chatCompletions({
        model: 'gpt-4o',
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 2000,
      });
      if (!aiResponse || typeof aiResponse !== 'string') {
        throw new Error('OpenAI response is invalid');
      }
    } catch (openaiError: any) {
      console.error('[ai/conversation] OpenAI API error:', openaiError);
      // Fallback to Orbital Brain content if OpenAI fails
      console.warn('[ai/conversation] Falling back to Orbital Brain narrative');
      aiResponse = orbitalResponse.content || 'I apologize, but I encountered an error generating a response.';
    }

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
    console.error('[ai/conversation] Unhandled error:', error);
    console.error('[ai/conversation] Error stack:', error?.stack);
    
    // Provide more detailed error information in development
    const errorDetails = process.env.NODE_ENV === 'development' ? {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    } : undefined;
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        content: 'I apologize, but I encountered an error. Please try again.',
        message: error?.message || 'Unknown error',
        ...(errorDetails && { details: errorDetails })
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
