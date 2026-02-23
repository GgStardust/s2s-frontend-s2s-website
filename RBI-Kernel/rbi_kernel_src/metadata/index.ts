/**
 * Metadata Parsers
 * 
 * Parses metadata from various formats (JSON, CSV, TSV, XML, Codebase)
 * for use with RBI Kernel analysis.
 * 
 * These parsers enable RBI to work with data beyond YAML frontmatter,
 * making it useful for codebase analysis, data files, and other structured formats.
 */

export * from './codebase-metadata.js';
export * from './csv-tsv-parser.js';
export * from './xml-parser.js';
export * from './json-metadata.js';
export * from './content-detector.js';

