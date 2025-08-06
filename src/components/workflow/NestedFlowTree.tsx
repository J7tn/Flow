// Nested Flow Tree Component
// This component displays flows in a hierarchical tree structure

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2, 
  Folder,
  Target,
  Briefcase,
  CheckSquare,
  Square,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { nestedFlowApi } from '@/lib/nestedFlowApi';
import type { FlowTreeNode, FlowType, CreateFlowPayload } from '@/types/nested-flows';

interface NestedFlowTreeProps {
  rootFlowId?: string;
  onFlowSelect?: (flowId: string) => void;
  onEditFlow?: (flowId: string) => void;
  onRefresh?: () => void;
  selectedFlowId?: string;
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
      return <Folder className="h-4 w-4" />;
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

export function NestedFlowTree({ 
  rootFlowId, 
  onFlowSelect, 
  onEditFlow,
  onRefresh,
  selectedFlowId, 
  className 
}: NestedFlowTreeProps) {
  const { toast } = useToast();
  const [treeData, setTreeData] = useState<FlowTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<string | null>(null);
  const [createFlowData, setCreateFlowData] = useState<CreateFlowPayload>({
    name: '',
    description: '',
    flow_type: 'task'
  });
  const [parentFlowId, setParentFlowId] = useState<string | undefined>(undefined);

  // Load flow tree data
  useEffect(() => {
    loadFlowTree();
  }, [rootFlowId]);

  const loadFlowTree = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await nestedFlowApi.getFlowTree(rootFlowId);
      console.log('getFlowTree result:', result);
      
      if (result.success && result.data) {
        console.log('Setting tree data:', result.data);
        setTreeData(result.data);
      } else {
        setError(result.error || 'Failed to load flow tree');
      }
    } catch (err) {
      setError('Failed to load flow tree');
      console.error('Error loading flow tree:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle node expansion
  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Handle flow selection
  const handleFlowSelect = (flowId: string) => {
    onFlowSelect?.(flowId);
  };

  // Handle flow creation
  const handleCreateFlow = async () => {
    try {
      const result = await nestedFlowApi.createFlow({
        ...createFlowData,
        parent_flow_id: parentFlowId
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Flow created successfully',
        });
        setShowCreateDialog(false);
        setCreateFlowData({ name: '', description: '', flow_type: 'task' });
        setParentFlowId(undefined);
        loadFlowTree(); // Reload the tree
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create flow',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create flow',
        variant: 'destructive',
      });
    }
  };

  // Handle flow deletion
  const handleDeleteFlow = async (flowId: string) => {
    console.log('handleDeleteFlow called with flowId:', flowId, 'type:', typeof flowId);
    if (!flowId) {
      console.error('flowId is undefined or empty!');
      return;
    }
    setFlowToDelete(flowId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteFlow = async () => {
    if (!flowToDelete) return;
    
    try {
      console.log('Deleting flow with ID:', flowToDelete);
      const result = await nestedFlowApi.deleteFlow(flowToDelete);
      console.log('Delete result:', result);
      
      if (result.success) {
        console.log('Delete successful, reloading tree...');
        toast({
          title: 'Success',
          description: 'Flow deleted successfully',
        });
        await loadFlowTree(); // Reload the tree
        onRefresh?.(); // Notify parent to refresh
        console.log('Tree reloaded after delete');
      } else {
        console.error('Delete failed:', result.error);
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete flow',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Delete flow error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete flow',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setFlowToDelete(null);
    }
  };

  // Handle flow duplication
  const handleDuplicateFlow = async (flowId: string) => {
    try {
      const result = await nestedFlowApi.duplicateFlow({
        flow_id: flowId,
        include_children: true
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Flow duplicated successfully',
        });
        loadFlowTree(); // Reload the tree
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

  // Render a single tree node
  const renderTreeNode = (node: FlowTreeNode, depth: number = 0) => {
    console.log('Rendering tree node:', node.id, node.name);
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedFlowId === node.id;
    const hasChildren = node.children.length > 0 || node.has_children;

    return (
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`
            group flex items-center p-2 rounded-lg cursor-pointer transition-colors
            ${isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}
            ${depth > 0 ? 'ml-6' : ''}
          `}
          onClick={() => handleFlowSelect(node.id)}
        >
          {/* Expand/Collapse button */}
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 mr-1"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Flow type icon */}
          <div className={`w-3 h-3 rounded-full ${getFlowTypeColor(node.flow_type)} mr-2`} />
          
          {/* Flow name and details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium truncate">{node.name}</span>
              <Badge variant="outline" className="text-xs">
                {node.flow_type}
              </Badge>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)}`} />
            </div>
            
            {/* Progress bar */}
            <div className="flex items-center space-x-2 mt-1">
              <Progress value={node.progress} className="h-1 flex-1" />
              <span className="text-xs text-muted-foreground">
                {Math.round(node.progress)}%
              </span>
            </div>
          </div>

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sub-flow
              </DropdownMenuItem>
              {onEditFlow && (
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Edit Flow clicked for node:', node.id);
                    onEditFlow(node.id);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Flow
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleDuplicateFlow(node.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Delete Flow clicked for node:', node.id, 'node object:', node);
                  if (!node.id) {
                    console.error('Node ID is undefined!');
                    return;
                  }
                  handleDeleteFlow(node.id);
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Children */}
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {node.children.map(child => renderTreeNode(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading flows...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-destructive mb-2">{error}</p>
            <Button variant="outline" onClick={loadFlowTree}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Flow Hierarchy</h3>
            <Button
              size="sm"
              onClick={() => {
                setParentFlowId(undefined);
                setShowCreateDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Flow
            </Button>
          </div>

          <div className="space-y-1">
            {treeData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Folder className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No flows found</p>
                <p className="text-sm">Create your first flow to get started</p>
              </div>
            ) : (
              treeData.map(node => renderTreeNode(node))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Flow Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Flow</DialogTitle>
            <DialogDescription>
              Create a new flow in your hierarchy
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="flow-name">Name</Label>
              <Input
                id="flow-name"
                value={createFlowData.name}
                onChange={(e) => setCreateFlowData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter flow name"
              />
            </div>
            
            <div>
              <Label htmlFor="flow-description">Description</Label>
              <Input
                id="flow-description"
                value={createFlowData.description}
                onChange={(e) => setCreateFlowData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter flow description"
              />
            </div>
            
            <div>
              <Label htmlFor="flow-type">Type</Label>
              <select
                id="flow-type"
                value={createFlowData.flow_type}
                onChange={(e) => setCreateFlowData(prev => ({ ...prev, flow_type: e.target.value as FlowType }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="goal">Goal</option>
                <option value="project">Project</option>
                <option value="task">Task</option>
                <option value="subtask">Subtask</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFlow} disabled={!createFlowData.name.trim()}>
              Create Flow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Flow Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Flow</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this flow? This action cannot be undone and will also delete all sub-flows.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteFlow}
            >
              Delete Flow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 