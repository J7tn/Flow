export interface StepComment {
  id: string;
  workflow_instance_id: string;
  workflow_step_id: string;
  author_id: string;
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked' | 'returned';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface StepTask {
  id: string;
  workflow_instance_id: string;
  current_step_id: string;
  previous_step_id?: string | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  order_index: number;
  assignee_id?: string | null;
  created_by: string;
  due_date?: string | null; // ISO date (no time)
  started_at?: string | null;
  completed_at?: string | null;
  last_transferred_at?: string | null;
  transfer_count: number;
  created_at: string;
  updated_at: string;
}

