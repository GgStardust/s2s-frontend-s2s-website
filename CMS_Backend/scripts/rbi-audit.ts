/**
 * RBI Kernel Audit Script
 * 
 * Finds all usage of RBI kernel functions and generates coverage map.
 * 
 * Step 7 of Backend Stabilization Plan
 */

import fs from 'fs';
import path from 'path';
import { glob as globSync } from 'glob';

interface UsageLocation {
  file: string;
  line: number;
  function: string;
  context: string;
}

interface CoverageMap {
  totalFiles: number;
  filesWithRBI: number;
  usageLocations: UsageLocation[];
  functionsUsed: Record<string, number>;
  recommendations: string[];
}

/**
 * Find all TypeScript/JavaScript files
 */
async function findSourceFiles(): Promise<string[]> {
  const patterns = [
    'app/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'scripts/**/*.{ts,tsx}',
  ];

  const files: string[] = [];
  for (const pattern of patterns) {
    const matches = await globSync(pattern, {
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.next/**', 'dist/**'],
    });
    files.push(...matches);
  }

  return files;
}

/**
 * Search for RBI kernel usage in a file
 */
function findRBIUsage(filePath: string): UsageLocation[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const usages: UsageLocation[] = [];

  const patterns = [
    {
      regex: /runResonanceValidation\s*\(/g,
      function: 'runResonanceValidation',
    },
    {
      regex: /validateResonance\s*\(/g,
      function: 'validateResonance',
    },
    {
      regex: /checkCoherence\s*\(/g,
      function: 'checkCoherence',
    },
    {
      regex: /computeResonance\s*\(/g,
      function: 'computeResonance',
    },
    {
      regex: /scoreVectors\s*\(/g,
      function: 'scoreVectors',
    },
    {
      regex: /calculateTextSimilarity\s*\(/g,
      function: 'calculateTextSimilarity',
    },
    {
      regex: /findNeighbors\s*\(/g,
      function: 'findNeighbors',
    },
    {
      regex: /from\s+['"]@\/lib\/rbi\//g,
      function: 'RBI import',
    },
    {
      regex: /from\s+['"].*resonance-api['"]/g,
      function: 'resonance-api import',
    },
    {
      regex: /from\s+['"].*resonance-engine['"]/g,
      function: 'resonance-engine import',
    },
    {
      regex: /from\s+['"].*enhanced-resonance-engine['"]/g,
      function: 'enhanced-resonance-engine import',
    },
  ];

  lines.forEach((line, index) => {
    patterns.forEach(({ regex, function: funcName }) => {
      const matches = [...line.matchAll(regex)];
      matches.forEach(() => {
        usages.push({
          file: filePath,
          line: index + 1,
          function: funcName,
          context: line.trim().substring(0, 100),
        });
      });
    });
  });

  return usages;
}

/**
 * Generate recommendations based on coverage
 */
function generateRecommendations(coverage: CoverageMap): string[] {
  const recommendations: string[] = [];

  // Check if AI routes use RBI
  const aiRoutes = coverage.usageLocations.filter(
    (u) => u.file.includes('/api/ai/') && u.function === 'checkCoherence'
  );
  if (aiRoutes.length < 3) {
    recommendations.push(
      'Consider adding coherence checks to more AI routes (currently only ' +
        aiRoutes.length +
        ' routes protected)'
    );
  }

  // Check if content import uses RBI
  const importRoutes = coverage.usageLocations.filter(
    (u) => u.file.includes('/api/content/import')
  );
  if (importRoutes.length === 0) {
    recommendations.push(
      'Content import route should run resonance validation (already implemented in Step 4)'
    );
  }

  // Check if book compiler uses RBI
  const bookCompilerRoutes = coverage.usageLocations.filter(
    (u) => u.file.includes('/api/ai/merge-chapter') || u.file.includes('/api/ai/resonance-source-selection')
  );
  if (bookCompilerRoutes.length < 2) {
    recommendations.push(
      'Book compiler routes should validate coherence of merged content'
    );
  }

  // Check for routes that process content but don't use RBI
  const contentProcessingRoutes = [
    '/api/ai/conversation',
    '/api/ai/style-training',
  ];
  contentProcessingRoutes.forEach((route) => {
    const hasRBI = coverage.usageLocations.some((u) => u.file.includes(route));
    if (!hasRBI) {
      recommendations.push(
        `Consider adding RBI validation to ${route} route`
      );
    }
  });

  return recommendations;
}

/**
 * Main audit function
 */
async function auditRBI() {
  console.log('🔍 Running RBI Kernel Audit...\n');

  const sourceFiles = await findSourceFiles();
  console.log(`📂 Found ${sourceFiles.length} source files\n`);

  const allUsages: UsageLocation[] = [];
  const functionsUsed: Record<string, number> = {};

  // Scan all files
  for (const file of sourceFiles) {
    const usages = findRBIUsage(file);
    allUsages.push(...usages);

    usages.forEach((usage) => {
      functionsUsed[usage.function] = (functionsUsed[usage.function] || 0) + 1;
    });
  }

  // Find unique files with RBI usage
  const filesWithRBI = new Set(allUsages.map((u) => u.file));

  const coverage: CoverageMap = {
    totalFiles: sourceFiles.length,
    filesWithRBI: filesWithRBI.size,
    usageLocations: allUsages,
    functionsUsed,
    recommendations: [],
  };

  coverage.recommendations = generateRecommendations(coverage);

  // Print results
  console.log('='.repeat(60));
  console.log('📊 RBI Kernel Coverage Map');
  console.log('='.repeat(60));
  console.log(`Total files scanned: ${coverage.totalFiles}`);
  console.log(`Files using RBI: ${coverage.filesWithRBI}`);
  console.log(`Total RBI usages: ${allUsages.length}\n`);

  console.log('Functions Used:');
  Object.entries(functionsUsed)
    .sort(([, a], [, b]) => b - a)
    .forEach(([func, count]) => {
    console.log(`  ${func}: ${count} usage(s)`);
  });

  console.log('\nUsage Locations:');
  allUsages.forEach((usage) => {
    console.log(`  ${usage.file}:${usage.line} - ${usage.function}`);
    console.log(`    ${usage.context}`);
  });

  if (coverage.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    coverage.recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }

  console.log('\n' + '='.repeat(60));

  // Write coverage map to file
  const reportPath = path.join(process.cwd(), 'reports', 'rbi-coverage-map.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(coverage, null, 2));
  console.log(`\n📄 Coverage map saved to: ${reportPath}`);

  return coverage;
}

// Run if called directly
if (require.main === module) {
  auditRBI().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { auditRBI };

