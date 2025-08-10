import { supabase } from './supabase';
import type { StepComment } from '@/types/supabase';

export const stepCommentsApi = {
  async list(workflowInstanceId: string, workflowStepId: string): Promise<{ success: boolean; data?: StepComment[]; error?: string }> {
    const client = supabase();
    if (!client) return { success: false, error: 'Supabase client not available' };
    const { data, error } = await client
      .from('step_comments')
      .select('*')
      .eq('workflow_instance_id', workflowInstanceId)
      .eq('workflow_step_id', workflowStepId)
      .order('created_at', { ascending: true });
    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as StepComment[] };
  },

  async add(params: { workflow_instance_id: string; workflow_step_id: string; content: string }): Promise<{ success: boolean; data?: StepComment; error?: string }> {
    const client = supabase();
    if (!client) return { success: false, error: 'Supabase client not available' };
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) return { success: false, error: authError?.message || 'User not authenticated' };
    const payload = {
      workflow_instance_id: params.workflow_instance_id,
      workflow_step_id: params.workflow_step_id,
      author_id: user.id,
      content: params.content,
      metadata: {},
    };
    const { data, error } = await client
      .from('step_comments')
      .insert(payload)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as StepComment };
  },
};


