// Nested Flow API Service
// This service handles all operations related to hierarchical/nested flows

import { supabase } from './supabase';
import type {
  WorkflowInstance,
  NestedFlowTemplate,
  FlowRelationship,
  FlowTreeNode,
  CreateFlowPayload,
  UpdateFlowPayload,
  CreateFlowTemplatePayload,
  UpdateFlowTemplatePayload,
  MoveFlowPayload,
  DuplicateFlowPayload,
  FlowProgress,
  FlowAnalytics,
  FlowFilters,
  FlowTemplateFilters,
  FlowExport,
  FlowImport
} from '@/types/nested-flows';

export const nestedFlowApi = {
  // ===== FLOW INSTANCES =====
  
  // Get all flows for a user (with optional filtering)
  async getFlows(filters?: FlowFilters): Promise<{ success: boolean; data?: WorkflowInstance[]; error?: string }> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      let query = client
        .from('workflow_instances')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters) {
        if (filters.flow_type?.length) {
          query = query.in('flow_type', filters.flow_type);
        }
        if (filters.status?.length) {
          query = query.in('status', filters.status);
        }
        if (filters.depth_level !== undefined) {
          query = query.eq('depth_level', filters.depth_level);
        }
        if (filters.parent_flow_id) {
          query = query.eq('parent_flow_id', filters.parent_flow_id);
        }
        if (filters.root_flow_id) {
          query = query.eq('root_flow_id', filters.root_flow_id);
        }
        if (filters.created_after) {
          query = query.gte('created_at', filters.created_after);
        }
        if (filters.created_before) {
          query = query.lte('created_at', filters.created_before);
        }
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform to include computed properties
      const flowsWithProgress = await Promise.all(
        data.map(async (flow) => {
          const progress = await this.calculateFlowProgress(flow.id);
          return { ...flow, progress };
        })
      );

      return { success: true, data: flowsWithProgress };
    } catch (error) {
      console.error('Error fetching flows:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch flows' };
    }
  },

  // Get a single flow by ID
  async getFlow(flowId: string): Promise<{ success: boolean; data?: WorkflowInstance; error?: string }> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await client
        .from('workflow_instances')
        .select('*')
        .eq('id', flowId)
        .single();

      if (error) throw error;

      // Get progress
      const progress = await this.calculateFlowProgress(flowId);
      const flowWithProgress = { ...data, progress };

      return { success: true, data: flowWithProgress };
    } catch (error) {
      console.error('Error fetching flow:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch flow' };
    }
  },

  // Create a new flow
  async createFlow(payload: CreateFlowPayload): Promise<{ success: boolean; data?: WorkflowInstance; error?: string }> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const { data, error } = await client
        .from('workflow_instances')
        .insert({
          ...payload,
          user_id: user.id,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating flow:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create flow' };
    }
  },

  // Update a flow
  async updateFlow(flowId: string, payload: UpdateFlowPayload): Promise<{ success: boolean; data?: WorkflowInstance; error?: string }> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await client
        .from('workflow_instances')
        .update(payload)
        .eq('id', flowId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating flow:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update flow' };
    }
  },

  // Delete a flow (and all descendants)
  async deleteFlow(flowId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      // Get all descendants
      const descendants = await this.getFlowDescendants(flowId);
      
      // Delete all descendants first (due to foreign key constraints)
      for (const descendant of descendants) {
        const { error } = await client
          .from('workflow_instances')
          .delete()
          .eq('id', descendant.id);
        
        if (error) throw error;
      }

      // Delete the flow itself
      const { error } = await client
        .from('workflow_instances')
        .delete()
        .eq('id', flowId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting flow:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete flow' };
    }
  },

  // ===== HIERARCHY OPERATIONS =====

  // Get flow tree structure
  async getFlowTree(rootFlowId?: string): Promise<{ success: boolean; data?: FlowTreeNode[]; error?: string }> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      let query = client
        .from('workflow_instances')
        .select('*')
        .order('path', { ascending: true });

      if (rootFlowId) {
        query = query.or(`id.eq.${rootFlowId},path.like.${rootFlowId}/%`);
      } else {
        query = query.is('parent_flow_id', null);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Build tree structure
      const tree = this.buildFlowTree(data);

      return { success: true, data: tree };
    } catch (error) {
      console.error('Error fetching flow tree:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch flow tree' };
    }
  },

  // Move a flow to a new parent
  async moveFlow(payload: MoveFlowPayload): Promise<{ success: boolean; data?: WorkflowInstance; error?: string }> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await client
        .from('workflow_instances')
        .update({
          parent_flow_id: payload.new_parent_flow_id || null
        })
        .eq('id', payload.flow_id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error moving flow:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to move flow' };
    }
  },

  // Duplicate a flow (with optional children)
  async duplicateFlow(payload: DuplicateFlowPayload): Promise<{ success: boolean; data?: WorkflowInstance; error?: string }> {
    try {
      // Get the original flow
      const originalFlow = await this.getFlow(payload.flow_id);
      if (!originalFlow.success || !originalFlow.data) {
        throw new Error('Original flow not found');
      }

      // Create the duplicated flow
      const duplicatedFlow = await this.createFlow({
        name: payload.new_name || `${originalFlow.data.name} (Copy)`,
        description: originalFlow.data.description,
        flow_type: originalFlow.data.flow_type,
        parent_flow_id: payload.new_parent_flow_id,
        template_id: originalFlow.data.template_id
      });

      if (!duplicatedFlow.success || !duplicatedFlow.data) {
        throw new Error('Failed to create duplicated flow');
      }

      // Duplicate children if requested
      if (payload.include_children) {
        const children = await this.getFlowChildren(payload.flow_id);
        for (const child of children) {
          await this.duplicateFlow({
            flow_id: child.id,
            new_name: child.name,
            include_children: true,
            new_parent_flow_id: duplicatedFlow.data.id
          });
        }
      }

      return duplicatedFlow;
    } catch (error) {
      console.error('Error duplicating flow:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to duplicate flow' };
    }
  },

  // Get flow descendants
  async getFlowDescendants(flowId: string): Promise<WorkflowInstance[]> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await client
        .rpc('get_flow_descendants', { flow_id: flowId });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching flow descendants:', error);
      return [];
    }
  },

  // Get flow ancestors
  async getFlowAncestors(flowId: string): Promise<WorkflowInstance[]> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      console.log('Calling get_flow_ancestors with flowId:', flowId);
      
      const { data, error } = await client
        .rpc('get_flow_ancestors', { target_flow_id: flowId });

      if (error) {
        console.error('Error fetching flow ancestors:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('get_flow_ancestors result:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching flow ancestors:', error);
      return [];
    }
  },

  // Get direct children of a flow
  async getFlowChildren(flowId: string): Promise<WorkflowInstance[]> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await client
        .from('workflow_instances')
        .select('*')
        .eq('parent_flow_id', flowId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching flow children:', error);
      return [];
    }
  },

  // ===== PROGRESS AND ANALYTICS =====

  // Calculate flow progress
  async calculateFlowProgress(flowId: string): Promise<number> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await client
        .rpc('calculate_flow_progress', { flow_id: flowId });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error calculating flow progress:', error);
      return 0;
    }
  },

  // Get flow analytics
  async getFlowAnalytics(flowId: string): Promise<{ success: boolean; data?: FlowAnalytics; error?: string }> {
    try {
      // Get all flows in the hierarchy
      const descendants = await this.getFlowDescendants(flowId);
      const allFlows = [await this.getFlow(flowId), ...descendants.map(f => ({ success: true, data: f }))];

      const analytics: FlowAnalytics = {
        flow_id: flowId,
        total_flows: allFlows.length,
        active_flows: allFlows.filter(f => f.data?.status === 'active').length,
        completed_flows: allFlows.filter(f => f.data?.status === 'completed').length,
        success_rate: allFlows.length > 0 ? (allFlows.filter(f => f.data?.status === 'completed').length / allFlows.length) * 100 : 0
      };

      return { success: true, data: analytics };
    } catch (error) {
      console.error('Error fetching flow analytics:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch flow analytics' };
    }
  },

  // ===== TEMPLATES =====

  // Get nested flow templates
  async getFlowTemplates(filters?: FlowTemplateFilters): Promise<{ success: boolean; data?: NestedFlowTemplate[]; error?: string }> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      let query = client
        .from('nested_flow_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters) {
        if (filters.flow_type?.length) {
          query = query.in('flow_type', filters.flow_type);
        }
        if (filters.category?.length) {
          query = query.in('category', filters.category);
        }
        if (filters.difficulty?.length) {
          query = query.in('difficulty', filters.difficulty);
        }
        if (filters.is_public !== undefined) {
          query = query.eq('is_public', filters.is_public);
        }
        if (filters.author_id) {
          query = query.eq('author_id', filters.author_id);
        }
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
        if (filters.rating_min) {
          query = query.gte('rating', filters.rating_min);
        }
        if (filters.usage_count_min) {
          query = query.gte('usage_count', filters.usage_count_min);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching flow templates:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch flow templates' };
    }
  },

  // Create flow from template
  async createFlowFromTemplate(templateId: string, parentFlowId?: string): Promise<{ success: boolean; data?: WorkflowInstance; error?: string }> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      // Get the template
      const { data: template, error: templateError } = await client
        .from('nested_flow_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      // Create the flow
      const flow = await this.createFlow({
        name: template.name,
        description: template.description,
        flow_type: template.flow_type,
        parent_flow_id: parentFlowId,
        template_id: templateId
      });

      if (!flow.success) throw new Error('Failed to create flow from template');

      // Create sub-flows if any
      if (template.sub_flows?.length) {
        for (const subFlowTemplateId of template.sub_flows) {
          await this.createFlowFromTemplate(subFlowTemplateId, flow.data?.id);
        }
      }

      return flow;
    } catch (error) {
      console.error('Error creating flow from template:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create flow from template' };
    }
  },

  // ===== UTILITY FUNCTIONS =====

  // Build flow tree from flat array
  buildFlowTree(flows: WorkflowInstance[]): FlowTreeNode[] {
    const flowMap = new Map<string, FlowTreeNode>();
    const roots: FlowTreeNode[] = [];

    // Create nodes
    flows.forEach(flow => {
      flowMap.set(flow.id, {
        id: flow.id,
        name: flow.name,
        flow_type: flow.flow_type,
        status: flow.status,
        progress: flow.progress || 0,
        depth_level: flow.depth_level,
        path: flow.path,
        children: [],
        is_expanded: false,
        has_children: false
      });
    });

    // Build tree structure
    flows.forEach(flow => {
      const node = flowMap.get(flow.id)!;
      
      if (flow.parent_flow_id) {
        const parent = flowMap.get(flow.parent_flow_id);
        if (parent) {
          parent.children.push(node);
          parent.has_children = true;
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  },

  // Export flows
  async exportFlows(flowIds: string[]): Promise<{ success: boolean; data?: FlowExport; error?: string }> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      const flows: WorkflowInstance[] = [];
      const templates: NestedFlowTemplate[] = [];
      const relationships: FlowRelationship[] = [];

      // Get all flows and their descendants
      for (const flowId of flowIds) {
        const flow = await this.getFlow(flowId);
        if (flow.success && flow.data) {
          flows.push(flow.data);
          
          // Get descendants
          const descendants = await this.getFlowDescendants(flowId);
          flows.push(...descendants);
        }
      }

      // Get unique templates
      const templateIds = [...new Set(flows.map(f => f.template_id).filter(Boolean))];
      for (const templateId of templateIds) {
        const { data: template } = await client
          .from('nested_flow_templates')
          .select('*')
          .eq('id', templateId)
          .single();
        
        if (template) templates.push(template);
      }

      const exportData: FlowExport = {
        version: '1.0.0',
        exported_at: new Date().toISOString(),
        flows,
        templates,
        relationships,
        metadata: {
          total_flows: flows.length,
          total_templates: templates.length,
          export_scope: flowIds.length === 1 ? 'single' : 'branch'
        }
      };

      return { success: true, data: exportData };
    } catch (error) {
      console.error('Error exporting flows:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to export flows' };
    }
  },

  // Import flows
  async importFlows(importData: FlowImport): Promise<{ success: boolean; data?: WorkflowInstance[]; error?: string }> {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      const importedFlows: WorkflowInstance[] = [];

      // Import templates first
      if (importData.import_options.import_templates) {
        for (const template of importData.templates) {
          const { error } = await client
            .from('nested_flow_templates')
            .upsert(template, { onConflict: 'id' });
          
          if (error) throw error;
        }
      }

      // Import flows
      for (const flow of importData.flows) {
        const { data, error } = await client
          .from('workflow_instances')
          .upsert(flow, { onConflict: 'id' })
          .select()
          .single();
        
        if (error) throw error;
        if (data) importedFlows.push(data);
      }

      return { success: true, data: importedFlows };
    } catch (error) {
      console.error('Error importing flows:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to import flows' };
    }
  }
}; 