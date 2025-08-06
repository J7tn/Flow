// Test Nested Flows Component
// This component provides a simple interface to test the nested flows functionality

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Briefcase, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CreateFlowForm } from './CreateFlowForm';
import { NestedFlowTree } from './NestedFlowTree';
import { nestedFlowApi } from '@/lib/nestedFlowApi';
import type { WorkflowInstance, FlowType } from '@/types/nested-flows';

export function TestNestedFlows() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingFlow, setEditingFlow] = useState<WorkflowInstance | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | undefined>();
  const [flows, setFlows] = useState<WorkflowInstance[]>([]);

  const createSampleFlows = async () => {
    try {
      // Create a goal
      const goal = await nestedFlowApi.createFlow({
        name: "Launch Successful Product",
        description: "Bring our product to market successfully",
        flow_type: "goal"
      });

      if (!goal.success || !goal.data) {
        throw new Error('Failed to create goal');
      }

      // Create a project under the goal
      const project = await nestedFlowApi.createFlow({
        name: "Develop Mobile App",
        description: "Build the mobile application",
        flow_type: "project",
        parent_flow_id: goal.data.id
      });

      if (!project.success || !project.data) {
        throw new Error('Failed to create project');
      }

      // Create tasks under the project
      const task1 = await nestedFlowApi.createFlow({
        name: "Design User Interface",
        description: "Create wireframes and mockups",
        flow_type: "task",
        parent_flow_id: project.data.id
      });

      const task2 = await nestedFlowApi.createFlow({
        name: "Implement Backend",
        description: "Build the server-side functionality",
        flow_type: "task",
        parent_flow_id: project.data.id
      });

      // Create subtasks
      if (task1.success && task1.data) {
        await nestedFlowApi.createFlow({
          name: "Create Wireframes",
          description: "Design basic wireframes",
          flow_type: "subtask",
          parent_flow_id: task1.data.id
        });
      }

      toast({
        title: 'Success',
        description: 'Sample flows created successfully!',
      });

      // Refresh the tree
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating sample flows:', error);
      toast({
        title: 'Error',
        description: 'Failed to create sample flows',
        variant: 'destructive',
      });
    }
  };

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

  const handleEditFlow = async (flowId: string) => {
    console.log('Edit flow called with ID:', flowId);
    try {
      const result = await nestedFlowApi.getFlow(flowId);
      console.log('Get flow result:', result);
      if (result.success && result.data) {
        console.log('Setting editing flow:', result.data);
        setEditingFlow(result.data);
        setShowEditForm(true);
        console.log('Edit form should now be visible');
      } else {
        console.error('Failed to get flow:', result.error);
        toast({
          title: 'Error',
          description: result.error || 'Failed to load flow for editing',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Edit flow error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flow for editing',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing tree...');
    // Force a page refresh to update the tree
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Nested Flows Test</h1>
        <p className="text-muted-foreground">
          Test the hierarchical flow system with sample data
        </p>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>
            Create sample flows or add new ones manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={createSampleFlows}>
              <Plus className="h-4 w-4 mr-2" />
              Create Sample Flows
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showCreateForm ? 'Hide' : 'Show'} Create Form
            </Button>
          </div>

          {/* Flow Type Legend */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Flow Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['goal', 'project', 'task', 'subtask'] as FlowType[]).map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getFlowTypeColor(type)}`} />
                  {getFlowTypeIcon(type)}
                  <span className="text-sm capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Flow Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CreateFlowForm
            onSuccess={(flow) => {
              toast({
                title: 'Success',
                description: `Flow "${flow.name}" created successfully!`,
              });
              setShowCreateForm(false);
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </motion.div>
      )}

      {/* Edit Flow Form */}
      {showEditForm && editingFlow && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
                     <CreateFlowForm
             flowToEdit={editingFlow}
             onSuccess={(flow) => {
               toast({
                 title: 'Success',
                 description: `Flow "${flow.name}" updated successfully!`,
               });
               setShowEditForm(false);
               setEditingFlow(null);
               // Force a page refresh to update the tree
               window.location.reload();
             }}
             onCancel={() => {
               setShowEditForm(false);
               setEditingFlow(null);
             }}
           />
        </motion.div>
      )}

      {/* Flow Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <NestedFlowTree
            onFlowSelect={setSelectedFlowId}
            selectedFlowId={selectedFlowId}
            onEditFlow={handleEditFlow}
            onRefresh={handleRefresh}
          />
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Selected Flow</CardTitle>
              <CardDescription>
                {selectedFlowId ? 'Flow details will appear here' : 'Select a flow from the tree'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFlowId ? (
                <div className="space-y-2">
                  <p><strong>Flow ID:</strong> {selectedFlowId}</p>
                  <p className="text-sm text-muted-foreground">
                    Flow details component will be integrated here
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No flow selected</p>
                  <p className="text-sm">Click on a flow in the tree to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Badge variant="outline">1</Badge>
              <div>
                <p className="font-medium">Create Sample Flows</p>
                <p className="text-sm text-muted-foreground">
                  Click "Create Sample Flows" to generate a hierarchical structure with goals, projects, tasks, and subtasks.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge variant="outline">2</Badge>
              <div>
                <p className="font-medium">Explore the Tree</p>
                <p className="text-sm text-muted-foreground">
                  Use the tree view to expand/collapse nodes and see the hierarchical structure.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge variant="outline">3</Badge>
              <div>
                <p className="font-medium">Create New Flows</p>
                <p className="text-sm text-muted-foreground">
                  Use the create form to add new flows with different types and parent relationships.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge variant="outline">4</Badge>
              <div>
                <p className="font-medium">Test Actions</p>
                <p className="text-sm text-muted-foreground">
                  Try the context menus to duplicate, edit, or delete flows.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 