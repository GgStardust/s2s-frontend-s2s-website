#!/usr/bin/env tsx
/**
 * Enhanced HTML Reader Version Generator with Sidebar Navigation
 * 
 * Converts the reader-friendly markdown manuscript to a beautiful HTML version
 * with sidebar navigation for easy chapter/section tracking
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Section {
  id: string;
  title: string;
  level: number;
  parent?: string;
}

function extractSections(markdown: string): Section[] {
  const sections: Section[] = [];
  const lines = markdown.split('\n');
  let sectionCounter = 0;
  
  for (const line of lines) {
    // Match headers
    const h1Match = line.match(/^# (.+)$/);
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);
    
    if (h1Match) {
      sectionCounter++;
      const id = `section-${sectionCounter}`;
      sections.push({
        id,
        title: h1Match[1].replace(/\*\*/g, '').trim(),
        level: 1,
      });
    } else if (h2Match) {
      sectionCounter++;
      const id = `section-${sectionCounter}`;
      const parent = sections.filter(s => s.level === 1).pop()?.id;
      sections.push({
        id,
        title: h2Match[1].replace(/\*\*/g, '').trim(),
        level: 2,
        parent,
      });
    } else if (h3Match) {
      sectionCounter++;
      const id = `section-${sectionCounter}`;
      const parent = sections.filter(s => s.level === 2).pop()?.id || 
                     sections.filter(s => s.level === 1).pop()?.id;
      sections.push({
        id,
        title: h3Match[1].replace(/\*\*/g, '').trim(),
        level: 3,
        parent,
      });
    }
  }
  
  return sections;
}

function markdownToHTML(markdown: string): string {
  let html = markdown;
  let sectionCounter = 0;
  
  // Remove Legal Notice section from content since we add it programmatically
  html = html.replace(/##\s*LEGAL NOTICE[\s\S]*?(?=---|\n##|\n#|$)/gi, '');
  
  // Add IDs to headers for navigation
  html = html.replace(/^(#+) (.+)$/gm, (match, hashes, title) => {
    // Skip Legal Notice headers
    if (title.trim().toUpperCase().includes('LEGAL NOTICE')) {
      return '';
    }
    sectionCounter++;
    const level = hashes.length;
    const id = `section-${sectionCounter}`;
    return `<h${level} id="${id}">${title}</h${level}>`;
  });
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Italic (but not headers)
  html = html.replace(/(?<!^|\n)\*(.+?)\*(?!\n|$)/g, '<em>$1</em>');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^={60}$/gm, '<hr class="section-divider">');
  
  // Paragraphs (double newline = paragraph break)
  html = html.split('\n\n').map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<')) return trimmed; // Already HTML
    // Don't wrap headers or list items
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li') || trimmed.startsWith('<hr')) {
      return trimmed;
    }
    return `<p>${trimmed}</p>`;
  }).join('\n\n');
  
  // Lists (basic bullet points)
  // First, convert standalone bullet points to list items
  const listPattern = /^- (.+)$/gm;
  html = html.replace(listPattern, '<li>$1</li>');
  
  // Wrap consecutive list items in ul tags
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return `<ul>${match}</ul>`;
  });
  
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
  console.log('🌐 Generating enhanced HTML reader version with sidebar navigation...\n');
  
  const markdownPath = join(__dirname, '../09_PROCESSED/STARDUST_TO_SOVEREIGNTY_READER_VERSION.md');
  
  if (!existsSync(markdownPath)) {
    console.error('❌ Reader markdown version not found. Please run compile-manuscript-reader-friendly.ts first.');
    process.exit(1);
  }
  
  const markdown = readFileSync(markdownPath, 'utf-8');
  const sections = extractSections(markdown);
  const htmlContent = markdownToHTML(markdown);
  
  // Generate simplified sidebar navigation - flat list of main sections only
  let sidebarNav = '<nav class="sidebar-nav">\n  <div class="nav-header">\n    <h3>Navigation</h3>\n  </div>\n  <ul class="nav-list">\n';
  
  for (const section of sections) {
    // Skip Part headers, Legal Notice, Table of Contents, main title
    if (section.title.includes('PART ') || section.title.includes('Front Matter') || 
        section.title.includes('Back Matter') || section.title.includes('APPENDICES') ||
        section.title.includes('LEGAL NOTICE') || section.title.includes('Table of Contents') || 
        section.title.includes('STARDUST TO SOVEREIGNTY')) {
      continue;
    }
    // Only include Level 1 headers (Chapters, Interludes, Series Note, Prologue, Introduction, etc.)
    if (section.level === 1) {
      // Check if it's a front matter item (Series Note, Prologue, Introduction)
      const isFrontMatter = section.title.includes('Series Note') || 
                            section.title.includes('Prologue') || 
                            section.title.includes('Introduction') ||
                            section.title.includes('Conclusion') ||
                            section.title.includes('Afterword') ||
                            section.title.includes('Epilogue');
      const isInterlude = section.title.toLowerCase().includes('interlude');
      const isAppendix = section.title.includes('APPENDIX') || section.title.includes('Appendix');
      
      let linkClass = 'nav-link nav-level-1';
      if (isInterlude) {
        linkClass += ' nav-interlude';
      } else if (isFrontMatter || isAppendix) {
        linkClass += ' nav-frontmatter';
      } else {
        linkClass += ' nav-chapter';
      }
      
      sidebarNav += `    <li><a href="#${section.id}" class="${linkClass}">${section.title}</a></li>\n`;
    }
    // Skip all level 2 and level 3 subsections
  }
  
  sidebarNav += '  </ul>\n</nav>\n';
  
  const currentYear = new Date().getFullYear();
  const legalNotice = `
    <div class="legal-notice">
      <h2 id="legal-notice-header">Legal Notice</h2>
      <div class="legal-content">
        <p><strong>Copyright Notice</strong></p>
        <p>Copyright © ${currentYear} Jennifer Dye, operating as Gigi Stardust. All rights reserved.</p>
        <p>This manuscript is protected by copyright law. No part of this document may be reproduced, distributed, transmitted, displayed, published, or broadcast without the prior written permission of the copyright owner.</p>
        
        <p><strong>Trademark Notice</strong></p>
        <p>The following are trademarks or service marks of Jennifer Dye/Gigi Stardust: "Stardust to Sovereignty," "The Sovereignty Cycle," "Orb System," "Resonance Kernel," "Orbital Brain," "Sovereignty Dashboard," and all related logos, designs, and trade dress. All other trademarks, service marks, and company names are the property of their respective owners.</p>
        
        <p><strong>Confidentiality & Privacy</strong></p>
        <p>This manuscript is being shared in confidence for review purposes only. By receiving this document, you agree to:</p>
        <ul>
          <li>Keep the contents confidential and not share, distribute, or reproduce this manuscript without explicit written permission</li>
          <li>Use this material solely for the purpose of providing feedback and review</li>
          <li>Not quote, reference, or cite any portion of this manuscript in public forums, publications, or media without prior written consent</li>
          <li>Respect the intellectual property rights of the author</li>
        </ul>
        
        <p><strong>Disclaimer</strong></p>
        <p>This is a draft manuscript. All content is subject to revision, editing, and final publication approval. The views, opinions, and statements expressed herein are those of the author and do not necessarily reflect any official policy or position. The information provided is for educational and informational purposes only.</p>
        
        <p><strong>Patent Notice</strong></p>
        <p>The Resonance Kernel Method and related computational frameworks described in this work are protected under Provisional Patent Application No. 63/909,031, filed October 31, 2025.</p>
      </div>
    </div>
  `;

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
      background: #f5f5f5;
      display: flex;
      min-height: 100vh;
    }
    
    .sidebar-nav {
      position: fixed;
      left: 0;
      top: 0;
      width: 280px;
      height: 100vh;
      background: #2a2a2a;
      color: #fff;
      overflow-y: auto;
      padding: 1.5rem 0;
      z-index: 1000;
      box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    }
    
    .sidebar-nav::-webkit-scrollbar {
      width: 8px;
    }
    
    .sidebar-nav::-webkit-scrollbar-track {
      background: #1a1a1a;
    }
    
    .sidebar-nav::-webkit-scrollbar-thumb {
      background: #555;
      border-radius: 4px;
    }
    
    .nav-header {
      padding: 0 1.5rem 1rem;
      border-bottom: 1px solid #444;
      margin-bottom: 1rem;
    }
    
    .nav-header h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #fff;
      margin: 0;
    }
    
    .nav-list {
      list-style: none;
      padding: 0;
    }
    
    
    .nav-link {
      display: block;
      padding: 0.6rem 1.5rem;
      color: #fff;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.2s;
      border-left: 3px solid transparent;
      background: transparent;
      line-height: 1.4;
    }
    
    .nav-link:hover {
      background: #3a3a3a;
      color: #fff;
      border-left-color: #888;
    }
    
    .nav-link.nav-level-1 {
      font-weight: 600;
      padding-left: 1.5rem;
      padding-top: 0.7rem;
      padding-bottom: 0.7rem;
      color: #fff;
      font-size: 0.92rem;
    }
    
    .nav-link.nav-level-1.nav-chapter {
      font-weight: 600;
      color: #fff;
    }
    
    .nav-link.nav-level-1.nav-interlude {
      font-weight: 400;
      font-style: italic;
      color: #ddd;
      padding-left: 2rem;
      font-size: 0.88rem;
    }
    
    .nav-link.nav-level-1.nav-frontmatter {
      font-weight: 500;
      color: #eee;
    }
    
    .nav-link.active {
      background: #444;
      color: #fff;
      border-left-color: #fff;
      font-weight: 600;
    }
    
    .content-wrapper {
      margin-left: 280px;
      flex: 1;
      background: #fff;
    }
    
    .main-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }
    
    h1 {
      font-size: 2.5rem;
      margin: 2rem 0 1rem;
      color: #1a1a1a;
      border-bottom: 3px solid #333;
      padding-bottom: 0.5rem;
      scroll-margin-top: 2rem;
    }
    
    h2 {
      font-size: 1.8rem;
      margin: 2rem 0 1rem;
      color: #2a2a2a;
      scroll-margin-top: 2rem;
    }
    
    h3 {
      font-size: 1.4rem;
      margin: 1.5rem 0 0.75rem;
      color: #3a3a3a;
      scroll-margin-top: 2rem;
    }
    
    h4 {
      font-size: 1.2rem;
      margin: 1.25rem 0 0.5rem;
      color: #4a4a4a;
      scroll-margin-top: 2rem;
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
    
    /* Mobile responsiveness */
    @media (max-width: 1024px) {
      .sidebar-nav {
        transform: translateX(-100%);
        transition: transform 0.3s;
      }
      
      .sidebar-nav.open {
        transform: translateX(0);
      }
      
      .content-wrapper {
        margin-left: 0;
      }
      
      .main-content {
        padding: 2rem 1rem;
      }
      
      .mobile-nav-toggle {
        display: block;
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 1001;
        background: #2a2a2a;
        color: #fff;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1.2rem;
      }
    }
    
    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
      }
      
      h1 {
        font-size: 2rem;
      }
      
      h2 {
        font-size: 1.5rem;
      }
    }
    
    .legal-notice {
      background: #f9f9f9;
      border: 2px solid #ddd;
      border-radius: 5px;
      padding: 2rem;
      margin: 2rem 0;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    
    .legal-notice h2 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
      color: #1a1a1a;
      border-bottom: 2px solid #666;
      padding-bottom: 0.5rem;
    }
    
    .legal-content {
      color: #444;
    }
    
    .legal-content p {
      margin: 1rem 0;
      text-align: left;
    }
    
    .legal-content strong {
      color: #1a1a1a;
      font-weight: 600;
    }
    
    .legal-content ul {
      margin: 1rem 0 1rem 2rem;
    }
    
    .legal-content li {
      margin: 0.5rem 0;
    }
    
    .legal-footer {
      background: #f9f9f9;
      border-top: 2px solid #ddd;
      padding: 1.5rem;
      margin-top: 3rem;
      text-align: center;
      font-size: 0.85rem;
      color: #666;
    }
    
    @media print {
      .sidebar-nav {
        display: none;
      }
      
      .content-wrapper {
        margin-left: 0;
      }
      
      .main-content {
        padding: 1rem;
      }
      
      h1, h2, h3 {
        page-break-after: avoid;
      }
      
      p, li {
        page-break-inside: avoid;
      }
      
      .legal-notice {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  ${sidebarNav}
  <div class="content-wrapper">
    <button class="mobile-nav-toggle" onclick="document.querySelector('.sidebar-nav').classList.toggle('open')">☰</button>
    <div class="main-content">
      ${legalNotice}
      <hr class="section-divider">
      ${htmlContent}
      <div class="legal-footer">
        <p><strong>Copyright © ${currentYear} Jennifer Dye, operating as Gigi Stardust. All rights reserved.</strong></p>
        <p>This manuscript is confidential and proprietary. Unauthorized reproduction, distribution, or disclosure is prohibited.</p>
        <p>For questions or permissions, contact: <a href="mailto:gigi@gigistardust.com">gigi@gigistardust.com</a></p>
      </div>
    </div>
  </div>
  
  <script>
    // Highlight active section in sidebar on scroll
    const sections = document.querySelectorAll('h1, h2');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          document.querySelector('.sidebar-nav').classList.remove('open');
        }
      });
    });
  </script>
</body>
</html>`;
  
  const outputPath = join(__dirname, '../09_PROCESSED/STARDUST_TO_SOVEREIGNTY_READER_VERSION.html');
  writeFileSync(outputPath, html, 'utf-8');
  
  console.log('✅ Enhanced HTML reader version generated with sidebar navigation!');
  console.log(`📄 Output: ${outputPath}`);
  console.log(`📊 Sections indexed: ${sections.length}`);
  console.log(`\n💡 Features:`);
  console.log(`   - Fixed sidebar navigation with scroll tracking`);
  console.log(`   - Active section highlighting`);
  console.log(`   - Smooth scroll to sections`);
  console.log(`   - Mobile responsive with toggle menu`);
  console.log(`   - Print-friendly (sidebar hidden when printing)`);
}

// Run generator
generateHTMLReaderVersion();
