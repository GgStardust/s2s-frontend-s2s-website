#!/usr/bin/env node
/**
 * Export Atticus book JSON to clean Markdown (V12 final).
 * Usage: node scripts/atticus-json-to-markdown.js [path-to.json] [path-to-output.md]
 * Default: reads from Downloads, writes to docs/The-Cosmic-Tapestry-V12-Atticus.md
 */

const fs = require('fs');
const path = require('path');

const defaultInput = path.join(process.env.HOME || '', 'Downloads', 'The-Cosmic-Tapestry-2026-02-22T23_42_21.485Z.json');
const defaultOutput = path.join(__dirname, '..', 'docs', 'The-Cosmic-Tapestry-V12-Atticus.md');

const inputPath = process.argv[2] || defaultInput;
const outputPath = process.argv[3] || defaultOutput;

function getTextFromBlock(block) {
  if (!block) return '';
  if (block.text) return block.text;
  if (block.children && block.children.length) {
    return block.children.map(getTextFromBlock).filter(Boolean).join(' ');
  }
  return '';
}

function getInlineContent(block) {
  if (block.text) return block.italic ? `*${block.text}*` : block.text;
  if (block.children) return block.children.map(getInlineContent).filter(Boolean).join(' ');
  return '';
}

function blocksToMarkdown(children, indent = '') {
  if (!children || !children.length) return [];
  const lines = [];
  for (const node of children) {
    switch (node.type) {
      case 'p': {
        const text = getTextFromBlock(node);
        if (text) lines.push(indent + text);
        break;
      }
      case 'blockquote': {
        const content = node.children ? node.children.map(getInlineContent).filter(Boolean).join(' ') : '';
        if (content) lines.push(indent + '> ' + content);
        break;
      }
      case 'align_center':
        // Can wrap blockquote or other blocks; recurse
        if (node.children) lines.push(...blocksToMarkdown(node.children, indent));
        break;
      case 'chapter':
        // Nested section heading
        const title = node.title || getTextFromBlock(node);
        if (title) lines.push('', indent + '## ' + title, '');
        if (node.children) lines.push(...blocksToMarkdown(node.children, indent));
        break;
      case 'page-break':
        lines.push('', '---', '');
        break;
      case 'image':
        const alt = node.alt || node.caption || 'Image';
        const src = node.url || node.src || '';
        if (src) lines.push(indent + `![${alt}](${src})`);
        else lines.push(indent + `*[Image: ${alt}]*`);
        break;
      default:
        if (node.children) lines.push(...blocksToMarkdown(node.children, indent));
        else if (node.text) lines.push(indent + node.text);
        break;
    }
  }
  return lines;
}

function chapterToMarkdown(chapter, index) {
  const lines = [];
  const title = chapter.title || '';
  const type = chapter.type || '';

  // Skip standalone image chapters (e.g. "Fullpage image", "Image Ch2") as content; still list title
  if (type === 'image' || (title && /^image\s*$/i.test(title.trim()))) {
    lines.push('', `<!-- ${title} -->`, '');
    return lines;
  }

  if (title) {
    lines.push('', '# ' + title, '');
    if (chapter.subtitle) lines.push('*' + chapter.subtitle + '*', '');
  }

  if (chapter.children && chapter.children.length) {
    lines.push(...blocksToMarkdown(chapter.children));
  }

  return lines;
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error('Input file not found:', inputPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf8');
  const book = JSON.parse(raw);

  const bookTitle = book.title || 'The Cosmic Tapestry';
  const subtitle = book.subtitle || '';

  const chapters = book.chapters;
  const numericKeys = Object.keys(chapters)
    .filter((k) => /^\d+$/.test(k))
    .map((k) => parseInt(k, 10))
    .sort((a, b) => a - b);

  const mdLines = [
    '# ' + bookTitle,
    subtitle ? subtitle + '\n' : '',
    '---',
    '*Exported from Atticus (V12). Use for website copy and final reference.*',
    '---',
    '',
  ];

  for (const key of numericKeys) {
    const ch = chapters[String(key)];
    mdLines.push(...chapterToMarkdown(ch, key));
  }

  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, mdLines.join('\n').replace(/\n{3,}/g, '\n\n'), 'utf8');
  console.log('Wrote:', outputPath);
  console.log('Chapters:', numericKeys.length);
}

main();
