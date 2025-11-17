/**
 * CSV/TSV Metadata Parser
 * 
 * Parses metadata from CSV and TSV files for RBI analysis.
 * Supports both header-based and positional metadata extraction.
 */

import type { ContentMetadata } from '../field/computation/enhanced-engine.js';

export interface CSVTSVMetadata extends ContentMetadata {
  csv_tsv_structure?: {
    delimiter: ',' | '\t';
    has_header: boolean;
    column_count: number;
    row_count: number;
    columns: string[];
  };
  data_types?: {
    [column: string]: 'string' | 'number' | 'date' | 'boolean' | 'mixed';
  };
  sample_data?: {
    [column: string]: any[];
  };
}

/**
 * Detect delimiter (comma or tab)
 */
function detectDelimiter(content: string): ',' | '\t' {
  const firstLine = content.split('\n')[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  
  return tabCount > commaCount ? '\t' : ',';
}

/**
 * Parse CSV/TSV content
 */
export function parseCSVTSV(
  content: string,
  options: {
    hasHeader?: boolean;
    delimiter?: ',' | '\t';
    maxRows?: number;
  } = {}
): CSVTSVMetadata {
  const delimiter = options.delimiter || detectDelimiter(content);
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const hasHeader = options.hasHeader !== false && lines.length > 0;
  
  const headerLine = hasHeader ? lines[0] : null;
  const dataLines = hasHeader ? lines.slice(1) : lines;
  const maxRows = options.maxRows || 100;
  const limitedDataLines = dataLines.slice(0, maxRows);

  const columns = headerLine
    ? headerLine.split(delimiter).map(col => col.trim())
    : limitedDataLines[0]?.split(delimiter).map((_, i) => `column_${i + 1}`) || [];

  // Parse data rows
  const rows = limitedDataLines.map(line => {
    const values = line.split(delimiter);
    const row: { [key: string]: string } = {};
    columns.forEach((col, i) => {
      row[col] = values[i]?.trim() || '';
    });
    return row;
  });

  // Detect data types
  const dataTypes: { [column: string]: 'string' | 'number' | 'date' | 'boolean' | 'mixed' } = {};
  const sampleData: { [column: string]: any[] } = {};

  columns.forEach(column => {
    const values = rows.map(r => r[column]).filter(v => v !== '');
    sampleData[column] = values.slice(0, 5);

    if (values.length === 0) {
      dataTypes[column] = 'string';
      return;
    }

    // Check if all values are numbers
    const allNumbers = values.every(v => !isNaN(Number(v)) && v.trim() !== '');
    if (allNumbers) {
      dataTypes[column] = 'number';
      return;
    }

    // Check if all values are booleans
    const allBooleans = values.every(v => 
      ['true', 'false', 'yes', 'no', '1', '0'].includes(v.toLowerCase())
    );
    if (allBooleans) {
      dataTypes[column] = 'boolean';
      return;
    }

    // Check if all values are dates
    const allDates = values.every(v => {
      const date = new Date(v);
      return !isNaN(date.getTime());
    });
    if (allDates) {
      dataTypes[column] = 'date';
      return;
    }

    dataTypes[column] = 'mixed';
  });

  return {
    csv_tsv_structure: {
      delimiter,
      has_header: hasHeader,
      column_count: columns.length,
      row_count: dataLines.length,
      columns,
    },
    data_types: dataTypes,
    sample_data: sampleData,
    category: 'csv_tsv',
    tags: [
      `format:${delimiter === ',' ? 'csv' : 'tsv'}`,
      `columns:${columns.length}`,
      `rows:${dataLines.length}`,
    ],
  };
}

/**
 * Extract metadata from CSV/TSV for RBI analysis
 */
export function csvTSVToContentMetadata(
  csvMetadata: CSVTSVMetadata,
  content?: string
): ContentMetadata {
  // Use column names as tags
  const columnTags = (csvMetadata.csv_tsv_structure?.columns || []).map(col => 
    `column:${col.toLowerCase().replace(/\s+/g, '_')}`
  );

  // Use data types as tags
  const typeTags = Object.entries(csvMetadata.data_types || {}).map(([col, type]) => 
    `type:${type}`
  );

  return {
    ...csvMetadata,
    tags: [
      ...(csvMetadata.tags || []),
      ...columnTags,
      ...typeTags,
    ],
    category: csvMetadata.category || 'csv_tsv',
    field_function: {
      content_purpose: `CSV/TSV data file with ${csvMetadata.csv_tsv_structure?.column_count || 0} columns`,
      primary_mechanism: 'structured_data',
      console_context: 'data_analysis',
      console_relation: 'tabular_data',
    },
  };
}

