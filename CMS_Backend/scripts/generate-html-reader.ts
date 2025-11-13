#!/usr/bin/env tsx
/**
 * HTML Reader Version Generator
 * 
 * Converts the reader-friendly markdown manuscript to a beautiful HTML version
 * for easy digital sharing with test readers
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function markdownToHTML(markdown: string): string {
  let html = markdown;
  
  // Headers
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^={60}$/gm, '<hr class="section-divider">');
  
  // Paragraphs (double newline = paragraph break)
  html = html.split('\n\n').map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<')) return trimmed; // Already HTML
    return `<p>${trimmed}</p>`;
  }).join('\n\n');
  
  // Lists (basic bullet points)
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Code blocks
  html = html.replace(/```([^`]+)```/gs, '<pre><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Clean up multiple newlines
  html = html.replace(/\n{3,}/g, '\n\n');
  
  return html;
}

function generateHTMLReaderVersion(): void {
  console.log('🌐 Generating HTML reader version...\n');
  
  const markdownPath = join(__dirname, '../09_PROCESSED/STARDUST_TO_SOVEREIGNTY_READER_VERSION.md');
  
  if (!existsSync(markdownPath)) {
    console.error('❌ Reader markdown version not found. Please run compile-manuscript-reader-friendly.ts first.');
    process.exit(1);
  }
  
  const markdown = readFileSync(markdownPath, 'utf-8');
  const htmlContent = markdownToHTML(markdown);
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stardust to Sovereignty - Book 1: The Cosmic Tapestry</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #333;
      background: #fff;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1 {
      font-size: 2.5rem;
      margin: 2rem 0 1rem;
      color: #1a1a1a;
      border-bottom: 3px solid #333;
      padding-bottom: 0.5rem;
    }
    
    h2 {
      font-size: 1.8rem;
      margin: 2rem 0 1rem;
      color: #2a2a2a;
    }
    
    h3 {
      font-size: 1.4rem;
      margin: 1.5rem 0 0.75rem;
      color: #3a3a3a;
    }
    
    h4 {
      font-size: 1.2rem;
      margin: 1.25rem 0 0.5rem;
      color: #4a4a4a;
    }
    
    p {
      margin: 1rem 0;
      text-align: justify;
    }
    
    strong {
      font-weight: 600;
      color: #1a1a1a;
    }
    
    em {
      font-style: italic;
      color: #555;
    }
    
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 2rem 0;
    }
    
    hr.section-divider {
      border-top: 2px solid #666;
      margin: 3rem 0;
    }
    
    ul, ol {
      margin: 1rem 0 1rem 2rem;
    }
    
    li {
      margin: 0.5rem 0;
    }
    
    code {
      background: #f5f5f5;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    
    pre {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
      margin: 1.5rem 0;
    }
    
    pre code {
      background: none;
      padding: 0;
    }
    
    a {
      color: #0066cc;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    @media print {
      body {
        padding: 1rem;
      }
      
      h1, h2, h3 {
        page-break-after: avoid;
      }
      
      p, li {
        page-break-inside: avoid;
      }
    }
    
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
      
      h1 {
        font-size: 2rem;
      }
      
      h2 {
        font-size: 1.5rem;
      }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
  
  const outputPath = join(__dirname, '../09_PROCESSED/STARDUST_TO_SOVEREIGNTY_READER_VERSION.html');
  writeFileSync(outputPath, html, 'utf-8');
  
  console.log('✅ HTML reader version generated!');
  console.log(`📄 Output: ${outputPath}`);
  console.log(`\n💡 You can now share this HTML file directly with test readers.`);
  console.log(`   It will display beautifully in any web browser.`);
}

// Run generator
generateHTMLReaderVersion();

