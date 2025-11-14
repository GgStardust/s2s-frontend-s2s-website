/**
 * Codebase Metadata Interface and Parser
 * 
 * Extracts structural metadata from codebases for RBI analysis.
 * Enables RBI to analyze code architecture, dependencies, and patterns.
 */

import type { ContentMetadata } from '../field/computation/enhanced-engine.js';

export interface CodebaseMetadata extends ContentMetadata {
  codebase_structure?: {
    file_count: number;
    directory_structure: string[];
    entry_points: string[];
    main_files: string[];
  };
  dependencies?: {
    external: string[];
    internal: string[];
    frameworks: string[];
    languages: string[];
  };
  patterns?: {
    architectural_patterns: string[];
    design_patterns: string[];
    code_organization: string[];
  };
  metrics?: {
    lines_of_code: number;
    complexity_score?: number;
    test_coverage?: number;
    documentation_coverage?: number;
  };
  relationships?: {
    imports: Array<{ from: string; to: string; type: string }>;
    exports: Array<{ from: string; to: string; type: string }>;
    dependencies: Array<{ source: string; target: string; type: string }>;
  };
}

/**
 * Parse codebase structure from file tree
 */
export function parseCodebaseStructure(
  fileTree: Array<{ path: string; type: 'file' | 'directory'; size?: number }>
): CodebaseMetadata['codebase_structure'] {
  const files = fileTree.filter(f => f.type === 'file');
  const directories = fileTree.filter(f => f.type === 'directory');
  
  const directoryStructure = directories.map(d => d.path);
  const mainFiles = files
    .filter(f => {
      const name = f.path.split('/').pop() || '';
      return ['index', 'main', 'app', 'server'].some(prefix => 
        name.toLowerCase().startsWith(prefix)
      );
    })
    .map(f => f.path);
  
  const entryPoints = files
    .filter(f => {
      const ext = f.path.split('.').pop()?.toLowerCase();
      return ['html', 'js', 'ts', 'jsx', 'tsx', 'py', 'go', 'rs'].includes(ext || '');
    })
    .slice(0, 10)
    .map(f => f.path);

  return {
    file_count: files.length,
    directory_structure: directoryStructure,
    entry_points: entryPoints,
    main_files: mainFiles,
  };
}

/**
 * Parse dependencies from package.json, requirements.txt, etc.
 */
export function parseDependencies(
  packageFiles: Array<{ type: 'npm' | 'python' | 'go' | 'rust' | 'other'; content: string }>
): CodebaseMetadata['dependencies'] {
  const external: string[] = [];
  const internal: string[] = [];
  const frameworks: string[] = [];
  const languages: string[] = [];

  for (const file of packageFiles) {
    try {
      if (file.type === 'npm') {
        const pkg = JSON.parse(file.content);
        const deps = {
          ...pkg.dependencies,
          ...pkg.devDependencies,
          ...pkg.peerDependencies,
        };
        
        Object.keys(deps).forEach(dep => {
          external.push(dep);
          
          // Detect frameworks
          if (['react', 'vue', 'angular', 'next', 'nuxt'].includes(dep)) {
            frameworks.push(dep);
          }
        });
        
        languages.push('javascript', 'typescript');
      } else if (file.type === 'python') {
        const lines = file.content.split('\n');
        lines.forEach(line => {
          const match = line.match(/^([a-zA-Z0-9_-]+)/);
          if (match) {
            external.push(match[1]);
          }
        });
        languages.push('python');
      } else if (file.type === 'go') {
        const lines = file.content.split('\n');
        lines.forEach(line => {
          const match = line.match(/^\s+"([^"]+)"/);
          if (match) {
            external.push(match[1]);
          }
        });
        languages.push('go');
      } else if (file.type === 'rust') {
        const lines = file.content.split('\n');
        lines.forEach(line => {
          const match = line.match(/^([a-zA-Z0-9_-]+)\s*=/);
          if (match) {
            external.push(match[1]);
          }
        });
        languages.push('rust');
      }
    } catch (error) {
      console.warn(`Failed to parse ${file.type} dependencies:`, error);
    }
  }

  return {
    external: [...new Set(external)],
    internal: [...new Set(internal)],
    frameworks: [...new Set(frameworks)],
    languages: [...new Set(languages)],
  };
}

/**
 * Detect architectural and design patterns from codebase
 */
export function detectPatterns(
  codeFiles: Array<{ path: string; content: string; language: string }>
): CodebaseMetadata['patterns'] {
  const architecturalPatterns: string[] = [];
  const designPatterns: string[] = [];
  const codeOrganization: string[] = [];

  // Detect architectural patterns
  const hasMVC = codeFiles.some(f => 
    f.path.includes('model') || f.path.includes('view') || f.path.includes('controller')
  );
  if (hasMVC) architecturalPatterns.push('MVC');

  const hasLayered = codeFiles.some(f => 
    f.path.includes('layer') || f.path.includes('service') || f.path.includes('repository')
  );
  if (hasLayered) architecturalPatterns.push('Layered Architecture');

  const hasMicroservices = codeFiles.some(f => 
    f.path.includes('service') && f.path.includes('api')
  );
  if (hasMicroservices) architecturalPatterns.push('Microservices');

  // Detect design patterns from code
  codeFiles.forEach(file => {
    const content = file.content.toLowerCase();
    
    if (content.includes('class') && content.includes('extends')) {
      designPatterns.push('Inheritance');
    }
    if (content.includes('interface') || content.includes('protocol')) {
      designPatterns.push('Interface Segregation');
    }
    if (content.includes('factory') && content.includes('create')) {
      designPatterns.push('Factory Pattern');
    }
    if (content.includes('singleton')) {
      designPatterns.push('Singleton Pattern');
    }
    if (content.includes('observer') || content.includes('subscribe')) {
      designPatterns.push('Observer Pattern');
    }
  });

  // Detect code organization
  const hasTests = codeFiles.some(f => 
    f.path.includes('test') || f.path.includes('spec')
  );
  if (hasTests) codeOrganization.push('Test-Driven Development');

  const hasDocs = codeFiles.some(f => 
    f.path.includes('doc') || f.path.includes('readme')
  );
  if (hasDocs) codeOrganization.push('Documentation');

  const hasConfig = codeFiles.some(f => 
    f.path.includes('config') || f.path.includes('settings')
  );
  if (hasConfig) codeOrganization.push('Configuration Management');

  return {
    architectural_patterns: [...new Set(architecturalPatterns)],
    design_patterns: [...new Set(designPatterns)],
    code_organization: [...new Set(codeOrganization)],
  };
}

/**
 * Calculate codebase metrics
 */
export function calculateMetrics(
  codeFiles: Array<{ path: string; content: string; language: string }>
): CodebaseMetadata['metrics'] {
  const totalLines = codeFiles.reduce((sum, file) => {
    return sum + file.content.split('\n').length;
  }, 0);

  const testFiles = codeFiles.filter(f => 
    f.path.includes('test') || f.path.includes('spec')
  );
  const testLines = testFiles.reduce((sum, file) => {
    return sum + file.content.split('\n').length;
  }, 0);
  const testCoverage = totalLines > 0 ? testLines / totalLines : 0;

  const docFiles = codeFiles.filter(f => 
    f.path.includes('doc') || f.path.includes('readme') || f.path.includes('md')
  );
  const docLines = docFiles.reduce((sum, file) => {
    return sum + file.content.split('\n').length;
  }, 0);
  const documentationCoverage = totalLines > 0 ? docLines / totalLines : 0;

  // Simple complexity score (cyclomatic complexity approximation)
  const complexityScore = codeFiles.reduce((sum, file) => {
    const content = file.content;
    const functions = (content.match(/(function|def|fn|const\s+\w+\s*=\s*\(|class\s+\w+)/g) || []).length;
    const conditionals = (content.match(/(if|else|switch|case|try|catch)/g) || []).length;
    return sum + functions + conditionals * 0.5;
  }, 0) / codeFiles.length;

  return {
    lines_of_code: totalLines,
    complexity_score: complexityScore,
    test_coverage: testCoverage,
    documentation_coverage: documentationCoverage,
  };
}

/**
 * Parse import/export relationships from code
 */
export function parseRelationships(
  codeFiles: Array<{ path: string; content: string; language: string }>
): CodebaseMetadata['relationships'] {
  const imports: Array<{ from: string; to: string; type: string }> = [];
  const exports: Array<{ from: string; to: string; type: string }> = [];
  const dependencies: Array<{ source: string; target: string; type: string }> = [];

  codeFiles.forEach(file => {
    const content = file.content;
    const filePath = file.path;
    const language = file.language;

    // Parse imports
    if (language === 'javascript' || language === 'typescript') {
      // ES6 imports: import X from 'Y'
      const importMatches = content.matchAll(/import\s+(?:.*?\s+from\s+)?['"]([^'"]+)['"]/g);
      for (const match of importMatches) {
        imports.push({
          from: filePath,
          to: match[1],
          type: 'import',
        });
      }

      // Exports: export { X } or export default X
      const exportMatches = content.matchAll(/export\s+(?:default\s+)?(\w+)/g);
      for (const match of exportMatches) {
        exports.push({
          from: filePath,
          to: match[1],
          type: 'export',
        });
      }
    } else if (language === 'python') {
      // Python imports: import X or from Y import Z
      const importMatches = content.matchAll(/(?:from\s+([^\s]+)\s+)?import\s+([^\s,]+)/g);
      for (const match of importMatches) {
        imports.push({
          from: filePath,
          to: match[1] || match[2],
          type: 'import',
        });
      }
    }
  });

  return {
    imports,
    exports,
    dependencies,
  };
}

/**
 * Convert codebase metadata to ContentMetadata for RBI analysis
 */
export function codebaseToContentMetadata(
  codebase: CodebaseMetadata
): ContentMetadata {
  return {
    orb_associations: codebase.orb_associations,
    field_function: codebase.field_function,
    book_threading: codebase.book_threading,
    integration_points: codebase.integration_points,
    tags: [
      ...(codebase.tags || []),
      ...(codebase.dependencies?.frameworks || []).map(f => `framework:${f}`),
      ...(codebase.dependencies?.languages || []).map(l => `language:${l}`),
      ...(codebase.patterns?.architectural_patterns || []).map(p => `arch:${p}`),
      ...(codebase.patterns?.design_patterns || []).map(p => `pattern:${p}`),
    ],
    category: 'codebase',
    dashboard_component: 'codebase_analysis',
  };
}

