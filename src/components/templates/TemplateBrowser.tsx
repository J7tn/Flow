import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Star, Clock, DollarSign, Users, TrendingUp, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  allTemplates, 
  templateCategories
} from '@/data/templates';
import type { FlowTemplate } from '@/types/templates';

interface TemplateBrowserProps {
  onTemplateSelect?: (template: FlowTemplate) => void;
}

export const TemplateBrowser: React.FC<TemplateBrowserProps> = ({ onTemplateSelect }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTargetAudience, setSelectedTargetAudience] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'duration' | 'cost'>('popularity');
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = allTemplates;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(template => template.difficulty === selectedDifficulty);
    }

    // Filter by target audience
    if (selectedTargetAudience !== 'all') {
      filtered = filtered.filter(template => template.targetAudience === selectedTargetAudience);
    }

    // Filter by source (official vs user-generated)
    if (selectedSource !== 'all') {
      if (selectedSource === 'official') {
        filtered = filtered.filter(template => !template.isUserGenerated);
      } else if (selectedSource === 'user-generated') {
        filtered = filtered.filter(template => template.isUserGenerated);
      }
    }

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.usageCount - a.usageCount;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'duration':
          return a.estimatedDuration.min - b.estimatedDuration.min;
        case 'cost':
          return a.costAnalysis.totalCost - b.costAnalysis.totalCost;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedTargetAudience, selectedSource, sortBy]);

  // Get visible templates based on current count
  const visibleTemplates = useMemo(() => {
    return filteredTemplates.slice(0, visibleCount);
  }, [filteredTemplates, visibleCount]);

  // Check if there are more templates to load
  const hasMoreTemplates = visibleCount < filteredTemplates.length;

  // Load more templates function
  const loadMoreTemplates = useCallback(async () => {
    if (isLoading || !hasMoreTemplates) return;

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setVisibleCount(prev => Math.min(prev + 15, filteredTemplates.length));
    setIsLoading(false);
  }, [isLoading, hasMoreTemplates, filteredTemplates.length]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreTemplates && !isLoading) {
          loadMoreTemplates();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMoreTemplates, hasMoreTemplates, isLoading]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(15);
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedTargetAudience, sortBy]);

  const handleTemplateSelect = (template: FlowTemplate) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    } else {
      navigate(`/templates/${template.id}`);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Flow Templates</h1>
          <p className="text-muted-foreground">
            Browse and select from hundreds of industry-proven flow templates
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {templateCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTargetAudience} onValueChange={setSelectedTargetAudience}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Target Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Audiences</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="small-team">Small Team</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="official">Official Templates</SelectItem>
              <SelectItem value="user-generated">User Generated</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="duration">Quickest</SelectItem>
              <SelectItem value="cost">Lowest Cost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {visibleTemplates.length} of {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          </p>
          {hasMoreTemplates && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadMoreTemplates}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          )}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-[450px]"
              onClick={() => handleTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{template.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                
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
                      Community
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col overflow-hidden">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatDuration(
                        template.estimatedDuration.min,
                        template.estimatedDuration.max,
                        template.estimatedDuration.unit
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{formatCost(template.costAnalysis.totalCost, template.costAnalysis.currency)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{template.usageCount.toLocaleString()} uses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>{template.steps.length} steps</span>
                  </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto space-y-4">
                  {/* Cost Breakdown Preview */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cost Breakdown</span>
                      <span className="font-medium">
                        {formatCost(template.costAnalysis.totalCost, template.costAnalysis.currency)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {template.costAnalysis.breakdown.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex justify-between text-xs text-muted-foreground">
                          <span className="truncate">{item.name}</span>
                          <span>{formatCost(item.amount, item.currency)}</span>
                        </div>
                      ))}
                      {template.costAnalysis.breakdown.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{template.costAnalysis.breakdown.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Tools */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Top Tools</div>
                    <div className="flex flex-wrap gap-1">
                      {template.recommendedTools.slice(0, 3).map((tool) => (
                        <Badge key={tool.id} variant="outline" className="text-xs">
                          {tool.name}
                        </Badge>
                      ))}
                      {template.recommendedTools.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.recommendedTools.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Always at bottom */}
                <div className="pt-4 border-t space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/templates/${template.id}`);
                    }}
                  >
                    Preview Template
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (user) {
                        navigate(`/workflow/new?template=${template.id}`);
                      } else {
                        navigate('/signup', { state: { from: `/templates/${template.id}` } });
                      }
                    }}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {user ? 'Use Template' : 'Sign Up to Use'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-muted-foreground">Loading more templates...</span>
            </div>
          </div>
        )}

        {/* Scroll Sentinel for infinite scrolling */}
        <div id="scroll-sentinel" className="h-4" />

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No templates found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSelectedTargetAudience('all');
                setSelectedSource('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* End of results */}
        {!hasMoreTemplates && filteredTemplates.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              You've reached the end of the results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 