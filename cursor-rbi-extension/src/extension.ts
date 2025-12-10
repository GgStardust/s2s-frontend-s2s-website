/**
 * RBI Coherence Extension for Cursor/VS Code
 * 
 * Main entry point for the RBI coherence monitoring extension.
 * Provides real-time architectural coherence analysis and project health tracking.
 */

import * as vscode from 'vscode';
import { RBIAnalyzer } from './services/rbi-analyzer';
import { FileWatcher } from './services/file-watcher';
import { StatusBarManager } from './ui/status-bar';
import { CoherenceDashboard } from './ui/dashboard';

let analyzer: RBIAnalyzer | null = null;
let fileWatcher: FileWatcher | null = null;
let statusBar: StatusBarManager | null = null;
let dashboard: CoherenceDashboard | null = null;

export function activate(context: vscode.ExtensionContext) {
    console.log('RBI Coherence Extension is now active!');

    // Initialize services
    try {
        analyzer = new RBIAnalyzer(context);
        fileWatcher = new FileWatcher(context, analyzer);
        statusBar = new StatusBarManager(context);
        dashboard = new CoherenceDashboard(context, analyzer);

        // Register commands
        const showDashboard = vscode.commands.registerCommand('rbi.showDashboard', () => {
            dashboard?.show();
        });

        const analyzeWorkspace = vscode.commands.registerCommand('rbi.analyzeWorkspace', async () => {
            if (analyzer) {
                vscode.window.showInformationMessage('Analyzing workspace coherence...');
                await analyzer.analyzeWorkspace();
                statusBar?.update(analyzer.getOverallCoherence());
            }
        });

        const refresh = vscode.commands.registerCommand('rbi.refresh', async () => {
            if (analyzer) {
                await analyzer.refresh();
                statusBar?.update(analyzer.getOverallCoherence());
            }
        });

        context.subscriptions.push(showDashboard, analyzeWorkspace, refresh);

        // Initialize file watcher
        fileWatcher.start();

        // Initial workspace analysis
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 && analyzer) {
            analyzer.analyzeWorkspace().then(() => {
                if (analyzer && statusBar) {
                    statusBar.update(analyzer.getOverallCoherence());
                }
            });
        }

        // Listen for configuration changes
        context.subscriptions.push(
            vscode.workspace.onDidChangeConfiguration(e => {
                if (e.affectsConfiguration('rbi')) {
                    analyzer?.reloadConfiguration();
                    fileWatcher?.reloadConfiguration();
                }
            })
        );

        vscode.window.showInformationMessage('RBI Coherence Monitor activated!');
    } catch (error) {
        console.error('Error activating RBI extension:', error);
        vscode.window.showErrorMessage(`Failed to activate RBI extension: ${error}`);
    }
}

export function deactivate() {
    if (fileWatcher) {
        fileWatcher.dispose();
    }
    if (analyzer) {
        analyzer.dispose();
    }
    if (statusBar) {
        statusBar.dispose();
    }
    if (dashboard) {
        dashboard.dispose();
    }
}
