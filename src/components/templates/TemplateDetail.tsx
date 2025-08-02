import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Play,
  Share2,
  Bookmark,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  allTemplates, 
  templateCategories
} from '@/data/templates';
import { getTemplateReviews, getUserReview } from '@/lib/api';
import { ReviewSubmissionForm } from './ReviewSubmissionForm';
import { ReviewDisplay } from './ReviewDisplay';
import type { FlowTemplate, TemplateReview } from '@/types/templates';

export const TemplateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [reviews, setReviews] = useState<TemplateReview[]>([]);
  const [userReview, setUserReview] = useState<TemplateReview | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const { user } = useAuth();

  // Find the template by ID
  const template = allTemplates.find(t => t.id === id);

  if (!template) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Template not found</h2>
        <p className="text-muted-foreground mb-6">
          The template you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/templates')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
      </div>
    );
  }

  const category = templateCategories.find(c => c.id === template.category);

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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleUseTemplate = () => {
    if (user) {
      navigate(`/workflow/new?template=${template.id}`);
    } else {
      navigate('/signup', { state: { from: `/templates/${template.id}` } });
    }
  };

  // Load reviews
  useEffect(() => {
    if (id) {
      loadReviews();
    }
  }, [id]);

  const loadReviews = async () => {
    if (!id) return;
    
    setIsLoadingReviews(true);
    try {
      const [reviewsResult, userReviewResult] = await Promise.all([
        getTemplateReviews(id),
        user ? getUserReview(id) : Promise.resolve({ data: null, error: null })
      ]);

      if (reviewsResult.data) {
        setReviews(reviewsResult.data);
      }

      if (userReviewResult.data) {
        setUserReview(userReviewResult.data);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleReviewSuccess = (review: TemplateReview) => {
    setUserReview(review);
    setShowReviewForm(false);
    loadReviews(); // Reload all reviews to update the list
  };

  const handleReviewCancel = () => {
    setShowReviewForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/templates')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{template.name}</h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleUseTemplate}>
            <Play className="h-4 w-4 mr-2" />
            Use Template
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{template.rating?.toFixed(1) || 'N/A'}</span>
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">
                {formatDuration(
                  template.estimatedDuration.min,
                  template.estimatedDuration.max,
                  template.estimatedDuration.unit
                )}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Duration</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">
                {formatCost(template.costAnalysis.totalCost, template.costAnalysis.currency)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Total Cost</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">{template.usageCount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">Users</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="reviews">
            <MessageCircle className="h-4 w-4 mr-2" />
            Reviews ({reviews.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {category?.icon} {category?.name}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {template.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      v{template.version}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{template.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Industry Context */}
              <Card>
                <CardHeader>
                  <CardTitle>Industry Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {template.industryContext.marketSize && (
                    <div>
                      <h4 className="font-medium">Market Size</h4>
                      <p className="text-sm text-muted-foreground">{template.industryContext.marketSize}</p>
                    </div>
                  )}
                  {template.industryContext.competition && (
                    <div>
                      <h4 className="font-medium">Competition</h4>
                      <p className="text-sm text-muted-foreground">{template.industryContext.competition}</p>
                    </div>
                  )}
                  {template.industryContext.trends && template.industryContext.trends.length > 0 && (
                    <div>
                      <h4 className="font-medium">Current Trends</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {template.industryContext.trends.map((trend, index) => (
                          <li key={index}>• {trend}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Success Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Success Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {template.successMetrics.map((metric) => (
                    <div key={metric.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{metric.name}</span>
                        <span className="text-muted-foreground">{metric.target}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Risks */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {template.risks.map((risk) => (
                    <div key={risk.description} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{risk.category}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getRiskColor(risk.impact)}`}
                        >
                          {risk.impact}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{risk.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Steps Tab */}
        <TabsContent value="steps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Process Steps</CardTitle>
              <CardDescription>
                {template.steps.length} steps • {template.steps.length} dependencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {template.steps.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {step.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">
                          {formatDuration(
                            step.estimatedDuration.min,
                            step.estimatedDuration.max,
                            step.estimatedDuration.unit
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost:</span>
                        <div className="font-medium">
                          {formatCost(step.costEstimate.min, step.costEstimate.currency)} - 
                          {formatCost(step.costEstimate.max, step.costEstimate.currency)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Risk:</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getRiskColor(step.riskLevel)}`}
                        >
                          {step.riskLevel}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Automation:</span>
                        <div className="font-medium">{step.automationPotential || 0}%</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Required Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {step.requiredSkills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Required Tools:</span>
                        <div className="flex flex-wrap gap-1">
                          {step.requiredTools.map((tool) => (
                            <Badge key={tool} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Deliverables:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {step.deliverables.map((deliverable) => (
                          <li key={deliverable} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {step.optimizationTips && step.optimizationTips.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Optimization Tips:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {step.optimizationTips.map((tip) => (
                            <li key={tip} className="flex items-center space-x-2">
                              <Zap className="h-3 w-3 text-yellow-500" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Costs Tab */}
        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Summary</CardTitle>
                <CardDescription>
                  Total estimated cost: {formatCost(template.costAnalysis.totalCost, template.costAnalysis.currency)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Cost</span>
                    <span className="font-bold text-lg">
                      {formatCost(template.costAnalysis.totalCost, template.costAnalysis.currency)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {template.costAnalysis.breakdown.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCost(item.amount, item.currency)}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {item.frequency}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Assumptions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {template.costAnalysis.assumptions?.map((assumption, index) => (
                      <li key={index}>• {assumption}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Risk Factors</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {template.costAnalysis.riskFactors?.map((risk, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Cost by Step */}
            <Card>
              <CardHeader>
                <CardTitle>Cost by Step</CardTitle>
                <CardDescription>Cost breakdown for each process step</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {template.steps.map((step, index) => (
                    <div key={step.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {index + 1}. {step.title}
                        </span>
                        <span className="text-sm">
                          {formatCost(step.costEstimate.min, step.costEstimate.currency)} - 
                          {formatCost(step.costEstimate.max, step.costEstimate.currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Tools & Technologies</CardTitle>
              <CardDescription>
                {template.recommendedTools.length} tools recommended for this workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {template.recommendedTools.map((tool) => (
                  <Card key={tool.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {tool.category}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pricing:</span>
                          <span className="font-medium">
                            {tool.pricing.model === 'free' ? 'Free' : 
                             tool.pricing.startingPrice ? 
                             `${tool.pricing.startingPrice} ${tool.pricing.currency}` : 
                             'Contact for pricing'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Learning Curve:</span>
                          <Badge variant="outline" className="capitalize">
                            {tool.learningCurve}
                          </Badge>
                        </div>
                        {tool.popularity && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Popularity:</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(10)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < tool.popularity! ? 'bg-yellow-400' : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {tool.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {tool.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tool.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-green-600">Pros:</h4>
                          <ul className="text-muted-foreground space-y-1">
                            {tool.pros.slice(0, 2).map((pro) => (
                              <li key={pro}>• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-600">Cons:</h4>
                          <ul className="text-muted-foreground space-y-1">
                            {tool.cons.slice(0, 2).map((con) => (
                              <li key={con}>• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {tool.website && (
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Suggestions</CardTitle>
              <CardDescription>
                AI-powered recommendations to improve efficiency, reduce costs, and enhance quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {template.optimizationSuggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{suggestion.title}</h3>
                        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge 
                          variant="outline" 
                          className={suggestion.impact === 'high' ? 'text-green-600 bg-green-50' : 
                                   suggestion.impact === 'medium' ? 'text-yellow-600 bg-yellow-50' : 
                                   'text-blue-600 bg-blue-50'}
                        >
                          {suggestion.impact} impact
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={suggestion.effort === 'low' ? 'text-green-600 bg-green-50' : 
                                   suggestion.effort === 'medium' ? 'text-yellow-600 bg-yellow-50' : 
                                   'text-red-600 bg-red-50'}
                        >
                          {suggestion.effort} effort
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Implementation:</h4>
                      <p className="text-sm text-muted-foreground">{suggestion.implementation}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Category: {suggestion.category}
                      </span>
                      <Button variant="outline" size="sm">
                        <Zap className="h-4 w-4 mr-2" />
                        Apply Suggestion
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Reviews</h2>
              <p className="text-muted-foreground">
                See what others think about this template
              </p>
            </div>
            {user && !userReview && (
              <Button onClick={() => setShowReviewForm(true)}>
                <Star className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <ReviewSubmissionForm
              templateId={template.id}
              existingReview={userReview}
              onSuccess={handleReviewSuccess}
              onCancel={handleReviewCancel}
            />
          )}

          {/* User's Review */}
          {userReview && !showReviewForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Review</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReviewForm(true)}
                  >
                    Edit Review
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewDisplay
                  reviews={[userReview]}
                  onReviewUpdate={loadReviews}
                />
              </CardContent>
            </Card>
          )}

          {/* All Reviews */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Community Reviews ({reviews.length})
            </h3>
            {isLoadingReviews ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading reviews...</p>
              </div>
            ) : (
              <ReviewDisplay
                reviews={userReview ? reviews.filter(r => r.id !== userReview.id) : reviews}
                onReviewUpdate={loadReviews}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 