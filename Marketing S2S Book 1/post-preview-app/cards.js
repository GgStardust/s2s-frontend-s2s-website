// S2S Post Preview App - Instagram-Ready Cards
// Simplified interface for screenshot workflow

// Global state
let allPosts = [];
let completedPosts = new Set();
let currentFilters = {
  stage: [],
  tier: [],
  invariant: '',
  pattern: '',
  contentType: [],
  status: []
};
let designMode = 'all';
let frameStyle = 'auto';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  await loadAllContent();
  loadCompletedState();
  loadPostNotes();
  initializeFilters();
  setupFilters();
  renderCards();
  updateStats();
});

// Initialize filter state from checkboxes
function initializeFilters() {
  currentFilters.stage = Array.from(document.querySelectorAll('input[type="checkbox"][id^="stage-"]:checked'))
    .map(cb => cb.value);
  currentFilters.tier = Array.from(document.querySelectorAll('input[type="checkbox"][id^="tier-"]:checked'))
    .map(cb => cb.value);
  currentFilters.contentType = Array.from(document.querySelectorAll('input[type="checkbox"][id^="type-"]:checked'))
    .map(cb => cb.value);
  currentFilters.status = Array.from(document.querySelectorAll('input[type="checkbox"][id^="status-"]:checked'))
    .map(cb => cb.value);
  currentFilters.invariant = document.getElementById('filter-invariant').value;
  currentFilters.pattern = document.getElementById('filter-pattern').value;
}

// Load template for a post
function loadTemplate(postId) {
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;
  
  if (typeof formatTemplateForEditor !== 'undefined') {
    const template = formatTemplateForEditor(post);
    // Generate hashtags
    if (typeof generateHashtags !== 'undefined') {
      const hashtags = generateHashtags(post, post.postOrder || 0);
      const filledTemplate = template.replace('[Auto-generated hashtags will appear here]', hashtags);
      document.getElementById(`editor-${postId}`).value = filledTemplate;
    } else {
      document.getElementById(`editor-${postId}`).value = template;
    }
  }
}

// Generate hashtags for a post
function generateHashtagsForPost(postId) {
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;
  
  if (typeof generateHashtags !== 'undefined') {
    const hashtags = generateHashtags(post, post.postOrder || 0);
    const textarea = document.getElementById(`editor-${postId}`);
    const currentValue = textarea.value;
    
    // Replace HASHTAGS section or add it
    if (currentValue.includes('HASHTAGS:')) {
      const lines = currentValue.split('\n');
      const hashtagIndex = lines.findIndex(line => line.startsWith('HASHTAGS:'));
      if (hashtagIndex !== -1) {
        lines[hashtagIndex + 1] = hashtags;
        textarea.value = lines.join('\n');
      }
    } else {
      textarea.value = currentValue + (currentValue ? '\n\n' : '') + `HASHTAGS:\n${hashtags}`;
    }
  }
}

// Make functions available globally
window.savePostNotes = savePostNotes;
window.toggleEditor = toggleEditor;
window.loadTemplate = loadTemplate;
window.generateHashtagsForPost = generateHashtagsForPost;

// Load all content
async function loadAllContent() {
  const isFileProtocol = window.location.protocol === 'file:';
  
  if (isFileProtocol) {
    // Use embedded data for file:// protocol
    console.log('Using embedded data (file:// protocol)');
    allPosts = typeof ALL_POSTS_DATA !== 'undefined' ? ALL_POSTS_DATA : [];
    console.log(`Loaded ${allPosts.length} posts from embedded data`);
  } else {
    // Try to fetch from server
    try {
      const response = await fetch('data/all-posts.json');
      allPosts = await response.json();
      console.log(`Loaded ${allPosts.length} posts from server`);
    } catch (error) {
      // Fallback to embedded data
      console.error('Error loading from server:', error);
      allPosts = typeof ALL_POSTS_DATA !== 'undefined' ? ALL_POSTS_DATA : [];
      console.log(`Using embedded data as fallback (${allPosts.length} posts)`);
    }
  }
  
  // Sort by postOrder
  allPosts.sort((a, b) => (a.postOrder || 999) - (b.postOrder || 999));
}

// Load completed state from localStorage
function loadCompletedState() {
  const saved = localStorage.getItem('completedPosts');
  if (saved) {
    completedPosts = new Set(JSON.parse(saved));
  }
}

// Save completed state to localStorage
function saveCompletedState() {
  localStorage.setItem('completedPosts', JSON.stringify(Array.from(completedPosts)));
}

// Setup filter event listeners
function setupFilters() {
  // Stage filter
  document.querySelectorAll('input[type="checkbox"][id^="stage-"]').forEach(cb => {
    cb.addEventListener('change', () => {
      currentFilters.stage = Array.from(document.querySelectorAll('input[type="checkbox"][id^="stage-"]:checked'))
        .map(cb => cb.value);
      renderCards();
      updateStats();
    });
  });
  
  // Tier filter
  document.querySelectorAll('input[type="checkbox"][id^="tier-"]').forEach(cb => {
    cb.addEventListener('change', () => {
      currentFilters.tier = Array.from(document.querySelectorAll('input[type="checkbox"][id^="tier-"]:checked'))
        .map(cb => cb.value);
      renderCards();
      updateStats();
    });
  });
  
  // Invariant filter
  document.getElementById('filter-invariant').addEventListener('change', (e) => {
    currentFilters.invariant = e.target.value;
    renderCards();
    updateStats();
  });
  
  // Pattern filter
  document.getElementById('filter-pattern').addEventListener('change', (e) => {
    currentFilters.pattern = e.target.value;
    renderCards();
    updateStats();
  });
  
  // Content type filter
  document.querySelectorAll('input[type="checkbox"][id^="type-"]').forEach(cb => {
    cb.addEventListener('change', () => {
      currentFilters.contentType = Array.from(document.querySelectorAll('input[type="checkbox"][id^="type-"]:checked'))
        .map(cb => cb.value);
      renderCards();
      updateStats();
    });
  });
  
  // Status filter
  document.querySelectorAll('input[type="checkbox"][id^="status-"]').forEach(cb => {
    cb.addEventListener('change', () => {
      currentFilters.status = Array.from(document.querySelectorAll('input[type="checkbox"][id^="status-"]:checked'))
        .map(cb => cb.value);
      renderCards();
      updateStats();
    });
  });
  
  // Design mode filter
  document.getElementById('design-mode').addEventListener('change', (e) => {
    designMode = e.target.value;
    renderCards();
    updateStats();
  });
  
  // Frame style toggle
  document.getElementById('frame-style').addEventListener('change', (e) => {
    frameStyle = e.target.value;
    renderCards();
  });
  
  // Clear filters
  document.getElementById('clear-filters').addEventListener('click', () => {
    // Reset all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (cb.id.startsWith('stage-')) {
        cb.checked = false;
      } else if (cb.id.startsWith('tier-')) {
        cb.checked = false;
      } else if (cb.id.startsWith('type-')) {
        cb.checked = true; // Show all content types
      } else if (cb.id.startsWith('status-')) {
        cb.checked = (cb.id === 'status-canonical' || cb.id === 'status-generated');
      }
    });
    
    // Reset selects
    document.getElementById('filter-invariant').value = '';
    document.getElementById('filter-pattern').value = '';
    document.getElementById('design-mode').value = 'all';
    document.getElementById('frame-style').value = 'auto';
    
    // Re-initialize filters from checkboxes
    initializeFilters();
    
    // Reset global state
    designMode = 'all';
    frameStyle = 'auto';
    
    renderCards();
    updateStats();
  });
}

// Filter posts
function filterPosts() {
  return allPosts.filter(post => {
    // Design mode filter
    if (designMode === 'light' && post.visualMode !== 'light') return false;
    if (designMode === 'dark' && post.visualMode !== 'dark') return false;
    
    // Stage filter
    if (currentFilters.stage.length > 0) {
      const hasMatchingStage = post.recommendedStage?.some(stage => 
        currentFilters.stage.includes(stage)
      );
      if (!hasMatchingStage) return false;
    }
    
    // Tier filter (allow empty tier if no tier filters selected, or if tier matches)
    if (currentFilters.tier.length > 0) {
      // If post has no tier and no empty tier is selected, filter it out
      // But if tier filter includes empty string or post tier matches, allow it
      const postTier = post.tier || '';
      if (!currentFilters.tier.includes(postTier)) return false;
    }
    
    // Invariant filter
    if (currentFilters.invariant && post.invariant !== currentFilters.invariant) {
      return false;
    }
    
    // Pattern filter
    if (currentFilters.pattern && post.pattern !== currentFilters.pattern) {
      return false;
    }
    
    // Content type filter
    if (currentFilters.contentType.length > 0) {
      if (!currentFilters.contentType.includes(post.contentType)) return false;
    }
    
    // Status filter
    if (currentFilters.status.length > 0) {
      if (!currentFilters.status.includes(post.status)) return false;
    }
    
    return true;
  });
}

// Render cards with sections
function renderCards() {
  const grid = document.getElementById('card-grid');
  const emptyState = document.getElementById('empty-state');
  const filteredPosts = filterPosts();
  
  if (filteredPosts.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  
  // Group posts by week for sections
  const postsByWeek = {};
  filteredPosts.forEach(post => {
    const { week } = getWeekBatch(post.postOrder || 0);
    if (!postsByWeek[week]) {
      postsByWeek[week] = [];
    }
    postsByWeek[week].push(post);
  });
  
  // Render with section headers
  const weeks = Object.keys(postsByWeek).sort((a, b) => parseInt(a) - parseInt(b));
  let html = '';
  
  weeks.forEach(week => {
    const weekPosts = postsByWeek[week].sort((a, b) => (a.postOrder || 0) - (b.postOrder || 0));
    html += `<div class="week-section" data-week="${week}">`;
    html += `<h3 class="section-header">Week ${week}</h3>`;
    html += weekPosts.map(post => renderCard(post)).join('');
    html += `</div>`;
  });
  
  grid.innerHTML = html;
  
  // Attach completion checkbox handlers
  document.querySelectorAll('.card-complete-checkbox input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const postId = e.target.dataset.postId;
      if (e.target.checked) {
        completedPosts.add(postId);
      } else {
        completedPosts.delete(postId);
      }
      saveCompletedState();
      updateStats();
      // Update card visual state
      const card = e.target.closest('.card-container').querySelector('.post-card');
      if (e.target.checked) {
        card.classList.add('completed');
      } else {
        card.classList.remove('completed');
      }
    });
  });
}

// Format editor content for display
function formatEditorContent(post) {
  // If no notes exist, populate with template
  if (!post.notes && !post.hashtags && typeof formatTemplateForEditor !== 'undefined') {
    const template = formatTemplateForEditor(post);
    // Generate hashtags if available
    if (typeof generateHashtags !== 'undefined') {
      const hashtags = generateHashtags(post, post.postOrder || 0);
      return template.replace('[Auto-generated hashtags will appear here]', hashtags);
    }
    return template;
  }
  
  const parts = [];
  if (post.notes) parts.push(`NOTES:\n${post.notes}`);
  if (post.firstComment) parts.push(`\nFIRST COMMENT:\n${post.firstComment}`);
  if (post.hashtags) parts.push(`\nHASHTAGS:\n${post.hashtags}`);
  if (post.cta) parts.push(`\nCTA:\n${post.cta.text || post.cta}`);
  if (post.seoText || post.instagramCaption) parts.push(`\nINSTAGRAM CAPTION:\n${post.instagramCaption || post.seoText}`);
  return parts.join('\n\n');
}

// Toggle editor collapse
function toggleEditor(postId) {
  const editor = document.querySelector(`.card-editor[data-post-id="${postId}"]`);
  if (editor) {
    editor.classList.toggle('collapsed');
  }
}

// Save post notes (parse from single textarea)
function savePostNotes(postId) {
  // Find post and update
  const post = allPosts.find(p => p.id === postId);
  if (post) {
    const textarea = document.getElementById(`editor-${postId}`);
    const content = textarea ? textarea.value : '';
    
    // Parse content by sections (simple parsing)
    const sections = {
      notes: '',
      firstComment: '',
      hashtags: '',
      cta: '',
      instagramCaption: ''
    };
    
    const lines = content.split('\n');
    let currentSection = 'notes';
    let currentContent = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect section headers
      if (line.toUpperCase().startsWith('NOTES:')) {
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = 'notes';
        currentContent = [];
      } else if (line.toUpperCase().startsWith('FIRST COMMENT:')) {
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = 'firstComment';
        currentContent = [];
      } else if (line.toUpperCase().startsWith('HASHTAGS:')) {
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = 'hashtags';
        currentContent = [];
      } else if (line.toUpperCase().startsWith('CTA:')) {
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = 'cta';
        currentContent = [];
      } else if (line.toUpperCase().startsWith('INSTAGRAM CAPTION:') || line.toUpperCase().includes('SEO') || line.toUpperCase().includes('BUFFER CAPTION')) {
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = 'instagramCaption';
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }
    
    // Save last section
    if (currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n').trim();
    }
    
    // Update post
      post.notes = sections.notes;
      post.firstComment = sections.firstComment;
      post.hashtags = sections.hashtags;
      post.instagramCaption = sections.instagramCaption || sections.seoText || '';
    // CTA can be string or object
    if (sections.cta) {
      post.cta = typeof sections.cta === 'string' ? { text: sections.cta } : sections.cta;
    }
    
    // Save to localStorage
    const savedNotes = JSON.parse(localStorage.getItem('postNotes') || '{}');
    savedNotes[postId] = {
      notes: post.notes,
      firstComment: post.firstComment,
      hashtags: post.hashtags,
      cta: post.cta,
      instagramCaption: post.instagramCaption
    };
    localStorage.setItem('postNotes', JSON.stringify(savedNotes));
    
    // Show feedback
    const button = document.querySelector(`[data-post-id="${postId}"][onclick*="savePostNotes"]`);
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Saved!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    }
  }
}

// Load post notes from localStorage
function loadPostNotes() {
  const savedNotes = JSON.parse(localStorage.getItem('postNotes') || '{}');
  allPosts.forEach(post => {
    if (savedNotes[post.id]) {
      post.notes = savedNotes[post.id].notes || '';
      post.firstComment = savedNotes[post.id].firstComment || '';
      post.hashtags = savedNotes[post.id].hashtags || '';
      post.cta = savedNotes[post.id].cta || null;
      post.instagramCaption = savedNotes[post.id].instagramCaption || savedNotes[post.id].seoText || '';
    }
  });
}

// Calculate week/batch from post order (3 posts per week)
function getWeekBatch(postOrder) {
  const week = Math.ceil(postOrder / 3);
  const batch = Math.ceil(week / 4); // 4 weeks per batch
  return { week, batch };
}

// Render a single card
function renderCard(post) {
  const isCompleted = completedPosts.has(post.id);
  const visualMode = post.visualMode || 'light';
  const { week, batch } = getWeekBatch(post.postOrder || 0);
  const frameStyle = getFrameStyle(post.contentType);
  // Editor content will be formatted by formatEditorContent
  
  return `
    <div class="card-container" data-post-id="${post.id}">
      <!-- Metadata (outside card) -->
      <div class="card-metadata">
        <div class="card-order-info">
          <span>#${post.postOrder || 0}</span>
          <span>•</span>
          <span>Week ${week}</span>
        </div>
        <div class="card-complete-checkbox">
          <input type="checkbox" 
                 id="complete-${post.id}"
                 data-post-id="${post.id}"
                 ${isCompleted ? 'checked' : ''}>
          <label for="complete-${post.id}">Posted</label>
        </div>
      </div>
      
      <!-- Card Preview - Shows generated PNG image -->
      <div class="post-card ${isCompleted ? 'completed' : ''}">
        <img 
          src="generated-images/post-${String(post.postOrder || 0).padStart(3, '0')}-${post.id}.png" 
          alt="Post ${post.postOrder}: ${post.contentType}"
          class="card-image"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <!-- Fallback if image doesn't exist -->
        <div class="card-fallback" style="display: none;">
          <div class="card-preview ${visualMode}-field">
            <div class="card-content ${getContentTypeClass(post.contentType)}">
              ${renderCardContent(post)}
              ${post.cta ? renderCTA(post.cta) : ''}
            </div>
            ${post.contentType === 'gateway' ? '<div class="terminator-line"></div>' : ''}
          </div>
        </div>
      </div>
      
      <!-- Editor Section (below card) - Collapsible -->
      <div class="card-editor collapsed" data-post-id="${post.id}">
        <div class="card-editor-header" onclick="toggleEditor('${post.id}')">
          <h4>Notes & Posting Info</h4>
          <span class="card-editor-toggle">▼</span>
        </div>
        <div class="card-editor-content">
          <textarea 
            id="editor-${post.id}"
            data-post-id="${post.id}"
            placeholder="NOTES:\nInternal notes, reminders...\n\nFIRST COMMENT:\nFirst comment to post with image...\n\nHASHTAGS:\n#stardusttosovereignty #consciousness...\n\nCTA:\nRead more | Enter the system | Book 1 available 2.28.26\n\nINSTAGRAM CAPTION:\nCaption text for Instagram post...">${formatEditorContent(post)}</textarea>
          <div class="card-editor-actions" style="display: flex; gap: 8px; margin-top: 8px;">
            <button type="button" data-post-id="${post.id}" onclick="savePostNotes('${post.id}')" style="flex: 1; padding: 6px 12px; background-color: var(--accent-cyan); border: none; border-radius: 4px; color: var(--cosmic-blue); font-weight: 600; cursor: pointer;">
              Save
            </button>
            <button type="button" onclick="loadTemplate('${post.id}')" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: var(--stone-300); padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
              Load Template
            </button>
            <button type="button" onclick="generateHashtagsForPost('${post.id}')" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: var(--stone-300); padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
              Generate Hashtags
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Get frame style based on content type or user selection
function getFrameStyle(contentType) {
  if (frameStyle === 'none') return '';
  if (frameStyle !== 'auto') return frameStyle;
  
  // Auto mode - based on content type
  switch (contentType) {
    case 'gateway':
      return 'framed';
    case 'scrollstream':
      return 'boxed';
    case 'definition':
      return 'framed-thick';
    case 'excerpt':
      return 'boxed';
    case 'orb-introduction':
      return 'framed-thick';
    default:
      return '';
  }
}

// Render card content based on type
function renderCardContent(post) {
  switch (post.contentType) {
    case 'gateway':
      return renderGatewayContent(post);
    case 'scrollstream':
      return renderScrollstreamContent(post);
    case 'definition':
      return renderDefinitionContent(post);
    case 'excerpt':
      return renderExcerptContent(post);
    case 'orb-introduction':
      return renderOrbIntroductionContent(post);
    default:
      return '<p>Unknown content type</p>';
  }
}

// Render Gateway Statement (4-line format)
function renderGatewayContent(post) {
  const lines = post.lines || [];
  return `
    <div class="gateway-statement">
      ${lines.map((line, idx) => 
        `<div class="line line-${idx + 1}">${escapeHtml(line)}</div>`
      ).join('')}
    </div>
  `;
}

// Render Scrollstream fragment (ticker-style, with attribution)
function renderScrollstreamContent(post) {
  const content = post.content || '';
  return `
    <div class="scrollstream-text">${escapeHtml(content)}</div>
    <div class="scrollstream-attribution">Stardust to Sovereignty™</div>
  `;
}

// Render System Definition
function renderDefinitionContent(post) {
  const title = post.title || '';
  const body = post.content || '';
  return `
    ${title ? `<div class="definition-title">${escapeHtml(title)}</div>` : ''}
    <div class="definition-body">${escapeHtml(body)}</div>
  `;
}

// Render Book Excerpt
function renderExcerptContent(post) {
  const source = post.source || 'Book One';
  const chapter = post.chapter || '';
  const content = post.content || '';
  return `
    <div class="excerpt-source">${escapeHtml(source)}</div>
    ${chapter ? `<div class="excerpt-chapter">${escapeHtml(chapter)}</div>` : ''}
    <div class="excerpt-text">${escapeHtml(content)}</div>
  `;
}

// Render Orb Introduction
function renderOrbIntroductionContent(post) {
  const title = post.title || '';
  const content = post.content || '';
  return `
    <div class="orb-introduction-title">${escapeHtml(title)}</div>
    <div class="orb-introduction-content">${escapeHtml(content)}</div>
  `;
}

// Glyph rendering removed - glyphs no longer displayed on cards

// Get content type class for styling
function getContentTypeClass(contentType) {
  switch (contentType) {
    case 'gateway':
      return 'gateway-content';
    case 'scrollstream':
      return 'scrollstream-content';
    case 'definition':
      return 'definition-content';
    case 'excerpt':
      return 'excerpt-content';
    case 'orb-introduction':
      return 'orb-introduction-content';
    default:
      return '';
  }
}

// Render CTA
function renderCTA(cta) {
  if (!cta || !cta.text) return '';
  return `
    <div class="card-cta">
      ${escapeHtml(cta.text)}
    </div>
  `;
}

// Glyph-related functions removed - glyphs no longer displayed on cards

// Update stats
function updateStats() {
  const filtered = filterPosts();
  const completed = filtered.filter(p => completedPosts.has(p.id)).length;
  document.getElementById('stats').textContent = 
    `${filtered.length} posts • ${completed} completed`;
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
