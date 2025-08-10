import React, { useEffect, useMemo, useState } from 'react';
import { stepTasksApi } from '@/lib/stepTasksApi';
import type { StepTask, TaskPriority, TaskStatus } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StepTasksProps {
  workflowInstanceId: string;
  stepId: string;
  nextStepId?: string; // for quick send forward
  prevStepId?: string; // for quick send back
}

const statusOptions: TaskStatus[] = ['todo', 'in_progress', 'done', 'blocked', 'returned'];
const priorityOptions: TaskPriority[] = ['low', 'normal', 'high', 'urgent'];

export function StepTasks({ workflowInstanceId, stepId, nextStepId, prevStepId }: StepTasksProps) {
  const [tasks, setTasks] = useState<StepTask[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [isCreating, setIsCreating] = useState(false);
  const isUUID = (v?: string) => !!v && /^(?!00000000-0000-0000-0000-000000000000)[0-9a-fA-F-]{36}$/.test(v);

  const load = async () => {
    if (!isUUID(workflowInstanceId) || !isUUID(stepId)) return;
    const res = await stepTasksApi.list(workflowInstanceId, stepId);
    if (res.success && res.data) setTasks(res.data);
  };

  useEffect(() => {
    void load();
  }, [workflowInstanceId, stepId]);

  const doneCount = useMemo(() => tasks.filter(t => t.status === 'done').length, [tasks]);
  const progressPct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const createTask = async () => {
    if (!title.trim()) return;
    if (!isUUID(workflowInstanceId) || !isUUID(stepId)) return;
    setIsCreating(true);
    const res = await stepTasksApi.create({
      workflow_instance_id: workflowInstanceId,
      current_step_id: stepId,
      title: title.trim(),
      priority,
    });
    setIsCreating(false);
    if (res.success) {
      setTitle('');
      setPriority('normal');
      void load();
    }
  };

  const updateTask = async (taskId: string, updates: Partial<StepTask>) => {
    const res = await stepTasksApi.update(taskId, updates);
    if (res.success) void load();
  };

  const transfer = async (taskId: string, toStepId?: string) => {
    if (!toStepId || !isUUID(toStepId)) return;
    const res = await stepTasksApi.transfer(taskId, toStepId);
    if (res.success) void load();
  };

  return (
    <Card className="border-muted">
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm">Tasks</div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">{doneCount}/{tasks.length} done</div>
            <div className="w-32"><Progress value={progressPct} className="h-2" /></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input
            placeholder="New task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              {priorityOptions.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={createTask} disabled={isCreating || !title.trim() || !isUUID(workflowInstanceId) || !isUUID(stepId)}>Add</Button>
        </div>

        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="p-2 border rounded-md flex items-center gap-2">
              <Select value={task.status} onValueChange={(v) => updateTask(task.id, { status: v as TaskStatus })}>
                <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
              <div className="flex-1 text-sm">{task.title}</div>
              <Select value={task.priority} onValueChange={(v) => updateTask(task.id, { priority: v as TaskPriority })}>
                <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                </SelectContent>
              </Select>
              {prevStepId && (
                <Button variant="outline" size="sm" onClick={() => transfer(task.id, prevStepId)} disabled={!isUUID(prevStepId)}>Send Back</Button>
              )}
              {nextStepId && (
                <Button size="sm" onClick={() => transfer(task.id, nextStepId)} disabled={!isUUID(nextStepId)}>Send Forward</Button>
              )}
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-xs text-muted-foreground">No tasks yet.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(StepTasks);


