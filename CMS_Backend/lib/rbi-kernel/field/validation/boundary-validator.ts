/**
 * Boundary Validation Framework
 * 
 * Enables semantic value validation by comparing actual values against boundaries.
 * Supports domain-specific validators through a plugin architecture.
 * 
 * Architecture Layer: 4 (Validation) - Boundary Validation Extension
 */

export type ComparisonOperator = '>' | '<' | '>=' | '<=' | '==' | '!=' | 'in' | 'not-in';

/**
 * Boundary violation result
 */
export interface BoundaryViolation {
  path: string; // JSON path to the violating value (e.g., "portfolio.currentRisk")
  actualValue: any;
  expectedBoundary: any;
  operator: ComparisonOperator;
  severity: 'critical' | 'warning' | 'info';
  message: string;
}

/**
 * Boundary validation result
 */
export interface BoundaryValidationResult {
  valid: boolean;
  violations: BoundaryViolation[];
  adjustedCoherence: number; // Coherence score adjusted for violations (0-1)
  originalCoherence: number; // Original coherence before boundary validation
}

/**
 * Boundary rule definition
 */
export interface BoundaryRule {
  id: string;
  path: string; // JSON path to value to check (e.g., "portfolio.currentRisk")
  operator: ComparisonOperator;
  boundaryPath: string; // JSON path to boundary value (e.g., "riskBoundaries.limits.maxRisk")
  severity: 'critical' | 'warning' | 'info';
  message?: string; // Custom violation message
}

/**
 * Base validator interface - all domain-specific validators implement this
 */
export interface BoundaryValidator {
  /**
   * Unique identifier for this validator
   */
  id: string;
  
  /**
   * Human-readable name
   */
  name: string;
  
  /**
   * Domain/sector this validator is for (e.g., "finance", "cybersecurity")
   */
  domain: string;
  
  /**
   * Validate content against boundaries
   * @param content - The content to validate (can be object or string)
   * @param boundaries - The boundary definitions to check against
   * @param originalCoherence - The coherence score before boundary validation
   * @returns Boundary validation result
   */
  validate(
    content: any,
    boundaries: any,
    originalCoherence: number
  ): BoundaryValidationResult;
  
  /**
   * Get the rules this validator will check
   * @param boundaries - The boundary definitions
   * @returns Array of boundary rules
   */
  getRules(boundaries: any): BoundaryRule[];
}

/**
 * Extract value from object using dot-notation path
 * @param obj - Object to extract from
 * @param path - Dot-notation path (e.g., "portfolio.currentRisk")
 * @returns Extracted value or undefined if path doesn't exist
 */
export function extractValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }
  
  return current;
}

/**
 * Compare two values using the specified operator
 * @param actual - Actual value
 * @param expected - Expected/boundary value
 * @param operator - Comparison operator
 * @returns True if comparison passes, false otherwise
 */
export function compareValues(
  actual: any,
  expected: any,
  operator: ComparisonOperator
): boolean {
  // Handle 'in' and 'not-in' operators (for array membership)
  if (operator === 'in') {
    if (!Array.isArray(expected)) return false;
    return expected.includes(actual);
  }
  
  if (operator === 'not-in') {
    if (!Array.isArray(expected)) return true;
    return !expected.includes(actual);
  }
  
  // Convert to numbers for numeric comparisons
  const actualNum = typeof actual === 'number' ? actual : Number(actual);
  const expectedNum = typeof expected === 'number' ? expected : Number(expected);
  
  // If conversion failed, fall back to string comparison
  if (isNaN(actualNum) || isNaN(expectedNum)) {
    const actualStr = String(actual);
    const expectedStr = String(expected);
    
    switch (operator) {
      case '==': return actualStr === expectedStr;
      case '!=': return actualStr !== expectedStr;
      default: return false; // Can't do >, <, >=, <= on non-numeric strings
    }
  }
  
  // Numeric comparisons
  switch (operator) {
    case '>': return actualNum > expectedNum;
    case '<': return actualNum < expectedNum;
    case '>=': return actualNum >= expectedNum;
    case '<=': return actualNum <= expectedNum;
    case '==': return actualNum === expectedNum;
    case '!=': return actualNum !== expectedNum;
    default: return false;
  }
}

/**
 * Calculate coherence adjustment based on violations
 * @param originalCoherence - Original coherence score (0-1)
 * @param violations - Array of boundary violations
 * @returns Adjusted coherence score (0-1)
 */
export function adjustCoherenceForViolations(
  originalCoherence: number,
  violations: BoundaryViolation[]
): number {
  if (violations.length === 0) {
    return originalCoherence;
  }
  
  let penalty = 0;
  
  for (const violation of violations) {
    switch (violation.severity) {
      case 'critical':
        penalty += 0.3; // 30% penalty per critical violation
        break;
      case 'warning':
        penalty += 0.1; // 10% penalty per warning
        break;
      case 'info':
        penalty += 0.05; // 5% penalty per info violation
        break;
    }
  }
  
  // Cap penalty at 0.5 (50% max reduction)
  penalty = Math.min(penalty, 0.5);
  
  // Adjust coherence: subtract penalty, ensure it stays in 0-1 range
  const adjusted = Math.max(0, Math.min(1, originalCoherence - penalty));
  
  return adjusted;
}

/**
 * Validate a single boundary rule
 * @param content - Content to validate
 * @param rule - Boundary rule to check
 * @param boundaries - Boundary definitions
 * @returns Boundary violation if rule fails, null if passes
 */
export function validateBoundaryRule(
  content: any,
  rule: BoundaryRule,
  boundaries: any
): BoundaryViolation | null {
  // Extract actual value from content
  const actualValue = extractValue(content, rule.path);
  
  // Extract boundary value from boundaries
  const boundaryValue = extractValue(boundaries, rule.boundaryPath);
  
  // If either value is missing, can't validate
  if (actualValue === undefined || boundaryValue === undefined) {
    return null; // Skip validation if path doesn't exist
  }
  
  // Perform comparison
  const passes = compareValues(actualValue, boundaryValue, rule.operator);
  
  if (passes) {
    return null; // Rule passes, no violation
  }
  
  // Rule fails, create violation
  return {
    path: rule.path,
    actualValue,
    expectedBoundary: boundaryValue,
    operator: rule.operator,
    severity: rule.severity,
    message: rule.message || `Value at ${rule.path} violates boundary: ${actualValue} ${rule.operator} ${boundaryValue}`
  };
}

/**
 * Generic boundary validator - validates content against boundary rules
 * @param content - Content to validate
 * @param boundaries - Boundary definitions
 * @param rules - Array of boundary rules to check
 * @param originalCoherence - Original coherence score
 * @returns Boundary validation result
 */
export function validateBoundaries(
  content: any,
  boundaries: any,
  rules: BoundaryRule[],
  originalCoherence: number
): BoundaryValidationResult {
  const violations: BoundaryViolation[] = [];
  
  // Validate each rule
  for (const rule of rules) {
    const violation = validateBoundaryRule(content, rule, boundaries);
    if (violation) {
      violations.push(violation);
    }
  }
  
  // Adjust coherence based on violations
  const adjustedCoherence = adjustCoherenceForViolations(originalCoherence, violations);
  
  return {
    valid: violations.length === 0,
    violations,
    adjustedCoherence,
    originalCoherence
  };
}

