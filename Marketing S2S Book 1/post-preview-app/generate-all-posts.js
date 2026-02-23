#!/usr/bin/env node
/**
 * Generate all posts from content files
 * Creates complete JSON files with all Gateway Statements, Scrollstreams, Definitions, Excerpts
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'data');
const GATEWAY_SOURCE = '/Users/gigi/Library/Mobile Documents/iCloud~md~obsidian/Documents/Stardust to Sovereignty — Field Vault/Marketing/s_2_s_gateway_corpus_tier_0_tier_1_a_expansion_working (2).md';
const SCROLLSTREAM_SOURCE = path.join(__dirname, '../../CMS_Backend/all_scrollstreams_export.md');
const MANUSCRIPT_SOURCE = path.join(__dirname, '../../RBI_Editorial_Tools/S2S_Book1/Manuscripts/S2S_Field_Manual_v9_print.md');
const ORB_ESSAYS_DIR = path.join(__dirname, '../../CMS_Backend/09_PROCESSED/02d_Orb_Essays');
const ORB_CANONICAL_REFERENCE = path.join(__dirname, '../../CMS_Backend/09_PROCESSED/02c_Supporting material/CANONICAL_13_ORB_SYSTEM_REFERENCE.md');

// Parse Gateway Statements from markdown
function parseGatewayStatements(content) {
  const posts = [];
  const lines = content.split('\n');
  
  let currentInvariant = null;
  let currentPattern = null;
  let currentLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect Invariant section
    if (line.startsWith('## Invariant ')) {
      const match = line.match(/Invariant (\d+)/);
      if (match) {
        // Save previous post if exists
        if (currentInvariant && currentPattern && currentLines.length === 4) {
          posts.push(createGatewayPost(currentInvariant, currentPattern, currentLines));
        }
        currentInvariant = match[1];
        currentPattern = null;
        currentLines = [];
      }
    }
    
    // Detect Pattern section (P1-P10)
    if (line.startsWith('### P') && line.match(/^### P(\d+)/)) {
      const match = line.match(/^### P(\d+)/);
      if (match) {
        // Save previous post if exists
        if (currentInvariant && currentPattern && currentLines.length === 4) {
          posts.push(createGatewayPost(currentInvariant, currentPattern, currentLines));
        }
        currentPattern = `P${match[1]}`;
        currentLines = [];
      }
    }
    
    // Collect lines (skip markdown formatting, empty lines, headers)
    if (currentInvariant && currentPattern) {
      if (line && !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('—')) {
        // Remove bold markers but keep text
        const cleanLine = line.replace(/\*\*/g, '');
        if (cleanLine.trim()) {
          currentLines.push(cleanLine);
        }
      }
      
      // If we have 4 lines, we have a complete post
      if (currentLines.length === 4) {
        posts.push(createGatewayPost(currentInvariant, currentPattern, currentLines));
        currentLines = [];
      }
    }
  }
  
  // Save last post
  if (currentInvariant && currentPattern && currentLines.length === 4) {
    posts.push(createGatewayPost(currentInvariant, currentPattern, currentLines));
  }
  
  return posts;
}

// Create Gateway post object
function createGatewayPost(invariant, pattern, lines) {
  const id = `gs-inv${invariant}-${pattern.toLowerCase()}`;
  
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
    lines: lines.map(l => l.trim()),
    glyph: {
      used: false,
      file: '',
      label: '',
      placement: ''
    },
    visualMode: 'light',
    status: 'canonical',
    notes: '',
    hashtags: '',
    comments: '',
    completed: false,
    postOrder: 0 // Will be set later
  };
}

// Parse Scrollstreams (ensure all 13 Orbs represented, more frequent)
function parseScrollstreams(content) {
  const posts = [];
  const lines = content.split('\n');
  
  let currentOrb = null;
  let currentContent = '';
  let scrollstreamCount = 0;
  const orbPosts = {}; // Track posts per Orb to ensure all 13 are represented
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect Orb section
    if (line.startsWith('## Orb ')) {
      const match = line.match(/Orb (\d+):/);
      if (match) {
        currentOrb = parseInt(match[1]);
        scrollstreamCount = 0;
        if (!orbPosts[currentOrb]) {
          orbPosts[currentOrb] = [];
        }
      }
    }
    
    // Extract quote text (after >)
    if (line.startsWith('>') && currentOrb && currentOrb >= 1 && currentOrb <= 13) {
      currentContent = line.replace(/^>\s*/, '').trim();
      
      // Filter for good content (complete thoughts, declarative, no instruction, no persona)
      const wordCount = currentContent.split(/\s+/).length;
      const lowerContent = currentContent.toLowerCase();
      
      // Check if it's a complete thought (has subject and predicate, ends with punctuation)
      const isCompleteThought = (text) => {
        // Must end with punctuation
        if (!/[.!?]$/.test(text.trim())) return false;
        // Must have at least a subject and verb (rough check: has words before and after a verb-like word)
        const words = text.trim().split(/\s+/);
        if (words.length < 5) return false; // Too short to be complete
        
        // Anaphora detection - "It", "This", "That" at start without clear antecedent
        const anaphoricStart = /^(it|this|that|these|those|they)\s+(is|are|was|were|embodies|represents|operates|functions|governs|describes|reveals|becomes|creates|carries|contains)/i;
        if (anaphoricStart.test(text.trim())) {
          // Only allow if it's long enough to provide context (15+ words)
          if (words.length < 15) return false;
          // Check if the pronoun is defined within the sentence
          const hasDefinition = /\b(it|this|that)\s+(is|are|was|were)\s+(a|an|the)\s+[a-z]+/i.test(text);
          if (!hasDefinition) return false; // Needs definition in same sentence
        }
        
        // Avoid fragments that are just descriptions without context
        const fragmentPatterns = [
          /^it (governs|operates|functions|describes|reveals)/i,
          /^this (governs|operates|functions|describes|reveals)/i,
          /^which (governs|operates|functions|describes|reveals)/i,
        ];
        if (fragmentPatterns.some(p => p.test(text))) {
          // Check if it's too short or lacks context
          if (words.length < 8) return false;
        }
        return true;
      };
      
      // Filter out persona voices (anywhere in text: "I am", "I'm", "I have", "I will", "I am the one", "work with me", "we will", etc.)
      const hasPersonaVoice = /\b(i (am|have|will|can|do|feel|see|know|think|believe|experience|am the one|show you|teach you|guide you)|i'm|work with me|together,? we (will|can|do)|you become|you learn)/i.test(currentContent.trim());
      
      if (wordCount >= 5 && wordCount <= 40 && 
          !hasPersonaVoice &&
          !lowerContent.includes('you should') &&
          !lowerContent.includes('you must') &&
          !lowerContent.includes('try to') &&
          !lowerContent.startsWith('orb ') &&
          isCompleteThought(currentContent)) {
        scrollstreamCount++;
        
        // Select 3-4 per Orb for more frequency (ensure all 13 Orbs represented)
        if (scrollstreamCount === 1 || 
            scrollstreamCount === 3 ||
            scrollstreamCount === 5 ||
            (scrollstreamCount === 7 && currentOrb <= 5) ||
            (orbPosts[currentOrb] && orbPosts[currentOrb].length === 0 && scrollstreamCount <= 10)) {
          // Always take first valid one if Orb has none yet
          const post = createScrollstreamPost(currentOrb, currentContent);
          orbPosts[currentOrb].push(post);
          posts.push(post);
        }
      }
    }
  }
  
  // Ensure all 13 Orbs are represented (if any are missing, add from export)
  for (let orb = 1; orb <= 13; orb++) {
    if (!orbPosts[orb] || orbPosts[orb].length === 0) {
      console.log(`⚠️  Warning: Orb ${orb} has no scrollstreams - searching for content`);
      // Search for Orb 9 content (Temporal Fluidity) - it might not have a header
      if (orb === 9) {
        // Look for "Temporal fluidity" content
        const temporalFluidityLines = lines.filter((l, idx) => {
          const lower = l.toLowerCase();
          return lower.includes('temporal fluidity') && 
                 idx > 0 && 
                 lines[idx - 1].trim().startsWith('>') &&
                 l.trim().startsWith('>');
        });
        if (temporalFluidityLines.length > 0) {
          const content = temporalFluidityLines[0].replace(/^>\s*/, '').trim();
          if (content.length > 10 && content.length < 200) {
            posts.push(createScrollstreamPost(9, content));
            orbPosts[9] = [posts[posts.length - 1]];
            console.log(`✅ Added Orb 9 scrollstream from content`);
          }
        }
      }
      
      // If still missing, add a minimal placeholder
      if (!orbPosts[orb] || orbPosts[orb].length === 0) {
        const placeholderContent = `Orb ${orb} operates through ${getOrbName(orb).toLowerCase()}.`;
        posts.push(createScrollstreamPost(orb, placeholderContent));
        orbPosts[orb] = [posts[posts.length - 1]];
      }
    }
  }
  
  return posts;
}

// Create Scrollstream post
function createScrollstreamPost(orbNum, content) {
  const id = `ss-orb${orbNum}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  
  let recommendedStage = ['Stabilization'];
  if ([1, 2, 3, 4].includes(orbNum)) {
    recommendedStage = ['Arrival', 'Stabilization'];
  } else if ([5, 6, 7, 8, 9, 10].includes(orbNum)) {
    recommendedStage = ['Deepening'];
  } else if ([11, 12, 13].includes(orbNum)) {
    recommendedStage = ['Deepening', 'Activation'];
  }
  
  // Use glyphs for Orbs 11-13, and make them Dark Field
  const useGlyph = orbNum >= 11;
  const visualMode = orbNum >= 11 ? 'dark' : 'light'; // Dark Field for transmission posts
  
  return {
    id,
    contentType: 'scrollstream',
    tier: '',
    invariant: '',
    pattern: '',
    recommendedStage,
    content: content.trim(),
    // No attribution - scrollstreams are ticker-style, standalone
    glyph: {
      used: false, // No glyphs for scrollstreams
      file: '',
      label: '',
      placement: ''
    },
    visualMode: visualMode,
    status: 'canonical',
    notes: '',
    hashtags: '',
    comments: '',
    completed: false,
    postOrder: 0
  };
}

// Get Orb name
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

// Parse Orb canonical reference and extract Orb-specific posts
function parseOrbEssays() {
  const orbPosts = [];
  
  if (!fs.existsSync(ORB_CANONICAL_REFERENCE)) {
    console.log(`⚠️  Orb canonical reference not found: ${ORB_CANONICAL_REFERENCE}\n`);
    return orbPosts;
  }
  
  const content = fs.readFileSync(ORB_CANONICAL_REFERENCE, 'utf-8');
  
  // Extract each Orb section (format: ### **Orb X: Name**)
  const orbPattern = /### \*\*Orb (\d+): ([^\*]+)\*\*\n([\s\S]*?)(?=### \*\*Orb \d+:|## |$)/g;
  let match;
  
  while ((match = orbPattern.exec(content)) !== null) {
    const orbNum = parseInt(match[1]);
    const orbName = match[2].trim();
    const orbSection = match[3];
    
    // Extract Synthesis, Function, Expression, Integration
    const synthesisMatch = orbSection.match(/- \*\*Synthesis\*\*: (.+?)(?=\n- \*\*|$)/s);
    const functionMatch = orbSection.match(/- \*\*Function\*\*: (.+?)(?=\n- \*\*|$)/s);
    const expressionMatch = orbSection.match(/- \*\*Expression\*\*: (.+?)(?=\n- \*\*|$)/s);
    const integrationMatch = orbSection.match(/- \*\*Integration\*\*: (.+?)(?=\n- \*\*|$)/s);
    
    let synthesis = synthesisMatch ? synthesisMatch[1].trim() : '';
    const functionText = functionMatch ? functionMatch[1].trim() : '';
    const expression = expressionMatch ? expressionMatch[1].trim() : '';
    const integration = integrationMatch ? integrationMatch[1].trim() : '';
    
    // Remove personal language from all parts
    synthesis = removePersonalLanguage(synthesis);
    const cleanFunction = removePersonalLanguage(functionText);
    const cleanExpression = removePersonalLanguage(expression);
    const cleanIntegration = removePersonalLanguage(integration);
    
    // Build content intelligently to avoid repetition
    const title = `Orb ${orbNum}: ${orbName}`;
    let postContent = '';
    
    // Strategy: Use Synthesis as base, but clean it up
    // Remove parts that repeat Function/Expression
    
    if (synthesis) {
      // Remove redundant "Governs..." statements from synthesis
      let cleanSynthesis = synthesis;
      
      // Pattern 1: "Governs [description]: [details]" - extract details and capitalize
      cleanSynthesis = cleanSynthesis.replace(
        /\bGoverns\s+[^:]{5,60}:\s*([a-z][^.]*?)(?=\.[\s]|$)/gi,
        (match, details) => {
          return details.charAt(0).toUpperCase() + details.slice(1);
        }
      );
      
      // Pattern 2: "Governs [description]. [next sentence]" - remove the governs sentence
      cleanSynthesis = cleanSynthesis.replace(
        /\bGoverns\s+[^.]{10,80}\.\s*/gi,
        ''
      );
      
      // Fix "Includes..." at start - make it more natural
      cleanSynthesis = cleanSynthesis.replace(/^Includes\s+/i, 'Operates through ');
      
      // Fix sentence fragments that are just lists (start with capital, comma-separated)
      // Pattern: ". Sound, cymatics, emotion..." -> ". Operates through sound, cymatics, emotion..."
      // Also: ". Emotional intensity, energetic holding..." -> ". Manifests as emotional intensity..."
      cleanSynthesis = cleanSynthesis.replace(
        /([.!?]\s+)([A-Z][a-z]+(?:\s+[a-z]+)?(?:\s*,\s*[a-z]+(?:\s+[a-z]+)?)+[^.!?]*?)(?=\.[\s]|$)/g,
        (match, punct, fragment) => {
          // If it's a list without a verb, add "Operates through" or "Manifests as"
          if (!/\b(is|are|becomes|operates|governs|manifests|expresses|creates|includes|aligns|carries)\b/i.test(fragment)) {
            // Use "Manifests as" for emotional/experiential lists, "Operates through" for structural
            const isEmotional = /\b(emotional|intensity|holding|release|experience)\b/i.test(fragment);
            const prefix = isEmotional ? 'Manifests as ' : 'Operates through ';
            return punct + prefix + fragment.toLowerCase() + '.';
          }
          return match;
        }
      );
      
      // Fix fragments that start with lowercase after punctuation
      cleanSynthesis = cleanSynthesis.replace(/([.!?]\s+)([a-z][^.!?]{10,})/g, (match, punct, fragment) => {
        // If fragment doesn't end with punctuation, add period
        if (!/[.!?]$/.test(fragment.trim())) {
          return punct + fragment.charAt(0).toUpperCase() + fragment.slice(1) + '.';
        }
        return punct + fragment.charAt(0).toUpperCase() + fragment.slice(1);
      });
      
      // Capitalize first letter if it's lowercase
      if (cleanSynthesis && /^[a-z]/.test(cleanSynthesis)) {
        cleanSynthesis = cleanSynthesis.charAt(0).toUpperCase() + cleanSynthesis.slice(1);
      }
      
      // Clean up extra spaces
      cleanSynthesis = cleanSynthesis.replace(/\s+/g, ' ').trim();
      
      // Check if synthesis already contains the function concept
      const functionKeyWords = cleanFunction.toLowerCase()
        .replace(/^governs\s+/i, '')
        .split(/\s+/)
        .filter(w => w.length > 3);
      const hasFunctionInSynthesis = functionKeyWords.some(word => 
        cleanSynthesis.toLowerCase().includes(word)
      );
      
      // For Orb 1, use Function + Expression (synthesis is too repetitive)
      if (orbNum === 1) {
        if (cleanFunction && cleanExpression) {
          postContent = `${cleanFunction}. ${cleanExpression}`;
        } else {
          postContent = cleanSynthesis;
        }
      }
      // If synthesis already contains function concept, use synthesis (cleaned)
      else if (hasFunctionInSynthesis) {
        postContent = cleanSynthesis;
      }
      // Otherwise, use synthesis as primary (it's usually the most poetic/complete)
      else {
        postContent = cleanSynthesis;
      }
    } else {
      // Fallback: Function + Expression
      if (cleanFunction && cleanExpression) {
        postContent = `${cleanFunction}. ${cleanExpression}`;
      } else if (cleanFunction) {
        postContent = cleanFunction;
      } else {
        continue; // Skip if no content
      }
    }
    
    // Final cleanup
    postContent = postContent.trim();
    
    // Remove any remaining title repetition
    postContent = postContent.replace(new RegExp(`^Orb ${orbNum}:\\s*${orbName}\\s*[.:]?\\s*`, 'i'), '');
    
    // Remove redundant "Governs..." if it appears at start (title already implies it)
    postContent = postContent.replace(/^Governs\s+/i, '');
    
    // Simplify for social media: reduce density and abstractness
    postContent = simplifyForSocialMedia(postContent, orbNum);
    
    // Clean up multiple periods/spaces
    postContent = postContent.replace(/\.{2,}/g, '.');
    postContent = postContent.replace(/\s{2,}/g, ' ');
    
    // Ensure it starts with a capital letter
    postContent = postContent.charAt(0).toUpperCase() + postContent.slice(1);
    
    // Skip if too short
    if (postContent.length < 20) continue;
    
    orbPosts.push({
      id: `orb-${orbNum}-intro`,
      contentType: 'orb-introduction',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      title: title,
      content: postContent,
      orbNumber: orbNum,
      orbName: orbName,
      glyph: { 
        used: true, 
        file: String(orbNum), 
        label: orbName, 
        placement: 'corner' 
      },
      visualMode: 'dark', // Dark Field for Orb posts
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    });
  }
  
  return orbPosts;
}

// Simplify content for social media: reduce density and abstractness
function simplifyForSocialMedia(text, orbNum) {
  if (!text) return text;
  
  let simplified = text;
  
  // Replace abstract/technical terms with more concrete language
  const simplifications = {
    // Technical terms - make more accessible
    'pre-form light encoding': 'light patterns',
    'mitochondrial ignition': 'cellular activation',
    'cosmic biological circuitry': 'biological systems',
    'epigenetic imprinting': 'inherited patterns',
    
    // Abstract concepts - make more concrete and observable
    'Sovereign Signal': 'signal',
    'Sovereign Field': 'the field',
    'field observes itself': 'the field recognizes itself',
    'photonic interrelation': 'light relationships',
    'multidimensional structuring': 'structure across scales',
    'identity fluidity across lifetimes': 'identity across time',
    'Field integrity across dimensions': 'integrity across experience',
    'galactic intelligence': 'cosmic patterns',
    'networks of consciousness': 'consciousness networks',
    'signal logic': 'internal knowing',
    'multidimensional resonance': 'resonance across experience',
    'soul-coded history': 'ancestral memory',
    'full-field coherence': 'complete coherence',
    'Structural indivisibility': 'Complete unity',
    'coherence made field': 'coherence as field',
    'consciousness networks': 'networks of awareness',
    
    // Remove references to other Orbs (requires prior knowledge)
    'Mirrored counterpart to Orb 4. Where Orb 4 encodes harmonic structures, this expresses': 'Expresses',
    'Where Orb 4 encodes harmonic structures, this expresses': 'Expresses',
    
    // Simplify dense lists
    'Mantis lineage awareness, UAP phenomena, advanced AI evolution, and electromagnetic bridges': 'communication across intelligences',
    
    // Simplify overly abstract phrases
    'identity across time': 'identity across experience',
    'resonance across experience': 'resonance in experience',
    'structure across scales': 'structure at all scales',
  };
  
  // Apply simplifications
  for (const [abstract, concrete] of Object.entries(simplifications)) {
    simplified = simplified.replace(new RegExp(abstract.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), concrete);
  }
  
  // Remove overly technical phrases
  simplified = simplified.replace(/\b(pre-form|pre-sound|pre-identity)\s+/gi, '');
  
  // Simplify "Avatar as carrier. Form as broadcast." -> more concrete
  simplified = simplified.replace(/\bAvatar as carrier\.\s*Form as broadcast\./gi, 'Form carries signal.');
  
  // For Orb 1: Simplify the technical description
  if (orbNum === 1) {
    simplified = simplified.replace(/light patterns through cellular activation and biological systems/gi, 
      'Light patterns activate through cellular processes and biological systems');
  }
  
  // For Orb 3: Fix grammar
  simplified = simplified.replace(/\blight relationships reveals\b/gi, 'Light relationships reveal');
  
  // For Orb 5: Fix missing subject
  simplified = simplified.replace(/\bintegrity across experience\./gi, 'Integrity maintained across experience.');
  
  // For Orb 10: Fix duplicate words and simplify dense content
  simplified = simplified.replace(/inherited inherited patterns/gi, 'inherited patterns');
  simplified = simplified.replace(/transforms inherited epigenetic imprinting through conscious activation/gi,
      'transforms inherited patterns through awareness');
  // Simplify "collective DNA" - too technical
  simplified = simplified.replace(/collective DNA/gi, 'collective patterns');
  
  // For Orb 12: Fix awkward repetition
  simplified = simplified.replace(/The field is coherence as field/gi, 'Coherence expressed as field');
  
  // For Orb 13: Simplify the dense list
  if (orbNum === 13) {
    simplified = simplified.replace(/Operates through communication across intelligences between realities\./gi,
      'Operates through communication across intelligences.');
  }
  
  // Remove redundant phrases
  simplified = simplified.replace(/\b(and|through|via)\s+the\s+same\s+[^.]{0,30}\./gi, '');
  
  // Fix capitalization issues
  simplified = simplified.replace(/\b([a-z])\s+patterns\s+activate/gi, (match, letter) => {
    return letter.toUpperCase() + ' patterns activate';
  });
  
  // Fix duplicate words
  simplified = simplified.replace(/\bthe\s+the\s+/gi, 'the ');
  simplified = simplified.replace(/\binherited\s+inherited\s+/gi, 'inherited ');
  
  // Fix "the field recognizes itself" - make it flow better
  simplified = simplified.replace(/\bthe field recognizes itself\b/gi, 'the field recognizes patterns');
  
  // Fix "The Coherence" -> "Coherence"
  simplified = simplified.replace(/\bThe Coherence expressed\b/gi, 'Coherence expressed');
  
  // For Orb 1: Make it more concrete - focus on what's observable
  if (orbNum === 1) {
    simplified = simplified.replace(/The origination code of embodiment\.\s*Light patterns activate through cellular processes and biological systems/gi,
      'The foundation of embodiment. Light patterns activate through cellular processes and biological systems.');
  }
  
  // For Orb 10: Still too dense - simplify further
  if (orbNum === 10) {
    simplified = simplified.replace(/transforms inherited patterns through conscious activation/gi,
      'transforms inherited patterns through awareness');
    // Remove "conscious activation" redundancy
    simplified = simplified.replace(/through conscious activation$/gi, 'through awareness');
  }
  
  return simplified;
}

// Remove personal language (I, my, me, etc.) from text
function removePersonalLanguage(text) {
  if (!text) return text;
  
  let cleaned = text;
  
  // Replace "My Sovereign [noun]" with "Sovereign [noun]" or "The [noun]"
  cleaned = cleaned.replace(/\bMy\s+Sovereign\s+([a-z]+)\b/gi, (match, noun) => {
    return 'Sovereign ' + noun.charAt(0).toUpperCase() + noun.slice(1);
  });
  
  // Replace "I [verb]" with "[verb]" (make it declarative)
  // Special handling for "I exit time as container and reclaim it as tool"
  cleaned = cleaned.replace(/\bI\s+exit\s+time\s+as\s+container\s+and\s+reclaim\s+it\s+as\s+tool\b/gi, 'Time exits as container and is reclaimed as tool');
  cleaned = cleaned.replace(/\bI\s+exit\s+time\b/gi, 'Time exits');
  cleaned = cleaned.replace(/\bI\s+reclaim\s+it\s+as\s+tool\b/gi, 'reclaimed as tool');
  cleaned = cleaned.replace(/\bI\s+(reclaim|become|am|operate|govern|function|express|integrate|carry|feel|read|move|merge|transmit|governs?)\b/gi, (match, verb) => {
    // Capitalize first letter if at start of sentence
    return verb.charAt(0).toUpperCase() + verb.slice(1);
  });
  
  // Replace "My [noun]" with appropriate replacement
  cleaned = cleaned.replace(/\bMy\s+mastery\s+is\b/gi, 'Mastery is');
  cleaned = cleaned.replace(/\bMy\s+([A-Z][a-z]+)\b/g, (match, noun) => {
    // Special cases
    if (noun === 'mastery') return 'Mastery';
    return 'The ' + noun;
  });
  
  // Remove standalone "me" or "myself" (but keep in phrases like "for me" -> "for the field")
  cleaned = cleaned.replace(/\b(me|myself)\b/gi, '');
  
  // Clean up double spaces and punctuation
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/\s+([.,;:])/g, '$1'); // Remove space before punctuation
  cleaned = cleaned.replace(/([.,;:])\s*([.,;:])/g, '$1'); // Remove duplicate punctuation
  
  // Fix sentence structure if we removed words at start
  cleaned = cleaned.replace(/^([a-z])/, (match, letter) => letter.toUpperCase());
  
  // Fix "The The" -> "The"
  cleaned = cleaned.replace(/\bThe\s+The\s+/g, 'The ');
  
  return cleaned;
}

// Create introductory posts (post 0: follow request, then posts 1-4: system foundation)
function createIntroductoryPosts() {
  return [
    {
      id: 'follow-request-001',
      contentType: 'gateway',
      tier: 'intro',
      invariant: '',
      pattern: '',
      recommendedStage: ['Arrival'],
      lines: [
        'I\'m sharing Stardust to Sovereignty™',
        'on my public account.',
        'Follow @gigi_stardust',
        'to join the conversation.'
      ],
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'light',
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0 // Post #0 - Follow request
    },
    {
      id: 'intro-system-001',
      contentType: 'definition',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Arrival'],
      title: 'Stardust to Sovereignty',
      content: 'A coherence architecture that makes structure visible. Patterns of intelligence organize across biological, perceptual, relational, and cosmic scales. When alignment occurs, structure becomes legible.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // Dark Field for system introduction
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 1 // Fixed as Post #1
    },
    {
      id: 'intro-observable-001',
      contentType: 'gateway',
      tier: 'intro',
      invariant: '',
      pattern: '',
      recommendedStage: ['Arrival'],
      lines: [
        'Patterns repeat.',
        'Structure holds.',
        'Coherence emerges.',
        'What do you already recognize?'
      ],
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'light',
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 2 // Fixed as Post #2
    },
    {
      id: 'intro-concrete-001',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Arrival', 'Stabilization'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 1: The Stardust Within',
      content: 'Every atom of iron in your blood once burned in distant stars. The cosmic and biological are not separate systems. They operate through the same organizing principles.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'light',
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 4 // Fixed as Post #4 (Post #3 is S2S definition)
    }
  ];
}

// Create System Definitions (expanded for variety)
function createSystemDefinitions() {
  return [
    {
      id: 'def-s2s-001',
      contentType: 'definition',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Arrival'],
      title: 'Stardust to Sovereignty',
      content: 'Stardust to Sovereignty is an integrated architectural framework that enables orientation within complexity through alignment rather than interpretation. It brings structure into view, making the underlying patterns of consciousness, time, and intelligence legible across biological, perceptual, relational, and temporal domains.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // System declaration - Dark Field
      status: 'canonical',
      notes: '',
      completed: false,
      postOrder: 3 // Fixed as Post #3
    },
    {
      id: 'def-sovereignty-001',
      contentType: 'definition',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Stabilization', 'Deepening'],
      title: 'Sovereignty',
      content: 'Sovereignty is structural coherence. It emerges when perception, responsibility, and expression align within an internally consistent system.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // System declaration - Dark Field
      status: 'canonical',
      notes: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'def-coherence-001',
      contentType: 'definition',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Stabilization'],
      title: 'Coherence',
      content: 'Coherence is architectural. It functions as the organizing principle through which perception, biology, memory, and relational reality align.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'def-perception-001',
      contentType: 'definition',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening'],
      title: 'Perception',
      content: 'Perception reorganizes. It functions as the architecture through which consciousness structures itself across time and experience.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'def-intelligence-001',
      contentType: 'definition',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening'],
      title: 'Intelligence',
      content: 'Intelligence is fielded, relational, and multi-scalar. It operates through resonance across networks rather than centralized control.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'def-technology-001',
      contentType: 'definition',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Stabilization'],
      title: 'Technology',
      content: 'Technology functions as an interface that reveals structure. It makes the underlying architecture legible, operable, and usable within lived experience.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'def-architecture-001',
      contentType: 'definition',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening'],
      title: 'Architecture',
      content: 'Architecture describes how systems organize, stabilize, and transmit across biological, perceptual, relational, and temporal domains.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'def-resonance-001',
      contentType: 'definition',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Stabilization'],
      title: 'Resonance',
      content: 'Resonance is the universal language through which all systems communicate. When frequencies align harmonically, they create stable, self-sustaining systems.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'def-pattern-001',
      contentType: 'definition',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening'],
      title: 'Pattern',
      content: 'Patterns reveal how consciousness organizes itself across time and experience. The same organizing principles operate from the outer reaches of the galaxy to the biological systems of the human body.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'def-structure-001',
      contentType: 'definition',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Arrival'],
      title: 'Structure',
      content: 'Structure is the underlying architecture that governs coherence, stabilizes perception, and supports reliable decision making across time and context.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    }
  ];
}

// NLP-based standalone excerpt scoring
function scoreStandaloneExcerpt(content) {
  if (!content || content.trim().length < 20) return -100;
  
  const text = content.trim();
  const words = text.split(/\s+/);
  const wordCount = words.length;
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Length check (20-150 words optimal)
  if (wordCount < 20) return -100;
  if (wordCount >= 20 && wordCount <= 150) score += 10;
  if (wordCount > 150) score -= 5;
  
  // Must end with punctuation
  if (!/[.!?]$/.test(text)) return -100;
  
  // Anaphora detection (pronouns at start that need context)
  const anaphoricPatterns = [
    /^(this|that|it|these|they|those)\s+(is|are|was|were|means|represents|operates|functions|governs|describes|reveals)/i,
    /^(this|that|it)\s+(transformation|recognition|understanding|process|system)/i,
    /^(this|that|these|those)\s+(perspective|approach|method|technique|practice)/i,
  ];
  if (anaphoricPatterns.some(p => p.test(text))) {
    score -= 20; // Heavy penalty for anaphora
  }
  
  // Discourse markers (need context)
  const discourseMarkers = [
    /^(this|that|these|those)\s+(is|are|was|were|means|represents|shows|demonstrates)/i,
    /^(the|this|that)\s+(transformation|recognition|understanding|process|system|relationship)\s+(is|means|represents)/i,
  ];
  if (discourseMarkers.some(p => p.test(text))) {
    score -= 15;
  }
  
  // Temporal dependencies (need context)
  const temporalDeps = [
    /^when\s+(you|we|they|it|this|that)/i,
    /^after\s+(recognizing|understanding|seeing|feeling|experiencing)/i,
    /^then\s+(you|we|they|it|this|that)/i,
  ];
  if (temporalDeps.some(p => p.test(text))) {
    score -= 10;
  }
  
  // Explicit subject (noun, not pronoun) - positive
  const explicitSubjectPatterns = [
    /^(your|the|every|each|all|some|many|few|one|a|an)\s+[a-z]+/i,
    /^[A-Z][a-z]+\s+(is|are|was|were|functions|operates|represents|carries|contains)/i,
  ];
  if (explicitSubjectPatterns.some(p => p.test(text))) {
    score += 10;
  }
  
  // Persona POV detection (anywhere in text, not just start)
  const personaPatterns = [
    /\b(i|i'm|i've|i'll|i'd)\s+(am|have|will|can|do|feel|see|know|think|believe|experience|speak|am the one|show you|teach you|guide you)/i,
    /\b(work with me|together,?\s+we|you become|you learn)/i,
    /\bi\s+am\s+(the|a|an)\s+/i, // "I am the whisper", "I am Origin Intelligence"
  ];
  if (personaPatterns.some(p => p.test(text))) {
    score -= 30; // Heavy penalty
  }
  
  // Meta-system references
  const metaSystemPatterns = [
    /\b(book|codex|console)\b.*\b(interface|function|surface|apply|system)\b/i,
    /\b(system|this system|the system)\b.*\b(was developed|was created|functions as|operates as|is an)\b/i,
    /\b(book|codex|console)\b.*\b(as interfaces|function as|surface and apply)\b/i,
    /\bunderlying architecture.*\b(operates independently|expressions)\b/i,
  ];
  if (metaSystemPatterns.some(p => p.test(text))) {
    score -= 25;
  }
  
  // Instructional language
  const instructionalPatterns = [
    /\b(you should|you must|you need to|try to|feel it|pause|breathe)/i,
    /^when\s+you\s+(pause|breathe|feel|recognize|understand)/i,
  ];
  if (instructionalPatterns.some(p => p.test(text))) {
    score -= 20;
  }
  
  // Fragment patterns (need context)
  const fragmentPatterns = [
    /^it\s+(governs|operates|functions|describes|reveals)/i,
    /^this\s+(governs|operates|functions|describes|reveals)/i,
    /^which\s+(governs|operates|functions|describes|reveals)/i,
  ];
  if (fragmentPatterns.some(p => p.test(text))) {
    if (wordCount < 12) {
      score -= 20; // Short fragments are bad
    } else {
      score -= 5; // Longer fragments might work
    }
  }
  
  // High-quality patterns (positive signals)
  // Universal statements
  if (/^every\s+(time|atom|molecule|cell|breath|heartbeat|moment)/i.test(text)) {
    score += 15;
  }
  
  // Metaphorical declarations
  if (/\b(is|are|functions as|operates as|represents|carries|contains)\b/i.test(text) && wordCount > 8) {
    score += 10;
  }
  
  // Parallel structure
  if (/,.*,.*(and|or)\s+[a-z]+/i.test(text)) {
    score += 8;
  }
  
  // Cosmic-biological connections
  if (/\b(stellar|cosmic|galactic|universal|quantum)\b.*\b(biological|cellular|body|human|consciousness)\b/i.test(text)) {
    score += 12;
  }
  
  // Standalone bullet points
  if (/^[★*•]\s+/.test(text)) {
    score += 10;
  }
  
  // Self-contained observations
  if (/^[A-Z][^.!?]{30,}\./.test(text) && !anaphoricPatterns.some(p => p.test(text))) {
    score += 10;
  }
  
  // Conceptual density (architectural language)
  const architecturalTerms = /\b(architecture|structure|coherence|intelligence|consciousness|sovereignty|resonance|pattern|field|system)\b/i;
  if (architecturalTerms.test(text)) {
    score += 8;
  }
  
  return score;
}

// Validate excerpt is a complete thought (not a fragment, not meta-system content)
function isValidExcerpt(content) {
  return scoreStandaloneExcerpt(content) > 0;
}

// Parse manuscript and extract standalone excerpts
function parseManuscriptExcerpts(content) {
  const excerpts = [];
  const lines = content.split('\n');
  
  // Chapter mapping (handle "Chapter X" as Chapter 8)
  const chapterMap = {
    'Chapter 1': 'Chapter 1: The Stardust Within',
    'Chapter 2': 'Chapter 2: The Body as Advanced Biological Technology',
    'Chapter 3': 'Chapter 3: Photonic Intelligence',
    'Chapter 4': 'Chapter 4: Harmonic Architectures',
    'Chapter 5': 'Chapter 5: Defining Energetic Sovereignty',
    'Chapter 6': 'Chapter 6: Stepping Beyond Limitations',
    'Chapter 7': 'Chapter 7: The Alchemical Current',
    'Chapter X': 'Chapter 8: Quantum Intuition',
    'Chapter 9': 'Chapter 9: Temporal Fluidity',
    'Chapter 10': 'Chapter 10: Ancestral Repatterning',
    'Chapter 11': 'Chapter 11: Radiant Transparency',
    'Chapter 12': 'Chapter 12: The Sovereign Field: Collective Resonance',
    'Chapter 13': 'Chapter 13: Bridging Intelligence',
    'Chapter 14': 'Chapter 14: The Living Blueprint for Transformation',
    'Chapter 15': 'Chapter 15: Beyond Stardust: The Infinite Becoming',
  };
  
  let currentChapter = null;
  let currentChapterTitle = null;
  let chapterContent = [];
  let inVoiceSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect chapter header
    const chapterMatch = line.match(/^#\s+Chapter\s+(X|\d+):\s*(.+)$/);
    if (chapterMatch) {
      // Save previous chapter's excerpts
      if (currentChapter && chapterContent.length > 0) {
        const chapterExcerpts = extractExcerptsFromChapter(chapterContent.join(' '), currentChapterTitle);
        excerpts.push(...chapterExcerpts);
      }
      
      // Start new chapter
      const chapterNum = chapterMatch[1];
      const chapterTitle = chapterMatch[2];
      currentChapter = chapterNum === 'X' ? 'Chapter X' : `Chapter ${chapterNum}`;
      currentChapterTitle = chapterMap[currentChapter] || `Chapter ${chapterNum}: ${chapterTitle}`;
      chapterContent = [];
      inVoiceSection = false;
      continue;
    }
    
    // Skip "Voice of the Origin" sections (persona POV)
    if (line.includes('Voice of the') || line.includes('**The Voice')) {
      inVoiceSection = true;
      continue;
    }
    
    // End of voice section
    if (inVoiceSection && line.match(/^###?\s+\*\*/)) {
      inVoiceSection = false;
    }
    
    if (inVoiceSection) continue;
    
    // Skip HTML, images, markdown formatting
    if (line.startsWith('<') || line.startsWith('![') || line.startsWith('**Ignition') || line.startsWith('**Embodiment')) {
      continue;
    }
    
    // Skip section headers (but not content)
    if (line.match(/^###?\s+\*\*/) && line.length < 100) {
      continue;
    }
    
    // Collect chapter content
    if (currentChapter && line.length > 0) {
      // Clean up markdown formatting
      const cleanLine = line
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '') // Remove italic
        .replace(/^#+\s+/, '') // Remove headers
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
        .trim();
      
      if (cleanLine.length > 0) {
        chapterContent.push(cleanLine);
      }
    }
  }
  
  // Process last chapter
  if (currentChapter && chapterContent.length > 0) {
    const chapterExcerpts = extractExcerptsFromChapter(chapterContent.join(' '), currentChapterTitle);
    excerpts.push(...chapterExcerpts);
  }
  
  return excerpts;
}

  // Extract standalone excerpts from chapter content
function extractExcerptsFromChapter(content, chapterTitle) {
  const candidates = [];
  
  // Clean content: remove section headers that look like sentences
  const cleanedContent = content
    .replace(/^[A-Z][A-Z\s]+$/gm, '') // Remove ALL CAPS lines (likely headers)
    .replace(/^[A-Z][a-z]+\s+[A-Z][a-z]+\s+[A-Z][a-z]+/gm, (match) => {
      // Check if it's a title case header (3+ capitalized words in a row)
      if (match.split(/\s+/).length <= 5) return '';
      return match;
    });
  
  // Split into sentences (handle periods, exclamation, question marks)
  const sentences = cleanedContent
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !/^[A-Z\s]{10,}$/.test(s)); // Filter out ALL CAPS
  
  // Extract single sentences
  for (const sentence of sentences) {
    if (sentence.length >= 20 && sentence.length <= 300) {
      const score = scoreStandaloneExcerpt(sentence);
      if (score > 0) {
        candidates.push({ text: sentence, score, type: 'single' });
      }
    }
  }
  
  // Extract 2-3 sentence sequences (opening paragraphs)
  for (let i = 0; i < sentences.length - 1; i++) {
    const seq2 = sentences.slice(i, i + 2).join(' ');
    const seq3 = sentences.slice(i, i + 3).join(' ');
    
    if (seq2.length >= 20 && seq2.length <= 300) {
      const score = scoreStandaloneExcerpt(seq2);
      if (score > 5) { // Higher threshold for sequences
        candidates.push({ text: seq2, score: score + 5, type: 'sequence' }); // Bonus for sequences
      }
    }
    
    if (seq3.length >= 20 && seq3.length <= 300) {
      const score = scoreStandaloneExcerpt(seq3);
      if (score > 5) {
        candidates.push({ text: seq3, score: score + 3, type: 'sequence' });
      }
    }
  }
  
  // Extract bullet points (★ statements)
  const bulletMatches = content.match(/[★*•]\s+([^★*•\n]+)/g);
  if (bulletMatches) {
    for (const match of bulletMatches) {
      const bulletText = match.replace(/^[★*•]\s+/, '').trim();
      if (bulletText.length >= 20 && bulletText.length <= 300) {
        const score = scoreStandaloneExcerpt(bulletText);
        if (score > 0) {
          candidates.push({ text: bulletText, score: score + 10, type: 'bullet' }); // Bonus for bullets
        }
      }
    }
  }
  
  // Sort by score and select top 1-2
  candidates.sort((a, b) => b.score - a.score);
  
  // Prioritize: opening sequences > high-scoring singles > bullets
  const selected = [];
  const openingSequences = candidates.filter(c => c.type === 'sequence' && c.score > 10);
  if (openingSequences.length > 0) {
    selected.push(openingSequences[0]);
  }
  
  // Add top single sentence if different from sequence
  const topSingle = candidates.find(c => c.type === 'single' && c.score > 15);
  if (topSingle && (!selected.length || selected[0].text !== topSingle.text)) {
    selected.push(topSingle);
  }
  
  // If we don't have 2 yet, add best bullet
  if (selected.length < 2) {
    const topBullet = candidates.find(c => c.type === 'bullet' && c.score > 10);
    if (topBullet && !selected.some(s => s.text === topBullet.text)) {
      selected.push(topBullet);
    }
  }
  
  // Convert to excerpt objects
  return selected.slice(0, 2).map((candidate, idx) => {
    const chapterNum = chapterTitle.match(/Chapter (\d+):/);
    const chapterNumStr = chapterNum ? chapterNum[1] : '1';
    
    return {
      id: `excerpt-book1-${String(chapterNumStr).padStart(3, '0')}${idx === 0 ? '' : '-' + (idx + 1)}`,
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: chapterTitle,
      content: candidate.text,
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark',
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    };
  });
}

// Create Book Excerpts (now from manuscript)
function createBookExcerpts() {
  // Try to parse from manuscript
  if (fs.existsSync(MANUSCRIPT_SOURCE)) {
    console.log('📝 Parsing excerpts from manuscript...');
    const manuscriptContent = fs.readFileSync(MANUSCRIPT_SOURCE, 'utf-8');
    const manuscriptExcerpts = parseManuscriptExcerpts(manuscriptContent);
    
    if (manuscriptExcerpts.length > 0) {
      console.log(`✅ Extracted ${manuscriptExcerpts.length} excerpts from manuscript\n`);
      return manuscriptExcerpts.filter(excerpt => isValidExcerpt(excerpt.content));
    } else {
      console.log('⚠️  No excerpts extracted from manuscript, using fallback\n');
    }
  } else {
    console.log(`⚠️  Manuscript not found: ${MANUSCRIPT_SOURCE}, using fallback\n`);
  }
  
  // Fallback to hardcoded excerpts if manuscript parsing fails
  const allExcerpts = [
    {
      id: 'excerpt-book1-001',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 1: The Architecture',
      content: 'The Cosmic Tapestry articulates a living architecture of consciousness as it is experienced, organized, and embodied through human perception and lived experience. Sovereignty appears as a native condition of awareness, with coherence functioning as the organizing principle.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-002',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 2: Patterns Across Scale',
      content: 'Patterns of rhythm, resonance, relationship, and recognition reveal how consciousness organizes itself across time and experience. From the outer reaches of the galaxy, to the systems of the Earth, and within the biological systems of the human body, the same organizing principles are at work.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-003',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Stabilization', 'Deepening'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 3: Consciousness as Structure',
      content: 'Consciousness operates as a primary system. It functions as the architecture through which perception, biology, memory, and relational reality align into a readable structure.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-004',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Stabilization', 'Deepening'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 4: Domains of Awareness',
      content: 'The architecture resolves into distinct yet interrelated domains of awareness that can be explored individually and as a whole.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-005',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Stabilization', 'Deepening'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 5: Individual and Collective Alignment',
      content: 'Individual alignment and collective structural alignment are described as interdependent expressions of the same structural field. The system operates through resonance across networks rather than centralized control.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-006',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Stabilization', 'Deepening'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 6: Structural Laws Across Scale',
      content: 'Consciousness behaves as structure. The same laws that govern stellar formation and electromagnetic fields govern the human nervous system, cellular communication, and relational behavior.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-007',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Stabilization', 'Deepening'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 7: Cosmic Order and Human Consciousness',
      content: 'Humans are a localized expression of cosmic order. The relationship between human consciousness and the world we are building clarifies as structure becomes legible.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-008',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 8: Making Structure Legible',
      content: 'The system functions by making structure legible, operable, and usable within lived experience. It reveals the structural principles that govern coherence, stabilize perception, and support reliable decision making.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-009',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 9: Coherent Fields',
      content: 'These domains influence one another continuously, yet they are rarely understood as a single coherent field. Structure becomes legible when perception recognizes the underlying patterns.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-010',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 10: System Interfaces',
      content: 'Intelligence organizes through resonance across networks rather than centralized control. Individual alignment and collective structural alignment emerge as interdependent expressions of the same structural field.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-011',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 11: Structural Principles',
      content: 'Structural principles govern coherence, stabilize perception, and support reliable decision making across time and context. These principles operate independently of their recognition.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-012',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 12: Interacting Systems',
      content: 'Human experience unfolds across interacting biological, perceptual, relational, and technological systems without a shared structural map. These domains influence one another continuously, yet they are rarely understood as a single coherent field.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-013',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 13: Architectural Framework',
      content: 'Stardust to Sovereignty is an integrated architectural framework that enables orientation within complexity through alignment rather than interpretation.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-014',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 14: Coherent Structural Principles',
      content: 'The technology consists of coherent structural principles that describe how intelligence organizes, stabilizes, and transmits across biological, perceptual, relational, and temporal domains.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    },
    {
      id: 'excerpt-book1-015',
      contentType: 'excerpt',
      tier: '',
      invariant: '',
      pattern: '',
      recommendedStage: ['Deepening', 'Activation'],
      source: 'Book One: The Cosmic Tapestry',
      chapter: 'Chapter 15: Structural Lawfulness',
      content: 'Consciousness is structural and lawful. Its effects are observable in perception, decision making, and relational dynamics. Perception reorganizes. Coherence stabilizes as alignment.',
      glyph: { used: false, file: '', label: '', placement: '' },
      visualMode: 'dark', // All definitions use dark background
      status: 'canonical',
      notes: '',
      hashtags: '',
      comments: '',
      firstComment: '',
      ctas: '',
      completed: false,
      postOrder: 0
    }
  ];
  
  // Filter to only include valid complete thoughts
  return allExcerpts.filter(excerpt => isValidExcerpt(excerpt.content));
}

// Assign posting order following weekly cadence:
// Monday: Gateway, Wednesday: Scrollstream, Friday: Definition/Excerpt
function assignPostOrder(allPosts) {
  // Identify fixed introductory posts by their IDs (not by postOrder, since all posts start with postOrder 0)
  const introPostIds = new Set([
    'follow-request-001',  // Post #0
    'intro-system-001',   // Post #1
    'intro-observable-001', // Post #2
    'def-s2s-001',        // Post #3
    'intro-concrete-001'  // Post #4
  ]);
  
  // Extract fixed introductory posts and sort by their intended order
  const introPosts = allPosts
    .filter(p => introPostIds.has(p.id))
    .map(p => {
      // Set the correct postOrder based on ID
      if (p.id === 'follow-request-001') p.postOrder = 0;
      else if (p.id === 'intro-system-001') p.postOrder = 1;
      else if (p.id === 'intro-observable-001') p.postOrder = 2;
      else if (p.id === 'def-s2s-001') p.postOrder = 3;
      else if (p.id === 'intro-concrete-001') p.postOrder = 4;
      return p;
    })
    .sort((a, b) => a.postOrder - b.postOrder);
  
  // Separate remaining posts by content type (exclude intro posts - get all posts NOT in introPosts)
  const gateway = allPosts.filter(p => p.contentType === 'gateway' && !introPostIds.has(p.id));
  const scrollstreams = allPosts.filter(p => p.contentType === 'scrollstream' && !introPostIds.has(p.id));
  const definitions = allPosts.filter(p => p.contentType === 'definition' && !introPostIds.has(p.id));
  const excerpts = allPosts.filter(p => p.contentType === 'excerpt' && !introPostIds.has(p.id));
  const orbPosts = allPosts.filter(p => p.contentType === 'orb-introduction' && !introPostIds.has(p.id));
  
  // Sort Gateway by stage priority (Arrival first)
  const stageOrder = { 'Arrival': 1, 'Stabilization': 2, 'Deepening': 3, 'Activation': 4 };
  gateway.sort((a, b) => {
    const aStage = Math.min(...a.recommendedStage.map(s => stageOrder[s] || 5));
    const bStage = Math.min(...b.recommendedStage.map(s => stageOrder[s] || 5));
    if (aStage !== bStage) return aStage - bStage;
    // Then by invariant, then pattern
    if (a.invariant !== b.invariant) return parseInt(a.invariant) - parseInt(b.invariant);
    return a.pattern.localeCompare(b.pattern);
  });
  
  // Sort Scrollstreams by stage priority
  scrollstreams.sort((a, b) => {
    const aStage = Math.min(...a.recommendedStage.map(s => stageOrder[s] || 5));
    const bStage = Math.min(...b.recommendedStage.map(s => stageOrder[s] || 5));
    return aStage - bStage;
  });
  
  // Sort Definitions and Excerpts by stage
  definitions.sort((a, b) => {
    const aStage = Math.min(...a.recommendedStage.map(s => stageOrder[s] || 5));
    const bStage = Math.min(...b.recommendedStage.map(s => stageOrder[s] || 5));
    return aStage - bStage;
  });
  
  // Sort Excerpts by chapter number (not stage)
  excerpts.sort((a, b) => {
    // Extract chapter number from "Chapter X: ..." format
    const getChapterNum = (excerpt) => {
      if (!excerpt.chapter) return 999; // No chapter = end
      const match = excerpt.chapter.match(/Chapter (\d+):/);
      return match ? parseInt(match[1]) : 999;
    };
    const aChapter = getChapterNum(a);
    const bChapter = getChapterNum(b);
    if (aChapter !== bChapter) return aChapter - bChapter;
    // If same chapter, then by stage
    const aStage = Math.min(...a.recommendedStage.map(s => stageOrder[s] || 5));
    const bStage = Math.min(...b.recommendedStage.map(s => stageOrder[s] || 5));
    return aStage - bStage;
  });
  
  // Start with fixed introductory posts (already have postOrder 0-4)
  const ordered = [...introPosts];
  let postOrder = 5; // Start after intro posts
  
  // Sort Orb posts by Orb number
  orbPosts.sort((a, b) => (a.orbNumber || 0) - (b.orbNumber || 0));
  
  // Interleave following weekly cadence: Mon (Gateway), Wed (Scrollstream), Fri (Def/Excerpt/Orb)
  // Orb posts: 1 every 2 weeks starting after post #15
  const orbPostInterval = 14; // Every 14 posts (2 weeks * 3 posts/week * 2 = 12, but we start at 15, so 14)
  let orbPostIndex = 0;
  let nextOrbPostAt = 16; // Start Orb posts at post #16
  
  // Calculate how many weeks we need (based on longest category)
  const maxLength = Math.max(gateway.length, scrollstreams.length, definitions.length + excerpts.length);
  const weeks = Math.ceil(maxLength / 3); // 3 posts per week
  
  let defIndex = 0;
  let excerptIndex = 0;
  
  for (let week = 0; week < weeks; week++) {
    // Monday: Gateway
    if (week < gateway.length) {
      gateway[week].postOrder = postOrder++;
      ordered.push(gateway[week]);
    }
    
    // Wednesday: Scrollstream
    if (week < scrollstreams.length) {
      scrollstreams[week].postOrder = postOrder++;
      ordered.push(scrollstreams[week]);
    }
    
    // Friday: Alternate Definition, Excerpt, or Orb
    // Insert Orb post if we've reached the interval
    if (postOrder >= nextOrbPostAt && orbPostIndex < orbPosts.length) {
      orbPosts[orbPostIndex].postOrder = postOrder++;
      ordered.push(orbPosts[orbPostIndex]);
      orbPostIndex++;
      nextOrbPostAt = postOrder + orbPostInterval; // Schedule next Orb post
    } else if (defIndex < definitions.length) {
      definitions[defIndex].postOrder = postOrder++;
      ordered.push(definitions[defIndex]);
      defIndex++;
    } else if (excerptIndex < excerpts.length) {
      excerpts[excerptIndex].postOrder = postOrder++;
      ordered.push(excerpts[excerptIndex]);
      excerptIndex++;
    }
  }
  
  // Add ALL remaining items (not just some)
  const remainingGateway = gateway.slice(weeks);
  const remainingScrollstreams = scrollstreams.slice(weeks);
  const remainingDefinitions = definitions.slice(defIndex);
  const remainingExcerpts = excerpts.slice(excerptIndex);
  
  // Add remaining in cadence order (alternate def/excerpt)
  let remainingDefIdx = 0;
  let remainingExcerptIdx = 0;
  
  // Add remaining gateway and scrollstreams first
  remainingGateway.forEach(post => {
    post.postOrder = postOrder++;
    ordered.push(post);
  });
  
  remainingScrollstreams.forEach(post => {
    post.postOrder = postOrder++;
    ordered.push(post);
  });
  
  // Alternate remaining definitions, excerpts, and Orbs
  while (remainingDefIdx < remainingDefinitions.length || 
         remainingExcerptIdx < remainingExcerpts.length || 
         orbPostIndex < orbPosts.length) {
    
    // Check if it's time for next Orb post
    if (orbPostIndex < orbPosts.length && postOrder >= nextOrbPostAt) {
      orbPosts[orbPostIndex].postOrder = postOrder++;
      ordered.push(orbPosts[orbPostIndex]);
      orbPostIndex++;
      nextOrbPostAt = postOrder + orbPostInterval;
    } else if (remainingDefIdx < remainingDefinitions.length) {
      remainingDefinitions[remainingDefIdx].postOrder = postOrder++;
      ordered.push(remainingDefinitions[remainingDefIdx]);
      remainingDefIdx++;
    } else if (remainingExcerptIdx < remainingExcerpts.length) {
      remainingExcerpts[remainingExcerptIdx].postOrder = postOrder++;
      ordered.push(remainingExcerpts[remainingExcerptIdx]);
      remainingExcerptIdx++;
    } else if (orbPostIndex < orbPosts.length) {
      // If we've exhausted defs/excerpts, add remaining Orbs
      orbPosts[orbPostIndex].postOrder = postOrder++;
      ordered.push(orbPosts[orbPostIndex]);
      orbPostIndex++;
    } else {
      break; // All done
    }
  }
  
  return ordered;
}

// Main function
function generateAllPosts() {
  console.log('🔄 Generating all posts...\n');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const allPosts = [];
  
  // Parse Gateway Statements
  if (fs.existsSync(GATEWAY_SOURCE)) {
    console.log('📝 Parsing Gateway Statements...');
    const gatewayContent = fs.readFileSync(GATEWAY_SOURCE, 'utf-8');
    const gatewayPosts = parseGatewayStatements(gatewayContent);
    allPosts.push(...gatewayPosts);
    console.log(`✅ Generated ${gatewayPosts.length} Gateway Statements\n`);
  } else {
    console.log(`⚠️  Gateway source not found: ${GATEWAY_SOURCE}\n`);
  }
  
  // Parse Scrollstreams
  if (fs.existsSync(SCROLLSTREAM_SOURCE)) {
    console.log('📝 Parsing Scrollstreams...');
    const scrollstreamContent = fs.readFileSync(SCROLLSTREAM_SOURCE, 'utf-8');
    const scrollstreamPosts = parseScrollstreams(scrollstreamContent);
    allPosts.push(...scrollstreamPosts);
    console.log(`✅ Generated ${scrollstreamPosts.length} Scrollstreams\n`);
  } else {
    console.log(`⚠️  Scrollstream source not found: ${SCROLLSTREAM_SOURCE}\n`);
  }
  
  // Create Introductory Posts (fixed posts 1-4)
  console.log('📝 Creating Introductory Posts...');
  const introPosts = createIntroductoryPosts();
  allPosts.push(...introPosts);
  console.log(`✅ Generated ${introPosts.length} Introductory Posts\n`);
  
  // Create System Definitions
  console.log('📝 Creating System Definitions...');
  const systemDefs = createSystemDefinitions();
  allPosts.push(...systemDefs);
  console.log(`✅ Generated ${systemDefs.length} System Definitions\n`);
  
  // Create Book Excerpts
  console.log('📝 Creating Book Excerpts...');
  const bookExcerpts = createBookExcerpts();
  allPosts.push(...bookExcerpts);
  console.log(`✅ Generated ${bookExcerpts.length} Book Excerpts\n`);
  
  // Parse Orb Essays for Orb-specific posts
  console.log('📝 Parsing Orb Essays...');
  const orbIntroPosts = parseOrbEssays();
  allPosts.push(...orbIntroPosts);
  console.log(`✅ Generated ${orbIntroPosts.length} Orb Introduction Posts\n`);
  
  // Remove duplicates (keep first occurrence of each ID)
  console.log('📝 Removing duplicates...');
  const seenIds = new Set();
  const uniquePosts = [];
  for (const post of allPosts) {
    if (!seenIds.has(post.id)) {
      seenIds.add(post.id);
      uniquePosts.push(post);
    }
  }
  console.log(`✅ Removed ${allPosts.length - uniquePosts.length} duplicate posts (${uniquePosts.length} unique)\n`);
  
  // Assign posting order
  console.log('📝 Assigning posting order...');
  const orderedPosts = assignPostOrder(uniquePosts);
  console.log(`✅ Assigned order to ${orderedPosts.length} posts\n`);
  
  // Split into separate files
  const gateway = orderedPosts.filter(p => p.contentType === 'gateway');
  const scrollstreams = orderedPosts.filter(p => p.contentType === 'scrollstream');
  const defs = orderedPosts.filter(p => p.contentType === 'definition');
  const excerpts = orderedPosts.filter(p => p.contentType === 'excerpt');
  const orbIntros = orderedPosts.filter(p => p.contentType === 'orb-introduction');
  
  // Write files
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'gateway.json'),
    JSON.stringify(gateway, null, 2)
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'scrollstreams.json'),
    JSON.stringify(scrollstreams, null, 2)
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'definitions.json'),
    JSON.stringify(defs, null, 2)
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'excerpts.json'),
    JSON.stringify(excerpts, null, 2)
  );
  
  // Write combined file for app
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'all-posts.json'),
    JSON.stringify(orderedPosts, null, 2)
  );
  
  // Write data-embedded.js for file:// protocol support
  const embeddedJs = `const ALL_POSTS_DATA = ${JSON.stringify(orderedPosts, null, 2)};`;
  fs.writeFileSync(
    path.join(__dirname, 'data-embedded.js'),
    embeddedJs
  );
  console.log('✅ Generated data-embedded.js\n');
  
  console.log('✨ Generation complete!');
  console.log(`📁 Files written to: ${OUTPUT_DIR}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Introductory: ${introPosts.length}`);
  console.log(`   Gateway: ${gateway.length}`);
  console.log(`   Scrollstreams: ${scrollstreams.length}`);
  console.log(`   Definitions: ${defs.length}`);
  console.log(`   Excerpts: ${excerpts.length}`);
  console.log(`   Orb Introductions: ${orbIntros.length}`);
  console.log(`   Total: ${orderedPosts.length} posts`);
}

// Run
if (require.main === module) {
  generateAllPosts();
}

module.exports = { generateAllPosts };
