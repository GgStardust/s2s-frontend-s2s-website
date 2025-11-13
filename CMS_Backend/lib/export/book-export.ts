/**
 * Book Export Utilities
 * Export compiled chapters to PDF, DOCX, ePub
 */

import { jsPDF } from 'jspdf';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

/**
 * Export chapter to PDF
 */
export async function exportToPDF(
  bookTitle: string,
  chapters: Array<{ chapter_number: number; chapter_title: string; content: string }>
): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  // Title page
  doc.setFontSize(24);
  doc.text(bookTitle, 72, 100);
  doc.setFontSize(12);
  doc.text('Generated from Stardust to Sovereignty Dashboard', 72, 140);

  // Add chapters
  chapters.forEach((chapter, index) => {
    if (index > 0) {
      doc.addPage();
    }

    // Chapter heading
    doc.setFontSize(18);
    doc.text(`Chapter ${chapter.chapter_number}: ${chapter.chapter_title}`, 72, 100);

    // Chapter content
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(chapter.content, 450);
    doc.text(lines, 72, 140);
  });

  return doc.output('blob');
}

/**
 * Export chapter to Markdown (for DOCX conversion)
 */
export function exportToMarkdown(
  bookTitle: string,
  chapters: Array<{ chapter_number: number; chapter_title: string; content: string }>
): string {
  let markdown = `# ${bookTitle}\n\n`;
  markdown += `**Generated from Stardust to Sovereignty Dashboard**\n\n`;
  markdown += `---\n\n`;

  chapters.forEach(chapter => {
    markdown += `## Chapter ${chapter.chapter_number}: ${chapter.chapter_title}\n\n`;
    markdown += `${chapter.content}\n\n`;
    markdown += `---\n\n`;
  });

  return markdown;
}

/**
 * Export to DOCX (as downloadable markdown for now)
 * For full DOCX support, would need docx library
 */
export function exportToDOCX(
  bookTitle: string,
  chapters: Array<{ chapter_number: number; chapter_title: string; content: string }>
): Blob {
  const markdown = exportToMarkdown(bookTitle, chapters);
  return new Blob([markdown], { type: 'text/markdown' });
}

/**
 * Trigger browser download
 */
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
