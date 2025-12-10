/**
 * File Watcher Service
 * 
 * Monitors file changes and triggers RBI analysis.
 * Debounces file changes to avoid excessive analysis.
 */

import * as vscode from 'vscode';
import { RBIAnalyzer } from './rbi-analyzer';

export class FileWatcher {
    private fileChangeEmitter: vscode.EventEmitter<vscode.Uri>;
    private debounceTimer: NodeJS.Timeout | null = null;
    private pendingFiles: Set<string> = new Set();
    private config: vscode.WorkspaceConfiguration;
    private disposables: vscode.Disposable[] = [];

    constructor(
        private context: vscode.ExtensionContext,
        private analyzer: RBIAnalyzer
    ) {
        this.config = vscode.workspace.getConfiguration('rbi');
        this.fileChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
        this.setupWatchers();
    }

    private setupWatchers(): void {
        // Watch for file changes
        const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*');
        
        fileWatcher.onDidChange(async (uri) => {
            if (this.shouldAnalyze(uri)) {
                this.scheduleAnalysis(uri.fsPath);
            }
        });

        fileWatcher.onDidCreate(async (uri) => {
            if (this.shouldAnalyze(uri)) {
                this.scheduleAnalysis(uri.fsPath);
            }
        });

        // Watch for document saves
        const saveWatcher = vscode.workspace.onDidSaveTextDocument(async (document) => {
            if (this.shouldAnalyze(document.uri)) {
                this.scheduleAnalysis(document.uri.fsPath);
            }
        });

        this.disposables.push(fileWatcher, saveWatcher);
    }

    private shouldAnalyze(uri: vscode.Uri): boolean {
        if (!this.config.get<boolean>('enabled', true)) {
            return false;
        }

        const patterns = this.config.get<string[]>('watchPatterns', [
            '**/*.ts',
            '**/*.tsx',
            '**/*.js',
            '**/*.jsx'
        ]);

        const filePath = uri.fsPath;
        
        // Skip node_modules and other common exclusions
        if (filePath.includes('node_modules') || 
            filePath.includes('.git') ||
            filePath.includes('dist') ||
            filePath.includes('build')) {
            return false;
        }

        // Check if file matches watch patterns
        return patterns.some(pattern => {
            const globPattern = pattern.replace('**/', '');
            return filePath.endsWith(globPattern.replace('**', ''));
        });
    }

    private scheduleAnalysis(filePath: string): void {
        this.pendingFiles.add(filePath);

        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        const delay = this.config.get<number>('analysisDelay', 1000);

        this.debounceTimer = setTimeout(async () => {
            const filesToAnalyze = Array.from(this.pendingFiles);
            this.pendingFiles.clear();

            for (const file of filesToAnalyze) {
                try {
                    await this.analyzer.analyzeFile(file);
                } catch (error) {
                    console.error(`Error analyzing file ${file}:`, error);
                }
            }
        }, delay);
    }

    start(): void {
        // Already started in constructor
    }

    reloadConfiguration(): void {
        this.config = vscode.workspace.getConfiguration('rbi');
    }

    dispose(): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.disposables.forEach(d => d.dispose());
        this.fileChangeEmitter.dispose();
    }
}
