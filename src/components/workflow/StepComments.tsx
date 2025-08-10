import React, { useEffect, useState } from 'react';
import { stepCommentsApi } from '@/lib/stepCommentsApi';
import type { StepComment } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface StepCommentsProps {
  workflowInstanceId: string;
  stepId: string;
}

export function StepComments({ workflowInstanceId, stepId }: StepCommentsProps) {
  const [comments, setComments] = useState<StepComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isUUID = (v: string) => /^(?!00000000-0000-0000-0000-000000000000)[0-9a-fA-F-]{36}$/.test(v);

  const load = async () => {
    if (!isUUID(workflowInstanceId) || !isUUID(stepId)) return;
    const res = await stepCommentsApi.list(workflowInstanceId, stepId);
    if (res.success && res.data) setComments(res.data);
  };

  useEffect(() => {
    void load();
  }, [workflowInstanceId, stepId]);

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    if (!isUUID(workflowInstanceId) || !isUUID(stepId)) return;
    setIsSubmitting(true);
    const res = await stepCommentsApi.add({
      workflow_instance_id: workflowInstanceId,
      workflow_step_id: stepId,
      content: newComment.trim(),
    });
    setIsSubmitting(false);
    if (res.success) {
      setNewComment('');
      void load();
    }
  };

  return (
    <Card className="border-muted">
      <CardContent className="p-3 space-y-3">
        <div className="font-medium text-sm">Comments</div>
        {!isUUID(workflowInstanceId) || !isUUID(stepId) ? (
          <div className="text-xs text-muted-foreground">Save and reopen the flow to enable comments for this step.</div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{c.author_id.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
                <div className="text-sm whitespace-pre-wrap">{c.content}</div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-xs text-muted-foreground">No comments yet.</div>
          )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button size="sm" onClick={handleAdd} disabled={isSubmitting || !newComment.trim() || !isUUID(workflowInstanceId) || !isUUID(stepId)}>
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(StepComments);


