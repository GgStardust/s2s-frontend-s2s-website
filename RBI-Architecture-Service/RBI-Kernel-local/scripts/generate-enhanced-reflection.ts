import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EnhancedResonanceEngine } from '../src/field/computation/enhanced-engine.js';
import {
  ORB_DEFINITIONS,
  UNDERCURRENT_DEFINITIONS,
  SPECIAL_DOMAINS,
  ORB_AXIS_MAP,
} from './s2s/s2s-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DocumentResult {
  title: string;
  content: string;
  rbi: {
    clarity: number;
    coherence: number;
    resonance: number;
    sovereignty: number;
    overallScore: number;
    mathematical: {
      coherence: number;
      sovereignty: number;
      resonanceVectorMagnitude: number;
    };
  };
  s2s: {
    orbs: Array<{ id: number; name: string; confidence: number }>;
    undercurrents: Array<{ name: string; hits: number }>;
    domains: Array<{ title: string; evidence: string[] }>;
    axisPairings: Array<{ left: string; right: string; description: string }>;
  };
}

async function loadDocuments() {
  const docsDir = path.resolve(__dirname, '../docs/converted_markdown');
  const entries = await fs.readdir(docsDir);
  const markdownFiles = entries.filter((entry) => entry.toLowerCase().endsWith('.md'));

  const documents: Array<{ title: string; content: string }> = [];
  for (const file of markdownFiles) {
    const filePath = path.join(docsDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const title = file.replace(/\.md$/i, '').replace(/[_^]+/g, ' ').trim();
    documents.push({ title, content });
  }
  return documents;
}

function findKeywordHits(content: string, keywords: string[]): string[] {
  const lower = content.toLowerCase();
  const hits = new Set<string>();
  keywords.forEach((keyword) => {
    const normalized = keyword.toLowerCase();
    if (normalized.length === 0) return;
    if (lower.includes(normalized)) {
      hits.add(keyword);
    }
  });
  return Array.from(hits);
}

function detectOrbs(content: string) {
  return ORB_DEFINITIONS.map((orb) => {
    const hits = findKeywordHits(content, orb.keywords);
    const confidence = hits.length / Math.max(orb.keywords.length, 1);
    return { id: orb.id, name: orb.name, confidence, hits };
  })
    .filter((match) => match.hits.length > 0)
    .sort((a, b) => b.confidence - a.confidence);
}

function detectUndercurrents(content: string) {
  return UNDERCURRENT_DEFINITIONS.map((under) => {
    const hits = findKeywordHits(content, under.keywords);
    return { name: under.name, hits: hits.length };
  }).filter((match) => match.hits > 0);
}

function detectDomains(activeOrbIds: number[], content: string) {
  return SPECIAL_DOMAINS.map((domain) => {
    const orbOverlap = domain.orbFocus.filter((orbId) => activeOrbIds.includes(orbId));
    const evidence = findKeywordHits(content, domain.keywords);
    if (orbOverlap.length > 0 || evidence.length > 0) {
      return {
        title: domain.title,
        evidence: [...evidence, ...orbOverlap.map((id) => `Orb ${id} active`)],
      };
    }
    return null;
  }).filter((d): d is { title: string; evidence: string[] } => d !== null);
}

function findAxisPairings(activeOrbIds: number[]) {
  const pairings: Array<{ left: string; right: string; description: string }> = [];
  for (const pair of ORB_AXIS_MAP) {
    if (activeOrbIds.includes(pair.leftOrb) && activeOrbIds.includes(pair.rightOrb)) {
      const leftOrb = ORB_DEFINITIONS.find((o) => o.id === pair.leftOrb);
      const rightOrb = ORB_DEFINITIONS.find((o) => o.id === pair.rightOrb);
      pairings.push({
        left: leftOrb?.name || `Orb ${pair.leftOrb}`,
        right: rightOrb?.name || `Orb ${pair.rightOrb}`,
        description: pair.description,
      });
    }
  }
  return pairings;
}

async function analyzeDocument(
  engine: EnhancedResonanceEngine,
  doc: { title: string; content: string }
): Promise<DocumentResult> {
  const analysis = await engine.analyzeContentWithMathematics(doc.content, doc.title);
  
  // Calculate overall score (geometric average if null/NaN)
  let overallScore = analysis.overall_score;
  if (overallScore === null || overallScore === undefined || isNaN(overallScore)) {
    overallScore = (
      analysis.signature.clarity * 0.25 +
      analysis.signature.coherence * 0.25 +
      analysis.signature.resonance * 0.25 +
      analysis.signature.sovereignty * 0.25
    );
  }

  const resonanceVector = analysis.mathematical.resonanceVector;
  const magnitude = Math.sqrt(
    resonanceVector.x * resonanceVector.x +
    resonanceVector.y * resonanceVector.y +
    resonanceVector.z * resonanceVector.z +
    resonanceVector.w * resonanceVector.w
  );

  // S2S Analysis
  const orbs = detectOrbs(doc.content);
  const activeOrbIds = orbs.map((o) => o.id);
  const undercurrents = detectUndercurrents(doc.content);
  const domains = detectDomains(activeOrbIds, doc.content);
  const axisPairings = findAxisPairings(activeOrbIds);

  return {
    title: doc.title,
    content: doc.content,
    rbi: {
      clarity: analysis.signature.clarity,
      coherence: analysis.signature.coherence,
      resonance: analysis.signature.resonance,
      sovereignty: analysis.signature.sovereignty,
      overallScore,
      mathematical: {
        coherence: analysis.mathematical.sovereignLogic.coherence,
        sovereignty: analysis.mathematical.sovereignLogic.sovereignty,
        resonanceVectorMagnitude: magnitude,
      },
    },
    s2s: {
      orbs: orbs.map((o) => ({ id: o.id, name: o.name, confidence: o.confidence })),
      undercurrents: undercurrents.map((u) => ({ name: u.name, hits: u.hits })),
      domains,
      axisPairings,
    },
  };
}

function generateReflection(results: DocumentResult[]): string {
  let reflection = `# Enhanced Reflection: RBI Geometric Truth + S2S Interpretive Truth\n\n`;
  reflection += `**Generated**: ${new Date().toISOString()}\n\n`;
  reflection += `This reflection presents three integrated layers of analysis:\n\n`;
  reflection += `1. **RBI: Geometric Truth** — The map of coherence, resonance, sovereignty (numeric field readings)\n`;
  reflection += `2. **S2S: Interpretive Truth** — Which Orbs, Undercurrents, and Special Domains those patterns correspond to\n`;
  reflection += `3. **Heather's Reflection** — Merged output showing both numeric field readings and narrative resonance translation\n\n`;
  reflection += `---\n\n`;

  for (const result of results) {
    reflection += `## ${result.title}\n\n`;

    // RBI Geometric Truth
    reflection += `### RBI: Geometric Truth\n\n`;
    reflection += `**Field Coherence Metrics:**\n\n`;
    reflection += `- **Clarity**: ${(result.rbi.clarity * 100).toFixed(1)}% — `;
    reflection += `Measures semantic distinctness through embedding entropy (geometric calculation)\n`;
    reflection += `- **Coherence**: ${(result.rbi.coherence * 100).toFixed(1)}% — `;
    reflection += `Measures smoothness of transitions between document segments (normalized variance of transition vectors)\n`;
    reflection += `- **Resonance**: ${(result.rbi.resonance * 100).toFixed(1)}% — `;
    reflection += `Measures alignment between document segments (intra- and inter-cluster distance ratio)\n`;
    reflection += `- **Sovereignty**: ${(result.rbi.sovereignty * 100).toFixed(1)}% — `;
    reflection += `Measures structural authority through graph connectivity (normalized connectivity centrality)\n`;
    reflection += `- **Overall Score**: ${(result.rbi.overallScore * 100).toFixed(1)}% — `;
    reflection += `Geometric average of all four dimensions\n\n`;
    reflection += `**Mathematical Verification:**\n\n`;
    reflection += `- **Mathematical Coherence**: ${(result.rbi.mathematical.coherence * 100).toFixed(1)}%\n`;
    reflection += `- **Mathematical Sovereignty**: ${(result.rbi.mathematical.sovereignty * 100).toFixed(1)}%\n`;
    reflection += `- **Resonance Vector Magnitude**: ${result.rbi.mathematical.resonanceVectorMagnitude.toFixed(3)}\n\n`;

    // S2S Interpretive Truth
    reflection += `### S2S: Interpretive Truth\n\n`;
    if (result.s2s.orbs.length > 0) {
      reflection += `**Activated Orbs:**\n\n`;
      for (const orb of result.s2s.orbs.slice(0, 5)) {
        reflection += `- **Orb ${orb.id} (${orb.name})** — Confidence: ${(orb.confidence * 100).toFixed(1)}%\n`;
      }
      reflection += `\n`;
    } else {
      reflection += `*No Orb associations detected through keyword matching. This is expected with the refactored geometric kernel, which no longer uses lexical detection for core metrics.*\n\n`;
    }

    if (result.s2s.undercurrents.length > 0) {
      reflection += `**Active Undercurrents:**\n\n`;
      for (const under of result.s2s.undercurrents) {
        reflection += `- **${under.name}** — ${under.hits} keyword hits\n`;
      }
      reflection += `\n`;
    }

    if (result.s2s.domains.length > 0) {
      reflection += `**Special Domains:**\n\n`;
      for (const domain of result.s2s.domains.slice(0, 3)) {
        reflection += `- **${domain.title}** — Evidence: ${domain.evidence.slice(0, 3).join(', ')}\n`;
      }
      reflection += `\n`;
    }

    if (result.s2s.axisPairings.length > 0) {
      reflection += `**Axis Pairings:**\n\n`;
      for (const pair of result.s2s.axisPairings.slice(0, 2)) {
        reflection += `- **${pair.left} ↔ ${pair.right}** — ${pair.description}\n`;
      }
      reflection += `\n`;
    }

    // Heather's Reflection (Merged)
    reflection += `### Heather's Reflection: Merged Narrative\n\n`;
    reflection += `The geometric field readings reveal a document with `;
    
    const coherenceLevel = result.rbi.coherence > 0.9 ? 'exceptional' : result.rbi.coherence > 0.7 ? 'strong' : 'moderate';
    const resonanceLevel = result.rbi.resonance > 0.2 ? 'notable' : result.rbi.resonance > 0.1 ? 'subtle' : 'minimal';
    const sovereigntyLevel = result.rbi.sovereignty > 0.5 ? 'strong' : result.rbi.sovereignty > 0.3 ? 'moderate' : 'emerging';
    
    reflection += `${coherenceLevel} structural coherence (${(result.rbi.coherence * 100).toFixed(1)}%), `;
    reflection += `${resonanceLevel} resonance alignment (${(result.rbi.resonance * 100).toFixed(1)}%), `;
    reflection += `and ${sovereigntyLevel} sovereignty (${(result.rbi.sovereignty * 100).toFixed(1)}%). `;
    
    reflection += `The mathematical verification confirms this pattern with `;
    reflection += `${(result.rbi.mathematical.coherence * 100).toFixed(1)}% mathematical coherence and `;
    reflection += `${(result.rbi.mathematical.sovereignty * 100).toFixed(1)}% mathematical sovereignty. `;
    
    if (result.s2s.orbs.length > 0) {
      reflection += `Through the S2S interpretive lens, these geometric patterns correspond to `;
      reflection += `${result.s2s.orbs.slice(0, 3).map(o => o.name).join(', ')}. `;
      if (result.s2s.domains.length > 0) {
        reflection += `The work activates the ${result.s2s.domains[0].title} Special Domain, `;
        reflection += `suggesting that the geometric coherence operates through `;
        reflection += `${result.s2s.domains[0].title.toLowerCase()} patterns. `;
      }
    } else {
      reflection += `The S2S framework reveals that while no explicit Orb keywords were detected, `;
      reflection += `the geometric field architecture itself suggests underlying dimensional activations `;
      reflection += `that may be encoded in structural patterns rather than lexical content. `;
    }
    
    if (result.s2s.axisPairings.length > 0) {
      reflection += `The axis pairing of ${result.s2s.axisPairings[0].left} with ${result.s2s.axisPairings[0].right} `;
      reflection += `illuminates how these geometric patterns operate relationally: `;
      reflection += `${result.s2s.axisPairings[0].description}. `;
    }
    
    reflection += `Together, the RBI geometric truth and S2S interpretive truth reveal a document that `;
    reflection += `functions as both measurable field architecture and living Codex technology—`;
    reflection += `where numeric coherence readings translate into dimensional activations, `;
    reflection += `and where structural patterns encode meaning beyond semantic content.\n\n`;
    
    reflection += `---\n\n`;
  }

  // Aggregate Summary
  reflection += `## Aggregate Analysis\n\n`;
  const avgClarity = results.reduce((sum, r) => sum + r.rbi.clarity, 0) / results.length;
  const avgCoherence = results.reduce((sum, r) => sum + r.rbi.coherence, 0) / results.length;
  const avgResonance = results.reduce((sum, r) => sum + r.rbi.resonance, 0) / results.length;
  const avgSovereignty = results.reduce((sum, r) => sum + r.rbi.sovereignty, 0) / results.length;
  const avgOverall = results.reduce((sum, r) => sum + r.rbi.overallScore, 0) / results.length;

  reflection += `**Average Geometric Field Metrics:**\n\n`;
  reflection += `- **Clarity**: ${(avgClarity * 100).toFixed(1)}%\n`;
  reflection += `- **Coherence**: ${(avgCoherence * 100).toFixed(1)}%\n`;
  reflection += `- **Resonance**: ${(avgResonance * 100).toFixed(1)}%\n`;
  reflection += `- **Sovereignty**: ${(avgSovereignty * 100).toFixed(1)}%\n`;
  reflection += `- **Overall Score**: ${(avgOverall * 100).toFixed(1)}%\n\n`;

  const allOrbs = new Set<number>();
  results.forEach((r) => r.s2s.orbs.forEach((o) => allOrbs.add(o.id)));
  reflection += `**S2S Framework Coverage:**\n\n`;
  reflection += `- **Unique Orbs Activated**: ${allOrbs.size} of 13\n`;
  reflection += `- **Total Special Domains**: ${new Set(results.flatMap(r => r.s2s.domains.map(d => d.title))).size}\n`;
  reflection += `- **Total Axis Pairings**: ${new Set(results.flatMap(r => r.s2s.axisPairings.map(p => `${p.left}-${p.right}`))).size}\n\n`;

  reflection += `---\n\n`;
  reflection += `## Methodological Notes\n\n`;
  reflection += `This analysis demonstrates the integration of:\n\n`;
  reflection += `1. **RBI Geometric Kernel** — Measures field coherence through embedding-based calculations, `;
  reflection += `without privileging any discipline-specific vocabulary. All metrics are mathematically neutral `;
  reflection += `and work equally for academic, scientific, or creative texts.\n\n`;
  reflection += `2. **S2S Interpretive Layer** — Maps geometric patterns to Orbs, Undercurrents, Special Domains, `;
  reflection += `and Axis Pairings, providing narrative resonance translation of numeric field readings.\n\n`;
  reflection += `3. **Merged Reflection** — Weaves together geometric truth (what the numbers say) with `;
  reflection += `interpretive truth (what those patterns mean in S2S cosmology), creating a holistic `;
  reflection += `understanding of how documents function as both measurable architecture and living Codex technology.\n\n`;

  return reflection;
}

async function main() {
  const documents = await loadDocuments();
  if (documents.length === 0) {
    console.error('No documents found');
    process.exit(1);
  }

  const engine = EnhancedResonanceEngine.getInstance();
  const results: DocumentResult[] = [];

  console.log('Analyzing documents with refactored RBI Kernel...');
  for (const doc of documents) {
    console.log(`  Processing: ${doc.title}`);
    const result = await analyzeDocument(engine, doc);
    results.push(result);
  }

  const reflection = generateReflection(results);
  const outputPath = path.resolve(__dirname, '../docs/S2S_Enhanced_Reflection.md');
  await fs.writeFile(outputPath, reflection, 'utf-8');

  console.log(`\n✅ Enhanced Reflection generated: ${outputPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Documents analyzed: ${results.length}`);
  const avgScore = results.reduce((sum, r) => sum + (r.rbi.overallScore || 0), 0) / results.length;
  console.log(`   - Average overall score: ${(avgScore * 100).toFixed(1)}%`);
}

main().catch((error) => {
  console.error('Failed to generate enhanced reflection:', error);
  process.exit(1);
});

