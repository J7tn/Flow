import { supabase } from './supabase';
import type { StepTask, TaskPriority, TaskStatus } from '@/types/supabase';

export const stepTasksApi = {
  async list(workflowInstanceId: string, workflowStepId: string): Promise<{ success: boolean; data?: StepTask[]; error?: string }> {
    const client = supabase();
    if (!client) return { success: false, error: 'Supabase client not available' };
    const { data, error } = await client
      .from('step_tasks')
      .select('*')
      .eq('workflow_instance_id', workflowInstanceId)
      .eq('current_step_id', workflowStepId)
      .order('order_index', { ascending: true });
    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as StepTask[] };
  },

  async create(params: {
    workflow_instance_id: string;
    current_step_id: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    due_date?: string; // YYYY-MM-DD
    assignee_id?: string;
  }): Promise<{ success: boolean; data?: StepTask; error?: string }> {
    const client = supabase();
    if (!client) return { success: false, error: 'Supabase client not available' };
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) return { success: false, error: authError?.message || 'User not authenticated' };
    const payload = {
      workflow_instance_id: params.workflow_instance_id,
      current_step_id: params.current_step_id,
      title: params.title,
      description: params.description ?? null,
      status: 'todo' as TaskStatus,
      priority: params.priority ?? 'normal',
      assignee_id: params.assignee_id ?? null,
      created_by: user.id,
      due_date: params.due_date ?? null,
    };
    const { data, error } = await client
      .from('step_tasks')
      .insert(payload)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as StepTask };
  },

  async update(id: string, updates: Partial<Pick<StepTask, 'title' | 'description' | 'status' | 'priority' | 'assignee_id' | 'due_date' | 'order_index'>>): Promise<{ success: boolean; data?: StepTask; error?: string }> {
    const client = supabase();
    if (!client) return { success: false, error: 'Supabase client not available' };
    const { data, error } = await client
      .from('step_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as StepTask };
  },

  async transfer(taskId: string, toStepId: string): Promise<{ success: boolean; data?: StepTask; error?: string }> {
    const client = supabase();
    if (!client) return { success: false, error: 'Supabase client not available' };
    const { data: task, error: fetchErr } = await client
      .from('step_tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    if (fetchErr || !task) return { success: false, error: fetchErr?.message || 'Task not found' };
    const updates = {
      previous_step_id: task.current_step_id,
      current_step_id: toStepId,
      last_transferred_at: new Date().toISOString(),
      transfer_count: (task.transfer_count ?? 0) + 1,
    };
    const { data, error } = await client
      .from('step_tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as StepTask };
  },
};


