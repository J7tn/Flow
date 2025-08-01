import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Clock,
  Zap,
  Plus,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useChat2API } from "@/lib/hooks/useChat2API";

interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  type: "step" | "optimization" | "improvement";
  impact?: "low" | "medium" | "high";
  timeEstimate?: string;
  aiGenerated?: boolean;
}

interface SmartSuggestionPanelProps {
  workflowId?: string;
  currentSteps?: any[];
  workflowTitle?: string;
  workflowDescription?: string;
  onApplySuggestion?: (suggestion: SuggestionItem) => void;
  isOpen?: boolean;
}

const SmartSuggestionPanel: React.FC<SmartSuggestionPanelProps> = ({
  workflowId = "default-workflow",
  currentSteps = [],
  workflowTitle = "",
  workflowDescription = "",
  onApplySuggestion = () => {},
  isOpen = true,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    steps: true,
    optimizations: true,
    improvements: true,
  });
  const [suggestions, setSuggestions] = useState<Record<string, SuggestionItem[]>>({
    steps: [],
    optimizations: [],
    improvements: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");

  // Initialize AI hook
  const {
    isLoading: aiLoading,
    error: aiError,
    generateWorkflowSuggestions,
    optimizeWorkflow,
    estimateWorkflowCosts,
    healthCheck,
  } = useChat2API();

  // Check AI service health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await healthCheck();
      if (!isHealthy) {
        console.warn("AI service is not available");
      }
    };
    checkHealth();
  }, [healthCheck]);

  // Generate AI suggestions based on current workflow
  const generateAISuggestions = async () => {
    if (!currentSteps.length && !workflowTitle && !workflowDescription) {
      return;
    }

    setIsGenerating(true);
    try {
      // Create a description of the current workflow for AI analysis
      const workflowDescription = `
        Workflow Title: ${workflowTitle || "Untitled"}
        Workflow Description: ${workflowDescription || "No description"}
        Current Steps: ${currentSteps.map((step, index) => `${index + 1}. ${step.title}: ${step.description}`).join('\n')}
      `;

      // Generate workflow suggestions
      const suggestionsResponse = await generateWorkflowSuggestions(workflowDescription);
      
      // Generate optimizations
      const optimizationResponse = await optimizeWorkflow(
        currentSteps.map(step => step.title)
      );

      // Parse AI responses and convert to suggestion items
      const newSuggestions: Record<string, SuggestionItem[]> = {
        steps: parseAISuggestions(suggestionsResponse, "step"),
        optimizations: parseAISuggestions(optimizationResponse, "optimization"),
        improvements: [], // Will be populated based on analysis
      };

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error("Failed to generate AI suggestions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Parse AI response into structured suggestions
  const parseAISuggestions = (aiResponse: string, type: "step" | "optimization" | "improvement"): SuggestionItem[] => {
    const lines = aiResponse.split('\n').filter(line => line.trim());
    const suggestions: SuggestionItem[] = [];
    
    lines.forEach((line, index) => {
      if (line.match(/^\d+\./)) {
        const title = line.replace(/^\d+\.\s*/, '').trim();
        if (title) {
          suggestions.push({
            id: `ai-${type}-${index}`,
            title,
            description: `AI-generated ${type} suggestion`,
            type,
            impact: type === "optimization" ? "high" : "medium",
            timeEstimate: type === "step" ? "1-2 days" : undefined,
            aiGenerated: true,
          });
        }
      }
    });

    return suggestions;
  };

  // Generate custom suggestions based on user prompt
  const generateCustomSuggestions = async () => {
    if (!userPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await generateWorkflowSuggestions(userPrompt);
      const customSuggestions = parseAISuggestions(response, "step");
      
      setSuggestions(prev => ({
        ...prev,
        steps: [...prev.steps, ...customSuggestions],
      }));
      
      setUserPrompt("");
    } catch (error) {
      console.error("Failed to generate custom suggestions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate suggestions when workflow changes significantly
  useEffect(() => {
    if (currentSteps.length > 0) {
      // Debounce the generation to avoid too many API calls
      const timeoutId = setTimeout(() => {
        generateAISuggestions();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentSteps.length, workflowTitle, workflowDescription]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getImpactColor = (impact?: "low" | "medium" | "high") => {
    switch (impact) {
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const renderSuggestionItem = (item: SuggestionItem) => (
    <Card key={item.id} className="mb-3 bg-white dark:bg-gray-800">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{item.title}</h4>
              {item.aiGenerated && (
                <Sparkles className="h-3 w-3 text-blue-500" />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {item.description}
            </p>
            <div className="flex items-center mt-2 gap-2">
              {item.impact && (
                <Badge
                  variant="outline"
                  className={getImpactColor(item.impact)}
                >
                  {item.impact} impact
                </Badge>
              )}
              {item.timeEstimate && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {item.timeEstimate}
                </div>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2"
            onClick={() => onApplySuggestion(item)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full h-full bg-background border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
            Smart Suggestions
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            AI Powered
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          AI-powered recommendations based on your current workflow
        </p>
      </CardHeader>
      <Separator />
      
      <ScrollArea className="h-[calc(100%-80px)] p-4">
        {/* AI Service Status */}
        {aiError && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              AI service is not available. Suggestions will be limited.
            </AlertDescription>
          </Alert>
        )}

        {/* Custom Prompt Section */}
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Custom AI Prompt</h4>
          <Textarea
            placeholder="Describe what kind of suggestions you need..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="mb-2"
            rows={2}
          />
          <Button
            size="sm"
            onClick={generateCustomSuggestions}
            disabled={!userPrompt.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate Custom Suggestions
          </Button>
        </div>

        {/* Regenerate All Suggestions */}
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={generateAISuggestions}
            disabled={isGenerating || aiLoading}
            className="w-full"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Regenerate AI Suggestions
          </Button>
        </div>

        <div className="space-y-4">
          {/* Steps Suggestions */}
          <Collapsible open={openSections.steps} className="w-full">
            <CollapsibleTrigger
              onClick={() => toggleSection("steps")}
              className="flex w-full justify-between items-center py-2 px-1 hover:bg-accent rounded-md"
            >
              <div className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-medium">Suggested Steps</span>
                <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {suggestions.steps.length}
                </Badge>
              </div>
              {openSections.steps ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              {suggestions.steps.length > 0 ? (
                suggestions.steps.map(renderSuggestionItem)
              ) : (
                <p className="text-sm text-muted-foreground p-2">
                  No step suggestions yet. Add some workflow steps to get AI recommendations.
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Optimizations */}
          <Collapsible open={openSections.optimizations} className="w-full">
            <CollapsibleTrigger
              onClick={() => toggleSection("optimizations")}
              className="flex w-full justify-between items-center py-2 px-1 hover:bg-accent rounded-md"
            >
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-amber-500" />
                <span className="font-medium">Optimizations</span>
                <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                  {suggestions.optimizations.length}
                </Badge>
              </div>
              {openSections.optimizations ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              {suggestions.optimizations.length > 0 ? (
                suggestions.optimizations.map(renderSuggestionItem)
              ) : (
                <p className="text-sm text-muted-foreground p-2">
                  No optimization suggestions yet. Add more steps to get optimization recommendations.
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Improvements */}
          <Collapsible open={openSections.improvements} className="w-full">
            <CollapsibleTrigger
              onClick={() => toggleSection("improvements")}
              className="flex w-full justify-between items-center py-2 px-1 hover:bg-accent rounded-md"
            >
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-green-500" />
                <span className="font-medium">Improvements</span>
                <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {suggestions.improvements.length}
                </Badge>
              </div>
              {openSections.improvements ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              {suggestions.improvements.length > 0 ? (
                suggestions.improvements.map(renderSuggestionItem)
              ) : (
                <p className="text-sm text-muted-foreground p-2">
                  No improvement suggestions yet. Build your workflow to get improvement recommendations.
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default SmartSuggestionPanel;
