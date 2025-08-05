import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Save, 
  Eye, 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  Zap,
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  X,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { FlowTemplate } from '@/types/templates';

interface TemplateUploadFormProps {
  workflowData?: any; // Data from existing workflow
  workflow?: {
    title: string;
    description: string;
    steps: any[];
  };
  onSuccess?: (templateId: string) => void;
  onCancel?: () => void;
}

export const TemplateUploadForm: React.FC<TemplateUploadFormProps> = ({
  workflowData,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: workflowData?.name || '',
    description: workflowData?.description || '',
    category: 'software-development',
    difficulty: 'intermediate',
    targetAudience: 'small-team',
    estimatedDurationMin: 1,
    estimatedDurationMax: 4,
    durationUnit: 'weeks',
    tags: [] as string[],
    thumbnailUrl: '',
    isPublic: true,
    steps: workflowData?.steps || [],
    costAnalysis: workflowData?.costAnalysis || {
      totalCost: 0,
      currency: 'USD',
      breakdown: []
    },
    recommendedTools: workflowData?.recommendedTools || [],
    optimizationSuggestions: [],
    industryContext: {},
    successMetrics: [],
    risks: [],
    customizationOptions: []
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Categories for selection
  const categories = [
    { id: 'software-development', name: 'Software Development', icon: '💻' },
    { id: 'game-design', name: 'Game Design', icon: '🎮' },
    { id: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
    { id: 'marketing', name: 'Marketing', icon: '📢' },
    { id: 'business-operations', name: 'Business Operations', icon: '🏢' },
    { id: 'creative-projects', name: 'Creative Projects', icon: '🎨' },
    { id: 'research-development', name: 'Research & Development', icon: '🔬' },
    { id: 'customer-service', name: 'Customer Service', icon: '🎧' },
    { id: 'human-resources', name: 'Human Resources', icon: '👥' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'legal', name: 'Legal', icon: '⚖️' },
    { id: 'real-estate', name: 'Real Estate', icon: '🏠' },
    { id: 'consulting', name: 'Consulting', icon: '💼' },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
    { id: 'content-creation', name: 'Content Creation', icon: '✍️' },
    { id: 'event-planning', name: 'Event Planning', icon: '🎉' },
    { id: 'product-management', name: 'Product Management', icon: '📋' },
    { id: 'quality-assurance', name: 'Quality Assurance', icon: '✅' }
  ];

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (formData.estimatedDurationMin <= 0) {
      newErrors.estimatedDurationMin = 'Duration must be greater than 0';
    }

    if (formData.estimatedDurationMax < formData.estimatedDurationMin) {
      newErrors.estimatedDurationMax = 'Maximum duration must be greater than minimum';
    }

    if (formData.steps.length === 0) {
      newErrors.steps = 'At least one step is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload templates",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabaseClient = supabase();
      if (!supabaseClient) {
        throw new Error('Supabase client not available');
      }

      // Get user profile
      const { data: userProfile } = await supabaseClient
        .from('user_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      // Prepare template data
      const templateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        target_audience: formData.targetAudience,
        estimated_duration_min: formData.estimatedDurationMin,
        estimated_duration_max: formData.estimatedDurationMax,
        duration_unit: formData.durationUnit,
        tags: formData.tags,
        thumbnail_url: formData.thumbnailUrl,
        is_public: formData.isPublic,
        is_user_generated: true,
        status: 'pending',
        author_id: user.id,
        author_name: userProfile?.full_name || user.email?.split('@')[0] || 'Anonymous',
        steps: formData.steps,
        cost_analysis: formData.costAnalysis,
        recommended_tools: formData.recommendedTools,
        optimization_suggestions: formData.optimizationSuggestions,
        industry_context: formData.industryContext,
        success_metrics: formData.successMetrics,
        risks: formData.risks,
        customization_options: formData.customizationOptions
      };

      // Insert template
      const { data: template, error } = await supabaseClient
        .from('workflow_templates')
        .insert(templateData)
        .select()
        .single();

      if (error) throw error;

      // Track upload
      await supabaseClient
        .from('template_uploads')
        .insert({
          template_id: template.id,
          uploader_id: user.id,
          upload_notes: 'Template uploaded via form'
        });

      toast({
        title: "Template Uploaded Successfully!",
        description: "Your template is now pending review and will be available to the community soon.",
      });

      if (onSuccess) {
        onSuccess(template.id);
      } else {
        navigate(`/templates/${template.id}`);
      }

    } catch (error) {
      console.error('Error uploading template:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Preview template
  const previewTemplate: FlowTemplate = {
    id: 'preview',
    name: formData.name || 'Template Name',
    description: formData.description || 'Template description will appear here...',
    category: formData.category as any,
    difficulty: formData.difficulty as any,
    targetAudience: formData.targetAudience as any,
    estimatedDuration: {
      min: formData.estimatedDurationMin,
      max: formData.estimatedDurationMax,
      unit: formData.durationUnit as any
    },
    tags: formData.tags,
    thumbnail: formData.thumbnailUrl,
    version: '1.0.0',
    author: user?.email?.split('@')[0] || 'Anonymous',
    authorName: user?.email?.split('@')[0] || 'Anonymous',
    lastUpdated: new Date(),
    createdAt: new Date(),
    isPublic: true,
    rating: 0,
    usageCount: 0,
    isUserGenerated: true,
    status: 'pending',
    steps: formData.steps,
    costAnalysis: formData.costAnalysis,
    recommendedTools: formData.recommendedTools,
    optimizationSuggestions: formData.optimizationSuggestions,
    industryContext: formData.industryContext,
    successMetrics: formData.successMetrics,
    risks: formData.risks,
    customizationOptions: formData.customizationOptions
  };

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to upload templates to the community.
            </p>
            <Button onClick={() => navigate('/login')}>
              Sign In to Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Share Your Template</h1>
          <p className="text-muted-foreground">
            Share your workflow with the community and help others succeed
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {isPreviewMode ? (
        /* Preview Mode */
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Template Preview
            </CardTitle>
            <CardDescription>
              This is how your template will appear to other users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{previewTemplate.name}</h3>
                  <p className="text-muted-foreground">{previewTemplate.description}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">New</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {categories.find(c => c.id === previewTemplate.category)?.icon} 
                  {categories.find(c => c.id === previewTemplate.category)?.name}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {previewTemplate.difficulty}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {previewTemplate.targetAudience === 'individual' ? 'Individual' : 
                   previewTemplate.targetAudience === 'small-team' ? 'Small Team' : 'Enterprise'}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Community
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {previewTemplate.estimatedDuration.min}-{previewTemplate.estimatedDuration.max} {previewTemplate.estimatedDuration.unit}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${previewTemplate.costAnalysis.totalCost}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>0 uses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span>{previewTemplate.steps.length} steps</span>
                </div>
              </div>

              {previewTemplate.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {previewTemplate.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                By {previewTemplate.authorName} • Pending review
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Edit Mode */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide essential details about your template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Agile Software Development Workflow"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this template helps users accomplish..."
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.description.length}/500 characters (minimum 50)
                  </p>
                  {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty Level *</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="small-team">Small Team (2-10 people)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (10+ people)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Duration & Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Duration & Settings</CardTitle>
                <CardDescription>
                  Set time estimates and visibility options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="durationMin">Min Duration *</Label>
                    <Input
                      id="durationMin"
                      type="number"
                      min="1"
                      value={formData.estimatedDurationMin}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedDurationMin: parseInt(e.target.value) || 1 }))}
                      className={errors.estimatedDurationMin ? 'border-red-500' : ''}
                    />
                    {errors.estimatedDurationMin && <p className="text-sm text-red-500 mt-1">{errors.estimatedDurationMin}</p>}
                  </div>
                  <div>
                    <Label htmlFor="durationMax">Max Duration *</Label>
                    <Input
                      id="durationMax"
                      type="number"
                      min="1"
                      value={formData.estimatedDurationMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedDurationMax: parseInt(e.target.value) || 1 }))}
                      className={errors.estimatedDurationMax ? 'border-red-500' : ''}
                    />
                    {errors.estimatedDurationMax && <p className="text-sm text-red-500 mt-1">{errors.estimatedDurationMax}</p>}
                  </div>
                  <div>
                    <Label htmlFor="durationUnit">Unit</Label>
                    <Select value={formData.durationUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, durationUnit: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
                  <Input
                    id="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                    placeholder="https://example.com/image.png"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isPublic">Make template public</Label>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Template Review Process</p>
                      <p className="mt-1">
                        All community templates are reviewed by our team before being published. 
                        This usually takes 1-3 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Content Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Content</CardTitle>
              <CardDescription>
                Summary of your workflow content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{formData.steps.length}</div>
                  <div className="text-sm text-muted-foreground">Steps</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{formData.recommendedTools.length}</div>
                  <div className="text-sm text-muted-foreground">Tools</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">${formData.costAnalysis.totalCost}</div>
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{formData.tags.length}</div>
                  <div className="text-sm text-muted-foreground">Tags</div>
                </div>
              </div>
              
              {errors.steps && (
                <p className="text-sm text-red-500 mt-2">{errors.steps}</p>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Template
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}; 