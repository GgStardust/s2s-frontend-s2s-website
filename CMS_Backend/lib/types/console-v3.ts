/**
 * Console V3 TypeScript Types
 * Created: 2025-01-26
 * Purpose: Type definitions for Console V3 diagnostic-led pathway system
 * Status: Phase 2 - Data Models
 */

// ==============================================
// DIAGNOSTIC SYSTEM TYPES
// ==============================================

export type DiagnosticResponseType = 'single_choice' | 'multi_choice' | 'scale';
export type DiagnosticSessionStatus = 'in_progress' | 'completed' | 'abandoned';
export type PracticeLayer = 'foundational' | 'functional' | 'advanced';
export type LayerFocus = 'foundational' | 'functional' | 'advanced' | 'all' | 'mixed';

export type QuestionSet = 'beta' | 'early_reader' | 'inquiry' | 'contextual' | 'system_generated';
export type QuestionSource = 'early_reader_feedback' | 'system_generated' | 'user_submitted' | 'beta_test';

export interface DiagnosticQuestion {
  id: number; // INTEGER in existing table
  question_text?: string; // Existing table uses question_text
  question_description?: string; // Existing table has this
  text?: string; // Alias for question_text for compatibility
  slug?: string;
  response_type: DiagnosticResponseType;
  answer_options?: string[]; // Existing table has answer_options array
  orb_weights: Record<string, number>; // {orb_1: number, orb_2: number, ...}
  undercurrent_weights?: Record<string, number>; // {uc_1: number, ...}
  practice_weights?: Record<string, number>; // {practice_1: number, ...} for readiness assessment
  tags?: string[]; // ["entry", "relational", "time", "signal", etc.]
  order_index: number; // Existing table uses order_index
  question_order?: number; // Alias for order_index for compatibility
  layer_focus?: LayerFocus;
  
  // Phase 2.5: Question Management Metadata
  question_set?: QuestionSet; // Classification: beta, early_reader, inquiry, contextual, system_generated
  source?: QuestionSource; // Source: early_reader_feedback, system_generated, user_submitted, beta_test
  inquiry_context?: string; // When to show this question (e.g., "after_practice_3", "when_orb_5_active")
  triggers?: Record<string, any>; // Field state triggers (JSONB): {"orb_profile": {"orb_5": 0.7}, ...}
  follow_up_question_ids?: number[]; // Array of question IDs that should follow this question
  selection_priority?: number; // Priority for question selection (1-10, higher = more likely)
  is_active?: boolean; // Whether this question is active and should be included
  
  created_at: string;
  updated_at: string;
}

export interface DiagnosticSession {
  id: string;
  user_id?: string; // Will reference users table when available
  email?: string; // For preorder/access token flow
  status: DiagnosticSessionStatus;
  
  // Diagnostic Results
  sfi_score?: number; // Sovereign Field Index score
  sfi_state?: string; // e.g. "coherent_forward_motion", "misaligned_momentum", etc.
  orb_profile: Record<string, number>; // {orb_1: number, orb_2: number, ...}
  undercurrent_profile: Record<string, number>; // {uc_1: number, ...}
  
  // Practice Readiness Assessment
  foundational_readiness: number; // 0.0 - 1.0
  functional_readiness: number; // 0.0 - 1.0
  advanced_readiness: number; // 0.0 - 1.0
  practice_readiness_profile: Record<string, number>; // {practice_1: readiness_score, ...}
  
  // Pathway Assignment
  recommended_pathway_template_id?: string; // References pathway_templates
  
  created_at: string;
  completed_at?: string;
  updated_at: string;
}

export interface DiagnosticResponse {
  id: string;
  session_id: string;
  question_id: number; // INTEGER to match diagnostic_questions.id
  raw_answer: string; // The actual answer (string/JSON)
  derived_signal: Record<string, any>; // Normalized representation if needed
  created_at: string;
}

// ==============================================
// PATHWAY SYSTEM TYPES
// ==============================================

export type PathwayStepType = 'reading' | 'reflection' | 'practice' | 'console_module' | 'codex_entry';
export type PathwayStatus = 'active' | 'completed' | 'paused' | 'archived';
export type PathwayStepStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface PathwayTemplate {
  id: string;
  slug: string;
  name: string;
  description?: string;
  
  // Orb & Practice Mapping
  orb_focus: number[]; // Which Orbs this pathway emphasizes (1-13)
  practice_sequence: number[]; // Ordered list of practice_ids (1-12)
  primary_practice?: number; // 1-12
  secondary_practices: number[]; // Supporting practices
  
  // Layer Classification
  layer_focus?: LayerFocus;
  
  // Metadata
  est_duration_days?: number;
  difficulty_level?: DifficultyLevel;
  
  created_at: string;
  updated_at: string;
}

export interface PathwayStep {
  id: string;
  pathway_template_id: string;
  step_number: number;
  type: PathwayStepType;
  
  // Content Reference
  codex_entry_id?: string; // References codex_entries (when available)
  practice_id?: number; // 1-12
  
  // Step Details
  title?: string;
  description?: string;
  instructions?: string;
  est_duration_minutes?: number;
  
  // Dependencies
  requires_step_ids: string[]; // Steps that must be completed first
  
  created_at: string;
  updated_at: string;
}

export interface UserPathway {
  id: string;
  user_id?: string; // Will reference users table when available
  email?: string; // For preorder/access token flow
  session_id: string; // References diagnostic_sessions
  pathway_template_id: string; // References pathway_templates
  
  // Progress State
  current_step_id?: string; // References pathway_steps
  completed_step_ids: string[];
  progress_percentage: number; // 0.0 - 100.0
  
  // Status
  status: PathwayStatus;
  
  started_at: string;
  completed_at?: string;
  updated_at: string;
}

export interface UserPathwayStepProgress {
  id: string;
  user_pathway_id: string;
  step_id: string;
  
  status: PathwayStepStatus;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  
  created_at: string;
  updated_at: string;
}

// ==============================================
// PRACTICE SYSTEM TYPES (All 12 Practices)
// ==============================================

export interface Practice {
  id: number; // 1-12
  name: string;
  layer: PracticeLayer;
  
  // Practice Details
  core_function?: string;
  what_it_trains: string[];
  daily_expression?: string;
  
  // Paradigm Alignment
  paradigm_elements: string[]; // Which paradigm elements this practice expresses
  
  created_at: string;
  updated_at: string;
}

export type PracticeOrbRelationshipType = 'primary' | 'secondary' | 'supporting';

export interface PracticeOrbMapping {
  id: string;
  practice_id: number; // 1-12
  orb_number: number; // 1-13
  relationship_type?: PracticeOrbRelationshipType;
  weight: number; // 0.0 - 1.0
  created_at: string;
}

// ==============================================
// ACCESS SYSTEM TYPES
// ==============================================

export type BillingType = 'one_time' | 'subscription';
export type ProductStatus = 'active' | 'inactive' | 'archived';
export type OrderStatus = 'pending' | 'paid' | 'refunded' | 'cancelled';
export type AccessTokenStatus = 'unclaimed' | 'active' | 'expired' | 'revoked';
export type UserProductStatus = 'active' | 'expired' | 'cancelled' | 'revoked';

export interface Product {
  id: string;
  code: string; // e.g. "LE_BOOK_PB", "CONSOLE_BETA", "CONSOLE_ONE_TIME"
  name: string;
  description?: string;
  price?: number;
  billing_type?: BillingType;
  access_duration_days?: number; // For one-time purchases
  includes_console_beta: boolean;
  status: ProductStatus;
  
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  email: string;
  product_code: string; // References products(code)
  amount: number;
  status: OrderStatus;
  
  // Shipping (for physical products)
  shipping_name?: string;
  shipping_address?: string;
  
  // Payment
  payment_provider?: string; // e.g. "stripe", "shopify"
  payment_id?: string; // External payment ID
  
  created_at: string;
  updated_at: string;
}

export interface AccessToken {
  id: string;
  user_id?: string; // Nullable until account is created
  email: string;
  product_code: string; // References products(code)
  token: string; // Encoded token for claim flow
  status: AccessTokenStatus;
  
  // Metadata
  metadata: Record<string, any>; // {preorder_batch: number, order_id: uuid, etc.}
  
  expires_at?: string;
  claimed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProduct {
  id: string;
  user_id?: string; // Will reference users table when available
  email?: string; // For preorder/access token flow
  product_code: string; // References products(code)
  access_token_id?: string; // References access_tokens
  order_id?: string; // References orders
  
  status: UserProductStatus;
  
  activated_at: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

// ==============================================
// COMPUTED/AGGREGATED TYPES
// ==============================================

export interface SFIResult {
  score: number; // 0.0 - 100.0
  state: string; // e.g. "coherent_forward_motion", "misaligned_momentum", etc.
  orb_profile: Record<string, number>; // {orb_1: number, ...}
  undercurrent_profile: Record<string, number>; // {uc_1: number, ...}
}

export interface PracticeReadinessAssessment {
  foundational_readiness: number; // 0.0 - 1.0
  functional_readiness: number; // 0.0 - 1.0
  advanced_readiness: number; // 0.0 - 1.0
  practice_readiness_profile: Record<string, number>; // {practice_1: readiness_score, ...}
}

export interface PathwayMatch {
  pathway_template: PathwayTemplate;
  match_score: number; // 0.0 - 1.0
  reasoning: string; // Why this pathway was matched
}

export interface DiagnosticResult {
  session: DiagnosticSession;
  sfi: SFIResult;
  readiness: PracticeReadinessAssessment;
  pathway_match?: PathwayMatch;
}

// ==============================================
// API REQUEST/RESPONSE TYPES
// ==============================================

export interface StartDiagnosticSessionRequest {
  email?: string;
  user_id?: string;
}

export interface StartDiagnosticSessionResponse {
  session_id: string;
  questions: DiagnosticQuestion[];
}

export interface SubmitDiagnosticResponseRequest {
  session_id: string;
  question_id: string;
  answer: string | number | number[]; // Depends on response_type
}

export interface SubmitDiagnosticResponseResponse {
  response_id: string;
  next_question?: DiagnosticQuestion;
  is_complete: boolean;
}

export interface CompleteDiagnosticSessionResponse {
  session: DiagnosticSession;
  result: DiagnosticResult;
  pathway?: UserPathway;
}

export interface GetPathwayRequest {
  user_id?: string;
  email?: string;
  session_id?: string;
}

export interface GetPathwayResponse {
  pathway: UserPathway;
  template: PathwayTemplate;
  steps: PathwayStep[];
  progress: UserPathwayStepProgress[];
}

export interface CompletePathwayStepRequest {
  user_pathway_id: string;
  step_id: string;
  notes?: string;
}

export interface CompletePathwayStepResponse {
  progress: UserPathwayStepProgress;
  next_step?: PathwayStep;
  pathway_complete: boolean;
}

