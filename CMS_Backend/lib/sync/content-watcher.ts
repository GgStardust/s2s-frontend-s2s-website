/**
 * Content File Watcher
 * 
 * Monitors content directories for changes and triggers auto-sync
 */

import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';

export interface FileChangeEvent {
  type: 'created' | 'updated' | 'deleted';
  filePath: string;
  relativePath: string;
  timestamp: Date;
}

export class ContentWatcher extends EventEmitter {
  private watchers: Map<string, fs.FSWatcher> = new Map();
  private watchedDirectories: Set<string> = new Set();
  private isWatching: boolean = false;

  // Content directories to watch (matches import script - only these 3 sync to Supabase)
  private readonly CONTENT_DIRECTORIES = [
    '09_PROCESSED/02d_Orb_Essays',
    '09_PROCESSED/02f_S2S_codex_essays',
    '09_PROCESSED/02g_generated_book_content'
  ];

  /**
   * Start watching content directories
   */
  startWatching(): void {
    if (this.isWatching) {
      console.log('Content watcher is already running');
      return;
    }

    const baseDir = process.cwd();

    for (const dir of this.CONTENT_DIRECTORIES) {
      const fullPath = path.join(baseDir, dir);

      if (!fs.existsSync(fullPath)) {
        console.warn(`Directory does not exist: ${fullPath}`);
        continue;
      }

      try {
        const watcher = fs.watch(fullPath, { recursive: true }, (eventType, filename) => {
          if (!filename) return;

          const filePath = path.join(fullPath, filename);
          const relativePath = path.relative(baseDir, filePath);

          // Only process markdown files
          if (!relativePath.endsWith('.md')) return;

          // Determine change type
          let changeType: FileChangeEvent['type'] = 'updated';
          if (eventType === 'rename') {
            // Check if file exists to determine if created or deleted
            if (fs.existsSync(filePath)) {
              changeType = 'created';
            } else {
              changeType = 'deleted';
            }
          }

          const changeEvent: FileChangeEvent = {
            type: changeType,
            filePath,
            relativePath,
            timestamp: new Date()
          };

          // Emit change event
          this.emit('fileChange', changeEvent);
        });

        this.watchers.set(dir, watcher);
        this.watchedDirectories.add(dir);
        console.log(`Started watching: ${dir}`);
      } catch (error) {
        console.error(`Error watching directory ${dir}:`, error);
      }
    }

    this.isWatching = true;
    console.log(`Content watcher started for ${this.watchedDirectories.size} directories`);
  }

  /**
   * Stop watching all directories
   */
  stopWatching(): void {
    for (const [dir, watcher] of this.watchers.entries()) {
      watcher.close();
      console.log(`Stopped watching: ${dir}`);
    }

    this.watchers.clear();
    this.watchedDirectories.clear();
    this.isWatching = false;
    console.log('Content watcher stopped');
  }

  /**
   * Check if watcher is active
   */
  isActive(): boolean {
    return this.isWatching;
  }

  /**
   * Get list of watched directories
   */
  getWatchedDirectories(): string[] {
    return Array.from(this.watchedDirectories);
  }
}

// Singleton instance
export const contentWatcher = new ContentWatcher();

