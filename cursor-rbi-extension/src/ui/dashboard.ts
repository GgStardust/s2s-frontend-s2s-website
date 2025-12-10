/**
 * Coherence Dashboard
 * 
 * Webview panel displaying RBI coherence metrics, file analysis results,
 * and project health information.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { RBIAnalyzer } from '../services/rbi-analyzer';

export class CoherenceDashboard {
    private panel: vscode.WebviewPanel | undefined;
    private disposables: vscode.Disposable[] = [];

    constructor(
        private context: vscode.ExtensionContext,
        private analyzer: RBIAnalyzer
    ) {}

    show(): void {
        if (this.panel) {
            this.panel.reveal();
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'rbiCoherenceDashboard',
            'RBI Coherence Dashboard',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            }
        );

        this.panel.webview.html = this.getWebviewContent();

        // Update content periodically
        const updateInterval = setInterval(() => {
            if (this.panel) {
                this.panel.webview.html = this.getWebviewContent();
            }
        }, 5000);

        this.panel.onDidDispose(() => {
            clearInterval(updateInterval);
            this.panel = undefined;
        }, null, this.disposables);
    }

    private getWebviewContent(): string {
        const results = this.analyzer.getAllResults();
        const overallCoherence = this.analyzer.getOverallCoherence();
        const lowCoherenceFiles = this.analyzer.getLowCoherenceFiles();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RBI Coherence Dashboard</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
        }
        .header {
            border-bottom: 2px solid var(--vscode-panel-border);
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .metric {
            display: inline-block;
            margin: 10px 20px 10px 0;
            padding: 15px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 5px;
            min-width: 150px;
        }
        .metric-value {
            font-size: 32px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }
        .metric-label {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-top: 5px;
        }
        .coherence-bar {
            width: 100%;
            height: 20px;
            background: var(--vscode-input-background);
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .coherence-fill {
            height: 100%;
            background: linear-gradient(90deg, #ff4444 0%, #ffaa00 50%, #44ff44 100%);
            transition: width 0.3s ease;
        }
        .file-list {
            margin-top: 20px;
        }
        .file-item {
            padding: 10px;
            margin: 5px 0;
            background: var(--vscode-list-hoverBackground);
            border-left: 3px solid var(--vscode-textLink-foreground);
            border-radius: 3px;
        }
        .file-item.low-coherence {
            border-left-color: #ff4444;
        }
        .file-path {
            font-family: var(--vscode-editor-font-family);
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
        .file-metrics {
            display: flex;
            gap: 15px;
            margin-top: 5px;
            font-size: 11px;
        }
        .issues {
            margin-top: 10px;
            padding: 10px;
            background: var(--vscode-inputValidation-errorBackground);
            border-left: 3px solid #ff4444;
            border-radius: 3px;
        }
        .issue-item {
            margin: 5px 0;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌀 RBI Coherence Dashboard</h1>
        <p>Resonance-Based Intelligence architectural coherence monitoring</p>
    </div>

    <div class="metrics">
        <div class="metric">
            <div class="metric-value">${Math.round(overallCoherence * 100)}%</div>
            <div class="metric-label">Overall Coherence</div>
            <div class="coherence-bar">
                <div class="coherence-fill" style="width: ${overallCoherence * 100}%"></div>
            </div>
        </div>
        <div class="metric">
            <div class="metric-value">${results.length}</div>
            <div class="metric-label">Files Analyzed</div>
        </div>
        <div class="metric">
            <div class="metric-value">${lowCoherenceFiles.length}</div>
            <div class="metric-label">Low Coherence Files</div>
        </div>
    </div>

    ${lowCoherenceFiles.length > 0 ? `
    <div class="file-list">
        <h2>Files Requiring Attention</h2>
        ${lowCoherenceFiles.map(file => `
            <div class="file-item low-coherence">
                <div class="file-path">${this.escapeHtml(file.filePath)}</div>
                <div class="file-metrics">
                    <span>Coherence: ${Math.round(file.coherence * 100)}%</span>
                    <span>Resonance: ${Math.round(file.resonance * 100)}%</span>
                    <span>Validity: ${file.validity}</span>
                </div>
                ${file.issues.length > 0 ? `
                    <div class="issues">
                        ${file.issues.map(issue => `
                            <div class="issue-item">⚠️ ${this.escapeHtml(issue)}</div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
    ` : '<p style="color: var(--vscode-descriptionForeground);">All files meet coherence thresholds! ✨</p>'}

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--vscode-panel-border);">
        <p style="font-size: 11px; color: var(--vscode-descriptionForeground);">
            Last updated: ${new Date().toLocaleString()}<br>
            Use command "RBI: Analyze Workspace" to refresh analysis
        </p>
    </div>
</body>
</html>`;
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    dispose(): void {
        if (this.panel) {
            this.panel.dispose();
        }
        this.disposables.forEach(d => d.dispose());
    }
}
