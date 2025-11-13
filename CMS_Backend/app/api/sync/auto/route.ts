/**
 * Auto-Sync API
 * 
 * Handles file change events from content watcher and triggers sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { contentWatcher, FileChangeEvent } from '@/lib/sync/content-watcher';
import { createClient } from '@/lib/supabase/server';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

// Queue for file changes (debounce multiple rapid changes)
const changeQueue: Map<string, FileChangeEvent> = new Map();
let syncTimeout: NodeJS.Timeout | null = null;

// Debounce sync to batch multiple file changes
const SYNC_DEBOUNCE_MS = 2000; // 2 seconds

/**
 * Process queued file changes
 */
async function processSyncQueue() {
  if (changeQueue.size === 0) return;

  const changes = Array.from(changeQueue.values());
  changeQueue.clear();

  console.log(`Processing ${changes.length} file changes...`);

  const supabase = await createClient();
  const stats = { synced: 0, errors: 0, skipped: 0 };

  for (const change of changes) {
    try {
      if (change.type === 'deleted') {
        // Handle file deletion
        const { error } = await supabase
          .from('content_files')
          .delete()
          .eq('file_path', change.relativePath);

        if (error) {
          console.error(`Error deleting file ${change.relativePath}:`, error);
          stats.errors++;
        } else {
          stats.synced++;
        }
      } else {
        // Handle file creation/update
        if (!fs.existsSync(change.filePath)) {
          stats.skipped++;
          continue;
        }

        const fileContent = fs.readFileSync(change.filePath, 'utf8');
        const { data: frontmatter, content: markdownBody } = matter(fileContent);

        // Extract orb associations
        let orbAssociations: string[] = [];
        if (frontmatter.orb_associations) {
          if (Array.isArray(frontmatter.orb_associations)) {
            orbAssociations = frontmatter.orb_associations;
          } else if (typeof frontmatter.orb_associations === 'object') {
            const orbRefs = new Set<string>();
            if (frontmatter.orb_associations.primary_orb) {
              orbRefs.add(frontmatter.orb_associations.primary_orb);
            }
            if (frontmatter.orb_associations.secondary_orbs?.length) {
              frontmatter.orb_associations.secondary_orbs.forEach((orb: string) => orbRefs.add(orb));
            }
            orbAssociations = Array.from(orbRefs);
          }
        }

        // Upsert content file
        const { error } = await supabase
          .from('content_files')
          .upsert({
            title: frontmatter.title || path.basename(change.filePath, '.md'),
            file_path: change.relativePath,
            markdown_body: markdownBody,
            content: markdownBody,
            yaml_frontmatter: frontmatter,
            orb_associations: orbAssociations,
            content_type: frontmatter.type === 'book_output' ? 'book' : 'essay',
            type: frontmatter.type || 'essay',
            status: frontmatter.status || 'active'
          }, {
            onConflict: 'file_path'
          });

        if (error) {
          console.error(`Error syncing file ${change.relativePath}:`, error);
          stats.errors++;
        } else {
          stats.synced++;
        }
      }
    } catch (error) {
      console.error(`Error processing file change ${change.relativePath}:`, error);
      stats.errors++;
    }
  }

  console.log(`Sync complete: ${stats.synced} synced, ${stats.errors} errors, ${stats.skipped} skipped`);
}

/**
 * Queue file change for sync
 */
function queueFileChange(change: FileChangeEvent) {
  changeQueue.set(change.relativePath, change);

  // Clear existing timeout
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  // Set new timeout
  syncTimeout = setTimeout(() => {
    processSyncQueue();
    syncTimeout = null;
  }, SYNC_DEBOUNCE_MS);
}

// Set up file change listener
if (!contentWatcher.isActive()) {
  contentWatcher.startWatching();
  contentWatcher.on('fileChange', queueFileChange);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'start') {
      if (!contentWatcher.isActive()) {
        contentWatcher.startWatching();
        contentWatcher.on('fileChange', queueFileChange);
      }

      return NextResponse.json({
        success: true,
        message: 'Auto-sync started',
        watched_directories: contentWatcher.getWatchedDirectories()
      });
    }

    if (action === 'stop') {
      contentWatcher.stopWatching();
      return NextResponse.json({
        success: true,
        message: 'Auto-sync stopped'
      });
    }

    if (action === 'status') {
      return NextResponse.json({
        success: true,
        is_active: contentWatcher.isActive(),
        watched_directories: contentWatcher.getWatchedDirectories(),
        queued_changes: changeQueue.size
      });
    }

    if (action === 'sync-now') {
      // Process queue immediately
      await processSyncQueue();
      return NextResponse.json({
        success: true,
        message: 'Sync queue processed'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: start, stop, status, or sync-now' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in auto-sync API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    is_active: contentWatcher.isActive(),
    watched_directories: contentWatcher.getWatchedDirectories(),
    queued_changes: changeQueue.size
  });
}

