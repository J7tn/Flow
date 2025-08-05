import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Zap, 
  Loader2,
  ArrowLeft,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Share2,
  Heart,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TemplateReviews } from './TemplateReviews';
import { TemplateReviewForm } from './TemplateReviewForm';
import { allTemplates, templateCategories } from '@/data/templates';
import type { FlowTemplate } from '@/types/templates';

export const TemplateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [template, setTemplate] = useState<FlowTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Load template data
  useEffect(() => {
    loadTemplate();
  }, [id]);

  const loadTemplate = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Loading template with ID:', id);
      console.log('🔍 Available local template IDs:', allTemplates.map(t => t.id));
      console.log('🔍 Total templates available:', allTemplates.length);
      
      // First try to get from local templates
      let templateData = allTemplates.find(t => t.id === id);
      console.log('🔍 Found in local templates:', !!templateData);
      if (templateData) {
        console.log('🔍 Local template found:', templateData.name);
        console.log('🔍 Template data:', {
          id: templateData.id,
          name: templateData.name,
          category: templateData.category,
          hasThumbnail: !!templateData.thumbnail,
          hasAuthorName: !!templateData.authorName,
          hasCreatedAt: !!templateData.createdAt,
          hasIsUserGenerated: templateData.isUserGenerated !== undefined,
          hasStatus: !!templateData.status
        });
      }
      
      if (!templateData) {
        console.log('🔍 Not found locally, checking database...');
        console.log('🔍 Searching for exact ID match:', id);
        console.log('🔍 Available IDs for comparison:', allTemplates.map(t => ({ id: t.id, name: t.name })));
        
        // If not found locally, try to get from database
        const supabaseClient = supabase();
        if (!supabaseClient) {
          throw new Error('Supabase client not available');
        }
        
        console.log('🔍 Querying database for template ID:', id);
        const { data, error } = await supabaseClient
          .from('workflow_templates')
          .select('*')
          .eq('id', id)
          .eq('is_public', true)
          .single();

        if (error) {
          console.error('🔍 Database error:', error);
          throw error;
        }
        
        if (!data) {
          console.log('🔍 Template not found in database either');
          console.log('🔍 Final result: Template not found in any source');
          throw new Error('Template not found');
        }
        
        console.log('🔍 Found in database:', data.name);
        
        // Transform database data to match FlowTemplate interface
        templateData = {
          id: data.id,
          name: data.name,
          description: data.description,
          category: data.category,
          difficulty: data.difficulty,
          targetAudience: data.target_audience,
          estimatedDuration: {
            min: data.estimated_duration_min,
            max: data.estimated_duration_max,
            unit: data.duration_unit
          },
          tags: data.tags || [],
          thumbnail: data.thumbnail_url, // Map thumbnailUrl to thumbnail
          version: '1.0.0', // Default version
          author: data.author_name || 'Unknown',
          authorName: data.author_name || 'Unknown', // Add authorName field
          lastUpdated: new Date(data.updated_at || data.created_at),
          createdAt: new Date(data.created_at), // Add createdAt field
          isPublic: data.is_public,
          rating: data.rating,
          usageCount: data.usage_count || 0,
          steps: data.steps || [],
          costAnalysis: data.cost_analysis || {
            totalCost: 0,
            currency: 'USD',
            breakdown: [],
            calculationDate: new Date()
          },
          recommendedTools: data.recommended_tools || [],
          optimizationSuggestions: data.optimization_suggestions || [],
          industryContext: data.industry_context || {},
          successMetrics: data.success_metrics || [],
          risks: data.risks || [],
          customizationOptions: data.customization_options || [],
          isUserGenerated: data.is_user_generated,
          status: data.status || 'approved',
          moderationNotes: data.moderation_notes,
          moderatedBy: data.moderated_by,
          moderatedAt: data.moderated_at ? new Date(data.moderated_at) : undefined,
          rejectionReason: data.rejection_reason
        };
      }

      console.log('✅ Setting template:', templateData.name);
      setTemplate(templateData);

      // Check if user has favorited this template
      if (user) {
        const supabaseClient = supabase();
        if (supabaseClient) {
          const { data: favoriteData } = await supabaseClient
            .from('user_favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('template_id', id)
            .single();

          setIsFavorite(!!favoriteData);
        }
      }

    } catch (error) {
      console.error('❌ Error loading template:', error);
      toast({
        title: "Template Not Found",
        description: "The template you're looking for doesn't exist or is not available.",
        variant: "destructive"
      });
      navigate('/templates');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save favorites",
        variant: "destructive"
      });
      return;
    }

    try {
      const supabaseClient = supabase();
      if (!supabaseClient) {
        throw new Error('Supabase client not available');
      }

      if (isFavorite) {
        await supabaseClient
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('template_id', template!.id);
      } else {
        await supabaseClient
          .from('user_favorites')
          .insert({
            user_id: user.id,
            template_id: template!.id
          });
      }

      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorite 
          ? "Template removed from your favorites" 
          : "Template added to your favorites",
      });

    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Copy template link
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Template link copied to clipboard",
    });
  };

  // Share template
  const shareTemplate = () => {
    if (navigator.share) {
      navigator.share({
        title: template?.name || 'Flow Template',
        text: template?.description || 'Check out this workflow template',
        url: window.location.href,
      });
    } else {
      copyLink();
    }
  };

  // Use template
  const useTemplate = () => {
    if (user) {
      navigate(`/workflow/new?template=${template!.id}`);
    } else {
      navigate('/signup', { state: { from: `/templates/${template!.id}` } });
    }
  };

  // Format functions
  const formatDuration = (min: number, max: number, unit: string) => {
    if (min === max) {
      return `${min} ${unit}${min > 1 ? 's' : ''}`;
    }
    return `${min}-${max} ${unit}${max > 1 ? 's' : ''}`;
  };

  const formatCost = (cost: number, currency: string) => {
    if (cost >= 1000000) {
      return `${(cost / 1000000).toFixed(1)}M ${currency}`;
    }
    if (cost >= 1000) {
      return `${(cost / 1000).toFixed(0)}K ${currency}`;
    }
    return `${cost} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-muted-foreground">Loading template...</span>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Template Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The template you're looking for doesn't exist or is not available.
        </p>
        <Button onClick={() => navigate('/templates')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/templates')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{template.name}</h1>
            <p className="text-muted-foreground mt-1">{template.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={shareTemplate}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Button 
            variant={isFavorite ? "default" : "outline"} 
            size="sm" 
            onClick={toggleFavorite}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </Button>
          <Button onClick={useTemplate}>
            <Zap className="h-4 w-4 mr-2" />
            {user ? 'Use Template' : 'Sign Up to Use'}
          </Button>
        </div>
      </div>

      {/* Template Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="font-semibold">{template.rating?.toFixed(1) || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">
                  {formatDuration(
                    template.estimatedDuration.min,
                    template.estimatedDuration.max,
                    template.estimatedDuration.unit
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Cost</p>
                <p className="font-semibold">
                  {formatCost(template.costAnalysis.totalCost, template.costAnalysis.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Usage</p>
                <p className="font-semibold">{template.usageCount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags and Categories */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          {templateCategories.find(c => c.id === template.category)?.icon} 
          {templateCategories.find(c => c.id === template.category)?.name}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {template.difficulty}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {template.targetAudience === 'individual' ? 'Individual' : 
           template.targetAudience === 'small-team' ? 'Small Team' : 'Enterprise'}
        </Badge>
        {template.isUserGenerated && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Community Template
          </Badge>
        )}
        {template.tags.map(tag => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Author Information */}
      {template.isUserGenerated && template.authorName && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Created by {template.authorName}</p>
                <p className="text-sm text-muted-foreground">
                  Published {formatDate(template.createdAt?.toISOString() || '')}
                </p>
              </div>
              <Badge variant="outline" className="ml-auto">
                <CheckCircle className="h-3 w-3 mr-1" />
                Community Contributor
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="tools">Tools & Costs</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{template.description}</p>
              </div>
              
              {template.successMetrics.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Success Metrics</h4>
                  <ul className="space-y-1">
                    {template.successMetrics.map((metric, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        <span className="text-sm">{metric.name}: {metric.target}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {template.risks.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Potential Risks</h4>
                  <ul className="space-y-1">
                    {template.risks.map((risk, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                        <span className="text-sm">{risk.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Steps</CardTitle>
              <CardDescription>
                {template.steps.length} steps to complete this workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {template.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{step.title}</h4>
                      {step.description && (
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      )}
                      {step.estimatedDuration && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Estimated: {step.estimatedDuration.min}-{step.estimatedDuration.max} {step.estimatedDuration.unit}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recommended Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Tools</CardTitle>
                <CardDescription>
                  Tools and software recommended for this workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {template.recommendedTools.map((tool) => (
                    <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{tool.name}</h4>
                        <p className="text-sm text-muted-foreground">{tool.category}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Learn More
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>
                  Detailed cost analysis for this workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Cost</span>
                    <span className="text-lg font-bold">
                      {formatCost(template.costAnalysis.totalCost, template.costAnalysis.currency)}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    {template.costAnalysis.breakdown.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <span className="font-medium">
                          {formatCost(item.amount, item.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Reviews & Ratings</h3>
              <p className="text-muted-foreground">
                See what others think about this template
              </p>
            </div>
            <Button onClick={() => setShowReviewForm(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </div>
          
          {template && <TemplateReviews template={template} />}
        </TabsContent>
      </Tabs>

      {/* Review Form Modal */}
      {showReviewForm && template && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <TemplateReviewForm
                template={template}
                onSuccess={() => {
                  setShowReviewForm(false);
                  // Optionally refresh reviews
                }}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 