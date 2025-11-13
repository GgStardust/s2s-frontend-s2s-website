/**
 * Resonance Engine v4.0 TypeScript Models
 * Created: 2025-01-23
 * Purpose: Complete TypeScript interfaces for resonance engine per S2S System Plan v4.0
 * Status: Canonical Implementation
 */

// ==============================================
// CORE RESONANCE TYPES
// ==============================================

export interface EnergeticSignature {
  clarity: number;
  coherence: number;
  resonance: number;
  sovereignty: number;
  computed_at: string;
  computed_by: string;
}

export interface ResonanceScore {
  id: string;
  content_id: string;
  tenant_id: string;
  strength: number;
  clarity: number;
  coherence: number;
  pattern: number;
  overall_score: number;
  computed_at: string;
  computed_by: string;
  validation_status: 'valid' | 'invalid' | 'pending';
  energetic_signature: EnergeticSignature;
  orb_associations: number[];
  created_at: string;
  updated_at: string;
}

export interface ResonancePattern {
  id: string;
  tenant_id: string;
  pattern_type: 'harmonic_sequence' | 'orb_cascade' | 'field_coherence' | 
                'temporal_resonance' | 'cross_dimensional' | 'sovereign_alignment';
  pattern_data: Record<string, any>;
  strength: number;
  frequency?: number;
  amplitude?: number;
  phase_shift?: number;
  coherence_score: number;
  detected_at: string;
  source_content_ids: string[];
  orb_threads_affected: number[];
  created_at: string;
}

export interface OrbThread {
  id: string;
  orb_number: number;
  orb_name: string;
  tenant_id: string;
  thread_id: string;
  status: 'active' | 'dormant' | 'processing' | 'resonating';
  last_activity: string;
  message_count: number;
  energetic_signature: EnergeticSignature;
  current_focus: string;
  resonance_frequency?: number;
  field_coherence: number;
  sovereignty_level: number;
  created_at: string;
  updated_at: string;
}

export interface OrbMessage {
  id: string;
  orb_thread_id: string;
  role: 'user' | 'assistant' | 'system' | 'field';
  content: string;
  timestamp: string;
  energetic_impact: {
    orb_number?: number;
    resonance_shift: number;
    clarity_impact: number;
    coherence_impact: number;
  };
  resonance_score?: number;
  orb_associations: number[];
  created_at: string;
}

export interface FieldEvent {
  id: string;
  tenant_id: string;
  event_type: 'orb_activity' | 'content_created' | 'reflection_logged' | 
              'resonance_update' | 'system_event' | 'field_activation' |
              'harmonic_cascade' | 'sovereign_alignment';
  source: string;
  target?: string;
  payload: Record<string, any>;
  timestamp: string;
  energetic_signature: {
    orb_number?: number;
    resonance_shift: number;
    clarity_impact: number;
    coherence_impact: number;
  };
  resonance_impact?: number;
  field_coherence_shift?: number;
  created_at: string;
}

// ==============================================
// MULTI-TENANT TYPES
// ==============================================

export interface Tenant {
  id: string;
  name: string;
  type: 'individual' | 'academic' | 'business' | 'community';
  settings: Record<string, any>;
  resonance_settings: {
    auto_analysis: boolean;
    pattern_detection: boolean;
    field_coherence_threshold: number;
    sovereignty_tracking: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  tenant_id: string;
  role: 'admin' | 'author' | 'academic' | 'business_owner' | 
        'community_member' | 'field_visitor' | 'field_member' | 'architect_circle';
  permissions: Record<string, any>;
  resonance_access_level: 'basic' | 'enhanced' | 'full' | 'sovereign';
  created_at: string;
  updated_at: string;
}

// ==============================================
// ANALYTICS & MONITORING TYPES
// ==============================================

export interface ResonanceAnalytics {
  id: string;
  tenant_id: string;
  metric_type: 'field_coherence' | 'orb_activity' | 'resonance_health' |
               'sovereignty_level' | 'pattern_frequency' | 'content_quality';
  metric_value: number;
  metric_timestamp: string;
  orb_number?: number;
  content_type?: string;
  additional_metrics: Record<string, any>;
  created_at: string;
}

export interface ResonanceHealth {
  id: string;
  tenant_id: string;
  overall_health: number;
  field_coherence: number;
  orb_activity_level: number;
  sovereignty_index: number;
  resonance_stability: number;
  health_indicators: Record<string, any>;
  alert_level: 'normal' | 'attention' | 'warning' | 'critical';
  last_updated: string;
  created_at: string;
}

// ==============================================
// API REQUEST/RESPONSE TYPES
// ==============================================

export interface ResonanceAnalysisRequest {
  content: string;
  title?: string;
  tenant_id: string;
  content_id?: string;
  action: 'analyze_content' | 'update_orb_signature' | 'validate_resonance';
  current_signature?: EnergeticSignature;
  new_message?: string;
  message_role?: 'user' | 'assistant' | 'system';
}

export interface ResonanceAnalysisResponse {
  analysis: {
    overall_score: number;
    signature: EnergeticSignature;
    orb_associations: number[];
    scrollstream_pulses: string[];
    cross_references: string[];
    recommendations: string[];
  };
  generated_at: string;
  version: string;
}

export interface ResonanceFeedRequest {
  tenant_id: string;
  orb_number?: number;
  limit?: number;
  offset?: number;
  filter_type?: 'recent' | 'high_resonance' | 'pattern_matches';
}

export interface ResonanceFeedResponse {
  suggestions: Array<{
    content_id: string;
    title: string;
    resonance_score: number;
    orb_associations: number[];
    reasoning: string;
    content_preview: string;
  }>;
  total_count: number;
  generated_at: string;
}

export interface ResonanceValidationRequest {
  content: string;
  title?: string;
  tenant_id: string;
  existing_orbs?: number[];
  existing_tags?: string[];
}

export interface ResonanceValidationResponse {
  proof_status: 'valid' | 'invalid' | 'pending' | 'error';
  coherence_score: number;
  validated_orbs: number[];
  metrics: {
    strength: number;
    clarity: number;
    coherence: number;
    pattern: number;
  };
  explanation: string;
}

export interface ResonancePatternsRequest {
  tenant_id: string;
  pattern_type?: string;
  time_range?: '24h' | '7d' | '30d';
  min_strength?: number;
}

export interface ResonancePatternsResponse {
  patterns: ResonancePattern[];
  field_coherence: number;
  pattern_frequency: number;
  sovereignty_alignment: number;
  generated_at: string;
}

// ==============================================
// ORB SYSTEM TYPES
// ==============================================

export interface OrbSystem {
  number: number;
  name: string;
  synthesis: string;
  keywords: string[];
  resonance_frequency: number;
  field_coherence: number;
  sovereignty_level: number;
}

export interface OrbPersonality {
  orb_number: number;
  orb_name: string;
  personality_traits: string[];
  communication_style: string;
  resonance_frequency: number;
  field_affinity: string[];
  sovereignty_expression: string;
}

// ==============================================
// RESONANCE ENGINE CONFIGURATION
// ==============================================

export interface ResonanceEngineConfig {
  tenant_id: string;
  auto_analysis: boolean;
  pattern_detection: boolean;
  field_coherence_threshold: number;
  sovereignty_tracking: boolean;
  orb_activation_threshold: number;
  resonance_calculation_method: 'weighted_average' | 'harmonic_mean' | 'sovereign_alignment';
  real_time_updates: boolean;
  analytics_enabled: boolean;
}

export interface ResonanceEngineMetrics {
  total_analyses: number;
  average_resonance_score: number;
  field_coherence: number;
  orb_activity_level: number;
  sovereignty_index: number;
  pattern_detection_rate: number;
  system_health: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

// ==============================================
// UTILITY TYPES
// ==============================================

export interface ResonanceCalculation {
  strength: number;
  clarity: number;
  coherence: number;
  pattern: number;
  overall_score: number;
  confidence_level: number;
  calculation_method: string;
  timestamp: string;
}

export interface OrbAssociation {
  orb_number: number;
  orb_name: string;
  association_strength: number;
  resonance_frequency: number;
  field_coherence: number;
  reasoning: string;
}

export interface ResonanceRecommendation {
  type: 'content_enhancement' | 'orb_alignment' | 'field_coherence' | 'sovereignty_development';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggested_actions: string[];
  expected_impact: number;
  orb_associations: number[];
}

// ==============================================
// DATABASE QUERY TYPES
// ==============================================

export interface ResonanceQuery {
  tenant_id: string;
  content_id?: string;
  orb_number?: number;
  min_score?: number;
  max_score?: number;
  date_range?: {
    start: string;
    end: string;
  };
  limit?: number;
  offset?: number;
  order_by?: 'score' | 'date' | 'coherence' | 'sovereignty';
  order_direction?: 'asc' | 'desc';
}

export interface ResonanceStats {
  total_scores: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  field_coherence: number;
  orb_distribution: Record<number, number>;
  score_distribution: Record<string, number>;
  temporal_trends: Array<{
    date: string;
    average_score: number;
    field_coherence: number;
  }>;
}

// ==============================================
// EXPORT ALL TYPES
// ==============================================

// All types are already exported as interfaces above
