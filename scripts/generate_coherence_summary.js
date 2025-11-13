#!/usr/bin/env node
/**
 * Generate Coherence Summary
 * 
 * Analyzes all package.json dependencies and RBI-Kernel import consistency
 * Based on PROMPT_5_CROSS_SYSTEM_COHERENCE.md
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const PROJECTS = [
  'RBI-Kernel',
  'RBI-Architecture-Service',
  'CMS_Backend',
  'S2S_Console',
  'RBI_Website',
  'RBI_Editorial_Tools',
];

function checkPackageJson(projectPath) {
  const packageJsonPath = path.join(WORKSPACE_ROOT, projectPath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return { exists: false };
  }
  
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const rbiDependency = pkg.dependencies?.['rbi-kernel'] || pkg.devDependencies?.['rbi-kernel'];
  
  return {
    exists: true,
    name: pkg.name,
    version: pkg.version,
    rbiDependency,
    correct: rbiDependency === 'file:../RBI-Kernel',
  };
}

function checkImports(projectPath) {
  const srcPath = path.join(WORKSPACE_ROOT, projectPath);
  const imports = [];
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.includes('node_modules') && !entry.name.includes('dist')) {
        scanDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const rbiImports = content.match(/from\s+['"]rbi-kernel['"]/g) || [];
        const localImports = content.match(/from\s+['"].*resonance-engine['"]/g) || [];
        
        if (rbiImports.length > 0 || localImports.length > 0) {
          imports.push({
            file: path.relative(WORKSPACE_ROOT, fullPath),
            rbiImports: rbiImports.length,
            localImports: localImports.length,
          });
        }
      }
    }
  }
  
  scanDir(srcPath);
  return imports;
}

function main() {
  console.log('🌀 Generating Coherence Summary');
  console.log('='.repeat(70));
  
  const summary = {
    timestamp: new Date().toISOString(),
    projects: {},
    coherence: {
      dependencyConsistency: true,
      importConsistency: true,
      issues: [],
    },
  };
  
  // Check each project
  for (const project of PROJECTS) {
    console.log(`\n📦 Checking ${project}...`);
    
    const pkgInfo = checkPackageJson(project);
    const imports = checkImports(project);
    
    summary.projects[project] = {
      package: pkgInfo,
      imports: imports.length,
      importDetails: imports,
    };
    
    if (!pkgInfo.exists) {
      console.log(`   ⚠️  No package.json found`);
      summary.coherence.issues.push(`${project}: Missing package.json`);
    } else if (!pkgInfo.correct && pkgInfo.rbiDependency) {
      console.log(`   ⚠️  Incorrect RBI dependency: ${pkgInfo.rbiDependency}`);
      summary.coherence.dependencyConsistency = false;
      summary.coherence.issues.push(`${project}: Incorrect RBI dependency path`);
    } else if (pkgInfo.rbiDependency) {
      console.log(`   ✅ Correct RBI dependency: ${pkgInfo.rbiDependency}`);
    }
    
    const localImports = imports.filter(i => i.localImports > 0);
    if (localImports.length > 0) {
      console.log(`   ⚠️  Found ${localImports.length} files with local resonance-engine imports`);
      summary.coherence.importConsistency = false;
      summary.coherence.issues.push(`${project}: ${localImports.length} files using local resonance-engine`);
    } else if (imports.length > 0) {
      console.log(`   ✅ ${imports.length} files using RBI-Kernel correctly`);
    }
  }
  
  // Calculate coherence score
  const totalProjects = PROJECTS.length;
  const correctProjects = PROJECTS.filter(p => {
    const info = summary.projects[p];
    return info.package.exists && 
           (!info.package.rbiDependency || info.package.correct) &&
           info.importDetails.every(i => i.localImports === 0);
  }).length;
  
  summary.coherence.score = (correctProjects / totalProjects) * 100;
  summary.coherence.status = summary.coherence.score >= 95 ? 'excellent' :
                             summary.coherence.score >= 80 ? 'good' :
                             summary.coherence.score >= 60 ? 'fair' : 'needs_work';
  
  // Write report
  const reportPath = path.join(WORKSPACE_ROOT, 'COHERENCE_SUMMARY.json');
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  
  // Write markdown report
  const mdReport = `# System Coherence Summary

**Generated:** ${new Date().toISOString()}
**Coherence Score:** ${summary.coherence.score.toFixed(1)}% (${summary.coherence.status})

## Dependency Consistency

${summary.coherence.dependencyConsistency ? '✅ All projects use correct RBI-Kernel dependency path' : '⚠️ Some projects have incorrect dependency paths'}

## Import Consistency

${summary.coherence.importConsistency ? '✅ All imports use RBI-Kernel' : '⚠️ Some files still use local resonance-engine'}

## Issues

${summary.coherence.issues.length > 0 ? summary.coherence.issues.map(i => `- ${i}`).join('\n') : 'None'}

## Project Details

${PROJECTS.map(p => {
  const info = summary.projects[p];
  return `### ${p}
- Package: ${info.package.exists ? info.package.name : 'Not found'}
- RBI Dependency: ${info.package.rbiDependency || 'None'}
- RBI Imports: ${info.imports} files
${info.importDetails.length > 0 ? `- Import Details:\n${info.importDetails.map(i => `  - ${i.file}: ${i.rbiImports} RBI, ${i.localImports} local`).join('\n')}` : ''}
`;
}).join('\n')}
`;
  
  const mdPath = path.join(WORKSPACE_ROOT, 'COHERENCE_SUMMARY.md');
  fs.writeFileSync(mdPath, mdReport);
  
  console.log('\n✅ Coherence summary generated!');
  console.log(`   JSON: ${path.relative(WORKSPACE_ROOT, reportPath)}`);
  console.log(`   Markdown: ${path.relative(WORKSPACE_ROOT, mdPath)}`);
  console.log(`\n📊 Coherence Score: ${summary.coherence.score.toFixed(1)}% (${summary.coherence.status})`);
}

main();

