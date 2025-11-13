/**
 * Codex Integration Router
 * 
 * Routes content files to Codex destinations based on integration_points.codex metadata
 */

import { createClient } from '@/lib/supabase/server';

export interface CodexDestination {
  name: string;
  description?: string;
  content: Array<{
    id: string;
    title: string;
    file_path: string;
    orb_associations: number[];
    integration_points: {
      codex: string[];
      console_views: string[];
      editorial_pass?: string;
    };
  }>;
}

export class CodexIntegrationRouter {
  private static instance: CodexIntegrationRouter;
  private destinations: Map<string, CodexDestination> = new Map();

  private constructor() {}

  public static getInstance(): CodexIntegrationRouter {
    if (!CodexIntegrationRouter.instance) {
      CodexIntegrationRouter.instance = new CodexIntegrationRouter();
    }
    return CodexIntegrationRouter.instance;
  }

  /**
   * Load all content files and route them by integration_points.codex
   */
  async loadAndRoute(): Promise<Map<string, CodexDestination>> {
    const supabase = await createClient();

    // Get all active content files
    const { data: contentFiles, error } = await supabase
      .from('content_files')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error || !contentFiles) {
      console.error('Error loading content files for Codex routing:', error);
      return this.destinations;
    }

    // Reset destinations
    this.destinations.clear();

    // Route each file to its Codex destinations
    for (const file of contentFiles) {
      const yaml = file.yaml_frontmatter || {};
      const integrationPoints = yaml.integration_points || {};
      const codexDestinations = integrationPoints.codex || [];

      if (Array.isArray(codexDestinations) && codexDestinations.length > 0) {
        for (const destination of codexDestinations) {
          if (typeof destination === 'string') {
            this.addToDestination(destination, {
              id: file.id,
              title: file.title,
              file_path: file.file_path,
              orb_associations: file.orb_associations || [],
              integration_points: {
                codex: codexDestinations,
                console_views: integrationPoints.console_views || [],
                editorial_pass: integrationPoints.editorial_pass
              }
            });
          }
        }
      } else {
        // Default destination for files without explicit codex routing
        this.addToDestination('default', {
          id: file.id,
          title: file.title,
          file_path: file.file_path,
          orb_associations: file.orb_associations || [],
          integration_points: {
            codex: [],
            console_views: integrationPoints.console_views || [],
            editorial_pass: integrationPoints.editorial_pass
          }
        });
      }
    }

    return this.destinations;
  }

  /**
   * Add content to a Codex destination
   */
  private addToDestination(destinationName: string, content: CodexDestination['content'][0]): void {
    if (!this.destinations.has(destinationName)) {
      this.destinations.set(destinationName, {
        name: destinationName,
        description: this.getDestinationDescription(destinationName),
        content: []
      });
    }

    const destination = this.destinations.get(destinationName)!;
    destination.content.push(content);
  }

  /**
   * Get description for a Codex destination
   */
  private getDestinationDescription(name: string): string {
    const descriptions: Record<string, string> = {
      'BookCompiler': 'Content intended for book compilation',
      'CodexIndexer': 'Content indexed in the Living Codex',
      'ReferenceSystem': 'Reference and framework content',
      'default': 'Content without specific Codex routing'
    };

    return descriptions[name] || `Codex destination: ${name}`;
  }

  /**
   * Get all destinations
   */
  getDestinations(): Map<string, CodexDestination> {
    return this.destinations;
  }

  /**
   * Get content for a specific destination
   */
  getDestinationContent(destinationName: string): CodexDestination | undefined {
    return this.destinations.get(destinationName);
  }

  /**
   * Get all content for multiple destinations
   */
  getMultipleDestinations(destinationNames: string[]): CodexDestination[] {
    return destinationNames
      .map(name => this.destinations.get(name))
      .filter((dest): dest is CodexDestination => dest !== undefined);
  }
}

export const codexIntegrationRouter = CodexIntegrationRouter.getInstance();

