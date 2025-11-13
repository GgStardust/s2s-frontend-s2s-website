/**
 * Console API Client
 * 
 * Client functions for all Console-related API endpoints
 */

export interface ConsoleContent {
  id: string;
  title: string;
  file_path: string;
  content: string;
  console_context: string | null;
  console_relation: string | null;
  console_views: string[];
  orb_associations: (number | string)[];
  tags: string[];
}

export interface ConceptMapData {
  primaryAxes: Array<{ orb1: number; orb2: number; description: string; type: string }>;
  secondaryPairings: Array<{ orb1: number; orb2: number; description: string; type: string }>;
  orb0Expressions: Array<any>;
  orbDetails: Array<any>;
  satellites: Array<any>;
  domains: Array<any>;
  relationships: {
    axes: any[];
    pairings: any[];
  };
}

export interface FieldSensingState {
  visibleContent: Array<{
    contentId: string;
    title: string;
    resonance: { strength: number; clarity: number; coherence: number; pattern: number };
    coherenceScore: number;
    proofStatus: 'proven' | 'partial' | 'unproven';
    fieldMetrics: { fieldStrength: number; gradient: number[]; stability: number };
    timestamp: Date;
  }>;
  overallCoherence: number;
  fieldStrength: number;
  resonanceMatrix: number[][];
  lastUpdated: Date;
}

/**
 * Fetch console content with metadata filtering
 */
export async function fetchConsoleContent(params?: {
  console_context?: string;
  console_relation?: string;
  console_view?: string;
  orb_id?: number;
}): Promise<ConsoleContent[]> {
  const searchParams = new URLSearchParams();
  if (params?.console_context) searchParams.set('console_context', params.console_context);
  if (params?.console_relation) searchParams.set('console_relation', params.console_relation);
  if (params?.console_view) searchParams.set('console_view', params.console_view);
  if (params?.orb_id) searchParams.set('orb_id', params.orb_id.toString());

  const url = `/api/console/content${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch console content: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Fetch concept map data
 */
export async function fetchConceptMap(): Promise<ConceptMapData> {
  const response = await fetch('/api/console/concept-map');

  if (!response.ok) {
    throw new Error(`Failed to fetch concept map: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Fetch field sensing state
 */
export async function senseField(contentIds: string[]): Promise<FieldSensingState> {
  const response = await fetch('/api/rbi/field-sense', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_ids: contentIds })
  });

  if (!response.ok) {
    throw new Error(`Failed to sense field: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Get current field sensing state
 */
export async function getFieldState(): Promise<FieldSensingState | null> {
  const response = await fetch('/api/rbi/field-sense');

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to get field state: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Fetch reference data
 */
export async function fetchTagRegistry(): Promise<any> {
  const response = await fetch('/api/reference/tag-registry');
  if (!response.ok) throw new Error(`Failed to fetch tag registry: ${response.statusText}`);
  const data = await response.json();
  return data.data;
}

export async function fetchProcessingWorkflow(): Promise<any> {
  const response = await fetch('/api/reference/processing-workflow');
  if (!response.ok) throw new Error(`Failed to fetch processing workflow: ${response.statusText}`);
  const data = await response.json();
  return data.data;
}

/**
 * Fetch Codex destinations
 */
export async function fetchCodexDestinations(destinations?: string[]): Promise<any[]> {
  const searchParams = new URLSearchParams();
  if (destinations && destinations.length > 0) {
    searchParams.set('destinations', destinations.join(','));
  }

  const url = `/api/codex/destinations${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch codex destinations: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data || [];
}

