/**
 * Resonance Validation Panel Component
 * 
 * Displays real-time resonance validation results:
 * - Resonance vectors visualization
 * - Coherence validation status
 * - Proof logging display
 * - Orb mapping visualization
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Badge, Progress } from '@/components/backend';
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ResonanceMetrics {
  strength: number;
  clarity: number;
  coherence: number;
  pattern: number;
}

interface ValidationResult {
  isValid: boolean;
  coherence: number;
  sovereignty: number;
  proof: any;
  errors?: string[];
}

interface ResonanceValidationPanelProps {
  content?: string;
  onValidationComplete?: (result: ValidationResult) => void;
  className?: string;
}

export function ResonanceValidationPanel({
  content,
  onValidationComplete,
  className = ''
}: ResonanceValidationPanelProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [resonanceMetrics, setResonanceMetrics] = useState<ResonanceMetrics | null>(null);
  const [orbAssociations, setOrbAssociations] = useState<number[]>([]);
  const [proofLog, setProofLog] = useState<any>(null);

  const validateContent = useCallback(async () => {
    if (!content) return;

    setIsValidating(true);
    setValidationResult(null);
    setResonanceMetrics(null);
    setOrbAssociations([]);
    setProofLog(null);

    try {
      // Call the resonance analysis API
      const response = await fetch('/api/resonance/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract validation results
      const result: ValidationResult = {
        isValid: data.isValid || false,
        coherence: data.coherence || 0,
        sovereignty: data.sovereignty || 0,
        proof: data.proof || null,
        errors: data.errors || []
      };

      setValidationResult(result);
      
      // Extract resonance metrics
      if (data.resonanceMetrics) {
        setResonanceMetrics(data.resonanceMetrics);
      }
      
      // Extract Orb associations
      if (data.orbAssociations) {
        setOrbAssociations(data.orbAssociations);
      }
      
      // Extract proof log
      if (data.proofLog) {
        setProofLog(data.proofLog);
      }

      // Notify parent component
      if (onValidationComplete) {
        onValidationComplete(result);
      }

    } catch (error) {
      console.error('Validation error:', error);
      
      const errorResult: ValidationResult = {
        isValid: false,
        coherence: 0,
        sovereignty: 0,
        proof: null,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      
      setValidationResult(errorResult);
      
      if (onValidationComplete) {
        onValidationComplete(errorResult);
      }
    } finally {
      setIsValidating(false);
    }
  }, [content, onValidationComplete]);

  useEffect(() => {
    if (content) {
      validateContent();
    }
  }, [content, validateContent]);

  const getValidationIcon = () => {
    if (isValidating) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    }
    
    if (!validationResult) {
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
    
    if (validationResult.isValid) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getValidationStatus = () => {
    if (isValidating) return 'Validating...';
    if (!validationResult) return 'Ready to validate';
    if (validationResult.isValid) return 'Validated';
    return 'Validation failed';
  };

  const getValidationColor = () => {
    if (isValidating) return 'text-blue-600';
    if (!validationResult) return 'text-gray-600';
    if (validationResult.isValid) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Validation Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-backend-primary">
            Resonance Validation
          </h3>
          <div className="flex items-center space-x-2">
            {getValidationIcon()}
            <span className={`font-medium ${getValidationColor()}`}>
              {getValidationStatus()}
            </span>
          </div>
        </div>

        {validationResult && (
          <div className="space-y-3">
            {/* Coherence Score */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-backend-secondary">Coherence</span>
                <span className="font-medium">{validationResult.coherence.toFixed(2)}</span>
              </div>
              <Progress 
                value={validationResult.coherence * 10} 
                className="h-2"
              />
            </div>

            {/* Sovereignty Score */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-backend-secondary">Sovereignty</span>
                <span className="font-medium">{validationResult.sovereignty.toFixed(2)}</span>
              </div>
              <Progress 
                value={validationResult.sovereignty * 10} 
                className="h-2"
              />
            </div>

            {/* Errors */}
            {validationResult.errors && validationResult.errors.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-red-600 mb-2">Validation Errors:</h4>
                <ul className="space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Resonance Metrics */}
      {resonanceMetrics && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-backend-primary mb-4">
            Resonance Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-backend-secondary">Strength</span>
                <span className="font-medium">{resonanceMetrics.strength.toFixed(1)}</span>
              </div>
              <Progress value={resonanceMetrics.strength * 10} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-backend-secondary">Clarity</span>
                <span className="font-medium">{resonanceMetrics.clarity.toFixed(1)}</span>
              </div>
              <Progress value={resonanceMetrics.clarity * 10} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-backend-secondary">Coherence</span>
                <span className="font-medium">{resonanceMetrics.coherence.toFixed(1)}</span>
              </div>
              <Progress value={resonanceMetrics.coherence * 10} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-backend-secondary">Pattern</span>
                <span className="font-medium">{resonanceMetrics.pattern.toFixed(1)}</span>
              </div>
              <Progress value={resonanceMetrics.pattern * 10} className="h-2" />
            </div>
          </div>
        </Card>
      )}

      {/* Orb Associations */}
      {orbAssociations.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-backend-primary mb-4">
            Orb Associations
          </h3>
          <div className="flex flex-wrap gap-2">
            {orbAssociations.map((orbId) => (
              <Badge key={orbId} variant="secondary" className="text-sm">
                Orb {orbId}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Proof Log */}
      {proofLog && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-backend-primary mb-4">
            Proof Log
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-backend-secondary">Proof ID:</span>
              <span className="font-mono text-xs">{proofLog.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-backend-secondary">Type:</span>
              <span className="font-medium">{proofLog.type}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-backend-secondary">Validity:</span>
              <Badge 
                variant={proofLog.overallValidity === 'proven' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {proofLog.overallValidity}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-backend-secondary">Steps:</span>
              <span className="font-medium">{proofLog.steps?.length || 0}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Manual Validation Button */}
      <div className="flex justify-end">
        <Button 
          onClick={validateContent}
          disabled={isValidating || !content}
          variant="secondary"
          size="sm"
        >
          {isValidating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Validating...
            </>
          ) : (
            'Validate Content'
          )}
        </Button>
      </div>
    </div>
  );
}
