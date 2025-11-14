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

const ORB_DEFINITIONS: Record<number, { name: string; description: string; color: string }> = {
  1: { name: 'Origin Intelligence', description: 'Foundation, source, beginning', color: '#8B4513' },
  2: { name: 'Resonance Mechanics', description: 'Vibration, frequency, harmony', color: '#FF6B6B' },
  3: { name: 'Photonic Intelligence', description: 'Light, illumination, clarity', color: '#FFD93D' },
  4: { name: 'Harmonic Architectures', description: 'Structure, design, pattern', color: '#6BCF7F' },
  5: { name: 'Temporal Sovereignty', description: 'Time, authority, temporal power', color: '#4ECDC4' },
  6: { name: 'Starline Memory', description: 'Ancestral, lineage, memory', color: '#95E1D3' },
  7: { name: 'Alchemical Current', description: 'Transformation, flow, change', color: '#F38181' },
  8: { name: 'Quantum Intuition', description: 'Knowing, insight, quantum awareness', color: '#AA96DA' },
  9: { name: 'Temporal Fluidity', description: 'Adaptation, flexibility, change', color: '#FCBAD3' },
  10: { name: 'Ancestral Repatterning', description: 'Healing, transformation, repatterning', color: '#A8D8EA' },
  11: { name: 'Radiant Transparency', description: 'Clarity, truth, transparency', color: '#FFEAA7' },
  12: { name: 'Sovereign Field', description: 'Power, authority, sovereign field', color: '#DDA15E' },
  13: { name: 'Bridging Intelligence', description: 'Connection, integration, unity', color: '#BC6C25' },
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getScoreColor(score: number): string {
  if (score >= 0.8) return '#10b981'; // green
  if (score >= 0.6) return '#f59e0b'; // yellow
  if (score >= 0.4) return '#f97316'; // orange
  if (score >= 0.2) return '#ef4444'; // red
  return '#6b7280'; // gray
}

function getScoreLabel(score: number): string {
  if (score >= 0.8) return 'Excellent';
  if (score >= 0.6) return 'Good';
  if (score >= 0.4) return 'Moderate';
  if (score >= 0.2) return 'Low';
  return 'Very Low';
}

function createProgressBarHTML(value: number, max: number = 1): string {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  const color = getScoreColor(value);
  return `
    <div class="progress-container">
      <div class="progress-bar" style="width: ${percentage}%; background-color: ${color};"></div>
      <span class="progress-text">${percentage.toFixed(1)}%</span>
    </div>`;
}

function generateHTMLReport(
  results: DocumentAnalysisResult[],
  aggregate: AggregateResult
): string {
  const avgSignature = {
    clarity: results.reduce((sum, r) => sum + r.signature.clarity, 0) / results.length,
    coherence: results.reduce((sum, r) => sum + r.signature.coherence, 0) / results.length,
    resonance: results.reduce((sum, r) => sum + r.signature.resonance, 0) / results.length,
    sovereignty: results.reduce((sum, r) => sum + r.signature.sovereignty, 0) / results.length,
  };

  const documentSections = results
    .map((result, index) => {
      const orbNames = result.orbAssociations
        .map((orb) => {
          const def = ORB_DEFINITIONS[orb];
          return `<span class="orb-badge" style="background-color: ${def?.color || '#ccc'}">Orb ${orb}: ${def?.name || 'Unknown'}</span>`;
        })
        .join(' ');

      return `
      <div class="document-section">
        <h2>${index + 1}. ${escapeHtml(result.title)}</h2>
        
        <div class="score-card">
          <h3>Overall Score</h3>
          <div class="score-value" style="color: ${getScoreColor(Math.max(0, (result.overallScore + 100) / 200))}">
            ${result.overallScore.toFixed(2)}
          </div>
        </div>

        <div class="signature-grid">
          <div class="signature-item">
            <h4>Clarity</h4>
            ${createProgressBarHTML(result.signature.clarity)}
            <span class="score-label">${getScoreLabel(result.signature.clarity)}</span>
          </div>
          <div class="signature-item">
            <h4>Coherence</h4>
            ${createProgressBarHTML(result.signature.coherence)}
            <span class="score-label">${getScoreLabel(result.signature.coherence)}</span>
          </div>
          <div class="signature-item">
            <h4>Resonance</h4>
            ${createProgressBarHTML(result.signature.resonance)}
            <span class="score-label">${getScoreLabel(result.signature.resonance)}</span>
          </div>
          <div class="signature-item">
            <h4>Sovereignty</h4>
            ${createProgressBarHTML(result.signature.sovereignty)}
            <span class="score-label">${getScoreLabel(result.signature.sovereignty)}</span>
          </div>
        </div>

        <div class="mathematical-section">
          <h3>Mathematical Verification</h3>
          <div class="math-grid">
            <div class="math-item">
              <strong>Coherence:</strong> ${(result.mathematical.coherence * 100).toFixed(1)}%
              ${createProgressBarHTML(result.mathematical.coherence)}
            </div>
            <div class="math-item">
              <strong>Sovereignty:</strong> ${(result.mathematical.sovereignty * 100).toFixed(1)}%
              ${createProgressBarHTML(result.mathematical.sovereignty)}
            </div>
            <div class="math-item">
              <strong>Validity:</strong> <span class="validity-${result.mathematical.validity}">${result.mathematical.validity}</span>
            </div>
            <div class="math-item">
              <strong>Vector Magnitude:</strong> ${result.mathematical.resonanceVectorMagnitude.toFixed(3)}
            </div>
          </div>
        </div>

        <div class="orb-section">
          <h3>Orb Associations (${result.orbAssociations.length})</h3>
          <div class="orb-container">${orbNames}</div>
        </div>
      </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RBI Analysis Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 40px;
    }
    
    h1 {
      color: #667eea;
      margin-bottom: 10px;
      font-size: 2.5em;
    }
    
    .header {
      border-bottom: 3px solid #667eea;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .meta {
      color: #666;
      font-size: 0.9em;
    }
    
    .aggregate-section {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 40px;
    }
    
    .aggregate-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .aggregate-item {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .aggregate-item h4 {
      color: #667eea;
      margin-bottom: 10px;
    }
    
    .document-section {
      margin-bottom: 50px;
      padding: 30px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    
    .score-card {
      text-align: center;
      padding: 30px;
      background: white;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .score-value {
      font-size: 3em;
      font-weight: bold;
      margin-top: 10px;
    }
    
    .signature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    
    .signature-item {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .signature-item h4 {
      color: #667eea;
      margin-bottom: 15px;
    }
    
    .progress-container {
      position: relative;
      width: 100%;
      height: 30px;
      background: #e5e7eb;
      border-radius: 15px;
      overflow: hidden;
      margin: 10px 0;
    }
    
    .progress-bar {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 15px;
    }
    
    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      font-size: 0.9em;
    }
    
    .score-label {
      display: block;
      text-align: center;
      margin-top: 5px;
      font-size: 0.9em;
      color: #666;
    }
    
    .mathematical-section {
      margin: 30px 0;
      padding: 20px;
      background: white;
      border-radius: 8px;
    }
    
    .math-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .math-item {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
    }
    
    .validity-proven {
      color: #10b981;
      font-weight: bold;
    }
    
    .validity-partial {
      color: #f59e0b;
      font-weight: bold;
    }
    
    .validity-unproven {
      color: #ef4444;
      font-weight: bold;
    }
    
    .validity-error {
      color: #6b7280;
      font-weight: bold;
    }
    
    .orb-section {
      margin-top: 30px;
    }
    
    .orb-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 15px;
    }
    
    .orb-badge {
      padding: 8px 16px;
      border-radius: 20px;
      color: white;
      font-size: 0.85em;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    h2 {
      color: #667eea;
      margin-bottom: 20px;
      font-size: 1.8em;
    }
    
    h3 {
      color: #764ba2;
      margin: 20px 0 15px 0;
      font-size: 1.3em;
    }
    
    h4 {
      font-size: 1.1em;
    }
    
    @media print {
      body {
        background: white;
      }
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Resonance-Based Intelligence (RBI) Analysis Report</h1>
      <div class="meta">
        <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
        <p><strong>Documents Analyzed:</strong> ${aggregate.documentsAnalyzed}</p>
      </div>
    </div>

    <div class="aggregate-section">
      <h2>Corpus Overview</h2>
      <div class="aggregate-grid">
        <div class="aggregate-item">
          <h4>Average Overall Score</h4>
          <div class="score-value" style="color: ${getScoreColor(Math.max(0, (aggregate.averageScore + 100) / 200))}">
            ${aggregate.averageScore.toFixed(2)}
          </div>
        </div>
        <div class="aggregate-item">
          <h4>Average Clarity</h4>
          ${createProgressBarHTML(avgSignature.clarity)}
        </div>
        <div class="aggregate-item">
          <h4>Average Coherence</h4>
          ${createProgressBarHTML(avgSignature.coherence)}
        </div>
        <div class="aggregate-item">
          <h4>Average Resonance</h4>
          ${createProgressBarHTML(avgSignature.resonance)}
        </div>
        <div class="aggregate-item">
          <h4>Average Sovereignty</h4>
          ${createProgressBarHTML(avgSignature.sovereignty)}
        </div>
      </div>
      
      <div style="margin-top: 30px;">
        <h3>Dominant Orb Patterns</h3>
        <div class="orb-container">
          ${aggregate.dominantOrbs
            .slice(0, 5)
            .map((orb) => {
              const def = ORB_DEFINITIONS[orb];
              const count = aggregate.orbFrequency[orb.toString()];
              return `<span class="orb-badge" style="background-color: ${def?.color || '#ccc'}">Orb ${orb}: ${def?.name} (${count}/${aggregate.documentsAnalyzed})</span>`;
            })
            .join('')}
        </div>
      </div>
    </div>

    ${documentSections}

    <div style="margin-top: 50px; padding: 30px; background: #f8f9fa; border-radius: 8px;">
      <h2>Orb System Reference</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-top: 20px;">
        ${Object.entries(ORB_DEFINITIONS)
          .map(
            ([orb, def]) => `
          <div style="padding: 15px; background: white; border-radius: 6px; border-left: 4px solid ${def.color};">
            <strong>Orb ${orb}: ${def.name}</strong><br>
            <span style="color: #666; font-size: 0.9em;">${def.description}</span>
          </div>`
          )
          .join('')}
      </div>
    </div>

    <div style="margin-top: 40px; padding: 20px; text-align: center; color: #666; font-size: 0.9em; border-top: 2px solid #e5e7eb;">
      <p>Report generated by RBI Kernel v1.0.0</p>
      <p>Resonance-Based Coherence Architecture (2025)</p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
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

  const htmlReport = generateHTMLReport(results, aggregate);

  const reportPath = path.resolve(__dirname, '../docs/RBI_ANALYSIS_REPORT.html');
  await fs.writeFile(reportPath, htmlReport, 'utf-8');

  console.log(`\n✅ HTML Report generated: ${reportPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Documents analyzed: ${aggregate.documentsAnalyzed}`);
  console.log(`   - Average score: ${aggregate.averageScore.toFixed(2)}`);
  console.log(`   - Dominant Orbs: ${aggregate.dominantOrbs.slice(0, 5).join(', ')}`);
  console.log(`\n💡 Open the HTML file in your browser for a visual report!`);
}

main().catch((error) => {
  console.error('Failed to generate HTML report:', error);
  process.exit(1);
});

