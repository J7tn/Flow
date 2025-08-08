import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Save,
  Trash2,
  MoveHorizontal,
  Settings,
  ChevronRight,
  Sparkles,
  Brain,
  Calculator,
  RefreshCw,
  AlertCircle,
  Upload,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useChat2API } from "@/lib/hooks/useChat2API";
import SmartSuggestionPanel from "./SmartSuggestionPanel";
import VisualProgressTracker from "./VisualProgressTracker";
import PermanentDashboard from "../shared/PermanentDashboard";
import { TemplateUploadForm } from "../templates/TemplateUploadForm";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  dependencies: string[];
  progress: number;
}

interface WorkflowBuilderProps {
  initialWorkflow?: {
    id: string;
    title: string;
    description: string;
    steps: WorkflowStep[];
  };
  onSave?: (workflow: any) => void;
}

const WorkflowBuilder = ({
  initialWorkflow = {
    id: "",
    title: "New Workflow",
    description: "Describe your workflow here",
    steps: [],
  },
  onSave = () => {},
}: WorkflowBuilderProps) => {
  const [workflow, setWorkflow] = useState(initialWorkflow);
  const [activeTab, setActiveTab] = useState("canvas");
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [aiStatus, setAiStatus] = useState<{
    isGenerating: boolean;
    error: string | null;
    costAnalysis: string | null;
  }>({
    isGenerating: false,
    error: null,
    costAnalysis: null,
  });

  // Initialize AI hook
  const {
    isLoading: aiLoading,
    error: aiError,
    generateWorkflowSuggestions,
    optimizeWorkflow,
    estimateWorkflowCosts,
    generateTemplateSuggestions,
    healthCheck,
  } = useChat2API();

  const templates = [
    { id: "blank", name: "Blank Workflow" },
    { id: "project", name: "Project Management" },
    { id: "daily", name: "Daily Routine" },
    { id: "learning", name: "Learning Path" },
  ];

  const stepTypes = [
    { id: "task", name: "Task" },
    { id: "milestone", name: "Milestone" },
    { id: "decision", name: "Decision Point" },
    { id: "resource", name: "Resource Allocation" },
  ];

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      title: "New Step",
      description: "Describe this step",
      type: "task",
      duration: 60, // minutes
      dependencies: [],
      progress: 0,
    };

    setWorkflow({
      ...workflow,
      steps: [...workflow.steps, newStep],
    });
    setSelectedStep(newStep.id);
  };

  const updateStep = (id: string, updates: Partial<WorkflowStep>) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.map((step) =>
        step.id === id ? { ...step, ...updates } : step,
      ),
    });
  };

  const deleteStep = (id: string) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.filter((step) => step.id !== id),
    });
    if (selectedStep === id) {
      setSelectedStep(null);
    }
  };

  const handleSave = () => {
    onSave(workflow);
    // Show success message or redirect
  };

  const handleUploadSuccess = (template: any) => {
    setShowUploadForm(false);
    // You could show a success message or navigate to the template
    console.log('Template uploaded successfully:', template);
  };

  const handleUploadCancel = () => {
    setShowUploadForm(false);
  };

  // AI-powered step generation
  const generateAISteps = async () => {
    if (!workflow.title && !workflow.description) {
      setAiStatus(prev => ({ ...prev, error: "Please provide a workflow title or description first" }));
      return;
    }

    setAiStatus(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const prompt = `Create a workflow for: ${workflow.title || "Untitled"}
Description: ${workflow.description || "No description provided"}
Please suggest 3-5 workflow steps that would be appropriate for this type of project.`;

      const response = await generateWorkflowSuggestions(prompt);
      
      // Parse the AI response and create new steps
      const lines = response.split('\n').filter(line => line.trim());
      const newSteps: WorkflowStep[] = [];
      
      lines.forEach((line, index) => {
        if (line.match(/^\d+\./)) {
          const title = line.replace(/^\d+\.\s*/, '').trim();
          if (title) {
            newSteps.push({
              id: `ai-step-${Date.now()}-${index}`,
              title,
              description: `AI-generated step: ${title}`,
              type: "task",
              duration: 60,
              dependencies: [],
            });
          }
        }
      });

      if (newSteps.length > 0) {
        setWorkflow(prev => ({
          ...prev,
          steps: [...prev.steps, ...newSteps],
        }));
      }
    } catch (error) {
      setAiStatus(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : "Failed to generate AI steps" 
      }));
    } finally {
      setAiStatus(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // AI-powered workflow optimization
  const optimizeWorkflowWithAI = async () => {
    if (workflow.steps.length === 0) {
      setAiStatus(prev => ({ ...prev, error: "No steps to optimize" }));
      return;
    }

    setAiStatus(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const stepTitles = workflow.steps.map(step => step.title);
      const optimizationResponse = await optimizeWorkflow(stepTitles);
      
      // For now, we'll just show the optimization suggestions
      // In a full implementation, you might want to apply them automatically
      console.log("AI Optimization suggestions:", optimizationResponse);
      
      // You could add a modal or notification to show the optimization suggestions
      alert("AI optimization suggestions generated! Check the console for details.");
    } catch (error) {
      setAiStatus(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : "Failed to optimize workflow" 
      }));
    } finally {
      setAiStatus(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // AI-powered cost analysis
  const analyzeCostsWithAI = async () => {
    if (workflow.steps.length === 0) {
      setAiStatus(prev => ({ ...prev, error: "No steps to analyze" }));
      return;
    }

    setAiStatus(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const stepTitles = workflow.steps.map(step => step.title);
      const costAnalysis = await estimateWorkflowCosts(stepTitles);
      
      setAiStatus(prev => ({ ...prev, costAnalysis }));
    } catch (error) {
      setAiStatus(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : "Failed to analyze costs" 
      }));
    } finally {
      setAiStatus(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // AI-powered template generation
  const generateTemplateWithAI = async () => {
    if (!workflow.title) {
      setAiStatus(prev => ({ ...prev, error: "Please provide a workflow title first" }));
      return;
    }

    setAiStatus(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const templateResponse = await generateTemplateSuggestions(workflow.title);
      
      // Parse the template response and create a new workflow
      const lines = templateResponse.split('\n').filter(line => line.trim());
      const newSteps: WorkflowStep[] = [];
      
      lines.forEach((line, index) => {
        if (line.match(/^\d+\./)) {
          const title = line.replace(/^\d+\.\s*/, '').trim();
          if (title) {
            newSteps.push({
              id: `template-step-${Date.now()}-${index}`,
              title,
              description: `Template step: ${title}`,
              type: "task",
              duration: 60,
              dependencies: [],
            });
          }
        }
      });

      if (newSteps.length > 0) {
        setWorkflow(prev => ({
          ...prev,
          steps: newSteps, // Replace existing steps with template
        }));
      }
    } catch (error) {
      setAiStatus(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : "Failed to generate template" 
      }));
    } finally {
      setAiStatus(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const selectedStepData = selectedStep
    ? workflow.steps.find((step) => step.id === selectedStep)
    : null;

  return (
    <PermanentDashboard>
      <div className="flex h-full bg-background">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <Input
                className="text-xl font-semibold border-none bg-transparent w-80"
                value={workflow.title}
                onChange={(e) =>
                  setWorkflow({ ...workflow, title: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                {showSuggestions ? "Hide" : "Show"} Suggestions
              </Button>
              {workflow.steps.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowUploadForm(true)}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload as Template
                </Button>
              )}
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Workflow
              </Button>
            </div>
          </div>

          {/* AI Status and Error Display */}
          {aiStatus.error && (
            <Alert className="mx-4 mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{aiStatus.error}</AlertDescription>
            </Alert>
          )}

          {/* AI Features Bar */}
          <div className="px-4 py-2 border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Features
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={generateAISteps}
                disabled={aiStatus.isGenerating || aiLoading}
              >
                {aiStatus.isGenerating ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <PlusCircle className="h-3 w-3 mr-1" />
                )}
                Generate Steps
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={optimizeWorkflowWithAI}
                disabled={aiStatus.isGenerating || aiLoading || workflow.steps.length === 0}
              >
                {aiStatus.isGenerating ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Brain className="h-3 w-3 mr-1" />
                )}
                Optimize
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={analyzeCostsWithAI}
                disabled={aiStatus.isGenerating || aiLoading || workflow.steps.length === 0}
              >
                {aiStatus.isGenerating ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Calculator className="h-3 w-3 mr-1" />
                )}
                Cost Analysis
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={generateTemplateWithAI}
                disabled={aiStatus.isGenerating || aiLoading}
              >
                {aiStatus.isGenerating ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3 mr-1" />
                )}
                Generate Template
              </Button>
            </div>
          </div>

          {/* Cost Analysis Display */}
          {aiStatus.costAnalysis && (
            <div className="mx-4 mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <Calculator className="h-4 w-4 mr-1" />
                AI Cost Analysis
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                {aiStatus.costAnalysis}
              </p>
            </div>
          )}

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="border-b px-4">
              <TabsList>
                <TabsTrigger value="canvas">Canvas</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="canvas" className="h-full flex">
                <div className="flex-1 p-4 overflow-auto">
                  {/* Template Selection */}
                  {workflow.steps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <h2 className="text-2xl font-semibold mb-6">
                        Start Building Your Workflow
                      </h2>
                      
                      {/* AI Template Generation */}
                      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md">
                        <h3 className="font-medium mb-2 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2" />
                          AI-Powered Template
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Let AI generate a custom template based on your workflow title
                        </p>
                        <Button
                          onClick={generateTemplateWithAI}
                          disabled={aiStatus.isGenerating || aiLoading || !workflow.title}
                          className="w-full"
                        >
                          {aiStatus.isGenerating ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4 mr-2" />
                          )}
                          Generate AI Template
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 max-w-2xl">
                        {templates.map((template) => (
                          <Card
                            key={template.id}
                            className="cursor-pointer hover:border-primary transition-colors"
                            onClick={() => addStep()}
                          >
                            <CardContent className="p-6 flex flex-col items-center justify-center">
                              <h3 className="font-medium text-lg">
                                {template.name}
                              </h3>
                              <p className="text-muted-foreground text-sm mt-2">
                                Start with a {template.name.toLowerCase()}{" "}
                                template
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* Workflow Canvas */}
                      <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                          Workflow Steps
                        </h2>
                        <div className="flex gap-2">
                          <Button onClick={generateAISteps} size="sm" variant="outline">
                            {aiStatus.isGenerating ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4 mr-2" />
                            )}
                            AI Generate
                          </Button>
                          <Button onClick={addStep} size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Step
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workflow.steps.map((step) => (
                          <Card
                            key={step.id}
                            className={`cursor-pointer ${selectedStep === step.id ? "border-primary" : ""}`}
                            onClick={() => setSelectedStep(step.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{step.title}</h3>
                                  <p className="text-xs text-muted-foreground">
                                    {step.type}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteStep(step.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <MoveHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm mt-2 line-clamp-2">
                                {step.description}
                              </p>
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Progress</span>
                                  <span>{step.progress}%</span>
                                </div>
                                <Progress value={step.progress} className="h-2" />
                              </div>
                              {step.dependencies.length > 0 && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  Dependencies: {step.dependencies.length}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step Configuration Panel */}
                {selectedStep && (
                  <div className="w-80 border-l p-4 overflow-y-auto">
                    <h3 className="font-semibold mb-4">Step Configuration</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={selectedStepData?.title || ""}
                          onChange={(e) =>
                            updateStep(selectedStep, { title: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <Select
                          value={selectedStepData?.type || "task"}
                          onValueChange={(value) =>
                            updateStep(selectedStep, { type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {stepTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Description
                        </label>
                        <Textarea
                          value={selectedStepData?.description || ""}
                          onChange={(e) =>
                            updateStep(selectedStep, {
                              description: e.target.value,
                            })
                          }
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Progress</label>
                        <div className="mt-2 flex items-center gap-3">
                          <Slider
                            value={[selectedStepData?.progress ?? 0]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) =>
                              updateStep(selectedStep, { progress: value[0] })
                            }
                            className="w-48"
                          />
                          <span className="text-sm w-10 text-right">
                            {selectedStepData?.progress ?? 0}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Duration (minutes)
                        </label>
                        <Input
                          type="number"
                          value={selectedStepData?.duration || 0}
                          onChange={(e) =>
                            updateStep(selectedStep, {
                              duration: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Dependencies
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Add dependency" />
                          </SelectTrigger>
                          <SelectContent>
                            {workflow.steps
                              .filter((step) => step.id !== selectedStep)
                              .map((step) => (
                                <SelectItem key={step.id} value={step.id}>
                                  {step.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        {selectedStepData?.dependencies &&
                        selectedStepData.dependencies.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {selectedStepData.dependencies.map((depId) => {
                              const dep = workflow.steps.find(
                                (s) => s.id === depId,
                              );
                              return (
                                <div
                                  key={depId}
                                  className="flex justify-between items-center text-sm p-2 bg-muted rounded-md"
                                >
                                  <span>{dep?.title || "Unknown step"}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-2">
                            No dependencies set
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="h-full">
                <div className="p-4 h-full">
                  <VisualProgressTracker
                    workflowId={workflow.id}
                    steps={workflow.steps.map((step) => ({
                      id: step.id,
                      title: step.title,
                      status: (step.progress >= 100
                        ? "completed"
                        : step.progress > 0
                          ? "in-progress"
                          : "pending") as const,
                      progress: step.progress,
                      dependencies: step.dependencies,
                      resources: [],
                      dueDate: new Date(Date.now() + step.duration * 60000)
                        .toISOString()
                        .split("T")[0],
                    }))}
                    onUpdateStep={(id, updates) => updateStep(id, updates)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="h-full">
                <div className="p-4 max-w-2xl mx-auto">
                  <h2 className="text-xl font-semibold mb-4">
                    Workflow Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium">
                        Workflow Title
                      </label>
                      <Input
                        value={workflow.title}
                        onChange={(e) =>
                          setWorkflow({ ...workflow, title: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={workflow.description}
                        onChange={(e) =>
                          setWorkflow({
                            ...workflow,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Advanced Settings
                      </h3>
                      <Card>
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            <span>Workflow Permissions</span>
                            <ChevronRight className="h-4 w-4 ml-auto" />
                          </div>
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            <span>Notification Settings</span>
                            <ChevronRight className="h-4 w-4 ml-auto" />
                          </div>
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            <span>Integration Options</span>
                            <ChevronRight className="h-4 w-4 ml-auto" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Smart Suggestion Panel */}
        {showSuggestions && (
          <div className="w-80 border-l overflow-y-auto">
            <SmartSuggestionPanel
              workflowId={workflow.id}
              currentSteps={workflow.steps}
              workflowTitle={workflow.title}
              workflowDescription={workflow.description}
              onApplySuggestion={(suggestion) => {
                // Handle applying suggestion
                console.log("Applying suggestion:", suggestion);
                
                // If it's a step suggestion, add it as a new step
                if (suggestion.type === "step") {
                  const newStep: WorkflowStep = {
                    id: `suggestion-${Date.now()}`,
                    title: suggestion.title,
                    description: suggestion.description,
                    type: "task",
                    duration: 60,
                        dependencies: [],
                        progress: 0,
                  };
                  
                  setWorkflow(prev => ({
                    ...prev,
                    steps: [...prev.steps, newStep],
                  }));
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Template Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <TemplateUploadForm
              workflow={{
                title: workflow.title,
                description: workflow.description,
                steps: workflow.steps,
              }}
              onSuccess={handleUploadSuccess}
              onCancel={handleUploadCancel}
            />
          </div>
        </div>
      )}
    </PermanentDashboard>
  );
};

export default WorkflowBuilder;
