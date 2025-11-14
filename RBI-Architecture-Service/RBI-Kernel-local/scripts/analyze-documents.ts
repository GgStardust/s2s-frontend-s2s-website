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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Calculate overall score if null (geometric average)
  const overallScore = analysis.overall_score ?? (
    analysis.signature.clarity * 0.25 +
    analysis.signature.coherence * 0.25 +
    analysis.signature.resonance * 0.25 +
    analysis.signature.sovereignty * 0.25
  );

  return {
    file: doc.title,
    title: doc.title,
    overallScore,
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

function aggregateResults(results: DocumentAnalysisResult[]) {
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
    orbFrequency,
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

  for (const doc of documents) {
    const analysis = await analyzeDocument(engine, doc);
    results.push(analysis);
  }

  const aggregate = aggregateResults(results);

  const output = {
    generatedAt: new Date().toISOString(),
    results,
    aggregate,
  };

  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error('Failed to analyze documents:', error);
  process.exit(1);
});

