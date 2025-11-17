/**
 * XML Metadata Parser
 * 
 * Parses metadata from XML files for RBI analysis.
 * Extracts structure, attributes, and relationships from XML documents.
 */

import type { ContentMetadata } from '../field/computation/enhanced-engine.js';

export interface XMLMetadata extends ContentMetadata {
  xml_structure?: {
    root_element: string;
    element_count: number;
    attribute_count: number;
    depth: number;
    namespaces: string[];
  };
  elements?: Array<{
    name: string;
    attributes: { [key: string]: string };
    children_count: number;
    text_content?: string;
  }>;
  relationships?: Array<{
    parent: string;
    child: string;
    type: 'element' | 'attribute' | 'text';
  }>;
}

/**
 * Simple XML parser (for basic XML structures)
 * For complex XML, consider using a proper XML parser library
 */
export function parseXML(
  content: string,
  options: {
    maxDepth?: number;
    maxElements?: number;
  } = {}
): XMLMetadata {
  const maxDepth = options.maxDepth || 10;
  const maxElements = options.maxElements || 1000;

  // Extract root element
  const rootMatch = content.match(/<([^?\s!][^>\s]*)[^>]*>/);
  const rootElement = rootMatch ? rootMatch[1].split(' ')[0] : 'unknown';

  // Extract namespaces
  const namespaceMatches = content.matchAll(/xmlns(?::(\w+))?=["']([^"']+)["']/g);
  const namespaces: string[] = [];
  for (const match of namespaceMatches) {
    namespaces.push(match[2]);
  }

  // Extract elements (simplified - doesn't handle all XML edge cases)
  const elementMatches = content.matchAll(/<([^/\s!>]+)([^>]*)>/g);
  const elements: XMLMetadata['elements'] = [];
  const relationships: XMLMetadata['relationships'] = [];
  const elementStack: string[] = [];

  let elementCount = 0;
  for (const match of elementMatches) {
    if (elementCount >= maxElements) break;

    const elementName = match[1].split(' ')[0];
    const attributesStr = match[2] || '';

    // Parse attributes
    const attributes: { [key: string]: string } = {};
    const attrMatches = attributesStr.matchAll(/(\w+(?::\w+)?)=["']([^"']+)["']/g);
    for (const attrMatch of attrMatches) {
      attributes[attrMatch[1]] = attrMatch[2];
    }

    // Extract text content (simplified - between tags)
    const textMatch = content.match(
      new RegExp(`<${elementName}[^>]*>([^<]+)</${elementName}>`, 's')
    );
    const textContent = textMatch ? textMatch[1].trim() : undefined;

    elements.push({
      name: elementName,
      attributes,
      children_count: 0, // Would need full parsing to calculate
      text_content: textContent,
    });

    // Track relationships
    if (elementStack.length > 0) {
      relationships.push({
        parent: elementStack[elementStack.length - 1],
        child: elementName,
        type: 'element',
      });
    }

    elementStack.push(elementName);
    elementCount++;
  }

  // Calculate depth (simplified)
  const depth = Math.max(...elementStack.map((_, i) => i + 1), 0);

  // Extract attribute relationships
  elements.forEach(element => {
    Object.keys(element.attributes).forEach(attr => {
      relationships.push({
        parent: element.name,
        child: attr,
        type: 'attribute',
      });
    });
  });

  return {
    xml_structure: {
      root_element: rootElement,
      element_count: elements.length,
      attribute_count: elements.reduce((sum, el) => sum + Object.keys(el.attributes).length, 0),
      depth,
      namespaces: [...new Set(namespaces)],
    },
    elements: elements.slice(0, maxElements),
    relationships,
    category: 'xml',
    tags: [
      `root:${rootElement}`,
      `elements:${elements.length}`,
      `depth:${depth}`,
      ...namespaces.map(ns => `namespace:${ns.split('/').pop() || ns}`),
    ],
  };
}

/**
 * Convert XML metadata to ContentMetadata for RBI analysis
 */
export function xmlToContentMetadata(
  xmlMetadata: XMLMetadata,
  content?: string
): ContentMetadata {
  const elementTags = (xmlMetadata.elements || [])
    .slice(0, 20)
    .map(el => `element:${el.name.toLowerCase()}`);

  const attributeTags = (xmlMetadata.elements || [])
    .flatMap(el => Object.keys(el.attributes))
    .slice(0, 20)
    .map(attr => `attr:${attr.toLowerCase()}`);

  return {
    ...xmlMetadata,
    tags: [
      ...(xmlMetadata.tags || []),
      ...elementTags,
      ...attributeTags,
    ],
    category: xmlMetadata.category || 'xml',
    field_function: {
      content_purpose: `XML document with root element ${xmlMetadata.xml_structure?.root_element}`,
      primary_mechanism: 'structured_markup',
      console_context: 'xml_analysis',
      console_relation: 'hierarchical_data',
    },
  };
}

