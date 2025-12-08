/**
 * Content Validation Service
 * 
 * Uses RBI Kernel to validate Codex entries and practices before serving them.
 * Ensures content meets coherence thresholds and Proof-of-Meaning validation.
 * 
 * Phase 7.1 Step 3: Add content coherence validation
 */

import { EnhancedResonanceEngine } from 'rbi-kernel/types';
import { loadCoreArchitecture, getOrbDefinition, getUndercurrentDefinition } from './architecture-loader';

interface ContentValidationResult {
  isValid: boolean;
  coherence: number;
  proofStatus: 'proven' | 'probable' | 'unproven' | 'unknown';
  fieldStrength: number;
  stability: number;
  validationErrors?: string[];
  warnings?: string[];
}

/**
 * Validate Codex entry with RBI
 * Returns validation result and optionally filters content
 */
export async function validateCodexEntry(
  entry: any,
  options: {
    minCoherence?: number; // Default: 0.7
    requireProof?: boolean; // Default: false (warn but don't block)
    validateOrbAssociations?: boolean; // Default: true
  } = {}
): Promise<ContentValidationResult> {
  const {
    minCoherence = 0.7,
    requireProof = false,
    validateOrbAssociations = true,
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const engine = EnhancedResonanceEngine.getInstance();
    const architecture = loadCoreArchitecture();

    // Validate orb associations against architecture
    if (validateOrbAssociations && entry.orb_associations) {
      const orbAssociations = Array.isArray(entry.orb_associations)
        ? entry.orb_associations
        : (typeof entry.orb_associations === 'string' ? JSON.parse(entry.orb_associations) : []);

      for (const orbNum of orbAssociations) {
        const orbDef = architecture.orbs.get(orbNum);
        if (!orbDef) {
          errors.push(`Orb ${orbNum} not found in architecture`);
        }
      }
    }

    // Validate undercurrent associations
    if (entry.undercurrent_associations) {
      const ucAssociations = Array.isArray(entry.undercurrent_associations)
        ? entry.undercurrent_associations
        : (typeof entry.undercurrent_associations === 'string' ? JSON.parse(entry.undercurrent_associations) : []);

      for (const ucNum of ucAssociations) {
        const ucDef = architecture.undercurrents.get(ucNum);
        if (!ucDef) {
          warnings.push(`Undercurrent ${ucNum} not found in architecture`);
        }
      }
    }

    // Extract content for RBI analysis
    const content = entry.content || entry.body || entry.text || '';
    if (!content || content.trim().length === 0) {
      errors.push('Content is empty');
      return {
        isValid: false,
        coherence: 0,
        proofStatus: 'unknown',
        fieldStrength: 0,
        stability: 0,
        validationErrors: errors,
        warnings,
      };
    }

    // Build ContentMetadata
    const orbAssociations = Array.isArray(entry.orb_associations)
      ? entry.orb_associations
      : (entry.orb_associations ? [entry.orb_associations] : []);

    const metadata = {
      orb_associations: orbAssociations.length > 0 ? orbAssociations : undefined,
      field_function: {
        content_purpose: 'codex_entry',
        primary_mechanism: 'content_validation',
        console_context: 'codex_reader',
      },
      tags: entry.console_tags || entry.tags || [],
      category: entry.codex_category || entry.category,
    };

    // Analyze with RBI
    const analysis = await engine.analyzeContentWithMathematics(
      content,
      entry.title || entry.name || 'Codex Entry',
      metadata
    );

    // Extract metrics
    const coherence = analysis.mathematical?.sovereignLogic?.coherence || 0;
    const proofStatus = analysis.mathematical?.sovereignLogic?.validity || 'unknown';
    const fieldStrength = analysis.mathematical?.fieldDynamics?.fieldStrength || 0;
    const stability = analysis.mathematical?.fieldDynamics?.stability || 0;

    // Validate coherence threshold
    if (coherence < minCoherence) {
      errors.push(`Coherence ${coherence.toFixed(3)} below minimum ${minCoherence}`);
    }

    // Validate proof status if required
    if (requireProof && proofStatus !== 'proven') {
      if (proofStatus === 'unproven') {
        errors.push('Content failed Proof-of-Meaning validation');
      } else {
        warnings.push(`Proof status: ${proofStatus} (not proven)`);
      }
    } else if (proofStatus !== 'proven') {
      warnings.push(`Proof status: ${proofStatus} (not proven)`);
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      coherence,
      proofStatus: proofStatus as 'proven' | 'probable' | 'unproven' | 'unknown',
      fieldStrength,
      stability,
      validationErrors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error: any) {
    console.error('[Content Validation] Error validating Codex entry:', error);
    return {
      isValid: false,
      coherence: 0,
      proofStatus: 'unknown',
      fieldStrength: 0,
      stability: 0,
      validationErrors: [`Validation error: ${error.message}`],
      warnings,
    };
  }
}

/**
 * Validate practice with RBI
 */
export async function validatePractice(
  practice: any,
  options: {
    minCoherence?: number; // Default: 0.7
    requireProof?: boolean; // Default: false
    validateOrbAssociations?: boolean; // Default: true
  } = {}
): Promise<ContentValidationResult> {
  const {
    minCoherence = 0.7,
    requireProof = false,
    validateOrbAssociations = true,
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const engine = EnhancedResonanceEngine.getInstance();
    const architecture = loadCoreArchitecture();

    // Validate orb associations from practice_orb_mappings
    if (validateOrbAssociations && practice.orb_mappings) {
      for (const mapping of practice.orb_mappings) {
        const orbDef = architecture.orbs.get(mapping.orb_number);
        if (!orbDef) {
          errors.push(`Orb ${mapping.orb_number} not found in architecture`);
        }
      }
    }

    // Extract content for RBI analysis
    const content = practice.description || practice.instructions || practice.content || '';
    if (!content || content.trim().length === 0) {
      errors.push('Practice content is empty');
      return {
        isValid: false,
        coherence: 0,
        proofStatus: 'unknown',
        fieldStrength: 0,
        stability: 0,
        validationErrors: errors,
        warnings,
      };
    }

    // Build ContentMetadata
    const orbAssociations = practice.orb_mappings
      ? practice.orb_mappings.map((m: any) => m.orb_number)
      : [];

    const metadata = {
      orb_associations: orbAssociations.length > 0 ? orbAssociations : undefined,
      field_function: {
        content_purpose: 'practice_module',
        primary_mechanism: 'content_validation',
        console_context: 'practice_reader',
      },
      tags: ['practice', `practice_${practice.id}`, practice.layer || ''],
      category: 'practice',
    };

    // Analyze with RBI
    const analysis = await engine.analyzeContentWithMathematics(
      content,
      practice.name || `Practice ${practice.id}`,
      metadata
    );

    // Extract metrics
    const coherence = analysis.mathematical?.sovereignLogic?.coherence || 0;
    const proofStatus = analysis.mathematical?.sovereignLogic?.validity || 'unknown';
    const fieldStrength = analysis.mathematical?.fieldDynamics?.fieldStrength || 0;
    const stability = analysis.mathematical?.fieldDynamics?.stability || 0;

    // Validate coherence threshold
    if (coherence < minCoherence) {
      errors.push(`Coherence ${coherence.toFixed(3)} below minimum ${minCoherence}`);
    }

    // Validate proof status if required
    if (requireProof && proofStatus !== 'proven') {
      if (proofStatus === 'unproven') {
        errors.push('Practice failed Proof-of-Meaning validation');
      } else {
        warnings.push(`Proof status: ${proofStatus} (not proven)`);
      }
    } else if (proofStatus !== 'proven') {
      warnings.push(`Proof status: ${proofStatus} (not proven)`);
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      coherence,
      proofStatus: proofStatus as 'proven' | 'probable' | 'unproven' | 'unknown',
      fieldStrength,
      stability,
      validationErrors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error: any) {
    console.error('[Content Validation] Error validating practice:', error);
    return {
      isValid: false,
      coherence: 0,
      proofStatus: 'unknown',
      fieldStrength: 0,
      stability: 0,
      validationErrors: [`Validation error: ${error.message}`],
      warnings,
    };
  }
}

/**
 * Batch validate multiple Codex entries
 * Returns entries with validation results
 */
export async function validateCodexEntries(
  entries: any[],
  options: {
    minCoherence?: number;
    requireProof?: boolean;
    filterInvalid?: boolean; // Default: false (return all with validation results)
  } = {}
): Promise<Array<{ entry: any; validation: ContentValidationResult }>> {
  const { filterInvalid = false } = options;

  const results = await Promise.all(
    entries.map(async (entry) => {
      const validation = await validateCodexEntry(entry, options);
      return { entry, validation };
    })
  );

  if (filterInvalid) {
    return results.filter(({ validation }) => validation.isValid);
  }

  return results;
}


