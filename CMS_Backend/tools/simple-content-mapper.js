#!/usr/bin/env node

/**
 * S2S Codex Operator - Simple Content Mapper Tool
 * 
 * This tool bridges human direction with Codex automation by:
 * - Mapping content from your library to book chapters
 * - Detecting Orb-aware YAML frontmatter configurations
 * - Enabling S2S Codex integration workflows
 * 
 * Usage: node tools/simple-content-mapper.js
 */

const fs = require('fs');
const path = require('path');

// Colors for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${message}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logStep(message) {
  log(`\n${'→'.repeat(3)} ${message}`, 'yellow');
}

function logSuccess(message) {
  log(`\n✅ ${message}`, 'green');
}

function logError(message) {
  log(`\n❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`\nℹ️  ${message}`, 'blue');
}

// Load environment variables
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    envLines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
}

// Simple database connection (using fetch to Supabase)
async function fetchFromSupabase(endpoint) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in .env.local');
  }
  
  const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Get all books
async function getBooks() {
  try {
    const books = await fetchFromSupabase('books?select=id,title,type,status');
    return books;
  } catch (error) {
    logError(`Failed to fetch books: ${error.message}`);
    return [];
  }
}

// Get all content files
async function getContentFiles() {
  try {
    const files = await fetchFromSupabase('content_files?select=id,title,content_type,orb_associations,tags,yaml_frontmatter');
    return files;
  } catch (error) {
    logError(`Failed to fetch content files: ${error.message}`);
    return [];
  }
}

// Get chapters for a book
async function getChapters(bookId) {
  try {
    const chapters = await fetchFromSupabase(`chapters?book_id=eq.${bookId}&select=id,chapter_number,title,part_number,part_title,status`);
    return chapters;
  } catch (error) {
    logError(`Failed to fetch chapters: ${error.message}`);
    return [];
  }
}

// Detect Orb-aware mode from YAML frontmatter
function detectOrbAwareMode(file) {
  if (!file.yaml_frontmatter || !file.yaml_frontmatter.orb_associations) {
    return null;
  }
  
  const yaml = file.yaml_frontmatter;
  const orbContext = {};
  
  if (yaml.orb_associations.primary_orb) {
    orbContext.primary_orb = yaml.orb_associations.primary_orb;
  }
  
  if (yaml.orb_associations.secondary_orbs && yaml.orb_associations.secondary_orbs.length > 0) {
    orbContext.secondary_orbs = yaml.orb_associations.secondary_orbs;
  }
  
  if (yaml.integration_points && yaml.integration_points.length > 0) {
    orbContext.integration_points = yaml.integration_points;
  }
  
  return orbContext;
}

// Display Orb-aware detection results
function displayOrbAwareDetection(orbContext) {
  if (!orbContext) return;
  
  logHeader('Orb-Aware Mode Detected');
  
  if (orbContext.primary_orb) {
    log(`Detected primary orb: ${orbContext.primary_orb}`, 'bright');
  }
  
  if (orbContext.secondary_orbs && orbContext.secondary_orbs.length > 0) {
    log(`Detected secondary orbs: ${orbContext.secondary_orbs.join(', ')}`, 'bright');
  }
  
  if (orbContext.integration_points && orbContext.integration_points.length > 0) {
    log(`Detected integration targets: ${orbContext.integration_points.join(', ')}`, 'bright');
  }
  
  log('\nThis content is configured for S2S Codex integration.', 'blue');
}

// Simple content matching based on keywords and Orb awareness
function findMatchingContent(contentFiles, chapterTitle, chapterDescription = '', orbContext = null) {
  const searchText = `${chapterTitle} ${chapterDescription}`.toLowerCase();
  const keywords = searchText.split(/\s+/).filter(word => word.length > 3);
  
  return contentFiles.map(file => {
    let score = 0;
    const fileText = `${file.title} ${file.content_type} ${(file.tags || []).join(' ')}`.toLowerCase();
    
    // Check for keyword matches
    keywords.forEach(keyword => {
      if (fileText.includes(keyword)) {
        score += 1;
      }
    });
    
    // Orb-aware matching
    if (file.yaml_frontmatter) {
      const yaml = file.yaml_frontmatter;
      
      // Check primary orb match
      if (yaml.orb_associations && yaml.orb_associations.primary_orb) {
        const primaryOrb = yaml.orb_associations.primary_orb.toLowerCase();
        if (orbContext && orbContext.primary_orb) {
          if (primaryOrb.includes(orbContext.primary_orb.toLowerCase()) || 
              orbContext.primary_orb.toLowerCase().includes(primaryOrb)) {
            score += 2; // High bonus for primary orb match
          }
        } else {
          score += 1; // Bonus for having primary orb defined
        }
      }
      
      // Check secondary orbs match
      if (yaml.orb_associations && yaml.orb_associations.secondary_orbs) {
        const secondaryOrbs = yaml.orb_associations.secondary_orbs.map(o => o.toLowerCase());
        if (orbContext && orbContext.secondary_orbs) {
          const contextOrbs = orbContext.secondary_orbs.map(o => o.toLowerCase());
          const matches = secondaryOrbs.filter(orb => 
            contextOrbs.some(contextOrb => 
              orb.includes(contextOrb) || contextOrb.includes(orb)
            )
          );
          score += matches.length * 0.5; // Bonus for each secondary orb match
        } else {
          score += 0.3; // Small bonus for having secondary orbs
        }
      }
      
      // Check integration points
      if (yaml.integration_points && yaml.integration_points.length > 0) {
        score += 0.2; // Bonus for having integration points
      }
    }
    
    // Check for orb associations (legacy format)
    if (file.orb_associations && file.orb_associations.length > 0) {
      score += 0.5; // Bonus for having orb associations
    }
    
    // Check content type relevance
    if (file.content_type === 'essay' || file.content_type === 'analysis') {
      score += 0.3;
    }
    
    return { ...file, matchScore: score };
  })
  .filter(file => file.matchScore > 0)
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 10); // Top 10 matches
}

// Display content file details with Orb-aware information
function displayContentFile(file, index) {
  log(`\n${index + 1}. ${file.title}`, 'bright');
  log(`   Type: ${file.content_type}`, 'blue');
  
  // Display Orb-aware information
  if (file.yaml_frontmatter && file.yaml_frontmatter.orb_associations) {
    const yaml = file.yaml_frontmatter;
    if (yaml.orb_associations.primary_orb) {
      log(`   Primary Orb: ${yaml.orb_associations.primary_orb}`, 'magenta');
    }
    if (yaml.orb_associations.secondary_orbs && yaml.orb_associations.secondary_orbs.length > 0) {
      log(`   Secondary Orbs: ${yaml.orb_associations.secondary_orbs.join(', ')}`, 'magenta');
    }
    if (yaml.integration_points && yaml.integration_points.length > 0) {
      log(`   Integration Points: ${yaml.integration_points.join(', ')}`, 'cyan');
    }
  } else {
    // Fallback to legacy orb associations
    log(`   Orbs: ${(file.orb_associations || []).join(', ')}`, 'magenta');
  }
  
  log(`   Tags: ${(file.tags || []).slice(0, 5).join(', ')}${file.tags && file.tags.length > 5 ? '...' : ''}`, 'cyan');
  log(`   Match Score: ${file.matchScore.toFixed(2)}`, 'yellow');
}

// Main function
async function main() {
  logHeader('S2S Codex Operator - Content Mapper Tool');
  log('This tool bridges human direction with Codex automation.', 'blue');
  log('It maps content from your library to book chapters with Orb-aware intelligence.', 'blue');
  
  try {
    // Load environment
    logStep('Loading environment...');
    loadEnv();
    
    // Get books
    logStep('Fetching books...');
    const books = await getBooks();
    
    if (books.length === 0) {
      logError('No books found. Please create a book first.');
      return;
    }
    
    // Display books
    logSuccess(`Found ${books.length} book(s):`);
    books.forEach((book, index) => {
      log(`  ${index + 1}. ${book.title} (${book.type}) - ${book.status}`, 'green');
    });
    
    // For demo purposes, let's use the first book
    const selectedBook = books[0];
    logSuccess(`Using first book: ${selectedBook.title}`);
    
    // Get chapters for the selected book
    logStep('Fetching chapters...');
    const chapters = await getChapters(selectedBook.id);
    
    if (chapters.length === 0) {
      logError('No chapters found for this book. Please create chapters first.');
      return;
    }
    
    // Display chapters
    logSuccess(`Found ${chapters.length} chapter(s):`);
    chapters.forEach((chapter, index) => {
      log(`  ${index + 1}. Chapter ${chapter.chapter_number}: ${chapter.title} (${chapter.status})`, 'green');
    });
    
    // For demo purposes, let's use the first chapter
    const selectedChapter = chapters[0];
    logSuccess(`Using first chapter: Chapter ${selectedChapter.chapter_number}: ${selectedChapter.title}`);
    
    // Check for Orb-aware mode in the selected chapter
    logStep('Analyzing chapter for Orb-aware mode...');
    const orbContext = detectOrbAwareMode(selectedChapter);
    
    if (orbContext) {
      displayOrbAwareDetection(orbContext);
    } else {
      logInfo('No Orb-aware mode detected in this chapter.');
    }
    
    // Get content files
    logStep('Fetching content files...');
    const contentFiles = await getContentFiles();
    
    if (contentFiles.length === 0) {
      logError('No content files found. Please add content to your library first.');
      return;
    }
    
    logSuccess(`Found ${contentFiles.length} content file(s)`);
    
    // Find matching content (with Orb-aware context if available)
    logStep('Finding matching content...');
    const matches = findMatchingContent(
      contentFiles, 
      selectedChapter.title, 
      selectedChapter.part_title || '', 
      orbContext
    );
    
    if (matches.length === 0) {
      logError('No matching content found. Try a different chapter or add more content.');
      return;
    }
    
    // Display matches
    logSuccess(`Found ${matches.length} potential content matches:`);
    matches.forEach((file, index) => {
      displayContentFile(file, index);
    });
    
    // Show what would be mapped
    logHeader('Mapping Summary');
    log(`Book: ${selectedBook.title}`, 'bright');
    log(`Chapter: ${selectedChapter.title}`, 'bright');
    
    // Show Orb-aware context if available
    if (orbContext) {
      log(`\nOrb-Aware Context:`, 'bright');
      if (orbContext.primary_orb) {
        log(`  Primary Orb: ${orbContext.primary_orb}`, 'magenta');
      }
      if (orbContext.secondary_orbs && orbContext.secondary_orbs.length > 0) {
        log(`  Secondary Orbs: ${orbContext.secondary_orbs.join(', ')}`, 'magenta');
      }
      if (orbContext.integration_points && orbContext.integration_points.length > 0) {
        log(`  Integration Points: ${orbContext.integration_points.join(', ')}`, 'cyan');
      }
    }
    
    log(`\nTop Content Matches:`, 'bright');
    matches.slice(0, 5).forEach((file, index) => {
      log(`  ${index + 1}. ${file.title} (Score: ${file.matchScore.toFixed(2)})`, 'green');
      
      // Show Orb-aware details for each mapped file
      if (file.yaml_frontmatter && file.yaml_frontmatter.orb_associations) {
        const yaml = file.yaml_frontmatter;
        if (yaml.orb_associations.primary_orb) {
          log(`     Primary Orb: ${yaml.orb_associations.primary_orb}`, 'magenta');
        }
        if (yaml.integration_points && yaml.integration_points.length > 0) {
          log(`     Integration Points: ${yaml.integration_points.join(', ')}`, 'cyan');
        }
      }
    });
    
    // Show S2S Codex integration status
    if (orbContext) {
      log(`\nS2S Codex Integration: Ready`, 'green');
      log(`This mapping is configured for automated Codex processing.`, 'blue');
    }
    
    // Show compiled content preview
    logHeader('Compiled Content Preview');
    log(`Here's what the compiled chapter would look like:`, 'bright');
    log(`\n${'─'.repeat(60)}`, 'cyan');
    
    // Generate compiled content
    const compiledContent = generateCompiledContent(selectedChapter, matches, orbContext);
    log(compiledContent, 'reset');
    
    log(`\n${'─'.repeat(60)}`, 'cyan');
    logSuccess('Content mapping analysis completed!');
    logInfo('This is a preview. The actual database update would happen here.');
    
  } catch (error) {
    logError(`An error occurred: ${error.message}`);
  }
}

// Run the tool
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
