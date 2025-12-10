import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

/**
 * Generate static JSON file with codex entries from markdown files
 * This allows the website to work without the CMS backend
 */

// Path from s2s-frontend/s2s-website to CMS_Backend at root
const CMS_BACKEND_ROOT = path.join(__dirname, '../../../CMS_Backend');
const processedDir = path.join(CMS_BACKEND_ROOT, '09_PROCESSED');
const orbEssaysDir = path.join(processedDir, '02d_Orb_Essays');
const codexEssaysDir = path.join(processedDir, '02f_S2S_codex_essays');
const outputFile = path.join(__dirname, '../public/codex-entries.json');

// Helper to extract orb number from orb association string
const extractOrbNumber = (orbStr: string): number | null => {
  const match = orbStr.match(/Orb\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
};

// Helper to parse a markdown file
const parseFile = (filePath: string, relativePath: string, source: 'orb' | 'codex') => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    const frontmatter = parsed.data || {};
    const body = parsed.content;

    // Extract orb associations
    const orbAssociations: number[] = [];
    if (frontmatter.orb_associations) {
      if (frontmatter.orb_associations.primary_orb) {
        const num = extractOrbNumber(frontmatter.orb_associations.primary_orb);
        if (num) orbAssociations.push(num);
      }
      if (Array.isArray(frontmatter.orb_associations.secondary_orbs)) {
        frontmatter.orb_associations.secondary_orbs.forEach((orb: string) => {
          const num = extractOrbNumber(orb);
          if (num && !orbAssociations.includes(num)) orbAssociations.push(num);
        });
      }
    }

    // Extract excerpt (first 150 chars of body)
    const excerpt = body
      .replace(/^#+\s+/gm, '') // Remove headers
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()
      .substring(0, 150) + (body.length > 150 ? '...' : '');

    const entry = {
      id: relativePath.replace(/[^a-zA-Z0-9]/g, '_'),
      title: frontmatter.title || path.basename(filePath, '.md').replace(/_/g, ' '),
      excerpt,
      author: frontmatter.author || 'Gigi Stardust',
      type: frontmatter.type || 'essay',
      category: frontmatter.category || 'foundational',
      codex_category: source === 'orb' ? 'essay' : (frontmatter.codex_category || 'essay'),
      status: frontmatter.status || 'canonical',
      created: frontmatter.created || null,
      modified: frontmatter.modified || null,
      orb_associations: orbAssociations,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      field_function: frontmatter.field_function || {},
      is_primary_source: frontmatter.is_primary_source !== false,
      book_threading: frontmatter.book_threading || null,
      file_path: relativePath,
      source_type: source,
    };

    return entry;
  } catch (error) {
    console.warn(`Failed to parse ${filePath}:`, error);
    return null;
  }
};

function generateCodexEntries() {
  const entries: any[] = [];

  console.log('Generating codex entries from markdown files...');
  console.log('  Orb essays dir:', orbEssaysDir);
  console.log('  Codex essays dir:', codexEssaysDir);

  // Load Orb Essays
  if (fs.existsSync(orbEssaysDir)) {
    const orbFiles = fs.readdirSync(orbEssaysDir).filter(f => f.endsWith('.md'));
    console.log(`  Found ${orbFiles.length} orb essay files`);
    orbFiles.forEach(filename => {
      const filePath = path.join(orbEssaysDir, filename);
      const relativePath = `02d_Orb_Essays/${filename}`;
      const entry = parseFile(filePath, relativePath, 'orb');
      if (entry) entries.push(entry);
    });
  } else {
    console.warn('  Orb essays directory not found:', orbEssaysDir);
  }

  // Load Codex Essays
  if (fs.existsSync(codexEssaysDir)) {
    const codexFiles = fs.readdirSync(codexEssaysDir).filter(f => f.endsWith('.md'));
    console.log(`  Found ${codexFiles.length} codex essay files`);
    codexFiles.forEach(filename => {
      const filePath = path.join(codexEssaysDir, filename);
      const relativePath = `02f_S2S_codex_essays/${filename}`;
      const entry = parseFile(filePath, relativePath, 'codex');
      if (entry) entries.push(entry);
    });
  } else {
    console.warn('  Codex essays directory not found:', codexEssaysDir);
  }

  // Sort by created date or filename
  entries.sort((a, b) => {
    if (a.created && b.created) {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    }
    return b.title.localeCompare(a.title);
  });

  // Write to JSON file
  const output = {
    entries,
    count: entries.length,
    generated_at: new Date().toISOString(),
    source: 'static_file',
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`\n✅ Generated ${entries.length} entries`);
  console.log(`   Output: ${outputFile}`);
}

generateCodexEntries();
