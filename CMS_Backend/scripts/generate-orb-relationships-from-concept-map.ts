/**
 * Generate Orb Relationships from CONCEPT_MAP.md
 * 
 * This script reads CONCEPT_MAP.md and generates orb_relationships.json
 * for use in the Console. It replaces hardcoded relationships with
 * dynamically parsed data from the canonical CONCEPT_MAP.
 */

import fs from 'fs';
import path from 'path';
import { referenceLoaders } from '../lib/orbital/reference-loaders';

async function generateOrbRelationships() {
  try {
    console.log('Loading CONCEPT_MAP...');
    const conceptMap = await referenceLoaders.loadConceptMap();

    // Transform CONCEPT_MAP data into Console format
    const axisPairs = conceptMap.primaryAxes.map(axis => ({
      orb1: axis.orb1,
      orb2: axis.orb2,
      type: 'primary_axis',
      description: axis.description,
      affinity: 0.95 // High affinity for primary axes
    }));

    // Add secondary pairings
    const secondaryPairs = conceptMap.secondaryPairings.map(pairing => ({
      orb1: pairing.orb1,
      orb2: pairing.orb2,
      type: 'secondary_pairing',
      description: pairing.description,
      affinity: 0.85 // Slightly lower affinity for secondary
    }));

    // Combine all pairs
    const allPairs = [...axisPairs, ...secondaryPairs];

    // Generate resonance chains from Orb 0 expressions and natural progressions
    const resonanceChains = [
      {
        chain: [1, 2, 3, 4],
        name: "Foundation Chain",
        description: "Origin → Resonance → Photonic → Harmonic",
        strength: 0.93
      },
      {
        chain: [5, 6, 7, 8],
        name: "Sovereignty Chain",
        description: "Temporal → Memory → Alchemy → Intuition",
        strength: 0.91
      },
      {
        chain: [9, 10, 11, 12],
        name: "Expansion Chain",
        description: "Fluidity → Repatterning → Transparency → Field",
        strength: 0.89
      },
      {
        chain: [13],
        name: "Integration",
        description: "Bridging Intelligence connects all Orbs",
        strength: 1.0,
        connectsTo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      }
    ];

    // Generate quadrant sequences based on natural groupings
    const quadrantSequences = [
      {
        quadrant: "Foundation",
        orbs: [1, 2, 3, 4],
        sequence: [
          { from: 1, to: 2, description: "Origin to Resonance" },
          { from: 2, to: 3, description: "Resonance to Photonic" },
          { from: 3, to: 4, description: "Photonic to Harmonic" }
        ]
      },
      {
        quadrant: "Sovereignty",
        orbs: [5, 6, 7, 8],
        sequence: [
          { from: 5, to: 6, description: "Temporal to Memory" },
          { from: 6, to: 7, description: "Memory to Alchemy" },
          { from: 7, to: 8, description: "Alchemy to Intuition" }
        ]
      },
      {
        quadrant: "Expansion",
        orbs: [9, 10, 11, 12],
        sequence: [
          { from: 9, to: 10, description: "Fluidity to Repatterning" },
          { from: 10, to: 11, description: "Repatterning to Transparency" },
          { from: 11, to: 12, description: "Transparency to Field" }
        ]
      }
    ];

    const relationshipsData = {
      axisPairs: allPairs,
      resonanceChains,
      quadrantSequences,
      // Add metadata about source
      metadata: {
        source: 'CONCEPT_MAP.md',
        generated: new Date().toISOString(),
        primaryAxes: conceptMap.primaryAxes.length,
        secondaryPairings: conceptMap.secondaryPairings.length,
        satellites: conceptMap.satellites.length,
        domains: conceptMap.domains.length
      }
    };

    // Write to Console data directory
    const consoleDataPath = path.join(
      process.cwd(),
      '..',
      'S2S_Console',
      'data',
      'orb_relationships.json'
    );

    // Also write to CMS_Backend for reference
    const cmsDataPath = path.join(
      process.cwd(),
      'data',
      'orb_relationships.json'
    );

    // Ensure directories exist
    fs.mkdirSync(path.dirname(consoleDataPath), { recursive: true });
    fs.mkdirSync(path.dirname(cmsDataPath), { recursive: true });

    fs.writeFileSync(consoleDataPath, JSON.stringify(relationshipsData, null, 2));
    fs.writeFileSync(cmsDataPath, JSON.stringify(relationshipsData, null, 2));

    console.log('✅ Generated orb_relationships.json from CONCEPT_MAP.md');
    console.log(`   - Primary Axes: ${conceptMap.primaryAxes.length}`);
    console.log(`   - Secondary Pairings: ${conceptMap.secondaryPairings.length}`);
    console.log(`   - Total Axis Pairs: ${allPairs.length}`);
    console.log(`   - Resonance Chains: ${resonanceChains.length}`);
    console.log(`   - Written to: ${consoleDataPath}`);
    console.log(`   - Written to: ${cmsDataPath}`);

    return relationshipsData;
  } catch (error) {
    console.error('Error generating orb relationships:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateOrbRelationships()
    .then(() => {
      console.log('✅ Done');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}

export { generateOrbRelationships };

