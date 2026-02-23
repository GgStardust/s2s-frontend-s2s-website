/**
 * Marketing Templates for S2S Instagram Posts
 * Provides note/CTA templates for each post type
 */

const MARKETING_TEMPLATES = {
  gateway: {
    notes: `Context: Gateway statements introduce perception shifts and structural conditions without explanation. They function as pattern mirrors.

Posting Strategy:
- No CTA needed (too early in journey)
- Focus on recognition, not instruction
- Let the question land without follow-up

Engagement Notes:
- Respond to structural questions only
- Avoid personal advice requests
- Redirect to website/Console if ready for depth`,
    
    firstComment: `What patterns do you already recognize?`,
    
    cta: null, // No CTA for gateway posts
    
    instagramCaption: `Gateway statements open inquiry through pattern recognition. They name structural conditions without explanation, enabling recognition without instruction.`
  },
  
  scrollstream: {
    notes: `Context: Scrollstreams are pure signal transmission - poetic fragments that function as felt resonance.

Posting Strategy:
- No framing or explanation
- Let the signal land
- Minimal engagement (signal speaks for itself)

Engagement Notes:
- These are transmission posts - less engagement expected
- If someone resonates, they may DM or visit website
- No need to over-explain`,
    
    firstComment: null, // Let signal stand alone
    
    cta: null, // No CTA for scrollstreams
    
    instagramCaption: `Scrollstream fragments transmit pure signal. They function as felt resonance without framing or explanation.`
  },
  
  definition: {
    notes: `Context: Definitions offer structural clarity and reframe familiar concepts. They provide legibility without instruction.

Posting Strategy:
- These establish authority and clarity
- Good for engagement (people like definitions)
- Can include subtle CTA if appropriate

Engagement Notes:
- Respond to clarification questions
- Share related concepts if asked
- Direct to website for deeper exploration`,
    
    firstComment: `How does this definition land for you?`,
    
    cta: `Explore the full system → Link in bio`,
    
    instagramCaption: `Structural definitions reframe familiar concepts through architectural clarity. They provide legibility without instruction, enabling orientation within complexity.`
  },
  
  excerpt: {
    notes: `Context: Book excerpts carry more density and mark deepening. They signal the book without direct promotion.

Posting Strategy:
- These build anticipation for the book
- Include book title and chapter info
- Subtle CTA about book availability

Engagement Notes:
- Respond to questions about the book
- Share release date (2/28/26) when asked
- Direct to preorder/website when ready`,
    
    firstComment: `From Book One: The Cosmic Tapestry. Preorder ships February 28, 2026.`,
    
    cta: `Book One: The Cosmic Tapestry available 2.28.26 → Link in bio`,
    
    instagramCaption: `Excerpt from Book One: The Cosmic Tapestry, the first volume in the Stardust to Sovereignty system. Preorder ships February 28, 2026.`
  },
  
  'orb-introduction': {
    notes: `Context: Orb introductions mark system waypoints and thresholds. They function as structural markers.

Posting Strategy:
- These are system architecture posts
- Frame as functions, not concepts
- Can include CTA to explore system further

Engagement Notes:
- Respond to system architecture questions
- Explain how Orbs function (not what they mean)
- Direct to Console for interactive exploration`,
    
    firstComment: `This Orb functions as [specific function]. How does this architectural element land for you?`,
    
    cta: `Explore the full 13-Orb system → Link in bio`,
    
    instagramCaption: `Orb introductions mark waypoints in the Stardust to Sovereignty system architecture. Each Orb functions as a structural domain organizing consciousness, time, and intelligence.`
  }
};

/**
 * Get marketing template for a post
 */
function getMarketingTemplate(post) {
  const template = MARKETING_TEMPLATES[post.contentType] || MARKETING_TEMPLATES.gateway;
  
  // Customize first comment for Orb posts
  if (post.contentType === 'orb-introduction' && post.orbName) {
    return {
      ...template,
      firstComment: `Orb ${post.orbNumber || ''}: ${post.orbName}™ functions as [specific function from content]. How does this architectural element land for you?`
    };
  }
  
  return template;
}

/**
 * Format template for editor textarea
 */
function formatTemplateForEditor(post) {
  const template = getMarketingTemplate(post);
  
  let text = 'NOTES:\n';
  text += template.notes;
  
  if (template.firstComment) {
    text += '\n\nFIRST COMMENT:\n';
    text += template.firstComment;
  }
  
  // Hashtags will be generated separately
  text += '\n\nHASHTAGS:\n';
  text += '[Auto-generated hashtags will appear here]';
  
  if (template.cta) {
    text += '\n\nCTA:\n';
    text += template.cta;
  }
  
  text += '\n\nINSTAGRAM CAPTION:\n';
  text += template.instagramCaption;
  
  return text;
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.MARKETING_TEMPLATES = MARKETING_TEMPLATES;
  window.getMarketingTemplate = getMarketingTemplate;
  window.formatTemplateForEditor = formatTemplateForEditor;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MARKETING_TEMPLATES, getMarketingTemplate, formatTemplateForEditor };
}
