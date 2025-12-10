/**
 * Status Bar Manager
 * 
 * Displays RBI coherence score in the status bar.
 * Provides quick access to coherence dashboard.
 */

import * as vscode from 'vscode';

export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;
    private overallCoherence: number = 0;

    constructor(private context: vscode.ExtensionContext) {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'rbi.showDashboard';
        this.statusBarItem.tooltip = 'Click to open RBI Coherence Dashboard';
        this.context.subscriptions.push(this.statusBarItem);
        this.update(0);
    }

    update(coherence: number): void {
        this.overallCoherence = coherence;
        
        if (coherence === 0) {
            this.statusBarItem.text = '$(sync~spin) RBI: Analyzing...';
            this.statusBarItem.backgroundColor = undefined;
        } else {
            const percentage = Math.round(coherence * 100);
            this.statusBarItem.text = `$(pulse) RBI: ${percentage}%`;

            // Color coding based on coherence
            if (coherence >= 0.8) {
                this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
            } else if (coherence >= 0.6) {
                this.statusBarItem.backgroundColor = undefined;
            } else {
                this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            }
        }

        this.statusBarItem.show();
    }

    dispose(): void {
        this.statusBarItem.dispose();
    }
}
