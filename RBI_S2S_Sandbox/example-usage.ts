/**
 * Example Usage of RBI Sandbox Metadata Parsers
 * 
 * Demonstrates how to use the new metadata parsers for codebase and data file analysis
 */

import {
  parseCodebaseStructure,
  parseDependencies,
  detectPatterns,
  calculateMetrics,
  parseRelationships,
  codebaseToContentMetadata,
  parseCSVTSV,
  csvTSVToContentMetadata,
  parseXML,
  xmlToContentMetadata,
  parseJSON,
  jsonToContentMetadata,
} from 'rbi-kernel/metadata';
import { EnhancedResonanceEngine } from 'rbi-kernel';

/**
 * Example: Analyze a codebase
 */
export async function analyzeCodebaseExample() {
  // Simulated file tree
  const fileTree = [
    { path: 'src/index.ts', type: 'file' as const, size: 1024 },
    { path: 'src/components', type: 'directory' as const },
    { path: 'src/components/Button.tsx', type: 'file' as const, size: 512 },
    { path: 'package.json', type: 'file' as const, size: 256 },
  ];

  // Parse structure
  const structure = parseCodebaseStructure(fileTree);

  // Simulated package.json
  const packageFiles = [{
    type: 'npm' as const,
    content: JSON.stringify({
      dependencies: { react: '^18.0.0', 'next': '^14.0.0' },
      devDependencies: { typescript: '^5.0.0' },
    }),
  }];

  // Parse dependencies
  const dependencies = parseDependencies(packageFiles);

  // Simulated code files
  const codeFiles = [
    { path: 'src/index.ts', content: 'export function main() {}', language: 'typescript' },
    { path: 'src/components/Button.tsx', content: 'class Button extends Component {}', language: 'typescript' },
  ];

  // Detect patterns
  const patterns = detectPatterns(codeFiles);

  // Calculate metrics
  const metrics = calculateMetrics(codeFiles);

  // Parse relationships
  const relationships = parseRelationships(codeFiles);

  // Build codebase metadata
  const codebaseMetadata = {
    codebase_structure: structure,
    dependencies,
    patterns,
    metrics,
    relationships,
    orb_associations: [1, 7], // Example: Origin Intelligence + Alchemical Current
    field_function: {
      content_purpose: 'codebase_analysis',
      primary_mechanism: 'structural_analysis',
      console_context: 'codebase_view',
      console_relation: 'architecture_mapping',
    },
  };

  // Convert to ContentMetadata for RBI
  const contentMetadata = codebaseToContentMetadata(codebaseMetadata);

  // Run RBI analysis
  const engine = EnhancedResonanceEngine.getInstance();
  const codebaseSummary = `Codebase with ${structure?.file_count} files, ${dependencies?.frameworks?.length || 0} frameworks`;
  
  const rbiAnalysis = await engine.analyzeContentWithMathematics(
    codebaseSummary,
    'My Codebase',
    contentMetadata
  );

  return {
    codebaseMetadata,
    rbiAnalysis,
    coherence: rbiAnalysis.mathematical.sovereignLogic.coherence,
    proofStatus: rbiAnalysis.mathematical.sovereignLogic.validity,
  };
}

/**
 * Example: Analyze CSV data
 */
export async function analyzeCSVExample() {
  const csvContent = `name,age,city
Alice,30,New York
Bob,25,San Francisco
Charlie,35,Chicago`;

  // Parse CSV
  const csvMetadata = parseCSVTSV(csvContent, { hasHeader: true });

  // Convert to ContentMetadata
  const contentMetadata = csvTSVToContentMetadata(csvMetadata, csvContent);

  // Run RBI analysis
  const engine = EnhancedResonanceEngine.getInstance();
  const rbiAnalysis = await engine.analyzeContentWithMathematics(
    csvContent,
    'User Data CSV',
    contentMetadata
  );

  return {
    csvMetadata,
    rbiAnalysis,
    dataTypes: csvMetadata.data_types,
    sampleData: csvMetadata.sample_data,
  };
}

/**
 * Example: Analyze XML data
 */
export async function analyzeXMLExample() {
  const xmlContent = `<?xml version="1.0"?>
<users>
  <user id="1" name="Alice">
    <email>alice@example.com</email>
  </user>
  <user id="2" name="Bob">
    <email>bob@example.com</email>
  </user>
</users>`;

  // Parse XML
  const xmlMetadata = parseXML(xmlContent);

  // Convert to ContentMetadata
  const contentMetadata = xmlToContentMetadata(xmlMetadata, xmlContent);

  // Run RBI analysis
  const engine = EnhancedResonanceEngine.getInstance();
  const rbiAnalysis = await engine.analyzeContentWithMathematics(
    xmlContent,
    'Users XML',
    contentMetadata
  );

  return {
    xmlMetadata,
    rbiAnalysis,
    structure: xmlMetadata.xml_structure,
    elements: xmlMetadata.elements,
  };
}

/**
 * Example: Analyze JSON data
 */
export async function analyzeJSONExample() {
  const jsonContent = JSON.stringify({
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
    ],
    metadata: {
      version: '1.0',
      created: '2025-01-01',
    },
  });

  // Parse JSON
  const jsonMetadata = parseJSON(jsonContent);

  // Convert to ContentMetadata
  const contentMetadata = jsonToContentMetadata(jsonMetadata, jsonContent);

  // Run RBI analysis
  const engine = EnhancedResonanceEngine.getInstance();
  const rbiAnalysis = await engine.analyzeContentWithMathematics(
    jsonContent,
    'Users JSON',
    contentMetadata
  );

  return {
    jsonMetadata,
    rbiAnalysis,
    schema: jsonMetadata.schema,
    structure: jsonMetadata.json_structure,
  };
}

