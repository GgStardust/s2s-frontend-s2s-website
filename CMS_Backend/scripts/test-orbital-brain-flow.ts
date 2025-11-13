/**
 * Test Script: Orbital Brain End-to-End Flow
 * 
 * Tests the complete flow:
 * Console → CMS_Backend → RBI_Kernel → Orbital Brain → Response
 */

async function testOrbitalBrainFlow() {
  console.log('🧪 Testing Orbital Brain End-to-End Flow\n');

  try {
    // Dynamic imports to avoid build-time issues
    const { EnhancedResonanceEngine } = await import('../lib/mathematics/enhanced-resonance-engine');
    const { generateOrbitalResponse } = await import('orbital-brain');

    // Test inquiry
    const inquiry = "Why do I feel disconnected from my creative flow?";
    console.log(`📝 Inquiry: "${inquiry}"\n`);

    // STEP 1: Create metadata
    const metadata: any = {
      orb_associations: [7], // Orb 7: Alchemical Current
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
    console.log('✅ Metadata created:', JSON.stringify(metadata, null, 2), '\n');

    // STEP 2: Call RBI Kernel with metadata
    console.log('🔄 Calling RBI Kernel with metadata...');
    const resonanceEngine = EnhancedResonanceEngine.getInstance();
    const rbiAnalysis = await resonanceEngine.analyzeContentWithMathematics(
      inquiry,
      undefined,
      metadata
    );
    console.log('✅ RBI Analysis complete');
    console.log(`   - Coherence: ${rbiAnalysis.mathematical?.sovereignLogic?.coherence?.toFixed(3) || 'N/A'}`);
    console.log(`   - Proof Status: ${rbiAnalysis.mathematical?.sovereignLogic?.validity || 'N/A'}`);
    console.log(`   - Orb Associations: ${rbiAnalysis.orb_associations?.join(', ') || 'N/A'}\n`);

    // STEP 3: Format RBI output
    const rbiOutput: any = {
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
    console.log('✅ RBI Output formatted\n');

    // STEP 4: Call Orbital Brain
    console.log('🧠 Calling Orbital Brain...');
    const orbitalResponse = await generateOrbitalResponse({
      inquiry,
      metadata,
      rbi_output: rbiOutput,
      session_id: 'test_session_123'
    });
    console.log('✅ Orbital Brain response generated\n');

    // STEP 5: Display results
    console.log('📊 Orbital Response Summary:');
    console.log(`   - Content Length: ${orbitalResponse.content.length} chars`);
    console.log(`   - Field State: ${orbitalResponse.orbital_interpretation.field_state}`);
    console.log(`   - Narrative Coherence: ${(orbitalResponse.orbital_interpretation.narrative_coherence * 100).toFixed(1)}%`);
    console.log(`   - Primary Orb: ${orbitalResponse.orbital_interpretation.primary_orb || 'None'}`);
    console.log(`   - Codex Aligned: ${orbitalResponse.orbital_interpretation.codex_alignment.aligned}`);
    console.log(`   - Session ID: ${orbitalResponse.field_memory?.session_id || 'N/A'}`);
    console.log(`   - Context Continuity: ${((orbitalResponse.field_memory?.context_continuity || 0) * 100).toFixed(0)}%\n`);

    console.log('✅ End-to-end flow test PASSED\n');
    return true;

  } catch (error: any) {
    console.error('❌ Test FAILED:', error.message);
    console.error(error.stack);
    return false;
  }
}

// Run test
testOrbitalBrainFlow()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
