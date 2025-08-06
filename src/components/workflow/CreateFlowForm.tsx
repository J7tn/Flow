// Create Flow Form Component
// This component allows users to create new flows with nested structure support

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Briefcase, 
  CheckSquare, 
  Square, 
  Save, 
  X, 
  Loader2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { nestedFlowApi } from '@/lib/nestedFlowApi';
import type { CreateFlowPayload, FlowType, WorkflowInstance } from '@/types/nested-flows';

interface CreateFlowFormProps {
  parentFlowId?: string;
  flowToEdit?: WorkflowInstance;
  onSuccess?: (flow: WorkflowInstance) => void;
  onCancel?: () => void;
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

const getFlowTypeDescription = (flowType: FlowType) => {
  switch (flowType) {
    case 'goal':
      return 'High-level objectives and outcomes you want to achieve';
    case 'project':
      return 'Major initiatives that help accomplish your goals';
    case 'task':
      return 'Specific work items that make up a project';
    case 'subtask':
      return 'Detailed actions that complete a task';
    default:
      return '';
  }
};

export function CreateFlowForm({ 
  parentFlowId, 
  flowToEdit,
  onSuccess, 
  onCancel, 
  className 
}: CreateFlowFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  console.log('CreateFlowForm render - flowToEdit:', flowToEdit);
  
  const [formData, setFormData] = useState<CreateFlowPayload>({
    name: flowToEdit?.name || '',
    description: flowToEdit?.description || '',
    flow_type: flowToEdit?.flow_type || 'task',
    parent_flow_id: flowToEdit?.parent_flow_id || parentFlowId,
    customizations: flowToEdit?.customizations || {}
  });

  // Update form data when flowToEdit changes
  useEffect(() => {
    if (flowToEdit) {
      console.log('Updating form data with flowToEdit:', flowToEdit);
      setFormData({
        name: flowToEdit.name || '',
        description: flowToEdit.description || '',
        flow_type: flowToEdit.flow_type || 'task',
        parent_flow_id: flowToEdit.parent_flow_id || parentFlowId,
        customizations: flowToEdit.customizations || {}
      });
    }
  }, [flowToEdit, parentFlowId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a flow name',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      let result;
      if (flowToEdit) {
        // Update existing flow
        result = await nestedFlowApi.updateFlow(flowToEdit.id, formData);
      } else {
        // Create new flow
        result = await nestedFlowApi.createFlow(formData);
      }
      
      if (result.success && result.data) {
        toast({
          title: 'Success',
          description: flowToEdit ? 'Flow updated successfully' : 'Flow created successfully',
        });
        onSuccess?.(result.data);
      } else {
        toast({
          title: 'Error',
          description: result.error || (flowToEdit ? 'Failed to update flow' : 'Failed to create flow'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving flow:', error);
      toast({
        title: 'Error',
        description: flowToEdit ? 'Failed to update flow' : 'Failed to create flow',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateFlowPayload, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getFlowTypeColor(formData.flow_type)}`} />
            {getFlowTypeIcon(formData.flow_type)}
            <span>{flowToEdit ? 'Edit Flow' : 'Create New Flow'}</span>
          </CardTitle>
          <CardDescription>
            {flowToEdit ? 'Update the flow details below' : getFlowTypeDescription(formData.flow_type)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Flow Type Selection */}
            <div className="space-y-3">
              <Label>Flow Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {(['goal', 'project', 'task', 'subtask'] as FlowType[]).map((type) => (
                  <div
                    key={type}
                    className={`
                      relative p-4 border rounded-lg cursor-pointer transition-all
                      ${formData.flow_type === type 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                    onClick={() => handleInputChange('flow_type', type)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${getFlowTypeColor(type)}`} />
                      {getFlowTypeIcon(type)}
                      <div>
                        <div className="font-medium capitalize">{type}</div>
                        <div className="text-sm text-muted-foreground">
                          {getFlowTypeDescription(type)}
                        </div>
                      </div>
                    </div>
                    {formData.flow_type === type && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Flow Name */}
            <div className="space-y-2">
              <Label htmlFor="flow-name">Flow Name *</Label>
              <Input
                id="flow-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={`Enter ${formData.flow_type} name...`}
                className="text-lg"
              />
            </div>

            {/* Flow Description */}
            <div className="space-y-2">
              <Label htmlFor="flow-description">Description</Label>
              <Textarea
                id="flow-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={`Describe your ${formData.flow_type}...`}
                rows={3}
              />
            </div>

            {/* Parent Flow Info */}
            {parentFlowId && (
              <div className="space-y-2">
                <Label>Parent Flow</Label>
                <div className="p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      This flow will be created as a sub-flow
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Flow Type Badge */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Flow Type:</span>
              <Badge variant="outline" className="capitalize">
                <div className={`w-2 h-2 rounded-full ${getFlowTypeColor(formData.flow_type)} mr-1`} />
                {formData.flow_type}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {flowToEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {flowToEdit ? 'Update Flow' : 'Create Flow'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
} 