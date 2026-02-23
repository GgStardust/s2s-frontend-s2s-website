#!/usr/bin/env node
/**
 * Generate Instagram-ready card images from post data
 * Uses Puppeteer to render cards and export as 1080x1350 PNG images (4:5 ratio)
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const POSTS_DATA_PATH = path.join(__dirname, 'data/all-posts.json');
const OUTPUT_IMAGES_DIR = path.join(__dirname, 'generated-images');
const HTML_TEMPLATE = path.join(__dirname, 'card-render-template.html');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_IMAGES_DIR)) {
  fs.mkdirSync(OUTPUT_IMAGES_DIR, { recursive: true });
}

// Load post data
function loadPosts() {
  const data = fs.readFileSync(POSTS_DATA_PATH, 'utf-8');
  return JSON.parse(data).sort((a, b) => (a.postOrder || 999) - (b.postOrder || 999));
}

// Add trademark symbol to first occurrence of "Stardust to Sovereignty"
function addTrademark(text) {
  // Replace first occurrence only
  return text.replace(/\bStardust to Sovereignty\b(?!™)/, 'Stardust to Sovereignty™');
}

// Format book title with italics (using * for Instagram)
function formatBookTitle(text) {
  return text.replace(/Book One: The Cosmic Tapestry/g, '*Book One: The Cosmic Tapestry*');
}

// Add trademark to Orb names
function addOrbTrademark(text, orbName) {
  if (orbName) {
    // Replace Orb name with trademarked version
    const orbPattern = new RegExp(`\\b${orbName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b(?!™)`, 'g');
    text = text.replace(orbPattern, `${orbName}™`);
  }
  return text;
}

// Import hashtag strategy (if available, otherwise use fallback)
let hashtagStrategy;
try {
  hashtagStrategy = require('./hashtag-strategy.js');
} catch (e) {
  // Fallback for browser environment
  hashtagStrategy = null;
}

// Generate hashtags based on content type with rotation
function generateHashtags(post) {
  // Use strategy if available
  if (hashtagStrategy && typeof hashtagStrategy.generateHashtags === 'function') {
    return hashtagStrategy.generateHashtags(post, post.postOrder || 0);
  }
  
  // Fallback: Simple generation
  const bundle = {
    gateway: ['#stardusttosovereignty', '#sovereignfield', '#structuralcoherence', '#patternrecognition', '#systemsintelligence'],
    scrollstream: ['#stardusttosovereignty', '#fieldintelligence', '#nonlinearintelligence', '#livingarchitecture', '#emergentstructure'],
    definition: ['#stardusttosovereignty', '#consciousnesstechnology', '#structuralcoherence', '#systemsintelligence', '#architecturalthinking'],
    excerpt: ['#stardusttosovereignty', '#futurehuman', '#consciousnessevolution', '#fieldintelligence', '#bookinprogress'],
    'orb-introduction': ['#stardusttosovereignty', '#sovereignfield', '#livingarchitecture', '#systemsintelligence', '#fieldintelligence']
  };
  
  const baseTags = bundle[post.contentType] || bundle.gateway;
  const postOrder = post.postOrder || 0;
  
  // Add discovery hashtag (rotated)
  const discovery = ['#consciousness', '#systemsthinking', '#philosophy', '#architecture', '#patternrecognition'];
  const discoveryTag = discovery[postOrder % discovery.length];
  
  // Add community hashtag (rotated)
  const community = ['#consciousnesscommunity', '#systemsthinkers', '#philosophycommunity'];
  const communityTag = community[postOrder % community.length];
  
  // For excerpts, add book hashtag
  let bookTag = '';
  if (post.contentType === 'excerpt') {
    const bookTags = ['#bookstagram', '#philosophybooks', '#booklover'];
    bookTag = bookTags[Math.floor(postOrder / 10) % bookTags.length];
  }
  
  const allTags = [...baseTags.slice(0, 4), discoveryTag, communityTag];
  if (bookTag) allTags.push(bookTag);
  
  return allTags.slice(0, 7).join(' ');
}

// Format post content for Instagram with trademark and formatting
function formatPostText(post) {
  let text = '';
  let orbName = null;
  
  switch (post.contentType) {
    case 'gateway':
      text = (post.lines || []).join('\n');
      break;
    case 'scrollstream':
      text = post.content || '';
      break;
    case 'definition':
      text = `${post.title || ''}\n\n${post.content || ''}`.trim();
      break;
    case 'excerpt':
      const source = post.source || 'Book One';
      const chapter = post.chapter ? ` • ${post.chapter}` : '';
      text = `${source}${chapter}\n\n${post.content || ''}`;
      // Format book title
      text = formatBookTitle(text);
      break;
    case 'orb-introduction':
      text = `${post.title || ''}\n\n${post.content || ''}`.trim();
      orbName = post.orbName || null;
      // Add trademark to Orb name in title
      if (orbName && post.title) {
        text = text.replace(new RegExp(`\\b${orbName}\\b(?!™)`, 'g'), `${orbName}™`);
      }
      break;
    default:
      text = post.content || '';
  }
  
  // Add trademark to "Stardust to Sovereignty" on first use (skip for gateway posts and post #3)
  if (post.contentType !== 'gateway' && post.postOrder !== 3) {
    text = addTrademark(text);
  }
  
  // Add trademark to Orb name in content if it's an Orb post
  if (orbName) {
    text = addOrbTrademark(text, orbName);
  }
  
  return text;
}

// Create HTML template for rendering a single card
function createCardHTML(post) {
  const visualMode = post.visualMode || 'light';
  const isDark = visualMode === 'dark';
  
  // Format content based on type
  let cardContent = '';
  switch (post.contentType) {
    case 'gateway':
      const lines = post.lines || [];
      cardContent = `
        <div class="gateway-statement">
          ${lines.map((line, idx) => 
            `<div class="line line-${idx + 1}">${escapeHtml(line)}</div>`
          ).join('')}
        </div>
        <div class="terminator-line"></div>
      `;
      break;
    case 'scrollstream':
      cardContent = `
        <div class="scrollstream-text">${escapeHtml(post.content || '')}</div>
        <div class="scrollstream-attribution">Stardust to Sovereignty™</div>
      `;
      break;
    case 'definition':
      // Add trademark to "Stardust to Sovereignty" in title and content (skip for post #3)
      let defTitle = post.title || '';
      let defContent = post.content || '';
      if (post.postOrder !== 3) {
        defTitle = defTitle.replace(/\bStardust to Sovereignty\b(?!™)/, 'Stardust to Sovereignty™');
        defContent = defContent.replace(/\bStardust to Sovereignty\b(?!™)/, 'Stardust to Sovereignty™');
      }
      cardContent = `
        ${defTitle ? `<div class="definition-title">${escapeHtml(defTitle)}</div>` : ''}
        <div class="definition-body">${escapeHtml(defContent)}</div>
      `;
      break;
    case 'excerpt':
      const source = post.source || 'Book One';
      const chapter = post.chapter || '';
      // Format book title with italics in HTML
      let formattedSource = escapeHtml(source);
      if (source.includes('Book One: The Cosmic Tapestry')) {
        formattedSource = formattedSource.replace(/Book One: The Cosmic Tapestry/g, '<em>Book One: The Cosmic Tapestry</em>');
      }
      cardContent = `
        <div class="excerpt-source">${formattedSource}</div>
        ${chapter ? `<div class="excerpt-chapter">${escapeHtml(chapter)}</div>` : ''}
        <div class="excerpt-text">${escapeHtml(post.content || '')}</div>
      `;
      break;
    case 'orb-introduction':
      // Add trademark to Orb name in title
      let orbTitle = post.title || '';
      if (post.orbName) {
        orbTitle = orbTitle.replace(new RegExp(`\\b${post.orbName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b(?!™)`, 'g'), `${post.orbName}™`);
      }
      let orbContent = post.content || '';
      if (post.orbName) {
        orbContent = orbContent.replace(new RegExp(`\\b${post.orbName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b(?!™)`, 'g'), `${post.orbName}™`);
      }
      cardContent = `
        <div class="orb-introduction-title">${escapeHtml(orbTitle)}</div>
        <div class="orb-introduction-content">${escapeHtml(orbContent)}</div>
      `;
      break;
  }
  
  // Get content type class
  const contentTypeClass = {
    'gateway': 'gateway-content',
    'scrollstream': 'scrollstream-content',
    'definition': 'definition-content',
    'excerpt': 'excerpt-content',
    'orb-introduction': 'orb-introduction-content'
  }[post.contentType] || '';
  
  // Get frame style
  const frameStyle = {
    'gateway': 'framed',
    'scrollstream': 'boxed',
    'definition': 'framed-thick',
    'excerpt': 'boxed',
    'orb-introduction': 'framed-thick'
  }[post.contentType] || '';
  
  const cssContent = fs.readFileSync(path.join(__dirname, 'cards.css'), 'utf-8');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Card ${post.postOrder}</title>
  <style>
    ${cssContent}
    
    /* Override for single card rendering - exact 1080x1080 */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      width: 1080px;
      height: 1350px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #0A0E27;
    }
    
    body {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .post-card {
      margin: 0 !important;
      box-shadow: none !important;
      width: 1080px !important;
      height: 1350px !important;
      max-width: 1080px !important;
      max-height: 1350px !important;
      flex-shrink: 0;
      border-radius: 0;
    }
    
    .card-preview {
      width: 100% !important;
      height: 100% !important;
    }
  </style>
</head>
<body>
  <div class="post-card ${frameStyle} ${isDark ? 'dark-field' : 'light-field'}" data-post-order="${post.postOrder || 0}">
    <div class="card-preview ${visualMode}-field">
      <div class="card-content ${contentTypeClass}">
        ${cardContent}
      </div>
      ${post.contentType === 'gateway' ? '<div class="terminator-line"></div>' : ''}
    </div>
  </div>
</body>
</html>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Generate images for all posts
async function generateImages(limit = null) {
  console.log('🖼️  Generating card images...\n');
  
  let posts = loadPosts();
  const totalPosts = posts.length;
  
  // Limit posts if specified (for testing)
  if (limit) {
    posts = posts.filter(p => p.postOrder && p.postOrder <= limit);
    console.log(`📝 Loaded ${totalPosts} total posts, generating first ${limit} posts for testing\n`);
  } else {
    console.log(`📝 Loaded ${totalPosts} posts\n`);
  }
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  // Set viewport to 1080x1350 for Instagram 4:5 portrait format (2x for retina quality)
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
  
  const results = [];
  
  for (const post of posts) {
    if (!post.postOrder) continue;
    
    try {
      // Check if page is closed and recreate if needed
      try {
        await page.url(); // Test if page is still valid
      } catch (e) {
        console.log(`⚠️  Page closed, recreating...`);
        page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
      }
      
      const html = createCardHTML(post);
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Wait for fonts and styles to fully render
      await page.waitForTimeout(1000);
      
      const filename = `post-${String(post.postOrder).padStart(3, '0')}-${post.id}.png`;
      const filepath = path.join(OUTPUT_IMAGES_DIR, filename);
      
      // Take screenshot of the entire page (exactly 1080x1350 for 4:5 ratio)
      await page.screenshot({
        path: filepath,
        type: 'png',
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: 1080,
          height: 1350
        }
      });
      
      // Generate hashtags automatically with rotation
      const generatedHashtags = generateHashtags(post);
      
      results.push({
        postOrder: post.postOrder,
        id: post.id,
        filename: filename,
        filepath: filepath,
        contentType: post.contentType,
        text: formatPostText(post),
        hashtags: generatedHashtags,
        tags: generatedHashtags, // For Buffer CSV
        orbName: post.orbName || null
      });
      
      console.log(`✅ Generated: ${filename} (Post #${post.postOrder})`);
    } catch (error) {
      console.error(`❌ Error generating image for post #${post.postOrder}:`, error.message);
      // Try to recover by recreating the page
      try {
        page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
      } catch (recoverError) {
        console.error(`❌ Could not recover page, continuing...`);
      }
    }
  }
  
  await browser.close();
  
  console.log(`\n✨ Generated ${results.length} images in ${OUTPUT_IMAGES_DIR}\n`);
  
  // Generate Buffer CSV
  generateBufferCSV(results);
  
  return results;
}

// Generate Buffer-compatible CSV with publishing notes
function generateBufferCSV(imageResults) {
  const csvPath = path.join(__dirname, 'buffer-import.csv');
  const notesPath = path.join(__dirname, 'PUBLISHING_NOTES.md');
  
  // Calculate posting times based on launch date and cadence
  // Launch date: 2/28/26
  const launchDate = new Date('2026-02-28');
  const postsPerWeek = 3; // Mon, Wed, Fri
  const daysOfWeek = [1, 3, 5]; // Monday=1, Wednesday=3, Friday=5 (0 = Sunday)
  
  const csvRows = [
    ['Text', 'Image URL', 'Tags', 'Posting Time']
  ];
  
  const publishingNotes = [
    '# Publishing Notes for Buffer Import',
    '',
    '## Quick Workflow',
    '1. **Generate images**: Run `npm run generate-images`',
    '2. **Upload images**: Upload all PNGs from `generated-images/` to your image hosting (Cloudinary, S3, etc.)',
    '3. **Update CSV**: Add image URLs to the "Image URL" column in `buffer-import.csv`',
    '4. **Import to Buffer**: Use Buffer\'s bulk upload feature to import the CSV',
    '',
    '## Post Details',
    ''
  ];
  
  imageResults.sort((a, b) => a.postOrder - b.postOrder);
  
  imageResults.forEach((result) => {
    // Calculate which week and day
    const week = Math.floor((result.postOrder - 1) / postsPerWeek);
    const dayInWeek = (result.postOrder - 1) % postsPerWeek;
    
    // Calculate date
    const postDate = new Date(launchDate);
    postDate.setDate(launchDate.getDate() + (week * 7) + daysOfWeek[dayInWeek]);
    
    // Default posting time: 10:00 AM
    postDate.setHours(10, 0, 0, 0);
    
    // Format: YYYY-MM-DD HH:MM
    const year = postDate.getFullYear();
    const month = String(postDate.getMonth() + 1).padStart(2, '0');
    const day = String(postDate.getDate()).padStart(2, '0');
    const hours = String(postDate.getHours()).padStart(2, '0');
    const minutes = String(postDate.getMinutes()).padStart(2, '0');
    const postingTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    
    // Format text (escape quotes for CSV)
    const text = result.text.replace(/"/g, '""');
    
    // Image URL - placeholder (user will add after uploading)
    const imageUrl = '';
    
    // Tags (hashtags for Buffer)
    const tags = result.tags || '';
    
    csvRows.push([`"${text}"`, `"${imageUrl}"`, `"${tags}"`, `"${postingTime}"`]);
    
    // Add to publishing notes
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[postDate.getDay()];
    const contentTypeLabels = {
      'gateway': 'Gateway Statement',
      'scrollstream': 'Scrollstream',
      'definition': 'Definition',
      'excerpt': 'Book Excerpt',
      'orb-introduction': 'Orb Introduction'
    };
    
    publishingNotes.push(`### Post #${result.postOrder} - ${dayName}, ${month}/${day}/${year}`);
    publishingNotes.push(`- **Type**: ${contentTypeLabels[result.contentType] || result.contentType}`);
    publishingNotes.push(`- **Image**: ${result.filename}`);
    publishingNotes.push(`- **Hashtags**: ${tags}`);
    if (result.orbName) {
      publishingNotes.push(`- **Orb**: ${result.orbName}™`);
    }
    publishingNotes.push('');
  });
  
  // Write CSV
  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  fs.writeFileSync(csvPath, csvContent, 'utf-8');
  
  // Write publishing notes
  publishingNotes.push('## Hashtag Strategy');
  publishingNotes.push('');
  publishingNotes.push('All posts include 5 hashtags maximum:');
  publishingNotes.push('- `#stardusttosovereignty` (always included)');
  publishingNotes.push('- `#consciousnessarchitecture` (always included)');
  publishingNotes.push('- Content-specific tags (3 additional based on post type)');
  publishingNotes.push('');
  publishingNotes.push('**Note**: Hashtags are optimized for discovery, not trend-following.');
  publishingNotes.push('Avoid spiritual/wellness hashtags. Maintain structural authority.');
  publishingNotes.push('');
  publishingNotes.push('## Trademark Usage');
  publishingNotes.push('');
  publishingNotes.push('All posts automatically include:');
  publishingNotes.push('- ™ symbol on first use of "Stardust to Sovereignty"');
  publishingNotes.push('- ™ symbol on Orb names in Orb introduction posts');
  publishingNotes.push('- Book title formatted with italics (*Book One: The Cosmic Tapestry*)');
  publishingNotes.push('');
  publishingNotes.push('## Buffer Import Checklist');
  publishingNotes.push('');
  publishingNotes.push('Before importing to Buffer:');
  publishingNotes.push('1. ✅ Images generated and uploaded to hosting service');
  publishingNotes.push('2. ✅ Image URLs added to CSV "Image URL" column');
  publishingNotes.push('3. ✅ Review posting times (default: 10:00 AM Mon/Wed/Fri)');
  publishingNotes.push('4. ✅ Verify hashtags are appropriate for each post');
  publishingNotes.push('5. ✅ Check that trademark symbols (™) appear correctly');
  publishingNotes.push('');
  publishingNotes.push('## Posting Schedule');
  publishingNotes.push('');
  publishingNotes.push('- **Monday**: Gateway posts');
  publishingNotes.push('- **Wednesday**: Scrollstream posts');
  publishingNotes.push('- **Friday**: Definition/Excerpt/Orb posts');
  publishingNotes.push('- **Time**: 10:00 AM (adjust in CSV if needed)');
  publishingNotes.push('- **Launch**: February 28, 2026');
  
  fs.writeFileSync(notesPath, publishingNotes.join('\n'), 'utf-8');
  
  console.log(`📄 Generated Buffer CSV: ${csvPath}`);
  console.log(`📝 Generated Publishing Notes: ${notesPath}`);
  console.log(`   Total posts: ${imageResults.length}`);
  console.log(`\n✨ Next Steps:`);
  console.log(`   1. Upload images from ${OUTPUT_IMAGES_DIR} to your hosting service`);
  console.log(`   2. Update Image URL column in ${csvPath}`);
  console.log(`   3. Review ${notesPath} for publishing guidelines`);
  console.log(`   4. Import CSV into Buffer\n`);
}

// Run
if (require.main === module) {
  (async () => {
    try {
      // Check for limit argument: node generate-images.js 10
      const limit = process.argv[2] ? parseInt(process.argv[2], 10) : null;
      await generateImages(limit);
    } catch (error) {
      console.error('Fatal error:', error);
      process.exit(1);
    }
  })();
}

module.exports = { generateImages };
