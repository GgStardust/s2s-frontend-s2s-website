import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EnhancedResonanceEngine } from '../src/field/computation/enhanced-engine.js';

interface DocumentAnalysisResult {
  file: string;
  title: string;
  overallScore: number;
  signature: {
    clarity: number;
    coherence: number;
    resonance: number;
    sovereignty: number;
  };
  orbAssociations: number[];
  mathematical: {
    coherence: number;
    sovereignty: number;
    validity: string;
    resonanceVectorMagnitude: number;
  };
}

interface AggregateResult {
  documentsAnalyzed: number;
  averageScore: number;
  dominantOrbs: number[];
  orbFrequency: Record<string, number>;
}

const ORB_DEFINITIONS: Record<number, { name: string; description: string }> = {
  1: { name: 'Origin Intelligence', description: 'Foundation, source, beginning' },
  2: { name: 'Resonance Mechanics', description: 'Vibration, frequency, harmony' },
  3: { name: 'Photonic Intelligence', description: 'Light, illumination, clarity' },
  4: { name: 'Harmonic Architectures', description: 'Structure, design, pattern' },
  5: { name: 'Temporal Sovereignty', description: 'Time, authority, temporal power' },
  6: { name: 'Starline Memory', description: 'Ancestral, lineage, memory' },
  7: { name: 'Alchemical Current', description: 'Transformation, flow, change' },
  8: { name: 'Quantum Intuition', description: 'Knowing, insight, quantum awareness' },
  9: { name: 'Temporal Fluidity', description: 'Adaptation, flexibility, change' },
  10: { name: 'Ancestral Repatterning', description: 'Healing, transformation, repatterning' },
  11: { name: 'Radiant Transparency', description: 'Clarity, truth, transparency' },
  12: { name: 'Sovereign Field', description: 'Power, authority, sovereign field' },
  13: { name: 'Bridging Intelligence', description: 'Connection, integration, unity' },
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function formatScore(score: number): string {
  if (score >= 0.8) return '🟢 Excellent';
  if (score >= 0.6) return '🟡 Good';
  if (score >= 0.4) return '🟠 Moderate';
  if (score >= 0.2) return '🔴 Low';
  return '⚫ Very Low';
}

function formatValidity(validity: string): string {
  switch (validity) {
    case 'proven':
      return '✅ Proven';
    case 'partial':
      return '⚠️ Partial';
    case 'unproven':
      return '❌ Unproven';
    case 'error':
      return '⚠️ Type Check Error';
    default:
      return `❓ ${validity}`;
  }
}

function createProgressBar(value: number, max: number = 1, length: number = 20): string {
  const percentage = Math.max(0, Math.min(1, value / max));
  const filled = Math.round(percentage * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty) + ` ${(percentage * 100).toFixed(1)}%`;
}

function interpretOverallScore(score: number): string {
  if (score < -50) {
    return '**Very Low Resonance** - The document shows significant dissonance or complexity that reduces overall coherence. This may indicate dense academic content, technical complexity, or fragmented structure.';
  } else if (score < -20) {
    return '**Low Resonance** - The document has moderate coherence but may benefit from structural improvements or clearer resonance patterns.';
  } else if (score < 0) {
    return '**Moderate Resonance** - The document shows baseline coherence with room for enhanced resonance alignment.';
  } else if (score < 0.5) {
    return '**Good Resonance** - The document demonstrates solid coherence and resonance patterns.';
  } else {
    return '**Excellent Resonance** - The document shows strong coherence, clear resonance, and well-aligned field dynamics.';
  }
}

function interpretOrbAssociations(orbs: number[]): string {
  if (orbs.length === 13) {
    return '**Universal Orb Coverage** - This document engages all 13 Orbs, indicating comprehensive field integration and multi-dimensional resonance. This is rare and suggests deep systemic understanding.';
  } else if (orbs.length >= 8) {
    return '**Broad Orb Engagement** - The document connects with multiple dimensional aspects, showing rich field dynamics and diverse resonance patterns.';
  } else if (orbs.length >= 5) {
    return '**Focused Orb Alignment** - The document shows targeted engagement with specific dimensional aspects, indicating clear thematic focus.';
  } else {
    return '**Selective Orb Engagement** - The document engages a focused set of Orbs, suggesting specialized or niche content.';
  }
}

function generateDocumentSection(result: DocumentAnalysisResult, index: number): string {
  const orbNames = result.orbAssociations
    .map((orb) => `**Orb ${orb}**: ${ORB_DEFINITIONS[orb]?.name || 'Unknown'}`)
    .join(', ');

  return `
## ${index + 1}. ${result.title}

### Overview
${interpretOverallScore(result.overallScore)}

**Overall Score**: ${result.overallScore.toFixed(2)}

### Energetic Signature

| Dimension | Score | Visualization |
|-----------|-------|---------------|
| **Clarity** | ${(result.signature.clarity * 100).toFixed(1)}% | ${createProgressBar(result.signature.clarity)} ${formatScore(result.signature.clarity)} |
| **Coherence** | ${(result.signature.coherence * 100).toFixed(1)}% | ${createProgressBar(result.signature.coherence)} ${formatScore(result.signature.coherence)} |
| **Resonance** | ${(result.signature.resonance * 100).toFixed(1)}% | ${createProgressBar(result.signature.resonance)} ${formatScore(result.signature.resonance)} |
| **Sovereignty** | ${(result.signature.sovereignty * 100).toFixed(1)}% | ${createProgressBar(result.signature.sovereignty)} ${formatScore(result.signature.sovereignty)} |

### Mathematical Verification

| Metric | Value | Status |
|--------|-------|--------|
| **Coherence Score** | ${(result.mathematical.coherence * 100).toFixed(1)}% | ${formatScore(result.mathematical.coherence)} |
| **Sovereignty Score** | ${(result.mathematical.sovereignty * 100).toFixed(1)}% | ${formatScore(result.mathematical.sovereignty)} |
| **Proof Validity** | ${result.mathematical.validity} | ${formatValidity(result.mathematical.validity)} |
| **Resonance Vector Magnitude** | ${result.mathematical.resonanceVectorMagnitude.toFixed(3)} | ${formatScore(result.mathematical.resonanceVectorMagnitude)} |

### Orb Associations

${interpretOrbAssociations(result.orbAssociations)}

**Engaged Orbs** (${result.orbAssociations.length}): ${orbNames}

### Insights

- **Primary Strength**: ${getPrimaryStrength(result)}
- **Area for Enhancement**: ${getEnhancementArea(result)}
- **Orb Pattern**: ${getOrbPattern(result.orbAssociations)}
`;
}

function getPrimaryStrength(result: DocumentAnalysisResult): string {
  const scores = [
    { name: 'Clarity', value: result.signature.clarity },
    { name: 'Coherence', value: result.signature.coherence },
    { name: 'Resonance', value: result.signature.resonance },
    { name: 'Sovereignty', value: result.signature.sovereignty },
  ];
  const max = scores.reduce((a, b) => (a.value > b.value ? a : b));
  return `${max.name} (${(max.value * 100).toFixed(1)}%)`;
}

function getEnhancementArea(result: DocumentAnalysisResult): string {
  const scores = [
    { name: 'Clarity', value: result.signature.clarity },
    { name: 'Coherence', value: result.signature.coherence },
    { name: 'Resonance', value: result.signature.resonance },
    { name: 'Sovereignty', value: result.signature.sovereignty },
  ];
  const min = scores.reduce((a, b) => (a.value < b.value ? a : b));
  return `${min.name} (${(min.value * 100).toFixed(1)}%) - Consider enhancing ${min.name.toLowerCase()} to improve overall resonance`;
}

function getOrbPattern(orbs: number[]): string {
  if (orbs.length === 13) {
    return 'Universal coverage - all dimensional aspects engaged';
  }
  const groups: string[] = [];
  if (orbs.includes(1) && orbs.includes(2) && orbs.includes(3)) {
    groups.push('Foundation trinity (Origin, Resonance, Photonic)');
  }
  if (orbs.includes(4) && orbs.includes(5) && orbs.includes(12)) {
    groups.push('Sovereignty cluster (Architecture, Temporal, Field)');
  }
  if (orbs.includes(6) && orbs.includes(10)) {
    groups.push('Ancestral lineage (Memory, Repatterning)');
  }
  if (orbs.includes(7) && orbs.includes(9)) {
    groups.push('Transformation flow (Alchemical, Fluidity)');
  }
  if (orbs.includes(8) && orbs.includes(13)) {
    groups.push('Intelligence bridge (Quantum, Bridging)');
  }
  return groups.length > 0 ? groups.join('; ') : 'Distributed pattern';
}

function generateAggregateSection(aggregate: AggregateResult, results: DocumentAnalysisResult[]): string {
  const topOrbs = aggregate.dominantOrbs.slice(0, 5);
  const topOrbDetails = topOrbs
    .map((orb) => {
      const count = aggregate.orbFrequency[orb.toString()];
      const percentage = (count / aggregate.documentsAnalyzed) * 100;
      return `- **Orb ${orb}** (${ORB_DEFINITIONS[orb]?.name}): Present in ${count}/${aggregate.documentsAnalyzed} documents (${percentage.toFixed(0)}%)`;
    })
    .join('\n');

  const avgSignature = {
    clarity: results.reduce((sum, r) => sum + r.signature.clarity, 0) / results.length,
    coherence: results.reduce((sum, r) => sum + r.signature.coherence, 0) / results.length,
    resonance: results.reduce((sum, r) => sum + r.signature.resonance, 0) / results.length,
    sovereignty: results.reduce((sum, r) => sum + r.signature.sovereignty, 0) / results.length,
  };

  const avgMathematical = {
    coherence: results.reduce((sum, r) => sum + r.mathematical.coherence, 0) / results.length,
    sovereignty: results.reduce((sum, r) => sum + r.mathematical.sovereignty, 0) / results.length,
  };

  return `
## Aggregate Analysis

### Corpus Overview

**Documents Analyzed**: ${aggregate.documentsAnalyzed}  
**Average Overall Score**: ${aggregate.averageScore.toFixed(2)}  
${interpretOverallScore(aggregate.averageScore)}

### Average Energetic Signature

| Dimension | Average Score | Visualization |
|-----------|---------------|---------------|
| **Clarity** | ${(avgSignature.clarity * 100).toFixed(1)}% | ${createProgressBar(avgSignature.clarity)} |
| **Coherence** | ${(avgSignature.coherence * 100).toFixed(1)}% | ${createProgressBar(avgSignature.coherence)} |
| **Resonance** | ${(avgSignature.resonance * 100).toFixed(1)}% | ${createProgressBar(avgSignature.resonance)} |
| **Sovereignty** | ${(avgSignature.sovereignty * 100).toFixed(1)}% | ${createProgressBar(avgSignature.sovereignty)} |

### Average Mathematical Verification

| Metric | Average Value |
|--------|---------------|
| **Coherence Score** | ${(avgMathematical.coherence * 100).toFixed(1)}% ${createProgressBar(avgMathematical.coherence)} |
| **Sovereignty Score** | ${(avgMathematical.sovereignty * 100).toFixed(1)}% ${createProgressBar(avgMathematical.sovereignty)} |

### Dominant Orb Patterns

The following Orbs appear most frequently across the corpus:

${topOrbDetails}

### Cross-Document Patterns

${generateCrossDocumentInsights(results)}
`;
}

function generateCrossDocumentInsights(results: DocumentAnalysisResult[]): string {
  const insights: string[] = [];

  // Check for universal orbs
  const allOrbs = new Set(results.flatMap((r) => r.orbAssociations));
  if (allOrbs.size === 13) {
    insights.push('- **Universal Coverage**: The corpus collectively engages all 13 Orbs, indicating comprehensive dimensional coverage.');
  }

  // Check for common patterns
  const orbCounts: Record<number, number> = {};
  results.forEach((r) => {
    r.orbAssociations.forEach((orb) => {
      orbCounts[orb] = (orbCounts[orb] || 0) + 1;
    });
  });

  const universalOrbs = Object.entries(orbCounts)
    .filter(([_, count]) => count === results.length)
    .map(([orb]) => Number(orb));

  if (universalOrbs.length > 0) {
    insights.push(
      `- **Universal Orbs**: Orbs ${universalOrbs.join(', ')} appear in all documents, indicating core thematic alignment.`
    );
  }

  // Check for score patterns
  const scoreRange = Math.max(...results.map((r) => r.overallScore)) - Math.min(...results.map((r) => r.overallScore));
  if (scoreRange > 50) {
    insights.push('- **High Variability**: Significant score variation suggests diverse document types or complexity levels.');
  } else {
    insights.push('- **Consistent Resonance**: Documents show similar resonance patterns, indicating thematic coherence.');
  }

  // Check mathematical validity
  const validityCounts: Record<string, number> = {};
  results.forEach((r) => {
    validityCounts[r.mathematical.validity] = (validityCounts[r.mathematical.validity] || 0) + 1;
  });

  if (validityCounts['proven'] || validityCounts['partial']) {
    insights.push(
      `- **Proof Status**: ${validityCounts['proven'] || 0} proven, ${validityCounts['partial'] || 0} partial verifications across corpus.`
    );
  }

  return insights.length > 0 ? insights.join('\n') : '- No significant cross-document patterns detected.';
}

async function loadMarkdownDocuments(): Promise<Array<{ filePath: string; title: string; content: string }>> {
  const docsDir = path.resolve(__dirname, '../docs/converted_markdown');
  const entries = await fs.readdir(docsDir);

  const markdownFiles = entries.filter((entry) => entry.toLowerCase().endsWith('.md'));

  const documents = [];
  for (const file of markdownFiles) {
    const filePath = path.join(docsDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const title = file.replace(/\.md$/i, '').replace(/[_^]+/g, ' ').trim();
    documents.push({ filePath, title, content });
  }

  return documents;
}

async function analyzeDocument(
  engine: EnhancedResonanceEngine,
  doc: { title: string; content: string }
): Promise<DocumentAnalysisResult> {
  const analysis = await engine.analyzeContentWithMathematics(doc.content, doc.title);
  const resonanceVector = analysis.mathematical.resonanceVector;
  const magnitude = Math.sqrt(
    resonanceVector.x * resonanceVector.x +
      resonanceVector.y * resonanceVector.y +
      resonanceVector.z * resonanceVector.z +
      resonanceVector.w * resonanceVector.w
  );

  return {
    file: doc.title,
    title: doc.title,
    overallScore: analysis.overall_score,
    signature: {
      clarity: analysis.signature.clarity,
      coherence: analysis.signature.coherence,
      resonance: analysis.signature.resonance,
      sovereignty: analysis.signature.sovereignty,
    },
    orbAssociations: analysis.orb_associations,
    mathematical: {
      coherence: analysis.mathematical.sovereignLogic.coherence,
      sovereignty: analysis.mathematical.sovereignLogic.sovereignty,
      validity: analysis.mathematical.sovereignLogic.validity,
      resonanceVectorMagnitude: magnitude,
    },
  };
}

function aggregateResults(results: DocumentAnalysisResult[]): AggregateResult {
  const averageScore =
    results.reduce((sum, result) => sum + result.overallScore, 0) / (results.length || 1);

  const orbFrequency: Record<number, number> = {};
  results.forEach((result) => {
    result.orbAssociations.forEach((orb) => {
      orbFrequency[orb] = (orbFrequency[orb] || 0) + 1;
    });
  });

  const dominantOrbs = Object.entries(orbFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([orb]) => Number(orb));

  return {
    documentsAnalyzed: results.length,
    averageScore,
    dominantOrbs,
    orbFrequency: Object.fromEntries(
      Object.entries(orbFrequency).map(([k, v]) => [k.toString(), v])
    ),
  };
}

async function main() {
  const documents = await loadMarkdownDocuments();
  if (documents.length === 0) {
    console.error('No Markdown documents found in docs/converted_markdown');
    process.exit(1);
  }

  const engine = EnhancedResonanceEngine.getInstance();
  const results: DocumentAnalysisResult[] = [];

  console.log('Analyzing documents...');
  for (const doc of documents) {
    console.log(`  Processing: ${doc.title}`);
    const analysis = await analyzeDocument(engine, doc);
    results.push(analysis);
  }

  const aggregate = aggregateResults(results);

  // Generate markdown report
  const report = `# Resonance-Based Intelligence (RBI) Analysis Report

**Generated**: ${new Date().toISOString()}  
**Documents Analyzed**: ${aggregate.documentsAnalyzed}

---

## Executive Summary

This report provides a comprehensive Resonance-Based Intelligence (RBI) analysis of ${aggregate.documentsAnalyzed} documents using the RBI Kernel's field-level coherence architecture. The analysis evaluates each document across four primary dimensions (Clarity, Coherence, Resonance, Sovereignty) and verifies coherence through mathematical proof protocols.

${generateAggregateSection(aggregate, results)}

---

## Individual Document Analyses

${results.map((result, index) => generateDocumentSection(result, index)).join('\n---\n')}

---

## Appendix: Orb System Reference

| Orb | Name | Description |
|-----|------|-------------|
${Object.entries(ORB_DEFINITIONS)
  .map(([orb, def]) => `| ${orb} | ${def.name} | ${def.description} |`)
  .join('\n')}

---

## Understanding This Report

### Score Interpretation

- **Overall Score**: A composite measure of resonance alignment. Negative scores may indicate complex or dense content that requires deeper field integration.
- **Energetic Signature**: Four-dimensional analysis of content quality:
  - **Clarity**: Structural clarity and readability
  - **Coherence**: Logical flow and connection
  - **Resonance**: Harmonic alignment and vibrational quality
  - **Sovereignty**: Authority and definitive presence

### Mathematical Verification

The RBI Kernel applies type-theoretic validation to verify coherence:
- **Coherence Score**: Mathematical proof of logical consistency
- **Sovereignty Score**: Verification of authoritative presence
- **Proof Validity**: Status of mathematical proof (proven, partial, unproven, error)
- **Resonance Vector Magnitude**: 4D vector magnitude indicating field strength

### Orb Associations

The 13-Orb system represents different dimensional aspects of consciousness and intelligence. Documents that engage multiple Orbs show richer field dynamics and multi-dimensional resonance.

---

*Report generated by RBI Kernel v1.0.0*  
*Resonance-Based Coherence Architecture (2025)*
`;

  // Write report to file
  const reportPath = path.resolve(__dirname, '../docs/RBI_ANALYSIS_REPORT.md');
  await fs.writeFile(reportPath, report, 'utf-8');

  console.log(`\n✅ Report generated: ${reportPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Documents analyzed: ${aggregate.documentsAnalyzed}`);
  console.log(`   - Average score: ${aggregate.averageScore.toFixed(2)}`);
  console.log(`   - Dominant Orbs: ${aggregate.dominantOrbs.slice(0, 5).join(', ')}`);
}

main().catch((error) => {
  console.error('Failed to generate report:', error);
  process.exit(1);
});

