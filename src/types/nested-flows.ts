// Nested Flows TypeScript Types
// This file defines the types for hierarchical/nested flows

export type FlowType = 'goal' | 'project' | 'task' | 'subtask';
export type FlowRelationship = 'parent' | 'child' | 'sibling' | 'dependency';

// Base flow interface
export interface BaseFlow {
  id: string;
  name: string;
  description?: string;
  flow_type: FlowType;
  status: 'draft' | 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

// Workflow instance with hierarchy support
export interface WorkflowInstance extends BaseFlow {
  template_id?: string;
  user_id: string;
  parent_flow_id?: string;
  root_flow_id?: string;
  depth_level: number;
  path: string;
  is_template: boolean;
  current_step: number;
  completed_steps: string[];
  customizations?: Record<string, any>;
  actual_costs?: Record<string, any>;
  performance_metrics?: Record<string, any>;
  notes: any[];
  
  // Computed properties
  progress?: number;
  total_steps?: number;
  completed_step_count?: number;
  children?: WorkflowInstance[];
  parent?: WorkflowInstance;
  ancestors?: WorkflowInstance[];
  descendants?: WorkflowInstance[];
}

// Flow relationship
export interface FlowRelationship {
  id: string;
  parent_flow_id: string;
  child_flow_id: string;
  relationship_type: FlowRelationship;
  order_index: number;
  dependency_type: string;
  lag_days: number;
  created_at: string;
  updated_at: string;
}

// Nested flow template
export interface NestedFlowTemplate {
  id: string;
  name: string;
  description?: string;
  flow_type: FlowType;
  category?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration_min?: number;
  estimated_duration_max?: number;
  duration_unit: string;
  tags: string[];
  thumbnail_url?: string;
  version: string;
  author_id: string;
  author_name: string;
  is_public: boolean;
  rating: number;
  usage_count: number;
  steps: any[];
  sub_flows: string[]; // References to other templates that can be nested
  cost_analysis: Record<string, any>;
  recommended_tools: any[];
  optimization_suggestions: any[];
  industry_context: Record<string, any>;
  success_metrics: any[];
  risks: any[];
  customization_options: any[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  moderation_notes?: string;
  moderated_by?: string;
  moderated_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// Flow template relationship
export interface FlowTemplateRelationship {
  id: string;
  parent_template_id: string;
  child_template_id: string;
  relationship_type: FlowRelationship;
  order_index: number;
  is_optional: boolean;
  created_at: string;
  updated_at: string;
}

// Flow tree structure for UI
export interface FlowTreeNode {
  id: string;
  name: string;
  flow_type: FlowType;
  status: 'draft' | 'active' | 'completed' | 'archived';
  progress: number;
  depth_level: number;
  path: string;
  children: FlowTreeNode[];
  is_expanded?: boolean;
  is_loading?: boolean;
  has_children?: boolean;
}

// Flow creation/update payloads
export interface CreateFlowPayload {
  name: string;
  description?: string;
  flow_type: FlowType;
  parent_flow_id?: string;
  template_id?: string;
}

export interface UpdateFlowPayload {
  name?: string;
  description?: string;
  status?: 'draft' | 'active' | 'completed' | 'archived';
  parent_flow_id?: string;
  customizations?: Record<string, any>;
}

// Flow template creation/update payloads
export interface CreateFlowTemplatePayload {
  name: string;
  description?: string;
  flow_type: FlowType;
  category?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration_min?: number;
  estimated_duration_max?: number;
  duration_unit?: string;
  tags?: string[];
  steps: any[];
  sub_flows?: string[];
  cost_analysis?: Record<string, any>;
  recommended_tools?: any[];
  optimization_suggestions?: any[];
  industry_context?: Record<string, any>;
  success_metrics?: any[];
  risks?: any[];
  customization_options?: any[];
  is_public?: boolean;
}

export interface UpdateFlowTemplatePayload {
  name?: string;
  description?: string;
  flow_type?: FlowType;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration_min?: number;
  estimated_duration_max?: number;
  duration_unit?: string;
  tags?: string[];
  steps?: any[];
  sub_flows?: string[];
  cost_analysis?: Record<string, any>;
  recommended_tools?: any[];
  optimization_suggestions?: any[];
  industry_context?: Record<string, any>;
  success_metrics?: any[];
  risks?: any[];
  customization_options?: any[];
  is_public?: boolean;
}

// Flow hierarchy operations
export interface MoveFlowPayload {
  flow_id: string;
  new_parent_flow_id?: string; // null for root level
  new_order_index?: number;
}

export interface DuplicateFlowPayload {
  flow_id: string;
  new_name?: string;
  include_children?: boolean;
  new_parent_flow_id?: string;
}

// Flow progress and analytics
export interface FlowProgress {
  flow_id: string;
  total_steps: number;
  completed_steps: number;
  progress_percentage: number;
  estimated_remaining_time?: number;
  actual_time_spent?: number;
  children_progress?: FlowProgress[];
}

export interface FlowAnalytics {
  flow_id: string;
  total_flows: number;
  active_flows: number;
  completed_flows: number;
  average_completion_time?: number;
  success_rate?: number;
  bottlenecks?: string[];
  recommendations?: string[];
}

// Flow search and filtering
export interface FlowFilters {
  flow_type?: FlowType[];
  status?: ('draft' | 'active' | 'completed' | 'archived')[];
  depth_level?: number;
  parent_flow_id?: string;
  root_flow_id?: string;
  created_after?: string;
  created_before?: string;
  tags?: string[];
  search?: string;
}

// Flow template search and filtering
export interface FlowTemplateFilters {
  flow_type?: FlowType[];
  category?: string[];
  difficulty?: ('beginner' | 'intermediate' | 'advanced' | 'expert')[];
  is_public?: boolean;
  author_id?: string;
  tags?: string[];
  search?: string;
  rating_min?: number;
  usage_count_min?: number;
}

// Flow import/export
export interface FlowExport {
  version: string;
  exported_at: string;
  flows: WorkflowInstance[];
  templates: NestedFlowTemplate[];
  relationships: FlowRelationship[];
  metadata: {
    total_flows: number;
    total_templates: number;
    export_scope: 'single' | 'branch' | 'all';
  };
}

export interface FlowImport {
  flows: WorkflowInstance[];
  templates: NestedFlowTemplate[];
  relationships: FlowRelationship[];
  import_options: {
    overwrite_existing: boolean;
    preserve_ids: boolean;
    import_templates: boolean;
    import_relationships: boolean;
  };
} 