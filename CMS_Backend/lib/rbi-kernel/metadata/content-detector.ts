/**
 * Content Detection Utilities
 * 
 * Detects and parses content types (JSON, CSV, XML, text)
 * for use with RBI Kernel analysis.
 * 
 * Architecture Layer: 1 (Representation) - Input normalization
 */

import { Buffer } from 'node:buffer';
import { parseJSON, jsonToContentMetadata } from './json-metadata.js';
import type { ContentMetadata } from '../field/computation/enhanced-engine.js';
import { parseCSVTSV } from './csv-tsv-parser.js';
import { parseXML } from './xml-parser.js';

export interface ParsedContent {
  contentString: string;
  metadata?: ContentMetadata;
  jsonSchema?: any;
  isJSON: boolean;
  format?: 'json' | 'csv' | 'xml' | 'text';
  details?: Record<string, any>;
}

function looksLikeCSV(text: string): boolean {
  const lines = text.split(/\r?\n/).slice(0, 5);
  return (
    lines.length >= 2 &&
    lines.every(line => line.includes(',') || line.includes(';')) &&
    lines[0].split(',').length > 1
  );
}

function looksLikeXML(text: string): boolean {
  return text.startsWith('<') && text.endsWith('>');
}

/**
 * Detect and parse JSON content
 * Layer 1 (Representation): Transforms inputs into multidimensional resonance fields
 * 
 * Auto-detects JSON objects/strings and extracts metadata for RBI analysis
 */
export function detectAndParseJSON(
  content: any
): ParsedContent {
  // If content is already a string, try to parse it as JSON
  if (typeof content === 'string') {
    const trimmed = content.trim();

    if (looksLikeCSV(trimmed)) {
      // Simple CSV to JSON conversion for content string
      const lines = trimmed.split('\n').filter(l => l.trim());
      const delimiter = lines[0].includes('\t') ? '\t' : ',';
      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
      const rows = lines.slice(1).map(line => {
        const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          row[h] = values[i] || '';
        });
        return row;
      });
      const parsed = parseCSVTSV(trimmed);
      return {
        contentString: JSON.stringify(rows),
        metadata: parsed,
        isJSON: true,
        jsonSchema: {
          type: 'array',
          items: { type: 'object' }
        },
        format: 'csv',
        details: {
          columns: parsed.csv_tsv_structure?.columns || [],
          rows: parsed.csv_tsv_structure?.row_count || 0
        }
      };
    }

    if (looksLikeXML(trimmed)) {
      const parsed = parseXML(trimmed);
      return {
        contentString: JSON.stringify(parsed),
        metadata: parsed,
        isJSON: true,
        format: 'xml',
        details: {
          root: parsed?.xml_structure?.root_element ?? 'root'
        }
      };
    }

    try {
      const parsed = JSON.parse(content);
      // If it parses and is an object/array, treat as JSON
      if (typeof parsed === 'object' && parsed !== null) {
        const jsonMetadata = parseJSON(content);
        const metadata = jsonToContentMetadata(jsonMetadata, content);
        return {
          contentString: content,
          metadata,
          jsonSchema: jsonMetadata.schema,
          isJSON: true,
          format: 'json'
        };
      }
    } catch (e) {
      // Not valid JSON, treat as plain text
    }
    return {
      contentString: content,
      isJSON: false,
      format: 'text'
    };
  }
  
  // If content is already an object/array, stringify and parse
  if (typeof content === 'object' && content !== null) {
    const contentString = JSON.stringify(content);
    const jsonMetadata = parseJSON(contentString);
    const metadata = jsonToContentMetadata(jsonMetadata, contentString);
    return {
      contentString,
      metadata,
      jsonSchema: jsonMetadata.schema,
      isJSON: true,
      format: 'json'
    };
  }
  
  // Fallback: convert to string
  return {
    contentString: String(content),
    isJSON: false,
    format: 'text'
  };
}

