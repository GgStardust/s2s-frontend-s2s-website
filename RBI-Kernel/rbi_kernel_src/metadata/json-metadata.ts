/**
 * JSON Metadata Parser
 * 
 * Parses metadata from JSON files for RBI analysis.
 * Extracts structure, types, and relationships from JSON documents.
 */

import type { ContentMetadata } from '../types.js';

export interface JSONMetadata extends ContentMetadata {
  json_structure?: {
    root_type: 'object' | 'array' | 'primitive';
    depth: number;
    key_count: number;
    value_count: number;
  };
  schema?: {
    [path: string]: {
      type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';
      sample_value?: any;
    };
  };
  relationships?: Array<{
    parent: string;
    child: string;
    type: 'property' | 'array_item' | 'nested';
  }>;
}

/**
 * Parse JSON structure and extract metadata
 */
export function parseJSON(
  content: string,
  options: {
    maxDepth?: number;
    maxKeys?: number;
  } = {}
): JSONMetadata {
  const maxDepth = options.maxDepth || 10;
  const maxKeys = options.maxKeys || 1000;

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error}`);
  }

  const rootType = Array.isArray(parsed) ? 'array' : 
                   typeof parsed === 'object' && parsed !== null ? 'object' : 
                   'primitive';

  const schema: { [path: string]: { type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null'; sample_value?: any } } = {};
  const relationships: Array<{ parent: string; child: string; type: 'property' | 'array_item' | 'nested' }> = [];
  let keyCount = 0;
  let valueCount = 0;
  let depth = 0;

  function traverse(obj: any, path: string = '', currentDepth: number = 0): void {
    if (currentDepth > maxDepth || keyCount >= maxKeys) return;
    
    depth = Math.max(depth, currentDepth);

    if (Array.isArray(obj)) {
      valueCount += obj.length;
      obj.slice(0, 10).forEach((item, index) => {
        const itemPath = `${path}[${index}]`;
        schema[itemPath] = {
          type: Array.isArray(item) ? 'array' : 
                 typeof item === 'object' && item !== null ? 'object' : 
                 typeof item as 'string' | 'number' | 'boolean' | 'null',
          sample_value: item,
        };
        
        if (path) {
          relationships.push({
            parent: path,
            child: itemPath,
            type: 'array_item',
          });
        }

        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          traverse(item, itemPath, currentDepth + 1);
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        keyCount++;
        const keyPath = path ? `${path}.${key}` : key;
        
        const valueType = Array.isArray(value) ? 'array' : 
                         typeof value === 'object' && value !== null ? 'object' : 
                         typeof value as 'string' | 'number' | 'boolean' | 'null';

        schema[keyPath] = {
          type: valueType,
          sample_value: typeof value === 'object' ? undefined : value,
        };

        if (path) {
          relationships.push({
            parent: path,
            child: keyPath,
            type: 'property',
          });
        }

        if (typeof value === 'object' && value !== null) {
          traverse(value, keyPath, currentDepth + 1);
        } else {
          valueCount++;
        }
      });
    } else {
      valueCount++;
    }
  }

  traverse(parsed);

  // Extract tags from structure
  const rootKeys = rootType === 'object' && parsed ? Object.keys(parsed).slice(0, 20) : [];
  const keyTags = rootKeys.map(key => `key:${key.toLowerCase()}`);

  return {
    json_structure: {
      root_type: rootType,
      depth,
      key_count: keyCount,
      value_count: valueCount,
    },
    schema: Object.keys(schema).length > 0 ? schema : undefined,
    relationships: relationships.length > 0 ? relationships : undefined,
    category: 'json',
    tags: [
      `type:${rootType}`,
      `depth:${depth}`,
      `keys:${keyCount}`,
      ...keyTags,
    ],
  };
}

/**
 * Convert JSON metadata to ContentMetadata for RBI analysis
 */
export function jsonToContentMetadata(
  jsonMetadata: JSONMetadata,
  content?: string
): ContentMetadata {
  const schemaTags = jsonMetadata.schema 
    ? Object.keys(jsonMetadata.schema)
        .slice(0, 20)
        .map(path => `path:${path.toLowerCase().replace(/\./g, '_')}`)
    : [];

  return {
    ...jsonMetadata,
    tags: [
      ...(jsonMetadata.tags || []),
      ...schemaTags,
    ],
    category: jsonMetadata.category || 'json',
    contentFunction: {
      purpose: `JSON document with ${jsonMetadata.json_structure?.root_type} root`,
      mechanism: 'structured_data',
      context: 'json_analysis',
      relation: 'hierarchical_data',
    },
    // Backward compatibility
    field_function: {
      content_purpose: `JSON document with ${jsonMetadata.json_structure?.root_type} root`,
      primary_mechanism: 'structured_data',
      console_context: 'json_analysis',
      console_relation: 'hierarchical_data',
    },
  };
}

