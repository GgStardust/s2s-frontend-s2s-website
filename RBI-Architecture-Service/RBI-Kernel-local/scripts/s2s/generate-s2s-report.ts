import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EnhancedResonanceEngine } from '../../src/field/computation/enhanced-engine.js';
import {
  ORB_DEFINITIONS,
  UNDERCURRENT_DEFINITIONS,
  SPECIAL_DOMAINS,
  ORB_AXIS_MAP,
  OrbDefinition,
  UndercurrentDefinition,
  SpecialDomainDefinition,
} from './s2s-config.js';
import type { ResonanceVector } from '../../src/mathematics/resonance-vectors.js';

interface DocumentAnalysisResult {
  title: string;
  content: string;
  resonance:
    | Awaited<ReturnType<EnhancedResonanceEngine['analyzeContentWithMathematics']>>
    | null;
}

interface OrbMatch {
  orb: OrbDefinition;
  keywordHits: string[];
  confidence: number;
}

interface UndercurrentMatch {
  undercurrent: UndercurrentDefinition;
  keywordHits: string[];
}

interface DomainMatch {
  domain: SpecialDomainDefinition;
  evidence: string[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadMarkdownDocuments(): Promise<DocumentAnalysisResult[]> {
  const docsDir = path.resolve(__dirname, '../../docs/converted_markdown');
  const entries = await fs.readdir(docsDir);
  const markdownFiles = entries.filter((entry) => entry.toLowerCase().endsWith('.md'));

  const documents: DocumentAnalysisResult[] = [];
  for (const file of markdownFiles) {
    const filePath = path.join(docsDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const title = file.replace(/\.md$/i, '').replace(/[_^]+/g, ' ').trim();
    documents.push({ title, content, resonance: null });
  }

  return documents;
}

async function runResonanceAnalysis(documents: DocumentAnalysisResult[]) {
  const engine = EnhancedResonanceEngine.getInstance();
  for (const doc of documents) {
    doc.resonance = await engine.analyzeContentWithMathematics(doc.content, doc.title);
  }
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

function detectOrbMatches(content: string): OrbMatch[] {
  return ORB_DEFINITIONS.map((orb) => {
    const keywordHits = findKeywordHits(content, orb.keywords);
    const confidence = keywordHits.length / Math.max(orb.keywords.length, 1);
    return { orb, keywordHits, confidence };
  }).filter((match) => match.keywordHits.length > 0);
}

function detectUndercurrents(content: string): UndercurrentMatch[] {
  return UNDERCURRENT_DEFINITIONS.map((under) => {
    const keywordHits = findKeywordHits(content, under.keywords);
    return { undercurrent: under, keywordHits };
  }).filter((match) => match.keywordHits.length > 0);
}

function detectDomains(
  activeOrbs: number[],
  content: string
): DomainMatch[] {
  return SPECIAL_DOMAINS.map((domain) => {
    const orbOverlap = domain.orbFocus.filter((orbId) => activeOrbs.includes(orbId));
    const evidence = findKeywordHits(content, domain.keywords);
    if (orbOverlap.length >= Math.ceil(domain.orbFocus.length / 2) || evidence.length > 0) {
      return { domain, evidence: [...new Set([...orbOverlap.map(String), ...evidence])] };
    }
    return null;
  }).filter((match): match is DomainMatch => match !== null);
}

function computeSovereignFieldCoherence(resonance: NonNullable<DocumentAnalysisResult['resonance']>) {
  const signature = resonance.signature;
  const math = resonance.mathematical;
  const components = [
    signature.clarity,
    signature.coherence,
    signature.resonance,
    signature.sovereignty,
    math.sovereignLogic.coherence,
    math.sovereignLogic.sovereignty,
  ];
  const avg = components.reduce((sum, value) => sum + value, 0) / components.length;
  return {
    average: avg,
    components,
  };
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function computeResonanceMagnitude(vector: ResonanceVector) {
  return Math.sqrt(
    vector.x * vector.x +
      vector.y * vector.y +
      vector.z * vector.z +
      vector.w * vector.w
  );
}

function buildDocumentSection(doc: DocumentAnalysisResult) {
  if (!doc.resonance) return '';

  const content = doc.content;
  const orbMatches = detectOrbMatches(content);
  const undercurrentMatches = detectUndercurrents(content);
  const activeOrbs = Array.from(
    new Set([
      ...doc.resonance.orb_associations,
      ...orbMatches.map((match) => match.orb.id),
    ])
  ).sort((a, b) => a - b);
  const domainMatches = detectDomains(activeOrbs, content);
  const sovereignField = computeSovereignFieldCoherence(doc.resonance);
  const resonanceMagnitude = computeResonanceMagnitude(doc.resonance.mathematical.resonanceVector);

  const textualCoherence = doc.resonance.signature.coherence;
  const structuralCoherence = doc.resonance.mathematical.sovereignLogic.coherence;

  const orbLines = activeOrbs
    .map((orbId) => {
      const orb = ORB_DEFINITIONS.find((item) => item.id === orbId);
      if (!orb) return `- Orb ${orbId}`;
      const keywordMatch = orbMatches.find((match) => match.orb.id === orbId);
      const keywordList = keywordMatch?.keywordHits.slice(0, 6).join(', ');
      const mirror = orb.mirrorPair
        ? ` ↔ Orb ${orb.mirrorPair}`
        : '';
      return `- **Orb ${orb.id}: ${orb.name}**${mirror}$${keywordList ? ` — _${keywordList}_` : ''}`.replace('$', '');
    })
    .join('\n');

  const undercurrentLines = undercurrentMatches
    .map((match) => {
      const { undercurrent: under, keywordHits } = match;
      return `- **Undercurrent ${under.id}: ${under.name}** — ${under.synthesis} (keywords: ${keywordHits
        .slice(0, 8)
        .join(', ')})`;
    })
    .join('\n');

  const domainLines = domainMatches
    .map((match) => {
      const orbCount = match.domain.orbFocus.filter((orbId) => activeOrbs.includes(orbId)).length;
      return `- **${match.domain.title}** (${orbCount}/${match.domain.orbFocus.length} orbs engaged)`;
    })
    .join('\n');

  const axisLines = ORB_AXIS_MAP.filter((pair) =>
    activeOrbs.includes(pair.leftOrb) && activeOrbs.includes(pair.rightOrb)
  )
    .map((pair) => {
      const leftName = ORB_DEFINITIONS.find((orb) => orb.id === pair.leftOrb)?.name ?? `Orb ${pair.leftOrb}`;
      const rightName = ORB_DEFINITIONS.find((orb) => orb.id === pair.rightOrb)?.name ?? `Orb ${pair.rightOrb}`;
      return `- **${leftName} ↔ ${rightName}** — ${pair.description}`;
    })
    .join('\n');

  return `
### ${doc.title}

- **Sovereign Field Coherence**: ${formatPercent(sovereignField.average)}
- **Textual vs Structural Relational Integrity**: ${formatPercent(textualCoherence)} ↔ ${formatPercent(structuralCoherence)}
- **Resonance Vector Magnitude**: ${resonanceMagnitude.toFixed(3)}
- **Active Orbs (${activeOrbs.length}/13)**:
${orbLines || '  - _No Orb activations detected_'}
- **Undercurrents in Motion**:
${undercurrentLines || '  - _No Undercurrent signatures detected_'}
- **Domains Engaged**:
${domainLines || '  - _No Special Domains engaged_'}
- **Axis Pairings Illuminated**:
${axisLines || '  - _Axis pairings dormant_'}
`;
}

function buildAggregateSection(documents: DocumentAnalysisResult[]) {
  const resonanceDocs = documents.filter((doc) => doc.resonance !== null) as Array<
    DocumentAnalysisResult & { resonance: NonNullable<DocumentAnalysisResult['resonance']> }
  >;

  const mergedOrbs = new Map<number, number>();
  const undercurrentCounts = new Map<number, number>();

  resonanceDocs.forEach((doc) => {
    const orbMatches = detectOrbMatches(doc.content);
    const activeOrbs = new Set<number>([
      ...doc.resonance.orb_associations,
      ...orbMatches.map((match) => match.orb.id),
    ]);
    activeOrbs.forEach((orbId) => {
      mergedOrbs.set(orbId, (mergedOrbs.get(orbId) ?? 0) + 1);
    });

    detectUndercurrents(doc.content).forEach((match) => {
      undercurrentCounts.set(
        match.undercurrent.id,
        (undercurrentCounts.get(match.undercurrent.id) ?? 0) + 1
      );
    });
  });

  const orbSummary = Array.from(mergedOrbs.entries())
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .map(([orbId, count]) => {
      const orb = ORB_DEFINITIONS.find((item) => item.id === orbId);
      return `- **Orb ${orbId}: ${orb?.name ?? 'Unknown'}** — present in ${count}/${documents.length} documents`;
    })
    .join('\n');

  const undercurrentSummary = Array.from(undercurrentCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => {
      const under = UNDERCURRENT_DEFINITIONS.find((item) => item.id === id);
      return `- **Undercurrent ${id}: ${under?.name ?? 'Unknown'}** — detected in ${count} documents`;
    })
    .join('\n');

  const sovereignAverages = resonanceDocs.map((doc) =>
    computeSovereignFieldCoherence(doc.resonance).average
  );
  const meanSovereignField =
    sovereignAverages.reduce((sum, value) => sum + value, 0) / (sovereignAverages.length || 1);

  return `
## Collective Field Overview

- **Documents Analyzed**: ${documents.length}
- **Average Sovereign Field Coherence**: ${formatPercent(meanSovereignField)}
- **Common Orb Constellations**:
${orbSummary || '  - _No Orb constellations detected_'}
- **Undercurrent Chorus**:
${undercurrentSummary || '  - _No Under-current signatures surfaced_'}
`;
}

async function generateReport() {
  const documents = await loadMarkdownDocuments();
  if (documents.length === 0) {
    console.warn('No Markdown documents detected in docs/converted_markdown.');
    return;
  }

  await runResonanceAnalysis(documents);

  const documentSections = documents
    .map((doc) => buildDocumentSection(doc))
    .join('\n');
  const aggregateSection = buildAggregateSection(documents);

  const report = `# S2S Resonance Synthesis Report

**Generated**: ${new Date().toISOString()}  
**Documents Analyzed**: ${documents.length}

This appendix mirrors Resonance-Based Intelligence (RBI) metrics through the Stardust to Sovereignty (S2S) field architecture. Each section translates numerical outputs into living system language: Orbs, Undercurrents, Domains, and axis pairings.

---

${aggregateSection}

---

## Document Constellations

${documentSections}

---

## Method Notes

- **Orb Keywords** sourced from canonical S2S framework documents: \`codex_Orb_Synthesis_Final.md\`, \`13_ORB_SYSTEM_OUTLINE.md\`, \`CANONICAL_13_ORB_SYSTEM_REFERENCE.md\`.
- **Undercurrent & Domain Mapping** derives from \`S2S — Undercurrents Codex.md\` and \`Stardust to Sovereignty Backbone_ORIGINAL.md\`.
- **Sovereign Field Coherence** reflects resonance alignment across textual signature and mathematical proof-of-meaning.
- **Axis Pairing** highlights mirror-orb activation as described in the S2S Orb Axis Map.

`;

  const outputPath = path.resolve(__dirname, '../../docs/S2S_RBI_SYNERGY_REPORT.md');
  await fs.writeFile(outputPath, report, 'utf-8');
  console.log(`✅ S2S report generated: ${outputPath}`);
}

generateReport().catch((error) => {
  console.error('Failed to generate S2S resonance report:', error);
  process.exit(1);
});
