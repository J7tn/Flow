import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Clock, DollarSign, Users, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  allTemplates, 
  templateCategories,
  type WorkflowTemplate,
  type TemplateCategory 
} from '@/data/templates';

interface TemplateBrowserProps {
  onTemplateSelect?: (template: WorkflowTemplate) => void;
}

export const TemplateBrowser: React.FC<TemplateBrowserProps> = ({ onTemplateSelect }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'duration' | 'cost'>('popularity');

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
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const handleTemplateSelect = (template: WorkflowTemplate) => {
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
          <h1 className="text-3xl font-bold">Workflow Templates</h1>
          <p className="text-muted-foreground">
            Browse and select from hundreds of industry-proven workflow templates
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
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
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
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
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

                {/* Optimization Potential */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Automation Potential</span>
                    <span className="font-medium">
                      {Math.round(
                        template.steps.reduce((acc, step) => acc + (step.automationPotential || 0), 0) / 
                        template.steps.length
                      )}%
                    </span>
                  </div>
                  <Progress 
                    value={
                      template.steps.reduce((acc, step) => acc + (step.automationPotential || 0), 0) / 
                      template.steps.length
                    } 
                    className="h-2"
                  />
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

                {/* Action Button */}
                <Button className="w-full" variant="default">
                  <Zap className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}; 