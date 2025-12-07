/**
 * Console Content API
 * 
 * Returns content files filtered by console metadata:
 * - field_function.console_context
 * - field_function.console_relation
 * - integration_points.console_views
 * 
 * Only returns content from the 3 synced folders:
 * - 02d_Orb_Essays
 * - 02f_S2S_codex_essays
 * - 02g_generated_book_content
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCorsHeaders } from '@/lib/cors';

export const dynamic = 'force-dynamic';

// Only these folders should appear in Console content
const ALLOWED_FOLDERS = [
  '02d_Orb_Essays',
  '02f_S2S_codex_essays',
  '02g_generated_book_content'
];

function isFileFromAllowedFolder(filePath: string): boolean {
  return ALLOWED_FOLDERS.some(folder => filePath.startsWith(`${folder}/`));
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return NextResponse.json({}, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    
    const { searchParams } = new URL(request.url);
    const consoleContext = searchParams.get('console_context');
    const consoleRelation = searchParams.get('console_relation');
    const consoleView = searchParams.get('console_view');
    const orbId = searchParams.get('orb_id');

    const supabase = await createClient();

    // Simplified approach: Fetch all active content files and filter in memory
    // This is more reliable than complex JSONB queries and handles edge cases better
    const { data: contentFiles, error } = await supabase
      .from('content_files')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching console content:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch console content', 
          message: error.message,
          details: error 
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // Filter all criteria in memory for reliability
    // Handle case where contentFiles is null or undefined
    if (!contentFiles) {
      console.warn('No content files returned from Supabase (may be empty table)');
      return NextResponse.json({
        success: true,
        data: [],
        metadata: {
          count: 0,
          filters: {
            console_context: consoleContext || null,
            console_relation: consoleRelation || null,
            console_view: consoleView || null,
            orb_id: orbId || null
          }
        }
      }, {
        headers: corsHeaders,
      });
    }
    
    let filteredFiles = contentFiles;
    
    // FIRST: Filter to only include files from the 3 synced folders
    // This ensures Console only shows content from allowed sources
    filteredFiles = filteredFiles.filter((file: any) => {
      const filePath = file?.file_path || '';
      return isFileFromAllowedFolder(filePath);
    });
    
    // Filter by console_context if provided
    if (consoleContext && filteredFiles.length > 0) {
      filteredFiles = filteredFiles.filter((file: any) => {
        try {
          const yaml = file.yaml_frontmatter || {};
          const fieldFunction = yaml.field_function || {};
          return fieldFunction.console_context === consoleContext;
        } catch (err) {
          console.warn(`Error filtering console_context for file ${file?.id}:`, err);
          return false;
        }
      });
    }
    
    // Filter by console_relation if provided
    if (consoleRelation && filteredFiles.length > 0) {
      filteredFiles = filteredFiles.filter((file: any) => {
        try {
          const yaml = file.yaml_frontmatter || {};
          const fieldFunction = yaml.field_function || {};
          return fieldFunction.console_relation === consoleRelation;
        } catch (err) {
          console.warn(`Error filtering console_relation for file ${file?.id}:`, err);
          return false;
        }
      });
    }
    
    // Filter by console_view if provided
    if (consoleView && filteredFiles.length > 0) {
      filteredFiles = filteredFiles.filter((file: any) => {
        try {
          const yaml = file.yaml_frontmatter || {};
          const integrationPoints = yaml.integration_points || {};
          const consoleViews = integrationPoints.console_views || [];
          return Array.isArray(consoleViews) && consoleViews.includes(consoleView);
        } catch (err) {
          console.warn(`Error filtering console_view for file ${file?.id}:`, err);
          return false;
        }
      });
    }
    
    // Filter by orb_id if provided
    if (orbId && filteredFiles.length > 0) {
      const orbNumber = parseInt(orbId);
      if (!isNaN(orbNumber) && orbNumber >= 1 && orbNumber <= 13) {
        filteredFiles = filteredFiles.filter((file: any) => {
          if (!file) return false;
          
          // Safely check orb_associations
          const orbAssociations = file.orb_associations;
          if (orbAssociations == null) return false;
          
          // Handle both array and object formats
          if (Array.isArray(orbAssociations)) {
            return orbAssociations.some((orb: any) => {
              if (orb == null) return false;
              if (typeof orb === 'number') return orb === orbNumber;
              if (typeof orb === 'string') {
                const match = orb.match(/Orb\s*(\d+)/i);
                return match ? parseInt(match[1]) === orbNumber : false;
              }
              return false;
            });
          }
          
          // Handle object format (primary_orb, secondary_orbs)
          if (typeof orbAssociations === 'object' && orbAssociations !== null) {
            const primaryOrb = orbAssociations.primary_orb;
            if (primaryOrb != null) {
              const primaryMatch = String(primaryOrb).match(/Orb\s*(\d+)/i);
              if (primaryMatch && parseInt(primaryMatch[1]) === orbNumber) return true;
            }
            
            const secondaryOrbs = orbAssociations.secondary_orbs;
            if (Array.isArray(secondaryOrbs) && secondaryOrbs.length > 0) {
              return secondaryOrbs.some((orb: any) => {
                if (orb == null) return false;
                const match = String(orb).match(/Orb\s*(\d+)/i);
                return match ? parseInt(match[1]) === orbNumber : false;
              });
            }
          }
          
          return false;
        });
      }
    }

    // Extract console metadata for each file
    const enrichedFiles = filteredFiles
      .filter((file: any) => file != null) // Filter out any null/undefined files
      .map((file: any) => {
        try {
          const yaml = file.yaml_frontmatter || {};
          const fieldFunction = yaml.field_function || {};
          const integrationPoints = yaml.integration_points || {};

          // Safely normalize orb_associations
          let orbAssociations: (string | number)[] = [];
          try {
            const oa = file?.orb_associations;
            if (!oa) {
              orbAssociations = [];
            } else if (Array.isArray(oa)) {
              orbAssociations = oa.filter(item => item != null); // Filter out null/undefined
            } else if (typeof oa === 'object' && oa !== null) {
              // Convert object format to array
              if (oa.primary_orb != null) orbAssociations.push(oa.primary_orb);
              const secondaryOrbs = oa.secondary_orbs;
              if (Array.isArray(secondaryOrbs)) {
                const validOrbs = secondaryOrbs.filter((orb: any) => orb != null);
                if (validOrbs.length > 0) {
                  orbAssociations.push(...validOrbs);
                }
              }
            }
          } catch (err) {
            console.warn(`Error processing orb_associations for file ${file?.id || 'unknown'}:`, err);
            orbAssociations = [];
          }

          // Safely normalize tags
          let tags: string[] = [];
          try {
            if (Array.isArray(file.tags) && file.tags.length > 0) {
              tags = file.tags;
            }
          } catch (err) {
            console.warn(`Error processing tags for file ${file.id}:`, err);
            tags = [];
          }

          return {
            id: file.id || '',
            title: file.title || 'Untitled',
            file_path: file.file_path || '',
            markdown_body: file.markdown_body || '',
            content: file.content || file.markdown_body || '',
            console_context: fieldFunction.console_context || null,
            console_relation: fieldFunction.console_relation || null,
            console_views: Array.isArray(integrationPoints.console_views) ? integrationPoints.console_views : [],
            orb_associations: orbAssociations,
            tags: tags,
            created_at: file.created_at || null,
            updated_at: file.updated_at || null
          };
        } catch (error) {
          console.error(`Error processing file ${file?.id || 'unknown'}:`, error);
          // Return a safe default object
          return {
            id: file?.id || '',
            title: file?.title || 'Error loading file',
            file_path: file?.file_path || '',
            markdown_body: '',
            content: '',
            console_context: null,
            console_relation: null,
            console_views: [],
            orb_associations: [],
            tags: [],
            created_at: null,
            updated_at: null
          };
        }
      });

    return NextResponse.json({
      success: true,
      data: enrichedFiles,
      metadata: {
        count: enrichedFiles.length,
        filters: {
          console_context: consoleContext || null,
          console_relation: consoleRelation || null,
          console_view: consoleView || null,
          orb_id: orbId || null
        }
      }
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error in console content API:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

