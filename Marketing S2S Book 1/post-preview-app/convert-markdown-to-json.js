#!/usr/bin/env node
/**
 * Convert Markdown content to JSON for post preview app
 * One-time conversion script
 * 
 * Usage: node convert-markdown-to-json.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const GATEWAY_SOURCE = path.join(__dirname, '../../..', 'Library/Mobile Documents/iCloud~md~obsidian/Documents/Stardust to Sovereignty — Field Vault/Marketing/s_2_s_gateway_corpus_tier_0_tier_1_a_expansion_working (2).md');
const SCROLLSTREAM_SOURCE = path.join(__dirname, '../../..', 'CMS_Backend/all_scrollstreams_export.md');
const OUTPUT_DIR = path.join(__dirname, 'data');

// Invariant names
const INVARIANT_NAMES = {
  1: 'Signal precedes structure',
  2: 'Coherence is architectural',
  3: 'Adaptation follows demand and rhythm',
  4: 'Probability shifts before events',
  5: 'Repetition stabilizes and narrows',
  6: 'Collapse recalibrates structure',
  7: 'Differentiation sustains vitality',
  8: 'Time is a navigable structure',
  9: 'Recognition stabilizes systems',
  10: 'Systems conserve under reduced coherence'
};

// Pattern names
const PATTERN_NAMES = {
  'P1': 'Static / Under-Differentiated',
  'P2': 'Chaotic / Overloaded',
  'P3': 'Transitional / Framework-Collecting',
  'P4': 'Over-Optimized / Performance-Locked',
  'P5': 'Meaning-Saturated / Symbol-Overloaded',
  'P6': 'Emotionally Deferred / Contained-but-Leaking',
  'P7': 'Hyper-Narrativized / Identity-Bound',
  'P8': 'Anxious-Seeking / External-Authority Oriented',
  'P9': 'Dormant / Grief-Stalled',
  'P10': 'High-Differentiation / Low-Containment'
};

/**
 * Parse Gateway Statements from Markdown
 */
function parseGatewayStatements(content) {
  const posts = [];
  const lines = content.split('\n');
  
  let currentInvariant = null;
  let currentPattern = null;
  let currentLines = [];
  let currentQuestion = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect Invariant section
    if (line.startsWith('## Invariant ')) {
      const match = line.match(/Invariant (\d+)/);
      if (match) {
        // Save previous post if exists
        if (currentInvariant && currentPattern && currentLines.length > 0) {
          posts.push(createGatewayPost(currentInvariant, currentPattern, currentLines, currentQuestion));
        }
        currentInvariant = match[1];
        currentPattern = null;
        currentLines = [];
        currentQuestion = '';
      }
    }
    
    // Detect Pattern section (P1-P10)
    if (line.startsWith('### P') && line.match(/^### P(\d+)/)) {
      const match = line.match(/^### P(\d+)/);
      if (match) {
        // Save previous post if exists
        if (currentInvariant && currentPattern && currentLines.length > 0) {
          posts.push(createGatewayPost(currentInvariant, currentPattern, currentLines, currentQuestion));
        }
        currentPattern = `P${match[1]}`;
        currentLines = [];
        currentQuestion = '';
      }
    }
    
    // Collect lines (skip markdown formatting)
    if (currentInvariant && currentPattern) {
      // Skip empty lines and markdown headers
      if (line && !line.startsWith('#') && !line.startsWith('---')) {
        // Check if it's a question (bold)
        if (line.startsWith('**') && line.endsWith('**')) {
          currentQuestion = line.replace(/\*\*/g, '');
        } else if (!line.startsWith('**')) {
          // Regular line
          currentLines.push(line);
        }
      }
      
      // If we have 3 lines and a question, we have a complete post
      if (currentLines.length >= 3 && currentQuestion) {
        posts.push(createGatewayPost(currentInvariant, currentPattern, currentLines.slice(0, 3), currentQuestion));
        currentLines = [];
        currentQuestion = '';
      }
    }
  }
  
  // Save last post
  if (currentInvariant && currentPattern && currentLines.length > 0) {
    posts.push(createGatewayPost(currentInvariant, currentPattern, currentLines, currentQuestion));
  }
  
  return posts;
}

/**
 * Create Gateway post object
 */
function createGatewayPost(invariant, pattern, lines, question) {
  const id = `gs-inv${invariant}-${pattern.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  
  // Determine recommended stage based on pattern
  let recommendedStage = ['Arrival'];
  if (['P4', 'P5', 'P6', 'P7'].includes(pattern)) {
    recommendedStage = ['Deepening'];
  } else if (['P8', 'P9'].includes(pattern)) {
    recommendedStage = ['Stabilization'];
  } else if (pattern === 'P10') {
    recommendedStage = ['Activation'];
  }
  
  return {
    id,
    contentType: 'gateway',
    tier: '1a',
    invariant,
    pattern,
    recommendedStage,
    lines: [
      lines[0] || '',
      lines[1] || '',
      lines[2] || '',
      question || ''
    ],
    glyph: {
      used: false,
      file: '',
      label: ''
    },
    visualMode: 'light',
    status: 'canonical',
    notes: ''
  };
}

/**
 * Parse Scrollstreams from export
 */
function parseScrollstreams(content) {
  const posts = [];
  const lines = content.split('\n');
  
  let currentOrb = null;
  let currentContent = '';
  let currentAttribution = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect Orb section
    if (line.startsWith('## Orb ')) {
      const match = line.match(/Orb (\d+):/);
      if (match) {
        currentOrb = parseInt(match[1]);
      }
    }
    
    // Detect scrollstream entry
    if (line.startsWith('### ') && currentOrb) {
      // Save previous if exists
      if (currentContent) {
        posts.push(createScrollstreamPost(currentOrb, currentContent, currentAttribution));
        currentContent = '';
        currentAttribution = '';
      }
    }
    
    // Extract quote text (after >)
    if (line.startsWith('>')) {
      currentContent = line.replace(/^>\s*/, '');
    }
    
    // Extract attribution
    if (line.startsWith('*Line ') && currentOrb) {
      // Attribution is usually the Orb name
      currentAttribution = `Orb ${currentOrb}: ${getOrbName(currentOrb)}`;
    }
  }
  
  // Save last
  if (currentContent && currentOrb) {
    posts.push(createScrollstreamPost(currentOrb, currentContent, currentAttribution));
  }
  
  return posts;
}

/**
 * Create Scrollstream post object
 */
function createScrollstreamPost(orbNum, content, attribution) {
  const id = `ss-orb${orbNum}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  
  // Determine stage based on Orb
  let recommendedStage = ['Stabilization'];
  if ([1, 2, 3, 4].includes(orbNum)) {
    recommendedStage = ['Arrival', 'Stabilization'];
  } else if ([5, 6, 7, 8, 9, 10].includes(orbNum)) {
    recommendedStage = ['Deepening'];
  } else if ([11, 12, 13].includes(orbNum)) {
    recommendedStage = ['Deepening', 'Activation'];
  }
  
  return {
    id,
    contentType: 'scrollstream',
    tier: '',
    invariant: '',
    pattern: '',
    recommendedStage,
    content: content.trim(),
    attribution: attribution || `Orb ${orbNum}: ${getOrbName(orbNum)}`,
    glyph: {
      used: false,
      file: '',
      label: ''
    },
    visualMode: 'light',
    status: 'canonical',
    notes: ''
  };
}

/**
 * Get Orb name from number
 */
function getOrbName(orbNum) {
  const names = {
    1: 'Origin Intelligence',
    2: 'Resonance Mechanics',
    3: 'Photonic Intelligence',
    4: 'Harmonic Architectures',
    5: 'Temporal Sovereignty',
    6: 'Starline Memory',
    7: 'Alchemical Current',
    8: 'Quantum Intuition',
    9: 'Temporal Fluidity',
    10: 'Ancestral Repatterning',
    11: 'Radiant Transparency',
    12: 'Sovereign Field',
    13: 'Bridging Intelligence'
  };
  return names[orbNum] || '';
}

/**
 * Main conversion function
 */
function convertMarkdownToJSON() {
  console.log('🔄 Converting Markdown to JSON...\n');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Convert Gateway Statements
  if (fs.existsSync(GATEWAY_SOURCE)) {
    console.log('📝 Parsing Gateway Statements...');
    const gatewayContent = fs.readFileSync(GATEWAY_SOURCE, 'utf-8');
    const gatewayPosts = parseGatewayStatements(gatewayContent);
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'gateway.json'),
      JSON.stringify(gatewayPosts, null, 2)
    );
    console.log(`✅ Converted ${gatewayPosts.length} Gateway Statements\n`);
  } else {
    console.log(`⚠️  Gateway source not found: ${GATEWAY_SOURCE}\n`);
  }
  
  // Convert Scrollstreams
  if (fs.existsSync(SCROLLSTREAM_SOURCE)) {
    console.log('📝 Parsing Scrollstreams...');
    const scrollstreamContent = fs.readFileSync(SCROLLSTREAM_SOURCE, 'utf-8');
    const scrollstreamPosts = parseScrollstreams(scrollstreamContent);
    // Limit to first 50 for now (you can adjust)
    const limited = scrollstreamPosts.slice(0, 50);
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'scrollstreams.json'),
      JSON.stringify(limited, null, 2)
    );
    console.log(`✅ Converted ${limited.length} Scrollstreams (limited to 50)\n`);
  } else {
    console.log(`⚠️  Scrollstream source not found: ${SCROLLSTREAM_SOURCE}\n`);
  }
  
  console.log('✨ Conversion complete!');
  console.log(`📁 Output files in: ${OUTPUT_DIR}`);
}

// Run conversion
if (require.main === module) {
  convertMarkdownToJSON();
}

module.exports = { convertMarkdownToJSON, parseGatewayStatements, parseScrollstreams };
