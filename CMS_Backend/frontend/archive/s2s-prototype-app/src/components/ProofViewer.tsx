'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/backend/Card';
import { Button } from '@/components/backend/Button';

interface ProofLog {
  id: string;
  timestamp: string;
  content: string;
  title?: string;
  proofType: 'sovereign_logic' | 'coc_validation' | 'resonance_analysis' | 'coherence_calculus';
  status: 'proven' | 'disproven' | 'inconclusive' | 'error';
  steps: Array<{
    step: number;
    description: string;
    result: 'success' | 'failure' | 'warning';
    details?: string;
    timestamp: string;
  }>;
  resonanceVector?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  orbAssociations?: number[];
  fieldDynamics?: {
    fieldStrength: number;
    gradient: number[];
    stability: number;
    coherence: number;
  };
  sovereignLogic?: {
    validity: 'proven' | 'disproven' | 'inconclusive';
    proofSteps: string[];
    logicalConsistency: number;
  };
  cocValidation?: {
    coherenceScore: number;
    validatedOrbs: number[];
    explanation: string;
  };
  metadata: {
    processingTime: number;
    engineVersion: string;
    contentLength: number;
  };
}

interface ProofViewerProps {
  className?: string;
}

export default function ProofViewer({ className = '' }: ProofViewerProps) {
  const [logs, setLogs] = useState<ProofLog[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ProofLog | null>(null);
  const [filter, setFilter] = useState<'all' | 'proven' | 'disproven' | 'inconclusive' | 'error'>('all');

  useEffect(() => {
    loadRecentProofs();
  }, [filter]);

  const loadRecentProofs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.set('status', filter);
      }
      params.set('limit', '20');

      const response = await fetch(`/api/proofs/recent?${params}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error loading proof logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'proven': return 'text-green-600 bg-green-50';
      case 'disproven': return 'text-red-600 bg-red-50';
      case 'inconclusive': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sovereign_logic': return 'Sovereign Logic';
      case 'coc_validation': return 'CoC Validation';
      case 'resonance_analysis': return 'Resonance Analysis';
      case 'coherence_calculus': return 'Coherence Calculus';
      default: return type;
    }
  };

  const formatVector = (vector?: { x: number; y: number; z: number; w: number }) => {
    if (!vector) return 'N/A';
    return `(${vector.x.toFixed(2)}, ${vector.y.toFixed(2)}, ${vector.z.toFixed(2)}, ${vector.w.toFixed(2)})`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-backend-primary mx-auto"></div>
          <p className="mt-2 text-backend-muted">Loading proof logs...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Overview */}
      {statistics && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-backend-primary mb-4">Proof Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-backend-primary">{statistics.total}</div>
              <div className="text-sm text-backend-muted">Total Proofs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(statistics.successRate * 100)}%</div>
              <div className="text-sm text-backend-muted">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-backend-primary">{statistics.byStatus.proven}</div>
              <div className="text-sm text-backend-muted">Proven</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-backend-primary">{Math.round(statistics.averageProcessingTime)}ms</div>
              <div className="text-sm text-backend-muted">Avg Processing</div>
            </div>
          </div>
        </Card>
      )}

      {/* Filter Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({statistics?.total || 0})
          </Button>
          <Button
            variant={filter === 'proven' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('proven')}
          >
            Proven ({statistics?.byStatus.proven || 0})
          </Button>
          <Button
            variant={filter === 'disproven' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('disproven')}
          >
            Disproven ({statistics?.byStatus.disproven || 0})
          </Button>
          <Button
            variant={filter === 'inconclusive' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('inconclusive')}
          >
            Inconclusive ({statistics?.byStatus.inconclusive || 0})
          </Button>
          <Button
            variant={filter === 'error' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('error')}
          >
            Errors ({statistics?.byStatus.error || 0})
          </Button>
        </div>
      </Card>

      {/* Proof Logs List */}
      <div className="space-y-4">
        {logs.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-backend-muted">No proof logs found for the selected filter.</p>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-backend-muted">{getTypeLabel(log.proofType)}</span>
                    <span className="text-xs text-backend-muted">{formatTimestamp(log.timestamp)}</span>
                  </div>
                  
                  <div className="text-sm text-backend-secondary mb-2">
                    {log.title && <strong>{log.title}</strong>}
                    {log.title && <br />}
                    {log.content.substring(0, 100)}...
                  </div>

                  {log.resonanceVector && (
                    <div className="text-xs text-backend-muted mb-2">
                      <strong>Resonance Vector:</strong> {formatVector(log.resonanceVector)}
                    </div>
                  )}

                  {log.orbAssociations && log.orbAssociations.length > 0 && (
                    <div className="text-xs text-backend-muted mb-2">
                      <strong>Orb Associations:</strong> {log.orbAssociations.join(', ')}
                    </div>
                  )}

                  <div className="text-xs text-backend-muted">
                    {log.steps.length} steps • {log.metadata.processingTime}ms • {log.metadata.contentLength} chars
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedLog(log)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detailed Proof Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-backend-primary">Proof Details</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <h4 className="font-medium text-backend-primary mb-2">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Status:</strong> <span className={getStatusColor(selectedLog.status)}>{selectedLog.status}</span>
                    </div>
                    <div>
                      <strong>Type:</strong> {getTypeLabel(selectedLog.proofType)}
                    </div>
                    <div>
                      <strong>Timestamp:</strong> {formatTimestamp(selectedLog.timestamp)}
                    </div>
                    <div>
                      <strong>Processing Time:</strong> {selectedLog.metadata.processingTime}ms
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h4 className="font-medium text-backend-primary mb-2">Content</h4>
                  <div className="bg-backend-secondary p-3 rounded text-sm">
                    {selectedLog.title && <strong>{selectedLog.title}</strong>}
                    {selectedLog.title && <br />}
                    {selectedLog.content}
                  </div>
                </div>

                {/* Mathematical Data */}
                {selectedLog.resonanceVector && (
                  <div>
                    <h4 className="font-medium text-backend-primary mb-2">Resonance Vector</h4>
                    <div className="bg-backend-secondary p-3 rounded text-sm">
                      <div><strong>Clarity (X):</strong> {selectedLog.resonanceVector.x.toFixed(4)}</div>
                      <div><strong>Coherence (Y):</strong> {selectedLog.resonanceVector.y.toFixed(4)}</div>
                      <div><strong>Resonance (Z):</strong> {selectedLog.resonanceVector.z.toFixed(4)}</div>
                      <div><strong>Sovereignty (W):</strong> {selectedLog.resonanceVector.w.toFixed(4)}</div>
                    </div>
                  </div>
                )}

                {/* Field Dynamics */}
                {selectedLog.fieldDynamics && (
                  <div>
                    <h4 className="font-medium text-backend-primary mb-2">Field Dynamics</h4>
                    <div className="bg-backend-secondary p-3 rounded text-sm">
                      <div><strong>Field Strength:</strong> {selectedLog.fieldDynamics.fieldStrength.toFixed(4)}</div>
                      <div><strong>Stability:</strong> {selectedLog.fieldDynamics.stability.toFixed(4)}</div>
                      <div><strong>Coherence:</strong> {selectedLog.fieldDynamics.coherence.toFixed(4)}</div>
                    </div>
                  </div>
                )}

                {/* Proof Steps */}
                <div>
                  <h4 className="font-medium text-backend-primary mb-2">Proof Steps</h4>
                  <div className="space-y-2">
                    {selectedLog.steps.map((step, index) => (
                      <div key={index} className="bg-backend-secondary p-3 rounded text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Step {step.step}:</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            step.result === 'success' ? 'bg-green-100 text-green-800' :
                            step.result === 'failure' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {step.result.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-backend-secondary">{step.description}</div>
                        {step.details && (
                          <div className="text-backend-muted mt-1 text-xs">{step.details}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
