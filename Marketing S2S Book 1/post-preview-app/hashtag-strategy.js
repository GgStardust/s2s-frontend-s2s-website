/**
 * Hashtag Strategy for S2S Instagram Posts
 * Implements content-specific bundles + discovery + community hashtags with rotation
 */

// Content-specific hashtag bundles
const CONTENT_BUNDLES = {
  gateway: {
    core: ['#stardusttosovereignty', '#sovereignfield', '#structuralcoherence', '#patternrecognition', '#systemsintelligence'],
    optional: ['#fieldintelligence', '#nonlinearintelligence', '#perceptionarchitecture']
  },
  scrollstream: {
    core: ['#stardusttosovereignty', '#fieldintelligence', '#nonlinearintelligence', '#livingarchitecture', '#emergentstructure'],
    optional: ['#distributedintelligence', '#signalfield']
  },
  definition: {
    core: ['#stardusttosovereignty', '#consciousnesstechnology', '#structuralcoherence', '#systemsintelligence', '#architecturalthinking'],
    optional: ['#sensemaking', '#complexsystems']
  },
  excerpt: {
    core: ['#stardusttosovereignty', '#futurehuman', '#consciousnessevolution', '#fieldintelligence', '#bookinprogress'],
    optional: ['#newparadigmthinking']
  },
  'orb-introduction': {
    core: ['#stardusttosovereignty', '#sovereignfield', '#livingarchitecture', '#systemsintelligence', '#fieldintelligence'],
    optional: ['#architecturalthinking']
  }
};

// Discovery hashtags (medium volume, broader reach)
const DISCOVERY_HASHTAGS = [
  '#consciousness',
  '#systemsthinking',
  '#philosophy',
  '#architecture',
  '#patternrecognition',
  '#consciousnessarchitecture',
  '#sovereignty',
  '#coherence',
  '#perception',
  '#systemsintelligence',
  '#fieldtheory',
  '#resonance',
  '#temporality',
  '#biologicalintelligence',
  '#cosmicconsciousness'
];

// Community hashtags (where audience gathers)
const COMMUNITY_HASHTAGS = [
  '#consciousnesscommunity',
  '#systemsthinkers',
  '#philosophycommunity',
  '#consciousnessexploration',
  '#integraltheory',
  '#nonduality',
  '#consciousnessrising'
];

// Book/Author hashtags (pre-launch and launch)
const BOOK_HASHTAGS = [
  '#bookstagram',
  '#booklover',
  '#philosophybooks',
  '#consciousnessbooks',
  '#indieauthor',
  '#selfpublished',
  '#newbook',
  '#bookcomingsoon',
  '#bookpreorder'
];

// Engagement hashtags (use sparingly, 1 max)
const ENGAGEMENT_HASHTAGS = {
  monday: '#mindfulmonday',
  wednesday: '#wisdomwednesday',
  thursday: '#thoughtfulthursday',
  friday: '#fridaythoughts'
};

// Hashtag rotation tracker (based on post order)
let rotationIndex = 0;

/**
 * Generate hashtags for a post with rotation
 */
function generateHashtags(post, postOrder = 0) {
  const bundle = CONTENT_BUNDLES[post.contentType] || CONTENT_BUNDLES.gateway;
  
  // Always include #stardusttosovereignty
  const hashtags = ['#stardusttosovereignty'];
  
  // Add 2-3 from core bundle (excluding #stardusttosovereignty)
  const coreTags = bundle.core.filter(tag => tag !== '#stardusttosovereignty');
  const selectedCore = coreTags.slice(0, 3);
  hashtags.push(...selectedCore);
  
  // Add 1 discovery hashtag (rotated)
  const discoveryIndex = (postOrder - 1) % DISCOVERY_HASHTAGS.length;
  hashtags.push(DISCOVERY_HASHTAGS[discoveryIndex]);
  
  // Add 1 community hashtag (rotated)
  const communityIndex = (postOrder - 1) % COMMUNITY_HASHTAGS.length;
  hashtags.push(COMMUNITY_HASHTAGS[communityIndex]);
  
  // For excerpts, add 1 book hashtag
  if (post.contentType === 'excerpt') {
    const bookIndex = Math.floor((postOrder - 1) / 10) % BOOK_HASHTAGS.length;
    hashtags.push(BOOK_HASHTAGS[bookIndex]);
  }
  
  // Limit to 7 hashtags total (Instagram best practice)
  return hashtags.slice(0, 7).join(' ');
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.generateHashtags = generateHashtags;
  window.getSuggestedHashtags = getSuggestedHashtags;
}

/**
 * Get suggested hashtags for manual editing
 */
function getSuggestedHashtags(post, postOrder) {
  const bundle = CONTENT_BUNDLES[post.contentType] || CONTENT_BUNDLES.gateway;
  
  return {
    core: bundle.core,
    optional: bundle.optional,
    discovery: DISCOVERY_HASHTAGS,
    community: COMMUNITY_HASHTAGS,
    book: post.contentType === 'excerpt' ? BOOK_HASHTAGS : [],
    current: generateHashtags(post, postOrder)
  };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateHashtags, getSuggestedHashtags, CONTENT_BUNDLES };
}
