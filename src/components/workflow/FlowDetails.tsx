// Flow Details Component
// This component displays detailed information about a selected flow

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Briefcase, 
  CheckSquare, 
  Square, 
  Edit, 
  Copy, 
  Trash2, 
  MoreHorizontal,
  Clock,
  Users,
  Tag,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { nestedFlowApi } from '@/lib/nestedFlowApi';
import type { WorkflowInstance, FlowType } from '@/types/nested-flows';

interface FlowDetailsProps {
  flowId: string;
  onFlowUpdate?: () => void;
  onFlowDelete?: () => void;
  className?: string;
}

const getFlowTypeIcon = (flowType: FlowType) => {
  switch (flowType) {
    case 'goal':
      return <Target className="h-4 w-4" />;
    case 'project':
      return <Briefcase className="h-4 w-4" />;
    case 'task':
      return <CheckSquare className="h-4 w-4" />;
    case 'subtask':
      return <Square className="h-4 w-4" />;
    default:
      return <Briefcase className="h-4 w-4" />;
  }
};

const getFlowTypeColor = (flowType: FlowType) => {
  switch (flowType) {
    case 'goal':
      return 'bg-purple-500';
    case 'project':
      return 'bg-blue-500';
    case 'task':
      return 'bg-green-500';
    case 'subtask':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'completed':
      return 'bg-blue-500';
    case 'archived':
      return 'bg-gray-500';
    default:
      return 'bg-yellow-500';
  }
};

export function FlowDetails({ 
  flowId, 
  onFlowUpdate, 
  onFlowDelete, 
  className 
}: FlowDetailsProps) {
  const { toast } = useToast();
  const [flow, setFlow] = useState<WorkflowInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ancestors, setAncestors] = useState<WorkflowInstance[]>([]);
  const [children, setChildren] = useState<WorkflowInstance[]>([]);

  useEffect(() => {
    if (flowId) {
      loadFlowDetails();
    }
  }, [flowId]);

  const loadFlowDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load flow details
      const flowResult = await nestedFlowApi.getFlow(flowId);
      if (flowResult.success && flowResult.data) {
        setFlow(flowResult.data);
      } else {
        setError(flowResult.error || 'Failed to load flow details');
        return;
      }

      // Load ancestors
      const ancestorsResult = await nestedFlowApi.getFlowAncestors(flowId);
      setAncestors(ancestorsResult);

      // Load children
      const childrenResult = await nestedFlowApi.getFlowChildren(flowId);
      setChildren(childrenResult);

    } catch (err) {
      console.error('Error loading flow details:', err);
      setError('Failed to load flow details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlow = async () => {
    if (!flow) return;

    try {
      const result = await nestedFlowApi.deleteFlow(flow.id);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Flow deleted successfully',
        });
        onFlowDelete?.();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete flow',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete flow',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicateFlow = async () => {
    if (!flow) return;

    try {
      const result = await nestedFlowApi.duplicateFlow({
        flow_id: flow.id,
        include_children: true
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Flow duplicated successfully',
        });
        onFlowUpdate?.();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to duplicate flow',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate flow',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading flow details...</span>
        </CardContent>
      </Card>
    );
  }

  if (error || !flow) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-destructive mb-2">{error || 'Flow not found'}</p>
            <Button variant="outline" onClick={loadFlowDetails}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Flow Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${getFlowTypeColor(flow.flow_type)}`} />
              {getFlowTypeIcon(flow.flow_type)}
              <div>
                <CardTitle className="text-xl">{flow.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {flow.flow_type}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(flow.status)}`} />
                  <span className="text-sm text-muted-foreground capitalize">
                    {flow.status}
                  </span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Flow
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicateFlow}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDeleteFlow}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {flow.description && (
            <CardDescription className="text-base mt-2">
              {flow.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">
                  {Math.round(flow.progress || 0)}%
                </span>
              </div>
              <Progress value={flow.progress || 0} className="h-2" />
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(flow.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated:</span>
                <span>{new Date(flow.updated_at).toLocaleDateString()}</span>
              </div>
              <TooltipProvider>
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-muted-foreground cursor-help">Depth Level:</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>How deep this flow is in the hierarchy.<br />
                      Level 0 = Root flow, Level 1 = Direct child, etc.</p>
                    </TooltipContent>
                  </Tooltip>
                  <span>{flow.depth_level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-muted-foreground cursor-help">Children:</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of sub-flows contained within this flow.<br />
                      These are smaller, more specific flows that help achieve this flow's goal.</p>
                    </TooltipContent>
                  </Tooltip>
                  <span>{children.length}</span>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hierarchy Information */}
      {(ancestors.length > 0 || children.length > 0) && (
        <div className="space-y-6">
          {/* Ancestors */}
          {ancestors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parent Hierarchy</CardTitle>
                <CardDescription>
                  Flows that contain this flow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ancestors.map((ancestor, index) => (
                    <motion.div
                      key={ancestor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
                    >
                      <div className={`w-3 h-3 rounded-full ${getFlowTypeColor(ancestor.flow_type)}`} />
                      {getFlowTypeIcon(ancestor.flow_type)}
                      <div className="flex-1">
                        <div className="font-medium">{ancestor.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {ancestor.flow_type} • {ancestor.status}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Level {ancestor.depth_level}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Children */}
          {children.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sub-flows</CardTitle>
                <CardDescription>
                  Flows contained within this flow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {children.map((child, index) => (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => onFlowUpdate?.()}
                    >
                      <div className={`w-3 h-3 rounded-full ${getFlowTypeColor(child.flow_type)}`} />
                      {getFlowTypeIcon(child.flow_type)}
                      <div className="flex-1">
                        <div className="font-medium">{child.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {child.flow_type} • {child.status}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {Math.round(child.progress || 0)}%
                          </div>
                          <Progress value={child.progress || 0} className="h-1 w-16" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Level {child.depth_level}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}


    </div>
  );
} 