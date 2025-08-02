import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadTemplate } from '@/lib/api';
import { templateCategories, difficultyLevels, targetAudiences } from '@/data/templates';
import type { FlowTemplate, WorkflowStep } from '@/types/templates';

// Form validation schema
const uploadFormSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.string().min(1, 'Difficulty level is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  tags: z.string().optional(),
  estimatedDurationMin: z.number().min(1, 'Minimum duration must be at least 1'),
  estimatedDurationMax: z.number().min(1, 'Maximum duration must be at least 1'),
  durationUnit: z.enum(['days', 'weeks', 'months']),
  notes: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadFormSchema>;

interface TemplateUploadFormProps {
  workflow?: {
    title: string;
    description?: string;
    steps: WorkflowStep[];
  };
  onSuccess?: (template: FlowTemplate) => void;
  onCancel?: () => void;
}

export const TemplateUploadForm: React.FC<TemplateUploadFormProps> = ({
  workflow,
  onSuccess,
  onCancel
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      name: workflow?.title || '',
      description: workflow?.description || '',
      category: '',
      difficulty: '',
      targetAudience: '',
      tags: '',
      estimatedDurationMin: 1,
      estimatedDurationMax: 4,
      durationUnit: 'weeks',
      notes: '',
    },
  });

  const onSubmit = async (data: UploadFormData) => {
    if (!workflow?.steps || workflow.steps.length === 0) {
      setErrorMessage('No workflow steps found. Please create a workflow first.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Convert workflow steps to template steps
      const templateSteps = workflow.steps.map((step, index) => ({
        id: step.id,
        title: step.title,
        description: step.description || `Step ${index + 1}: ${step.title}`,
        type: 'planning' as const, // Default type, can be enhanced later
        order: index,
        estimatedDuration: { min: 1, max: 3, unit: 'days' as const },
        requiredSkills: [],
        requiredTools: [],
        dependencies: step.dependencies || [],
        deliverables: [],
        acceptanceCriteria: [],
        riskLevel: 'medium' as const,
        costEstimate: { min: 0, max: 0, currency: 'USD' as const },
        automationPotential: 50,
        optimizationTips: [],
      }));

      // Calculate estimated total cost (basic calculation)
      const totalCost = templateSteps.length * 200; // $200 per step as a basic estimate

      const templateData = {
        name: data.name,
        description: data.description,
        category: data.category as any,
        difficulty: data.difficulty as any,
        targetAudience: data.targetAudience as any,
        estimatedDuration: {
          min: data.estimatedDurationMin,
          max: data.estimatedDurationMax,
          unit: data.durationUnit,
        },
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        steps: templateSteps,
        costAnalysis: {
          totalCost,
          breakdown: [
            {
              id: crypto.randomUUID(),
              name: 'Step Implementation',
              description: 'Cost for implementing workflow steps',
              type: 'one-time' as const,
              amount: totalCost,
              currency: 'USD' as const,
              frequency: 'one-time' as const,
            },
          ],
          currency: 'USD' as const,
          calculationDate: new Date(),
          assumptions: ['Basic implementation costs', 'Standard tools and resources'],
          riskFactors: ['Scope changes', 'Resource availability', 'Technical complexity'],
        },
        recommendedTools: [],
        optimizationSuggestions: [
          {
            category: 'efficiency' as const,
            title: 'Automate Repetitive Tasks',
            description: 'Identify and automate repetitive steps in the workflow',
            impact: 'high' as const,
            effort: 'medium' as const,
            implementation: 'Use workflow automation tools and scripts',
          },
        ],
        industryContext: {
          marketSize: 'Varies by industry',
          competition: 'Medium',
          regulations: [],
          trends: ['Automation', 'Digital transformation', 'Process optimization'],
          challenges: ['Change management', 'Technical implementation', 'User adoption'],
          opportunities: ['Improved efficiency', 'Cost reduction', 'Better quality'],
        },
        successMetrics: [
          {
            name: 'Completion Rate',
            description: 'Percentage of workflows completed successfully',
            target: '90%+',
            measurement: 'Workflow tracking system',
            frequency: 'weekly' as const,
          },
        ],
        risks: [
          {
            category: 'operational' as const,
            title: 'User Adoption',
            description: 'Risk of low user adoption of the new workflow',
            probability: 'medium' as const,
            impact: 'high' as const,
            mitigation: 'Provide training and support to users',
          },
        ],
        customizationOptions: [],
        isUserGenerated: true,
        status: 'pending' as const,
      };

      const { data: template, error } = await uploadTemplate(templateData);

      if (error) {
        throw new Error(error);
      }

      if (template) {
        setSubmitStatus('success');
        if (onSuccess) {
          onSuccess(template);
        } else {
          // Navigate to template detail page after a short delay
          setTimeout(() => {
            navigate(`/templates/${template.id}`);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error uploading template:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload template');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Workflow as Template
          </CardTitle>
          <CardDescription>
            Share your workflow with the community by uploading it as a template. 
            Your template will be reviewed before being published.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Template uploaded successfully! It's now under review and will be published soon.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === 'error' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter a descriptive name for your template"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Describe what this workflow accomplishes and who it's for"
                rows={3}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Category and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => form.setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select onValueChange={(value) => form.setValue('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.difficulty && (
                  <p className="text-sm text-red-600">{form.formState.errors.difficulty.message}</p>
                )}
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Select onValueChange={(value) => form.setValue('targetAudience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  {targetAudiences.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value}>
                      {audience.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.targetAudience && (
                <p className="text-sm text-red-600">{form.formState.errors.targetAudience.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                {...form.register('tags')}
                placeholder="Enter tags separated by commas (e.g., automation, marketing, sales)"
              />
              <p className="text-sm text-gray-500">
                Tags help others discover your template
              </p>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Estimated Duration *</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input
                    type="number"
                    {...form.register('estimatedDurationMin', { valueAsNumber: true })}
                    placeholder="Min"
                    min="1"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    {...form.register('estimatedDurationMax', { valueAsNumber: true })}
                    placeholder="Max"
                    min="1"
                  />
                </div>
                <div>
                  <Select onValueChange={(value) => form.setValue('durationUnit', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(form.formState.errors.estimatedDurationMin || form.formState.errors.estimatedDurationMax) && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.estimatedDurationMin?.message || form.formState.errors.estimatedDurationMax?.message}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Upload Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...form.register('notes')}
                placeholder="Any additional notes about this template or how to use it"
                rows={2}
              />
            </div>

            {/* Workflow Preview */}
            {workflow && (
              <div className="space-y-2">
                <Label>Workflow Preview</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="font-medium text-sm text-gray-700 mb-2">
                    {workflow.steps.length} steps will be included in this template
                  </p>
                  <div className="space-y-1">
                    {workflow.steps.slice(0, 3).map((step, index) => (
                      <div key={step.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                        <span>{step.title}</span>
                      </div>
                    ))}
                    {workflow.steps.length > 3 && (
                      <p className="text-sm text-gray-500">
                        ... and {workflow.steps.length - 3} more steps
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Template
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 