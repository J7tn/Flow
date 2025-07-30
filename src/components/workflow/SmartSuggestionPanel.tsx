import React, { useState } from "react";
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
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Clock,
  Zap,
  Plus,
  ArrowRight,
} from "lucide-react";

interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  type: "step" | "optimization" | "improvement";
  impact?: "low" | "medium" | "high";
  timeEstimate?: string;
}

interface SmartSuggestionPanelProps {
  workflowId?: string;
  currentSteps?: any[];
  onApplySuggestion?: (suggestion: SuggestionItem) => void;
  isOpen?: boolean;
}

const SmartSuggestionPanel: React.FC<SmartSuggestionPanelProps> = ({
  workflowId = "default-workflow",
  currentSteps = [],
  onApplySuggestion = () => {},
  isOpen = true,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    steps: true,
    optimizations: true,
    improvements: true,
  });

  // Mock suggestions data
  const mockSuggestions: Record<string, SuggestionItem[]> = {
    steps: [
      {
        id: "s1",
        title: "Add Research Phase",
        description:
          "Begin with a dedicated research phase to gather requirements and insights.",
        type: "step",
        timeEstimate: "2-3 days",
      },
      {
        id: "s2",
        title: "Include Stakeholder Review",
        description:
          "Add a review step to get feedback from key stakeholders before proceeding.",
        type: "step",
        timeEstimate: "1 day",
      },
      {
        id: "s3",
        title: "Add Testing Phase",
        description:
          "Include a dedicated testing phase to validate your results.",
        type: "step",
        timeEstimate: "2 days",
      },
    ],
    optimizations: [
      {
        id: "o1",
        title: "Parallelize Tasks",
        description:
          "These tasks can be done simultaneously to save time: Design and Content Creation.",
        type: "optimization",
        impact: "high",
      },
      {
        id: "o2",
        title: "Reduce Meeting Duration",
        description:
          "Consider shortening the planning meeting from 2 hours to 1 hour with a focused agenda.",
        type: "optimization",
        impact: "medium",
      },
    ],
    improvements: [
      {
        id: "i1",
        title: "Add Success Metrics",
        description:
          "Define clear success metrics for each major milestone in your workflow.",
        type: "improvement",
        impact: "high",
      },
      {
        id: "i2",
        title: "Include Documentation Step",
        description:
          "Add a step to document decisions and outcomes for future reference.",
        type: "improvement",
        impact: "medium",
      },
    ],
  };

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
          <div>
            <h4 className="font-medium text-sm">{item.title}</h4>
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
          Recommendations based on your current workflow
        </p>
      </CardHeader>
      <Separator />
      <ScrollArea className="h-[calc(100%-80px)] p-4">
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
                  {mockSuggestions.steps.length}
                </Badge>
              </div>
              {openSections.steps ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              {mockSuggestions.steps.map(renderSuggestionItem)}
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
                  {mockSuggestions.optimizations.length}
                </Badge>
              </div>
              {openSections.optimizations ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              {mockSuggestions.optimizations.map(renderSuggestionItem)}
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
                  {mockSuggestions.improvements.length}
                </Badge>
              </div>
              {openSections.improvements ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              {mockSuggestions.improvements.map(renderSuggestionItem)}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default SmartSuggestionPanel;
