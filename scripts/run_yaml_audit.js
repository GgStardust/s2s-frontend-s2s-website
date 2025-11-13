#!/usr/bin/env node
/**
 * YAML × RBI Audit Script
 * 
 * Audits YAML frontmatter consistency and RBI metrics alignment
 * Optional step for verifying content structure
 */

const fs = require('fs');
const path = require('path');

// Try to load js-yaml, but handle gracefully if not available
let yaml;
try {
  yaml = require('js-yaml');
} catch (error) {
  console.warn('⚠️  js-yaml not installed. Using basic YAML parsing.');
  yaml = {
    load: (str) => {
      // Basic YAML parser for simple key-value pairs
      const obj = {};
      str.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
          obj[key] = value;
        }
      });
      return obj;
    }
  };
}

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const CMS_BACKEND = path.join(WORKSPACE_ROOT, 'CMS_Backend');
const PROCESSED_DIR = path.join(CMS_BACKEND, '09_PROCESSED');

function findMarkdownFiles(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !entry.name.includes('node_modules')) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { hasFrontmatter: false, frontmatter: {}, content: content };
  }
  
  try {
    const frontmatter = yaml.load(match[1]);
    return {
      hasFrontmatter: true,
      frontmatter: frontmatter || {},
      content: match[2],
    };
  } catch (error) {
    return {
      hasFrontmatter: true,
      frontmatter: {},
      parseError: error.message,
      content: match[2],
    };
  }
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);
  
  const audit = {
    file: path.relative(WORKSPACE_ROOT, filePath),
    hasFrontmatter: parsed.hasFrontmatter,
    hasRBIMetrics: false,
    hasOrbAssociations: false,
    hasResonanceScore: false,
    hasCoherenceVector: false,
    issues: [],
  };
  
  if (!parsed.hasFrontmatter) {
    audit.issues.push('Missing YAML frontmatter');
    return audit;
  }
  
  if (parsed.parseError) {
    audit.issues.push(`YAML parse error: ${parsed.parseError}`);
    return audit;
  }
  
  const fm = parsed.frontmatter;
  
  // Check for RBI metrics
  if (fm.resonance_score !== undefined || fm.resonance_rating !== undefined) {
    audit.hasResonanceScore = true;
  }
  
  if (fm.coherence_vector || fm.resonance_vector) {
    audit.hasCoherenceVector = true;
  }
  
  if (fm.orb_associations || fm.orbAssociations) {
    audit.hasOrbAssociations = true;
  }
  
  if (audit.hasResonanceScore || audit.hasCoherenceVector || audit.hasOrbAssociations) {
    audit.hasRBIMetrics = true;
  }
  
  // Check for required fields
  if (!fm.title) {
    audit.issues.push('Missing title field');
  }
  
  if (!fm.status) {
    audit.issues.push('Missing status field');
  }
  
  return audit;
}

function main() {
  console.log('📋 YAML × RBI Audit');
  console.log('='.repeat(70));
  
  const files = findMarkdownFiles(PROCESSED_DIR);
  console.log(`\n📁 Found ${files.length} markdown files in 09_PROCESSED/`);
  
  if (files.length === 0) {
    console.log('⚠️  No files found. Skipping audit.');
    return;
  }
  
  const audits = files.map(auditFile);
  
  const summary = {
    total: audits.length,
    withFrontmatter: audits.filter(a => a.hasFrontmatter).length,
    withRBIMetrics: audits.filter(a => a.hasRBIMetrics).length,
    withOrbAssociations: audits.filter(a => a.hasOrbAssociations).length,
    withResonanceScore: audits.filter(a => a.hasResonanceScore).length,
    withCoherenceVector: audits.filter(a => a.hasCoherenceVector).length,
    withIssues: audits.filter(a => a.issues.length > 0).length,
  };
  
  console.log('\n📊 Summary:');
  console.log(`   Total files: ${summary.total}`);
  console.log(`   With frontmatter: ${summary.withFrontmatter} (${(summary.withFrontmatter / summary.total * 100).toFixed(1)}%)`);
  console.log(`   With RBI metrics: ${summary.withRBIMetrics} (${(summary.withRBIMetrics / summary.total * 100).toFixed(1)}%)`);
  console.log(`   With Orb associations: ${summary.withOrbAssociations} (${(summary.withOrbAssociations / summary.total * 100).toFixed(1)}%)`);
  console.log(`   With issues: ${summary.withIssues} (${(summary.withIssues / summary.total * 100).toFixed(1)}%)`);
  
  // Write report
  const report = {
    timestamp: new Date().toISOString(),
    summary,
    audits: audits.filter(a => a.issues.length > 0 || !a.hasRBIMetrics).slice(0, 20), // Top 20 issues
  };
  
  const reportPath = path.join(WORKSPACE_ROOT, 'YAML_AUDIT_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n✅ Audit complete!`);
  console.log(`   Report: ${path.relative(WORKSPACE_ROOT, reportPath)}`);
  console.log(`   Files with issues: ${summary.withIssues}`);
}

main();

