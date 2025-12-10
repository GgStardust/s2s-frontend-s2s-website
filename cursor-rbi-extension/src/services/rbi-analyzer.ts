/**
 * RBI Analyzer Service
 * 
 * Integrates with RBI-Kernel to analyze code coherence.
 * Handles file analysis, workspace scanning, and coherence computation.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
// Dynamic import for ES module compatibility
// Note: RBI-Kernel uses ES modules, so we'll use dynamic imports
type EnhancedResonanceEngine = any;
type ContentMetadata = any;
type EnhancedResonanceAnalysis = any;

// We'll load RBI-Kernel dynamically to handle ES module imports
let RBIModule: any = null;

export interface FileCoherenceResult {
    filePath: string;
    coherence: number;
    resonance: number;
    clarity: number;
    sovereignty: number;
    validity: 'proven' | 'partial' | 'unproven';
    issues: string[];
    lastAnalyzed: Date;
}

export class RBIAnalyzer {
    private engine: EnhancedResonanceEngine | null = null;
    private results: Map<string, FileCoherenceResult> = new Map();
    private config: vscode.WorkspaceConfiguration;
    private rbiKernelPath: string;
    private initializationPromise: Promise<void> | null = null;

    constructor(private context: vscode.ExtensionContext) {
        this.config = vscode.workspace.getConfiguration('rbi');
        this.rbiKernelPath = this.resolveRBIKernelPath();
        this.initializeRBI();
    }

    private async initializeRBI(): Promise<void> {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = (async () => {
            try {
                // For now, we'll use a simpler approach - import RBI-Kernel types
                // In production, you may want to build RBI-Kernel first and import from dist
                // or use a bundler to handle ES modules
                
                // Try to load RBI-Kernel dynamically
                // Note: This requires RBI-Kernel to be built first
                const rbiPath = path.join(this.rbiKernelPath, 'dist', 'field', 'computation', 'enhanced-engine.js');
                
                if (fs.existsSync(rbiPath)) {
                    // Dynamic import for ES modules
                    RBIModule = await import(rbiPath);
                    this.engine = RBIModule.EnhancedResonanceEngine.getInstance();
                } else {
                    // Fallback: Create a mock/stub for development
                    console.warn('RBI-Kernel not built. Please run "npm run build" in RBI-Kernel directory.');
                    vscode.window.showWarningMessage(
                        'RBI-Kernel not found. Please build RBI-Kernel first (npm run build in RBI-Kernel directory).'
                    );
                }
            } catch (error) {
                console.error('Failed to initialize RBI-Kernel:', error);
                vscode.window.showErrorMessage(`Failed to load RBI-Kernel: ${error}`);
            }
        })();

        return this.initializationPromise;
    }

    private resolveRBIKernelPath(): string {
        const configPath = this.config.get<string>('rbiKernelPath', '../RBI-Kernel');
        
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
            const absolutePath = path.resolve(workspaceRoot, configPath);
            
            if (fs.existsSync(absolutePath)) {
                return absolutePath;
            }
        }

        // Fallback: try relative to extension
        const extensionPath = this.context.extensionPath;
        const fallbackPath = path.resolve(extensionPath, configPath);
        
        if (fs.existsSync(fallbackPath)) {
            return fallbackPath;
        }

        // Last resort: try finding RBI-Kernel in workspace
        if (vscode.workspace.workspaceFolders) {
            for (const folder of vscode.workspace.workspaceFolders) {
                const possiblePath = path.join(folder.uri.fsPath, 'RBI-Kernel');
                if (fs.existsSync(possiblePath)) {
                    return possiblePath;
                }
            }
        }

        throw new Error(`RBI-Kernel not found. Please configure rbi.rbiKernelPath in settings.`);
    }

    async analyzeFile(filePath: string): Promise<FileCoherenceResult | null> {
        try {
            // Ensure RBI is initialized
            await this.initializeRBI();

            if (!this.engine) {
                console.warn('RBI engine not initialized');
                return null;
            }

            const uri = vscode.Uri.file(filePath);
            const document = await vscode.workspace.openTextDocument(uri);
            const content = document.getText();

            if (!content || content.trim().length === 0) {
                return null;
            }

            // Build metadata for code file
            const metadata: ContentMetadata = {
                field_function: {
                    content_purpose: 'code_file',
                    primary_mechanism: 'code_analysis',
                    console_context: 'ide_extension',
                },
                tags: ['code', 'development'],
                category: this.getFileCategory(filePath),
            };

            // Analyze with RBI
            const analysis = await this.engine.analyzeContentWithMathematics(
                content,
                path.basename(filePath),
                metadata
            );

            // Extract coherence metrics
            const coherence = analysis.mathematical.sovereignLogic.coherence;
            const resonance = analysis.mathematical.resonanceVector.resonance;
            const clarity = analysis.mathematical.resonanceVector.clarity;
            const sovereignty = analysis.mathematical.resonanceVector.sovereignty;
            const validity = analysis.mathematical.sovereignLogic.validity;

            // Identify issues
            const issues: string[] = [];
            const threshold = this.config.get<number>('coherenceThreshold', 0.7);

            if (coherence < threshold) {
                issues.push(`Low coherence: ${(coherence * 100).toFixed(1)}% (threshold: ${(threshold * 100).toFixed(0)}%)`);
            }

            if (validity === 'unproven') {
                issues.push('Proof-of-Meaning: unproven');
            } else if (validity === 'partial') {
                issues.push('Proof-of-Meaning: partial');
            }

            if (analysis.mathematical.fieldDynamics.stability < 0.5) {
                issues.push('Low field stability detected');
            }

            const result: FileCoherenceResult = {
                filePath,
                coherence,
                resonance,
                clarity,
                sovereignty,
                validity,
                issues,
                lastAnalyzed: new Date(),
            };

            this.results.set(filePath, result);
            return result;

        } catch (error) {
            console.error(`Error analyzing file ${filePath}:`, error);
            return null;
        }
    }

    async analyzeWorkspace(): Promise<void> {
        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
            return;
        }

        const patterns = this.config.get<string[]>('watchPatterns', ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']);
        
        for (const folder of vscode.workspace.workspaceFolders) {
            for (const pattern of patterns) {
                const files = await vscode.workspace.findFiles(
                    new vscode.RelativePattern(folder, pattern),
                    '**/node_modules/**',
                    100 // Limit to 100 files for initial analysis
                );

                for (const file of files) {
                    await this.analyzeFile(file.fsPath);
                }
            }
        }
    }

    async refresh(): Promise<void> {
        this.results.clear();
        await this.analyzeWorkspace();
    }

    getOverallCoherence(): number {
        if (this.results.size === 0) {
            return 0;
        }

        const coherences = Array.from(this.results.values()).map(r => r.coherence);
        return coherences.reduce((sum, c) => sum + c, 0) / coherences.length;
    }

    getFileResult(filePath: string): FileCoherenceResult | undefined {
        return this.results.get(filePath);
    }

    getAllResults(): FileCoherenceResult[] {
        return Array.from(this.results.values());
    }

    getLowCoherenceFiles(threshold?: number): FileCoherenceResult[] {
        const minCoherence = threshold ?? this.config.get<number>('coherenceThreshold', 0.7);
        return Array.from(this.results.values()).filter(r => r.coherence < minCoherence);
    }

    private getFileCategory(filePath: string): string {
        const ext = path.extname(filePath);
        if (['.ts', '.tsx'].includes(ext)) return 'typescript';
        if (['.js', '.jsx'].includes(ext)) return 'javascript';
        if (ext === '.py') return 'python';
        if (ext === '.rs') return 'rust';
        if (ext === '.go') return 'go';
        return 'code';
    }

    reloadConfiguration(): void {
        this.config = vscode.workspace.getConfiguration('rbi');
        this.rbiKernelPath = this.resolveRBIKernelPath();
    }

    dispose(): void {
        this.results.clear();
    }
}
